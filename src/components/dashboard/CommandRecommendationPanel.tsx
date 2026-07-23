interface RecommendationItem {
  title: string;
  detail: string;
  reasons: string[];
  score: number;
  actionLabel?: string;
}

interface CommandRecommendationPanelProps {
  recommendation: RecommendationItem | null;
}

export function CommandRecommendationPanel({
  recommendation,
}: CommandRecommendationPanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-900 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Highest Value Action
          </p>
          <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {recommendation?.title ?? "No immediate action is required."}
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {recommendation?.detail ??
              "COMMAND found no unresolved operational risks in the current event stream."}
          </p>
        </div>

        <div className="min-w-48 rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Decision Score
          </p>
          <p className="mt-2 text-4xl font-black text-cyan-300">
            {recommendation?.score ?? 100}
          </p>
          <p className="mt-1 text-xs text-slate-500">Broker confidence signal</p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-5">
          <p className="text-sm font-semibold text-white">Why COMMAND recommends this</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
            {(recommendation?.reasons ?? ["No outstanding risks detected"]).map(
              (reason) => (
                <li key={reason}>• {reason}</li>
              ),
            )}
          </ul>
        </div>
        {recommendation && (
          <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
            {recommendation.actionLabel || "Take Action"}
          </button>
        )}
      </div>
    </section>
  );
}
