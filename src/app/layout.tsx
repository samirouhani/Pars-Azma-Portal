import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Cpu,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Search,
  User,
} from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pars Azma Equipment Control Center",
  description: "Laboratory Equipment & Telemetry Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
        {/* Left Dark Sidebar */}
        <aside className="w-64 bg-dark-blue text-slate-300 flex flex-col justify-between shrink-0 border-r border-dark-border-blue">
          <div>
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
              <div className="h-9 w-9 rounded-lg bg-white flex justify-center items-center">
                <Image
                  src="/branding/Logo-no-text.webp"
                  alt="Pars Azma logo"
                  width={36}
                  height={36}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-tight leading-none">
                  Pars Azma Co.
                </h1>
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider">
                  Knowledge-Based
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="p-4 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600/10 text-blue-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/devices"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <Cpu className="h-4 w-4" />
                My Devices
              </Link>
              <Link
                href="/alerts"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Alerts
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
              >
                <FileText className="h-4 w-4" />
                Reports
              </Link>
            </nav>
          </div>

          {/* Bottom Settings & User */}
          <div className="p-4 border-t border-slate-800/60 space-y-2">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/60 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Link>
            <div className="pt-3 border-t border-slate-800/40 flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  Dr. A. Rayan
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Lab Director
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between shrink-0">
            <div>
              <p className="text-xs text-slate-400 font-medium">
                Client Hub / Overview
              </p>
              <h2 className="text-base font-bold text-slate-800 leading-none mt-0.5">
                Equipment Control Center
              </h2>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search devices, logs..."
                className="w-full bg-slate-100 border-none rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </header>

          {/* Child Page Injected Here */}
          <main className="p-8 space-y-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
