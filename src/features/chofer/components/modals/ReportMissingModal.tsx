"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Send, CheckCircle2, Minus, Plus } from "lucide-react";
import { InvoiceItem } from "../../models";

const WH_COLOR: Record<string, string> = { Herrajes: "#F59E0B", Aluminio: "#155DFC", Vidrio: "#10B981" };
const WH_ORDER = ["Herrajes", "Aluminio", "Vidrio"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 400, damping: 28 } as const;

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

  const itemsByWarehouse = useMemo(() =>
    items.reduce((acc: Record<string, InvoiceItem[]>, item) => {
      if (!acc[item.warehouse]) acc[item.warehouse] = [];
      acc[item.warehouse].push(item);
      return acc;
    }, {}),
    [items]);

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
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border flex flex-col overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.6)",
            maxHeight: "92vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-14 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Reporte enviado</h3>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  Se notificó al almacén sobre el material faltante.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* HEADER */}
              <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                style={{ borderColor: "var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                    <AlertTriangle className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-red-500">Reportar Faltante</h3>
                      <AnimatePresence>
                        {reportList.length > 0 && (
                          <motion.span
                            key="badge"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={SPRING}
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold bg-red-500 text-white"
                          >
                            {reportList.length}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      Indica cuánto falta de cada material
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }} onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center focus:outline-none"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* SCROLLABLE LIST */}
              <div className="overflow-y-auto flex-1 py-1">
                {WH_ORDER.filter((wh) => itemsByWarehouse[wh]?.length).map((wh) => (
                  <div key={wh}>
                    {/* Warehouse section header */}
                    <div
                      className="flex items-center gap-2 mx-5 my-2 pl-3 py-1.5 rounded-lg"
                      style={{
                        borderLeft: `3px solid ${WH_COLOR[wh]}`,
                        backgroundColor: "var(--bg-tertiary)",
                        border: `1px solid var(--border-color)`,
                        borderLeftColor: WH_COLOR[wh],
                        borderLeftWidth: "3px",
                      }}
                    >
                      <span className="text-[10px] font-extrabold uppercase tracking-widest"
                        style={{ color: WH_COLOR[wh] }}>
                        {wh}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        · {itemsByWarehouse[wh].length} ítem{itemsByWarehouse[wh].length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Items */}
                    {itemsByWarehouse[wh].map((item, idx) => {
                      const qty = qtys[item.id] ?? 0;
                      const active = qty > 0;
                      const isLast = idx === itemsByWarehouse[wh].length - 1;
                      return (
                        <div
                          key={item.id}
                          className="px-5 py-3.5"
                          style={{ borderBottom: !isLast ? "1px solid var(--border-color)" : "none" }}
                        >
                          {/* Row: description + toggle button */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-1 h-9 rounded-full shrink-0"
                                style={{ backgroundColor: active ? "#EF4444" : WH_COLOR[wh] }} />
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                                  {item.description}
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                  ×{item.quantity} unidades
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.88 }}
                              onClick={() => setQty(item.id, active ? 0 : 1)}
                              className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold focus:outline-none"
                              style={active
                                ? { backgroundColor: "var(--bg-tertiary)", color: "#EF4444", border: "1px solid var(--border-color)" }
                                : { backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }
                              }
                            >
                              {active ? "Quitar" : "+ Falta"}
                            </motion.button>
                          </div>

                          {/* Accordion counter */}
                          <AnimatePresence initial={false}>
                            {active && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.26, ease: EASE }}
                                style={{ overflow: "hidden" }}
                              >
                                <div className="mt-3 flex items-center justify-between gap-2 px-1 pb-2">
                                  {/* Decrement */}
                                  <motion.button
                                    whileTap={{ scale: 0.82 }}
                                    onClick={() => setQty(item.id, Math.max(1, qty - 1))}
                                    disabled={qty <= 1}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center focus:outline-none disabled:opacity-30 shrink-0"
                                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                                  >
                                    <Minus className="w-5 h-5" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
                                  </motion.button>

                                  {/* Quantity */}
                                  <div className="flex-1 flex items-center justify-center py-2" style={{ overflow: "visible" }}>
                                    <AnimatePresence mode="popLayout" initial={false}>
                                      <motion.span
                                        key={qty}
                                        initial={{ y: -20, opacity: 0, scale: 0.75 }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        exit={{ y: 20, opacity: 0, scale: 0.75 }}
                                        transition={SPRING}
                                        className="font-extrabold tabular-nums leading-none"
                                        style={{ color: "#EF4444", fontSize: "2.25rem" }}
                                      >
                                        {qty}
                                      </motion.span>
                                    </AnimatePresence>
                                  </div>

                                  {/* Increment */}
                                  <motion.button
                                    whileTap={{ scale: 0.82 }}
                                    onClick={() => setQty(item.id, Math.min(item.quantity, qty + 1))}
                                    disabled={qty >= item.quantity}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center focus:outline-none disabled:opacity-30 shrink-0"
                                    style={{ backgroundColor: "#EF4444" }}
                                  >
                                    <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t shrink-0"
                style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
                <motion.button
                  whileHover={reportList.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={reportList.length > 0 ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={isSubmitting || reportList.length === 0}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold focus:outline-none transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: "#EF4444",
                    color: "#FFFFFF",
                    boxShadow: "none",
                  }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ x: 3, rotate: -12 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center"
                      >
                        <Send className="w-4 h-4" strokeWidth={2.5} />
                      </motion.div>
                      Enviar Reporte
                      {reportList.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[11px] font-bold bg-white/20">
                          {reportList.length}
                        </span>
                      )}
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
