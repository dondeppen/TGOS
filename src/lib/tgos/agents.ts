import type {
  Recommendation,
  RuleContext,
  TgosEvent,
} from "@/lib/tgos/types";

export interface TgosAgentContext extends RuleContext {
  recommendations: Recommendation[];
  now: string;
}

export interface TgosAgentResult {
  recommendations?: Recommendation[];
  events?: TgosEvent[];
  notes?: string[];
}

export interface TgosAgent {
  id: string;
  name: string;
  description: string;
  subscriptions: TgosEvent["type"][] | ["*"];
  evaluate: (
    event: TgosEvent,
    context: TgosAgentContext,
  ) => Promise<TgosAgentResult> | TgosAgentResult;
}

export interface AgentExecution {
  agentId: string;
  agentName: string;
  eventId: string;
  startedAt: string;
  completedAt: string;
  result: TgosAgentResult;
}

export class TgosAgentRuntime {
  private readonly agents = new Map<string, TgosAgent>();

  register(agent: TgosAgent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`TGOS agent already registered: ${agent.id}`);
    }

    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  listAgents(): TgosAgent[] {
    return [...this.agents.values()];
  }

  async dispatch(
    event: TgosEvent,
    context: TgosAgentContext,
  ): Promise<AgentExecution[]> {
    const subscribers = this.listAgents().filter((agent) =>
      agent.subscriptions.includes("*") ||
      agent.subscriptions.includes(event.type),
    );

    return Promise.all(
      subscribers.map(async (agent) => {
        const startedAt = new Date().toISOString();
        const result = await agent.evaluate(event, context);

        return {
          agentId: agent.id,
          agentName: agent.name,
          eventId: event.id,
          startedAt,
          completedAt: new Date().toISOString(),
          result,
        };
      }),
    );
  }
}
