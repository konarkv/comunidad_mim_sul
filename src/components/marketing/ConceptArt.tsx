import Link from "next/link";

function Avatar({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${tone}`}
      aria-hidden
    >
      {label}
    </span>
  );
}

function Feed() {
  return (
    <div className="rounded-2xl border border-border bg-bg p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Tablón · Portal 3</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
          En vivo
        </span>
      </div>
      <ul className="space-y-3">
        <li className="flex gap-3">
          <Avatar label="AM" tone="bg-accent" />
          <div className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[13px] font-semibold text-ink">Ana · Presidenta</p>
            <p className="text-[13px] text-muted">
              📌 Aviso: revisión del ascensor el martes de 9 a 11 h.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <Avatar label="JR" tone="bg-[#c98a3b]" />
          <div className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[13px] font-semibold text-ink">Jorge · 2ºB</p>
            <p className="text-[13px] text-muted">
              ¿Ponemos el tema de las plazas de garaje a votación?
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <Avatar label="ML" tone="bg-[#4b6cb7]" />
          <div className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[13px] font-semibold text-ink">María · 4ºA</p>
            <p className="text-[13px] text-muted">
              Subo el presupuesto de pintura al apartado de documentos 📄
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}

function VotingCard() {
  const tally = [
    { label: "Sí", pct: 62, count: 13, color: "bg-si" },
    { label: "No", pct: 24, count: 5, color: "bg-no" },
    { label: "Abstención", pct: 14, count: 3, color: "bg-abstencion" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-bg p-5 shadow-sm">
      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
        Votación abierta
      </span>
      <h4 className="mt-3 text-base font-semibold text-ink">
        Instalar puntos de recarga para vehículos eléctricos
      </h4>
      <p className="mt-1 text-[13px] text-muted">
        Propuesta de la junta · cierra en 3 días
      </p>

      <div className="mt-4 flex gap-2">
        <span className="flex-1 rounded-lg bg-si py-2 text-center text-sm font-semibold text-white">
          Sí
        </span>
        <span className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-semibold text-ink">
          No
        </span>
        <span className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-semibold text-muted">
          Abstención
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {tally.map((t) => (
          <div key={t.label}>
            <div className="mb-1 flex justify-between text-[12px] text-muted">
              <span>{t.label}</span>
              <span>
                {t.count} votos · {t.pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${t.color}`}
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-muted">
        21 de 24 viviendas han votado · voto trazable
      </p>
    </div>
  );
}

export function ConceptArt() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            Vista conceptual
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Así se ve por dentro.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg text-muted">
            Una ilustración de la idea: el tablón de la comunidad y una
            votación con recuento en directo.{" "}
            <Link href="/login" className="font-medium text-accent underline">
              Y ya funciona: probadlo en la demo.
            </Link>
          </p>
        </div>

        <div className="grid items-start gap-5 rounded-3xl border border-border bg-surface p-4 sm:p-6 md:grid-cols-2">
          <Feed />
          <VotingCard />
        </div>
        <p className="mt-3 text-center text-xs text-muted">
          Ilustración conceptual, no una captura del producto.
        </p>
      </div>
    </section>
  );
}
