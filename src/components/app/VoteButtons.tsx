"use client";

import { useActionState } from "react";
import { castVote, type ActionState } from "@/app/app/c/[id]/actions";
import type { VoteChoice } from "@/lib/supabase/types";

const OPTIONS: { value: VoteChoice; label: string; activeClass: string }[] = [
  { value: "si", label: "Sí", activeClass: "bg-si text-white border-si" },
  { value: "no", label: "No", activeClass: "bg-no text-white border-no" },
  {
    value: "abstencion",
    label: "Abstención",
    activeClass: "bg-abstencion text-white border-abstencion",
  },
];

export function VoteButtons({
  communityId,
  proposalId,
  currentChoice,
}: {
  communityId: string;
  proposalId: string;
  currentChoice: VoteChoice | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    castVote,
    {},
  );

  return (
    <div>
      <form action={action} className="flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="community_id" value={communityId} />
        <input type="hidden" name="proposal_id" value={proposalId} />
        {OPTIONS.map((o) => {
          const active = currentChoice === o.value;
          return (
            <button
              key={o.value}
              type="submit"
              name="choice"
              value={o.value}
              disabled={pending}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                active
                  ? o.activeClass
                  : "border-border bg-bg text-ink hover:border-accent"
              }`}
            >
              {o.label}
              {active && " ✓"}
            </button>
          );
        })}
      </form>
      {currentChoice && (
        <p className="mt-2 text-xs text-muted">
          Tu voto está registrado. Puedes cambiarlo mientras la votación siga
          abierta.
        </p>
      )}
      {state.error && <p className="mt-2 text-sm text-no">{state.error}</p>}
    </div>
  );
}
