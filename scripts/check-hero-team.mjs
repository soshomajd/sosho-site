#!/usr/bin/env node
/**
 * Verify the exported homepage without a development server or live services.
 * Run from the repository root after `npm run build`:
 *   node scripts/check-hero-team.mjs
 * Optional: HERO_TEAM_ARTIFACT_DIR, HERO_TEAM_CASE (name regex),
 * PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH.
 */
import assert from "node:assert/strict";
import { createReadStream } from "node:fs";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
assert.equal(path.resolve(process.cwd()).toLowerCase(), repository.toLowerCase(), "Run this script from the repository root.");
const assets = path.join(repository, "dist/client");
const output = path.resolve(repository, process.env.HERO_TEAM_ARTIFACT_DIR || ".playwright-mcp/hero-team-eyes-20261031");
const members = ["soheil", "claude", "codex"];
const names = { soheil: /Soheil|سهیل/i, claude: /Claude|کلود/i, codex: /Codex|کدکس/i };
const casePattern = process.env.HERO_TEAM_CASE ? new RegExp(process.env.HERO_TEAM_CASE) : null;
const report = { startedAt: new Date().toISOString(), scope: casePattern?.source || "all", checks: [], blockedExternalOrigins: [], imageFailures: [], pageErrors: [] };
const externalOrigins = new Set();
const mime = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon", ".woff": "font/woff",
  ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf", ".webmanifest": "application/manifest+json",
};

for (const locale of ["fa", "en"]) {
  const candidates = [path.join(assets, `${locale}.html`), path.join(assets, locale, "index.html")];
  const file = await firstFile(candidates);
  assert(file, `Missing exported /${locale}; run npm run build first.`);
  const html = await readFile(file, "utf8");
  for (const member of members) assert(html.includes(`team-${member}`), `Exported /${locale} has no team-${member}; rebuild the current source.`);
}
await mkdir(output, { recursive: true });

async function firstFile(candidates) {
  for (const candidate of candidates) {
    try { if ((await stat(candidate)).isFile()) return candidate; } catch { /* Try the export fallback. */ }
  }
  return null;
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    // Deliberately exercise the UI's unavailable-service state; never contact a Worker.
    if (pathname.startsWith("/api/")) {
      response.writeHead(pathname === "/api/sales/status" ? 200 : 503, { "content-type": "application/json" });
      response.end(JSON.stringify({ available: false, error: "local_verification_only" }));
      return;
    }
    const candidate = path.resolve(assets, `.${pathname}`);
    if (candidate !== assets && !candidate.startsWith(`${assets}${path.sep}`)) {
      response.writeHead(400); response.end(); return;
    }
    const file = await firstFile([candidate, `${candidate}.html`, path.join(candidate, "index.html")]);
    if (!file) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(500); response.end("Static verification server error");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
let failures = 0;

async function run(name, options, action) {
  if (casePattern && !casePattern.test(name)) return;
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin || ["data:", "blob:"].includes(url.protocol)) await route.continue();
    else { externalOrigins.add(url.origin); await route.abort("blockedbyclient"); }
  });
  const page = await context.newPage();
  const errors = [];
  const badImages = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.request().resourceType() === "image" && response.status() >= 400) badImages.push({ url: response.url(), status: response.status() });
  });
  try {
    const details = await action(page, context);
    assert.deepEqual(errors, [], "Browser page errors");
    assert.deepEqual(badImages, [], "Image HTTP failures");
    report.checks.push({ name, passed: true, ...details });
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    report.checks.push({ name, passed: false, error: error.stack || String(error) });
    await page.screenshot({ path: path.join(output, `${name}-failure.png`), fullPage: false }).catch(() => {});
    console.error(`FAIL ${name}: ${error.message}`);
  } finally {
    report.pageErrors.push(...errors.map((message) => ({ name, message })));
    report.imageFailures.push(...badImages.map((image) => ({ name, ...image })));
    await context.close();
  }
}

