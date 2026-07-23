interface ReadinessItem {
  label: string;
  value: number;
}

interface BusinessReadinessPanelProps {
  readiness: ReadinessItem[];
  operationalStatus: "GREEN" | "ATTENTION";
  statusClasses: string;
}

export function BusinessReadinessPanel({
  readiness,
  operationalStatus,
  statusClasses,
}: BusinessReadinessPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Current posture</p>
          <h3 className="mt-1 text-xl font-bold">Business readiness</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
          {operationalStatus}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {readiness.map(({ label, value }) => (
          <div key={label}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{label}</span>
              <span className="font-semibold">{value}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
