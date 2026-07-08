import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommunityTabs } from "@/components/app/CommunityTabs";
import { InviteCode } from "@/components/app/InviteCode";

export default async function CommunityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS hides communities the user isn't a member of, so this returns null
  // for non-members → 404.
  const { data: community } = await supabase
    .from("communities")
    .select("id, name, dwellings, join_code")
    .eq("id", id)
    .maybeSingle();

  if (!community) notFound();

  const { count: memberCount } = await supabase
    .from("community_members")
    .select("id", { count: "exact", head: true })
    .eq("community_id", id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {community.name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {community.dwellings ? `${community.dwellings} viviendas · ` : ""}
            {memberCount ?? 0}{" "}
            {memberCount === 1 ? "vecino registrado" : "vecinos registrados"}
          </p>
        </div>
        <InviteCode code={community.join_code} />
      </div>

      <div className="mt-6">
        <CommunityTabs communityId={community.id} />
      </div>

      <div className="mt-6">{children}</div>
    </main>
  );
}
