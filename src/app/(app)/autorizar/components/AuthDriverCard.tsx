"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ScanBarcode, MapPin } from "lucide-react";
import { Driver } from "../autorizar.types";

interface AuthDriverCardProps {
  driver: Driver;
  isAuthorized: boolean;
  onScan: () => void;
}

export function AuthDriverCard({ driver, isAuthorized, onScan }: AuthDriverCardProps) {
  const accent = driver.avatar.bg;
  const statusColor = isAuthorized ? "#10B981" : "#F59E0B";
  const buttonBg = isAuthorized ? "#10B981" : "#155DFC";

  return (
    <div className="relative flex flex-col h-full rounded-[28px]"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", overflow: "visible" }}
    >
      <div className="flex flex-col flex-1 p-5 gap-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-extrabold shrink-0"
            style={{ backgroundColor: accent, color: driver.avatar.color, boxShadow: `0 8px 20px ${accent}40` }}
          >
            {driver.initials}
          </div>
          <h3 className="flex-1 min-w-0 font-extrabold tracking-tight truncate" style={{ color: "var(--text-primary)", fontSize: 22 }}>
            {driver.name}
          </h3>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
            style={{
              backgroundColor: isAuthorized ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
              border: `1px solid ${isAuthorized ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.22)"}`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <span className="text-[10px] leading-none font-bold" style={{ color: statusColor }}>
              {isAuthorized ? "En ruta" : "Pendiente"}
            </span>
          </div>
        </div>

        {/* Stats: Facturas + Peso */}
        <div
          className="grid grid-cols-2 rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-center gap-2 py-2.5 px-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>Facturas</span>
            <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "var(--text-secondary)" }}>
              {driver.facturas}
            </span>
          </div>
          <div
            className="flex items-center justify-center gap-2 py-2.5 px-3"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>Peso</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[20px] font-bold tabular-nums leading-none" style={{ color: "var(--text-secondary)" }}>
                {driver.pesoTotal.toLocaleString()}
              </span>
              <span className="text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>kg</span>
            </div>
          </div>
        </div>

        {/* Destinos */}
        <div className="flex flex-col flex-1 gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-secondary)" }} />
            <span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
              Destinos
            </span>
          </div>

          <div className="relative flex flex-col flex-1">
            {/* Línea vertical continua detrás de los puntos */}
            {driver.destinos.length > 1 && (
              <span
                className="absolute"
                style={{
                  left: 2,
                  top: "calc(50% / " + driver.destinos.length + ")",
                  bottom: "calc(50% / " + driver.destinos.length + ")",
                  width: 1,
                  backgroundColor: "var(--border-color)",
                }}
              />
            )}
            {driver.destinos.map((destination) => (
              <div key={destination} className="relative flex items-center gap-2.5 flex-1 min-h-[36px]">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 relative z-10" style={{ backgroundColor: "rgba(255,255,255,0.55)" }} />
                <span className="text-[13px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                  {destination}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Botón */}
        <div style={{ willChange: "transform" }}>
          <motion.button
            whileHover={!isAuthorized ? { scale: 1.025, boxShadow: "0 14px 28px rgba(21,93,252,0.30)" } : undefined}
            whileTap={!isAuthorized ? { scale: 0.97 } : undefined}
            disabled={isAuthorized}
            onClick={onScan}
            transition={{
              scale: { type: "spring", stiffness: 380, damping: 30, restDelta: 0.001 },
              boxShadow: { duration: 0.18, ease: "easeOut" },
            }}
            className="w-full flex items-center justify-center gap-2 rounded-full text-[14px] font-bold disabled:cursor-default"
            style={{
              backgroundColor: buttonBg,
              color: "#fff",
              height: 50,
              letterSpacing: "0.01em",
              boxShadow: isAuthorized ? "0 8px 20px rgba(16,185,129,0.22)" : "0 8px 20px rgba(21,93,252,0.22)",
            }}
          >
            {isAuthorized ? (
              <><CheckCircle2 className="w-4 h-4" /><span>En ruta</span></>
            ) : (
              <><ScanBarcode className="w-4 h-4" /><span>Verificar facturas</span></>
            )}
          </motion.button>
        </div>

      </div>
    </div>
  );
}
