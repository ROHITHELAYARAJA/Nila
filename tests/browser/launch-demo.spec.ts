import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({ channel: "chrome" });

test("homepage demo plays continuously without playback or fullscreen buttons", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(
    page.getByText("A little view of your day", { exact: false }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pause animations", exact: true }),
  ).toHaveCount(0);
  const video = page.locator(".launch-demo video");
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.1);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.disablePictureInPicture)).toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => getComputedStyle(v).pointerEvents)).toBe("none");
  if (page.viewportSize()!.width > 1000) {
    expect((await video.boundingBox())!.width).toBeGreaterThan(650);
  }
  await expect(page.getByRole("button", { name: /product demo/ })).toHaveCount(0);
  expect(await video.evaluate((v: HTMLVideoElement) => v.autoplay && v.loop && !v.controls)).toBe(true);
  await page.locator("#privacy").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("reduced motion uses the static poster without loading the movie", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const movies: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("nila-homepage-demo.mp4"))
      movies.push(request.url());
  });
  await page.goto("/");
  const video = page.locator(".launch-demo video");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute(
    "poster",
    "/videos/nila-homepage-poster.png",
  );
  await expect(video).not.toHaveAttribute("src", /mp4/);
  expect(movies).toEqual([]);
  await expect(
    page.getByRole("link", { name: "Find your space" }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
