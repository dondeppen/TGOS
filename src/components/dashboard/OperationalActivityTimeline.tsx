interface ActivityItem {
  source: string;
  description: string;
  time: string;
}

interface OperationalActivityTimelineProps {
  activities: ActivityItem[];
  title?: string;
  subtitle?: string;
}

export function OperationalActivityTimeline({
  activities,
  title = "What COMMAND Observed",
  subtitle = "Live reasoning feed",
}: OperationalActivityTimelineProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Operational timeline</p>
          <h3 className="mt-1 text-xl font-bold">{title}</h3>
        </div>
        <span className="text-sm font-medium text-cyan-300">{subtitle}</span>
      </div>

      <div className="mt-5 divide-y divide-slate-800">
        {activities.map(({ source, description, time }, index) => (
          <div
            key={`${source}-${description}-${index}`}
            className="grid gap-2 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-center"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {source}
            </span>
            <span className="text-sm capitalize text-slate-200">{description}</span>
            <span className="text-xs text-slate-600">{time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
