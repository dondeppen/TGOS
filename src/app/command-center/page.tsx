import Link from "next/link";

import { runTgosBrain } from "@/lib/tgos/brain";
import { RecommendationBroker } from "@/lib/tgos/recommendation-broker";
import {
  seedEntities,
  seedEvents,
  seedRelationships,
} from "@/lib/tgos/seed";

const navigation = [
  ["COMMAND", "Brief"],
  ["Customers", "CRM"],
  ["Locations", "Sites"],
  ["Assets", "Equipment"],
  ["Service", "Dispatch"],
  ["Inventory", "Stock"],
  ["Knowledge", "Memory"],
  ["Intelligence", "Agents"],
  ["Reports", "Analytics"],
  ["Settings", "System"],
];

const rawRecommendations = runTgosBrain(seedEvents, {
  entities: seedEntities,
  relationships: seedRelationships,
});

const broker = new RecommendationBroker();
const recommendations = broker.broker(rawRecommendations);
const highestValueAction = broker.highestValueAction(rawRecommendations);

const criticalCount = recommendations.filter((item) =>
  ["critical", "high"].includes(item.priority),
).length;

const readiness = [
  ["Operations", 96],
  ["Finance", criticalCount > 0 ? 82 : 94],
  ["Inventory", recommendations.some((item) => item.category === "inventory") ? 79 : 95],
  ["Scheduling", 91],
  ["Customer success", 94],
];

const priorityStyles = {
  critical: "text-rose-300 border-rose-300/20 bg-rose-300/10",
  high: "text-amber-300 border-amber-300/20 bg-amber-300/10",
  medium: "text-cyan-300 border-cyan-300/20 bg-cyan-300/10",
  low: "text-slate-300 border-slate-600 bg-slate-800",
};

const activity = seedEvents
  .slice()
  .sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
  .map((event) => [
    event.source,
    event.type.replaceAll("_", " ").replaceAll(".", " · "),
    new Date(event.occurredAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  ]);

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function CommandCenterPage() {
  const now = new Date();
  const operationalStatus = criticalCount > 0 ? "ATTENTION" : "GREEN";
  const statusClasses =
    operationalStatus === "GREEN"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-300"
      : "border-amber-300/20 bg-amber-300/10 text-amber-300";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/90 px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="mb-9 block">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Tek Guy Operating System
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[0.18em]">COMMAND</h1>
            <p className="mt-2 text-sm text-slate-500">Operational intelligence</p>
          </Link>

          <nav className="space-y-1" aria-label="TGOS navigation">
            {navigation.map(([label, descriptor], index) => (
              <a
                key={label}
                href={index === 0 ? "#brief" : `#${label.toLowerCase()}`}
                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  index === 0
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="font-medium">{label}</span>
                <span className={`text-xs ${index === 0 ? "text-slate-800" : "text-slate-600"}`}>
                  {descriptor}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">COMMAND status</span>
              <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClasses}`}>
                {operationalStatus}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {seedEvents.length} events processed, {rawRecommendations.length} agent recommendations evaluated, and {recommendations.length} decisions brokered.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">
          <header id="brief" className="border-b border-slate-800 pb-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  COMMAND · Morning Brief
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                  {getGreeting()}, Don.
                </h2>
                <p className="mt-3 max-w-3xl text-slate-400">
                  {now.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}. I reviewed the current operational picture and determined what matters most next.
                </p>
              </div>

              <div className={`w-fit rounded-2xl border px-5 py-4 ${statusClasses}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em]">Business status</p>
                <p className="mt-1 text-2xl font-black">{operationalStatus}</p>
              </div>
            </div>
          </header>

          <section className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Events processed", String(seedEvents.length), "Current operational stream"],
              ["Agent findings", String(rawRecommendations.length), "Before broker consolidation"],
              ["Decisions active", String(recommendations.length), "Ranked by operational value"],
              ["Immediate attention", String(criticalCount), "Critical and high priority"],
            ].map(([label, value, note]) => (
              <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-4 text-4xl font-bold tracking-tight">{value}</p>
                <p className="mt-3 text-sm text-slate-500">{note}</p>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/15 via-slate-900 to-slate-900 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Highest Value Action
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  {highestValueAction?.title ?? "No immediate action is required."}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  {highestValueAction?.detail ?? "COMMAND found no unresolved operational risks in the current event stream."}
                </p>
              </div>

              <div className="min-w-48 rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Decision score</p>
                <p className="mt-2 text-4xl font-black text-cyan-300">
                  {highestValueAction?.score ?? 100}
                </p>
                <p className="mt-1 text-xs text-slate-500">Broker confidence signal</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-5">
                <p className="text-sm font-semibold text-white">Why COMMAND recommends this</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                  {(highestValueAction?.reasons ?? ["No outstanding risks detected"]).map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
              {highestValueAction && (
                <button className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
                  {highestValueAction.actionLabel}
                </button>
              )}
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current posture</p>
                  <h3 className="mt-1 text-xl font-bold">Business readiness</h3>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
                  {operationalStatus}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {readiness.map(([label, value]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-semibold">{value}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-cyan-400" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="intelligence" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Brokered intelligence</p>
                  <h3 className="mt-1 text-xl font-bold">Active decisions</h3>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {recommendations.length} active
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {recommendations.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${priorityStyles[item.priority]}`}>
                          {item.priority} · {item.category}
                        </span>
                        <h4 className="mt-3 font-semibold">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-cyan-300">Score {item.score}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Operational timeline</p>
                <h3 className="mt-1 text-xl font-bold">What COMMAND observed</h3>
              </div>
              <span className="text-sm font-medium text-cyan-300">Live reasoning feed</span>
            </div>

            <div className="mt-5 divide-y divide-slate-800">
              {activity.map(([type, description, time]) => (
                <div key={`${type}-${description}`} className="grid gap-2 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{type}</span>
                  <span className="text-sm capitalize text-slate-200">{description}</span>
                  <span className="text-xs text-slate-600">{time}</span>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-2 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>TGOS Genesis v0.6 · COMMAND</span>
            <span>Observe · Remember · Reason · Recommend · Act</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
