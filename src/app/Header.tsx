"use client";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const headerByRoute = [
  {
    matches: (pathname: string) => pathname === "/",
    pageName: "Overview",
    searchPlaceholder: "Search devices, logs...",
    searchable: false,
  },
  {
    matches: (pathname: string) => pathname.startsWith("/alerts"),
    pageName: "Alerts",
    searchPlaceholder: "Search alerts, devices...",
    searchable: true,
  },
  {
    matches: (pathname: string) => pathname.startsWith("/devices"),
    pageName: "My Devices",
    searchPlaceholder: "Search devices, serials...",
    searchable: true,
  },
  {
    matches: (pathname: string) => pathname.startsWith("/settings"),
    pageName: "Settings",
    searchPlaceholder: "Search settings...",
    searchable: false,
  },
  {
    matches: (pathname: string) => pathname.startsWith("/analytics"),
    pageName: "Analytics",
    searchPlaceholder: "Search metrics, devices...",
    searchable: false,
  },
  {
    matches: (pathname: string) => pathname.startsWith("/reports"),
    pageName: "Reports",
    searchPlaceholder: "Search reports, devices...",
    searchable: false,
  },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeHeader =
    headerByRoute.find(({ matches }) => matches(pathname)) ?? headerByRoute[0];
  const isDeviceConsole =
    pathname.startsWith("/devices/") && pathname !== "/devices";
  const isSearchable = routeHeader.searchable && !isDeviceConsole;
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nextValue = searchParams.get("q") ?? "";
    const timeout = window.setTimeout(() => setSearchValue(nextValue), 0);

    return () => window.clearTimeout(timeout);
  }, [searchParams]);

  useEffect(() => {
    if (!isSearchable) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const value = searchValue.trim();

      if (value) params.set("q", value);
      else params.delete("q");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [isSearchable, pathname, router, searchParams, searchValue]);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-scroll-container]",
    );

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 10);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex h-21.25 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 ${
        scrolled ? "shadow-lg" : "shadow-none"
      } transition-shadow duration-300 ease-in-out`}
    >
      <div>
        <p className="text-sm font-medium text-slate-400">
          <Link href="/" className="transition-colors hover:text-slate-700">
            Client Hub
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          {pathname === "/" ? (
            <span className="font-semibold text-slate-600">Overview</span>
          ) : isDeviceConsole ? (
            <>
              <Link
                href="/devices"
                className="transition-colors hover:text-slate-700"
              >
                My Devices
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="font-semibold text-slate-700">
                Device Console
              </span>
            </>
          ) : (
            <span className="font-semibold text-slate-600">
              {routeHeader.pageName}
            </span>
          )}
        </p>
        <h2 className="text-xl font-bold text-slate-800 leading-none mt-0.5">
          Equipment Control Center
        </h2>
      </div>
      {isSearchable && (
        <div className="relative flex w-80 items-center">
          <Search className="pointer-events-none absolute left-3 top-2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={routeHeader.searchPlaceholder}
            className="flex h-8 w-full items-center rounded-3xl border border-border-gray bg-white/30 py-2 pl-9 pr-9 text-sm transition-colors hover:border-slate-400 sm:hover:bg-slate-50/70"
          />
          {searchValue && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1.5 cursor-pointer text-slate-400 transition-colors hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
