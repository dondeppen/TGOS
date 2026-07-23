export type EntityType =
  | "customer"
  | "location"
  | "asset"
  | "service_call"
  | "inventory_item"
  | "technician"
  | "invoice";

export type EventType =
  | "service_call.opened"
  | "service_call.scheduled"
  | "inventory.level_updated"
  | "asset.meter_updated"
  | "customer.contact_updated"
  | "invoice.overdue";

export type Priority = "critical" | "high" | "medium" | "low";

export interface TgosEntity {
  id: string;
  type: EntityType;
  name: string;
  attributes: Record<string, string | number | boolean | null>;
}

export interface TgosRelationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: string;
}

export interface TgosEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  type: EventType;
  occurredAt: string;
  source: string;
  entityId: string;
  payload: TPayload;
}

export interface Recommendation {
  id: string;
  ruleId: string;
  priority: Priority;
  category: "service" | "inventory" | "customer" | "finance" | "operations";
  title: string;
  detail: string;
  actionLabel: string;
  entityId: string;
  eventId: string;
  createdAt: string;
}

export interface RuleContext {
  entities: TgosEntity[];
  relationships: TgosRelationship[];
  events: TgosEvent[];
}

export interface TgosRule {
  id: string;
  description: string;
  evaluate: (event: TgosEvent, context: RuleContext) => Recommendation[];
}
