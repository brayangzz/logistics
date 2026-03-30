"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CheckCircle2 } from "lucide-react";
import { Chofer } from "@/features/caja/hooks/useCaja";

const AVATAR_COLORS: Record<string, string> = {
  CR: "#6366F1", MM: "#10B981", EG: "#155DFC",
  JH: "#8B5CF6", RD: "#F59E0B", MT: "#0EA5E9",
};

function fmt(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
}

interface Props {
  choferes: Chofer[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CajaChoferPanel({ choferes, selectedId, onSelect }: Props) {
  const [filtro, setFiltro] = useState<"pendientes" | "entregados">("pendientes");

  const choferesFiltrados = choferes.filter(ch =>
    filtro === "pendientes" ? !ch.entregado : ch.entregado
  );

  return (
    <div className="lg:sticky lg:top-6 flex flex-col gap-3">

      {/* Header card */}
      <div className="rounded-2xl p-4 border flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
            Choferes
          </h2>
          <div className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
            {choferes.length} Asignados
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ backgroundColor: "rgba(21,93,252,0.08)", borderColor: "rgba(21,93,252,0.2)" }}>
          <Wallet className="w-4 h-4 text-[#155DFC]" />
        </div>
      </div>

      {/* Filtro switch */}
      <div className="rounded-2xl border p-1 flex gap-0.5"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        {([
          { key: "pendientes", label: "Pendientes", count: choferes.filter(c => !c.entregado).length, dot: "#F59E0B" },
          { key: "entregados", label: "Entregados", count: choferes.filter(c =>  c.entregado).length, dot: "#4ade80" },
        ] as const).map((op) => {
          const active = filtro === op.key;
          return (
            <button key={op.key} onClick={() => setFiltro(op.key)}
              className="relative flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[11px] font-bold focus:outline-none whitespace-nowrap"
              style={{ color: active ? "#fff" : "var(--text-muted)" }}>
              {active && (
                <motion.div layoutId="caja-filter-pill" className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #155DFC, #2563EB)", boxShadow: "0 4px 12px rgba(21,93,252,0.3)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <span className="relative z-10 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: active ? "#fff" : op.dot }} />
              <span className="relative z-10 whitespace-nowrap">{op.label}</span>
              <span className="relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.2)" : "var(--border-color)",
                  color: active ? "#fff" : "var(--text-secondary)",
                }}>
                {op.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chofer cards */}
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-3 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 md:mx-0 px-4 md:px-0">
        <AnimatePresence mode="popLayout">
          {choferesFiltrados.length === 0 && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} className="text-xs py-4 text-center w-full"
              style={{ color: "var(--text-muted)" }}>
              Sin choferes en este filtro
            </motion.p>
          )}
          {choferesFiltrados.map((ch, index) => {
            const isSelected = ch.id === selectedId;
            const avatarBg = AVATAR_COLORS[ch.initials] ?? "#64748B";
            const chTotal = ch.pedidos.reduce((s, p) => s + p.monto, 0);

            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                transition={{ duration: 0.15, ease: "easeOut", delay: index * 0.03 }}
                onClick={() => onSelect(ch.id)}
                className="group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center shrink-0 w-[88%] md:w-auto"
                style={{
                  backgroundColor: isSelected ? "var(--bg-card)" : "var(--bg-secondary)",
                  borderColor: isSelected ? "#155DFC" : "var(--border-color)",
                  boxShadow: isSelected ? "0 0 0 1px #155DFC, 0 4px 20px rgba(21,93,252,0.12)" : "none",
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)";
                  }
                }}
              >
                {isSelected && (
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[3px] bg-[#155DFC] rounded-r-full shadow-[0_0_10px_rgba(21,93,252,0.7)]" />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                      style={{ backgroundColor: avatarBg }}>
                      {ch.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight truncate" style={{ color: "var(--text-primary)" }}>{ch.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {ch.pedidos.length} pedido{ch.pedidos.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {ch.entregado ? (
                        <CheckCircle2 className="w-4 h-4" style={{ color: "#4ade80" }} />
                      ) : (
                        <div className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {ch.entregado ? (
                      <div className="flex items-center px-2.5 py-1 rounded-lg border"
                        style={{ backgroundColor: "rgba(74,222,128,0.06)", borderColor: "rgba(74,222,128,0.25)" }}>
                        <span className="text-xs font-bold" style={{ color: "#4ade80" }}>Entregado</span>
                      </div>
                    ) : (
                      <div className="flex items-center px-2.5 py-1 rounded-lg border"
                        style={{ backgroundColor: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
                        <span className="text-xs font-bold" style={{ color: "#F59E0B" }}>Pendiente</span>
                      </div>
                    )}
                    <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: "var(--text-secondary)" }}>
                      {fmt(chTotal)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
