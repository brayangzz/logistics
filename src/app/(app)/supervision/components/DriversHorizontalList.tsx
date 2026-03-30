"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Users, ChevronRight, ChevronLeft, Navigation, Clock, CheckCircle2 } from "lucide-react";
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
  "En Ruta":  { color: "#155DFC", bg: "rgba(21,93,252,0.12)",  border: "rgba(21,93,252,0.25)",  icon: Navigation   },
  Pendiente:  { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", icon: Clock        },
  Disponible: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: CheckCircle2 },
};

interface Props {
  driversSummary: DriverSummary[];
  onDriverClick: (initials: string) => void;
}

export function DriversHorizontalList({ driversSummary, onDriverClick }: Props) {
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

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
          onScroll={updateScrollState}
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
                          style={{ backgroundColor: d.color, boxShadow: `0 0 16px ${d.color}33` }}
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
          {canScrollLeft && (
            <>
              <motion.div
                key="fade-left"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-0 bottom-0 w-20 pointer-events-none"
                style={{ background: "linear-gradient(to right, var(--bg-primary) 30%, transparent)" }}
              />
              <motion.button
                key="btn-left"
                initial={{ opacity: 0, x: -8, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                whileHover={{ scale: 1.12, boxShadow: "0 0 20px rgba(21,93,252,0.7)" }}
                whileTap={{ scale: 0.88 }}
                onClick={() => { scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" }); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, backgroundColor: "#155DFC", boxShadow: "0 0 14px rgba(21,93,252,0.5)", border: "1px solid rgba(21,93,252,0.6)" }}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <>
              <motion.div
                key="fade-right"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
                style={{ background: "linear-gradient(to left, var(--bg-primary) 30%, transparent)" }}
              />
              <motion.button
                key="btn-right"
                initial={{ opacity: 0, x: 8, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                whileHover={{ scale: 1.12, boxShadow: "0 0 20px rgba(21,93,252,0.7)" }}
                whileTap={{ scale: 0.88 }}
                onClick={() => { scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" }); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, backgroundColor: "#155DFC", boxShadow: "0 0 14px rgba(21,93,252,0.5)", border: "1px solid rgba(21,93,252,0.6)" }}
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
