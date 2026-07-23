import Link from "next/link";

import { runTgosBrain } from "@/lib/tgos/brain";
import {
  seedEntities,
  seedEvents,
  seedRelationships,
} from "@/lib/tgos/seed";

const navigation = [
  ["Command Center", "Overview"],
  ["Customers", "CRM"],
  ["Locations", "Sites"],
  ["Assets", "Equipment"],
  ["Service", "Dispatch"],
  ["Inventory", "Stock"],
  ["Knowledge", "Docs"],
  ["Intelligence", "AI"],
  ["Reports", "Analytics"],
  ["Settings", "System"],
];

const recommendations = runTgosBrain(seedEvents, {
  entities: seedEntities,
  relationships: seedRelationships,
});

const metrics = [
  {
    label: "Operational events",
    value: String(seedEvents.length),
    note: "Processed by the TGOS Brain",
  },
  {
    label: "Recommendations",
    value: String(recommendations.length),
    note: "Generated from active rules",
  },
  {
    label: "Tracked entities",
    value: String(seedEntities.length),
    note: "Customers, assets, service and finance",
  },
  {
    label: "Critical or high",
    value: String(
      recommendations.filter((item) =>
        ["critical", "high"].includes(item.priority),
      ).length,
    ),
    note: "Require near-term attention",
  },
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

export default function CommandCenterPage() {
  const nextAction = recommendations[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/90 px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="mb-9 block">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Tek Guy
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">TGOS</h1>
            <p className="mt-1 text-sm text-slate-500">Genesis v0.3</p>
          </Link>

          <nav className="space-y-1" aria-label="TGOS navigation">
            {navigation.map(([label, descriptor], index) => (
              <a
                key={label}
                href={index === 0 ? "#overview" : `#${label.toLowerCase()}`}
                className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                  index === 0
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="font-medium">{label}</span>
                <span
                  className={`text-xs ${index === 0 ? "text-slate-800" : "text-slate-600"}`}
                >
                  {descriptor}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Brain status</span>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                Processing
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {seedEvents.length} events evaluated against operational rules. The current feed uses seeded v0.3 data.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-400">Operational intelligence</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Command Center
              </h2>
              <p className="mt-2 text-slate-400">
                Good afternoon, Don. TGOS evaluated the current event stream and identified what needs attention next.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-600">
                Add event
              </button>
              <button className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                Ask TGOS
              </button>
            </div>
          </header>

          <div id="overview" className="grid gap-4 py-7 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-black/10"
              >
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-4 text-4xl font-bold tracking-tight">{metric.value}</p>
                <p className="mt-3 text-sm text-slate-500">{metric.note}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
            <section
              id="intelligence"
              className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-900 p-6 sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    TGOS Intelligence
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">Recommended actions</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    These actions were generated by the v0.3 rules engine from service, inventory, asset and financial events.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {recommendations.length} insights
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {recommendations.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-700/70 bg-slate-950/55 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${priorityStyles[item.priority]}`}
                        >
                          {item.priority} · {item.category}
                        </span>
                        <h4 className="mt-3 text-lg font-semibold">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                        <p className="mt-3 text-xs text-slate-600">Rule: {item.ruleId}</p>
                      </div>
                      <button className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200">
                        {item.actionLabel}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Brain output</p>
                  <h3 className="mt-1 text-xl font-bold">Decision pulse</h3>
                </div>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {recommendations.filter((item) => item.priority !== "low").length} active
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Events processed</span>
                    <span className="font-semibold">100%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-full rounded-full bg-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Entities linked</span>
                    <span className="font-semibold">{seedEntities.length}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[86%] rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rules producing insight</span>
                    <span className="font-semibold">{recommendations.length}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[92%] rounded-full bg-violet-400" />
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm font-semibold">What should happen next?</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {nextAction?.title ?? "No immediate action is required."}
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Event stream</p>
                <h3 className="mt-1 text-xl font-bold">Recent operational events</h3>
              </div>
              <span className="text-sm font-medium text-cyan-300">
                Seeded v0.3 feed
              </span>
            </div>

            <div className="mt-5 divide-y divide-slate-800">
              {activity.map(([type, description, time]) => (
                <div
                  key={`${type}-${description}`}
                  className="grid gap-2 py-4 sm:grid-cols-[140px_1fr_auto] sm:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {type}
                  </span>
                  <span className="text-sm capitalize text-slate-200">{description}</span>
                  <span className="text-xs text-slate-600">{time}</span>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-2 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>TGOS Genesis v0.3</span>
            <span>Observe · Organize · Learn · Recommend</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
