import { buildOperationalRegistry } from "@/lib/tgos/operational-registry";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClasses(status: string): string {
  if (status === "attention") {
    return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  }

  if (status === "active") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  }

  return "border-slate-700 bg-slate-800/70 text-slate-300";
}

export function CustomerWorkspacePanel() {
  const registry = buildOperationalRegistry();

  return (
    <section id="customers" className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/55 p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Operational Registry
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Customer Workspace</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Customers, contacts, locations, and assets are now assembled into one connected operating view.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["Customers", registry.summary.customers],
            ["Locations", registry.summary.locations],
            ["Assets", registry.summary.assets],
            ["Fleet health", `${registry.summary.averageAssetHealth}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {registry.customers.map(({ customer, primaryContact, locations, assets }) => {
          const attentionAssets = assets.filter((asset) => asset.status === "attention");

          return (
            <article key={customer.id} className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Customer record
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-100">{customer.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{customer.contract}</p>
                </div>
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${statusClasses(customer.status)}`}>
                  {customer.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-500">Health</p>
                  <p className="mt-1 text-lg font-bold text-cyan-300">{customer.healthScore}%</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-500">Open balance</p>
                  <p className="mt-1 text-lg font-bold text-slate-100">{formatCurrency(customer.openBalance)}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-500">Locations</p>
                  <p className="mt-1 text-lg font-bold text-slate-100">{locations.length}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-xs text-slate-500">Assets</p>
                  <p className="mt-1 text-lg font-bold text-slate-100">{assets.length}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Primary contact</p>
                  <p className="mt-1 font-medium text-slate-200">{primaryContact?.name ?? "Not assigned"}</p>
                  <p className="text-slate-500">{primaryContact?.role ?? "Contact record required"}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Locations</p>
                  <div className="mt-2 space-y-2">
                    {locations.map((location) => (
                      <div key={location.id} className="rounded-xl border border-slate-800 bg-slate-900/55 px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-slate-200">{location.name}</span>
                          <span className="text-xs text-slate-500">{location.travelMinutes} min</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{location.city}, {location.state}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">COMMAND attention</p>
                  <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/55 p-3">
                    {attentionAssets.length > 0 ? (
                      <p className="text-amber-200">
                        {attentionAssets.length} asset{attentionAssets.length === 1 ? "" : "s"} requires attention. {attentionAssets[0]?.nextAction}
                      </p>
                    ) : (
                      <p className="text-emerald-200">No immediate asset risk detected.</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
