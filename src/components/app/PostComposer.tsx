"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPost, type ActionState } from "@/app/app/c/[id]/actions";

export function PostComposer({ communityId }: { communityId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createPost,
    {},
  );
  const [kind, setKind] = useState<"mensaje" | "aviso">("mensaje");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-2xl border border-border bg-bg p-4"
    >
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="kind" value={kind} />

      <div className="mb-3 inline-flex rounded-lg border border-border p-0.5 text-sm">
        <button
          type="button"
          onClick={() => setKind("mensaje")}
          className={`rounded-md px-3 py-1 font-medium transition ${
            kind === "mensaje" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          Mensaje
        </button>
        <button
          type="button"
          onClick={() => setKind("aviso")}
          className={`rounded-md px-3 py-1 font-medium transition ${
            kind === "aviso" ? "bg-accent text-white" : "text-muted"
          }`}
        >
          📌 Aviso
        </button>
      </div>

      {kind === "aviso" && (
        <input
          name="title"
          type="text"
          placeholder="Título del aviso (opcional)"
          className="input mb-2"
        />
      )}

      <textarea
        name="body"
        required
        rows={3}
        placeholder={
          kind === "aviso"
            ? "Escribe el aviso para toda la comunidad…"
            : "Escribe un mensaje para los vecinos…"
        }
        className="input resize-none"
      />

      {state.error && <p className="mt-2 text-sm text-no">{state.error}</p>}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-2 font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {pending ? "Publicando…" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
