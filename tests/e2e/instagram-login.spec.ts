import { test, expect } from "@playwright/test";

test("login page offers Instagram as the only sign-in method", async ({ page }) => {
  await page.goto("/login");
  const button = page.getByRole("link", { name: /entrar com instagram/i });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("href", "/api/auth/instagram/start");
  // No email/password fields anymore.
  await expect(page.getByLabel(/senha/i)).toHaveCount(0);
});

test("signup collects name/email/WhatsApp before Instagram, gated by terms", async ({
  page,
}) => {
  await page.goto("/cadastro");
  await expect(page.getByLabel("Nome", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Sobrenome")).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByText("WhatsApp")).toBeVisible();

  const submit = page.getByRole("button", { name: /criar conta com instagram/i });
  await expect(submit).toBeDisabled();

  // Terms open in a popup (not a navigation).
  await page.getByRole("button", { name: /termos de uso/i }).click();
  await expect(page.getByRole("dialog")).toContainText(/stories/i);
  await page.getByRole("button", { name: /entendi/i }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // Fill the whole form → submit becomes enabled.
  await page.getByLabel("Nome", { exact: true }).fill("Maria");
  await page.getByLabel("Sobrenome").fill("Silva");
  await page.getByLabel("Email", { exact: true }).fill("maria@gmail.com");
  await page.locator('input[type="tel"]').click();
  await page.locator('input[type="tel"]').pressSequentially("11999998888");
  await page.getByRole("checkbox").check();
  await expect(submit).toBeEnabled();

  // The form posts the collected data to the Instagram start route.
  const form = page.locator("form");
  await expect(form).toHaveAttribute("action", "/api/auth/instagram/start");
  await expect(form).toHaveAttribute("method", /post/i);
});

test("terms page explains we publish stories/feed/reels", async ({ page }) => {
  await page.goto("/termos");
  await expect(page.getByRole("heading", { name: /termos de uso/i })).toBeVisible();
  await expect(page.getByText(/stories/i)).toBeVisible();
});

test("start route redirects to Outstand's Instagram OAuth", async ({ page }) => {
  // Don't follow the external redirect — just assert where it points.
  const res = await page.request.get("/api/auth/instagram/start", {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toContain("outstand.so");
});

test("protected route redirects anonymous users to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
