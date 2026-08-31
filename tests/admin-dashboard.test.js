import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import worker from "../worker/index.js";

const timestamp = "2026-08-31T10:00:00.000Z";

async function api(path, { method = "GET", body, token = "test-admin-token", cookie, runtimeEnv = env } = {}) {
  const headers = { accept: "application/json", origin: "https://example.com" };
  if (token !== null) headers.authorization = `Bearer ${token}`;
  if (cookie) headers.cookie = cookie;
  if (body !== undefined) headers["content-type"] = "application/json";
  return worker.fetch(new Request(`https://example.com${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }), runtimeEnv, createExecutionContext());
}

async function insertLead({
  id,
  source = "website",
  status = "discovery",
  projectType = null,
  budget = null,
  requirements = {},
  instagramUserId = null,
  updatedAt = timestamp,
}) {
  await env.DB.prepare(
    `INSERT INTO leads (
      id, source, locale, instagram_user_id, status, project_type, budget,
      requirements_json, created_at, updated_at
    ) VALUES (?, ?, 'fa', ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    source,
    instagramUserId,
    status,
    projectType,
    budget,
    JSON.stringify(requirements),
    timestamp,
    updatedAt
  ).run();
}

async function insertCampaign({ id, status = "draft", approvalStatus = "pending", topic = "موضوع" }) {
  await env.DB.prepare(
    `INSERT INTO content_campaigns (
      id, topic, target_audience, goal, language, status, created_at, updated_at,
      approval_status
    ) VALUES (?, ?, 'مدیران کسب‌وکار', 'آگاهی از خدمات', 'fa', ?, ?, ?, ?)`
  ).bind(id, topic, status, timestamp, timestamp, approvalStatus).run();
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM content_media"),
    env.DB.prepare("DELETE FROM content_items"),
    env.DB.prepare("DELETE FROM content_campaigns"),
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("admin dashboard authentication", () => {
  it("prevents unauthorized dashboard access", async () => {
    const response = await api("/api/admin/overview", { token: null });
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
  });

  it("exchanges the admin token for an opaque secure session cookie", async () => {
    const response = await api("/api/admin/session", {
      method: "POST",
      token: null,
      body: { token: "test-admin-token" },
    });
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("sosho_admin_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    expect(setCookie).toContain("Secure");
    expect(setCookie).not.toContain("test-admin-token");
    expect(JSON.stringify(await response.json())).not.toContain("test-admin-token");

    const cookie = setCookie.split(";")[0];
    const authenticated = await api("/api/admin/overview", { token: null, cookie });
    expect(authenticated.status).toBe(200);
  });

  it("strictly validates login input", async () => {
    const response = await api("/api/admin/session", {
      method: "POST",
      token: null,
      body: { token: "test-admin-token", remember: true },
    });
    expect(response.status).toBe(400);
  });
});

describe("admin overview and campaign reads", () => {
  it("returns real overview counts and recent activities", async () => {
    await insertCampaign({ id: "campaign_draft", status: "draft" });
    await insertCampaign({ id: "campaign_generated", status: "generated", approvalStatus: "approved" });
    await insertCampaign({ id: "campaign_failed", status: "failed", approvalStatus: "rejected" });
    await insertLead({ id: "lead_active" });
    await insertLead({ id: "lead_handoff", status: "handoff" });
    await env.DB.prepare(
      "INSERT INTO conversations (id, lead_id, channel, status, created_at, updated_at) VALUES ('conv_admin_1', 'lead_active', 'website', 'active', ?, ?)"
    ).bind(timestamp, timestamp).run();

    const response = await api("/api/admin/overview");
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.campaigns).toEqual({
      total: 3,
      draft: 1,
      generating: 0,
      generated: 1,
      approved: 1,
      rejected: 1,
      failed: 1,
    });
    expect(payload.leads).toBe(2);
    expect(payload.activeConversations).toBe(1);
    expect(payload.humanHandoffs).toBe(1);
    expect(payload.recentActivities.length).toBeGreaterThan(0);
  });

  it("returns a complete empty state without fabricated data", async () => {
    const response = await api("/api/admin/overview");
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      campaigns: { total: 0, draft: 0, generating: 0, generated: 0, approved: 0, rejected: 0, failed: 0 },
      leads: 0,
      activeConversations: 0,
      humanHandoffs: 0,
      recentActivities: [],
    });
  });

  it("paginates and filters campaign statuses with bounded queries", async () => {
    await insertCampaign({ id: "campaign_a", status: "draft", topic: "الف" });
    await insertCampaign({ id: "campaign_b", status: "draft", topic: "ب" });
    await insertCampaign({ id: "campaign_c", status: "generated", approvalStatus: "approved" });

    const response = await api("/api/admin/campaigns?status=draft&page=2&limit=1");
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].status).toBe("draft");
    expect(payload.pagination).toMatchObject({ page: 2, pageSize: 1, total: 2, totalPages: 2 });

    expect((await api("/api/admin/campaigns?limit=51")).status).toBe(400);
    expect((await api("/api/admin/campaigns?unknown=true")).status).toBe(400);
  });

  it("reports the R2 activation blocker without failing campaign reads", async () => {
    await insertCampaign({ id: "campaign_r2", status: "generated", approvalStatus: "approved" });
    const response = await api("/api/admin/campaigns", {
      runtimeEnv: { ...env, MEDIA: undefined },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      mediaCapability: "activation_required",
      items: [{ id: "campaign_r2", media: null }],
    });
  });
});

