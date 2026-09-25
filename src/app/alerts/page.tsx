import { prisma } from "@/lib/prisma";
import AlertTimeRangeFilter from "@/components/AlertTimeRangeFilter";
import Link from "next/link";

// Helper to calculate "time ago" string from a Date object
function formatTimeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${mins} mins ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hours ago`;
  return `${Math.floor(mins / 1440)} days ago`;
}

// Helper to assign styling based on severity
function getSeverityStyles(severity: string) {
  if (severity === "CRITICAL")
    return { dotColor: "bg-rose-500", textColor: "text-rose-500" };
  if (severity === "WARNING")
    return { dotColor: "bg-amber-400", textColor: "text-amber-500" };
  return { dotColor: "bg-blue-500", textColor: "text-blue-500" };
}

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; severity?: string; time?: string }>;
}) {
  const { q, severity, time } = await searchParams;
  const query = q?.trim() ?? "";
  const normalizedSeverity = severity?.toUpperCase() ?? "ALL";
  const activeSeverity = ["CRITICAL", "WARNING", "INFO"].includes(
    normalizedSeverity,
  )
    ? normalizedSeverity
    : "ALL";
  const activeTime = ["24h", "7d", "30d"].includes(time ?? "") ? time! : "all";
  const now = new Date().getTime();
  const dateFilter =
    activeTime === "24h"
      ? { gte: new Date(now - 24 * 60 * 60 * 1000) }
      : activeTime === "7d"
        ? { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
        : activeTime === "30d"
          ? { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
          : undefined;

  const searchFilter = query
    ? {
        OR: [
          { message: { contains: query, mode: "insensitive" as const } },
          { severity: { contains: query, mode: "insensitive" as const } },
          {
            device: {
              modelName: { contains: query, mode: "insensitive" as const },
            },
          },
        ],
      }
    : undefined;

  const severityFilter =
    activeSeverity === "ALL"
      ? undefined
      : { severity: { equals: activeSeverity } };

  const [alerts, allAlerts] = await Promise.all([
    prisma.alert.findMany({
      where: {
        ...(searchFilter ?? {}),
        ...(severityFilter ?? {}),
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      },
      include: { device: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.alert.findMany(),
  ]);

  const totalAlerts = allAlerts.length;
  const criticalCount = allAlerts.filter(
    (a) => a.severity === "CRITICAL",
  ).length;
  const warningCount = allAlerts.filter((a) => a.severity === "WARNING").length;
  const infoCount = allAlerts.filter((a) => a.severity === "INFO").length;

  const createTabHref = (nextSeverity: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeTime !== "all") params.set("time", activeTime);
    if (nextSeverity !== "all") params.set("severity", nextSeverity);
    const queryString = params.toString();
    return queryString ? `/alerts?${queryString}` : "/alerts";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-border-gray flex flex-col justify-center">
          <span className="text-xs text-slate-500 mb-1">
            Total Active Alerts
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
            <span className="text-2xl font-bold text-slate-900">
              {totalAlerts} incidents
            </span>
          </div>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-center">
          <span className="text-xs text-slate-500 mb-1">Critical Severity</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            <span className="text-2xl font-bold text-rose-500">
              {criticalCount} active
            </span>
          </div>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-center">
          <span className="text-xs text-slate-500 mb-1">Warning Level</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            <span className="text-2xl font-bold text-amber-500">
              {warningCount} flagged
            </span>
          </div>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-center">
          <span className="text-xs text-slate-500 mb-1">General Info</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span className="text-2xl font-bold text-blue-600">
              {infoCount} notice
            </span>
          </div>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Active System Alerts
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time technical threshold violations and maintenance triggers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="flex items-center border border-border-gray bg-white rounded-full p-0.5">
            {[
              ["All", "all"],
              ["Critical", "critical"],
              ["Warning", "warning"],
              ["Info", "info"],
            ].map(([label, value]) => (
              <Link
                key={value}
                href={createTabHref(value)}
                className={
                  activeSeverity === value.toUpperCase()
                    ? "rounded-full bg-slate-100 px-4 py-1.5 font-semibold text-slate-900"
                    : "rounded-full px-4 py-1.5 font-medium text-slate-500 transition-colors hover:text-slate-800"
                }
              >
                {label}
              </Link>
            ))}
          </div>
          <AlertTimeRangeFilter value={activeTime} />
        </div>
      </div>

      {/* Alerts Table */}
      {alerts.length === 0 ? (
        <div className="border border-dashed border-border-gray bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            {activeSeverity === "ALL"
              ? query
                ? `No alerts matching "${query}"${activeTime !== "all" ? ` in ${activeTime === "24h" ? "the last 24 hours" : activeTime === "7d" ? "the last 7 days" : "the last 30 days"}` : ""}.`
                : `No alerts found${activeTime !== "all" ? ` in ${activeTime === "24h" ? "the last 24 hours" : activeTime === "7d" ? "the last 7 days" : "the last 30 days"}` : ""}.`
              : `No ${activeSeverity.toLowerCase()} alerts found${activeTime !== "all" ? ` in ${activeTime === "24h" ? "the last 24 hours" : activeTime === "7d" ? "the last 7 days" : "the last 30 days"}` : ""}.`}
          </p>
          {(query || activeSeverity !== "ALL") && (
            <Link
              href="/alerts"
              className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear search filter
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-border-gray overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-gray text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Severity</th>
                <th className="py-4 px-5">Device Name</th>
                <th className="py-4 px-5">Alert Message</th>
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gray">
              {alerts.map((alert) => {
                const styles = getSeverityStyles(alert.severity);

                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div
                        className={`flex items-center gap-2 font-bold ${styles.textColor}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${styles.dotColor}`}
                        ></span>
                        {alert.severity}
                      </div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800">
                      {/* Accessing the nested device relation we fetched */}
                      {alert.device.modelName}
                    </td>
                    <td className="py-4 px-5 text-slate-600 pr-8">
                      {alert.message}
                    </td>
                    <td className="py-4 px-5 text-slate-400">
                      {formatTimeAgo(alert.createdAt)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`font-medium ${
                          alert.status === "Active"
                            ? "text-rose-500"
                            : alert.status === "Acknowledged"
                              ? "bg-amber-100 text-amber-700 px-2 py-0.5 rounded"
                              : "text-emerald-500"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <button className="text-rose-600 font-medium hover:underline cursor-pointer">
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
