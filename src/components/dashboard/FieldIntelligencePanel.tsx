import Link from "next/link";

export function FieldIntelligencePanel() {
  return (
    <section className="mt-6 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-900 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            TGOS Field Intelligence
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Prepare every technician before arrival.
          </h3>
          <p className="mt-4 leading-7 text-slate-300">
            The first v0.7 prototype converts Fran Horton&apos;s ColDesi 12H2 service
            request into a printable diagnostic playbook with likely causes,
            tools, arrival checks, decision points, safety stops, and a completion record.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">Open ticket</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Prepared guide</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Print / PDF</span>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-slate-700 bg-slate-950/55 p-5 xl:w-72">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Open service ticket
          </p>
          <p className="mt-2 text-lg font-bold">Fran Horton</p>
          <p className="mt-1 text-sm text-slate-400">ColDesi 12H2 evaluation</p>
          <Link
            href="/command-center/service/tickets/fran-coldesi"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
          >
            Prepare Me
          </Link>
        </div>
      </div>
    </section>
  );
}
