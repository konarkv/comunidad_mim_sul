"use client";

import { useActionState } from "react";
import { joinCommunity, type FormState } from "@/app/app/actions";

export function JoinCommunityForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    joinCommunity,
    {},
  );

  return (
    <form action={action} className="space-y-3">
      <div>
        <label htmlFor="jc-code" className="mb-1.5 block text-sm font-medium">
          Código de la comunidad
        </label>
        <input
          id="jc-code"
          name="code"
          type="text"
          required
          autoCapitalize="characters"
          placeholder="p. ej. 4F9A2C"
          className="input uppercase"
        />
      </div>
      {state.error && <p className="text-sm text-no">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 font-semibold text-ink transition hover:border-accent hover:text-accent disabled:opacity-60"
      >
        {pending ? "Uniéndote…" : "Unirme"}
      </button>
    </form>
  );
}
