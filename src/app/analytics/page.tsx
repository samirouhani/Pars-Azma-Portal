import { prisma } from '@/lib/prisma'
import { Activity, ShieldCheck, Zap, AlertOctagon } from 'lucide-react'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const devices = await prisma.device.findMany()
  
  // 1. Fetch alerts from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const alerts = await prisma.alert.findMany({
    where: { createdAt: { gte: sevenDaysAgo } }
  })

  // 2. Fetch telemetry from the last 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const rawTelemetry = await prisma.telemetryLog.findMany({
    where: { timestamp: { gte: twentyFourHoursAgo } },
    include: { device: true },
    orderBy: { timestamp: 'asc' }
  })

  // --- DATA PROCESSING FOR RECHARTS ---

  // A. Format Device Donut Chart
  const operationalCount = devices.filter(d => d.status === 'OPERATIONAL').length
  const warningCount = devices.filter(d => d.status === 'WARNING').length
  const offlineCount = devices.filter(d => d.status === 'OFFLINE').length
  const uptimePercentage = devices.length > 0 ? ((operationalCount / devices.length) * 100).toFixed(1) : '0.0'
  const activeAlerts = alerts.filter(a => a.status === 'Active').length

  const deviceStats = [
    { name: 'Operational', value: operationalCount, color: '#10b981' },
    { name: 'Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Offline', value: offlineCount, color: '#64748b' },
  ].filter(stat => stat.value > 0)

  // B. Process Telemetry for Line Chart (Group by Hour)
  const telemetryMap = new Map()
  rawTelemetry.forEach(log => {
    const hour = `${log.timestamp.getHours()}:00`
    if (!telemetryMap.has(hour)) {
      telemetryMap.set(hour, { time: hour })
    }
    const entry = telemetryMap.get(hour)
    
    // Map specific readings to graph lines based on model name
    if (log.device.modelName.includes('Incubator')) entry.incubator = log.temperature
    if (log.device.modelName.includes('Oven EX-200')) entry.oven = log.temperature
    if (log.device.modelName.includes('Germinator')) entry.germinator = log.temperature
  })
  const telemetryData = Array.from(telemetryMap.values())

  // C. Process Alerts for Bar Chart (Group by Day)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const alertHistoryMap = new Map()
  
  // Pre-fill the last 7 days with zero values so empty days still show on the chart
  for(let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    alertHistoryMap.set(days[d.getDay()], { day: days[d.getDay()], critical: 0, warning: 0 })
  }

  alerts.forEach(alert => {
    const day = days[alert.createdAt.getDay()]
    if (alertHistoryMap.has(day)) {
      if (alert.severity === 'CRITICAL') alertHistoryMap.get(day).critical += 1
      if (alert.severity === 'WARNING') alertHistoryMap.get(day).warning += 1
    }
  })
  const alertHistory = Array.from(alertHistoryMap.values())


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Telemetry</h1>
          <p className="text-sm text-slate-500 mt-1">
            Historical device performance, network uptime, and predictive maintenance insights.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="cursor-pointer px-4 py-2 text-xs font-medium border border-border-gray text-slate-600 hover:bg-slate-50 transition-colors bg-white">
            Export Report
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Network Uptime</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{uptimePercentage}%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">30-day trailing average</p>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Triggers</span>
            <AlertOctagon className={`h-4 w-4 ${activeAlerts > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{activeAlerts}</span>
            <span className="text-xs text-slate-500">events</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Requiring immediate attention</p>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Telemetry Streams</span>
            <Zap className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">{rawTelemetry.length}</span>
            <span className="text-xs text-slate-500">logs/24h</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Stable ingestion rate</p>
        </div>

        <div className="bg-white p-5 border border-border-gray flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Compliance</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">100%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">All calibrations up to date</p>
        </div>
      </div>

      {/* Render the Client-Side Recharts Dashboard */}
      <AnalyticsDashboard 
        deviceStats={deviceStats} 
        telemetryData={telemetryData} 
        alertHistory={alertHistory} 
      />

    </div>
  )
}