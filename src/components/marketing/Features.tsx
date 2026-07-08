const FEATURES = [
  {
    title: "Comunicación",
    body: "Avisos, mensajes y documentos en un único sitio. Se acabó buscar entre chats y correos.",
    icon: (
      <path
        d="M4 6h16v10H9l-4 4V6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Decisiones y votaciones",
    body: "Propuestas claras y voto trazable. Mayorías conforme a lo que decide la junta.",
    icon: (
      <>
        <path
          d="M5 12l4 4L19 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: "Actas y constancia",
    body: "Cada acuerdo queda registrado, fechado y a la vista de todos los vecinos.",
    icon: (
      <>
        <rect
          x="5"
          y="4"
          width="14"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8 9h8M8 13h8M8 17h5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

export function Features() {
  return (
    <section id="producto" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            El producto
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Todo lo que necesita vuestra comunidad para funcionar.
          </h2>
          <p className="mt-3 text-lg text-muted">
            Comunicar, decidir y dejar constancia. Sin dispersión, sin dudas
            sobre lo que se acordó.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-bg p-7 transition hover:border-accent/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
