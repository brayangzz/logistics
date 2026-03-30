"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  safePage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPage: (n: number) => void;
}

export function PaginationControls({ safePage, totalPages, totalItems, pageSize, onPage }: PaginationControlsProps) {
  if (totalPages <= 1) return null;
  return (
    <div
      className="px-4 sm:px-5 py-3.5 flex items-center justify-between text-sm border-t gap-2"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}
    >
      <span className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>
          {(safePage - 1) * pageSize + 1}–{Math.min(totalItems, safePage * pageSize)}
        </span>
        {" "}de {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <motion.button
          onClick={() => onPage(Math.max(1, safePage - 1))} disabled={safePage === 1}
          whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-30"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
          <motion.button
            key={n}
            onClick={() => onPage(n)}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold"
            style={{
              backgroundColor: n === safePage ? "#155DFC" : "transparent",
              color: n === safePage ? "#fff" : "var(--text-muted)",
            }}
          >
            {n}
          </motion.button>
        ))}
        <motion.button
          onClick={() => onPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages}
          whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-30"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
