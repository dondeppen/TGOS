import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Owner Access | TGOS",
  description: "Secure owner access to the TGOS command center.",
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.12),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            TGOS
          </Link>
          <span className="text-xs uppercase tracking-[0.25em] text-slate-600">Owner portal · v0.4</span>
        </header>

        <section className="grid items-center gap-14 py-16 lg:grid-cols-[1fr_420px] lg:gap-24">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Tek Guy Operating System</p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-7xl">
              The signal is waiting.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Enter the owner portal to see what changed, what matters, and what COMMAND recommends next.
            </p>
            <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
              Operational intelligence online
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/20 backdrop-blur sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Restricted access</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Welcome back, Don.</h2>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-300">SECURE</span>
            </div>
            <LoginForm />
            <p className="mt-6 text-center text-xs leading-5 text-slate-600">Owner credentials are verified server-side. Your session is protected by an HTTP-only signed cookie.</p>
          </div>
        </section>

        <footer className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:justify-between">
          <span>Observe · Remember · Reason · Recommend · Act</span>
          <span>Tek Guy On Demand</span>
        </footer>
      </div>
    </main>
  );
}
