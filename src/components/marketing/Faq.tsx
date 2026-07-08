"use client";

import { useState } from "react";

const QA = [
  {
    q: "¿Sustituye al administrador de fincas?",
    a: "No va de eso. Comunidad os da control y transparencia sobre vuestra comunicación y vuestras decisiones. Funciona igual de bien con administrador o sin él: si lo tenéis, la junta llega a las reuniones con todo claro y decidido.",
  },
  {
    q: "¿Es válido legalmente votar aquí?",
    a: "Comunidad refleja y da constancia de los acuerdos que toma la junta y ordena vuestras votaciones internas. No sustituye los requisitos formales de la Ley de Propiedad Horizontal ni pretende sustituir al acta oficial cuando esta sea necesaria; ante dudas legales, consultad con vuestro administrador o asesor.",
  },
  {
    q: "¿Cuánto cuesta y quién paga?",
    a: "Paga la comunidad, no cada vecino. Es un único pago anual por edificio, según su tamaño, que el presidente puede presentar como una partida más del presupuesto y aprobar en junta.",
  },
  {
    q: "¿Están seguros nuestros datos?",
    a: "Sí. Cada comunidad solo ve su propia información, con acceso restringido a sus vecinos. Los datos se guardan de forma segura y nunca se comparten con terceros.",
  },
  {
    q: "¿Qué pasa si no todos los vecinos usan la app?",
    a: "No pasa nada: quien participa deja constancia de su voto y del acuerdo, y el resto puede consultar todo lo decidido. La adopción crece sola cuando los vecinos ven que ahí está lo importante.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-bg">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="text-base font-semibold text-ink">
                    {item.q}
                  </span>
                  <svg
                    className={`shrink-0 text-muted transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
