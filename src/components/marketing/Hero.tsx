import Link from "next/link";
import { RequestAccessButton } from "@/components/access/RequestAccessButton";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24"
    >
      {/* soft accent glow, no competing imagery */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-accent-soft/70 to-transparent"
      />
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Para presidentes y juntas de vecinos
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
          Vuestra comunidad,
          <br className="hidden sm:block" /> decidida entre todos.
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-muted sm:text-xl">
          Comunicación, decisiones y votaciones de la comunidad de propietarios
          en un solo sitio. Con constancia de cada acuerdo, sin perseguir
          mensajes por WhatsApp.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <RequestAccessButton className="w-full px-6 py-3.5 text-base sm:w-auto">
            Solicitar acceso
          </RequestAccessButton>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-bg px-6 py-3.5 text-base font-semibold text-ink transition hover:border-accent hover:text-accent sm:w-auto"
          >
            Probar la demo
          </Link>
        </div>

        <p className="mt-4 text-sm text-muted">
          Un único pago anual por comunidad · aprobable en junta
        </p>
      </div>
    </section>
  );
}
