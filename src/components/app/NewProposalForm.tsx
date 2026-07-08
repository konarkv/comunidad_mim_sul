"use client";

import { useActionState, useState } from "react";
import { createProposal, type ActionState } from "@/app/app/c/[id]/actions";

export function NewProposalForm({ communityId }: { communityId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createProposal,
    {},
  );
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-border bg-bg px-4 py-3 text-sm font-semibold text-accent transition hover:border-accent"
      >
        + Nueva propuesta a votación
      </button>
    );
  }

  return (
    <form
      action={action}
      className="rounded-2xl border border-border bg-bg p-5"
    >
      <input type="hidden" name="community_id" value={communityId} />
      <h3 className="text-base font-semibold text-ink">Nueva propuesta</h3>

      <div className="mt-3">
        <label htmlFor="np-title" className="mb-1.5 block text-sm font-medium">
          Título
        </label>
        <input
          id="np-title"
          name="title"
          type="text"
          required
          placeholder="p. ej. Instalar puntos de recarga"
          className="input"
        />
      </div>

      <div className="mt-3">
        <label htmlFor="np-desc" className="mb-1.5 block text-sm font-medium">
          Descripción (opcional)
        </label>
        <textarea
          id="np-desc"
          name="description"
          rows={3}
          placeholder="Explica la propuesta para que los vecinos voten con criterio…"
          className="input resize-none"
        />
      </div>

      {state.error && <p className="mt-2 text-sm text-no">{state.error}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-2 text-sm font-medium text-muted hover:text-ink"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-2 font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Creando…" : "Abrir votación"}
        </button>
      </div>
    </form>
  );
}
