const STEPS = [
  {
    title: "Creáis la comunidad",
    body: "Dais de alta el edificio y añadís a los vecinos con un código. En minutos, todos dentro.",
  },
  {
    title: "Proponéis y votáis",
    body: "Cualquier tema se convierte en una propuesta. Sí, No o Abstención, con recuento a la vista de todos.",
  },
  {
    title: "Queda constancia",
    body: "Al cerrar la votación se genera un acta. Acuerdos guardados, fechados y accesibles para siempre.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="border-t border-border bg-surface px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Cómo funciona
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            De la idea al acuerdo, en tres pasos.
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="text-5xl font-extrabold text-accent/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
