"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Truck, Clock } from "lucide-react";

interface Props {
  total: number;
  assignedCount: number;
  pendingCount: number;
}

const CARDS = [
  { key: "total",    label: "Listos para ruta", color: "#10B981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.22)", Icon: CheckCircle2 },
  { key: "assigned", label: "Asignados",        color: "#155DFC", bg: "rgba(21,93,252,0.10)",   border: "rgba(21,93,252,0.22)",   Icon: Truck        },
  { key: "pending",  label: "Pendientes",       color: "#64748B", bg: "rgba(100,116,139,0.10)", border: "rgba(100,116,139,0.22)", Icon: Clock        },
] as const;

export function AssignmentSummaryCards({ total, assignedCount, pendingCount }: Props) {
  const values = { total, assigned: assignedCount, pending: pendingCount };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          className="flex items-center gap-3 p-3.5 rounded-2xl border"
          style={{ backgroundColor: card.bg, borderColor: card.border }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: card.bg, outline: `1px solid ${card.border}` }}
          >
            <card.Icon className="w-4 h-4" style={{ color: card.color }} />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none" style={{ color: card.color }}>
              {values[card.key]}
            </p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
              {card.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
