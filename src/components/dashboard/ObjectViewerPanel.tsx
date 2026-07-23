"use client";

import { useMemo, useState } from "react";

import { buildTgosObjects, getObjectFrameworkSummary, type TgosObject } from "@/lib/tgos/object-framework";
import { searchSuggestions, universalSearch } from "@/lib/tgos/universal-search";

function typeLabel(type: TgosObject["type"]): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function statusClasses(status: TgosObject["status"]): string {
  if (status === "attention") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  if (status === "active") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (status === "planned") return "border-cyan-300/20 bg-cyan-300/10 text-cyan-200";
  return "border-slate-700 bg-slate-800 text-slate-300";
}

export function ObjectViewerPanel() {
  const objects = useMemo(() => buildTgosObjects(), []);
  const summary = useMemo(() => getObjectFrameworkSummary(), []);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(objects[0]?.id ?? "");

  const results = useMemo(() => {
    if (!query.trim()) return objects.slice(0, 8).map((object) => ({ id: object.id }));
    return universalSearch(query).slice(0, 8);
  }, [objects, query]);

  const selected = objects.find((object) => object.id === selectedId) ?? objects[0];

  if (!selected) return null;

  return (
    <section id="objects" className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/55 p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">COMMAND Object Framework</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Universal Object Viewer</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Search once, open any operational object, and inspect its health, intelligence, relationships, and recommended actions through one consistent interface.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Objects", summary.totalObjects],
            ["Relationships", summary.relationships],
            ["Types", summary.objectTypes],
            ["Attention", summary.attentionObjects],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/65 p-4">
          <label htmlFor="command-search" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Search anything
          </label>
          <input
            id="command-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Customer, site, asset, contact..."
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {searchSuggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">No connected object matched that search.</div>
            ) : (
              results.map((result) => {
                const object = objects.find((item) => item.id === result.id);
                if (!object) return null;
                const active = object.id === selected.id;

                return (
                  <button
                    key={object.id}
                    type="button"
                    onClick={() => setSelectedId(object.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-cyan-400/50 bg-cyan-400/10"
                        : "border-slate-800 bg-slate-900/65 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-100">{object.label}</span>
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{typeLabel(object.type)}</span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{object.subtitle}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  {typeLabel(selected.type)} object
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${statusClasses(selected.status)}`}>
                  {selected.status}
                </span>
              </div>
              <h3 className="mt-4 text-3xl font-black text-slate-100">{selected.label}</h3>
              <p className="mt-1 text-sm text-slate-400">{selected.subtitle}</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Health</p>
              <p className="mt-1 text-3xl font-black text-cyan-300">{selected.healthScore}%</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">COMMAND Summary</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{selected.summary}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Capabilities</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.capabilities.map((capability) => (
                    <span key={capability} className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Relationships</p>
                <div className="mt-3 space-y-2">
                  {selected.relationships.length === 0 ? (
                    <p className="text-sm text-slate-500">No relationships recorded.</p>
                  ) : (
                    selected.relationships.map((relationship) => (
                      <button
                        key={`${relationship.objectId}-${relationship.relationship}`}
                        type="button"
                        onClick={() => setSelectedId(relationship.objectId)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-left transition hover:border-cyan-400/40"
                      >
                        <div>
                          <p className="font-medium text-slate-200">{relationship.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{relationship.relationship}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.16em] text-cyan-300">{typeLabel(relationship.type)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended Actions</p>
                <div className="mt-3 space-y-2">
                  {selected.recommendations.length === 0 ? (
                    <p className="rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-3 text-sm text-emerald-200">No immediate action required.</p>
                  ) : (
                    selected.recommendations.map((recommendation) => (
                      <p key={recommendation} className="rounded-xl border border-amber-300/15 bg-amber-300/5 p-3 text-sm leading-6 text-amber-100">
                        {recommendation}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
