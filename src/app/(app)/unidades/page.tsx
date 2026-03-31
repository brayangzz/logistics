"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Truck, Search, X, Gauge } from "lucide-react";
import { Unit, StatusFilter } from "./unidades.types";
import { UnitCard } from "./components/UnitCard";

const INITIAL_UNITS: Unit[] = [
  { id: "u1", numero: 1, modelo: "Kenworth T800",        placa: "ABZ-1234", choferId: "d1", gasolina: 78, estado: "asignado"      },
  { id: "u2", numero: 2, modelo: "Freightliner M2",       placa: "CDE-5678", choferId: null, gasolina: 45, estado: "disponible"    },
  { id: "u3", numero: 3, modelo: "International LT",      placa: "FGH-9012", choferId: null, gasolina: 20, estado: "mantenimiento" },
  { id: "u4", numero: 4, modelo: "Kenworth T370",         placa: "IJK-3456", choferId: "d2", gasolina: 92, estado: "asignado"      },
  { id: "u5", numero: 5, modelo: "Freightliner Cascadia", placa: "LMN-7890", choferId: null, gasolina: 60, estado: "disponible"    },
  { id: "u6", numero: 6, modelo: "Peterbilt 579",         placa: "OPQ-2345", choferId: "d3", gasolina: 55, estado: "asignado"      },
  { id: "u7", numero: 7, modelo: "Volvo VNL 760",         placa: "RST-6789", choferId: null, gasolina: 12, estado: "mantenimiento" },
  { id: "u8", numero: 8, modelo: "Mack Anthem",           placa: "UVW-0123", choferId: null, gasolina: 83, estado: "disponible"    },
];

const FILTERS: { key: StatusFilter; label: string; dot: string | null }[] = [
  { key: "Todos",         label: "Todas",         dot: null      },
  { key: "disponible",    label: "Disponibles",   dot: "#10B981" },
  { key: "asignado",      label: "Asignadas",     dot: "#155DFC" },
  { key: "mantenimiento", label: "Mantenimiento", dot: "#F59E0B" },
];

export default function UnidadesPage() {
  const [units,         setUnits]         = useState<Unit[]>(INITIAL_UNITS);
  const [search,        setSearch]        = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>("Todos");

  const handleUpdate = useCallback((id: string, patch: Partial<Unit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
  }, []);

  const counts = useMemo(() => ({
    Todos:         units.length,
    disponible:    units.filter(u => u.estado === "disponible").length,
    asignado:      units.filter(u => u.estado === "asignado").length,
    mantenimiento: units.filter(u => u.estado === "mantenimiento").length,
  }), [units]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return units.filter(u => {
      const matchSearch = !q
        || `unidad ${u.numero}`.includes(q)
        || u.modelo.toLowerCase().includes(q)
        || u.placa.toLowerCase().includes(q);
      return matchSearch && (statusFilter === "Todos" || u.estado === statusFilter);
    });
  }, [units, search, statusFilter]);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-[#155DFC] to-blue-700 shadow-[0_0_20px_rgba(21,93,252,0.3)] shrink-0">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
                Control de Unidades
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {units.length} unidades · {counts.asignado} en ruta
              </p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 rounded-2xl border w-full sm:w-auto overflow-x-auto"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
            {FILTERS.map(({ key, label, dot }) => {
              const isActive = statusFilter === key;
              return (
                <button key={key} onClick={() => setStatusFilter(key)}
                  className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none flex-1 sm:flex-none justify-center shrink-0"
                  style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}>
                  {isActive && (
                    <motion.div layoutId="unidades-tab" className="absolute inset-0 rounded-xl"
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
                    style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--bg-tertiary)", color: isActive ? "#fff" : "var(--text-muted)" }}>
                    {counts[key as keyof typeof counts]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block w-px h-7 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />

          {/* Search */}
          <div className="relative flex-1 sm:min-w-[260px] sm:max-w-[360px] rounded-2xl"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none", transition: "box-shadow 0.15s ease" }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Buscar unidad, modelo o placa…"
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color: "var(--text-primary)", transition: "border-color 0.15s",
              }} />
            <AnimatePresence>
              {search && (
                <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.1 }} onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center py-24 rounded-3xl border"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <Truck className="w-12 h-12 mb-4 opacity-20" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>No se encontraron unidades</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Intenta con otro filtro o búsqueda</p>
            </motion.div>
          ) : (
            <LayoutGroup>
              <motion.div key="grid"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                style={{ alignItems: "start" }}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((unit, i) => (
                    <UnitCard key={unit.id} unit={unit} index={i} onUpdate={handleUpdate} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
