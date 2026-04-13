"use client";

import { motion } from "framer-motion";
import { Scissors, User, Tag, Calendar } from "lucide-react";
import type { Order } from "../logistics2.types";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

const SHORT_DATE_RE = /(\d+) de (\w+)/;
const MONTH_SHORT: Record<string, string> = {
  enero: "Ene", febrero: "Feb", marzo: "Mar", abril: "Abr",
  mayo: "May", junio: "Jun", julio: "Jul", agosto: "Ago",
  septiembre: "Sep", octubre: "Oct", noviembre: "Nov", diciembre: "Dic",
};
function shortDate(date: string) {
  const m = SHORT_DATE_RE.exec(date);
  if (!m) return date;
  return `${m[1]} ${MONTH_SHORT[m[2]] ?? m[2]}`;
}

const STATE_CFG = {
  "Pendiente": { dot: "#EF4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.28)" },
  "En Proceso": { dot: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.28)" },
  "Listo":      { dot: "#10B981", bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.28)" },
  "N/A":        { dot: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.18)" },
} as const;

const BLOQUE_LABELS: Record<string, string> = {
  b1: "Norte", b2: "Sur", b3: "Centro", b4: "Poniente",
  aztlan1: "Aztlan 1", aztlan2: "Aztlan 2", aztlan3: "Aztlan 3", aztlan4: "Aztlan 4",
  camino1: "C. Real 1", camino2: "C. Real 2", camino3: "C. Real 3", camino4: "C. Real 4",
  felix: "Felix U.G.", escobedo: "Escobedo", aurora: "La Aurora",
};

const AREA_LABELS: Array<{ key: keyof Order["areas"]; label: string }> = [
  { key: "aluminio", label: "Aluminio" },
  { key: "vidrio",   label: "Vidrio" },
  { key: "herrajes", label: "Herrajes" },
];

const SEMAFORO_COLORS = {
  "Pendiente": "#EF4444",
  "En Proceso": "#F59E0B",
  "Listo":      "#10B981",
  "N/A":        "var(--text-muted)",
} as const;

const SEMAFORO_BG = {
  "Pendiente": "rgba(239,68,68,0.10)",
  "En Proceso": "rgba(245,158,11,0.10)",
  "Listo":      "rgba(16,185,129,0.10)",
  "N/A":        "transparent",
} as const;

interface InvoiceRowProps {
  order: Order;
  index: number;
  showBlock?: boolean;
  accent?: string;
}

export const InvoiceRow = ({ order, index, showBlock = false, accent = "#155DFC" }: InvoiceRowProps) => {
  const cfg = STATE_CFG[order.overallState as keyof typeof STATE_CFG] ?? STATE_CFG["N/A"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -4 }}
      transition={{ ...SMOOTH, delay: Math.min(index * 0.04, 0.16) }}
      /* Outer shell */
      className="rounded-[16px] p-[2px]"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Inner core */}
      <div
        className="flex flex-col gap-0 rounded-[14px] overflow-hidden"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
        {/* Top bar: invoice + status */}
        <div
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <span
            className="font-black leading-none tracking-tight tabular-nums shrink-0"
            style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}
          >
            {order.invoiceNumber}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {order.tieneCorteVidrio && (
              <div
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full shrink-0"
                style={{
                  background: "rgba(14,165,233,0.12)",
                  border: "1px solid rgba(14,165,233,0.32)",
                  color: "#7DD3FC",
                }}
              >
                <Scissors className="w-3 h-3 shrink-0" />
                <span className="text-[10px] font-bold leading-none">Corte</span>
              </div>
            )}
            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full shrink-0"
              style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                animate={{ backgroundColor: cfg.dot }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-[10px] font-bold leading-none" style={{ color: cfg.dot }}>
                {order.overallState}
              </span>
            </div>
          </div>
        </div>

        {/* Meta fields */}
        <div className="flex flex-col" style={{ borderBottom: "1px solid var(--border-color)" }}>
          {/* Cliente */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid var(--border-color)" }}
          >
            <User className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
            <div className="flex flex-col min-w-0 gap-1">
              <span className="text-[10px] font-medium leading-none" style={{ color: "var(--text-muted)" }}>
                Cliente
              </span>
              <span className="text-sm font-semibold truncate leading-tight" style={{ color: "var(--text-primary)" }}>
                {order.clientName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
            {/* Vendedor */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderRight: "1px solid var(--border-color)" }}
            >
              <Tag className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-[10px] font-medium leading-none" style={{ color: "var(--text-muted)" }}>
                  Vendedor
                </span>
                <span className="text-sm font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                  {order.vendedor ?? "—"}
                </span>
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-3 px-5 py-4">
              <Calendar className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-[10px] font-medium leading-none" style={{ color: "var(--text-muted)" }}>
                  Fecha
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {shortDate(order.date)}
                </span>
              </div>
            </div>
          </div>

          {showBlock && order.bloque && (
            <div className="flex items-center gap-3 px-5 py-4">
              <MapPinIcon className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
              <div className="flex flex-col min-w-0 gap-1">
                <span className="text-[10px] font-medium leading-none" style={{ color: "var(--text-muted)" }}>
                  Bloque
                </span>
                <span className="text-sm font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                  {BLOQUE_LABELS[order.bloque] ?? order.bloque}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Semáforo de áreas — columnas con puntos */}
        <div
          className="grid grid-cols-3 gap-3 px-5 py-4"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          {AREA_LABELS.map(({ key, label }) => {
            const state = order.areas[key] as keyof typeof SEMAFORO_COLORS;
            const color = SEMAFORO_COLORS[state] ?? SEMAFORO_COLORS["N/A"];
            const isNA = state === "N/A";

            return (
              <div
                key={`semaforo-${key}`}
                className="flex flex-col items-center gap-2 py-2 rounded-xl"
                style={{
                  backgroundColor: isNA ? "transparent" : "var(--bg-tertiary)",
                  border: isNA ? "none" : "1px solid var(--border-color)",
                }}
              >
                <span className="text-xs leading-none font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </span>
                {isNA ? (
                  <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
                ) : (
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full"
                    animate={{ backgroundColor: color }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// MapPin inline para evitar import circular con lucide
const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
