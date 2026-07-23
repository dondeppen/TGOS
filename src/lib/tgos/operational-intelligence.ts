import { runTgosBrain } from "@/lib/tgos/brain";
import {
  RecommendationBroker,
  type BrokeredRecommendation,
} from "@/lib/tgos/recommendation-broker";
import type {
  Recommendation,
  RuleContext,
  TgosEvent,
} from "@/lib/tgos/types";

export type SignalSeverity = "critical" | "warning" | "informational";

export interface OperationalSignal {
  id: string;
  kind:
    | "source-activity"
    | "source-silence"
    | "event-concentration"
    | "decision-pressure";
  severity: SignalSeverity;
  title: string;
  detail: string;
  source?: string;
  eventIds: string[];
  detectedAt: string;
}

export interface OperationalIntelligenceSnapshot {
  generatedAt: string;
  eventCount: number;
  sourceCount: number;
  entityCount: number;
  rawRecommendations: Recommendation[];
  decisions: BrokeredRecommendation[];
  highestValueAction: BrokeredRecommendation | null;
  signals: OperationalSignal[];
  attentionCount: number;
  healthScore: number;
  posture: "green" | "attention" | "critical";
  narrative: string;
}

export interface OperationalIntelligenceOptions {
  now?: Date;
  maximumDecisions?: number;
  sourceSilenceHours?: number;
}

const severityPenalty: Record<SignalSeverity, number> = {
  critical: 18,
  warning: 8,
  informational: 0,
};

function newestEvent(events: TgosEvent[]): TgosEvent | null {
  return (
    [...events].sort(
      (a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt),
    )[0] ?? null
  );
}

function sourceActivitySignals(
  events: TgosEvent[],
  now: Date,
  sourceSilenceHours: number,
): OperationalSignal[] {
  const bySource = new Map<string, TgosEvent[]>();

  for (const event of events) {
    const sourceEvents = bySource.get(event.source) ?? [];
    sourceEvents.push(event);
    bySource.set(event.source, sourceEvents);
  }

  return [...bySource.entries()].map(([source, sourceEvents]) => {
    const latest = newestEvent(sourceEvents);
    const ageHours = latest
      ? Math.max(0, (now.getTime() - Date.parse(latest.occurredAt)) / 3_600_000)
      : Number.POSITIVE_INFINITY;
    const silent = ageHours > sourceSilenceHours;

    return {
      id: `source-${source}-${silent ? "silent" : "active"}`,
      kind: silent ? "source-silence" : "source-activity",
      severity: silent ? "warning" : "informational",
      title: silent ? `${source} has gone quiet` : `${source} is reporting`,
      detail: silent
        ? `No new ${source} activity has been observed for ${Math.round(ageHours)} hours.`
        : `${source} contributed ${sourceEvents.length} event${sourceEvents.length === 1 ? "" : "s"}; the latest arrived ${Math.round(ageHours)} hour${Math.round(ageHours) === 1 ? "" : "s"} ago.`,
      source,
      eventIds: sourceEvents.map((event) => event.id),
      detectedAt: now.toISOString(),
    };
  });
}

function concentrationSignals(
  events: TgosEvent[],
  now: Date,
): OperationalSignal[] {
  if (events.length < 3) return [];

  const counts = new Map<TgosEvent["type"], TgosEvent[]>();
  for (const event of events) {
    const matching = counts.get(event.type) ?? [];
    matching.push(event);
    counts.set(event.type, matching);
  }

  return [...counts.entries()]
    .filter(([, matching]) => matching.length / events.length >= 0.5)
    .map(([type, matching]) => ({
      id: `concentration-${type}`,
      kind: "event-concentration" as const,
      severity: "warning" as const,
      title: `Operational activity is concentrated in ${type.replaceAll("_", " ").replaceAll(".", " · ")}`,
      detail: `${matching.length} of ${events.length} observed events share this event type. COMMAND should verify whether this is expected activity or an emerging pattern.`,
      eventIds: matching.map((event) => event.id),
      detectedAt: now.toISOString(),
    }));
}

