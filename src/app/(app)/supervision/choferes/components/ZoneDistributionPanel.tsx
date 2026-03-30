"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface ZoneData { zone: string; count: number; }

interface ZoneDistributionPanelProps {
  zoneData: ZoneData[];
  driverColor: string;
  driverInitials: string;
}

export function ZoneDistributionPanel({ zoneData, driverColor, driverInitials }: ZoneDistributionPanelProps) {
  const maxZone = Math.max(...zoneData.map(z => z.count), 1);

  return (
    <motion.div
      key={`zones-${driverInitials}`}
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="md:col-span-2 rounded-3xl p-4 sm:p-5 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", border: `1px solid ${driverColor}30`, boxShadow: `0 4px 24px ${driverColor}10` }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${driverColor}0a 0%, transparent 65%)` }} />
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, transparent, ${driverColor}, transparent)` }} />

      <div className="relative flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg,${driverColor},${driverColor}99)`, boxShadow: `0 0 14px ${driverColor}40` }}>
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Por zona</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{zoneData.length} zona{zoneData.length !== 1 ? "s" : ""} activa{zoneData.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-2.5">
        {zoneData.map(({ zone, count }, idx) => {
          const pct = Math.round((count / maxZone) * 100);
          const isTop = count === maxZone;
          return (
            <motion.div key={zone} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32, delay: 0.38 + idx * 0.06 }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: driverColor, opacity: isTop ? 1 : 0.5 }} />
                  <span className="text-[10px] font-semibold truncate" style={{ color: isTop ? "var(--text-primary)" : "var(--text-muted)" }}>{zone}</span>
                </div>
                <span className="text-[10px] font-black tabular-nums ml-2 shrink-0" style={{ color: isTop ? driverColor : "var(--text-muted)" }}>{count}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${driverColor}18` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: driverColor, opacity: isTop ? 1 : 0.4, boxShadow: isTop ? `0 0 8px ${driverColor}80` : "none" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
