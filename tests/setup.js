import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { afterAll, afterEach, beforeAll } from "vitest";

import { network } from "./network.js";

beforeAll(async () => {
  await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  network.enable();
});

afterEach(() => network.resetHandlers());
afterAll(() => network.disable());
