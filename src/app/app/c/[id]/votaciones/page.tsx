import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewProposalForm } from "@/components/app/NewProposalForm";
import { Tally } from "@/components/app/Tally";
import { formatDate } from "@/lib/format";
import type { Proposal } from "@/lib/supabase/types";

type Counts = { si: number; no: number; abstencion: number };

export default async function VotacionesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("proposals")
    .select("id, title, description, status, created_at, closed_at")
    .eq("community_id", id)
    .order("created_at", { ascending: false });

  const proposals = (data ?? []) as Proposal[];

  const counts = new Map<string, Counts>();
  if (proposals.length > 0) {
    const { data: votes } = await supabase
      .from("votes")
      .select("proposal_id, choice")
      .in(
        "proposal_id",
        proposals.map((p) => p.id),
      );
    for (const v of votes ?? []) {
      const c = counts.get(v.proposal_id) ?? { si: 0, no: 0, abstencion: 0 };
      if (v.choice === "si") c.si++;
      else if (v.choice === "no") c.no++;
      else c.abstencion++;
      counts.set(v.proposal_id, c);
    }
  }

  return (
    <div className="space-y-5">
      <NewProposalForm communityId={id} />

      {proposals.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-bg p-8 text-center text-muted">
          Todavía no hay votaciones. Crea la primera propuesta.
        </p>
      ) : (
        <ul className="space-y-4">
          {proposals.map((p) => {
            const c = counts.get(p.id) ?? { si: 0, no: 0, abstencion: 0 };
            const total = c.si + c.no + c.abstencion;
            return (
              <li key={p.id}>
                <Link
                  href={`/app/c/${id}/votaciones/${p.id}`}
                  className="block rounded-2xl border border-border bg-bg p-5 transition hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-ink">
                      {p.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status === "abierta"
                          ? "bg-accent-soft text-accent"
                          : "bg-surface-2 text-muted"
                      }`}
                    >
                      {p.status === "abierta" ? "Abierta" : "Cerrada"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(p.created_at)} · {total}{" "}
                    {total === 1 ? "voto" : "votos"}
                  </p>
                  <div className="mt-4">
                    <Tally si={c.si} no={c.no} abstencion={c.abstencion} compact />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
