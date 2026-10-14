import type { WellnessObservation } from "@nila/validation";

export function observedNumber(
  observations: WellnessObservation[],
  topic: string,
): number | undefined {
  const item = observations.find((o) => o.topic === topic);
  if (!item) return undefined;
  const bounds: Record<string, number> = {
    water: 20,
    sleep: 24,
    mood: 10,
    energy: 10,
    screen_time: 24,
  };
  if (
    topic in bounds &&
    typeof item.value === "number" &&
    Number.isFinite(item.value) &&
    item.value >= 0 &&
    item.value <= bounds[topic]!
  )
    return item.value;
  const patterns: Record<string, RegExp> = {
    stress:
      /\bstress(?:\s+level)?(?:\s+(?:was|is|of|at))?\s*[:=]?\s*(\d+(?:\.\d+)?)\s*(?:\/|out of)\s*10\b/i,
    activity: /\b(\d+(?:\.\d+)?)\s*(?:minutes?|min)\b/i,
    nutrition: /\b(\d+)\s*meals?\b/i,
  };
  if (
    typeof item.value !== "string" ||
    !patterns[topic] ||
    /\b(?:not|didn't|did not|don't|maybe|might|tomorrow|plan|want|should|could|usually)\b/i.test(
      item.quote,
    )
  )
    return undefined;
  const quoteMatch = patterns[topic]!.exec(item.quote);
  const valueMatch = patterns[topic]!.exec(item.value);
  if (!quoteMatch || !valueMatch || quoteMatch[1] !== valueMatch[1])
    return undefined;
  const value = Number(quoteMatch[1]);
  const max = topic === "activity" ? 1440 : topic === "nutrition" ? 20 : 10;
  return Number.isFinite(value) && value >= 0 && value <= max
    ? value
    : undefined;
}

export function observedGoals(
  observations: WellnessObservation[],
): { done: number; total: number } | undefined {
  const item = observations.find((o) => o.topic === "goals");
  if (
    !item ||
    typeof item.value !== "string" ||
    /\b(?:not|maybe|tomorrow|plan|want)\b/i.test(item.quote)
  )
    return undefined;
  const pattern =
    /\b(?:completed|achieved|finished)\s+(\d+)\s*(?:\/|of|out of)\s*(\d+)\s+goals?\b/i;
  const q = pattern.exec(item.quote),
    v = pattern.exec(item.value);
  if (!q || !v || q[1] !== v[1] || q[2] !== v[2]) return undefined;
  const done = Number(q[1]),
    total = Number(q[2]);
  return total > 0 && total <= 100 && done >= 0 && done <= total
    ? { done, total }
    : undefined;
}
