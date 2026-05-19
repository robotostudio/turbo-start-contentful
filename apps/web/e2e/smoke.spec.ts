import { expect, test } from "@playwright/test";

test("home renders hero", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();
  await expect(h1).toContainText("Build websites");
  await expect(page.locator("nav")).toBeVisible();
});

test("blog list renders cards", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("article").first()).toBeVisible();
});

test("blog post renders content", async ({ page }) => {
  await page.goto("/blog/test-blog");
  await expect(page.locator("h1")).toBeVisible();
});

test("draft mode blocked without valid token", async ({ request }) => {
  const res = await request.get("/api/draft?token=wrong");
  expect(res.status()).toBe(401);
});

test("preview path validation rejects open redirect", async ({ request }) => {
  const res = await request.get("/api/preview?path=//evil.com");
  expect(res.status()).toBe(400);
});
