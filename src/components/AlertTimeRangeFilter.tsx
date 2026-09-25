"use client";

import { ChevronDown, Clock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AlertTimeRangeFilterProps = {
  value: string;
};

export default function AlertTimeRangeFilter({
  value,
}: AlertTimeRangeFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (nextTime: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextTime === "all") {
      params.delete("time");
    } else {
      params.set("time", nextTime);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="relative ml-2">
      <Clock className="pointer-events-none absolute left-3 top-2 h-3.5 w-3.5 text-slate-500" />
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Filter alerts by time range"
        className="cursor-pointer appearance-none rounded-full border border-border-gray bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400"
      >
        <option value="all">All Time</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-2 h-3.5 w-3.5 text-slate-500" />
    </div>
  );
}