async function open(page, locale, enhanced = true) {
  const response = await page.goto(`${origin}/${locale}`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await page.locator(".sh-team").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  if (enhanced) await page.waitForFunction(() => document.querySelector(".sh-team")?.hasAttribute("data-enhanced"));
  assert.equal(await page.locator("label[data-team-step]:visible").count(), enhanced ? 0 : 2, "Native arrow labels must give way to the enhanced buttons");
  assert.equal(await page.locator("button[data-team-step]:visible").count(), enhanced ? 2 : 0, "Show exactly one pair of usable arrows");
  assert.equal(await page.locator("html").getAttribute("dir"), locale === "fa" ? "rtl" : "ltr");
  assert.match(await page.locator("html").getAttribute("lang"), new RegExp(`^${locale}`));
  assert.equal(await page.locator("#studio-hero h1").count(), 1);
  assert.equal(await page.locator('input[type="radio"][name="studio-team"]').count(), 3);
  assert.equal(await page.locator("[data-eye-pupil]").count(), 6, "All three pairs of pupils must be server-rendered");
  const ids = await page.locator(".sh-eye-layer [id]").evaluateAll((elements) => elements.map((element) => element.id));
  assert.equal(new Set(ids).size, ids.length, "Member eye gradients and masks must have unique IDs");
  await assertMember(page, 0);
}

async function selected(page) {
  return members.indexOf((await page.locator('input[name="studio-team"]:checked').getAttribute("id")).replace("team-", ""));
}

async function eventually(check, message) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (await check()) return;
    // Node polls deliberately: a no-JavaScript page can suspend page-side RAF
    // polling while native radio controls and CSS transitions still work.
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  assert.fail(message);
}

async function assertMember(page, index) {
  await eventually(() => page.locator(`#team-${members[index]}`).isChecked(), `Member ${members[index]} was not selected`);
  // A finished Web Animation can precede its queued onfinish cleanup event.
  // Wait for that cleanup too before asserting the single visible slide.
  await eventually(() => page.locator(".sh-team-slide").evaluateAll((elements) => elements.every((element) => !element.hasAttribute("data-leaving") && !element.getAnimations({ subtree: true }).some((animation) => animation.playState === "running"))), "The member transition did not settle");
  const visible = page.locator(".sh-team-slide:visible");
  assert.equal(await visible.count(), 1, "Exactly one portrait and caption must be visible");
  const name = await visible.locator(".sh-team-name").innerText();
  assert.match(name, names[members[index]], "Caption must match the selected portrait");
  const role = await visible.locator(".sh-team-role").innerText();
  const bio = await visible.locator(".sh-team-bio").innerText();
  const kind = await visible.locator(".sh-team-kind").innerText();
  assert(role.trim() && bio.trim() && kind.trim(), "Each member needs a visible role, bio and identity label");
  const isFa = (await page.locator("html").getAttribute("lang")).startsWith("fa");
  assert.match(`${role} ${bio} ${kind}`, isFa ? /[\u0600-\u06ff]/ : /[A-Za-z]/, "Member copy must use the current language");
  if (!isFa) assert(!/[\u0600-\u06ff]/.test(`${role} ${bio} ${kind}`), "English member copy must remain in English");
  if (index === 0) {
    assert.match(role, /Tech Lead|مدیر فنی|رهبر فنی|راهبر فنی|سرپرست فنی/i);
    assert.match(role, /Founder|بنیان.?گذار|مؤسس|موسس/i);
    assert.match(await visible.locator("img.sh-character").getAttribute("src"), /soheil-character-3d\.webp/);
  } else {
    assert.match(`${kind} ${role}`, /\bAI\b|هوش مصنوعی/i, "AI identity must be explicit");
    assert.match(role, index === 1 ? /Backend|بک.?اند|بک.?اِند/i : /Frontend|فرانت.?اند|فرانت.?اِند/i);
    assert.match(role, index === 1 ? /DevOps|دواپس|دوآپس|عملیات|زیرساخت/i : /Designer|طراح/i);
  }
  assert.equal(await visible.locator(".sh-eye-layer").count(), 1, "Every member needs its own eye layer");
  assert.equal(await visible.locator("[data-eye-pupil]").count(), 2, "Every member needs two movable pupils");
  assert.equal(await visible.locator(".sh-eye-layer").getAttribute("viewBox"), "0 0 1000 1000", "Eyes must share the portrait coordinate plane");
  const image = visible.locator("img.sh-character");
  assert.match(await image.getAttribute("src"), new RegExp(members[index], "i"), "The image source must belong to the selected member");
  await image.evaluate(async (element) => { await element.decode(); });
  assert(await image.evaluate((element) => element.naturalWidth > 0 && element.naturalHeight > 0), "Portrait must decode");
  assert((await image.getAttribute("alt"))?.trim(), "Portrait needs a localized alternative");
  return { member: members[index], name, role, bio, kind };
}

