import { prisma } from "@/lib/prisma";
import { Cpu, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import DeviceStatusFilter from "@/components/DeviceStatusFilter";
import Link from "next/link";

function formatTimeAgo(date: Date) {
  const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);

  if (minutes < 60) return `${minutes} mins ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
  return `${Math.floor(minutes / 1440)} days ago`;
}

function getAlertStyles(severity: string) {
  if (severity === "CRITICAL") {
    return { border: "border-rose-500", label: "text-rose-600" };
  }

  if (severity === "WARNING") {
    return { border: "border-amber-500", label: "text-amber-600" };
  }

  return { border: "border-blue-500", label: "text-blue-600" };
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatuses = ["OPERATIONAL", "WARNING", "OFFLINE"];
  const activeStatus = validStatuses.includes(status?.toUpperCase() ?? "")
    ? status!.toUpperCase()
    : undefined;

  const [allDevices, recentAlerts, activeAlertsCount] = await Promise.all([
    prisma.device.findMany(),
    prisma.alert.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { device: true },
    }),
    prisma.alert.count({ where: { status: "Active" } }),
  ]);

  const tableDevices = await prisma.device.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
  });

  // Derive metrics dynamically
  const totalCount = allDevices.length;
  const operationalCount = allDevices.filter(
    (d) => d.status === "OPERATIONAL",
  ).length;
  const certifiedCount = allDevices.filter(
    (d) => d.calibrationStatus === "CERTIFIED",
  ).length;
  const pendingCalibrationCount = allDevices.filter(
    (d) => d.calibrationStatus === "PENDING",
  ).length;
  const latestActiveAlert = recentAlerts.find(
    (alert) => alert.status === "Active",
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-dark-blue text-white p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-400">
            Pars Azma Enterprise Hub
          </span>
          <h1 className="text-2xl font-bold mt-1">Central Lab</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            All registered furnaces, incubators, and testing chambers are
            running stable. 1 upcoming calibration task is scheduled for
            tomorrow.
          </p>
        </div>
      </div>

      {/* Top 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Registered Instruments</span>
            <Cpu className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">devices</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">
            • {operationalCount} online instruments
          </p>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Operational Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {operationalCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">online</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">
            • {totalCount - operationalCount} requiring attention
          </p>
        </div>

        <div className="bg-white p-5 border border-rose-200 bg-rose-50/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium text-rose-600">
              High Alert Triggers
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600">
              {activeAlertsCount}
            </span>
            <span className="text-xs text-rose-500 ml-1.5">active</span>
          </div>
          <p className="line-clamp-2 text-[11px] text-rose-600 mt-2 font-medium">
            {latestActiveAlert
              ? `${latestActiveAlert.device.modelName}: ${latestActiveAlert.message}`
              : "No active incidents"}
          </p>
        </div>

        <div className="bg-white p-5 border border-amber-200 bg-amber-50/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium text-amber-700">
              Next Certified Calibration
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-700">
              {certifiedCount}
            </span>
            <span className="text-xs text-amber-600 ml-1.5">certified</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2 font-medium">
            {pendingCalibrationCount} pending inspection
          </p>
        </div>
      </div>

      {/* Main Bottom Section: Equipment Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Equipment Table */}
        <div className="lg:col-span-2 bg-white border border-border-gray p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              My Registered Equipment
            </h3>
            <div className="flex gap-2">
              <DeviceStatusFilter />
              <button className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-accent-blue text-white hover:bg-blue-900 transition-bg duration-100 ease-in-out">
                + Register Device
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3">Device Name</th>
                  <th className="pb-3">Serial</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Warranty</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableDevices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      {activeStatus ? (
                        <>
                          No equipment currently marked as {activeStatus}.
                          <Link
                            href="/"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            Clear filter
                          </Link>
                        </>
                      ) : (
                        "No registered equipment found. Click + Register Device to add your first instrument."
                      )}
                    </td>
                  </tr>
                ) : (
                  tableDevices.map((device) => (
                    <tr
                      key={device.id}
                      className="hover:bg-slate-50/75 transition-colors"
                    >
                      <td className="py-3.5 font-semibold text-slate-800">
                        {device.modelName}
                      </td>
                      <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                        {device.serialNumber}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            device.status === "OPERATIONAL"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : device.status === "WARNING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-600 border border-border-gray"
                          }`}
                        >
                          {device.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500">
                        {device.warrantyEnd
                          ? new Date(device.warrantyEnd).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          className="cursor-pointer inline-flex items-center gap-1 text-blue-600 font-medium hover:underline"
                          href={`/devices/${device.id}`}
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: System Log & Activity */}
        <div className="bg-white border border-border-gray p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            System Log & Activity
          </h3>
          <div className="space-y-4 text-xs">
            {recentAlerts.length === 0 ? (
              <p className="py-4 text-slate-500">
                No recent system activity recorded.
              </p>
            ) : (
              recentAlerts.map((alert) => {
                const styles = getAlertStyles(alert.severity);

                return (
                  <Link
                    key={alert.id}
                    href={`/devices/${alert.deviceId}`}
                    className={`block border-l-2 pl-3 space-y-1 transition-colors hover:bg-slate-50 ${styles.border}`}
                  >
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span className={`font-bold uppercase ${styles.label}`}>
                        {alert.severity}
                      </span>
                      <span>{formatTimeAgo(alert.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      {alert.device.modelName}: {alert.message}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
          <Link
            className="inline-flex items-center pt-2 text-xs font-semibold text-blue-600 hover:underline"
            href="/alerts"
          >
            View all system alerts →
          </Link>
        </div>
      </div>
    </div>
  );
}
