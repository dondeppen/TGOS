import {
  buildExperienceBriefings,
  buildExperienceLibrary,
  getExperienceSummary,
  type ExperienceLesson,
} from "@/lib/tgos/experience-engine";

export function ExperienceEnginePanel() {
  const lessons = buildExperienceLibrary();
  const summary = getExperienceSummary(lessons);
  const briefings = buildExperienceBriefings();

  return (
    <section
      id="experience"
      className="mt-6 rounded-3xl border border-amber-400/30 bg-slate-900 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            TGOS Experience Engine
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Turn completed work into reusable judgment
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            COMMAND promotes repeated observations into validated lessons, best practices, and explainable repair recommendations.
          </p>
        </div>
        <span className="w-fit rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
          Experience active
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Lessons captured" value={String(summary.lessonsCaptured)} />
        <Metric label="Validated lessons" value={String(summary.validatedLessons)} />
        <Metric label="Total validations" value={String(summary.validations)} />
        <Metric label="Models covered" value={String(summary.coveredModels)} />
        <Metric label="Experience confidence" value={`${summary.averageConfidence}%`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                Validated field experience
              </p>
              <h4 className="mt-2 text-xl font-bold text-white">What TGOS now knows</h4>
            </div>
            <span className="text-xs text-slate-500">Ranked by confidence and validation</span>
          </div>

          <div className="space-y-3">
            {lessons.slice(0, 4).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              COMMAND experience briefings
            </p>
            <h4 className="mt-2 text-xl font-bold text-white">Recommended by accumulated evidence</h4>
          </div>

          <div className="space-y-3">
            {briefings.map((briefing) => (
              <article
                key={briefing.title}
                className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h5 className="font-bold text-white">{briefing.title}</h5>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
                    {briefing.confidence}%
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-300">{briefing.reason}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{briefing.recommendation}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
                  {briefing.evidenceCount} supporting validations
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LessonCard({ lesson }: { lesson: ExperienceLesson }) {
  const status = lesson.timesValidated >= 10
    ? "Company standard"
    : lesson.timesValidated > 1
      ? "Validated lesson"
      : "New observation";

  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/55 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            {lesson.manufacturer} · {lesson.model}
          </p>
          <h5 className="mt-2 font-bold text-white">{status}</h5>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
            {lesson.timesValidated} validations
          </span>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
            {lesson.confidence}%
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{lesson.situation}</p>
      <p className="mt-3 text-base font-semibold leading-7 text-slate-100">{lesson.lesson}</p>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Evidence</p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
          {lesson.evidence.slice(0, 2).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
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
