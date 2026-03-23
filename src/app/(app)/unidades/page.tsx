"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Truck, Search, Fuel, Wrench,
  ChevronDown, X, Check, CheckCircle2,
  Pencil, Users, Gauge,
} from "lucide-react";

/* ══════════════════════════════════════════
   CONSTANTS — mismo SPRING que asignar
══════════════════════════════════════════ */
/* Transición suave para cambios de tamaño */
const SMOOTH = { type: "spring" as const, stiffness: 260, damping: 26 };

const AVATAR: Record<string, { bg: string; color: string }> = {
  CR: { bg: "#6366F1", color: "#fff" },
  MT: { bg: "#10B981", color: "#fff" },
  JH: { bg: "#8B5CF6", color: "#fff" },
  RD: { bg: "#F59E0B", color: "#fff" },
  AV: { bg: "#155DFC", color: "#fff" },
};
const av = (i: string) => AVATAR[i] ?? { bg: "#64748B", color: "#fff" };

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type UnitStatus   = "disponible" | "asignado" | "mantenimiento";
type StatusFilter = UnitStatus | "Todos";

interface Driver { id: string; nombre: string; initials: string }
interface Unit {
  id: string; numero: number; modelo: string; placa: string;
  choferId: string | null; gasolina: number; estado: UnitStatus;
}

/* ══════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════ */
const DRIVERS: Driver[] = [
  { id: "d1", nombre: "Carlos Ramírez",    initials: "CR" },
  { id: "d2", nombre: "Miguel Torres",     initials: "MT" },
  { id: "d3", nombre: "Jesús Herrera",     initials: "JH" },
  { id: "d4", nombre: "Roberto Díaz",      initials: "RD" },
  { id: "d5", nombre: "Andrés Villanueva", initials: "AV" },
];

const INITIAL_UNITS: Unit[] = [
  { id:"u1", numero:1, modelo:"Kenworth T800",         placa:"ABZ-1234", choferId:"d1", gasolina:78, estado:"asignado"      },
  { id:"u2", numero:2, modelo:"Freightliner M2",        placa:"CDE-5678", choferId:null, gasolina:45, estado:"disponible"    },
  { id:"u3", numero:3, modelo:"International LT",       placa:"FGH-9012", choferId:null, gasolina:20, estado:"mantenimiento" },
  { id:"u4", numero:4, modelo:"Kenworth T370",          placa:"IJK-3456", choferId:"d2", gasolina:92, estado:"asignado"      },
  { id:"u5", numero:5, modelo:"Freightliner Cascadia",  placa:"LMN-7890", choferId:null, gasolina:60, estado:"disponible"    },
  { id:"u6", numero:6, modelo:"Peterbilt 579",          placa:"OPQ-2345", choferId:"d3", gasolina:55, estado:"asignado"      },
  { id:"u7", numero:7, modelo:"Volvo VNL 760",          placa:"RST-6789", choferId:null, gasolina:12, estado:"mantenimiento" },
  { id:"u8", numero:8, modelo:"Mack Anthem",            placa:"UVW-0123", choferId:null, gasolina:83, estado:"disponible"    },
];

const STATUS_CFG: Record<UnitStatus, { label: string; color: string; bg: string; border: string }> = {
  disponible:    { label:"Disponible",    color:"#fff", bg:"#10B981", border:"#10B981" },
  asignado:      { label:"Asignado",      color:"#fff", bg:"#155DFC", border:"#155DFC" },
  mantenimiento: { label:"Mantenimiento", color:"#fff", bg:"#D97706", border:"#D97706" },
};

const FILTERS: { key: StatusFilter; label: string; dot: string | null }[] = [
  { key:"Todos",         label:"Todas",         dot:null      },
  { key:"disponible",    label:"Disponibles",   dot:"#10B981" },
  { key:"asignado",      label:"Asignadas",     dot:"#155DFC" },
  { key:"mantenimiento", label:"Mantenimiento", dot:"#F59E0B" },
];

