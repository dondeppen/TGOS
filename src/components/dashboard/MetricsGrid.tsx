interface MetricItem {
  label: string;
  value: string | number;
  note: string;
}

interface MetricsGridProps {
  metrics: MetricItem[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, note }) => (
        <article
          key={label}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-4 text-4xl font-bold tracking-tight">{value}</p>
          <p className="mt-3 text-sm text-slate-500">{note}</p>
        </article>
      ))}
    </section>
  );
}
