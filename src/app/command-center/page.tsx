import Link from "next/link";

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

const metrics = [
  { label: "Open service calls", value: "12", note: "3 need scheduling" },
  { label: "Scheduled today", value: "5", note: "First arrival 8:00 AM" },
  { label: "Awaiting parts", value: "4", note: "2 orders overdue" },
  { label: "Inventory alerts", value: "7", note: "Consumables below target" },
];

const recommendations = [
  {
    priority: "High",
    title: "Replenish Xerox C9000 drums",
    detail:
      "Three tracked devices are approaching the replacement threshold. Prepare two drums now and verify one additional unit with the supplier.",
  },
  {
    priority: "Action",
    title: "Schedule two pending service requests",
    detail:
      "The requests have complete customer information but no assigned service window.",
  },
  {
    priority: "Efficiency",
    title: "Review tomorrow's route sequence",
    detail:
      "Two nearby calls can be grouped into the same service block to reduce travel time.",
  },
];

const activity = [
  ["Service", "SSA Williamsport phone refresh prepared", "10 min ago"],
  ["Inventory", "Xerox drum stock moved below target", "32 min ago"],
  ["Customer", "New contact information added", "1 hr ago"],
  ["System", "TGOS Genesis v0.2 branch created", "Today"],
];

export default function CommandCenterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/90 px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="mb-9 block">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Tek Guy
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">TGOS</h1>
            <p className="mt-1 text-sm text-slate-500">Genesis v0.2</p>
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
              <span className="text-sm font-medium">System status</span>
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                Online
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Command Center shell is active. Live integrations will be connected in upcoming milestones.
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
                Good morning, Don. Here is what needs attention next.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-600">
                Add record
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
                    These recommendations use demonstration data for the v0.2 interface. Future releases will calculate them from connected service, inventory, customer, and financial systems.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  3 insights
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {recommendations.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-700/70 bg-slate-950/55 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                          {item.priority}
                        </span>
                        <h4 className="mt-2 text-lg font-semibold">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                      </div>
                      <button className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200">
                        Review
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Today's operations</p>
                  <h3 className="mt-1 text-xl font-bold">Service pulse</h3>
                </div>
                <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  4 alerts
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Scheduled capacity</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[68%] rounded-full bg-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Parts readiness</span>
                    <span className="font-semibold">82%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[82%] rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Documentation complete</span>
                    <span className="font-semibold">74%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[74%] rounded-full bg-violet-400" />
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <p className="text-sm font-semibold">Next scheduled action</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Review the first dispatch window and confirm required parts before technicians begin travel.
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">System activity</p>
                <h3 className="mt-1 text-xl font-bold">Recent updates</h3>
              </div>
              <button className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                View all
              </button>
            </div>

            <div className="mt-5 divide-y divide-slate-800">
              {activity.map(([type, description, time]) => (
                <div
                  key={`${type}-${description}`}
                  className="grid gap-2 py-4 sm:grid-cols-[110px_1fr_auto] sm:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {type}
                  </span>
                  <span className="text-sm text-slate-200">{description}</span>
                  <span className="text-xs text-slate-600">{time}</span>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-2 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>TGOS Genesis v0.2</span>
            <span>Observe · Organize · Learn · Recommend</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
