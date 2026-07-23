import { buildAssetDigitalTwins } from "./asset-digital-twin";
import { buildRepairDnaProfiles } from "./repair-dna";

export type CopilotEvidence = {
  label: string;
  value: string;
  source: string;
};

export type CopilotServiceStrategy = {
  assetId: string;
  customer: string;
  assetName: string;
  healthScore: number;
  confidence: number;
  estimatedMinutes: number;
  primaryHypothesis: string;
  supportingEvidence: CopilotEvidence[];
  bringWithYou: string[];
  recommendedSequence: string[];
  customerMessage: string;
  explanation: string;
};

export function buildCopilotServiceStrategies(): CopilotServiceStrategy[] {
  const twins = buildAssetDigitalTwins();
  const repairProfiles = buildRepairDnaProfiles();

  return twins.map((twin) => {
    const repairProfile = repairProfiles.find(
      (profile) =>
        profile.manufacturer === twin.manufacturer && profile.model === twin.model,
    );
    const topFailure = repairProfile?.commonFailures[0];
    const confidence = Math.min(
      99,
      Math.round(
        ((repairProfile?.confidence ?? 82) +
          (repairProfile?.firstTimeFixRate ?? 85) +
          twin.healthScore) /
          3,
      ),
    );
    const estimatedMinutes = Math.max(
      30,
      repairProfile?.averageRepairMinutes ||
        Math.round(120 - confidence * 0.75),
    );

    return {
      assetId: twin.assetId,
      customer: twin.customer,
      assetName: `${twin.manufacturer} ${twin.model}`,
      healthScore: twin.healthScore,
      confidence,
      estimatedMinutes,
      primaryHypothesis:
        topFailure?.name ?? "Configuration or workflow variance",
      supportingEvidence: [
        {
          label: "Repair DNA",
          value: topFailure
            ? `${topFailure.probability}% historical probability across ${topFailure.occurrences} observed cases`
            : "No dominant failure pattern yet",
          source: "Repair DNA",
        },
        {
          label: "Asset health",
          value: `${twin.healthScore}% with ${twin.risk} risk classification`,
          source: "Digital Twin",
        },
        {
          label: "Machine memory",
          value: `${twin.timeline.length} documented lifecycle events available for reasoning`,
          source: "Asset timeline",
        },
        {
          label: "Configuration state",
          value: `${Object.keys(twin.configuration).length} verified or reviewable configuration values`,
          source: "Configuration Photo Intelligence",
        },
      ],
      bringWithYou: repairProfile?.recommendedTruckStock ?? [
        "Standard diagnostic kit",
        "Known-good network cable",
        "Cleaning supplies",
      ],
      recommendedSequence: [
        "Confirm the reported symptom and reproduce the failure.",
        repairProfile?.nextBestAction ?? twin.nextBestAction,
        "Compare current configuration and visual evidence against the Digital Twin.",
        "Complete the least-invasive corrective action first.",
        "Record the outcome so COMMAND can score and improve this recommendation.",
      ],
      customerMessage: `COMMAND has prepared a service strategy for the ${twin.manufacturer} ${twin.model}. The current estimate is ${estimatedMinutes} minutes, subject to onsite findings.`,
      explanation: `This strategy is based on the machine's lifecycle history, current configuration, health score, and the strongest recurring repair pattern for this model.`,
    };
  });
}

export function getCopilotSummary(
  strategies = buildCopilotServiceStrategies(),
) {
  return {
    strategiesReady: strategies.length,
    averageConfidence: Math.round(
      strategies.reduce((total, strategy) => total + strategy.confidence, 0) /
        Math.max(strategies.length, 1),
    ),
    truckStockItems: new Set(
      strategies.flatMap((strategy) => strategy.bringWithYou),
    ).size,
    estimatedFieldMinutes: strategies.reduce(
      (total, strategy) => total + strategy.estimatedMinutes,
      0,
    ),
  };
}
