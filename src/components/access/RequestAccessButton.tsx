"use client";

import { useAccessRequest } from "./AccessRequest";

type PlanName = "Pequeña" | "Mediana" | "Grande";
type Variant = "primary" | "light" | "outline";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-strong shadow-sm shadow-accent/20",
  light: "bg-white text-accent hover:bg-white/90",
  outline: "border border-border bg-bg text-ink hover:border-accent hover:text-accent",
};

export function RequestAccessButton({
  plan,
  variant = "primary",
  className = "",
  children = "Solicitar acceso",
}: {
  plan?: PlanName;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useAccessRequest();
  return (
    <button
      type="button"
      onClick={() => open(plan)}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
