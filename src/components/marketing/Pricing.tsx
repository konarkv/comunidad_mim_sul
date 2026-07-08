import { RequestAccessButton } from "@/components/access/RequestAccessButton";

type PlanName = "Pequeña" | "Mediana" | "Grande";

const PLANS: {
  name: PlanName;
  range: string;
  price: string;
  featured?: boolean;
}[] = [
  { name: "Pequeña", range: "hasta 15 viviendas", price: "149" },
  { name: "Mediana", range: "16–40 viviendas", price: "299", featured: true },
  { name: "Grande", range: "más de 40 viviendas", price: "499" },
];

// Same full product in every plan — governance essentials are never gated.
const FEATURES = [
  "Comunicación y avisos",
  "Votaciones con voto trazable",
  "Actas y constancia de acuerdos",
  "Documentos de la comunidad",
  "Soporte",
];

export function Pricing() {
  return (
    <section
      id="precios"
      className="border-t border-border bg-surface px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Precios
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Un precio por comunidad, según su tamaño.
          </h2>
          <p className="mt-3 text-lg text-muted">
            El mismo producto completo en los tres planes. El plan solo depende
            del número de viviendas, nunca de las funciones.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-bg p-7 ${
                plan.featured
                  ? "border-accent shadow-lg shadow-accent/10 md:-mt-3 md:mb-3"
                  : "border-border"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Más común
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.range}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink">
                  {plan.price} €
                </span>
                <span className="text-sm text-muted">/año</span>
              </div>
              <p className="mt-1 text-sm text-muted">por comunidad</p>

              <ul className="mt-6 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink">
                    <svg
                      className="mt-0.5 shrink-0 text-accent"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <RequestAccessButton
                  plan={plan.name}
                  variant={plan.featured ? "primary" : "outline"}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-base font-medium text-ink">
          Un único pago anual por comunidad, aprobable en junta.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted">
          El precio es por edificio y año, no por vecino. El presidente lo
          presenta como una única partida en el presupuesto de la junta.
        </p>
      </div>
    </section>
  );
}
