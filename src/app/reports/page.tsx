import { prisma } from '@/lib/prisma'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'

// Mock historical reports to populate the document library
const recentReports = [
  {
    id: 'RPT-8992',
    name: 'August 2026 Telemetry Audit',
    type: 'CSV Data Export',
    date: 'Sep 01, 2026',
    size: '2.4 MB',
    icon: FileSpreadsheet,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    id: 'RPT-8991',
    name: 'Q3 Maintenance & Calibration Log',
    type: 'Official PDF Report',
    date: 'Aug 28, 2026',
    size: '845 KB',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    id: 'RPT-8990',
    name: 'Incident History - Vacuum Oven VO-50',
    type: 'PDF Summary',
    date: 'Aug 15, 2026',
    size: '1.2 MB',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    id: 'RPT-8989',
    name: 'Weekly Operations Digest',
    type: 'Automated Report',
    date: 'Aug 10, 2026',
    size: '420 KB',
    icon: FileText,
    color: 'text-slate-600',
    bg: 'bg-slate-100'
  }
]

export default async function ReportsPage() {
  // Fetch real devices to populate the "Target Equipment" dropdown
  const devices = await prisma.device.findMany({
    orderBy: { modelName: 'asc' }
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance & Reporting</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export official documentation, telemetry logs, and calibration certificates.
          </p>
        </div>
        <button className="cursor-pointer shrink-0 px-4 py-2 text-xs font-medium border border-border-gray text-slate-600 hover:bg-slate-50 transition-colors bg-white rounded">
          Manage Automated Reports
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Report Generator Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-border-gray p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Generate Custom Report</h2>
            </div>

            <form className="space-y-5">
              {/* Report Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Report Type
                </label>
                <select className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
                  <option>Telemetry & Sensor Logs</option>
                  <option>Alert & Incident History</option>
                  <option>Maintenance & Calibration</option>
                  <option>Complete System Audit</option>
                </select>
              </div>

              {/* Target Equipment */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Equipment
                </label>
                <select className="w-full border border-border-gray rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
                  <option>All Registered Devices</option>
                  <option disabled>──────────</option>
                  {devices.map(device => (
                    <option key={device.id}>{device.modelName} ({device.serialNumber})</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <select className="w-full border border-border-gray rounded pl-9 pr-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Previous Quarter</option>
                    <option>Custom Date Range...</option>
                  </select>
                </div>
              </div>

              {/* Export Format */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Export Format
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="format" defaultChecked className="accent-blue-600" />
                    PDF Document
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="format" className="accent-blue-600" />
                    CSV Data
                  </label>
                </div>
              </div>

              <button 
                type="button" 
                className="w-full cursor-pointer mt-4 px-4 py-2.5 text-sm font-bold bg-[#0b1329] text-white rounded hover:bg-slate-800 transition-colors"
              >
                Generate & Download
              </button>
            </form>
          </div>

          {/* Status Card */}
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-800">ISO-17025 Compliant</h4>
              <p className="text-xs text-emerald-600/80 mt-1 leading-relaxed">
                All generated PDF reports include cryptographic signatures and NIST traceability timestamps required for compliance auditing.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Document Library */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Document Library</h3>
          
          <div className="bg-white border border-border-gray overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-gray text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                  <th className="py-3 px-5">Report Name</th>
                  <th className="py-3 px-5">Generated Date</th>
                  <th className="py-3 px-5">Size</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${report.bg} ${report.color}`}>
                          <report.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{report.name}</p>
                          <p className="text-slate-500 mt-0.5">{report.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {report.date}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-500 font-mono">
                      {report.size}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="inline-flex items-center gap-1.5 text-blue-600 font-medium hover:underline cursor-pointer bg-blue-50 px-3 py-1.5 rounded">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}