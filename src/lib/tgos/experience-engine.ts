import { buildRepairDnaProfiles } from "./repair-dna";
import { repairLearnings, type RepairLearning } from "./learning-intelligence";

export type ExperienceLesson = {
  id: string;
  learnedAt: string;
  manufacturer: string;
  model: string;
  situation: string;
  lesson: string;
  evidence: string[];
  confidence: number;
  timesValidated: number;
  applicability: "model" | "manufacturer" | "universal";
};

export type ExperienceBriefing = {
  title: string;
  reason: string;
  recommendation: string;
  confidence: number;
  evidenceCount: number;
};

const fieldLessons: ExperienceLesson[] = [
  {
    id: "experience-xerox-media-first",
    learnedAt: "2026-07-23T17:05:00-04:00",
    manufacturer: "Xerox",
    model: "VersaLink C9000",
    situation: "Wrinkled stock, transfer timing faults, or repeated fuser contamination",
    lesson: "Inspect humidity and media condition before replacing transfer-path components.",
    evidence: [
      "High humidity correlated with wrinkled stock",
      "Media acclimation reduced repeat failures",
      "Fuser contamination followed unstable stock condition",
    ],
    confidence: 96,
    timesValidated: 7,
    applicability: "model",
  },
  {
    id: "experience-canon-feed-first",
    learnedAt: "2026-07-23T17:10:00-04:00",
    manufacturer: "Canon",
    model: "imageRUNNER DX 529iF",
    situation: "Intermittent ADF feeding or scan workflow complaints",
    lesson: "Inspect feed rollers first, then validate the entire workstation-to-device scan path.",
    evidence: [
      "Worn feed rollers caused intermittent document movement",
      "Configuration issues remained after mechanical repair",
      "End-to-end workflow validation prevented repeat visits",
    ],
    confidence: 98,
    timesValidated: 5,
    applicability: "model",
  },
  {
    id: "experience-dtf-sequence",
    learnedAt: "2026-07-23T17:15:00-04:00",
    manufacturer: "ColDesi",
    model: "12H2",
    situation: "Machine powers on but fails to move or place ink on film",
    lesson: "Follow the diagnostic order: power, motion, encoder, ink delivery, cabling, then print head.",
    evidence: [
      "Board replacement alone did not restore printing",
      "Encoder and carriage-cable faults can imitate head failure",
      "Sequential isolation reduced unnecessary part swaps",
    ],
    confidence: 91,
    timesValidated: 4,
    applicability: "model",
  },
  {
    id: "experience-validate-workflow",
    learnedAt: "2026-07-23T17:20:00-04:00",
    manufacturer: "All",
    model: "All",
    situation: "A repair appears mechanically complete",
    lesson: "Do not close the repair until the customer's complete operational workflow succeeds.",
    evidence: [
      "Mechanical fixes can leave driver, scan, network, or application issues unresolved",
      "Customer confirmation catches environment-specific failures",
      "Workflow validation improves first-time-fix performance",
    ],
    confidence: 99,
    timesValidated: 34,
    applicability: "universal",
  },
];

function lessonFromLearning(learning: RepairLearning): ExperienceLesson {
  const confidenceGain = learning.confidenceAfter - learning.confidenceBefore;

  return {
    id: `experience-${learning.id}`,
    learnedAt: learning.learnedAt,
    manufacturer: learning.manufacturer,
    model: learning.model,
    situation: learning.symptom,
    lesson: learning.correctiveAction,
    evidence: [
      `Root cause: ${learning.rootCause}`,
      `Repair duration: ${learning.laborMinutes} minutes`,
      `Confidence increased by ${confidenceGain} points`,
    ],
    confidence: learning.confidenceAfter,
    timesValidated: 1,
    applicability: "model",
  };
}

export function buildExperienceLibrary(
  learnings: RepairLearning[] = repairLearnings,
): ExperienceLesson[] {
  const extractedLessons = learnings.map(lessonFromLearning);
  const lessons = [...fieldLessons, ...extractedLessons];

  return lessons.sort((a, b) => {
    const valueA = a.confidence * Math.max(a.timesValidated, 1);
    const valueB = b.confidence * Math.max(b.timesValidated, 1);
    return valueB - valueA;
  });
}

export function getExperienceSummary(lessons = buildExperienceLibrary()) {
  const validatedLessons = lessons.filter((lesson) => lesson.timesValidated > 1);
  const averageConfidence = Math.round(
    lessons.reduce((total, lesson) => total + lesson.confidence, 0) /
      Math.max(lessons.length, 1),
  );
  const validations = lessons.reduce(
    (total, lesson) => total + lesson.timesValidated,
    0,
  );
  const coveredModels = new Set(
    lessons
      .filter((lesson) => lesson.applicability === "model")
      .map((lesson) => `${lesson.manufacturer}:${lesson.model}`),
  );

  return {
    lessonsCaptured: lessons.length,
    validatedLessons: validatedLessons.length,
    averageConfidence,
    validations,
    coveredModels: coveredModels.size,
  };
}

export function buildExperienceBriefings(): ExperienceBriefing[] {
  const profiles = buildRepairDnaProfiles();
  const lessons = buildExperienceLibrary();

  return profiles.map((profile) => {
    const matchingLessons = lessons.filter(
      (lesson) =>
        lesson.applicability === "universal" ||
        (lesson.manufacturer === profile.manufacturer &&
          lesson.model === profile.model),
    );
    const strongestLesson = matchingLessons[0];

    return {
      title: `${profile.manufacturer} ${profile.model}`,
      reason:
        profile.commonFailures[0]?.name ??
        "Historical repair behavior requires validation",
      recommendation:
        strongestLesson?.lesson ?? profile.nextBestAction,
      confidence: Math.round(
        (profile.confidence + (strongestLesson?.confidence ?? profile.confidence)) /
          2,
      ),
      evidenceCount: matchingLessons.reduce(
        (total, lesson) => total + lesson.timesValidated,
        0,
      ),
    };
  });
}