async function clickStep(page, step, enhanced = true, inspectTransition) {
  const previous = await selected(page);
  const control = page.locator(`${enhanced ? "button" : "label"}[data-team-step="${step}"]:visible`);
  assert.equal(await control.count(), 1, "One visible control per navigation direction");
  await control.scrollIntoViewIfNeeded();
  const beforeScroll = await page.evaluate(() => scrollY);
  await control.click();
  if (inspectTransition) await inspectTransition();
  const next = (previous + step + members.length) % members.length;
  await assertMember(page, next);
  if (!enhanced) {
    const immediateScroll = await page.evaluate(() => scrollY);
    // Native label focus can start CSS smooth scrolling. Check its settled
    // position as well so an early sample cannot conceal a later viewport jump.
    await page.waitForTimeout(650);
    const afterScroll = await page.evaluate(() => scrollY);
    assert(Math.max(Math.abs(immediateScroll - beforeScroll), Math.abs(afterScroll - beforeScroll)) <= 3, `Native arrow focus jumps the viewport (${beforeScroll} -> ${immediateScroll} -> ${afterScroll})`);
  }
  return next;
}

async function transitionOverflow(page) {
  const samples = await page.evaluate(async (configuredViewport) => {
    const result = [];
    for (let frame = 0; frame < 22; frame += 1) {
      result.push({ width: document.documentElement.scrollWidth, viewport: configuredViewport, innerWidth });
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return result;
  }, page.viewportSize().width);
  assert(samples.every((sample) => sample.width <= sample.viewport + 1), `A moving slide causes transient horizontal overflow (${Math.max(...samples.map((sample) => sample.width))}/${page.viewportSize().width})`);
  return samples;
}

async function switchLocale(page, locale) {
  await page.locator("header").getByRole("link", { name: locale === "fa" ? "Switch to Persian" : "Switch to English" }).click();
  await page.waitForURL(`${origin}/${locale}`);
  await page.waitForFunction((direction) => document.documentElement.dir === direction && document.querySelector(".sh-team")?.hasAttribute("data-enhanced"), locale === "fa" ? "rtl" : "ltr");
  const previous = page.getByRole("button", { name: locale === "fa" ? "عضو قبلی" : "Previous team member", exact: true });
  await previous.waitFor({ state: "visible" });
  const current = await selected(page);
  await assertMember(page, current);
  await page.locator(`#team-${members[current]}`).focus();
  await page.keyboard.press("ArrowRight");
  await assertMember(page, (current + (locale === "fa" ? -1 : 1) + members.length) % members.length);
}

async function keyboardReachRadio(page) {
  await page.locator(".sh-cta").focus();
  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press("Shift+Tab");
    if (await page.evaluate(() => document.activeElement?.matches(".sh-team-radio"))) return;
  }
  assert.fail("The selected native radio must be reachable through the normal keyboard tab order");
}

