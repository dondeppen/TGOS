import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SignOutButton } from "./sign-out-button";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { runTgosBrain } from "@/lib/tgos/brain";
import { RecommendationBroker } from "@/lib/tgos/recommendation-broker";
import {
  seedEntities,
  seedEvents,
  seedRelationships,
} from "@/lib/tgos/seed";
import {
  ExecutiveBriefing,
  OperationalHealthCard,
  CommandRecommendationPanel,
  OperationalActivityTimeline,
  MetricsGrid,
  BusinessReadinessPanel,
  ActiveDecisionsPanel,
  FieldIntelligencePanel,
  LearningIntelligencePanel,
} from "@/components/dashboard";

const navigation = [
  ["COMMAND", "Brief"],
  ["Customers", "CRM"],
  ["Locations", "Sites"],
  ["Assets", "Equipment"],
  ["Service", "Dispatch"],
  ["Inventory", "Stock"],
  ["Learning", "Intelligence"],
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

const activity = seedEvents
  .slice()
  .sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
  .map((event) => ({
    source: event.source,
    description: event.type.replaceAll("_", " ").replaceAll(".", " · "),
    time: new Date(event.occurredAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatRole(role: "owner" | "marketing"): string {
  return role === "owner" ? "Owner" : "Marketing";
}

export default async function CommandCenterPage() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/login");
  }

  const now = new Date();
  const operationalStatus = criticalCount > 0 ? "ATTENTION" : "GREEN";
  const statusClasses =
    operationalStatus === "GREEN"
      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-300"
      : "border-amber-300/20 bg-amber-300/10 text-amber-300";

  const metrics = [
    {
      label: "Events processed",
      value: String(seedEvents.length),
      note: "Current operational stream",
    },
    {
      label: "Agent findings",
      value: String(rawRecommendations.length),
      note: "Before broker consolidation",
    },
    {
      label: "Decisions active",
      value: String(recommendations.length),
      note: "Ranked by operational value",
    },
    {
      label: "Immediate attention",
      value: String(criticalCount),
      note: "Critical and high priority",
    },
  ];

  const dateFormatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const operationalHealthData = [
    {
      label: "Email",
      value: "98%",
      icon: "📧",
      status: "healthy" as const,
      metric: "Delivery rate",
    },
    {
      label: "Calendar",
      value: "100%",
      icon: "📅",
      status: "healthy" as const,
      metric: "Availability",
    },
    {
      label: "Website",
      value: "99.9%",
      icon: "🌐",
      status: "healthy" as const,
      metric: "Uptime",
    },
    {
      label: "Service Calls",
      value: "47",
      icon: "☎️",
      status: "warning" as const,
      metric: "In queue",
    },
    {
      label: "Inventory",
      value: "$124K",
      icon: "📦",
      status: "healthy" as const,
      metric: "Current value",
    },
    {
      label: "Revenue",
      value: "$2.3M",
      icon: "💰",
      status: "healthy" as const,
      metric: "MTD total",
    },
  ];

  const roleLabel = formatRole(session.role);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/90 px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="mb-9 block">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              Tek Guy Operating System
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[0.18em]">
              COMMAND
            </h1>
            <p className="mt-2 text-sm text-slate-500">Operational intelligence</p>
          </Link>

          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Signed in
            </p>
            <p className="mt-2 font-semibold text-slate-100">{session.displayName}</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-sm text-cyan-300">{roleLabel}</p>
              <SignOutButton />
            </div>
          </div>

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
                <span
                  className={`text-xs ${
                    index === 0 ? "text-slate-800" : "text-slate-600"
                  }`}
                >
                  {descriptor}
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">COMMAND status</span>
              <span
                className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusClasses}`}
              >
                {operationalStatus}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {seedEvents.length} events processed, {rawRecommendations.length}{" "}
              agent recommendations evaluated, and {recommendations.length}{" "}
              decisions brokered.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">
          <ExecutiveBriefing
            greeting={getGreeting()}
            dateFormatted={dateFormatted}
            operationalStatus={operationalStatus}
            statusClasses={statusClasses}
            summary="I reviewed the current operational picture and determined what matters most next."
            displayName={session.displayName}
            roleLabel={roleLabel}
          />

          <MetricsGrid metrics={metrics} />
          <CommandRecommendationPanel recommendation={highestValueAction ?? null} />
          <FieldIntelligencePanel />
          <LearningIntelligencePanel />

          <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Operational Health Status
              </p>
              <h3 className="mt-2 text-2xl font-bold">System Services</h3>
            </div>
            {operationalHealthData.map((item) => (
              <OperationalHealthCard key={item.label} {...item} />
            ))}
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
            <BusinessReadinessPanel
              readiness={readiness.map(([label, value]) => ({
                label: label as string,
                value: value as number,
              }))}
              operationalStatus={operationalStatus}
              statusClasses={statusClasses}
            />
            <ActiveDecisionsPanel
              decisions={recommendations.map((item) => ({
                id: item.id,
                title: item.title,
                detail: item.detail,
                priority: item.priority as "critical" | "high" | "medium" | "low",
                category: item.category,
                score: item.score,
              }))}
            />
          </div>

          <div className="mt-6">
            <OperationalActivityTimeline
              activities={activity}
              title="What COMMAND Observed"
              subtitle="Live reasoning feed"
            />
          </div>

          <footer className="flex flex-col gap-2 py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>TGOS v0.8 · Learning Intelligence</span>
            <span>Observe · Remember · Learn · Reason · Recommend · Act</span>
          </footer>
        </section>

        <div className="absolute right-6 top-6 lg:hidden">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
