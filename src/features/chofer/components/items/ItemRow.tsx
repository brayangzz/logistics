"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { InvoiceItem } from "../../models";

interface ItemRowProps {
  item: InvoiceItem;
  isStaged: boolean;
  isSaved: boolean;
  reportedQty?: number;
  onToggle: () => void;
}

export const ItemRow = ({ item, isStaged, isSaved, reportedQty, onToggle }: ItemRowProps) => {
  const totalKg = (item.quantity * item.weightPerUnit).toFixed(1);
  const isPending = isStaged !== isSaved;
  const checked = isStaged;

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl focus:outline-none"
      style={{
        backgroundColor: "var(--bg-input)",
        border: `1px solid ${isPending ? "rgba(21,93,252,0.5)" : "var(--border-color)"}`,
        cursor: "pointer",
        transition: "border-color 0.12s",
        minHeight: 52,
      }}
    >
      <div
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
        style={{
          border: `2px solid ${checked ? "#155DFC" : "var(--border-hover)"}`,
          backgroundColor: checked ? "#155DFC" : "transparent",
          transition: "background-color 0.12s, border-color 0.12s",
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 10 10" width="12" height="12" fill="none">
          <polyline
            points="1.5,5.5 4,8 8.5,2"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s ease" }}
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            color: isSaved ? "var(--text-secondary)" : (reportedQty ? "#EF4444" : "var(--text-primary)"),
            textDecoration: isSaved ? "line-through" : "none",
            transition: "color 0.12s",
          }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>×{item.quantity}</span>
          <span className="text-[10px]" style={{ color: "var(--border-hover)" }}>·</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{totalKg} kg</span>
        </div>
        {reportedQty !== undefined && !isSaved && (
          <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md w-max" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            <AlertTriangle className="w-3 h-3 text-red-500" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-red-500 tracking-wide uppercase">Reportado: Faltan {reportedQty}</span>
          </div>
        )}
      </div>

      <div
        className="shrink-0 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: "#155DFC", visibility: isPending ? "visible" : "hidden" }}
      />
    </motion.button>
  );
};
