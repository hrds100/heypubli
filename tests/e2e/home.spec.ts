import { test, expect } from "@playwright/test";

test("home page loads with placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Home")).toBeVisible();
  await expect(page.getByText("Em construção")).toBeVisible();
});
