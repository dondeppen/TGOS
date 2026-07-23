export type ConfigurationPhotoFinding = {
  label: string;
  value: string;
  confidence: number;
  sourceRegion: string;
};

export type ConfigurationPhotoReview = {
  id: string;
  serviceCallId: string;
  assetId: string;
  customer: string;
  manufacturer: string;
  model: string;
  capturedBy: string;
  capturedAt: string;
  imageName: string;
  reviewStatus: "pending" | "reviewed" | "needs-confirmation";
  findings: ConfigurationPhotoFinding[];
  machineSummary: string;
  callNote: string;
};

export const configurationPhotoReviews: ConfigurationPhotoReview[] = [
  {
    id: "photo-review-xerox-c9000-001",
    serviceCallId: "SC-2026-0718",
    assetId: "ASSET-XRX-C9000-01",
    customer: "Arxada",
    manufacturer: "Xerox",
    model: "VersaLink C9000",
    capturedBy: "Field Engineer",
    capturedAt: "2026-07-23T15:45:00-04:00",
    imageName: "configuration-page-c9000.jpg",
    reviewStatus: "reviewed",
    findings: [
      { label: "Serial number", value: "C9K-ARX-001", confidence: 99, sourceRegion: "Device identity" },
      { label: "Firmware", value: "101.009.019.20200", confidence: 97, sourceRegion: "Software versions" },
      { label: "IPv4 address", value: "10.24.18.44", confidence: 98, sourceRegion: "Network settings" },
      { label: "Page count", value: "684,291", confidence: 96, sourceRegion: "Usage counters" },
      { label: "Duplex", value: "Installed", confidence: 99, sourceRegion: "Installed options" },
    ],
    machineSummary: "Xerox VersaLink C9000 with current network identity, firmware level, installed duplex option, and 684,291 total impressions.",
    callNote: "Configuration page reviewed. Machine identity, firmware, network address, installed options, and meter count were added to this service call and linked to the asset record.",
  },
  {
    id: "photo-review-canon-529if-001",
    serviceCallId: "SC-2026-0721",
    assetId: "ASSET-CAN-529IF-01",
    customer: "Karschner Insurance",
    manufacturer: "Canon",
    model: "imageRUNNER DX 529iF",
    capturedBy: "Field Engineer",
    capturedAt: "2026-07-23T16:10:00-04:00",
    imageName: "canon-config-page.jpg",
    reviewStatus: "needs-confirmation",
    findings: [
      { label: "Serial number", value: "3QX02917", confidence: 98, sourceRegion: "Device information" },
      { label: "Firmware", value: "03.10", confidence: 91, sourceRegion: "Controller version" },
      { label: "IPv4 address", value: "192.168.10.42", confidence: 97, sourceRegion: "TCP/IP settings" },
      { label: "ADF", value: "Installed", confidence: 99, sourceRegion: "Installed equipment" },
      { label: "Fax", value: "Enabled", confidence: 94, sourceRegion: "Feature status" },
    ],
    machineSummary: "Canon imageRUNNER DX 529iF with ADF and fax enabled; firmware value requires technician confirmation before becoming authoritative.",
    callNote: "Configuration-page details were extracted and attached to the call. Confirm firmware 03.10 before updating the permanent asset profile.",
  },
];

export function getConfigurationPhotoSummary(
  reviews: ConfigurationPhotoReview[] = configurationPhotoReviews,
) {
  const reviewed = reviews.filter((review) => review.reviewStatus === "reviewed").length;
  const needsConfirmation = reviews.filter(
    (review) => review.reviewStatus === "needs-confirmation",
  ).length;
  const findings = reviews.reduce(
    (total, review) => total + review.findings.length,
    0,
  );
  const averageConfidence = Math.round(
    reviews.reduce(
      (reviewTotal, review) =>
        reviewTotal +
        review.findings.reduce((total, finding) => total + finding.confidence, 0),
      0,
    ) / Math.max(findings, 1),
  );

  return {
    photosReviewed: reviews.length,
    reviewed,
    needsConfirmation,
    findings,
    averageConfidence,
  };
}

export function buildServiceCallConfigurationNote(review: ConfigurationPhotoReview) {
  const details = review.findings
    .map((finding) => `${finding.label}: ${finding.value}`)
    .join("; ");

  return `${review.callNote} Extracted configuration: ${details}.`;
}
