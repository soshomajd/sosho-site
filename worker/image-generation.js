import { ArvanObjectStorage } from "./arvan-storage.js";
import { ServiceError, getIntegerEnv } from "./core.js";
import {
  DEFAULT_WORKERS_AI_IMAGE_MODEL,
  WorkersAiImageProvider,
} from "./workers-ai-image-provider.js";

export const DEFAULT_IMAGE_AI_PROVIDER = "workers_ai";
export const DEFAULT_IMAGE_MAX_BYTES = 5_000_000;
export const MAIN_IMAGE_MEDIA_TYPE = "main_image";

function compactText(value, maxLength) {
  return String(value || "").replace(/\s+/gu, " ").trim().slice(0, maxLength);
}

export function buildCampaignImagePrompt(campaign, bundle) {
  const prompt = `Create one original, polished editorial technology image for SoSho Studio.
Campaign topic: ${compactText(campaign.topic, 300)}
Target audience: ${compactText(campaign.targetAudience ?? campaign.target_audience, 240)}
Main hook concept: ${compactText(bundle.mainHook, 320)}
Visual direction: ${compactText(bundle.visualDirection, 420)}
Show a premium, modern visual metaphor for professional website design and AI automation, suitable for Iranian business decision-makers without stereotypes. Use refined dark navy, warm amber, soft cyan accents, clean depth, subtle interface-inspired geometry, and realistic professional lighting. Keep the composition adaptable for a Reel cover, Story, and Carousel background, with generous uncluttered negative space, especially in the upper-right area, for later RTL text placement.
Do not render any text, letters, numbers, typography, captions, UI copy, logos, brand marks, watermarks, prices, statistics, client identities, portfolio examples, badges, or guarantees.`;
  return prompt.slice(0, 2048);
}

function detectMimeType(bytes) {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff &&
    bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9
  ) return "image/jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return "image/png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return "image/webp";
  return null;
}

export function validateAndDecodeBase64Image(value, maxBytes = DEFAULT_IMAGE_MAX_BYTES) {
  if (typeof value !== "string") {
    throw new ServiceError("invalid_image_output", { status: 502 });
  }
  const base64 = value.trim();
  const maxEncodedLength = Math.ceil(maxBytes / 3) * 4 + 4;
  if (
    base64.length < 4 || base64.length > maxEncodedLength || base64.length % 4 !== 0 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)
  ) {
    throw new ServiceError(
      base64.length > maxEncodedLength ? "image_too_large" : "invalid_image_output",
      { status: 502 }
    );
  }
  let binary;
  try {
    binary = atob(base64);
  } catch {
    throw new ServiceError("invalid_image_output", { status: 502 });
  }
  if (binary.length < 32) {
    throw new ServiceError("invalid_image_output", { status: 502 });
  }
  if (binary.length > maxBytes) {
    throw new ServiceError("image_too_large", { status: 502 });
  }
  const bytes = Uint8Array.from(binary, (character) => character.codePointAt(0));
  const mimeType = detectMimeType(bytes);
  if (!mimeType) throw new ServiceError("invalid_image_output", { status: 502 });
  return { bytes, mimeType, byteSize: bytes.byteLength };
}

export function createMainImageR2Key(campaignId) {
  return `content-campaigns/${campaignId}/main-image`;
}

export class ImageGenerationService {
  constructor(env) {
    this.env = env;
    this.providerName = String(env.IMAGE_AI_PROVIDER || DEFAULT_IMAGE_AI_PROVIDER)
      .trim()
      .toLowerCase();
    this.storage = new ArvanObjectStorage(env);
    this.provider = this.providerName === "workers_ai" ? new WorkersAiImageProvider(env) : null;
  }

  get descriptor() {
    return {
      provider: this.providerName,
      model: this.provider?.model || DEFAULT_WORKERS_AI_IMAGE_MODEL,
    };
  }

  assertConfigured() {
    if (!this.provider) throw new ServiceError("configuration_missing", { status: 503 });
    this.provider.assertConfigured();
    this.storage.assertConfigured();
  }

  async generateAndStore({ campaign, bundle, r2Key, requestId }) {
    this.assertConfigured();
    const prompt = buildCampaignImagePrompt(campaign, bundle);
    const generated = await this.provider.generate(prompt, requestId);
    let image;
    try {
      image = validateAndDecodeBase64Image(
        generated.base64,
        getIntegerEnv(this.env, "IMAGE_MAX_BYTES", DEFAULT_IMAGE_MAX_BYTES, {
          min: 32,
          max: 10_000_000,
        })
      );
    } catch (error) {
      if (error instanceof ServiceError) {
        throw new ServiceError(error.code, { status: 502 });
      }
      throw new ServiceError("invalid_image_output", { status: 502 });
    }
    try {
      await this.storage.putMainImage(r2Key, image, {
        campaignId: campaign.id,
        provider: generated.provider,
        mediaType: MAIN_IMAGE_MEDIA_TYPE,
      });
    } catch (error) {
      if (error instanceof ServiceError && error.code === "configuration_missing") throw error;
      throw new ServiceError("media_storage_failed", { status: 502 });
    }
    return {
      mimeType: image.mimeType,
      byteSize: image.byteSize,
      provider: generated.provider,
      model: generated.model,
    };
  }
}
