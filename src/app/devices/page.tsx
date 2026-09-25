import { prisma } from "@/lib/prisma";
import DeviceCard from "@/components/DeviceCard";
import Link from "next/link";

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const devices = await prisma.device.findMany({
    where: query
      ? {
          OR: [
            { modelName: { contains: query, mode: "insensitive" } },
            { serialNumber: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  const activeCount = devices.filter((d) => d.status === "OPERATIONAL").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              My Registered Devices
            </h1>
            <span className="bg-[#0b1329] text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide">
              {activeCount} Active Instruments
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Monitor live telemetry, modify internal environmental parameters,
            and schedule upcoming certification checks.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="cursor-pointer px-4 py-2 text-xs font-medium border border-border-gray text-slate-700 hover:bg-slate-50 transition-colors duration-100 ease-in-out">
            Manage Devices
          </button>
          <button className="cursor-pointer px-4 py-2 text-xs font-medium bg-accent-blue text-white hover:bg-slate-800 transition-colors duration-100 ease-in-out">
            + Register New Device
          </button>
        </div>
      </div>

      {/* Device Grid */}
      {devices.length === 0 ? (
        <div className="border border-dashed border-border-gray bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            No equipment found matching &quot;{query}&quot;.
          </p>
          <Link
            href="/devices"
            className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
          >
            Clear search filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}
