import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateCommunityForm } from "@/components/app/CreateCommunityForm";
import { JoinCommunityForm } from "@/components/app/JoinCommunityForm";
import { roleLabel } from "@/lib/format";
import type { Community } from "@/lib/supabase/types";

type MembershipRow = {
  role: string;
  communities: Community | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("community_members")
    .select("role, communities ( id, name, dwellings, join_code, created_at )")
    .order("created_at", { ascending: true });

  const memberships = (data ?? []) as unknown as MembershipRow[];
  const communities = memberships.filter((m) => m.communities);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Mis comunidades
      </h1>
      <p className="mt-1 text-muted">
        Crea la comunidad de tu edificio o únete con un código.
      </p>

      {communities.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {communities.map((m) => {
            const c = m.communities!;
            return (
              <li key={c.id}>
                <Link
                  href={`/app/c/${c.id}`}
                  className="block rounded-2xl border border-border bg-bg p-5 transition hover:border-accent/50 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-ink">{c.name}</h2>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                      {roleLabel(m.role)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {c.dwellings ? `${c.dwellings} viviendas · ` : ""}
                    Código{" "}
                    <span className="font-mono font-medium text-ink">
                      {c.join_code}
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-bg p-8 text-center">
          <p className="text-muted">
            Todavía no perteneces a ninguna comunidad. Crea una o únete abajo.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-border bg-bg p-6">
          <h2 className="text-lg font-semibold text-ink">Crear una comunidad</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Serás el presidente. Obtendrás un código para invitar a los vecinos.
          </p>
          <CreateCommunityForm />
        </section>

        <section className="rounded-2xl border border-border bg-bg p-6">
          <h2 className="text-lg font-semibold text-ink">Unirme a una comunidad</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            ¿Ya existe tu comunidad? Pide el código a tu presidente.
          </p>
          <JoinCommunityForm />
        </section>
      </div>
    </main>
  );
}
