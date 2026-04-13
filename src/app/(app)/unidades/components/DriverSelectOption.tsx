"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Driver } from "../unidades.types";

const PALETTE = ["#6366F1", "#10B981", "#155DFC", "#8B5CF6", "#F59E0B", "#0EA5E9"];
export const av = (i: string): { bg: string; color: string } => {
  const code = (i.charCodeAt(0) ?? 0) + (i.charCodeAt(1) ?? 0);
  return { bg: PALETTE[code % PALETTE.length], color: "#fff" };
};

interface Props {
  driver: Driver;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
}

export function DriverSelectOption({ driver, isSelected, index, onSelect }: Props) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left"
      style={{
        backgroundColor: isSelected ? "var(--accent-bg)" : hov ? "var(--select-option-hover)" : "transparent",
        transition: "background-color 0.12s",
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
        style={{ backgroundColor: av(driver.initials).bg, color: av(driver.initials).color }}>
        {driver.initials}
      </div>
      <span className="text-[15px] font-medium flex-1 truncate" style={{ color: "var(--text-primary)" }}>
        {driver.nombre}
      </span>
      <AnimatePresence>
        {isSelected && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}>
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
