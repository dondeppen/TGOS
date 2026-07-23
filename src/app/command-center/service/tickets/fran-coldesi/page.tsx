import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PrintActions } from "./print-actions";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";

const likelyCauses = [
  ["Ink delivery or circulation restriction", "High"],
  ["Capping station contamination or poor seal", "High"],
  ["Encoder strip contamination", "Medium"],
  ["Carriage ribbon cable damage or loose connection", "Medium"],
  ["Printhead communication or electrical failure", "Medium"],
  ["Mainboard, power supply, sensor, or firmware fault", "Lower"],
];

const arrivalSteps = [
  "Photograph the printer, control panel, ink system, carriage area, and all visible error messages before changing anything.",
  "Confirm the exact symptom with the customer and determine what changed immediately before the failure.",
  "Verify input power, emergency stops, interlocks, covers, cables, and obvious fluid leaks.",
  "Power on and record startup behavior, sounds, carriage movement, pump activity, and displayed codes.",
  "Inspect the encoder strip for contamination, scratches, slack, or incorrect routing.",
  "Inspect carriage and printhead ribbon cables for wear, fluid intrusion, loose seating, damaged contacts, or sharp folds.",
  "Inspect the capping station, wiper, dampers, ink lines, filters, and circulation path for blockage or loss of prime.",
  "Run only the safest available nozzle, motion, cleaning, and communication tests; record each result before proceeding.",
];

const bringItems = [
  "Laptop, charger, known-good USB cable, and network cable",
  "Multimeter and insulated probes",
  "Flashlight, inspection mirror, and phone camera",
  "Lint-free swabs, wipes, gloves, and approved cleaning fluid",
  "Syringes and tubing suitable for ink-path checks",
  "Small hand tools and ESD protection",
  "Printed guide and blank service notes",
];

export default async function FranColdesiDiagnosticGuidePage() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 print:bg-white print:px-0 print:py-0 print:text-black">
      <article className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none sm:p-9">
        <header className="border-b border-slate-700 pb-6 print:border-black">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300 print:text-black">
                TGOS Field Intelligence · Diagnostic Playbook
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">ColDesi 12H2 Evaluation</h1>
              <p className="mt-3 text-slate-400 print:text-black">
                Prepared for Fran Horton · Open service ticket · On-site diagnostic evaluation
              </p>
            </div>
            <span className="w-fit rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 print:border-black print:bg-white print:text-black">
              Draft · Technician review required
            </span>
          </div>
          <div className="mt-6">
            <PrintActions />
          </div>
        </header>

        <section className="grid gap-4 border-b border-slate-800 py-6 print:border-black sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Customer", "Fran Horton"],
            ["Equipment", "ColDesi 12H2"],
            ["Service", "Evaluation only"],
            ["Prepared for", session.displayName],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4 print:rounded-none print:border-black print:bg-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 print:text-black">{label}</p>
              <p className="mt-2 font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section className="py-6">
          <h2 className="text-2xl font-black">Reported condition</h2>
          <p className="mt-3 leading-7 text-slate-300 print:text-black">
            The printer requires an on-site evaluation. Parts are not stocked for this model, so the immediate objective is to identify the failed system, document evidence, determine required parts, and present the customer with repair options before additional work is authorized.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/25 bg-cyan-400/10 p-6 print:rounded-none print:border-black print:bg-white">
            <h2 className="text-xl font-black">Likely fault areas</h2>
            <div className="mt-4 space-y-3">
              {likelyCauses.map(([cause, confidence]) => (
                <div key={cause} className="flex items-start justify-between gap-4 border-b border-cyan-300/10 pb-3 last:border-0 last:pb-0 print:border-black">
                  <span>{cause}</span>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-cyan-200 print:text-black">{confidence}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-6 print:rounded-none print:border-black print:bg-white">
            <h2 className="text-xl font-black">Bring to the site</h2>
            <ul className="mt-4 space-y-3 text-slate-300 print:text-black">
              {bringItems.map((item) => (
                <li key={item} className="flex gap-3"><span aria-hidden>□</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-7">
          <h2 className="text-2xl font-black">Arrival and diagnostic sequence</h2>
          <ol className="mt-5 space-y-4">
            {arrivalSteps.map((step, index) => (
              <li key={step} className="grid grid-cols-[40px_1fr] gap-3 rounded-2xl border border-slate-800 bg-slate-950/35 p-4 print:rounded-none print:border-black print:bg-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 font-black text-slate-950 print:border print:border-black print:bg-white print:text-black">{index + 1}</span>
                <span className="leading-7 text-slate-200 print:text-black">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 p-6 print:rounded-none print:border-black">
            <h2 className="text-xl font-black">Decision points</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300 print:text-black">
              <p><strong>Machine does not power or initialize:</strong> verify input voltage, fuses, power supply outputs, interlocks, and mainboard indicators before replacing components.</p>
              <p><strong>Carriage does not move correctly:</strong> inspect obstruction, encoder strip, motor drive, sensors, carriage cable, and control signals.</p>
              <p><strong>Carriage moves but no ink prints:</strong> verify ink supply, circulation, dampers, capping seal, nozzle condition, head cables, head voltage, and print data.</p>
              <p><strong>Intermittent or inconsistent behavior:</strong> document temperature, startup sequence, cable movement, fluid contamination, connector condition, and repeatability.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-300/25 bg-rose-300/10 p-6 print:rounded-none print:border-black print:bg-white">
            <h2 className="text-xl font-black">Stop and escalate when</h2>
            <ul className="mt-4 space-y-3 text-slate-200 print:text-black">
              <li>• Exposed mains voltage or unsafe wiring is present.</li>
              <li>• Ink or cleaning fluid has entered power or logic electronics.</li>
              <li>• A test requires undocumented service-mode changes.</li>
              <li>• Head voltage, wiring, or board pinout cannot be positively verified.</li>
              <li>• Continuing could damage the printhead, board, customer media, or surrounding property.</li>
            </ul>
          </div>
        </section>

        <section className="py-7">
          <h2 className="text-2xl font-black">Completion record</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {["Observed failure", "Tests performed", "Root cause or leading diagnosis", "Parts or documents required", "Customer options discussed", "Follow-up action and owner"].map((label) => (
              <div key={label} className="min-h-32 rounded-2xl border border-slate-700 p-4 print:rounded-none print:border-black">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 print:text-black">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-700 pt-5 text-xs leading-5 text-slate-500 print:border-black print:text-black">
          This prototype is a preparation aid, not an OEM service manual. Verify procedures, voltages, firmware, part numbers, and safety requirements against authoritative manufacturer documentation before performing invasive work.
        </footer>
      </article>
    </main>
  );
}
