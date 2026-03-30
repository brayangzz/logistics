"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Package, MapPin, Eye } from "lucide-react";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import { Order, OrderStatus, FilterStatus } from "../supervision.types";
import { PaginationControls } from "./PaginationControls";
import { PAGE_SIZE } from "../hooks/useOrdersFilterPaginate";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  Pendiente: { label: "Pendiente", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  "En Ruta": { label: "En Ruta",   color: "#155DFC", bg: "rgba(21,93,252,0.12)",  border: "rgba(21,93,252,0.25)"  },
  Entregado: { label: "Entregado", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
};

const AVATAR_COLORS: Record<string, string> = {
  CR: "#6366F1", MS: "#10B981", EV: "#155DFC",
  JH: "#8B5CF6", RD: "#F59E0B", MT: "#0EA5E9",
};

const FILTER_OPTIONS: FilterStatus[] = ["Todos", "Pendiente", "En Ruta", "Entregado"];

const GRID_COLS = "0.7fr 1fr 1.2fr 0.6fr 0.7fr 0.75fr 0.85fr 0.75fr 0.4fr";

interface OrdersTableProps {
  paginated: Order[];
  filtered: Order[];
  safePage: number;
  totalPages: number;
  search: string; setSearch: (v: string) => void;
  searchFocused: boolean; setSearchFocused: (v: boolean) => void;
  filterStatus: FilterStatus; setFilterStatus: (v: FilterStatus) => void;
  statusOpen: boolean; setStatusOpen: (v: (prev: boolean) => boolean) => void;
  selectedDate: Date | null; setSelectedDate: (d: Date | null) => void;
  resetPage: () => void;
  setPage: (n: number) => void;
  onRowAction: (driverInitials: string) => void;
}

export function OrdersTable({
  paginated, filtered, safePage, totalPages,
  search, setSearch, searchFocused, setSearchFocused,
  filterStatus, setFilterStatus, statusOpen, setStatusOpen,
  selectedDate, setSelectedDate, resetPage, setPage, onRowAction,
}: OrdersTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl sm:rounded-3xl overflow-visible relative border"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      onClick={e => e.stopPropagation()}
    >
      {/* Toolbar */}
      <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap"
        style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #155DFC, #2563EB)", boxShadow: "0 0 16px rgba(21,93,252,0.25)" }}>
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
              Listado de Pedidos
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="relative w-44 sm:w-52 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text" placeholder="Buscar folio, cliente..."
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: `1px solid ${searchFocused ? "#155DFC" : "var(--border-color)"}`,
                color: "var(--text-primary)", transition: "border-color 0.15s",
              }}
            />
          </div>

          <div className="relative w-full sm:w-auto z-50">
            <button
              onClick={e => { e.stopPropagation(); setStatusOpen(v => !v); }}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border"
              style={{
                backgroundColor: filterStatus !== "Todos" ? STATUS_CFG[filterStatus as OrderStatus]?.bg : "var(--bg-tertiary)",
                color: filterStatus !== "Todos" ? STATUS_CFG[filterStatus as OrderStatus]?.color : "var(--text-primary)",
                borderColor: filterStatus !== "Todos" ? STATUS_CFG[filterStatus as OrderStatus]?.border : "var(--border-color)",
              }}
            >
              {filterStatus === "Todos" ? "Todos los estados" : filterStatus}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {statusOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ ...SMOOTH }}
                  className="absolute right-0 top-full mt-2 w-full sm:w-48 p-1.5 rounded-xl border shadow-xl z-50"
                  style={{ backgroundColor: "var(--dropdown-bg)", borderColor: "var(--border-color)" }}
                >
                  {FILTER_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setFilterStatus(s); setStatusOpen(() => false); resetPage(); }}
                      className="w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2.5"
                      style={{ color: "var(--text-primary)" }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {s !== "Todos" && (
                        <span className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: STATUS_CFG[s as OrderStatus]?.color }} />
                      )}
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MiniCalendar
            id="supervision-date-filter"
            selectedDate={selectedDate}
            onDateChange={(d) => { setSelectedDate(d); resetPage(); }}
          />
        </div>
      </div>

      {/* Desktop table (md+) */}
      <div className="hidden md:block w-full overflow-x-auto">
        <div className="min-w-[860px]">
          <div
            className="grid gap-2 px-5 py-3 text-xs font-extrabold uppercase tracking-wider"
            style={{ gridTemplateColumns: GRID_COLS, borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
          >
            <div>Factura</div><div>Cliente</div><div>Destino</div><div>Zona</div>
            <div>Chofer</div><div>Fecha y Hora</div><div>Estado</div><div>F. Entrega</div>
            <div className="text-right">Acción</div>
          </div>

          <div className="flex flex-col overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {paginated.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-14 text-center text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  No se encontraron resultados
                </motion.div>
              ) : (
                <motion.div key={safePage}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  {paginated.map((order) => (
                    <div key={order.id} className="grid gap-2 px-5 py-3.5 items-center"
                      style={{ gridTemplateColumns: GRID_COLS, borderBottom: "1px solid var(--border-color)" }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "var(--bg-tertiary)" }}>
                          <Package className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                        </div>
                        <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{order.folio}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{order.client}</p>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{order.address}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{order.zone}</p>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 text-white"
                          style={{
                            backgroundColor: AVATAR_COLORS[order.driverInitials] || "#64748B",
                          }}>
                          {order.driverInitials}
                        </div>
                        <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                          {order.driver.split(" ")[0]}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{order.deliveryDate}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: STATUS_CFG[order.status].bg, border: `1px solid ${STATUS_CFG[order.status].border}`, color: STATUS_CFG[order.status].color }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_CFG[order.status].color }} />
                          {STATUS_CFG[order.status].label}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{order.deliveryDate}</p>
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          onClick={() => onRowAction(order.driverInitials)}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          className="p-2 rounded-xl border"
                          style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#155DFC"; e.currentTarget.style.borderColor = "#155DFC"; e.currentTarget.style.backgroundColor = "rgba(21,93,252,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile cards (< md) */}
      <div className="md:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {paginated.length === 0 ? (
            <motion.div key="empty-mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-10 text-center text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              No se encontraron resultados
            </motion.div>
          ) : (
            <motion.div key={`m-${safePage}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="divide-y" style={{ borderColor: "var(--border-color)" }}>
              {paginated.map((order) => (
                <div key={order.id} className="px-4 py-3.5 flex flex-col gap-2.5"
                  style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}>
                        <Package className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      </div>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{order.folio}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{ backgroundColor: STATUS_CFG[order.status].bg, border: `1px solid ${STATUS_CFG[order.status].border}`, color: STATUS_CFG[order.status].color }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_CFG[order.status].color }} />
                        {STATUS_CFG[order.status].label}
                      </span>
                      <motion.button
                        onClick={() => onRowAction(order.driverInitials)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className="p-2 rounded-xl border"
                        style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{order.client}</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} />
                    <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{order.address}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black shrink-0 text-white"
                        style={{
                          backgroundColor: AVATAR_COLORS[order.driverInitials] || "#64748B",
                        }}>
                        {order.driverInitials}
                      </div>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{order.driver.split(" ")[0]}</p>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.zone}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.deliveryDate}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PaginationControls
        safePage={safePage} totalPages={totalPages}
        totalItems={filtered.length} pageSize={PAGE_SIZE}
        onPage={setPage}
      />
    </motion.div>
  );
}