async function layout(page) {
  const actual = await page.locator(".sh-team").evaluate((team) => {
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y + window.scrollY, width: box.width, height: box.height };
    };
    const slide = [...team.querySelectorAll(".sh-team-slide")].find((element) => getComputedStyle(element).display !== "none");
    const caption = slide.querySelector("figcaption");
    const controls = [...team.querySelectorAll('[data-team-step], .sh-team-dot')].filter((element) => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
    return {
      wordmark: rect(document.querySelector(".sh-wordmark")),
      team: rect(team), portrait: rect(slide.querySelector(".sh-portrait")), character: rect(slide.querySelector(".sh-character")), caption: rect(caption),
      controls: controls.map((element) => ({ ...rect(element), label: element.getAttribute("aria-label") || element.getAttribute("title") || element.textContent.trim() })),
      viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
    };
  });
  return { ...actual, configuredViewport: page.viewportSize().width };
}

function assertLayout(actual, baseline) {
  assert(Math.abs(actual.viewport - actual.configuredViewport) <= 1, `Mobile viewport expanded: ${actual.viewport}/${actual.configuredViewport}`);
  assert(actual.documentWidth <= actual.configuredViewport + 1, `Horizontal overflow: ${actual.documentWidth}/${actual.configuredViewport}`);
  for (const key of ["wordmark", "team", "portrait", "character", "caption"]) {
    const box = actual[key];
    assert(box.x >= -1 && box.x + box.width <= actual.viewport + 1, `${key} must fit the viewport`);
    if (baseline) for (const property of ["x", "y", "width", "height"]) {
      assert(Math.abs(box[property] - baseline[key][property]) <= 3, `${key}.${property} changed between members (${baseline[key][property]} -> ${box[property]})`);
    }
  }
  const wordmarkBottom = actual.wordmark.y + actual.wordmark.height;
  assert(actual.portrait.y >= wordmarkBottom + 19, `Portrait must stay at least 20px below SOSHO STUDIO (${(actual.portrait.y - wordmarkBottom).toFixed(2)}px gap)`);
  assert(actual.character.y >= wordmarkBottom + 19, "The full portrait image must not overlap SOSHO STUDIO");
  assert(Math.abs(actual.portrait.width - actual.portrait.height) <= 1, "Eye alignment requires a square image plane");
  assert.equal(actual.controls.length, 5, "Show two arrows and three member selectors without duplicate targets");
  for (const control of actual.controls) {
    assert(control.width >= 43.5 && control.height >= 43.5, `Control target is smaller than 44px (${control.width}x${control.height})`);
    assert(control.label, "Navigation controls need accessible labels");
  }
}

