import type { SupabaseClient } from "@supabase/supabase-js";

// posts/proposals/votes reference auth.users, not profiles, so there's no
// automatic PostgREST embed. Resolve display names in one extra query.
export async function fetchNames(
  supabase: SupabaseClient,
  ids: (string | null | undefined)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter(Boolean) as string[])];
  if (unique.length === 0) return new Map();

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", unique);

  const map = new Map<string, string>();
  for (const p of data ?? []) {
    map.set(p.id as string, (p.full_name as string) || "Vecino");
  }
  return map;
}

export function nameFor(map: Map<string, string>, id: string): string {
  return map.get(id) || "Vecino";
}
