"use client";

import { motion } from "framer-motion";
import { Banknote, CreditCard, CheckCircle2, RotateCcw, ChevronRight, ArrowLeftRight } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

interface Props {
  totalEfectivo: number;
  totalCredito: number;
  totalTransferencia: number;
  entregado: boolean;
  marcarEntregado: () => void;
  revertirEntregado: () => void;
  checkedCount: number;
  totalCount: number;
}

export function CajaSummaryActions({
  totalEfectivo, totalCredito, totalTransferencia, entregado,
  marcarEntregado, revertirEntregado,
  checkedCount, totalCount,
}: Props) {
  const allChecked = totalCount > 0 && checkedCount === totalCount;
  const totalDigital = totalCredito + totalTransferencia;

  return (
    <div className="rounded-2xl border relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/30 to-transparent" />

      {/* Stats row */}
      <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}>

        {/* Progreso */}
        <div className="px-5 py-4 flex flex-col gap-2 md:flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Verificadas
          </p>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalCount }).map((_, i) => (
                <motion.div key={i}
                  animate={{ backgroundColor: i < checkedCount ? "#10B981" : "rgba(255,255,255,0.12)" }}
                  transition={{ duration: 0.25 }}
                  className="h-1.5 rounded-full"
                  style={{ width: totalCount > 0 ? `${Math.min(28, 84 / totalCount)}px` : "28px" }}
                />
              ))}
            </div>
            <span className="text-sm font-bold tabular-nums"
              style={{ color: allChecked ? "#10B981" : "var(--text-primary)" }}>
              {checkedCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Separador vertical solo en md+ */}
        <div className="hidden md:block w-px self-stretch" style={{ backgroundColor: "var(--border-color)" }} />

        {/* Pagos digitales (crédito + transferencia) */}
        <div className="px-5 py-4 md:flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Pagos Digitales
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
              <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />
            </div>
            <span className="text-base font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {fmt(totalDigital)}
            </span>
          </div>
        </div>

        {/* Separador vertical solo en md+ */}
        <div className="hidden md:block w-px self-stretch" style={{ backgroundColor: "var(--border-color)" }} />

        {/* Efectivo a recibir */}
        <div className="px-5 py-4 md:flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            Efectivo a recibir
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(16,185,129,0.15)" }}>
              <Banknote className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            </div>
            <span className="text-3xl font-extrabold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>
              {fmt(totalEfectivo)}
            </span>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="px-5 py-4 flex items-center justify-end">
        <motion.button
          whileHover={{ scale: (!entregado && !allChecked) ? 1 : entregado ? 1 : 1.02 }}
          whileTap={{ scale: (!entregado && !allChecked) ? 1 : entregado ? 1 : 0.97 }}
          onClick={entregado ? revertirEntregado : allChecked ? marcarEntregado : undefined}
          disabled={!entregado && !allChecked}
          animate={{
            background: entregado
              ? "linear-gradient(135deg,#374151,#4B5563)"
              : allChecked
                ? "linear-gradient(135deg,#10B981,#059669)"
                : "linear-gradient(135deg,#1e293b,#334155)",
          }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold md:px-6 md:py-3 md:rounded-2xl"
          style={{
            color: (!entregado && !allChecked) ? "var(--text-muted)" : "#fff",
            boxShadow: entregado ? "none" : allChecked ? "0 4px 24px rgba(16,185,129,0.45)" : "none",
            cursor: (!entregado && !allChecked) ? "not-allowed" : "pointer",
            opacity: (!entregado && !allChecked) ? 0.6 : 1,
          }}
        >
          {entregado ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {entregado ? "Reabrir caja" : allChecked ? "Cerrar caja" : "Liquidar chofer"}
          {!entregado && <ChevronRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
}
