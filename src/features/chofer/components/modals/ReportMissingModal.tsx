"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Send, CheckCircle2, Minus, Plus } from "lucide-react";
import { InvoiceItem } from "../../models";

const WH_COLOR: Record<string, string> = { Herrajes: "#F59E0B", Aluminio: "#155DFC", Vidrio: "#10B981" };
const EASE = [0.22, 1, 0.36, 1] as const;

interface ReportMissingModalProps {
  items: InvoiceItem[];
  onClose: () => void;
  onSubmit: (entries: { itemId: string; qty: number }[]) => void;
}

export const ReportMissingModal = ({ items, onClose, onSubmit }: ReportMissingModalProps) => {
  const [qtys, setQtys] = useState<Record<string, number>>(() =>
    Object.fromEntries(items.map((i) => [i.id, 0]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportList = useMemo(
    () => items.filter((i) => qtys[i.id] > 0).map((i) => ({ itemId: i.id, qty: qtys[i.id] })),
    [items, qtys]
  );

  const setQty = (id: string, val: number) => setQtys((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = () => {
    if (reportList.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit(reportList);
      setTimeout(() => onClose(), 1500);
    }, 1200);
  };

  const modal = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="w-full max-w-md rounded-3xl border flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-12 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Reporte enviado</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Se ha notificado al almacén sobre el material faltante.</p>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-red-500">Reportar Faltante</h3>
                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Indica cuánto falta de cada material</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }} onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center focus:outline-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
                </motion.button>
              </div>

              <div className="overflow-y-auto flex-1">
                {items.map((item, idx) => {
                  const qty = qtys[item.id] ?? 0;
                  const active = qty > 0;
                  return (
                    <motion.div
                      key={item.id}
                      animate={{ backgroundColor: "transparent" }}
                      transition={{ duration: 0.2 }}
                      className="px-5 py-4"
                      style={{ borderBottom: idx < items.length - 1 ? "1px solid var(--border-color)" : "none" }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-1.5 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: active ? "#EF4444" : (WH_COLOR[item.warehouse] ?? "#64748B") }}
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: active ? "#EF4444" : "var(--text-secondary)" }}>
                              {item.warehouse}
                            </p>
                            <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{item.description}</p>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => setQty(item.id, active ? 0 : 1)}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none transition-all"
                          style={active
                            ? { backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }
                            : { backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }
                          }
                        >
                          {active ? "Quitar" : "+ Falta"}
                        </motion.button>
                      </div>

                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: EASE }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="h-px w-full mt-3 mb-3" style={{ backgroundColor: "var(--border-color)" }} />
                            <div className="flex justify-center">
                              <div
                                className="flex items-center gap-5 px-6 py-4 rounded-2xl"
                                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)" }}
                              >
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => setQty(item.id, Math.max(1, qty - 1))}
                                  className="w-12 h-12 rounded-xl flex items-center justify-center focus:outline-none disabled:opacity-25 shrink-0"
                                  style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
                                  disabled={qty <= 1}
                                >
                                  <Minus className="w-5 h-5" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
                                </motion.button>
                                <span className="text-8xl font-extrabold tabular-nums leading-none" style={{ color: "var(--text-primary)", minWidth: "2ch", textAlign: "center" }}>
                                  {qty}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => setQty(item.id, Math.min(item.quantity, qty + 1))}
                                  className="w-12 h-12 rounded-xl flex items-center justify-center focus:outline-none disabled:opacity-25 shrink-0"
                                  style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
                                  disabled={qty >= item.quantity}
                                >
                                  <Plus className="w-5 h-5" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-4 border-t shrink-0" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || reportList.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 focus:outline-none transition-all disabled:opacity-50 disabled:scale-100"
                  style={{ backgroundColor: "#EF4444", color: "#FFFFFF" }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2.5} />
                      Enviar Reporte{reportList.length > 0 ? ` (${reportList.length})` : ""}
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
};
