"use client";

import { motion } from "framer-motion";
import { OrderState } from "../models";

interface LogisticsLegendProps {
  statusFilter: OrderState | "Todos";
  onStatusChange: (status: OrderState | "Todos") => void;
}

const STATUSES: {
  value: OrderState | "Todos";
  label: string;
  dotColor: string;
  dotGlow: string;
}[] = [
  { value: "Todos",      label: "Todos",      dotColor: "#3B82F6", dotGlow: "rgba(59,130,246,0.6)" },
  { value: "Pendiente",  label: "Pendiente",  dotColor: "#EF4444", dotGlow: "rgba(239,68,68,0.6)" },
  { value: "En Proceso", label: "En Proceso", dotColor: "#F59E0B", dotGlow: "rgba(245,158,11,0.6)" },
  { value: "Listo",      label: "Listo",      dotColor: "#10B981", dotGlow: "rgba(16,185,129,0.6)" },
];

export const LogisticsLegend = ({ statusFilter, onStatusChange }: LogisticsLegendProps) => {
  return (
    <div
      className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border relative z-10 w-full md:w-max"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      {STATUSES.map((status) => {
        const isActive = statusFilter === status.value;
        return (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 flex-1 md:flex-none justify-center md:justify-start focus:outline-none"
            style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            {/* Animated active background */}
            {isActive && (
              <motion.div
                layoutId="status-active-bg"
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundColor: "var(--accent-bg)",
                  outline: "1px solid var(--accent-border)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            {/* Hover effect via pseudo — usando un div transparente */}
            {!isActive && (
              <div
                className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-150"
                style={{ backgroundColor: "var(--select-option-hover)" }}
                aria-hidden
              />
            )}

            {/* Dot */}
            <span
              className="relative z-10 w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: status.dotColor,
                boxShadow: isActive ? `0 0 8px ${status.dotGlow}` : "none",
              }}
            />
            <span className="relative z-10 whitespace-nowrap">{status.label}</span>
          </button>
        );
      })}
    </div>
  );
};