function gasColor(p: number) {
  if (p > 55) return "#10B981";
  if (p > 25) return "#F59E0B";
  return "#EF4444";
}

/* ══════════════════════════════════════════
   DRIVER OPTION — igual que asignar
══════════════════════════════════════════ */
const DriverOption = ({ driver, isSelected, index, onSelect }: {
  driver: Driver; isSelected: boolean; index: number; onSelect: () => void;
}) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left"
      style={{
        backgroundColor: isSelected ? "var(--accent-bg)" : hov ? "var(--select-option-hover)" : "transparent",
        transition: "background-color 0.12s",
      }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
        style={{ backgroundColor: av(driver.initials).bg, color: av(driver.initials).color }}>
        {driver.initials}
      </div>
      <span className="text-[15px] font-medium flex-1 truncate" style={{ color: "var(--text-primary)" }}>
        {driver.nombre}
      </span>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}>
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ══════════════════════════════════════════
   GAS BAR — visualización con animación
══════════════════════════════════════════ */
function GasBar({ value }: { value: number }) {
  const color = gasColor(value);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ color }} transition={{ duration: 0.35 }}>
            <Fuel className="w-3.5 h-3.5" />
          </motion.div>
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Combustible</span>
        </div>
        <motion.span
          className="text-sm font-bold tabular-nums"
          animate={{ color }}
          transition={{ duration: 0.35 }}
        >
          {value}%
        </motion.span>
      </div>

      {/* Barra continua */}
      <div className="relative h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border-color)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${value}%`, backgroundColor: color }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   UNIT CARD — patrón idéntico a asignar
