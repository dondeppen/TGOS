import { ReactNode } from "react";

interface OperationalHealthCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  status: "healthy" | "warning" | "critical";
  metric?: string;
}

const statusStyles = {
  healthy: "border-emerald-300/20 bg-emerald-300/10 text-emerald-300",
  warning: "border-amber-300/20 bg-amber-300/10 text-amber-300",
  critical: "border-rose-300/20 bg-rose-300/10 text-rose-300",
};

const statusBadges = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
};

export function OperationalHealthCard({
  label,
  value,
  icon,
  status,
  metric,
}: OperationalHealthCardProps) {
  return (
    <article className={`rounded-2xl border p-5 ${statusStyles[status]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
          {metric && (
            <p className="mt-2 text-xs opacity-75">{metric}</p>
          )}
        </div>
        <div className="text-2xl opacity-60">{icon}</div>
      </div>
      <div className="mt-3 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold">
        {statusBadges[status]}
      </div>
    </article>
  );
}
