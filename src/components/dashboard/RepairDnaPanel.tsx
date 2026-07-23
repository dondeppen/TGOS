import {
  buildRepairDnaProfiles,
  getRepairDnaSummary,
  type RepairDnaProfile,
} from "@/lib/tgos/repair-dna";

export function RepairDnaPanel() {
  const profiles = buildRepairDnaProfiles();
  const summary = getRepairDnaSummary(profiles);

  return (
    <section
      id="repair-dna"
      className="mt-6 rounded-3xl border border-cyan-400/30 bg-slate-900 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            TGOS Repair DNA
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Field experience, converted into repair guidance
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            COMMAND combines historical repairs with new learning records to predict failure paths, truck stock, and the next best diagnostic action.
          </p>
        </div>
        <span className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
          v0.9 live
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Models tracked" value={String(summary.trackedModels)} />
        <Metric label="Fleet health" value={`${summary.fleetHealth}%`} />
        <Metric label="First-time fix" value={`${summary.firstTimeFixRate}%`} />
        <Metric label="Diagnostic confidence" value={`${summary.averageConfidence}%`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {profiles.map((profile) => (
          <RepairProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}

function RepairProfileCard({ profile }: { profile: RepairDnaProfile }) {
  const leadingFailure = profile.commonFailures[0];

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {profile.manufacturer}
          </p>
          <h4 className="mt-2 text-xl font-bold text-white">{profile.model}</h4>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
          {profile.confidence}% confidence
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          <span>Health score</span>
          <span>{profile.healthScore}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-300"
            style={{ width: `${profile.healthScore}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <SmallMetric label="Repairs" value={String(profile.repairCount)} />
        <SmallMetric label="FTF" value={`${profile.firstTimeFixRate}%`} />
        <SmallMetric label="Avg time" value={`${profile.averageRepairMinutes}m`} />
      </div>

      {leadingFailure ? (
        <div className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            Highest-probability failure
          </p>
          <p className="mt-2 font-semibold text-slate-100">{leadingFailure.name}</p>
          <p className="mt-1 text-sm text-slate-400">
            {leadingFailure.probability}% probability across {leadingFailure.occurrences} historical occurrences
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Recommended truck stock
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.recommendedTruckStock.map((part) => (
            <span
              key={part}
              className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300"
            >
              {part}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
          Next best action
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{profile.nextBestAction}</p>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-2 py-3">
      <p className="text-lg font-black text-white">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
    </div>
  );
}
