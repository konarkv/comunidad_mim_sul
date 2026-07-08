const ITEMS = [
  { emoji: "🔁", label: "Trueque entre vecinos" },
  { emoji: "🍲", label: "Cenas de comunidad" },
  { emoji: "🐕", label: "Paseos de perros" },
  { emoji: "🤝", label: "Favores y ayuda" },
];

export function SocialTeaser() {
  return (
    <section className="border-t border-border bg-surface px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-xl font-semibold text-ink">
          Y no solo lo aburrido…
        </h2>
        <p className="mt-2 text-sm text-muted">
          Cuando la comunicación funciona, el barrio también. Llegará más
          adelante:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {ITEMS.map((it) => (
            <span
              key={it.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm text-ink"
            >
              <span aria-hidden>{it.emoji}</span>
              {it.label}
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted">
                próximamente
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
