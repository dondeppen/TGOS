import {
  buildServiceCallConfigurationNote,
  configurationPhotoReviews,
  getConfigurationPhotoSummary,
  type ConfigurationPhotoReview,
} from "@/lib/tgos/configuration-photo-intelligence";

export function ConfigurationPhotoIntelligencePanel() {
  const summary = getConfigurationPhotoSummary();

  return (
    <section
      id="visual-memory"
      className="mt-6 rounded-3xl border border-sky-400/30 bg-slate-900 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300">
            Configuration Intelligence
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Field photos become machine records
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            COMMAND reviews configuration-page photos, extracts machine data, flags uncertain values, and adds a structured snapshot to the service call and asset history.
          </p>
        </div>
        <span className="w-fit rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
          Visual Memory live
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Photos reviewed" value={String(summary.photosReviewed)} />
        <Metric label="Approved" value={String(summary.reviewed)} />
        <Metric label="Needs confirmation" value={String(summary.needsConfirmation)} />
        <Metric label="Fields extracted" value={String(summary.findings)} />
        <Metric label="Average confidence" value={`${summary.averageConfidence}%`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {configurationPhotoReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: ConfigurationPhotoReview }) {
  const needsConfirmation = review.reviewStatus === "needs-confirmation";

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            {review.customer} · {review.serviceCallId}
          </p>
          <h4 className="mt-2 text-xl font-bold text-white">
            {review.manufacturer} {review.model}
          </h4>
          <p className="mt-1 text-sm text-slate-500">{review.imageName}</p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
            needsConfirmation
              ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
              : "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
          }`}
        >
          {needsConfirmation ? "Confirm values" : "Reviewed"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{review.machineSummary}</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {review.findings.map((finding) => (
          <div
            key={`${finding.label}-${finding.value}`}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {finding.label}
                </p>
                <p className="mt-1 break-words font-semibold text-slate-100">{finding.value}</p>
              </div>
              <span className="text-xs font-bold text-sky-300">{finding.confidence}%</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">{finding.sourceRegion}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-800 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
          Service-call update
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {buildServiceCallConfigurationNote(review)}
        </p>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </article>
  );
}
