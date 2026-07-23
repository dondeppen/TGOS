import {
  buildCopilotServiceStrategies,
  getCopilotSummary,
} from "@/lib/tgos/command-copilot";

function confidenceClasses(confidence: number): string {
  if (confidence >= 90) return "border-emerald-300/20 bg-emerald-300/10 text-emerald-300";
  if (confidence >= 75) return "border-cyan-300/20 bg-cyan-300/10 text-cyan-300";
  return "border-amber-300/20 bg-amber-300/10 text-amber-300";
}

export function CommandCopilotPanel() {
  const strategies = buildCopilotServiceStrategies();
  const summary = getCopilotSummary(strategies);
  const featured = strategies[0];

  if (!featured) return null;

  return (
    <section id="copilot" className="mt-6 overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/70 shadow-2xl shadow-cyan-950/20">
      <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-400/10 via-slate-900 to-blue-500/10 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              COMMAND Copilot
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              The technician arrives already knowing the machine.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              COMMAND has combined the Digital Twin, Repair DNA, configuration evidence, and machine history into a field-ready service strategy.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Strategies", summary.strategiesReady],
              ["Confidence", `${summary.averageConfidence}%`],
              ["Truck stock", summary.truckStockItems],
              ["Field time", `${summary.estimatedFieldMinutes}m`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-28 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Prepared service strategy</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{featured.assetName}</h3>
              <p className="mt-1 text-sm text-slate-400">{featured.customer}</p>
            </div>
            <div className={`rounded-full border px-3 py-2 text-sm font-bold ${confidenceClasses(featured.confidence)}`}>
              {featured.confidence}% confidence
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Primary hypothesis</p>
              <p className="mt-2 font-semibold text-slate-100">{featured.primaryHypothesis}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Estimated duration</p>
              <p className="mt-2 text-2xl font-bold text-white">{featured.estimatedMinutes} min</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Asset health</p>
              <p className="mt-2 text-2xl font-bold text-white">{featured.healthScore}%</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Why COMMAND recommends this</p>
            <div className="mt-3 space-y-3">
              {featured.supportingEvidence.map((evidence) => (
                <div key={`${evidence.source}-${evidence.label}`} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-100">{evidence.label}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{evidence.source}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{evidence.value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-2xl border border-emerald-300/20 bg-emerald-300/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Bring with you</p>
            <ul className="mt-4 space-y-3">
              {featured.bringWithYou.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-200">
                  <span className="font-bold text-emerald-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Recommended sequence</p>
            <ol className="mt-4 space-y-4">
              {featured.recommendedSequence.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl border border-blue-300/20 bg-blue-300/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Customer-ready update</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{featured.customerMessage}</p>
            <p className="mt-3 border-t border-blue-300/10 pt-3 text-xs leading-5 text-slate-500">{featured.explanation}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
