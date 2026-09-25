"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DeviceTelemetryPoint = {
  time: string;
  temperature: number;
};

type DeviceTelemetryChartProps = {
  data: DeviceTelemetryPoint[];
  setpoint?: number | null;
};

export default function DeviceTelemetryChart({
  data,
  setpoint,
}: DeviceTelemetryChartProps) {
  return (
    <div className="h-75 w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-500">
          No telemetry recorded for this device.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              unit="°C"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "none",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={(value) => [
                `${Number(value).toFixed(1)} °C`,
                "Temperature",
              ]}
              labelStyle={{ color: "#cbd5e1" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            {setpoint !== null && setpoint !== undefined && (
              <ReferenceLine
                y={setpoint}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: `Setpoint ${setpoint}°C`,
                  fill: "#b45309",
                  fontSize: 10,
                  position: "insideTopRight",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#0b1329"
              strokeWidth={2}
              dot={{ fill: "#0b1329", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
