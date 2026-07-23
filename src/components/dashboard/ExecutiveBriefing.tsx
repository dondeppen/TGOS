import { ReactNode } from "react";

interface ExecutiveBriefingProps {
  greeting: string;
  dateFormatted: string;
  operationalStatus: "GREEN" | "ATTENTION";
  statusClasses: string;
  summary: string;
}

export function ExecutiveBriefing({
  greeting,
  dateFormatted,
  operationalStatus,
  statusClasses,
  summary,
}: ExecutiveBriefingProps) {
  return (
    <header className="border-b border-slate-800 pb-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            COMMAND · Executive Briefing
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {greeting}, Don.
          </h2>
          <p className="mt-3 max-w-3xl text-slate-400">
            {dateFormatted}. {summary}
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
