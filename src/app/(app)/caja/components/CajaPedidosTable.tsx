"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote, MapPin, FileText, CheckCircle2,
  DollarSign, X, Trash2, Check,
  CreditCard, ArrowLeftRight,
} from "lucide-react";
import { Chofer } from "@/features/caja/hooks/useCaja";

const AVATAR_COLORS: Record<string, string> = {
  CR: "#6366F1", MM: "#10B981", EG: "#155DFC",
  JH: "#8B5CF6", RD: "#F59E0B", MT: "#0EA5E9",
};

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

const FORMA_PAGO_CONFIG = {
  efectivo:      { label: "Efectivo",       color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)"  },
  transferencia: { label: "Transferencia",  color: "#0EA5E9", bg: "rgba(14,165,233,0.08)",  border: "rgba(14,165,233,0.25)"  },
  credito:       { label: "Crédito",        color: "#8B5CF6", bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.25)"  },
};

const GRID_COLS = "1fr 1fr 1fr 1.4fr 1fr auto";

interface Props {
  selected: Chofer;
  selectedId: string;
  totalMonto: number;
  cancelarPedido: (folio: string) => void;
  checkedFolios: Record<string, boolean>;
  toggleCheck: (folio: string) => void;
  entregado?: boolean;
}

export function CajaPedidosTable({ selected, selectedId, totalMonto, cancelarPedido, checkedFolios, toggleCheck, entregado }: Props) {
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  return (
    <>
      {/* Info card del chofer seleccionado */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedId + "-info"}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="rounded-2xl border p-5 md:p-6 relative overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/40 to-transparent" />
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl text-white flex items-center justify-center shrink-0 font-bold text-base border border-blue-400/20"
                style={{ backgroundColor: AVATAR_COLORS[selected.initials] ?? "#64748B", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
              >
                {selected.initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-xl font-extrabold leading-tight" style={{ color: "var(--text-primary)" }}>
                  {selected.name}
                </h2>
                <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border"
                    style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}>
                    <FileText className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
                    {selected.pedidos.length} pedido{selected.pedidos.length !== 1 ? "s" : ""}
                  </span>
                  {selected.entregado ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border"
                      style={{ color: "#4ade80", backgroundColor: "rgba(74,222,128,0.07)", borderColor: "rgba(74,222,128,0.25)" }}>
                      <CheckCircle2 className="w-3 h-3" />
                      Entregado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border"
                      style={{ color: "#F59E0B", backgroundColor: "rgba(245,158,11,0.07)", borderColor: "rgba(245,158,11,0.25)" }}>
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border shrink-0"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#155DFC" }}>
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Total Facturado
                </p>
                <p className="text-sm font-bold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>
                  {fmt(totalMonto)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tabla de pedidos */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedId + "-pedidos"}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut", delay: 0.05 }}
          className="rounded-2xl border"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
        >
          {/* Table header */}
          <div className="px-5 py-4 border-b flex items-center justify-between gap-3"
            style={{ borderColor: "var(--border-color)" }}>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Desglose de Pedidos</p>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: "rgba(21,93,252,0.1)", color: "#155DFC" }}>
                {selected.pedidos.length} facturas
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              onClick={() => setCancelConfirm(cancelConfirm ? null : "__selecting__")}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: cancelConfirm ? "#ef4444" : "#155DFC", color: "#fff" }}
              title="Cancelar factura">
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Cancellation panel */}
          <AnimatePresence initial={false}>
            {cancelConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: "hidden", borderBottom: "1px solid var(--border-color)" }}
              >
                <div className="px-5 py-4 flex flex-col gap-2" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
                    {cancelConfirm === "__selecting__" ? "¿Qué factura deseas cancelar?" : "Confirmar cancelación"}
                  </p>
                  {selected.pedidos.map((p) => {
                    const isChosen = cancelConfirm === p.folio;
                    return (
                      <button
                        key={p.folio}
                        onClick={() => setCancelConfirm(isChosen ? "__selecting__" : p.folio)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-left w-full transition-all duration-200"
                        style={{
                          backgroundColor: "var(--bg-input)",
                          borderColor: isChosen ? "#ef4444" : "var(--border-color)",
                          boxShadow: isChosen ? "0 0 0 1px #ef4444" : "none",
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                            style={{ backgroundColor: isChosen ? "#ef4444" : "transparent", border: `1.5px solid ${isChosen ? "#ef4444" : "var(--border-color)"}` }}>
                            <AnimatePresence initial={false}>
                              {isChosen && (
                                <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 28 }}>
                                  <Check className="w-3 h-3 text-white" />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <span className="text-sm font-bold transition-colors duration-200 shrink-0"
                            style={{ color: isChosen ? "#ef4444" : "var(--text-primary)" }}>{p.folio}</span>
                          <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{p.cliente}</span>
                        </div>
                        <span className="text-sm font-bold tabular-nums transition-colors duration-200 shrink-0 ml-2"
                          style={{ color: isChosen ? "#ef4444" : "var(--text-primary)" }}>
                          {fmt(p.monto)}
                        </span>
                      </button>
                    );
                  })}
                  <div className="flex items-center gap-2 mt-1">
                    <AnimatePresence initial={false}>
                      {cancelConfirm !== "__selecting__" && (
                        <motion.button
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }}
                          onClick={() => { cancelarPedido(cancelConfirm!); setCancelConfirm(null); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                          style={{ backgroundColor: "#ef4444", color: "#fff" }}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Confirmar
                        </motion.button>
                      )}
                    </AnimatePresence>
                    <motion.button whileTap={{ scale: 0.96 }}
                      onClick={() => setCancelConfirm(null)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold border"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                      Cerrar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-b-2xl">
            <div style={{ minWidth: "560px" }}>
              <div className="grid gap-4 px-5 py-3" style={{ gridTemplateColumns: GRID_COLS, borderBottom: "1px solid var(--border-color)" }}>
                {["FACTURA #", "CLIENTE", "MONTO", "UBICACIÓN", "FORMA DE PAGO"].map(col => (
                  <p key={col} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{col}</p>
                ))}
                <div />
              </div>
              <AnimatePresence initial={false}>
                {selected.pedidos.map((p, i) => {
                  const isLast = i === selected.pedidos.length - 1;
                  const fpConfig = FORMA_PAGO_CONFIG[p.formaPago];
                  const FpIcon = p.formaPago === "efectivo" ? Banknote : p.formaPago === "transferencia" ? ArrowLeftRight : CreditCard;
                  return (
                    <motion.div key={`${selectedId}-${p.folio}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}>
                      {(() => {
                        const isChecked = entregado ? true : !!checkedFolios[p.folio];
                        const isCredito = p.formaPago === "credito";
                        return (
                          <div className="grid gap-4 items-center px-5 py-4"
                            style={{
                              gridTemplateColumns: GRID_COLS,
                              borderBottom: isLast ? "none" : "1px solid var(--border-color)",
                              opacity: (isChecked && !entregado) ? 0.55 : 1,
                              transition: "opacity 0.25s ease",
                            }}>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p.folio}</span>
                            </div>
                            <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{p.cliente}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{fmt(p.monto)}</span>
                            <div className="flex items-start gap-1.5 min-w-0">
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                              <span className="text-xs font-medium leading-tight line-clamp-2" style={{ color: "var(--text-secondary)" }}>{p.ubicacion}</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border w-fit"
                              style={{ backgroundColor: fpConfig.bg, borderColor: fpConfig.border }}>
                              <FpIcon className="w-3 h-3 shrink-0" style={{ color: fpConfig.color }} />
                              <span className="text-xs font-bold" style={{ color: fpConfig.color }}>{fpConfig.label}</span>
                            </div>
                            {/* Checkbox */}
                            <motion.button
                              onClick={() => !entregado && toggleCheck(p.folio)}
                              whileHover={entregado ? {} : { scale: 1.1 }}
                              whileTap={entregado ? {} : { scale: 0.86 }}
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2"
                              style={{
                                backgroundColor: isChecked ? "#10B981" : "var(--bg-tertiary)",
                                borderColor: isChecked ? "#10B981" : "var(--border-hover)",
                                boxShadow: isChecked ? "0 0 0 4px rgba(16,185,129,0.20), 0 2px 8px rgba(16,185,129,0.30)" : "none",
                                cursor: entregado ? "default" : "pointer",
                                transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
                              }}
                            >
                              <Check
                                className="w-3.5 h-3.5"
                                strokeWidth={isChecked ? 3 : 2.5}
                                style={{
                                  color: isChecked ? "#fff" : "var(--text-muted)",
                                  transition: "color 0.2s",
                                }}
                              />
                            </motion.button>
                          </div>
                        );
                      })()}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
