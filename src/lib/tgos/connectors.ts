import type { TgosEvent } from "@/lib/tgos/types";

export type ConnectorStatus =
  | "connected"
  | "degraded"
  | "disconnected"
  | "not_configured";

export interface ConnectorSyncContext {
  now: Date;
  cursor?: string;
  limit?: number;
}

export interface ConnectorSyncResult {
  connectorId: string;
  startedAt: string;
  completedAt: string;
  status: Exclude<ConnectorStatus, "not_configured">;
  events: TgosEvent[];
  nextCursor?: string;
  warnings: string[];
}

export interface TgosConnector {
  id: string;
  name: string;
  category:
    | "communication"
    | "scheduling"
    | "finance"
    | "website"
    | "inventory"
    | "telemetry"
    | "dispatch"
    | "crm";
  description: string;
  status(): Promise<ConnectorStatus>;
  sync(context: ConnectorSyncContext): Promise<ConnectorSyncResult>;
}

export interface ConnectorRunSummary {
  startedAt: string;
  completedAt: string;
  connectorsAttempted: number;
  connectorsConnected: number;
  connectorsDegraded: number;
  connectorsSkipped: number;
  events: TgosEvent[];
  results: ConnectorSyncResult[];
  warnings: string[];
}

export class ConnectorRegistry {
  private readonly connectors = new Map<string, TgosConnector>();

  register(connector: TgosConnector): this {
    if (this.connectors.has(connector.id)) {
      throw new Error(`Connector ${connector.id} is already registered.`);
    }

    this.connectors.set(connector.id, connector);
    return this;
  }

  get(connectorId: string): TgosConnector | undefined {
    return this.connectors.get(connectorId);
  }

  list(): TgosConnector[] {
    return [...this.connectors.values()];
  }

  async runAll(
    context: Partial<ConnectorSyncContext> = {},
  ): Promise<ConnectorRunSummary> {
    const startedAt = new Date();
    const now = context.now ?? startedAt;
    const results: ConnectorSyncResult[] = [];
    const warnings: string[] = [];
    let connectorsConnected = 0;
    let connectorsDegraded = 0;
    let connectorsSkipped = 0;

    for (const connector of this.connectors.values()) {
      const status = await connector.status();

      if (status === "not_configured" || status === "disconnected") {
        connectorsSkipped += 1;
        warnings.push(`${connector.name} was skipped because it is ${status.replace("_", " ")}.`);
        continue;
      }

      try {
        const result = await connector.sync({
          now,
          cursor: context.cursor,
          limit: context.limit,
        });

        results.push(result);
        warnings.push(...result.warnings);

        if (result.status === "degraded") {
          connectorsDegraded += 1;
        } else {
          connectorsConnected += 1;
        }
      } catch (error) {
        connectorsDegraded += 1;
        warnings.push(
          `${connector.name} failed to synchronize: ${error instanceof Error ? error.message : "unknown error"}`,
        );
      }
    }

    const completedAt = new Date();

    return {
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      connectorsAttempted: this.connectors.size,
      connectorsConnected,
      connectorsDegraded,
      connectorsSkipped,
      events: results.flatMap((result) => result.events),
      results,
      warnings,
    };
  }
}

export function createStaticConnector(input: {
  id: string;
  name: string;
  category: TgosConnector["category"];
  description: string;
  events: TgosEvent[];
}): TgosConnector {
  return {
    id: input.id,
    name: input.name,
    category: input.category,
    description: input.description,
    async status() {
      return "connected";
    },
    async sync(context) {
      const startedAt = new Date();
      const events = [...input.events]
        .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
        .slice(0, context.limit ?? input.events.length);

      return {
        connectorId: input.id,
        startedAt: startedAt.toISOString(),
        completedAt: new Date().toISOString(),
        status: "connected",
        events,
        warnings: [],
      };
    },
  };
}
