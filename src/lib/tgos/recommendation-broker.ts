import type { Priority, Recommendation } from "@/lib/tgos/types";

const priorityWeight: Record<Priority, number> = {
  critical: 400,
  high: 300,
  medium: 200,
  low: 100,
};

export interface BrokeredRecommendation extends Recommendation {
  score: number;
  duplicateCount: number;
  supportingRecommendationIds: string[];
  reasons: string[];
}

export interface RecommendationBrokerOptions {
  maximumResults?: number;
  recencyWindowHours?: number;
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function recommendationKey(recommendation: Recommendation): string {
  return [
    recommendation.entityId,
    recommendation.category,
    normalize(recommendation.title),
    normalize(recommendation.actionLabel),
  ].join("::");
}

function recencyScore(createdAt: string, now: Date, windowHours: number): number {
  const created = new Date(createdAt);
  const ageHours = Math.max(0, (now.getTime() - created.getTime()) / 3_600_000);

  if (ageHours >= windowHours) {
    return 0;
  }

  return Math.round((1 - ageHours / windowHours) * 50);
}

export class RecommendationBroker {
  broker(
    recommendations: Recommendation[],
    options: RecommendationBrokerOptions = {},
  ): BrokeredRecommendation[] {
    const now = new Date();
    const maximumResults = options.maximumResults ?? 10;
    const recencyWindowHours = options.recencyWindowHours ?? 72;
    const grouped = new Map<string, Recommendation[]>();

    for (const recommendation of recommendations) {
      const key = recommendationKey(recommendation);
      const group = grouped.get(key) ?? [];
      group.push(recommendation);
      grouped.set(key, group);
    }

    return [...grouped.values()]
      .map((group) => {
        const ranked = [...group].sort((a, b) => {
          const priorityDifference =
            priorityWeight[b.priority] - priorityWeight[a.priority];

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        });

        const primary = ranked[0];
        const duplicateCount = ranked.length - 1;
        const consensusScore = Math.min(100, duplicateCount * 20);
        const score =
          priorityWeight[primary.priority] +
          recencyScore(primary.createdAt, now, recencyWindowHours) +
          consensusScore;

        return {
          ...primary,
          score,
          duplicateCount,
          supportingRecommendationIds: ranked.map(
            (recommendation) => recommendation.id,
          ),
          reasons: [
            `${primary.priority} priority`,
            `${primary.category} operational category`,
            duplicateCount > 0
              ? `${ranked.length} independent recommendations agree`
              : "single-source recommendation",
          ],
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      })
      .slice(0, maximumResults);
  }

  highestValueAction(
    recommendations: Recommendation[],
  ): BrokeredRecommendation | null {
    return this.broker(recommendations, { maximumResults: 1 })[0] ?? null;
  }
}
