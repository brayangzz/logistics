"use client";

import { Search, Map as MapIcon, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState, ViewMode } from "./asignar.types";
import { OrderAssignmentCard } from "./components/OrderAssignmentCard";
import { ToastContainer } from "./components/SuccessToast";
import { useToastManager } from "./hooks/useToastManager";
import { useOrderFiltering } from "./hooks/useOrderFiltering";

const FILTERS: { key: FilterState; label: string; dot: string | null }[] = [
  { key: "Todos",     label: "Todos",     dot: null      },
  { key: "Pendiente", label: "Pendiente", dot: "#EF4444" },
  { key: "Asignado",  label: "Asignado",  dot: "#10B981" },
];

export default function AsignarPage() {
  const {
    search, setSearch,
    filterState, setFilterState,
    viewMode,
    searchFocused, setSearchFocused,
    activos, anticipados,
    counts, anticipStats, filtered,
    handleAssign, handleViewMode,
  } = useOrderFiltering();

  const { toasts, handleToast, dismissToast } = useToastManager();

  const SWITCH_TABS: { key: ViewMode; label: string; count: number }[] = [
    { key: "activos",     label: "Pedidos Activos", count: activos.length     },
    { key: "anticipados", label: "Anticipados",     count: anticipados.length },
  ];

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
              style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 0 20px rgba(21,93,252,0.28)" }}>
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
                Asignación de Rutas
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {activos.length} activos · {anticipados.length} anticipados
              </p>
            </div>
          </div>
          {/* Search desktop */}
          <div className="relative hidden sm:flex items-center w-56 lg:w-64 shrink-0 rounded-2xl"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none", transition: "box-shadow 0.15s ease" }}>
            <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Buscar factura o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color: "var(--text-primary)", transition: "border-color 0.15s",
              }}
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Barra de controles */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">

            {/* Switch vista */}
            <div className="flex items-center gap-1 p-1 rounded-2xl border w-full sm:w-auto"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              {SWITCH_TABS.map(({ key, label, count }) => {
                const isActive = viewMode === key;
                return (
                  <button key={key} onClick={() => handleViewMode(key)}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none flex-1 sm:flex-none justify-center"
                    style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}>
                    {isActive && (
                      <motion.div layoutId="view-switch" className="absolute inset-0 rounded-xl"
                        style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 3px 10px rgba(21,93,252,0.3)" }}
                        transition={{ type: "spring", stiffness: 440, damping: 34 }} />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "var(--select-option-hover)" }} aria-hidden />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{label}</span>
                    <span className="relative z-10 text-xs px-1.5 py-0.5 rounded-lg font-bold tabular-nums"
                      style={{
                        backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--bg-tertiary)",
                        color: isActive ? "#fff" : "var(--text-muted)",
                      }}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:block w-px h-7 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />

            {/* Filtros estado — solo vista activos */}
            <AnimatePresence mode="wait">
              {viewMode === "activos" && (
                <motion.div key="state-filters"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-1 p-1 rounded-2xl border w-full sm:w-auto overflow-x-auto"
                  style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                  {FILTERS.map(({ key, label, dot }) => {
                    const isActive = filterState === key;
                    return (
                      <button key={key} onClick={() => setFilterState(key)}
                        className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none flex-1 sm:flex-none justify-center shrink-0"
                        style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}>
                        {isActive && (
                          <motion.div layoutId="asignar-tab" className="absolute inset-0 rounded-xl"
                            style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 3px 10px rgba(21,93,252,0.3)" }}
                            transition={{ type: "spring", stiffness: 440, damping: 34 }} />
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: "var(--select-option-hover)" }} aria-hidden />
                        )}
                        {dot && <span className="relative z-10 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isActive ? "#fff" : dot }} />}
                        <span className="relative z-10 whitespace-nowrap">{label}</span>
                        <span className="relative z-10 text-xs px-1.5 py-0.5 rounded-lg font-bold tabular-nums"
                          style={{
                            backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--bg-tertiary)",
                            color: isActive ? "#fff" : "var(--text-muted)",
                          }}>
                          {counts[key as keyof typeof counts]}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search móvil */}
          <div className="relative sm:hidden flex items-center w-full rounded-2xl"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none", transition: "box-shadow 0.15s ease" }}>
            <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Buscar factura o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color: "var(--text-primary)", transition: "border-color 0.15s",
              }}
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Banner resumen anticipados */}
        <AnimatePresence>
          {viewMode === "anticipados" && anticipados.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(59,130,246,0.12)" }}>
                  <TrendingUp className="w-4 h-4" style={{ color: "#3B82F6" }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Progreso de preparación</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {anticipStats.doneSlots} de {anticipStats.totalSlots} almacenes listos · {anticipStats.assigned}/{anticipados.length} asignados
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full sm:w-auto flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Almacenes</span>
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: anticipStats.pct === 100 ? "#10B981" : "var(--text-secondary)" }}>
                    {anticipStats.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
                  <motion.div className="h-full rounded-full"
                    style={{ backgroundColor: anticipStats.pct === 100 ? "#10B981" : "#3B82F6" }}
                    initial={{ width: 0 }} animate={{ width: `${anticipStats.pct}%` }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de órdenes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" style={{ overflow: "visible" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((order, i) => (
              <OrderAssignmentCard key={order.id} order={order} onAssign={handleAssign}
                onToast={handleToast} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <Search className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Sin resultados</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {viewMode === "anticipados" ? "No hay pedidos anticipados" : "Intenta con otro término de búsqueda"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
