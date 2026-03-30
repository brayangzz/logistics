"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ActivityPoint } from "../hooks/useDriverDeliveryMetrics";

interface TooltipProps {
  active?: boolean;
  payload?: { payload: ActivityPoint }[];
  driverColor: string;
}

function ActivityTooltip({ active, payload, driverColor }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const point    = payload[0].payload;
  const hh       = String(Math.floor(point.minutes / 60)).padStart(2, "0");
  const mm       = String(point.minutes % 60).padStart(2, "0");
  const isEnRuta = point.value === 1;
  return (
    <div className="rounded-xl px-3 py-2 text-xs font-semibold shadow-2xl"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", minWidth: 90 }}>
      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{hh}:{mm}</p>
      <p className="font-bold" style={{ color: isEnRuta ? driverColor : "var(--text-secondary)" }}>
        {isEnRuta ? "En Ruta" : "Libre"}
      </p>
    </div>
  );
}

interface HourlyActivityChartProps {
  activityData: ActivityPoint[];
  hoursEnRuta: number;
  driverColor: string;
  driverInitials: string;
}

export function HourlyActivityChart({ activityData, hoursEnRuta, driverColor, driverInitials }: HourlyActivityChartProps) {
  const gradientId = `actGrad-${driverInitials}`;

  return (
    <motion.div
      key={`hours-${driverInitials}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="md:col-span-3 rounded-3xl p-4 sm:p-5 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, transparent, ${driverColor}, transparent)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${driverColor}0a 0%, transparent 60%)` }} />

      <div className="relative flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg,${driverColor},${driverColor}99)`, boxShadow: `0 0 14px ${driverColor}40` }}>
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Actividad del chofer</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Horario 8:00 – 18:30 · {hoursEnRuta} hora{hoursEnRuta !== 1 ? "s" : ""} en ruta
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: driverColor }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>En Ruta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--border-color)" }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>Libre</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={activityData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={driverColor} stopOpacity={0.55} />
              <stop offset="95%" stopColor={driverColor} stopOpacity={0}    />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, 1]} />
          <Tooltip
            content={(props) => (
              <ActivityTooltip
                active={props.active}
                payload={props.payload as { payload: ActivityPoint }[] | undefined}
                driverColor={driverColor}
              />
            )}
            cursor={{ stroke: `${driverColor}30`, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={driverColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: driverColor, stroke: "var(--bg-secondary)", strokeWidth: 2 }}
            animationBegin={300}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
