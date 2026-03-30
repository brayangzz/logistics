"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, CheckCircle2, ChevronDown,
  Search, X, Calendar, Package,
  ArrowLeft, ChevronLeft, ChevronRight, Clock,
  Eye, TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { DeliveryStatus, Delivery, DRIVERS_LIST, DELIVERIES } from "./data";
import { useDriverDeliveryMetrics } from "./hooks/useDriverDeliveryMetrics";
import { useDeliveryFiltering } from "./hooks/useDeliveryFiltering";
import { HourlyActivityChart } from "./components/HourlyActivityChart";
import { ZoneDistributionPanel } from "./components/ZoneDistributionPanel";
import { DeliveryDetailModal } from "./components/DeliveryDetailModal";

const STATUS_CFG: Record<DeliveryStatus, { color: string; bg: string; border: string; label: string }> = {
  Entregado: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", label: "Entregado" },
  "En Ruta": { color: "#155DFC", bg: "rgba(21,93,252,0.12)",  border: "rgba(21,93,252,0.25)",  label: "En Ruta"   },
  Pendiente: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Pendiente" },
};
const RANGE_OPTIONS = ["Hoy", "Últimos 7 días", "Últimos 30 días", "Este mes"];
const STATUS_OPTIONS: (DeliveryStatus | "Todos")[] = ["Todos", "Entregado", "En Ruta", "Pendiente"];
const PAGE_SIZE = 10;
const SPRING = { type: "spring", stiffness: 300, damping: 28 } as const;
const COL = "100px 1.2fr 1.6fr 140px 130px 130px 100px 48px";

function getPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const range: (number | "…")[] = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  range.push(1);
  if (left > 2) range.push("…");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("…");
  range.push(total);
  return range;
}

