interface DecisionItem {
  id: string;
  title: string;
  detail: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  score: number;
}

interface ActiveDecisionsPanelProps {
  decisions: DecisionItem[];
}

const priorityStyles = {
  critical: "text-rose-300 border-rose-300/20 bg-rose-300/10",
  high: "text-amber-300 border-amber-300/20 bg-amber-300/10",
  medium: "text-cyan-300 border-cyan-300/20 bg-cyan-300/10",
  low: "text-slate-300 border-slate-600 bg-slate-800",
};

export function ActiveDecisionsPanel({
  decisions,
}: ActiveDecisionsPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Brokered intelligence</p>
          <h3 className="mt-1 text-xl font-bold">Active decisions</h3>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          {decisions.length} active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {decisions.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${priorityStyles[item.priority]}`}
                >
                  {item.priority} · {item.category}
                </span>
                <h4 className="mt-3 font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-cyan-300">
                Score {item.score}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
