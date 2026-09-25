"use client"

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

const COLORS = {
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  blue: '#3b82f6',
  slate: '#64748b'
}

type AnalyticsProps = {
  deviceStats: any[]
  telemetryData: any[]
  alertHistory: any[]
}

export default function AnalyticsDashboard({ deviceStats, telemetryData, alertHistory }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Main Line Chart: Temperature Stability */}
      <div className="lg:col-span-2 bg-white border border-border-gray p-5">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">System Temperature Stability</h3>
          <p className="text-xs text-slate-500">24-hour aggregate variance across critical equipment</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Line yAxisId="left" type="monotone" dataKey="incubator" name="Incubator (°C)" stroke={COLORS.emerald} strokeWidth={2} dot={false} />
              <Line yAxisId="left" type="monotone" dataKey="germinator" name="Germinator (°C)" stroke={COLORS.blue} strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="oven" name="Oven (°C)" stroke={COLORS.rose} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Chart: Device Status */}
      <div className="bg-white border border-border-gray p-5 flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Fleet Status Distribution</h3>
          <p className="text-xs text-slate-500">Current network health</p>
        </div>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {deviceStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {deviceStats.map((stat) => (
            <div key={stat.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{stat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Alert Frequency */}
      <div className="lg:col-span-3 bg-white border border-border-gray p-5">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">Incident Frequency</h3>
          <p className="text-xs text-slate-500">7-day trailing alert history</p>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alertHistory} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#f8fafc' }} />
              <Bar dataKey="warning" name="Warnings" stackId="a" fill={COLORS.amber} radius={[0, 0, 4, 4]} barSize={32} />
              <Bar dataKey="critical" name="Critical" stackId="a" fill={COLORS.rose} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}