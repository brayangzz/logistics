"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Clock, CalendarCheck, AlertCircle, CheckCircle2, Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { anticipadosPageOrders } from "@/data";

type AnticipatedState = "Programado" | "Confirmado" | "En Preparación" | "Cancelado";

interface AnticipatedOrder {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientInitials: string;
  scheduledDate: string;
  description: string;
  state: AnticipatedState;
  items: { area: string; qty: number }[];
}

const MOCK_ANTICIPATED: AnticipatedOrder[] = anticipadosPageOrders as AnticipatedOrder[];

const STATE_CONFIG: Record<AnticipatedState, { label: string; color: string; bg: string; ring: string; icon: React.ReactNode }> = {
  Programado: {
    label: "Programado",
    color: "#64748B",
    bg: "rgba(100,116,139,0.1)",
    ring: "rgba(100,116,139,0.3)",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Confirmado: {
    label: "Confirmado",
    color: "#155DFC",
    bg: "rgba(21,93,252,0.1)",
    ring: "rgba(21,93,252,0.3)",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  "En Preparación": {
    label: "En Preparación",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    ring: "rgba(245,158,11,0.3)",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  Cancelado: {
    label: "Cancelado",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    ring: "rgba(239,68,68,0.25)",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

const AREA_COLORS: Record<string, string> = {
  Vidrio: "#0EA5E9",
  Aluminio: "#6366F1",
  Herrajes: "#10B981",
};

const ALL_STATES: (AnticipatedState | "Todos")[] = ["Todos", "Programado", "Confirmado", "En Preparación", "Cancelado"];

export default function AnticipadosPage() {
  const [filter, setFilter] = useState<AnticipatedState | "Todos">("Todos");

  const filtered = MOCK_ANTICIPATED.filter((o) => filter === "Todos" || o.state === filter);

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  };

  const getDaysUntil = (iso: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(iso + "T00:00:00");
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `hace ${Math.abs(diff)} días`;
    if (diff === 0) return "hoy";
    if (diff === 1) return "mañana";
    return `en ${diff} días`;
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end justify-between">
          <div className="space-y-1">
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3"
              style={{ color: "var(--text-primary)" }}
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-violet-600 to-violet-700 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <ClipboardList className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              </div>
              Pedidos Anticipados
            </h1>
            <p className="mt-2 text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
              Pedidos programados y confirmados para fechas futuras.
              <span
                className="ml-2 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold w-max"
                style={{
                  backgroundColor: "rgba(124,58,237,0.1)",
                  color: "#7C3AED",
                  outline: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                {MOCK_ANTICIPATED.filter((o) => o.state !== "Cancelado").length} activos
              </span>
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border w-full md:w-max shadow-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          {ALL_STATES.map((s) => {
            const isActive = filter === s;
            const config = s !== "Todos" ? STATE_CONFIG[s as AnticipatedState] : null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  color: isActive ? (config ? config.color : "#155DFC") : "var(--text-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="anticipated-filter-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: config ? config.bg : "var(--accent-bg)",
                      outline: `1px solid ${config ? config.ring : "var(--accent-border)"}`,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {config && isActive && (
                  <span className="relative z-10" style={{ color: config.color }}>{config.icon}</span>
                )}
                {s === "Todos" && isActive && (
                  <span className="relative z-10 text-[#155DFC]"><CalendarCheck className="w-3.5 h-3.5" /></span>
                )}
                <span className="relative z-10">{s}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full p-16 text-center rounded-3xl border"
                style={{
                  backgroundColor: "var(--table-row-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-muted)",
                }}
              >
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-semibold">No hay pedidos anticipados</p>
              </motion.div>
            ) : (
              filtered.map((order, i) => {
                const cfg = STATE_CONFIG[order.state];
                const daysUntil = getDaysUntil(order.scheduledDate);
                const isCancelled = order.state === "Cancelado";

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                    className={cn(
                      "group relative rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 cursor-default overflow-hidden",
                      isCancelled && "opacity-60"
                    )}
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isCancelled) {
                        (e.currentTarget as HTMLElement).style.borderColor = cfg.ring;
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px rgba(0,0,0,0.1), 0 0 0 1px ${cfg.ring}`;
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    }}
                  >
                    {/* Gradient top accent */}
                    <div
                      className="absolute top-0 inset-x-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to right, transparent, ${cfg.color}, transparent)`,
                      }}
                    />

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            backgroundColor: cfg.bg,
                            color: cfg.color,
                            outline: `1px solid ${cfg.ring}`,
                          }}
                        >
                          {order.clientInitials}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
                            {order.clientName}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {order.invoiceNumber}
                          </p>
                        </div>
                      </div>

                      {/* State Badge */}
                      <span
                        className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0"
                        style={{
                          backgroundColor: cfg.bg,
                          color: cfg.color,
                          outline: `1px solid ${cfg.ring}`,
                        }}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {order.description}
                    </p>

                    {/* Items */}
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.area}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{
                            backgroundColor: `${AREA_COLORS[item.area]}15`,
                            color: AREA_COLORS[item.area],
                            outline: `1px solid ${AREA_COLORS[item.area]}30`,
                          }}
                        >
                          {item.area}: {item.qty} uds.
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-3 border-t"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>{formatDate(order.scheduledDate)}</span>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: isCancelled
                            ? "rgba(239,68,68,0.08)"
                            : "rgba(21,93,252,0.08)",
                          color: isCancelled ? "#EF4444" : "#155DFC",
                        }}
                      >
                        {daysUntil}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
