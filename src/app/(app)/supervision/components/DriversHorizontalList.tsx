"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Users, ChevronRight, Navigation, Clock, CheckCircle2 } from "lucide-react";
import { DriverSummary, DriverStatus } from "../supervision.types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const DRIVER_STATUS_CFG: Record<DriverStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  "En Ruta":  { color: "#fff", bg: "#155DFC", border: "#1D4ED8", icon: Navigation   },
  Pendiente:  { color: "#fff", bg: "#D97706", border: "#B45309", icon: Clock        },
  Disponible: { color: "#fff", bg: "#16A34A", border: "#15803D", icon: CheckCircle2 },
};

interface Props {
  driversSummary: DriverSummary[];
  onDriverClick: (initials: string) => void;
}

export function DriversHorizontalList({ driversSummary, onDriverClick }: Props) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="show">
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <Users className="w-4 h-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
        <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Choferes Activos
        </h2>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#155DFC", color: "#fff" }}>
          {driversSummary.length}
        </span>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={() => {
            const el = scrollRef.current;
            if (el) setShowScrollIndicator(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
          }}
          className="overflow-x-auto py-3"
          style={{ scrollbarWidth: "none", overflowY: "visible" }}
        >
          <motion.div
            variants={containerVariants} initial="hidden" animate="show"
            className="flex gap-3 w-max"
          >
            {driversSummary.map((d, idx) => {
              const dsCfg = DRIVER_STATUS_CFG[d.status];
              const StatusIcon = dsCfg.icon;
              return (
                <div key={d.initials} className="flex items-stretch gap-3">
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -1, transition: { type: "spring", stiffness: 280, damping: 22 } }}
                    whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 28 } }}
                    onClick={(e) => { e.stopPropagation(); onDriverClick(d.initials); }}
                    className="flex flex-col rounded-2xl cursor-pointer border shrink-0 overflow-hidden"
                    style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", width: "200px" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; }}
                  >
                    <div className="p-4 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0"
                          style={{ backgroundColor: d.color }}
                        >
                          {d.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                            {d.name.split(" ")[0]}
                          </p>
                          <p className="text-[12px] leading-tight truncate" style={{ color: "var(--text-muted)" }}>
                            {d.name.split(" ").slice(1).join(" ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between"
                        style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", paddingTop: "10px", paddingBottom: "10px" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>Entregadas</p>
                        <p className="text-2xl font-black tabular-nums" style={{ color: "var(--text-primary)" }}>{d.entregado}</p>
                      </div>

                      <span
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold"
                        style={{ backgroundColor: dsCfg.bg, border: `1px solid ${dsCfg.border}`, color: dsCfg.color }}
                      >
                        <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                        {d.status}
                      </span>
                    </div>
                  </motion.div>
                  {idx < driversSummary.length - 1 && (
                    <div className="w-px self-stretch my-2 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>

        <AnimatePresence>
          {showScrollIndicator && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
                style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }}
              />
              <motion.div
                initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.25 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-20"
              >
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                >
                  <ChevronRight className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
