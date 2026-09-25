"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Cpu,
  FileText,
  LayoutDashboard,
  Lock,
  LogOut,
  Settings,
  Unlock,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/devices", label: "My Devices", icon: Cpu },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (isLocked) {
      return;
    }

    collapseTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  const handleLockToggle = () => {
    setIsLocked((locked) => !locked);
    setIsExpanded(true);
  };

  const isSettingsActive =
    pathname === "/settings" || pathname?.startsWith("/settings/");

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group flex shrink-0 flex-col justify-between border-r border-dark-border-blue bg-dark-blue text-slate-300 transition-[width] duration-200 ease-out ${
        isExpanded ? "w-66" : "w-20"
      }`}
    >
      <div>
        <div className="flex items-center border-b border-dark-border-blue p-6 pr-4">
          <div className="flex w-full min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <Image
                src="/branding/Logo-no-text.webp"
                alt="Pars Azma logo"
                width={36}
                height={36}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div
              className={`flex min-w-0 flex-col overflow-hidden transition-[max-width,opacity] duration-200 ease-out ${
                isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
              } cursor-pointer`}
            >
              <h1 className="truncate text-[1.125rem] font-bold leading-none tracking-tight text-white">
                Pars Azma Co.
              </h1>
              <span className="truncate text-[0.6875rem] font-medium uppercase tracking-wider text-alert-red">
                Knowledge-Based
              </span>
            </div>
            {isExpanded && (
              <button
                type="button"
                onClick={handleLockToggle}
                aria-label={isLocked ? "Unlock sidebar" : "Lock sidebar"}
                title={isLocked ? "Unlock sidebar" : "Lock sidebar"}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white cursor-pointer"
              >
                {isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            // Determine if this is the active route
            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));

            return (
              <Link
                key={label}
                href={href}
                title={!isExpanded ? label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-l-2 border-blue-400 bg-blue-600/10 text-blue-400 rounded-none"
                    : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out ${
                    isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 border-t border-dark-border-blue p-4">
        <Link
          href="/settings"
          title={!isExpanded ? "Settings" : undefined}
          className={`cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isSettingsActive
              ? "border-l-2 border-blue-400 bg-blue-600/10 text-blue-400 rounded-none"
              : "hover:bg-slate-800/60 hover:text-white"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out ${
              isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Settings
          </span>
        </Link>
        <Link
          href="#"
          title={!isExpanded ? "Log Out" : undefined}
          className="cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-alert-red/10 hover:text-alert-red"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out ${
              isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            Log Out
          </span>
        </Link>
        <div
          className="flex items-center gap-3 px-2 py-3"
          title={!isExpanded ? "Dr. A. Rayan" : undefined}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <User className="h-4 w-4" />
          </div>
          <div
            className={`overflow-hidden transition-[max-width,opacity] duration-200 ease-out ${
              isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <p className="truncate text-sm font-semibold text-white">
              Dr. A. Rayan
            </p>
            <p className="truncate text-[11px] text-slate-400">Lab Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
