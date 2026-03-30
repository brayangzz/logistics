"use client";

import { useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastData } from "../asignar.types";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 36, mass: 0.8 };

const Toast = ({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) => {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 8,  scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ ...SPRING }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl cursor-pointer select-none"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid rgba(16,185,129,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(16,185,129,0.15)",
        minWidth: 260,
        maxWidth: 340,
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(16,185,129,0.15)" }}>
        <CheckCircle2 className="w-4.5 h-4.5" style={{ color: "#10B981" }} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          Chofer asignado
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
          {toast.invoice} → {toast.driverName}
        </p>
      </div>
      <X className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onDismiss }:
  { toasts: ToastData[]; onDismiss: (id: number) => void }) => (
  <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-[9999] flex flex-col gap-2 items-stretch sm:items-end pointer-events-none">
    <AnimatePresence mode="sync">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);
