"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, RotateCcw } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

interface Props {
  totalMonto: number;
  entregado: boolean;
  marcarEntregado: () => void;
  revertirEntregado: () => void;
  checkedCount: number;
  totalCount: number;
}

export function CajaSummaryActions({ totalMonto, entregado, marcarEntregado, revertirEntregado, checkedCount, totalCount }: Props) {
  const allChecked = totalCount > 0 && checkedCount === totalCount;

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
          {!entregado && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: totalCount }).map((_, i) => (
                  <motion.div key={i}
                    animate={{ backgroundColor: i < checkedCount ? "#10B981" : "var(--border-color)" }}
                    transition={{ duration: 0.25 }}
                    className="h-1 rounded-full"
                    style={{ width: totalCount > 0 ? `${Math.min(32, 96 / totalCount)}px` : "32px" }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold tabular-nums"
                style={{ color: allChecked ? "#10B981" : "var(--text-muted)" }}>
                {checkedCount}/{totalCount} verificadas
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: entregado ? 1 : 1.02 }}
            whileTap={{ scale: entregado ? 1 : 0.97 }}
            onClick={entregado ? revertirEntregado : marcarEntregado}
            animate={{
              background: entregado
                ? "linear-gradient(135deg,#374151,#4B5563)"
                : allChecked
                  ? "linear-gradient(135deg,#10B981,#059669)"
                  : "linear-gradient(135deg,#155DFC,#2563EB)",
            }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white md:px-6 md:py-3 md:rounded-2xl md:gap-2.5"
            style={{
              boxShadow: entregado ? "none" : allChecked ? "0 4px 24px rgba(16,185,129,0.45)" : "0 4px 20px rgba(21,93,252,0.4)",
            }}
          >
            {entregado ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {entregado ? "Desmarcar entregado" : allChecked ? "Confirmar entrega" : "Marcar entregado"}
            {!entregado && <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
