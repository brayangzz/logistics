"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, RotateCcw, X, Pencil } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

interface Props {
  totalMonto: number;
  entregado: boolean;
  marcarEntregado: () => void;
  revertirEntregado: () => void;
}

export function CajaSummaryActions({ totalMonto, entregado, marcarEntregado, revertirEntregado }: Props) {
  const [revertConfirm, setRevertConfirm] = useState(false);

  return (
    <div className="rounded-2xl border p-5 md:p-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/30 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
            Total Facturado
          </p>
          <p className="text-2xl md:text-4xl font-extrabold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>
            {fmt(totalMonto)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {entregado && (
              <motion.div key="revert-area"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {revertConfirm ? (
                    <motion.div key="revert-confirm"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="flex items-center gap-2">
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.93 }}
                        onClick={() => { revertirEntregado(); setRevertConfirm(false); }}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold"
                        style={{ backgroundColor: "#F59E0B", color: "#fff" }}>
                        <RotateCcw className="w-3.5 h-3.5" />
                        Confirmar
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.93 }}
                        onClick={() => setRevertConfirm(false)}
                        className="p-2.5 rounded-xl border"
                        style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.button key="revert-idle"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                      onClick={() => setRevertConfirm(true)}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: entregado ? 1 : 1.02 }}
            whileTap={{ scale: entregado ? 1 : 0.97 }}
            onClick={marcarEntregado}
            disabled={entregado}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed md:px-6 md:py-3 md:rounded-2xl md:gap-2.5"
            style={{
              background: "linear-gradient(135deg, #155DFC, #2563EB)",
              boxShadow: entregado ? "none" : "0 4px 20px rgba(21,93,252,0.4)",
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            {entregado ? "Ya entregado" : "Marcar entregado"}
            {!entregado && <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
