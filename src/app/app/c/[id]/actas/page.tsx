import { createClient } from "@/lib/supabase/server";
import { Tally } from "@/components/app/Tally";
import { formatDate } from "@/lib/format";
import type { Acta } from "@/lib/supabase/types";

export default async function ActasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("actas")
    .select(
      "id, title, body, result_si, result_no, result_abstencion, decided_at",
    )
    .eq("community_id", id)
    .order("decided_at", { ascending: false });

  const actas = (data ?? []) as Acta[];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-ink">
          Actas y constancia de acuerdos
        </h2>
        <p className="mt-1 text-sm text-muted">
          Cada votación cerrada queda registrada aquí, fechada y a la vista de
          todos los vecinos.
        </p>
      </div>

      {actas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-bg p-8 text-center text-muted">
          Todavía no hay actas. Cierra una votación para generar la primera.
        </p>
      ) : (
        <ul className="space-y-4">
          {actas.map((a) => (
            <li
              key={a.id}
              className="rounded-2xl border border-border bg-bg p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-ink">{a.title}</h3>
                <span className="shrink-0 text-xs text-muted">
                  {formatDate(a.decided_at)}
                </span>
              </div>
              {a.body && (
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  {a.body}
                </p>
              )}
              <div className="mt-4 max-w-sm">
                <Tally
                  si={a.result_si}
                  no={a.result_no}
                  abstencion={a.result_abstencion}
                  compact
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