══════════════════════════════════════════ */
function UnitCard({ unit, index, onUpdate }: {
  unit: Unit;
  index: number;
  onUpdate: (id: string, patch: Partial<Unit>) => void;
}) {
  const [pendingId,  setPendingId]  = useState<string | null>(null);
  const [open,       setOpen]       = useState(false);
  const [editMode,   setEditMode]   = useState(false);
  const [localGas,   setLocalGas]   = useState(unit.gasolina);
  const [localMaint, setLocalMaint] = useState(unit.estado === "mantenimiento");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalGas(unit.gasolina);
    setLocalMaint(unit.estado === "mantenimiento");
  }, [unit.gasolina, unit.estado]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const s        = STATUS_CFG[unit.estado];
  const saved    = DRIVERS.find(d => d.id === unit.choferId) ?? null;
  const pending  = DRIVERS.find(d => d.id === pendingId) ?? null;
  const stage: "empty" | "pending" | "saved" =
    pending ? "pending" : saved ? "saved" : "empty";

  const handleSave = () => {
    if (pendingId) {
      const newEstado: UnitStatus = localMaint ? "mantenimiento" : "asignado";
      onUpdate(unit.id, { choferId: pendingId, estado: newEstado });
      setPendingId(null);
      setOpen(false);
    }
  };

  const handleEditSave = () => {
    const newEstado: UnitStatus = localMaint
      ? "mantenimiento"
      : unit.choferId ? "asignado" : "disponible";
    onUpdate(unit.id, { estado: newEstado });
    setEditMode(false);
  };

  const handleEditCancel = () => {
    setLocalGas(unit.gasolina);
    setLocalMaint(unit.estado === "mantenimiento");
    setEditMode(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ ...SMOOTH, opacity: { duration: 0.2 } }}
      whileHover={open || editMode ? {} : { y: -2 }}
      className="flex flex-col"
      style={{
        position: "relative",
        zIndex: open ? 40 : editMode ? 30 : 1,
        backgroundColor: "var(--bg-secondary)",
        borderRadius: 24,
        border: "1px solid var(--border-color)",
        borderTop: `3px solid ${s.bg}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "visible",
      }}
    >
      <motion.div layout="position" transition={SMOOTH}
        style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>

        {/* ── Header: número + badge ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: s.bg }}>
              <Truck className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-[22px] font-extrabold tracking-tight leading-none"
                style={{ color: "var(--text-primary)" }}>
                Unidad {unit.numero}
              </span>
              <p className="text-xs mt-1 truncate" style={{ color: "var(--text-secondary)" }}>{unit.modelo}</p>
            </div>
          </div>
          {/* Status badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
            style={{ backgroundColor: s.bg }}>
            {unit.estado === "disponible" ? (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-white/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white/80" />
            )}
            <span className="text-[11px] font-bold leading-none" style={{ color: s.color }}>{s.label}</span>
          </div>
        </div>

        {/* Placa */}
        <div>
          <span className="font-mono text-[11px] tracking-[0.15em] px-2 py-1 rounded-lg border"
            style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
            {unit.placa}
          </span>
        </div>

        {/* ── Separador ── */}
        <div style={{ height: 1, margin: "0 -24px", backgroundColor: "var(--border-color)" }} />

        {/* ── Área de asignación ── */}
        <div className="relative" ref={ref} style={{ overflow: "visible" }}>

          {/* EMPTY — sin chofer */}
          {stage === "empty" && (
            <div>
              <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 rounded-2xl text-[13px] font-bold focus:outline-none"
                style={{
                  height: 52,
                  backgroundColor: open ? "#155DFC" : "var(--bg-tertiary)",
                  border: `1px solid ${open ? "#155DFC" : "var(--border-color)"}`,
                  color: open ? "#fff" : "var(--text-primary)",
                  transition: "background-color 0.12s, border-color 0.12s, color 0.12s",
                }}>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span>Asignar chofer</span>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronDown className="w-4 h-4" strokeWidth={2} />
                </motion.div>
              </button>
            </div>
          )}

          {/* PENDING — chofer seleccionado sin guardar */}
          <AnimatePresence>
            {stage === "pending" && pending && (
              <motion.div
                key="pending-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col" style={{ gap: 10 }}>
                  <div className="flex items-center gap-3 px-4 rounded-2xl"
                    style={{ height: 52, backgroundColor: "var(--bg-tertiary)", border: "2px solid #F59E0B" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0"
                      style={{ backgroundColor: av(pending.initials).bg, color: av(pending.initials).color }}>
                      {pending.initials}
                    </div>
                    <span className="text-[13px] font-bold flex-1 truncate" style={{ color: "var(--text-primary)" }}>
                      {pending.nombre}
                    </span>
                    <span className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: "#F59E0B", color: "#fff" }}>
                      Sin guardar
                    </span>
                  </div>
                  <div className="flex gap-2" style={{ height: 44 }}>
                    <motion.button
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.96 }}
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold text-white"
                      style={{ backgroundColor: "#10B981" }}>
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                      Guardar
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.94 }}
                      onClick={() => { setPendingId(null); setOpen(false); }}
                      className="flex items-center justify-center rounded-2xl shrink-0"
                      style={{ width: 44, backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                      <X className="w-4 h-4" strokeWidth={2} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SAVED — chofer guardado */}
          {stage === "saved" && saved && (
            <div className="flex items-center gap-3 px-4 rounded-2xl"
              style={{ height: 56, backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold shrink-0"
                style={{ backgroundColor: av(saved.initials).bg, color: av(saved.initials).color }}>
                {saved.initials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-bold leading-tight block truncate" style={{ color: "var(--text-primary)" }}>
                  {saved.nombre}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "#10B981" }} strokeWidth={2.5} />
                  <span className="text-[11px] font-semibold" style={{ color: "#10B981" }}>Asignado</span>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => setOpen(v => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0"
                style={{
                  backgroundColor: open ? "#155DFC" : "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: open ? "#fff" : "var(--text-primary)",
                  transition: "background-color 0.12s, color 0.12s",
                }}>
                <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.button>
            </div>
          )}

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute left-0 right-0 top-full mt-2 z-[500] rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-hover)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                }}>
                <div className="px-4 py-2.5 flex items-center gap-2 border-b" style={{ borderColor: "var(--border-color)" }}>
                  <Users className="w-3.5 h-3.5" style={{ color: "#155DFC" }} strokeWidth={2} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                    Seleccionar chofer
                  </span>
                </div>
                <div className="p-2 flex flex-col gap-0.5">
                  {DRIVERS.map((d, i) => (
                    <DriverOption key={d.id} driver={d}
                      isSelected={d.id === (pendingId ?? unit.choferId)}
                      index={i}
                      onSelect={() => { setPendingId(d.id); setOpen(false); }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Separador ── */}
        <div style={{ height: 1, margin: "0 -24px", backgroundColor: "var(--border-color)" }} />

        {/* ── Gas ── */}
        <GasBar value={localGas} />

        {/* ── Mantenimiento (solo en editMode) ── */}
        <AnimatePresence initial={false}>
          {editMode && (
            <motion.div
              key="maint-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: "hidden" }}
            >
              <button type="button" onClick={() => setLocalMaint(v => !v)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl"
                style={{
                  backgroundColor: localMaint ? "#F59E0B" : "var(--bg-tertiary)",
                  border: `1px solid ${localMaint ? "#F59E0B" : "var(--border-color)"}`,
                  transition: "background-color 0.2s, border-color 0.2s",
                }}>
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" style={{ color: localMaint ? "#fff" : "var(--text-primary)", transition: "color 0.2s" }} />
                  <span className="text-sm font-semibold"
                    style={{ color: localMaint ? "#fff" : "var(--text-primary)", transition: "color 0.2s" }}>
                    Mantenimiento
                  </span>
                </div>
                <div className="relative w-9 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: localMaint ? "rgba(255,255,255,0.35)" : "var(--border-color)", transition: "background-color 0.2s" }}>
                  <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ left: localMaint ? "18px" : "2px" }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Botón editar / guardar detalles ── */}
        <AnimatePresence mode="wait" initial={false}>
          {editMode ? (
            <motion.div key="save-btns"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex gap-2" style={{ height: 44 }}>
              <motion.button
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.96 }}
                onClick={handleEditSave}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold text-white"
                style={{ backgroundColor: "#10B981" }}>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Guardar
              </motion.button>
              <motion.button whileTap={{ scale: 0.94 }}
                onClick={handleEditCancel}
                className="flex items-center justify-center rounded-2xl shrink-0"
                style={{ width: 44, backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                <X className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="edit-btn"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <motion.button type="button"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                onClick={() => setEditMode(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border text-[13px] font-semibold"
                style={{
                  height: 44,
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}>
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                Editar detalles
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
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
      const matchStatus = statusFilter === "Todos" || u.estado === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [units, search, statusFilter]);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">

        {/* ── Header — idéntico a logistics/asignar ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-[#155DFC] to-blue-700 shadow-[0_0_20px_rgba(21,93,252,0.3)] shrink-0">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
                style={{ color: "var(--text-primary)" }}>
                Control de Unidades
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {units.length} unidades · {counts.asignado} en ruta
              </p>
            </div>
          </div>
        </div>

        {/* ── Controles — mismo patrón que asignar ── */}
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
                  {dot && (
                    <span className="relative z-10 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: isActive ? "#fff" : dot }} />
                  )}
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
          </div>

          <div className="hidden sm:block w-px h-7 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />

          {/* Search */}
          <div className="relative flex-1 sm:min-w-[260px] sm:max-w-[360px] rounded-2xl"
            style={{
              boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none",
              transition: "box-shadow 0.15s ease",
            }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-muted)" }} />
            <input type="text" placeholder="Buscar unidad, modelo o placa…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color: "var(--text-primary)",
                transition: "border-color 0.15s",
              }} />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.1 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}>
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center py-24 rounded-3xl border"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
              <Truck className="w-12 h-12 mb-4 opacity-20" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                No se encontraron unidades
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Intenta con otro filtro o búsqueda
              </p>
            </motion.div>
          ) : (
            <LayoutGroup>
              <motion.div key="grid"
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
