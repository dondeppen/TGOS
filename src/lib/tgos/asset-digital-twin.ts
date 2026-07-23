import { configurationPhotoReviews } from "./configuration-photo-intelligence";
import { buildRepairDnaProfiles } from "./repair-dna";

export type AssetTimelineEvent = {
  id: string;
  occurredAt: string;
  type: "installed" | "configuration" | "repair" | "firmware" | "network" | "inspection";
  title: string;
  detail: string;
  source: string;
};

export type AssetDigitalTwin = {
  assetId: string;
  customer: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  healthScore: number;
  risk: "low" | "medium" | "high";
  configuration: Record<string, string>;
  timeline: AssetTimelineEvent[];
  nextBestAction: string;
};

const historicalEvents: Record<string, AssetTimelineEvent[]> = {
  "ASSET-XRX-C9000-01": [
    {
      id: "xrx-installed",
      occurredAt: "2023-03-14T09:00:00-04:00",
      type: "installed",
      title: "Asset commissioned",
      detail: "Xerox VersaLink C9000 placed into production.",
      source: "Asset record",
    },
    {
      id: "xrx-humidity",
      occurredAt: "2025-08-11T11:15:00-04:00",
      type: "inspection",
      title: "Environmental risk identified",
      detail: "Wrinkled media and elevated humidity documented.",
      source: "Field service",
    },
    {
      id: "xrx-fuser",
      occurredAt: "2026-02-19T13:40:00-05:00",
      type: "repair",
      title: "Fuser and imaging path serviced",
      detail: "Fuser contamination corrected and imaging consumables refreshed.",
      source: "Service call",
    },
  ],
  "ASSET-CAN-529IF-01": [
    {
      id: "canon-installed",
      occurredAt: "2025-01-22T10:00:00-05:00",
      type: "installed",
      title: "Asset installed",
      detail: "Canon imageRUNNER DX 529iF configured for six workstations, fax, and scanning.",
      source: "Installation record",
    },
    {
      id: "canon-rollers",
      occurredAt: "2025-11-06T14:30:00-05:00",
      type: "repair",
      title: "ADF feed path restored",
      detail: "Feed rollers replaced and scan workflow validated.",
      source: "Service call",
    },
  ],
};

export function buildAssetDigitalTwins(): AssetDigitalTwin[] {
  const repairProfiles = buildRepairDnaProfiles();

  return configurationPhotoReviews.map((review) => {
    const configuration = Object.fromEntries(
      review.findings.map((finding) => [finding.label, finding.value]),
    );
    const repairProfile = repairProfiles.find(
      (profile) =>
        profile.manufacturer === review.manufacturer && profile.model === review.model,
    );
    const photoEvent: AssetTimelineEvent = {
      id: `configuration-${review.id}`,
      occurredAt: review.capturedAt,
      type: "configuration",
      title: "Configuration snapshot reviewed",
      detail: review.machineSummary,
      source: review.imageName,
    };

    const timeline = [...(historicalEvents[review.assetId] ?? []), photoEvent].sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );
    const healthScore = repairProfile?.healthScore ?? 85;

    return {
      assetId: review.assetId,
      customer: review.customer,
      manufacturer: review.manufacturer,
      model: review.model,
      serialNumber: configuration["Serial number"] ?? "Pending",
      healthScore,
      risk: healthScore >= 90 ? "low" : healthScore >= 75 ? "medium" : "high",
      configuration,
      timeline,
      nextBestAction:
        review.reviewStatus === "needs-confirmation"
          ? "Confirm low-confidence configuration values before updating the permanent asset record."
          : repairProfile?.nextBestAction ?? "Continue normal monitoring.",
    };
  });
}

export function getDigitalTwinSummary(twins = buildAssetDigitalTwins()) {
  const timelineEvents = twins.reduce(
    (total, twin) => total + twin.timeline.length,
    0,
  );
  const averageHealth = Math.round(
    twins.reduce((total, twin) => total + twin.healthScore, 0) /
      Math.max(twins.length, 1),
  );

  return {
    assetsTracked: twins.length,
    timelineEvents,
    averageHealth,
    assetsAtRisk: twins.filter((twin) => twin.risk !== "low").length,
  };
}
