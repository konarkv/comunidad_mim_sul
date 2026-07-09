"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/auth/actions";
import { Logo } from "@/components/marketing/Logo";

export function AuthForm({
  mode,
  redirectTo,
}: {
  mode: "signin" | "signup";
  redirectTo?: string;
}) {
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  const isSignup = mode === "signup";

  return (
    <div className="w-full max-w-sm">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Logo />
        <span className="text-lg font-bold text-ink">ConvivAI</span>
      </Link>

      <h1 className="text-2xl font-bold text-ink">
        {isSignup ? "Crear cuenta" : "Entrar"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        {isSignup
          ? "Crea tu cuenta para probar la demo de la comunidad."
          : "Accede a la demo de tu comunidad."}
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        {redirectTo && (
          <input type="hidden" name="redirect" value={redirectTo} />
        )}

        {isSignup && (
          <div>
            <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              placeholder="Tu nombre"
              className="input"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@email.com"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder="••••••••"
            className="input"
          />
        </div>

        {state.error && (
          <p className="rounded-lg bg-no/10 px-3 py-2 text-sm text-no">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {pending
            ? "Un momento…"
            : isSignup
              ? "Crear cuenta"
              : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isSignup ? (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-accent">
              Entrar
            </Link>
          </>
        ) : (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="font-medium text-accent">
              Crear una
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
