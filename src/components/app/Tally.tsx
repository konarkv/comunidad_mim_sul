export function Tally({
  si,
  no,
  abstencion,
  compact = false,
}: {
  si: number;
  no: number;
  abstencion: number;
  compact?: boolean;
}) {
  const total = si + no + abstencion;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  const rows = [
    { label: "Sí", n: si, color: "bg-si" },
    { label: "No", n: no, color: "bg-no" },
    { label: "Abstención", n: abstencion, color: "bg-abstencion" },
  ];

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2.5"}>
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>{r.label}</span>
            <span>
              {r.n} {r.n === 1 ? "voto" : "votos"} · {pct(r.n)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className={`h-full rounded-full ${r.color}`}
              style={{ width: `${pct(r.n)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
