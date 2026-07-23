import { getDailyLearningSummary, repairLearnings } from "@/lib/tgos/learning-intelligence";

export function LearningIntelligencePanel() {
  const summary = getDailyLearningSummary();

  return (
    <section id="learning" className="mt-6 rounded-3xl border border-violet-400/30 bg-slate-900 p-6 sm:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">TGOS Learning Intelligence</p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">What did we learn today?</h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">Every completed repair becomes structured knowledge for future Mission Control briefings.</p>
        </div>
        <span className="w-fit rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">v0.8 live</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Repairs learned" value={String(summary.newRepairs)} />
        <Metric label="Avg. confidence gain" value={`+${summary.averageConfidenceGain}%`} />
        <Metric label="Experience captured" value={`${summary.totalLaborMinutes} min`} />
        <Metric label="Manufacturers" value={String(summary.manufacturerCount)} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {repairLearnings.map((learning) => (
          <article key={learning.id} className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">{learning.manufacturer}</p>
            <h4 className="mt-2 text-lg font-bold text-white">{learning.model}</h4>
            <p className="mt-1 text-sm text-slate-500">{learning.customer}</p>
            <p className="mt-4 text-sm font-semibold text-slate-200">{learning.rootCause}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{learning.correctiveAction}</p>
            <p className="mt-4 text-xs font-bold text-emerald-300">+{learning.confidenceAfter - learning.confidenceBefore}% confidence</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}