async function viewportDiagnostics(page) {
  const viewport = page.viewportSize().width;
  return page.evaluate((configuredViewport) => {
    const overflowing = [];
    for (const element of document.querySelectorAll("body *")) {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (!box.width || !box.height || style.visibility === "hidden") continue;
      let left = box.left;
      let right = box.right;
      // Ribbon rows deliberately clip a much wider track. Preserve the existing
      // global body clip in the page, but inspect the layout that produced it.
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
        if (/^(hidden|clip|auto|scroll)$/.test(getComputedStyle(ancestor).overflowX)) {
          const clip = ancestor.getBoundingClientRect();
          left = Math.max(left, clip.left);
          right = Math.min(right, clip.right);
        }
      }
      if (right <= left || (left >= -1 && right <= configuredViewport + 1)) continue;
      overflowing.push({
        element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${typeof element.className === "string" && element.className ? `.${element.className.trim().split(/\s+/).slice(0, 3).join(".")}` : ""}`,
        left, right, width: box.width, display: style.display, minWidth: style.minWidth,
        flexShrink: style.flexShrink, whiteSpace: style.whiteSpace,
        gridColumns: style.gridTemplateColumns, text: element.textContent.trim().slice(0, 70),
      });
    }
    return {
      configuredViewport, innerWidth, documentWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth, bodyWidth: document.body.getBoundingClientRect().width,
      scrollX, visualViewport: visualViewport ? { width: visualViewport.width, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, pageLeft: visualViewport.pageLeft } : null,
      overflowing: overflowing.slice(0, 50),
    };
  }, viewport);
}

async function screenshot(page, name) {
  // Capture the actual initial viewport; locator screenshots can scroll the hero
  // underneath the sticky header and hide the eyebrow artificially.
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: path.join(output, `${name}.png`), animations: "disabled", fullPage: false });
}

async function pupils(page, member) {
  return page.locator(`${member ? `[data-team-member="${member}"] ` : ""}[data-eye-pupil]`).evaluateAll((elements) => elements.map((element) => element.getAttribute("transform")));
}

async function assertNeutral(page) {
  await eventually(() => page.locator("[data-eye-pupil]").evaluateAll((eyes) => eyes.every((eye) => !eye.getAttribute("transform") || /^translate\(0(?:\.0+)?,\s*0(?:\.0+)?\)$/.test(eye.getAttribute("transform")))), "All inactive or motion-disabled pupils must be neutral");
}

async function assertActivePupils(page, member) {
  await page.waitForFunction((member) => {
    const neutral = (eye) => !eye.getAttribute("transform") || /^translate\(0(?:\.0+)?,\s*0(?:\.0+)?\)$/.test(eye.getAttribute("transform"));
    return [...document.querySelectorAll("[data-team-member]")].every((slide) => {
      const eyes = [...slide.querySelectorAll("[data-eye-pupil]")];
      return slide.dataset.teamMember === member ? eyes.length === 2 && eyes.every((eye) => !neutral(eye)) : eyes.every(neutral);
    });
  }, member);
}

async function portraitPosition(portrait) {
  return portrait.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const image = element.querySelector(".sh-character");
    return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height, transform: getComputedStyle(element).transform, imageTransform: getComputedStyle(image).transform };
  });
}

async function assertMemberPointer(page, index) {
  const member = members[index];
  await page.locator(`label.sh-team-dot[for="team-${member}"]`).click();
  await assertMember(page, index);
  await assertNeutral(page);
  await page.locator(".sh-team-visual:visible").scrollIntoViewIfNeeded();
  const portrait = page.locator(`[data-team-member="${member}"] .sh-portrait`);
  const original = await portraitPosition(portrait);
  await page.mouse.move(20, 220);
  await assertActivePupils(page, member);
  const left = await pupils(page, member);
  await page.mouse.move(1420, 720);
  await assertActivePupils(page, member);
  await eventually(async () => JSON.stringify(await pupils(page, member)) !== JSON.stringify(left), `${member} pupils must follow the fine pointer`);
  assert.deepEqual(await portraitPosition(portrait), original, `${member} head must remain fixed while pupils move`);
  await page.evaluate(() => scrollBy({ top: 64, behavior: "instant" }));
  assert.deepEqual(await portraitPosition(portrait), original, `${member} head must keep its document position during scrolling`);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await assertNeutral(page);
  await page.mouse.move(30, 250);
  await assertActivePupils(page, member);
  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await assertNeutral(page);
  await page.mouse.move(40, 260);
  await assertActivePupils(page, member);
  await clickStep(page, 1);
  await assertNeutral(page);
  await page.locator(`label.sh-team-dot[for="team-${member}"]`).click();
  await assertMember(page, index);
  await assertNeutral(page);
  await page.mouse.move(50, 270);
  await assertActivePupils(page, member);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await assertNeutral(page);
  return { member, pointerTracking: true, hiddenPupilsNeutral: true, fixedHead: true, resetOnBlurExitChangeHidden: true };
}

async function touchDrag(context, page, from, to) {
  const session = await context.newCDPSession(page);
  try {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: from.x, y: from.y }] });
    for (let index = 1; index <= 8; index += 1) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: from.x + (to.x - from.x) * index / 8, y: from.y + (to.y - from.y) * index / 8 }] });
      await page.waitForTimeout(20);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } finally { await session.detach(); }
}

try {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (executablePath) await access(executablePath);
  browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}) });
  if (casePattern?.source.includes("viewport-diagnostic")) {
    for (const locale of ["fa", "en"]) {
      await run(`${locale}-viewport-diagnostic`, { viewport: { width: 320, height: 900 }, isMobile: true, hasTouch: true, javaScriptEnabled: false }, async (page) => {
        await open(page, locale, false);
        const snapshots = { initial: await viewportDiagnostics(page) };
        const selectors = ["#studio-hero", ".home-content", ".work-ribbon", "header", "footer", ...await page.locator(".home-content > section[id]").evaluateAll((elements) => elements.map((element) => `#${element.id}`))];
        for (const selector of selectors) {
          const target = page.locator(selector);
          if (await target.count() !== 1) continue;
          const original = await target.getAttribute("style");
          try {
            await target.evaluate((element) => element.style.setProperty("display", "none", "important"));
            await page.waitForTimeout(100);
            snapshots[`hide ${selector}`] = await viewportDiagnostics(page);
          } finally {
            await target.evaluate((element, value) => value === null ? element.removeAttribute("style") : element.setAttribute("style", value), original);
            await page.waitForTimeout(100);
          }
        }
        return { locale, snapshots };
      });
    }
  }
  for (const locale of ["fa", "en"]) {
    for (const [width, height] of [[320, 900], [390, 844], [768, 1024], [1024, 768], [1440, 1000], [844, 390]]) {
      // The 320px baseline uses a desktop pointer; the touch case also verifies
      // a real mobile-emulated 320px viewport after its gesture checks.
      const mobile = (width > 320 && width <= 768) || height <= 430;
      await run(`${locale}-${width}x${height}`, { viewport: { width, height }, isMobile: mobile, hasTouch: mobile }, async (page) => {
        await open(page, locale);
        const baseline = await layout(page);
        assertLayout(baseline);
        const captions = [];
        const transitionSamples = [];
        for (let index = 0; index < members.length; index += 1) {
          if (index) await clickStep(page, 1, true, width === 320 ? async () => transitionSamples.push(await transitionOverflow(page)) : undefined);
          captions.push(await assertMember(page, index));
          assertLayout(await layout(page), baseline);
          await screenshot(page, `${locale}-${width}x${height}-${members[index]}`);
        }
        await clickStep(page, 1); // Last -> first.
        await clickStep(page, -1); // First -> last.
        assert.match(await page.locator(".sh-team-status").innerText(), names.codex);
        assert.equal(await page.locator(".sh-team-status").getAttribute("role"), "status");
        return { locale, width, height, captions, geometry: baseline, ...(transitionSamples.length ? { transitionSamples } : {}) };
      });
    }

    for (const width of [320, 1440]) {
      await run(`${locale}-nojs-${width}`, { viewport: { width, height: 1000 }, isMobile: width === 320, hasTouch: width === 320, javaScriptEnabled: false }, async (page) => {
        await open(page, locale, false);
        assert.equal(await page.locator(".sh-team").getAttribute("data-enhanced"), null);
        const baseline = await layout(page);
        assertLayout(baseline);
        for (const index of [1, 2, 0]) {
          await clickStep(page, 1, false);
          await assertMember(page, index);
          await assertNeutral(page);
          assertLayout(await layout(page), baseline);
        }
        await clickStep(page, -1, false);
        await page.locator('label.sh-team-dot[for="team-claude"]').click();
        await assertMember(page, 1);
        await keyboardReachRadio(page);
        await page.keyboard.press("ArrowRight");
        assert.notEqual(await selected(page), 1, "Native radio navigation must work without JavaScript");
        await assertMember(page, await selected(page));
        await screenshot(page, `${locale}-nojs-${width}`);
        if (width === 320) {
          await page.setViewportSize({ width: 844, height: 390 });
          const landscape = await layout(page);
          assertLayout(landscape);
          for (let index = 0; index < members.length; index += 1) {
            await clickStep(page, 1, false);
            await assertNeutral(page);
            assertLayout(await layout(page), landscape);
          }
          await screenshot(page, `${locale}-nojs-landscape`);
        }
        return { locale, width, nativeArrows: true, nativeDots: true, nativeKeyboard: true, nativeArrowFocusDoesNotScroll: true };
      });
    }

    await run(`${locale}-keyboard-pointer`, {}, async (page) => {
      await open(page, locale);
      const next = page.locator('button[data-team-step="1"]');
      await next.focus();
      await page.keyboard.press("Enter");
      await assertMember(page, 1);
      assert(await next.evaluate((element) => document.activeElement === element), "Navigation retains button focus");
      await page.keyboard.press("Space");
      await assertMember(page, 2);
      await page.locator("#team-codex").focus();
      await page.keyboard.press("Home");
      await assertMember(page, 0);
      await keyboardReachRadio(page);
      await page.keyboard.press("End");
      await assertMember(page, 2);
      await page.keyboard.press("ArrowRight");
      await assertMember(page, locale === "fa" ? 1 : 0);
      await page.keyboard.press("ArrowLeft");
      await assertMember(page, 2);
      await page.keyboard.press("Home");
      await assertMember(page, 0);
      const focus = await page.locator('label.sh-team-dot[for="team-soheil"]').evaluate((element) => {
        const style = getComputedStyle(element);
        return { outline: style.outlineStyle, width: parseFloat(style.outlineWidth), shadow: style.boxShadow };
      });
      assert((focus.outline !== "none" && focus.width >= 1) || focus.shadow !== "none", "Radio selection must expose a visible keyboard focus indicator");
      for (let index = 0; index < 11; index += 1) await next.click({ delay: 0 });
      await assertMember(page, 2);
      await page.waitForTimeout(500);
      await assertMember(page, 2);
      await page.waitForTimeout(5500);
      await assertMember(page, 2); // A manually selected member must not auto-rotate.
      const pointerChecks = [];
      for (let index = 0; index < members.length; index += 1) pointerChecks.push(await assertMemberPointer(page, index));
      await page.locator('label.sh-team-dot[for="team-soheil"]').click();
      await assertMember(page, 0);
      await page.locator(".sh-cta").focus();
      await page.keyboard.press("ArrowRight");
      await assertMember(page, 0); // An unrelated link must not change the selected member.
      await page.locator(".sh-cta").click();
      assert.equal(new URL(page.url()).hash, "#contact");
      await page.locator(".sh-estimate").click();
      await page.getByRole("dialog").waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      await page.locator('label.sh-team-dot[for="team-codex"]').click();
      await assertMember(page, 2);
      await switchLocale(page, locale === "fa" ? "en" : "fa");
      await switchLocale(page, locale);
      return { locale, focus, keyboard: true, wrap: true, rapidClicks: true, noAutoplay: true, pointerChecks, pupilsOnly: true, resetOnBlurExitHidden: true, ctaAndEstimate: true, localeSwitchRetainsWorkingNavigation: true };
    });

    await run(`${locale}-reduced-motion`, { reducedMotion: "reduce" }, async (page) => {
      await open(page, locale);
      for (let index = 0; index < members.length; index += 1) {
        if (index) await clickStep(page, 1);
        await page.mouse.move(30 + index * 20, 220);
        await assertNeutral(page);
      }
      await page.locator("#team-codex").focus();
      await page.keyboard.press("Home");
      await assertMember(page, 0);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      // Browser media-change notifications arrive on the next rendering turn.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      for (let index = 0; index < members.length; index += 1) {
        await page.locator(`label.sh-team-dot[for="team-${members[index]}"]`).click();
        await assertMember(page, index);
        await page.mouse.move(1420 - index * 20, 260);
        await assertActivePupils(page, members[index]);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await assertNeutral(page);
        await clickStep(page, 1);
        const moving = await page.locator(".sh-team").evaluate((element) => element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length);
        assert.equal(moving, 0, "Reduced-motion selection must not start an animation");
        if (index < members.length - 1) {
          await page.emulateMedia({ reducedMotion: "no-preference" });
          await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        }
      }
      await screenshot(page, `${locale}-reduced-motion`);
      return { locale, initialReduce: true, livePreferenceChange: true, navigationPreserved: true };
    });

    await run(`${locale}-touch`, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, async (page, context) => {
      await open(page, locale);
      const visual = page.locator(".sh-team-slide:visible .sh-team-visual");
      await visual.scrollIntoViewIfNeeded();
      let box = await visual.boundingBox();
      const y = Math.max(130, Math.min(700, box.y + box.height / 2));
      await touchDrag(context, page, { x: 290, y }, { x: 100, y: y + 4 });
      const swipeIndex = locale === "fa" ? 2 : 1;
      await assertMember(page, swipeIndex);
      await assertNeutral(page);
      const touchAction = await page.locator(".sh-team-slide:visible .sh-team-visual").evaluate((element) => getComputedStyle(element).touchAction);
      assert(touchAction.includes("pan-y") && touchAction.includes("pinch-zoom"), "Swipe region preserves vertical panning and pinch zoom");
      await page.locator(".sh-team-slide:visible .sh-team-visual").scrollIntoViewIfNeeded();
      box = await page.locator(".sh-team-slide:visible .sh-team-visual").boundingBox();
      const startY = Math.min(690, Math.max(300, box.y + box.height * .75));
      const beforeScroll = await page.evaluate(() => scrollY);
      await touchDrag(context, page, { x: 195, y: startY }, { x: 200, y: startY - 170 });
      await page.waitForTimeout(180);
      assert.equal(await selected(page), swipeIndex, "Vertical scrolling must not switch members");
      assert((await page.evaluate(() => scrollY)) > beforeScroll + 20, "Vertical touch gesture must scroll the page");
      await screenshot(page, `${locale}-touch`);
      await page.setViewportSize({ width: 320, height: 900 });
      await page.locator('label.sh-team-dot[for="team-soheil"]').click();
      await assertMember(page, 0);
      const mobile320 = await layout(page);
      assertLayout(mobile320);
      for (let index = 0; index < members.length; index += 1) {
        if (index) await clickStep(page, 1, true, () => transitionOverflow(page));
        await assertMember(page, index);
        await assertNeutral(page);
        assertLayout(await layout(page), mobile320);
        await screenshot(page, `${locale}-touch-320-${members[index]}`);
      }
      return { locale, horizontalSwipe: true, verticalScrollPreserved: true, pinchZoomAllowed: true, touchPupilsNeutral: true, mobile320 };
    });
  }
} catch (error) {
  failures += 1;
  report.checks.push({ name: "verification-environment", passed: false, error: error.stack || String(error) });
  console.error(error.message);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
  report.finishedAt = new Date().toISOString();
  if (!report.checks.length) {
    failures += 1;
    report.checks.push({ name: "scenario-selection", passed: false, error: "HERO_TEAM_CASE did not match a scenario." });
  }
  report.blockedExternalOrigins = [...externalOrigins].sort();
  report.passed = failures === 0;
  await writeFile(path.join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
}
console.log(`${report.checks.length - failures}/${report.checks.length} scenarios passed. Artifacts: ${path.relative(repository, output)}`);
process.exitCode = failures ? 1 : 0;
