import { AwsClient } from "aws4fetch";

import { ServiceError, getIntegerEnv } from "./core.js";

const DEFAULT_TIMEOUT_MS = 15_000;

function normalizedEndpoint(value) {
  return String(value || "").replace(/\/+$/u, "");
}

// S3-compatible private object storage (ArvanCloud Object Storage) used in place
// of Cloudflare R2, which this account cannot enable. Objects are only ever
// fetched server-side with a signed request; no public or presigned URL is
// generated, preserving the same privacy invariant the R2 adapter had.
export class ArvanObjectStorage {
  constructor(env) {
    this.env = env;
  }

  assertConfigured() {
    if (
      !this.env.ARVAN_S3_ACCESS_KEY ||
      !this.env.ARVAN_S3_SECRET_KEY ||
      !this.env.ARVAN_S3_ENDPOINT ||
      !this.env.ARVAN_S3_BUCKET
    ) {
      throw new ServiceError("configuration_missing", { status: 503 });
    }
  }

  objectUrl(key) {
    return `${normalizedEndpoint(this.env.ARVAN_S3_ENDPOINT)}/${this.env.ARVAN_S3_BUCKET}/${key}`;
  }

  client() {
    return new AwsClient({
      accessKeyId: this.env.ARVAN_S3_ACCESS_KEY,
      secretAccessKey: this.env.ARVAN_S3_SECRET_KEY,
      service: "s3",
      region: "default",
    });
  }

  async signedFetch(url, init) {
    const timeoutMs = getIntegerEnv(this.env, "ARVAN_S3_TIMEOUT_MS", DEFAULT_TIMEOUT_MS, {
      min: 1000,
      max: 60_000,
    });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const signedRequest = await this.client().sign(url, init);
      return await fetch(signedRequest, { signal: controller.signal });
    } catch {
      if (controller.signal.aborted) {
        throw new ServiceError("media_storage_timeout", { status: 502 });
      }
      throw new ServiceError("media_storage_network_error", { status: 502 });
    } finally {
      clearTimeout(timer);
    }
  }

  async putMainImage(key, image, metadata) {
    this.assertConfigured();
    const response = await this.signedFetch(this.objectUrl(key), {
      method: "PUT",
      body: image.bytes,
      headers: {
        "content-type": image.mimeType,
        "content-length": String(image.byteSize),
        "cache-control": "private, no-store",
        "content-disposition": "inline",
        "x-amz-acl": "private",
        "x-amz-meta-campaign-id": String(metadata.campaignId),
        "x-amz-meta-media-type": String(metadata.mediaType),
        "x-amz-meta-provider": String(metadata.provider),
      },
    });
    if (!response.ok) throw new ServiceError("media_storage_failed", { status: 502 });
    return { key };
  }

  async getPrivateObject(key) {
    this.assertConfigured();
    const response = await this.signedFetch(this.objectUrl(key), { method: "GET" });
    if (response.status === 404) return null;
    if (!response.ok) throw new ServiceError("media_storage_failed", { status: 502 });
    return response;
  }
}
