"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type PlanName = "Pequeña" | "Mediana" | "Grande";

type AccessRequestContextValue = {
  open: (plan?: PlanName) => void;
};

const AccessRequestContext = createContext<AccessRequestContextValue | null>(
  null,
);

export function useAccessRequest() {
  const ctx = useContext(AccessRequestContext);
  if (!ctx) {
    throw new Error(
      "useAccessRequest debe usarse dentro de <AccessRequestProvider>",
    );
  }
  return ctx;
}

const ROLES = [
  "Presidente",
  "Miembro de junta",
  "Vecino",
  "Administrador",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccessRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanName | undefined>(undefined);

  const open = useCallback((p?: PlanName) => {
    setPlan(p);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <AccessRequestContext.Provider value={value}>
      {children}
      {isOpen && <AccessRequestModal plan={plan} onClose={close} />}
    </AccessRequestContext.Provider>
  );
}

function AccessRequestModal({
  plan,
  onClose,
}: {
  plan?: PlanName;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dwellings, setDwellings] = useState("");
  const [wantsCall, setWantsCall] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; dwellings?: string }>(
    {},
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function validate() {
    const next: { email?: string; dwellings?: string } = {};
    if (!email.trim()) {
      next.email = "El email es obligatorio.";
    } else if (!EMAIL_RE.test(email.trim())) {
      next.email = "Introduce un email válido.";
    }
    if (dwellings.trim() && !/^\d+$/.test(dwellings.trim())) {
      next.dwellings = "Indica un número de viviendas válido.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return; // prevent double-submit
    if (!validate()) return;

    setStatus("loading");
    setServerError(null);

    // Before Supabase keys are wired, don't hard-fail — explain instead.
    if (!isSupabaseConfigured) {
      setStatus("error");
      setServerError(
        "El formulario aún no está conectado a Supabase. Añade tus claves en .env.local para guardar las solicitudes.",
      );
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("access_requests").insert({
        email: email.trim(),
        name: name.trim() || null,
        role: role || null,
        dwellings: dwellings.trim() ? parseInt(dwellings.trim(), 10) : null,
        plan_interest: plan ?? null,
        wants_call: wantsCall,
      });
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error("access_requests insert failed", err);
      setStatus("error");
      setServerError(
        "No hemos podido guardar tu solicitud. Inténtalo de nuevo en un momento.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="access-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-bg p-6 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="access-title" className="text-xl font-bold text-ink">
              Solicitar acceso
            </h2>
            <p className="mt-1 text-sm text-muted">
              {plan
                ? `Plan ${plan} — os contactamos para dar de alta vuestra comunidad.`
                : "Os contactamos para dar de alta vuestra comunidad."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-2 -mt-2 rounded-lg p-2 text-muted transition hover:bg-surface hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-ink">
              ¡Gracias! Te contactamos para dar de alta a tu comunidad.
            </p>
            {wantsCall && (
              <p className="mt-2 text-sm text-muted">
                Te escribiremos para coordinar los 15 minutos.
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent-strong"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field label="Email" required htmlFor="ar-email" error={errors.email}>
              <input
                ref={firstFieldRef}
                id="ar-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-invalid={!!errors.email}
                className="input"
              />
            </Field>

            <Field label="Nombre" htmlFor="ar-name">
              <input
                id="ar-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cómo te llamas"
                className="input"
              />
            </Field>

            <Field label="Rol" htmlFor="ar-role">
              <select
                id="ar-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
              >
                <option value="">Selecciona tu rol</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Número de viviendas"
              htmlFor="ar-dwellings"
              error={errors.dwellings}
            >
              <input
                id="ar-dwellings"
                type="number"
                min={1}
                inputMode="numeric"
                value={dwellings}
                onChange={(e) => setDwellings(e.target.value)}
                placeholder="p. ej. 24"
                aria-invalid={!!errors.dwellings}
                className="input"
              />
            </Field>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={wantsCall}
                onChange={(e) => setWantsCall(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-accent"
              />
              <span>¿Podemos llamarte 15 min para enseñártelo?</span>
            </label>

            {status === "error" && serverError && (
              <p className="rounded-lg bg-no/10 px-3 py-2 text-sm text-no">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Enviando…" : "Solicitar acceso"}
            </button>
            <p className="text-center text-xs text-muted">
              Sin compromiso. No hay ningún cobro: solo te damos acceso al piloto.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-ink"
      >
        {label}
        {required && <span className="text-no"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-no">{error}</p>}
    </div>
  );
}
