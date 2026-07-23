export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
          Operational Intelligence Platform
        </p>

        <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
          TGOS
        </h1>

        <p className="mt-4 text-xl text-slate-300 sm:text-2xl">
          Tek Guy Operating System
        </p>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
          Observe. Organize. Learn. Recommend.
        </p>

        <div className="mt-10">
          <button
            type="button"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Enter Command Center
          </button>
        </div>

        <p className="mt-16 text-sm text-slate-500">
          Genesis v0.1 · Powered by Tek Guy On Demand
        </p>
      </section>
    </main>
  );
}