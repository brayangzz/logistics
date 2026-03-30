"use client";

import { motion } from "framer-motion";
import { Truck, Package, CheckCircle2, Clock } from "lucide-react";
import { Variants } from "framer-motion";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

interface Stats { total: number; pendiente: number; enRuta: number; entregado: number }

export function OrderStatusStats({ stats }: { stats: Stats }) {
  const cards = [
    { id: "total", label: "TOTAL PEDIDOS", value: stats.total,     color: "#155DFC", icon: Package      },
    { id: "pend",  label: "PENDIENTES",    value: stats.pendiente, color: "#F59E0B", icon: Clock        },
    { id: "ruta",  label: "EN RUTA",       value: stats.enRuta,    color: "#6366F1", icon: Truck        },
    { id: "ent",   label: "ENTREGADOS",    value: stats.entregado, color: "#22c55e", icon: CheckCircle2 },
  ];

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="show"
      className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      {cards.map((s) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.id}
            variants={itemVariants}
            whileHover={{ y: -3, scale: 1.01, transition: { type: "spring", stiffness: 400, damping: 28 } }}
            className="relative p-4 sm:p-5 rounded-2xl border flex flex-col justify-between overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              borderBottomColor: s.color,
              borderBottomWidth: "3px",
              minHeight: "120px",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top right, ${s.color}14, transparent 65%)` }} />
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-tight"
                style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.color }}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <motion.p
              className="font-black tabular-nums"
              style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: "1", color: "var(--text-primary)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SMOOTH, delay: 0.1 }}
            >
              {s.value}
            </motion.p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