describe("safe lead and conversation reads", () => {
  it("does not expose full contact data in lead responses", async () => {
    await insertLead({
      id: "lead_private_12345678",
      source: "instagram",
      status: "qualification",
      projectType: "corporate",
      budget: "professional",
      instagramUserId: "sensitive-instagram-id",
      requirements: {
        contactName: "نام مدیر",
        phone: "+98 912 123 4567",
        email: "private@example.com",
      },
    });
    const response = await api("/api/admin/leads?source=instagram&status=qualification");
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("نام مدیر");
    expect(text).not.toContain("+98 912 123 4567");
    expect(text).not.toContain("private@example.com");
    expect(text).not.toContain("sensitive-instagram-id");
    expect(text).not.toContain("requirements");
  });

  it("returns conversation AI and handoff state with redacted details", async () => {
    await insertLead({ id: "lead_handoff", status: "handoff" });
    await env.DB.prepare(
      "INSERT INTO conversations (id, lead_id, channel, status, created_at, updated_at) VALUES ('conv_admin_detail', 'lead_handoff', 'website', 'active', ?, ?)"
    ).bind(timestamp, timestamp).run();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO messages (id, conversation_id, role, content, metadata_json, created_at) VALUES ('msg_1', 'conv_admin_detail', 'user', ?, '{}', ?)"
      ).bind("شماره من +98 912 123 4567 و ایمیل private@example.com است", timestamp),
      env.DB.prepare(
        "INSERT INTO messages (id, conversation_id, role, content, metadata_json, created_at) VALUES ('msg_2', 'conv_admin_detail', 'assistant', 'پیام دریافت شد', ?, ?)"
      ).bind(JSON.stringify({ stage: "handoff", phone: "should-not-pass" }), "2026-08-31T10:01:00.000Z"),
    ]);

    const list = await api("/api/admin/conversations?handoff=true&limit=10&page=1");
    expect(list.status).toBe(200);
    expect(await list.json()).toMatchObject({
      items: [{
        id: "conv_admin_detail",
        humanHandoff: true,
        aiStatus: "responded",
        messageCount: 2,
      }],
    });

    const detail = await api("/api/admin/conversations/conv_admin_detail");
    expect(detail.status).toBe(200);
    const text = await detail.text();
    expect(text).toContain("[contact hidden]");
    expect(text).toContain("[email hidden]");
    expect(text).not.toContain("+98 912 123 4567");
    expect(text).not.toContain("private@example.com");
    expect(text).not.toContain("should-not-pass");
  });
});
