import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./client";
let client: SupabaseClient | null = null;
export function browserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Account services are not connected yet. The owner needs to configure Supabase before sign-in is available.",
    );
  return (client ??= createClient());
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const { data, error } = await Promise.race([
    browserClient().auth.getSession(),
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () =>
          reject(
            new Error(
              "Your sign-in session is taking too long. Reload this page and sign in again.",
            ),
          ),
        15000,
      );
    }),
  ]).finally(() => clearTimeout(timer));
  if (error || !data.session) throw new Error("Please sign in to continue.");
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url)
    throw new Error(
      "Your account is signed in, but the private data service has not been connected yet. Please contact the app owner.",
    );
  let result: Response;
  const requestSignal = AbortSignal.any([
    AbortSignal.timeout(60000),
    ...(options.signal ? [options.signal] : []),
  ]);
  let value: T & { error?: string };
  try {
    result = await fetch(`${url.replace(/\/$/, "")}/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session.access_token}`,
        ...options.headers,
      },
      cache: "no-store",
      signal: requestSignal,
    });
    const body = await result.text();
    try {
      value = JSON.parse(body) as T & { error?: string };
    } catch {
      value = {
        error:
          "The private data service returned an unexpected response. Please try again.",
      } as T & { error?: string };
    }
  } catch (error) {
    if (
      requestSignal.aborted ||
      (error instanceof Error && error.name === "TimeoutError")
    )
      throw new Error(
        "Nila's server is taking longer than expected to respond. Refresh to check whether your changes were saved before trying again.",
      );
    throw new Error(
      "Nila could not reach its server. Check your internet connection and try again. If this continues, contact the app owner.",
    );
  }
  if (!result.ok)
    throw new Error(value.error ?? "The request did not finish. Please retry.");
  if (value.error) throw new Error(value.error);
  return value;
}
