"use client";

import { motion } from "framer-motion";
import { Package, Weight, Truck, CheckCircle2, MapPin, ScanBarcode } from "lucide-react";
import { Driver } from "../autorizar.types";

interface AuthDriverCardProps {
  driver: Driver;
  isAuthorized: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onScan: () => void;
}

export function AuthDriverCard({ driver, isAuthorized, isHovered, onHoverStart, onHoverEnd, onScan }: AuthDriverCardProps) {
  const accent = driver.avatar.bg;

  return (
    <motion.div
      className="flex flex-col h-full"
    >
      <motion.div
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="flex flex-col flex-1 rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderTop: `3px solid ${isAuthorized ? "#10B981" : "#F59E0B"}`,
          borderLeft: `1px solid ${isAuthorized ? "rgba(16,185,129,0.25)" : "var(--border-color)"}`,
          borderRight: `1px solid ${isAuthorized ? "rgba(16,185,129,0.25)" : "var(--border-color)"}`,
          borderBottom: `1px solid ${isAuthorized ? "rgba(16,185,129,0.25)" : "var(--border-color)"}`,
          boxShadow: isAuthorized
            ? "0 0 0 3px rgba(16,185,129,0.06), 0 12px 40px rgba(0,0,0,0.12)"
            : isHovered
            ? "0 8px 32px rgba(0,0,0,0.18)"
            : "0 2px 8px rgba(0,0,0,0.07)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Avatar + nombre + estado */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-extrabold shrink-0"
              style={{ backgroundColor: accent, color: driver.avatar.color, boxShadow: `0 4px 14px ${accent}45` }}
            >
              {driver.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[15px] leading-tight truncate" style={{ color: "var(--text-primary)" }}>{driver.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isAuthorized ? "#10B981" : "#F59E0B" }} />
                <p className="text-xs font-semibold" style={{ color: isAuthorized ? "#10B981" : "var(--text-muted)" }}>
                  {isAuthorized ? "En ruta" : "Pendiente"}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: isAuthorized ? "rgba(16,185,129,0.12)" : "var(--bg-tertiary)" }}>
              <Truck className="w-4 h-4" style={{ color: isAuthorized ? "#10B981" : "var(--text-secondary)" }} />
            </div>
          </div>

          {/* Stats: Facturas + Peso */}
          <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
            {[
              { icon: Package, label: "Facturas", value: String(driver.facturas) },
              { icon: Weight, label: "Peso", value: `${driver.pesoTotal.toLocaleString()} kg` },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-3 gap-1" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
                </div>
                <span className="text-base font-extrabold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Destinos */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {driver.destinos.length} {driver.destinos.length === 1 ? "destino" : "destinos"}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
              {driver.destinos.map((d, idx) => (
                <div key={d} className="flex items-center gap-2.5 px-3.5 py-2.5"
                  style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: idx < driver.destinos.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0"
                    style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold flex-1 truncate" style={{ color: "var(--text-primary)" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botón */}
          <motion.button
            whileHover={!isAuthorized ? { scale: 1.015 } : {}}
            whileTap={!isAuthorized ? { scale: 0.96 } : {}}
            disabled={isAuthorized}
            onClick={onScan}
            className="w-full flex items-center justify-center gap-2 rounded-2xl text-sm font-bold mt-auto transition-all duration-300 disabled:cursor-default"
            style={{
              backgroundColor: isAuthorized ? "#10B981" : "#155DFC",
              color: "#fff",
              height: 44,
              boxShadow: isAuthorized ? "0 4px 16px rgba(16,185,129,0.3)" : "0 4px 16px rgba(21,93,252,0.3)",
            }}
          >
            {isAuthorized ? (
              <><CheckCircle2 className="w-4 h-4" /><span>En Ruta</span></>
            ) : (
              <><ScanBarcode className="w-4 h-4" /><span>Verificar Facturas</span></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
