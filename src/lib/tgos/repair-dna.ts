import { repairLearnings, type RepairLearning } from "./learning-intelligence";

export type FailurePattern = {
  name: string;
  occurrences: number;
  probability: number;
};

export type RepairDnaProfile = {
  id: string;
  manufacturer: string;
  model: string;
  repairCount: number;
  firstTimeFixRate: number;
  averageRepairMinutes: number;
  confidence: number;
  healthScore: number;
  commonFailures: FailurePattern[];
  recommendedTruckStock: string[];
  seasonalSignals: string[];
  technicianExperience: Array<{
    technician: string;
    repairs: number;
    confidence: number;
  }>;
  nextBestAction: string;
};

const historicalProfiles: Omit<RepairDnaProfile, "averageRepairMinutes" | "confidence">[] = [
  {
    id: "repair-dna-xerox-c9000",
    manufacturer: "Xerox",
    model: "VersaLink C9000",
    repairCount: 18,
    firstTimeFixRate: 89,
    healthScore: 74,
    commonFailures: [
      { name: "Humidity and media instability", occurrences: 7, probability: 39 },
      { name: "Fuser contamination", occurrences: 5, probability: 28 },
      { name: "IBT timing or wear", occurrences: 4, probability: 22 },
    ],
    recommendedTruckStock: ["Fuser assembly", "IBT belt", "Transfer-path cleaning kit"],
    seasonalSignals: ["Summer humidity increases wrinkle and transfer faults", "Acclimate stored media for 48 hours"],
    technicianExperience: [{ technician: "Don", repairs: 18, confidence: 96 }],
    nextBestAction: "Verify humidity and media condition before replacing transfer components.",
  },
  {
    id: "repair-dna-canon-529if",
    manufacturer: "Canon",
    model: "imageRUNNER DX 529iF",
    repairCount: 11,
    firstTimeFixRate: 96,
    healthScore: 92,
    commonFailures: [
      { name: "ADF feed roller wear", occurrences: 5, probability: 45 },
      { name: "Scan destination configuration", occurrences: 3, probability: 27 },
      { name: "Separation-pad wear", occurrences: 2, probability: 18 },
    ],
    recommendedTruckStock: ["ADF feed rollers", "Separation pad", "T03 toner"],
    seasonalSignals: ["Feed complaints increase during dry winter conditions"],
    technicianExperience: [{ technician: "Don", repairs: 11, confidence: 98 }],
    nextBestAction: "Inspect feed rollers first, then validate the complete scan workflow from the user workstation.",
  },
  {
    id: "repair-dna-coldesi-12h2",
    manufacturer: "ColDesi",
    model: "12H2",
    repairCount: 4,
    firstTimeFixRate: 75,
    healthScore: 68,
    commonFailures: [
      { name: "Ink-delivery interruption", occurrences: 2, probability: 50 },
      { name: "Carriage or encoder fault", occurrences: 1, probability: 25 },
      { name: "Print-head failure", occurrences: 1, probability: 25 },
    ],
    recommendedTruckStock: ["Carriage cable", "Encoder cleaning supplies", "Known-good print head"],
    seasonalSignals: ["Extended idle periods increase ink-delivery risk"],
    technicianExperience: [{ technician: "Don", repairs: 4, confidence: 84 }],
    nextBestAction: "Follow the diagnostic sequence: power, motion, encoder, ink delivery, cabling, then print head.",
  },
];

function matchingLearnings(
  manufacturer: string,
  model: string,
  learnings: RepairLearning[],
): RepairLearning[] {
  return learnings.filter(
    (learning) =>
      learning.manufacturer === manufacturer && learning.model === model,
  );
}

export function buildRepairDnaProfiles(
  learnings: RepairLearning[] = repairLearnings,
): RepairDnaProfile[] {
  return historicalProfiles.map((profile) => {
    const matches = matchingLearnings(profile.manufacturer, profile.model, learnings);
    const totalMinutes = matches.reduce(
      (total, learning) => total + learning.laborMinutes,
      0,
    );
    const averageRepairMinutes = matches.length
      ? Math.round(totalMinutes / matches.length)
      : 0;
    const confidence = matches.length
      ? Math.round(
          matches.reduce(
            (total, learning) => total + learning.confidenceAfter,
            0,
          ) / matches.length,
        )
      : profile.technicianExperience[0]?.confidence ?? 0;

    return {
      ...profile,
      repairCount: profile.repairCount + matches.length,
      averageRepairMinutes,
      confidence,
    };
  });
}

export function getRepairDnaSummary(profiles = buildRepairDnaProfiles()) {
  const fleetHealth = Math.round(
    profiles.reduce((total, profile) => total + profile.healthScore, 0) /
      Math.max(profiles.length, 1),
  );
  const firstTimeFixRate = Math.round(
    profiles.reduce((total, profile) => total + profile.firstTimeFixRate, 0) /
      Math.max(profiles.length, 1),
  );
  const averageConfidence = Math.round(
    profiles.reduce((total, profile) => total + profile.confidence, 0) /
      Math.max(profiles.length, 1),
  );

  return {
    trackedModels: profiles.length,
    fleetHealth,
    firstTimeFixRate,
    averageConfidence,
  };
}
