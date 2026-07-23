export type RepairLearning = {
  id: string;
  learnedAt: string;
  customer: string;
  manufacturer: string;
  model: string;
  symptom: string;
  rootCause: string;
  correctiveAction: string;
  partsUsed: string[];
  laborMinutes: number;
  confidenceBefore: number;
  confidenceAfter: number;
};

export const repairLearnings: RepairLearning[] = [
  {
    id: "learning-coldesi-12h2-001",
    learnedAt: "2026-07-23T16:00:00-04:00",
    customer: "Fran Horton",
    manufacturer: "ColDesi",
    model: "12H2",
    symptom: "Printer requires evaluation before parts can be identified.",
    rootCause: "Pending field diagnosis",
    correctiveAction: "Use the Mission Control playbook to isolate power, motion, ink delivery, cable, and print-head faults in sequence.",
    partsUsed: [],
    laborMinutes: 90,
    confidenceBefore: 72,
    confidenceAfter: 81,
  },
  {
    id: "learning-xerox-c9000-001",
    learnedAt: "2026-07-22T14:30:00-04:00",
    customer: "Arxada",
    manufacturer: "Xerox",
    model: "VersaLink C9000",
    symptom: "Wrinkled stock, transfer timing faults, and fuser contamination.",
    rootCause: "High humidity and unstable media condition",
    correctiveAction: "Stabilize humidity, acclimate media, inspect the transfer path, and replace contaminated wear components as required.",
    partsUsed: ["Fuser assembly", "IBT belt"],
    laborMinutes: 150,
    confidenceBefore: 78,
    confidenceAfter: 93,
  },
  {
    id: "learning-canon-529if-001",
    learnedAt: "2026-07-21T11:15:00-04:00",
    customer: "Karschner Insurance",
    manufacturer: "Canon",
    model: "imageRUNNER DX 529iF",
    symptom: "Intermittent document feeding and scanning setup issues.",
    rootCause: "Worn feed components and workstation configuration",
    correctiveAction: "Replace worn feed rollers, verify scan destination settings, and validate the complete user workflow.",
    partsUsed: ["ADF feed rollers"],
    laborMinutes: 75,
    confidenceBefore: 84,
    confidenceAfter: 96,
  },
];

export function getDailyLearningSummary(learnings = repairLearnings) {
  const newRepairs = learnings.length;
  const averageConfidenceGain = Math.round(
    learnings.reduce(
      (total, learning) =>
        total + (learning.confidenceAfter - learning.confidenceBefore),
      0,
    ) / Math.max(newRepairs, 1),
  );
  const totalLaborMinutes = learnings.reduce(
    (total, learning) => total + learning.laborMinutes,
    0,
  );
  const manufacturers = new Set(learnings.map((learning) => learning.manufacturer));

  return {
    newRepairs,
    averageConfidenceGain,
    totalLaborMinutes,
    manufacturerCount: manufacturers.size,
  };
}
