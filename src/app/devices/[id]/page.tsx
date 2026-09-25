import { prisma } from "@/lib/prisma";
import DeviceTelemetryChart, {
  type DeviceTelemetryPoint,
} from "@/components/DeviceTelemetryChart";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  Download,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type DeviceConsolePageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(date: Date | null) {
  return (
    date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) ?? "Not available"
  );
}

function formatTimestamp(date: Date) {
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusClasses(status: string) {
  if (status === "OPERATIONAL") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "WARNING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}

function getSeverityClasses(severity: string) {
  if (severity === "CRITICAL") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (severity === "WARNING") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
}

function getCalibrationStatusClasses(status: string) {
  if (status === "CERTIFIED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

export default async function DeviceConsolePage({
  params,
}: DeviceConsolePageProps) {
  const { id } = await params;
  const device = await prisma.device.findUnique({
    where: { id },
    include: {
      organization: true,
      alerts: { orderBy: { createdAt: "desc" } },
      telemetry: { orderBy: { timestamp: "asc" }, take: 24 },
    },
  });

  if (!device) {
    notFound();
  }

  const latestTelemetry = device.telemetry.at(-1);
  const telemetryData: DeviceTelemetryPoint[] = device.telemetry.map(
    (reading) => ({
      time: reading.timestamp.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      temperature: reading.temperature,
    }),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-5 border-b border-border-gray pb-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link
            href="/devices"
            className="mb-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Devices
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {device.modelName}
            </h1>
            <span className="font-mono text-xs text-slate-500">
              {device.serialNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusClasses(device.status)}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  device.status === "OPERATIONAL"
                    ? "animate-pulse bg-emerald-500"
                    : device.status === "WARNING"
                      ? "bg-amber-500"
                      : "bg-slate-500"
                }`}
              />
              {device.status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="cursor-pointer inline-flex items-center gap-2 bg-accent-blue px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
            <CalendarClock className="h-4 w-4" />
            Calibrate Device
          </button>
          <button className="cursor-pointer inline-flex items-center gap-2 border border-border-gray bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export Audit Log
          </button>
          <button className="cursor-pointer inline-flex items-center gap-2 border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100">
            <RefreshCw className="h-4 w-4" />
            Power Cycle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-border-gray bg-white p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Current Temperature</span>
            <Thermometer className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {latestTelemetry
              ? `${latestTelemetry.temperature.toFixed(1)}°C`
              : "--"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Latest telemetry reading
          </p>
        </div>

        <div className="border border-border-gray bg-white p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Calibration Status</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span
            className={`mt-3 inline-flex w-fit border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${getCalibrationStatusClasses(device.calibrationStatus)}`}
          >
            {device.calibrationStatus}
          </span>
          <p className="mt-1 text-[11px] text-slate-500">
            Last calibrated {formatDate(device.lastCalibrated)}
          </p>
        </div>

        <div className="border border-border-gray bg-white p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Operating Organization</span>
            <MapPin className="h-4 w-4" />
          </div>
          <p className="mt-3 truncate text-lg font-bold text-slate-900">
            {device.organization.name}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {device.organization.city ?? "Location not specified"}
          </p>
        </div>

        <div className="border border-border-gray bg-white p-5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Logged Alerts</span>
            <Activity className="h-4 w-4" />
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {device.alerts.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Device incident history
          </p>
        </div>
      </div>

      <section className="border border-border-gray bg-white p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Telemetry History
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Temperature readings from the latest 24 telemetry logs.
            </p>
          </div>
          <span className="text-xs font-medium text-amber-600">
            Setpoint: {device.targetTemp ? `${device.targetTemp}°C` : "N/A"}
          </span>
        </div>
        <DeviceTelemetryChart
          data={telemetryData}
          setpoint={device.targetTemp}
        />
      </section>

      <section className="border border-border-gray bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Device Alerts</h2>
            <p className="mt-1 text-xs text-slate-500">
              Incident history for {device.modelName}.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {device.alerts.length} total
          </span>
        </div>

        {device.alerts.length === 0 ? (
          <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            No incidents recorded. Machine operating within nominal thresholds.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Incident</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {device.alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="py-3">
                      <span
                        className={`inline-flex border px-2 py-1 text-[10px] font-bold uppercase ${getSeverityClasses(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-700">
                      {alert.message}
                    </td>
                    <td className="py-3 text-slate-500">{alert.status}</td>
                    <td className="py-3 text-right text-slate-500">
                      {formatTimestamp(alert.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
