import { test, expect } from "@playwright/test";
import {
  observedNumber,
  observedGoals,
} from "../../apps/web/src/lib/wellness-display";

test("visual values require explicit matching answers", () => {
  expect(
    observedNumber(
      [
        {
          topic: "stress",
          value: "stress 3 out of 10",
          quote: "My stress is 3 out of 10.",
        },
      ],
      "stress",
    ),
  ).toBe(3);
  expect(
    observedNumber(
      [
        {
          topic: "stress",
          value: "stress 3 out of 10",
          quote: "I feel stressed.",
        },
      ],
      "stress",
    ),
  ).toBeUndefined();
  expect(
    observedNumber(
      [
        {
          topic: "activity",
          value: "25 minutes",
          quote: "I might walk 25 minutes tomorrow.",
        },
      ],
      "activity",
    ),
  ).toBeUndefined();
  expect(
    observedNumber(
      [
        {
          topic: "activity",
          value: "25 minutes",
          quote: "I walked 15 minutes.",
        },
      ],
      "activity",
    ),
  ).toBeUndefined();
  expect(
    observedNumber(
      [{ topic: "water", value: 0, unit: "L", quote: "I drank zero liters." }],
      "water",
    ),
  ).toBe(0);
  expect(
    observedGoals([
      {
        topic: "goals",
        value: "completed 3 of 5 goals",
        quote: "I completed 3 of 5 goals today.",
      },
    ]),
  ).toEqual({ done: 3, total: 5 });
  expect(
    observedGoals([
      {
        topic: "goals",
        value: "completed 3 of 5 goals",
        quote: "I want to have completed 3 of 5 goals tomorrow.",
      },
    ]),
  ).toBeUndefined();
});

test("selected call data changes visual fills and unreported days stay empty", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview");
  await expect(page.locator(".live-water")).toHaveAttribute(
    "data-level",
    "1.8",
  );
  await page.locator(".mood-day").first().click();
  await expect(page.locator(".live-water")).toHaveAttribute(
    "data-level",
    "1.2",
  );
  await expect(page.locator(".live-water > div")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 0.3, 0, 0)",
  );
  await page.locator(".mood-day").nth(2).click();
  await expect(page.locator(".live-water")).toHaveAttribute(
    "data-level",
    "unknown",
  );
  await expect(
    page.locator(".metric-panel.water .metric-number"),
  ).toContainText("—");
  await expect(page.locator(".voice-report")).toContainText("Not reported");
  await expect(page.locator(".mood-day").nth(2).locator("video")).toHaveCount(
    0,
  );
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});

test("HyperFrames loops play, pause and respect reduced motion", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview");
  const art = page.locator(".hf-aurora");
  await expect(art).toHaveAttribute("data-poster-ready", "true");
  const video = art.locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.1);
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page
    .getByRole("button", { name: "Play animations", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await expect(video).not.toBeVisible();
  await expect(art.locator("img")).toBeVisible();
  await page
    .getByText("Explore your 32 wellness connections", { exact: true })
    .click();
  await page.locator(".collection-panel").scrollIntoViewIfNeeded();
  await expect(page.locator(".wellness-drawer").locator("..")).toHaveAttribute(
    "data-revealed",
    "true",
  );
  await page.screenshot({
    path: `outputs/nila-${info.project.name}-hyperframes.png`,
    fullPage: true,
  });
});
