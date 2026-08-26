import { resolve } from "node:path";

import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrations = await readD1Migrations(resolve("db/migrations"));
      return {
        main: "./worker/index.js",
        miniflare: {
          compatibilityDate: "2026-08-20",
          d1Databases: { DB: "sosho-sales-test" },
          bindings: {
            TEST_MIGRATIONS: migrations,
            ENVIRONMENT: "test",
            PUBLIC_SITE_ORIGINS: "https://example.com",
            OPENAI_API_KEY: "test-openai-key",
            OPENAI_MODEL: "gpt-5.6-luna",
            META_VERIFY_TOKEN: "test-verify-token",
            META_APP_SECRET: "test-meta-secret",
            META_INSTAGRAM_ACCESS_TOKEN: "test-instagram-token",
            META_GRAPH_VERSION: "v26.0",
            RATE_LIMIT_SALT: "test-rate-limit-salt",
            CHAT_IP_HOURLY_LIMIT: "2",
            CHAT_CONVERSATION_HOURLY_LIMIT: "2",
            INSTAGRAM_USER_HOURLY_LIMIT: "2",
            OPENAI_HOURLY_LIMIT: "1000",
            OPENAI_DAILY_LIMIT: "1000",
            OPENAI_MAX_ATTEMPTS: "2",
            META_MAX_ATTEMPTS: "2",
            RETRY_BASE_DELAY_MS: "1",
            WEBHOOK_MAX_ATTEMPTS: "4",
            WEBHOOK_RETRY_BASE_SECONDS: "5",
          },
        },
      };
    }),
  ],
  test: {
    setupFiles: ["./tests/setup.js"],
  },
});
