import {
  User,
  Bell,
  Activity,
  Shield,
  Users,
  Sliders,
  ArrowRight,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-[calc(100vh-149px)] min-h-0 max-w-7xl mx-auto flex-col gap-6 overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account, laboratory workspace, connected devices, and
            access controls.
          </p>
        </div>
        <button className="cursor-pointer shrink-0 px-6 py-2.5 text-sm font-medium bg-accent-blue text-white hover:bg-slate-800 transition-colors duration-100 ease-in-out">
          Save Changes
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
        {/* Left Settings Navigation */}
        <aside className="self-start bg-white border border-border-gray py-2 lg:col-span-3">
          <div className="px-4 py-2 mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Settings Menu
            </span>
          </div>
          <nav className="flex flex-col">
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold bg-blue-50 text-blue-900 border-l-2 border-blue-600 text-left">
              <User className="h-4 w-4" />
              Profile & account
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left">
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left">
              <Activity className="h-4 w-4" />
              Device & telemetry
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left">
              <Shield className="h-4 w-4" />
              Security
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left">
              <Users className="h-4 w-4" />
              Team & users
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left">
              <Sliders className="h-4 w-4" />
              System preferences
            </button>
          </nav>
        </aside>

        {/* Right Content Sections */}
        <section className="min-h-0 overflow-y-auto space-y-6 pr-1 lg:col-span-9">
          {/* Profile & Account Section */}
          <div className="bg-white border border-border-gray p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Profile & account
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Your personal information and contact details.
            </p>

            <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#0b1329] text-white flex items-center justify-center text-sm font-bold tracking-wider">
                  KR
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dr. K. Rejali
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lab Director - Central Lab
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors">
                Change photo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Dr. K. Rejali"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  defaultValue="Lab Director"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="k.rejali@parsazma.com"
                className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white border border-border-gray p-6">
            <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
            <p className="text-xs text-slate-500 mb-6">
              Choose how critical laboratory events reach you.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Critical equipment alerts
                  </h4>
                  <p className="text-xs text-slate-500">
                    Email and in-app alerts for threshold violations.
                  </p>
                </div>
                {/* Active Toggle */}
                <div className="w-10 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Calibration reminders
                  </h4>
                  <p className="text-xs text-slate-500">
                    Notify me 7 days before certification expires.
                  </p>
                </div>
                {/* Active Toggle */}
                <div className="w-10 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Weekly operations digest
                  </h4>
                  <p className="text-xs text-slate-500">
                    A Monday summary of uptime, incidents, and service.
                  </p>
                </div>
                {/* Inactive Toggle */}
                <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm border border-slate-300"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Delivery Channel
                </label>
                <input
                  type="text"
                  defaultValue="Email + in-app"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Quiet Hours
                </label>
                <input
                  type="text"
                  defaultValue="22:00–06:00"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Device & Telemetry Section */}
          <div className="bg-white border border-border-gray p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Device & telemetry
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Defaults for connected laboratory equipment.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Real-time telemetry
                  </h4>
                  <p className="text-xs text-slate-500">
                    Stream live readings from all online instruments.
                  </p>
                </div>
                {/* Active Toggle */}
                <div className="w-10 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Automatic firmware updates
                  </h4>
                  <p className="text-xs text-slate-500">
                    Install verified stable releases during quiet hours.
                  </p>
                </div>
                {/* Inactive Toggle */}
                <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm border border-slate-300"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Data Retention
                </label>
                <input
                  type="text"
                  defaultValue="24 months"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Temperature
                </label>
                <input
                  type="text"
                  defaultValue="Celsius (°C)"
                  className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white border border-border-gray p-6">
            <h2 className="text-lg font-bold text-slate-900">Security</h2>
            <p className="text-xs text-slate-500 mb-6">
              Sign-in protection and active sessions.
            </p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Two-factor authentication
                </h4>
                <p className="text-xs text-slate-500">
                  Authenticator app - enabled
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                Secure
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-xs font-bold text-rose-600 hover:underline">
                Change password
              </button>
              <button className="text-xs font-bold text-rose-600 hover:underline">
                Review 3 sessions
              </button>
            </div>
          </div>

          {/* Bottom Split Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-border-gray p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Team & users
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  12 members · 3 admins · 2 pending
                </p>
              </div>
              <button className="flex items-center text-xs font-bold text-rose-600 hover:underline mt-4 w-max">
                Manage access <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>

            <div className="bg-white border border-border-gray p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  System preferences
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  English · Tehran (UTC+3:30) · ISO date
                </p>
              </div>
              <button className="flex items-center text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors mt-4 w-max">
                Edit preferences <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
