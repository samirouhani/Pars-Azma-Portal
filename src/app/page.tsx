import { prisma } from '@/lib/prisma'
import { Cpu, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'

export default async function OverviewPage() {
  // Query live records directly from your local PostgreSQL database
  const devices = await prisma.device.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Derive metrics dynamically
  const totalCount = devices.length
  const operationalCount = devices.filter((d) => d.status === 'OPERATIONAL').length
  const warningCount = devices.filter((d) => d.status === 'WARNING').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#0b1329] text-white rounded-xl p-6 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-400">
            Pars Azma Enterprise Hub
          </span>
          <h1 className="text-2xl font-bold mt-1">Welcome back to your laboratory console, Central Lab</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            All registered furnaces, incubators, and testing chambers are running stable. 1 upcoming calibration task is scheduled for tomorrow.
          </p>
        </div>
      </div>

      {/* Top 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Registered Instruments</span>
            <Cpu className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-500 ml-1.5">devices</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">• 2 newly added this quarter</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Operational Active</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{operationalCount}</span>
            <span className="text-xs text-slate-500 ml-1.5">online</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">• Normal continuous workflow</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium text-rose-600">High Alert Triggers</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600">{warningCount}</span>
            <span className="text-xs text-rose-500 ml-1.5">critical</span>
          </div>
          <p className="text-[11px] text-rose-600 mt-2 font-medium">• Vacuum Chamber over-temp</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium text-amber-700">Next Certified Calibration</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-700">24</span>
            <span className="text-xs text-amber-600 ml-1.5">hrs</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2 font-medium">• Scheduled: Oven Unit #2</p>
        </div>
      </div>

      {/* Main Bottom Section: Equipment Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Equipment Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">My Registered Equipment</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                Filter status
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3.5 font-semibold text-slate-800">{device.modelName}</td>
                    <td className="py-3.5 text-slate-500 font-mono text-[11px]">{device.serialNumber}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          device.status === 'OPERATIONAL'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : device.status === 'WARNING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {device.warrantyEnd
                        ? new Date(device.warrantyEnd).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })
                        : 'N/A'}
                    </td>
                    <td className="py-3.5 text-right">
                      <button className="text-blue-600 font-medium hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: System Log & Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">System Log & Activity</h3>
          <div className="space-y-4 text-xs">
            <div className="border-l-2 border-rose-500 pl-3 space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span className="font-bold text-rose-600 uppercase">Alert</span>
                <span>10 mins ago</span>
              </div>
              <p className="text-slate-700 font-medium">Vacuum Oven VO-50 triggered over-temperature protection.</p>
            </div>

            <div className="border-l-2 border-blue-500 pl-3 space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span className="font-bold text-blue-600 uppercase">System</span>
                <span>2 hours ago</span>
              </div>
              <p className="text-slate-700 font-medium">Dr. Rayan calibrated Laboratory Oven EX-200. Cert #8839 issued.</p>
            </div>

            <div className="border-l-2 border-slate-300 pl-3 space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span className="font-bold text-slate-500 uppercase">Update</span>
                <span>1 day ago</span>
              </div>
              <p className="text-slate-700 font-medium">Firmware v4.2.0 compiled and deployed to Muffle Furnace MF-1200.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}