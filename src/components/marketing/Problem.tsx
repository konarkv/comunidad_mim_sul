const PAINS = [
  {
    title: "Hilos de WhatsApp imposibles de seguir",
    body: "Las decisiones importantes se pierden entre audios, memes y mensajes a medianoche. Nadie sabe en qué quedó la cosa.",
  },
  {
    title: "Votaciones sin registro claro",
    body: "¿Quién votó qué? Se decide a mano alzada o por encuestas sueltas, y cada junta vuelve a empezar de cero.",
  },
  {
    title: "Acuerdos que luego nadie encuentra",
    body: "Lo que se aprobó en marzo aparece —o no— en un correo perdido, un papel en el tablón o la memoria de alguien.",
  },
];

export function Problem() {
  return (
    <section className="border-t border-border bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Coordinar una comunidad no debería ser un caos.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Si sois presidente o estáis en la junta, esto os suena.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PAINS.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-bg p-6"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-sm font-bold text-accent">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
