"use client";

import { motion } from "framer-motion";
import { BarChart2 } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from "recharts";

interface HourlyData { label: string; hour: number; count: number; }

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs font-semibold shadow-2xl"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
      {label && <p className="mb-1 text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>}
      {payload.map((p, i) => <p key={i} className="font-bold">{p.value} entrega{p.value !== 1 ? "s" : ""}</p>)}
    </div>
  );
}

interface HourlyActivityChartProps {
  hourData: HourlyData[];
  driverColor: string;
  driverInitials: string;
}

export function HourlyActivityChart({ hourData, driverColor, driverInitials }: HourlyActivityChartProps) {
  const maxCount = Math.max(...hourData.map(h => h.count), 1);
  const totalHourDeliveries = hourData.reduce((s, h) => s + h.count, 0);

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

      <div className="relative flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg,${driverColor},${driverColor}99)`, boxShadow: `0 0 14px ${driverColor}40` }}>
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Actividad de entregas</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Horario 8:00 – 18:30 · {totalHourDeliveries} entregas</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={hourData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} allowDecimals={false} width={22} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: `${driverColor}10` }} />
          <Bar dataKey="count" radius={[5, 5, 2, 2]} animationBegin={300} animationDuration={700} animationEasing="ease-out">
            {hourData.map((entry) => (
              <Cell
                key={entry.label}
                fill={entry.count === maxCount && maxCount > 0 ? driverColor : `${driverColor}40`}
                style={entry.count === maxCount && maxCount > 0 ? { filter: `drop-shadow(0 0 6px ${driverColor}80)` } : {}}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
