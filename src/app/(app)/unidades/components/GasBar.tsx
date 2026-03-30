"use client";

import { motion } from "framer-motion";
import { Fuel } from "lucide-react";

function gasColor(p: number) {
  if (p > 55) return "#10B981";
  if (p > 25) return "#F59E0B";
  return "#EF4444";
}

export function GasBar({ value }: { value: number }) {
  const color = gasColor(value);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ color }} transition={{ duration: 0.35 }}>
            <Fuel className="w-3.5 h-3.5" />
          </motion.div>
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Combustible</span>
        </div>
        <motion.span className="text-sm font-bold tabular-nums" animate={{ color }} transition={{ duration: 0.35 }}>
          {value}%
        </motion.span>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${value}%`, backgroundColor: color }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        />
      </div>
    </div>
  );
}
