"use client";

import { ChevronDown, Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Operational", value: "OPERATIONAL" },
  { label: "Warning", value: "WARNING" },
  { label: "Offline", value: "OFFLINE" },
];

export default function DeviceStatusFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status")?.toUpperCase();
  const selectedStatus = statusOptions.some(
    ({ value }) => value === currentStatus,
  )
    ? currentStatus
    : "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="relative flex items-center">
      <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-500" />
      <select
        aria-label="Filter devices by status"
        value={selectedStatus}
        onChange={(event) => handleChange(event.target.value)}
        className="cursor-pointer appearance-none border border-border-gray bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-500" />
    </div>
  );
}