export default function HistorialChoferPage() {
  const searchParams   = useSearchParams();
  const choferParam    = searchParams.get("chofer");
  const selectedDriver = DRIVERS_LIST.find(d => d.initials === choferParam) ?? DRIVERS_LIST[0];

  const [detailRow, setDetailRow] = useState<Delivery | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setDetailRow(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const { driverDeliveries, entregadosCount, enRutaCount, pendientesCount, activityData, hoursEnRuta, zoneData } =
    useDriverDeliveryMetrics(selectedDriver.initials, DELIVERIES);

  const {
    rangeOpen, setRangeOpen, range, setRange,
    statusFilter, setStatusFilter, statusOpen, setStatusOpen,
    search, setSearch, searchFocused, setSearchFocused,
    page, setPage, selectedDate, setSelectedDate,
    resetPage, filtered, paginated, totalPages,
  } = useDeliveryFiltering(driverDeliveries);

  return (
    <div className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <Link href="/supervision">
            <motion.button whileHover={{ x: -2, scale: 1.05 }} whileTap={{ scale: 0.93 }} transition={SPRING}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
              <ArrowLeft className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            </motion.button>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} transition={SPRING}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-base sm:text-lg font-extrabold shrink-0"
            style={{ backgroundColor: selectedDriver.color, color: "#fff", boxShadow: `0 0 24px ${selectedDriver.color}50` }}>
            {selectedDriver.initials}
          </motion.div>
          <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>{selectedDriver.name}</h1>
            {(() => {
              const isEnRuta   = enRutaCount > 0;
              const isPending  = !isEnRuta && pendientesCount > 0;
              const color      = isEnRuta ? "#155DFC" : isPending ? "#F59E0B" : "#10B981";
              const label      = isEnRuta ? "En Ruta"  : isPending ? "Pendiente" : "Libre";
              return (
                <motion.div key={`status-${selectedDriver.initials}`}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}35` }}>
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold" style={{ color }}>{label}</span>
                </motion.div>
              );
            })()}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {[
            { icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Entregados", value: entregadosCount, color: "#10B981" },
            { icon: <TrendingUp   className="w-5 h-5 sm:w-6 sm:h-6" />, label: "En Ruta",    value: enRutaCount,     color: "#155DFC" },
            { icon: <Clock        className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Pendientes", value: pendientesCount, color: "#F59E0B" },
          ].map(({ icon, label, value, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative flex flex-col items-center sm:items-start rounded-2xl p-3 sm:p-6 overflow-hidden"
              style={{ backgroundColor: "var(--bg-secondary)", border: `1px solid ${color}30`, boxShadow: `0 4px 24px ${color}15`, minHeight: "clamp(100px, 15vh, 160px)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top right, ${color}12 0%, transparent 65%)` }} />
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
              <div className="relative flex flex-col sm:flex-row items-center sm:justify-between w-full mb-1.5 sm:mb-4">
                <p className="hidden sm:block text-xs font-bold uppercase tracking-widest leading-tight" style={{ color: "var(--text-muted)" }}>{label}</p>
                <motion.div whileHover={{ scale: 1.18, rotate: 10 }} transition={SPRING}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 mb-1.5 sm:mb-0"
                  style={{ backgroundColor: `${color}20`, color, boxShadow: `0 0 14px ${color}40` }}>
                  {icon}
                </motion.div>
              </div>
              <motion.p key={`${selectedDriver.initials}-${label}`} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 20, delay: i * 0.08 + 0.1 }}
                className="w-full text-center sm:text-left"
                style={{ color, fontSize: "clamp(24px, 5.5vw, 64px)", fontWeight: 900, lineHeight: 1, textShadow: `0 0 32px ${color}70`, letterSpacing: "-1px" }}>
                {value}
              </motion.p>
              <p className="sm:hidden text-[9px] font-bold uppercase tracking-widest leading-tight text-center mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
          <HourlyActivityChart activityData={activityData} hoursEnRuta={hoursEnRuta} driverColor={selectedDriver.color} driverInitials={selectedDriver.initials} />
          <ZoneDistributionPanel zoneData={zoneData} driverColor={selectedDriver.color} driverInitials={selectedDriver.initials} />
        </div>

        {/* Filtros + Contador */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl px-5 py-4 relative overflow-visible"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid rgba(21,93,252,0.2)", boxShadow: "0 0 24px rgba(21,93,252,0.07)" }}>
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(ellipse at left center, rgba(21,93,252,0.06) 0%, transparent 60%)" }} />
          <div className="absolute inset-0 border-l-[3.5px] rounded-2xl pointer-events-none" style={{ borderColor: "#155DFC", borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: "transparent" }} />

          <div className="relative flex items-center justify-between sm:justify-start gap-4 shrink-0 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-[var(--border-color)] pb-4 sm:pb-0 pr-0 sm:pr-4">
            <div className="flex items-center gap-3">
              <span className="tabular-nums font-black leading-none" style={{ fontSize: "clamp(30px, 5vw, 40px)", color: "var(--text-primary)" }}>{filtered.length}</span>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#155DFC", paddingTop: "4px" }}>Facturas</p>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center justify-start sm:justify-end gap-2.5 sm:gap-3 flex-1 w-full sm:w-auto">
            {/* Rango */}
            <div className="relative" style={{ zIndex: 52 }}>
              <button onClick={() => { setRangeOpen(v => !v); setStatusOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold text-xs"
                style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>{range}</span>
                <ChevronDown className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
              </button>
              <AnimatePresence>
                {rangeOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-44 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ backgroundColor: "var(--dropdown-bg)", border: "1px solid var(--border-color)", boxShadow: "var(--dropdown-shadow)", zIndex: 52 }}>
                    {RANGE_OPTIONS.map(r => (
                      <button key={r} onClick={() => { setRange(r); setRangeOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left"
                        style={{ color: range === r ? "#155DFC" : "var(--text-secondary)", backgroundColor: range === r ? "rgba(21,93,252,0.08)" : "transparent" }}>
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Estado */}
            <div className="relative" style={{ zIndex: 51 }}>
              {(() => {
                const cfg = statusFilter !== "Todos" ? STATUS_CFG[statusFilter] : null;
                return (
                  <button onClick={() => { setStatusOpen(v => !v); setRangeOpen(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold text-xs"
                    style={{ backgroundColor: cfg ? cfg.bg : "var(--bg-tertiary)", borderColor: cfg ? cfg.border : "var(--border-color)", color: cfg ? cfg.color : "var(--text-secondary)" }}>
                    {cfg && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />}
                    <span>{statusFilter}</span>
                    <ChevronDown className="w-3 h-3 shrink-0" style={{ color: cfg ? cfg.color : "var(--text-muted)" }} />
                  </button>
                );
              })()}
              <AnimatePresence>
                {statusOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-40 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ backgroundColor: "var(--dropdown-bg)", border: "1px solid var(--border-color)", boxShadow: "var(--dropdown-shadow)", zIndex: 51 }}>
                    {STATUS_OPTIONS.map(s => {
                      const c = s !== "Todos" ? STATUS_CFG[s] : null;
                      return (
                        <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); resetPage(); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left"
                          style={{ color: statusFilter === s ? (c?.color ?? "#155DFC") : "var(--text-secondary)", backgroundColor: statusFilter === s ? (c ? c.bg : "rgba(21,93,252,0.08)") : "transparent" }}>
                          {c && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />}
                          {s}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <MiniCalendar id="choferes-date-filter" selectedDate={selectedDate} onDateChange={(d) => { setSelectedDate(d); resetPage(); }} />

            <div className="relative flex items-center w-full sm:flex-1 min-w-[200px] max-w-none sm:max-w-sm rounded-xl"
              style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none" }}>
              <Search className="absolute left-3 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--text-muted)" }} />
              <input type="text" placeholder="Buscar factura, cliente, bloque..." value={search}
                onChange={e => { setSearch(e.target.value); resetPage(); }}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                className="w-full pl-8 pr-7 py-2 rounded-xl border text-xs focus:outline-none"
                style={{ backgroundColor: "var(--bg-tertiary)", borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)", color: "var(--text-primary)" }} />
              {search && (
                <button onClick={() => { setSearch(""); resetPage(); }} className="absolute right-2.5">
                  <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabla desktop */}
        <div className="hidden md:block rounded-3xl overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 1100 }}>
              <div className="grid px-6 py-3 gap-x-6"
                style={{ gridTemplateColumns: COL, borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
                {["Factura", "Cliente", "Destino", "Bloque", "Fecha / Hora", "Estado", "F. Entrega", ""].map(h => (
                  <p key={h} className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{h}</p>
                ))}
              </div>
              <AnimatePresence mode="popLayout" initial={false}>
                {paginated.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <Package className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                    <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Sin resultados</p>
                  </div>
                ) : paginated.map((d, i) => {
                  const cfg = STATUS_CFG[d.status];
                  return (
                    <motion.div key={d.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, delay: i * 0.025 }}
                      className="grid items-center px-6 py-4 gap-x-6 cursor-default"
                      style={{ gridTemplateColumns: COL, borderBottom: i < paginated.length - 1 ? "1px solid var(--border-color)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--table-row-hover)")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <p className="text-xs font-extrabold tabular-nums truncate" style={{ color: "var(--text-primary)" }}>{d.folio}</p>
                      <div className="min-w-0"><p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{d.client}</p></div>
                      <div className="min-w-0 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
                        <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{d.address}</p>
                      </div>
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>{d.zone}</p>
                      <div>
                        <p className="text-xs font-semibold tabular-nums whitespace-nowrap" style={{ color: "var(--text-primary)" }}>{d.dateLabel}</p>
                        <p className="text-[10px] mt-0.5 tabular-nums" style={{ color: "var(--text-muted)" }}>{d.time}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit whitespace-nowrap"
                        style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {d.status === "Entregado" && <CheckCircle2 className="w-3 h-3" />}
                        {cfg.label}
                      </span>
                      <p className="text-xs font-semibold tabular-nums whitespace-nowrap" style={{ color: d.status === "Entregado" ? "#10B981" : "var(--text-muted)" }}>
                        {d.status === "Entregado" ? d.dateLabel : "—"}
                      </p>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        onClick={() => { setDetailRow(d); setRangeOpen(false); setStatusOpen(false); }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center border"
                        style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#155DFC"; e.currentTarget.style.borderColor = "#155DFC"; e.currentTarget.style.backgroundColor = "rgba(21,93,252,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}>
                        <Eye className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Cards móvil */}
        <div className="md:hidden space-y-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 rounded-3xl"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <Package className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Sin resultados</p>
              </div>
            ) : paginated.map((d, i) => {
              const cfg = STATUS_CFG[d.status];
              return (
                <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, delay: i * 0.04 }}
                  className="rounded-2xl px-4 py-3.5" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-extrabold tabular-nums shrink-0" style={{ color: "var(--text-primary)" }}>{d.folio}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{d.dateLabel} · {d.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                      <motion.button whileTap={{ scale: 0.88 }} onClick={() => { setDetailRow(d); setRangeOpen(false); setStatusOpen(false); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border"
                        style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                        <Eye className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-sm font-bold mb-1.5 truncate" style={{ color: "var(--text-primary)" }}>{d.client}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{d.address}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>{d.zone}</span>
                    {d.status === "Entregado" && <span className="text-[11px] font-semibold tabular-nums" style={{ color: "#10B981" }}>Entregado {d.dateLabel}</span>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-xs order-2 sm:order-1" style={{ color: "var(--text-muted)" }}>
            {filtered.length === 0 ? "0 facturas" : (
              <>{Math.min(filtered.length, (page - 1) * PAGE_SIZE + 1)}–{Math.min(filtered.length, page * PAGE_SIZE)}{" "}
                <span style={{ color: "var(--text-secondary)" }}>de {filtered.length} facturas</span></>
            )}
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-xl flex items-center justify-center border disabled:opacity-30"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <ChevronLeft className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
            </motion.button>
            {getPageRange(page, totalPages).map((p, idx) =>
              p === "…" ? (
                <span key={`ellipsis-${idx}`} className="w-8 text-center text-xs select-none" style={{ color: "var(--text-muted)" }}>…</span>
              ) : (
                <motion.button key={p} whileTap={{ scale: 0.9 }} onClick={() => setPage(p as number)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border"
                  style={{ backgroundColor: page === p ? "#155DFC" : "var(--bg-secondary)", borderColor: page === p ? "#155DFC" : "var(--border-color)", color: page === p ? "#fff" : "var(--text-secondary)", boxShadow: page === p ? "0 0 12px rgba(21,93,252,0.35)" : "none" }}>
                  {p}
                </motion.button>
              )
            )}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-xl flex items-center justify-center border disabled:opacity-30"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
            </motion.button>
          </div>
        </div>
      </div>

      {detailRow && <DeliveryDetailModal delivery={detailRow} onClose={() => setDetailRow(null)} />}
    </div>
  );
}
