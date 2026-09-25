import Link from 'next/link'
import { Activity, Settings2 } from 'lucide-react'
import type { Device } from '@/generated/prisma/client'

// Helper moved inside the component file
function getDeviceDetails(modelName: string) {
  const lowerName = modelName.toLowerCase()
  if (lowerName.includes('germinator')) {
    return { category: 'GERMINATORS', telemetry: 'Humid: 65% / stable', dot: 'bg-emerald-500' }
  }
  if (lowerName.includes('centrifuge')) {
    return { category: 'CENTRIFUGES', telemetry: 'Speed: 4500 RPM / active', dot: 'bg-emerald-500' }
  }
  if (lowerName.includes('agitator')) {
    return { category: 'AGITATORS', telemetry: 'Oscillation: 72 cpm / active', dot: 'bg-emerald-500' }
  }
  if (lowerName.includes('incubator') || lowerName.includes('oven') || lowerName.includes('furnace')) {
    return { category: 'INCUBATORS / OVENS', telemetry: 'Temp: 37.0°C / stable', dot: 'bg-amber-400' }
  }
  return { category: 'LABORATORY EQUIPMENT', telemetry: 'System nominal', dot: 'bg-emerald-500' }
}

export default function DeviceCard({ device }: { device: Device }) {
  const details = getDeviceDetails(device.modelName)
  const isOperational = device.status === 'OPERATIONAL'
  const isWarning = device.status === 'WARNING'

  return (
    <div className="bg-white border border-slate-200 p-4 flex flex-col transition-shadow group">
      {/* Top Bar: Category & Status */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {details.category}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${details.dot} ${isOperational ? 'animate-pulse' : ''}`}></span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {isOperational ? 'Online' : isWarning ? 'Warning' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Image Placeholder */}
      <div className="aspect-4/3 w-full bg-slate-50 mb-4 relative flex items-center justify-center border border-slate-100 p-4">
        <span className="text-xs text-slate-400 font-medium">Image Placeholder</span>
      </div>

      {/* Device Info */}
      <div className="flex-1 mb-4">
        <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
          {device.modelName.split(' ').slice(0, -1).join(' ')}
        </h3>
        <p className="text-xs text-slate-500 font-mono">
          SN: {device.serialNumber}
        </p>
      </div>

      {/* Telemetry Readout & Action */}
      <div className="mt-auto space-y-3">
        <div className="bg-slate-50 border border-slate-100 rounded p-2.5 flex items-start gap-2">
          <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-slate-600 font-mono tracking-tight">
            {details.telemetry}
          </p>
        </div>
        
        <Link 
          href={`/devices/${device.id}`} 
          className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Open Console
        </Link>
      </div>
    </div>
  )
}