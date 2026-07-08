"use client";

import { useState } from "react";

export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copiar código"
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm transition hover:border-accent"
    >
      <span className="text-muted">Código</span>
      <span className="font-mono font-semibold text-ink">{code}</span>
      <span className="text-accent">{copied ? "¡Copiado!" : "Copiar"}</span>
    </button>
  );
}
