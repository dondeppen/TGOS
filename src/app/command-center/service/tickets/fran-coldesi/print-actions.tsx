"use client";

export function PrintActions() {
  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
      >
        Print / Save as PDF
      </button>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-200"
      >
        Back to COMMAND
      </button>
    </div>
  );
}
