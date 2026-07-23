"use client";

import { useState } from "react";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isSigningOut}
      className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-cyan-300/50 hover:text-cyan-200 disabled:opacity-60"
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
