"use client";

import { useActionState } from "react";
import { createCommunity, type FormState } from "@/app/app/actions";

export function CreateCommunityForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createCommunity,
    {},
  );

  return (
    <form action={action} className="space-y-3">
      <div>
        <label htmlFor="cc-name" className="mb-1.5 block text-sm font-medium">
          Nombre de la comunidad
        </label>
        <input
          id="cc-name"
          name="name"
          type="text"
          required
          placeholder="p. ej. Residencial Los Olivos"
          className="input"
        />
      </div>
      <div>
        <label htmlFor="cc-dw" className="mb-1.5 block text-sm font-medium">
          Número de viviendas
        </label>
        <input
          id="cc-dw"
          name="dwellings"
          type="number"
          min={1}
          placeholder="p. ej. 24"
          className="input"
        />
      </div>
      {state.error && <p className="text-sm text-no">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-4 py-2.5 font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear comunidad"}
      </button>
    </form>
  );
}
