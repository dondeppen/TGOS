import type {
  TgosEntity,
  TgosEvent,
  TgosRelationship,
} from "@/lib/tgos/types";

export const seedEntities: TgosEntity[] = [
  {
    id: "customer-reliasource",
    type: "customer",
    name: "ReliaSource",
    attributes: { status: "active", accountOwner: "Don Deppen" },
  },
  {
    id: "location-ssa-williamsport",
    type: "location",
    name: "SSA Williamsport",
    attributes: { city: "Williamsport", state: "PA" },
  },
  {
    id: "asset-xerox-c9000-01",
    type: "asset",
    name: "Xerox VersaLink C9000",
    attributes: { serialNumber: "TGOS-DEMO-9000", status: "active" },
  },
  {
    id: "inventory-xerox-drum",
    type: "inventory_item",
    name: "Xerox C9000 Drum Cartridge",
    attributes: { sku: "101R00602", preferredStock: 4 },
  },
  {
    id: "service-ssa-phone-refresh",
    type: "service_call",
    name: "SSA Williamsport Phone Refresh",
    attributes: { status: "open", estimatedHours: 4 },
  },
  {
    id: "invoice-reliasource-1042",
    type: "invoice",
    name: "Invoice 1042",
    attributes: { status: "overdue", currency: "USD" },
  },
];

export const seedRelationships: TgosRelationship[] = [
  {
    id: "rel-customer-location",
    fromEntityId: "customer-reliasource",
    toEntityId: "location-ssa-williamsport",
    type: "services",
  },
  {
    id: "rel-location-asset",
    fromEntityId: "location-ssa-williamsport",
    toEntityId: "asset-xerox-c9000-01",
    type: "contains",
  },
  {
    id: "rel-service-location",
    fromEntityId: "service-ssa-phone-refresh",
    toEntityId: "location-ssa-williamsport",
    type: "scheduled_at",
  },
];

export const seedEvents: TgosEvent[] = [
  {
    id: "event-inventory-drum-low",
    type: "inventory.level_updated",
    occurredAt: "2026-07-23T13:18:00-04:00",
    source: "inventory",
    entityId: "inventory-xerox-drum",
    payload: {
      itemName: "Xerox C9000 drums",
      onHand: 1,
      reorderPoint: 3,
    },
  },
  {
    id: "event-service-opened",
    type: "service_call.opened",
    occurredAt: "2026-07-23T12:45:00-04:00",
    source: "service",
    entityId: "service-ssa-phone-refresh",
    payload: {
      customerName: "SSA Williamsport",
      summary: "VOIP phone refresh and MP508 installation",
      scheduled: false,
      urgent: false,
    },
  },
  {
    id: "event-meter-c9000",
    type: "asset.meter_updated",
    occurredAt: "2026-07-23T11:32:00-04:00",
    source: "asset-monitoring",
    entityId: "asset-xerox-c9000-01",
    payload: {
      assetName: "Xerox VersaLink C9000",
      consumable: "drum",
      lifeUsedPercent: 94,
    },
  },
  {
    id: "event-invoice-overdue",
    type: "invoice.overdue",
    occurredAt: "2026-07-23T09:10:00-04:00",
    source: "finance",
    entityId: "invoice-reliasource-1042",
    payload: {
      customerName: "ReliaSource",
      amount: 400,
      daysOverdue: 12,
    },
  },
];
