import { test, expect } from "@playwright/test";
import { commitAndRefresh } from "../../apps/web/src/lib/mutation";

test("confirmed saves finish while the dashboard reload is still pending", async () => {
  let refreshStarted = false;
  let finishRefresh!: () => void;
  const refresh = new Promise<void>((resolve) => {
    finishRefresh = resolve;
  });
  const result = await commitAndRefresh(
    async () => ({ saved: true }),
    () => {
      refreshStarted = true;
      return refresh;
    },
  );
  expect(result).toEqual({ saved: true });
  expect(refreshStarted).toBe(true);
  finishRefresh();
  let refreshed = false;
  await expect(
    commitAndRefresh(
      async () => {
        throw new Error("Permission was not saved");
      },
      async () => {
        refreshed = true;
      },
    ),
  ).rejects.toThrow("Permission was not saved");
  expect(refreshed).toBe(false);
});

test("adult confirmation is visible before signup providers and allows Google routing", async ({
  page,
}) => {
  await page.goto("/auth?mode=signup");
  const adult = page.getByRole("checkbox", { name: /I am 18 or older/ });
  const google = page.getByRole("button", {
    name: "Continue with Google",
    exact: true,
  });
  await expect(adult).toBeVisible();
  await expect(google).toBeDisabled();
  const adultBox = await adult.boundingBox(),
    googleBox = await google.boundingBox();
  expect(adultBox!.y).toBeLessThan(googleBox!.y);
  await adult.check();
  await expect(google).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Continue with GitHub", exact: true }),
  ).toBeEnabled();
  await page.route("**/auth/v1/authorize?**", async (route) => {
    const url = new URL(route.request().url());
    expect(url.searchParams.get("provider")).toBe("google");
    expect(url.searchParams.get("redirect_to")).toMatch(
      /\/auth\/callback\?next=\/dashboard$/,
    );
    await route.fulfill({
      contentType: "text/html",
      body: "Google sign-in request received",
    });
  });
  await google.click();
  await expect(page).toHaveURL(/auth\/v1\/authorize/);
});
