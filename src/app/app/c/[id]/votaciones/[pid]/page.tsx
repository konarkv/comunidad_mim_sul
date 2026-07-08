import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VoteButtons } from "@/components/app/VoteButtons";
import { CloseProposalButton } from "@/components/app/CloseProposalButton";
import { Tally } from "@/components/app/Tally";
import { fetchNames, nameFor } from "@/lib/names";
import { choiceLabel, formatDate, formatDateTime, isBoard } from "@/lib/format";
import type { Proposal, VoteChoice } from "@/lib/supabase/types";

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string; pid: string }>;
}) {
  const { id, pid } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: proposalData } = await supabase
    .from("proposals")
    .select("id, author_id, title, description, status, created_at, closed_at")
    .eq("id", pid)
    .eq("community_id", id)
    .maybeSingle();

  if (!proposalData) notFound();
  const proposal = proposalData as Proposal;

  const { data: votesData } = await supabase
    .from("votes")
    .select("user_id, choice, updated_at")
    .eq("proposal_id", pid)
    .order("updated_at", { ascending: false });

  const votes = (votesData ?? []) as {
    user_id: string;
    choice: VoteChoice;
    updated_at: string;
  }[];

  const counts = { si: 0, no: 0, abstencion: 0 };
  for (const v of votes) {
    if (v.choice === "si") counts.si++;
    else if (v.choice === "no") counts.no++;
    else counts.abstencion++;
  }

  const myVote =
    (votes.find((v) => v.user_id === user?.id)?.choice as VoteChoice) ?? null;

  const { data: membership } = await supabase
    .from("community_members")
    .select("role")
    .eq("community_id", id)
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const canClose =
    proposal.status === "abierta" &&
    (proposal.author_id === user?.id || isBoard(membership?.role));

  const names = await fetchNames(supabase, [
    proposal.author_id,
    ...votes.map((v) => v.user_id),
  ]);

  const outcome =
    counts.si > counts.no
      ? "Aprobada"
      : counts.no > counts.si
        ? "Rechazada"
        : "Sin mayoría";

  return (
    <div className="space-y-6">
      <Link
        href={`/app/c/${id}/votaciones`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        ← Volver a votaciones
      </Link>

      <div className="rounded-2xl border border-border bg-bg p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-ink">{proposal.title}</h1>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              proposal.status === "abierta"
                ? "bg-accent-soft text-accent"
                : "bg-surface-2 text-muted"
            }`}
          >
            {proposal.status === "abierta" ? "Abierta" : "Cerrada"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          Propuesta de {nameFor(names, proposal.author_id)} ·{" "}
          {formatDate(proposal.created_at)}
        </p>
        {proposal.description && (
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
            {proposal.description}
          </p>
        )}
      </div>

      {proposal.status === "abierta" ? (
        <div className="rounded-2xl border border-border bg-bg p-6">
          <h2 className="mb-3 text-base font-semibold text-ink">Tu voto</h2>
          <VoteButtons
            communityId={id}
            proposalId={pid}
            currentChoice={myVote}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-6">
          <p className="text-sm font-semibold text-accent">
            Votación cerrada · {outcome}
          </p>
          <p className="mt-1 text-sm text-ink">
            {proposal.closed_at
              ? `Cerrada el ${formatDateTime(proposal.closed_at)}. `
              : ""}
            El resultado ha quedado registrado en un acta.
          </p>
          <Link
            href={`/app/c/${id}/actas`}
            className="mt-2 inline-block text-sm font-medium text-accent underline"
          >
            Ver actas →
          </Link>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="mb-4 text-base font-semibold text-ink">
          Recuento{" "}
          <span className="font-normal text-muted">
            · {votes.length} {votes.length === 1 ? "voto" : "votos"}
          </span>
        </h2>
        <Tally si={counts.si} no={counts.no} abstencion={counts.abstencion} />
      </div>

      <div className="rounded-2xl border border-border bg-bg p-6">
        <h2 className="text-base font-semibold text-ink">
          Quién ha votado qué
        </h2>
        <p className="mb-4 mt-1 text-xs text-muted">
          Voto trazable: en una comunidad, las decisiones se toman a la vista de
          todos.
        </p>
        {votes.length === 0 ? (
          <p className="text-sm text-muted">Aún no ha votado nadie.</p>
        ) : (
          <ul className="divide-y divide-border">
            {votes.map((v) => (
              <li
                key={v.user_id}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-sm text-ink">
                  {nameFor(names, v.user_id)}
                  {v.user_id === user?.id && (
                    <span className="ml-1 text-xs text-muted">(tú)</span>
                  )}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    v.choice === "si"
                      ? "bg-si/10 text-si"
                      : v.choice === "no"
                        ? "bg-no/10 text-no"
                        : "bg-surface-2 text-muted"
                  }`}
                >
                  {choiceLabel(v.choice)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {canClose && (
        <div className="rounded-2xl border border-border bg-bg p-6">
          <h2 className="text-base font-semibold text-ink">
            Cerrar la votación
          </h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Al cerrar se fija el resultado y se genera un acta permanente. Como
            autor o miembro de la junta, puedes cerrarla.
          </p>
          <CloseProposalButton communityId={id} proposalId={pid} />
        </div>
      )}
    </div>
  );
}
