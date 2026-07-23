import type {
  Recommendation,
  RuleContext,
  TgosEvent,
  TgosRule,
} from "@/lib/tgos/types";

function recommendation(
  input: Omit<Recommendation, "createdAt">,
): Recommendation {
  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}

const inventoryRule: TgosRule = {
  id: "inventory-below-reorder-point",
  description: "Recommend replenishment when on-hand stock is at or below its reorder point.",
  evaluate(event) {
    if (event.type !== "inventory.level_updated") return [];

    const onHand = Number(event.payload.onHand ?? 0);
    const reorderPoint = Number(event.payload.reorderPoint ?? 0);
    const itemName = String(event.payload.itemName ?? "Inventory item");

    if (onHand > reorderPoint) return [];

    return [
      recommendation({
        id: `${event.id}-reorder`,
        ruleId: inventoryRule.id,
        priority: onHand === 0 ? "critical" : "high",
        category: "inventory",
        title: `Replenish ${itemName}`,
        detail: `${itemName} has ${onHand} unit${onHand === 1 ? "" : "s"} available against a reorder point of ${reorderPoint}. Verify demand and prepare a purchase order.`,
        actionLabel: "Review stock",
        entityId: event.entityId,
        eventId: event.id,
      }),
    ];
  },
};

const unscheduledServiceRule: TgosRule = {
  id: "service-call-needs-scheduling",
  description: "Identify open service calls that do not have a service window.",
  evaluate(event) {
    if (event.type !== "service_call.opened") return [];
    if (event.payload.scheduled === true) return [];

    const customerName = String(event.payload.customerName ?? "Customer");
    const summary = String(event.payload.summary ?? "Service request");

    return [
      recommendation({
        id: `${event.id}-schedule`,
        ruleId: unscheduledServiceRule.id,
        priority: event.payload.urgent === true ? "critical" : "high",
        category: "service",
        title: `Schedule ${customerName} service call`,
        detail: `${summary} is open and has no assigned service window. Confirm availability, required parts, and technician ownership.`,
        actionLabel: "Schedule call",
        entityId: event.entityId,
        eventId: event.id,
      }),
    ];
  },
};

const meterRule: TgosRule = {
  id: "asset-consumable-threshold",
  description: "Flag assets whose tracked consumable life has reached a replacement threshold.",
  evaluate(event) {
    if (event.type !== "asset.meter_updated") return [];

    const lifeUsed = Number(event.payload.lifeUsedPercent ?? 0);
    if (lifeUsed < 90) return [];

    const assetName = String(event.payload.assetName ?? "Tracked asset");
    const consumable = String(event.payload.consumable ?? "consumable");

    return [
      recommendation({
        id: `${event.id}-consumable`,
        ruleId: meterRule.id,
        priority: lifeUsed >= 97 ? "critical" : "high",
        category: "operations",
        title: `Prepare ${consumable} for ${assetName}`,
        detail: `${assetName} reports ${lifeUsed}% of the tracked ${consumable} life consumed. Confirm replacement stock before the next service window.`,
        actionLabel: "Review asset",
        entityId: event.entityId,
        eventId: event.id,
      }),
    ];
  },
};

const overdueInvoiceRule: TgosRule = {
  id: "invoice-overdue-follow-up",
  description: "Create a collection follow-up when an invoice becomes overdue.",
  evaluate(event) {
    if (event.type !== "invoice.overdue") return [];

    const customerName = String(event.payload.customerName ?? "Customer");
    const amount = Number(event.payload.amount ?? 0);
    const daysOverdue = Number(event.payload.daysOverdue ?? 0);

    return [
      recommendation({
        id: `${event.id}-collection`,
        ruleId: overdueInvoiceRule.id,
        priority: daysOverdue >= 30 ? "high" : "medium",
        category: "finance",
        title: `Follow up with ${customerName}`,
        detail: `An invoice for $${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} is ${daysOverdue} days overdue. Confirm receipt and payment status.`,
        actionLabel: "Review invoice",
        entityId: event.entityId,
        eventId: event.id,
      }),
    ];
  },
};

export const defaultRules: TgosRule[] = [
  inventoryRule,
  unscheduledServiceRule,
  meterRule,
  overdueInvoiceRule,
];

const priorityWeight: Record<Recommendation["priority"], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function runTgosBrain(
  events: TgosEvent[],
  context: Omit<RuleContext, "events">,
  rules: TgosRule[] = defaultRules,
): Recommendation[] {
  const fullContext: RuleContext = { ...context, events };

  return events
    .flatMap((event) => rules.flatMap((rule) => rule.evaluate(event, fullContext)))
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}
