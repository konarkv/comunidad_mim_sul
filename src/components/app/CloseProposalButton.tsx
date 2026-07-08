"use client";

import { useActionState } from "react";
import { closeProposal, type ActionState } from "@/app/app/c/[id]/actions";

export function CloseProposalButton({
  communityId,
  proposalId,
}: {
  communityId: string;
  proposalId: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    closeProposal,
    {},
  );

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="community_id" value={communityId} />
        <input type="hidden" name="proposal_id" value={proposalId} />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-no hover:text-no disabled:opacity-60"
        >
          {pending ? "Cerrando…" : "Cerrar votación y generar acta"}
        </button>
      </form>
      {state.error && <p className="mt-2 text-sm text-no">{state.error}</p>}
    </div>
  );
}