function decisionPressureSignal(
  decisions: BrokeredRecommendation[],
  now: Date,
): OperationalSignal[] {
  const urgent = decisions.filter((decision) =>
    ["critical", "high"].includes(decision.priority),
  );

  if (urgent.length === 0) return [];

  return [
    {
      id: "decision-pressure",
      kind: "decision-pressure",
      severity: urgent.some((decision) => decision.priority === "critical")
        ? "critical"
        : "warning",
      title: `${urgent.length} high-value action${urgent.length === 1 ? " requires" : "s require"} attention`,
      detail: "The recommendation broker found unresolved work with material operational impact.",
      eventIds: urgent.map((decision) => decision.eventId),
      detectedAt: now.toISOString(),
    },
  ];
}

function calculateHealthScore(
  signals: OperationalSignal[],
  decisions: BrokeredRecommendation[],
): number {
  const signalPenalty = signals.reduce(
    (total, signal) => total + severityPenalty[signal.severity],
    0,
  );
  const decisionPenalty = decisions.reduce((total, decision) => {
    if (decision.priority === "critical") return total + 15;
    if (decision.priority === "high") return total + 7;
    if (decision.priority === "medium") return total + 3;
    return total;
  }, 0);

  return Math.max(0, Math.min(100, 100 - signalPenalty - decisionPenalty));
}

function createNarrative(
  snapshot: Pick<
    OperationalIntelligenceSnapshot,
    "eventCount" | "sourceCount" | "decisions" | "attentionCount" | "healthScore"
  >,
): string {
  const opening = `COMMAND reviewed ${snapshot.eventCount} event${snapshot.eventCount === 1 ? "" : "s"} from ${snapshot.sourceCount} operational source${snapshot.sourceCount === 1 ? "" : "s"}.`;

  if (snapshot.attentionCount === 0) {
    return `${opening} No critical or high-priority intervention is currently indicated. Operational health is ${snapshot.healthScore}%.`;
  }

  const top = snapshot.decisions[0];
  return `${opening} ${snapshot.attentionCount} decision${snapshot.attentionCount === 1 ? " requires" : "s require"} attention. The highest-value next action is: ${top?.title ?? "review the active operational queue"}. Operational health is ${snapshot.healthScore}%.`;
}

export function buildOperationalIntelligence(
  events: TgosEvent[],
  context: Omit<RuleContext, "events">,
  options: OperationalIntelligenceOptions = {},
): OperationalIntelligenceSnapshot {
  const now = options.now ?? new Date();
  const broker = new RecommendationBroker();
  const rawRecommendations = runTgosBrain(events, context);
  const decisions = broker.broker(rawRecommendations, {
    maximumResults: options.maximumDecisions ?? 10,
  });
  const highestValueAction = decisions[0] ?? null;
  const signals = [
    ...sourceActivitySignals(
      events,
      now,
      options.sourceSilenceHours ?? 24,
    ),
    ...concentrationSignals(events, now),
    ...decisionPressureSignal(decisions, now),
  ];
  const attentionCount = decisions.filter((decision) =>
    ["critical", "high"].includes(decision.priority),
  ).length;
  const healthScore = calculateHealthScore(signals, decisions);
  const posture = signals.some((signal) => signal.severity === "critical")
    ? "critical"
    : attentionCount > 0 || signals.some((signal) => signal.severity === "warning")
      ? "attention"
      : "green";

  const snapshot: OperationalIntelligenceSnapshot = {
    generatedAt: now.toISOString(),
    eventCount: events.length,
    sourceCount: new Set(events.map((event) => event.source)).size,
    entityCount: new Set(events.map((event) => event.entityId)).size,
    rawRecommendations,
    decisions,
    highestValueAction,
    signals,
    attentionCount,
    healthScore,
    posture,
    narrative: "",
  };

  snapshot.narrative = createNarrative(snapshot);
  return snapshot;
}
