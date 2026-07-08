"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./env";

// Browser-side Supabase client (uses the public anon key).
// We keep it untyped and cast query results to the interfaces in ./types,
// which avoids maintaining the strict generated `Database` generic by hand.
export function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
