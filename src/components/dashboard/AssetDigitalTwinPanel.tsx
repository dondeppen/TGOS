import {
  buildAssetDigitalTwins,
  getDigitalTwinSummary,
  type AssetDigitalTwin,
} from "@/lib/tgos/asset-digital-twin";

export function AssetDigitalTwinPanel() {
  const twins = buildAssetDigitalTwins();
  const summary = getDigitalTwinSummary(twins);

  return (
    <section
      id="assets"
      className="mt-6 rounded-3xl border border-violet-400/30 bg-slate-900 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
            Asset Digital Twins
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Every machine has a living history
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            COMMAND combines configuration snapshots, repairs, inspections, network identity, and Repair DNA into one continuously evolving asset record.
          </p>
        </div>
        <span className="w-fit rounded-full border border-violet-300/30 bg-violet-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
          Digital Twin live
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Assets tracked" value={String(summary.assetsTracked)} />
        <Metric label="Timeline events" value={String(summary.timelineEvents)} />
        <Metric label="Average health" value={`${summary.averageHealth}%`} />
        <Metric label="Assets at risk" value={String(summary.assetsAtRisk)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {twins.map((twin) => (
          <DigitalTwinCard key={twin.assetId} twin={twin} />
        ))}
      </div>
    </section>
  );
}

function DigitalTwinCard({ twin }: { twin: AssetDigitalTwin }) {
  const riskClasses =
    twin.risk === "low"
      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
      : twin.risk === "medium"
        ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
        : "border-rose-300/30 bg-rose-300/10 text-rose-200";

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            {twin.customer} · {twin.assetId}
          </p>
          <h4 className="mt-2 text-xl font-bold text-white">
            {twin.manufacturer} {twin.model}
          </h4>
          <p className="mt-1 text-sm text-slate-500">Serial {twin.serialNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-white">{twin.healthScore}</span>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${riskClasses}`}>
            {twin.risk} risk
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {Object.entries(twin.configuration).slice(0, 6).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {label}
            </p>
            <p className="mt-1 break-words font-semibold text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
          Machine timeline
        </p>
        <div className="mt-3 space-y-3">
          {twin.timeline.map((event) => (
            <div key={event.id} className="grid grid-cols-[auto_1fr] gap-3">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-violet-300" />
              <div className="border-l border-slate-800 pl-4 pb-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-slate-100">{event.title}</p>
                  <time className="text-xs text-slate-600">
                    {new Date(event.occurredAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-400">{event.detail}</p>
                <p className="mt-1 text-xs text-slate-600">Source: {event.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
          COMMAND next action
        </p>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">{twin.nextBestAction}</p>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}
