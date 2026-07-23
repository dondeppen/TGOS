interface ExecutiveBriefingProps {
  greeting: string;
  dateFormatted: string;
  operationalStatus: "GREEN" | "ATTENTION";
  statusClasses: string;
  summary: string;
  displayName: string;
  roleLabel: string;
}

export function ExecutiveBriefing({
  greeting,
  dateFormatted,
  operationalStatus,
  statusClasses,
  summary,
  displayName,
  roleLabel,
}: ExecutiveBriefingProps) {
  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <header className="border-b border-slate-800 pb-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              COMMAND · Executive Briefing
            </p>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              {roleLabel}
            </span>
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {greeting}, {firstName}.
          </h2>
          <p className="mt-3 max-w-3xl text-slate-400">
            {dateFormatted}. {summary}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Signed in as {displayName}
          </p>
        </div>

        <div className={`w-fit rounded-2xl border px-5 py-4 ${statusClasses}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em]">
            Business Status
          </p>
          <p className="mt-1 text-2xl font-black">{operationalStatus}</p>
        </div>
      </div>
    </header>
  );
}
