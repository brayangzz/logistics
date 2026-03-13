"use client";

import { motion } from "framer-motion";
import { OrderState } from "../models";
import { cn } from "@/lib/utils";

interface LogisticsLegendProps {
  statusFilter: OrderState | "Todos";
  onStatusChange: (status: OrderState | "Todos") => void;
}

const STATUSES: { value: OrderState | "Todos"; label: string; colorClass: string; shadowClass: string }[] = [
  { value: "Todos", label: "Todos", colorClass: "bg-blue-500", shadowClass: "shadow-[0_0_12px_rgba(59,130,246,0.7)]" },
  { value: "Pendiente", label: "Pendiente", colorClass: "bg-red-500", shadowClass: "shadow-[0_0_12px_rgba(239,68,68,0.7)]" },
  { value: "En Proceso", label: "En Proceso", colorClass: "bg-amber-500", shadowClass: "shadow-[0_0_12px_rgba(245,158,11,0.7)]" },
  { value: "Listo", label: "Listo", colorClass: "bg-emerald-500", shadowClass: "shadow-[0_0_12px_rgba(16,185,129,0.7)]" },
];

export const LogisticsLegend = ({ statusFilter, onStatusChange }: LogisticsLegendProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 p-2 bg-[#1E293A]/60 rounded-2xl border border-slate-700/50 backdrop-blur-sm relative z-10 w-full md:w-max shadow-lg shadow-black/10 overflow-hidden">
      {STATUSES.map((status) => {
        const isActive = statusFilter === status.value;
        return (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={cn(
              "relative flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm flex-1 md:flex-none justify-center md:justify-start",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-status-pill"
                className="absolute inset-0 bg-[#155DFC]/20 border border-[#155DFC]/30 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <div className={`relative z-10 w-2.5 h-2.5 rounded-full ${status.colorClass} ${status.shadowClass}`} />
            <span className="relative z-10 tracking-wide whitespace-nowrap">{status.label}</span>
          </button>
        );
      })}
    </div>
  );
};
