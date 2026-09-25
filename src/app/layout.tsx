import type { Metadata } from "next";
import Header from "./Header";
import Sidebar from "./Sidebar";
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
        <Sidebar />

        {/* Main Content Pane */}
        <div
          data-scroll-container
          className="flex min-h-0 flex-1 flex-col min-w-0 overflow-y-auto"
        >
          {/* Top Header */}
          <Header />

          {/* Child Page Injected Here */}
          <main className="p-8 space-y-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
