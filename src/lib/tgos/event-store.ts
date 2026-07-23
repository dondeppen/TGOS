import type {
  Recommendation,
  TgosEntity,
  TgosEvent,
  TgosRelationship,
} from "@/lib/tgos/types";

export interface EventStoreSnapshot {
  entities: TgosEntity[];
  relationships: TgosRelationship[];
  events: TgosEvent[];
  recommendations: Recommendation[];
}

export interface TgosEventStore {
  appendEvent(event: TgosEvent): Promise<void>;
  appendRecommendations(recommendations: Recommendation[]): Promise<void>;
  listEvents(): Promise<TgosEvent[]>;
  listRecommendations(): Promise<Recommendation[]>;
  snapshot(): Promise<EventStoreSnapshot>;
}

export class MemoryEventStore implements TgosEventStore {
  private readonly entityRecords = new Map<string, TgosEntity>();
  private readonly relationshipRecords = new Map<string, TgosRelationship>();
  private readonly eventRecords = new Map<string, TgosEvent>();
  private readonly recommendationRecords = new Map<string, Recommendation>();

  constructor(seed?: Partial<EventStoreSnapshot>) {
    seed?.entities?.forEach((entity) => this.entityRecords.set(entity.id, entity));
    seed?.relationships?.forEach((relationship) =>
      this.relationshipRecords.set(relationship.id, relationship),
    );
    seed?.events?.forEach((event) => this.eventRecords.set(event.id, event));
    seed?.recommendations?.forEach((recommendation) =>
      this.recommendationRecords.set(recommendation.id, recommendation),
    );
  }

  async appendEvent(event: TgosEvent): Promise<void> {
    if (this.eventRecords.has(event.id)) {
      throw new Error(`Event ${event.id} already exists. TGOS events are append-only.`);
    }

    this.eventRecords.set(event.id, structuredClone(event));
  }

  async appendRecommendations(
    recommendations: Recommendation[],
  ): Promise<void> {
    recommendations.forEach((recommendation) => {
      this.recommendationRecords.set(
        recommendation.id,
        structuredClone(recommendation),
      );
    });
  }

  async listEvents(): Promise<TgosEvent[]> {
    return Array.from(this.eventRecords.values())
      .map((event) => structuredClone(event))
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      );
  }

  async listRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendationRecords.values()).map((recommendation) =>
      structuredClone(recommendation),
    );
  }

  async snapshot(): Promise<EventStoreSnapshot> {
    return {
      entities: Array.from(this.entityRecords.values()).map((entity) =>
        structuredClone(entity),
      ),
      relationships: Array.from(this.relationshipRecords.values()).map(
        (relationship) => structuredClone(relationship),
      ),
      events: await this.listEvents(),
      recommendations: await this.listRecommendations(),
    };
  }
}
