import { runTgosBrain } from "@/lib/tgos/brain";
import type { TgosEventStore } from "@/lib/tgos/event-store";
import type { Recommendation, TgosEvent, TgosRule } from "@/lib/tgos/types";

export interface ProcessEventResult {
  event: TgosEvent;
  recommendations: Recommendation[];
}

export class TgosEventProcessor {
  constructor(
    private readonly store: TgosEventStore,
    private readonly rules?: TgosRule[],
  ) {}

  async process(event: TgosEvent): Promise<ProcessEventResult> {
    await this.store.appendEvent(event);

    const snapshot = await this.store.snapshot();
    const recommendations = runTgosBrain(
      snapshot.events,
      {
        entities: snapshot.entities,
        relationships: snapshot.relationships,
      },
      this.rules,
    );

    await this.store.appendRecommendations(recommendations);

    return {
      event,
      recommendations: recommendations.filter(
        (recommendation) => recommendation.eventId === event.id,
      ),
    };
  }

  async replay(): Promise<Recommendation[]> {
    const snapshot = await this.store.snapshot();
    const recommendations = runTgosBrain(
      snapshot.events,
      {
        entities: snapshot.entities,
        relationships: snapshot.relationships,
      },
      this.rules,
    );

    await this.store.appendRecommendations(recommendations);
    return recommendations;
  }
}
