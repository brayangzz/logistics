"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Wrench, ChevronDown, X, Check, CheckCircle2, Pencil, Users, Search,
} from "lucide-react";
import { Unit, Driver, UnitStatus } from "../unidades.types";
import { GasBar } from "./GasBar";
import { DriverSelectOption, av } from "./DriverSelectOption";
import { useUnitCard } from "../hooks/useUnitCard";

// Spring sin rebote para hover y entrada de cards
const SPRING = { type: "spring" as const, stiffness: 380, damping: 42 };
// Ease snappy para expansión de paneles
const SNAP   = [0.25, 0.1, 0.25, 1] as const;

const STATUS_CFG: Record<UnitStatus, { label: string; color: string; bg: string }> = {
  disponible:    { label: "Disponible",    color: "#fff", bg: "#10B981" },
  asignado:      { label: "Asignado",      color: "#fff", bg: "#155DFC" },
  mantenimiento: { label: "Mantenimiento", color: "#fff", bg: "#D97706" },
};

function DriverDropdown({ drivers, selectedId, onSelect }: {
  drivers: Driver[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const visible = q.trim()
    ? drivers.filter(d => d.nombre.toLowerCase().includes(q.toLowerCase()))
    : drivers;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.99 }}
      transition={{ duration: 0.14, ease: SNAP }}
      className="absolute left-0 right-0 top-full mt-2 z-500 rounded-2xl"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-hover)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", overflow: "hidden" }}>

      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 px-3 rounded-xl"
          style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", height: 36 }}>
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
          <input
            autoFocus type="text" placeholder="Buscar chofer…"
            value={q} onChange={e => setQ(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-[13px]"
            style={{ color: "var(--text-primary)" }}
          />
          {q && (
            <button onClick={() => setQ("")} style={{ color: "var(--text-muted)" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto px-2 pb-2" style={{ maxHeight: 220 }}>
        {visible.length === 0 ? (
          <p className="text-center py-4 text-[12px]" style={{ color: "var(--text-muted)" }}>Sin resultados</p>
        ) : visible.map((d, i) => (
          <DriverSelectOption key={d.id} driver={d}
            isSelected={d.id === selectedId}
            index={i} onSelect={() => onSelect(d.id)} />
        ))}
      </div>
    </motion.div>
  );
}

interface UnitCardProps {
  unit: Unit;
  index: number;
  onUpdate: (id: string, patch: Partial<Unit>) => void;
  drivers: Driver[];
}

export function UnitCard({ unit, index, onUpdate, drivers }: UnitCardProps) {
  const {
    pendingId, setPendingId,
    open, setOpen,
    editMode, setEditMode,
    localMaint, setLocalMaint,
    ref,
    handleSave, handleEditSave, handleEditCancel,
  } = useUnitCard(unit, onUpdate);

  const s       = STATUS_CFG[unit.estado];
  const saved   = drivers.find(d => d.id === unit.choferId) ?? null;
  const pending = drivers.find(d => d.id === pendingId) ?? null;
  const stage: "empty" | "pending" | "saved" = pending ? "pending" : saved ? "saved" : "empty";

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={SPRING}
      whileHover={open || editMode ? {} : { y: -3 }}
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
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-x-2 flex-wrap gap-y-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.bg }}>
              <Truck className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-[18px] font-extrabold tracking-tight leading-none truncate min-w-0 block" style={{ color: "var(--text-primary)" }}>
                Unidad {unit.numero}
              </span>
              <p className="text-xs mt-1 truncate" style={{ color: "var(--text-secondary)" }}>{unit.modelo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: s.bg }}>
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

        <div style={{ height: 1, margin: "0 -24px", backgroundColor: "var(--border-color)" }} />

        {/* Área de asignación */}
        <div className="relative" ref={ref} style={{ overflow: "visible" }}>

          {stage === "empty" && (
            <button onClick={() => setOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 rounded-2xl text-[13px] font-bold focus:outline-none"
              style={{
                height: 52,
                backgroundColor: open ? "#155DFC" : "var(--bg-tertiary)",
                border: `1px solid ${open ? "#155DFC" : "var(--border-color)"}`,
                color: open ? "#fff" : "var(--text-primary)",
                transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
              }}>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span>Asignar chofer</span>
              </div>
              <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18, ease: SNAP }}>
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </motion.div>
            </button>
          )}

          <AnimatePresence>
            {stage === "pending" && pending && (
              <motion.div key="pending-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto", transition: { height: { duration: 0.2, ease: SNAP }, opacity: { duration: 0.15, delay: 0.08 } } }}
                exit={{ opacity: 0, height: 0, transition: { height: { duration: 0.16, ease: SNAP }, opacity: { duration: 0.08 } } }}
                style={{ overflow: "hidden" }}>
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
                    <motion.button whileTap={{ scale: 0.96 }} onClick={handleSave}
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
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setOpen(v => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0"
                style={{
                  backgroundColor: open ? "#155DFC" : "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  color: open ? "#fff" : "var(--text-primary)",
                  transition: "background-color 0.15s, color 0.15s",
                }}>
                <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.button>
            </div>
          )}

          <AnimatePresence>
            {open && (
              <DriverDropdown
                drivers={drivers}
                selectedId={pendingId ?? unit.choferId}
                onSelect={(id) => { setPendingId(id); setOpen(false); }}
              />
            )}
          </AnimatePresence>
        </div>

        <div style={{ height: 1, margin: "0 -24px", backgroundColor: "var(--border-color)" }} />

        {/* Gas */}
        <GasBar value={unit.gasolina} />

        {/* Mantenimiento — height+opacity con transiciones separadas */}
        <AnimatePresence initial={false}>
          {editMode && (
            <motion.div key="maint-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", transition: { height: { duration: 0.2, ease: SNAP }, opacity: { duration: 0.15, delay: 0.1 } } }}
              exit={{ opacity: 0, height: 0, transition: { height: { duration: 0.16, ease: SNAP }, opacity: { duration: 0.08 } } }}
              style={{ overflow: "hidden" }}>
              <button type="button" onClick={() => setLocalMaint(v => !v)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl"
                style={{
                  backgroundColor: localMaint ? "#F59E0B" : "var(--bg-tertiary)",
                  border: `1px solid ${localMaint ? "#F59E0B" : "var(--border-color)"}`,
                  transition: "background-color 0.18s, border-color 0.18s",
                }}>
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5" style={{ color: localMaint ? "#fff" : "var(--text-primary)", transition: "color 0.18s" }} />
                  <span className="text-sm font-semibold" style={{ color: localMaint ? "#fff" : "var(--text-primary)", transition: "color 0.18s" }}>
                    Mantenimiento
                  </span>
                </div>
                <div className="relative w-9 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: localMaint ? "rgba(255,255,255,0.35)" : "var(--border-color)", transition: "background-color 0.18s" }}>
                  <motion.div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ left: localMaint ? "18px" : "2px" }}
                    transition={{ type: "spring", stiffness: 480, damping: 36 }} />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones — contenedor fijo, hijos absolutos, crossfade puro */}
        <div style={{ position: "relative", height: 44 }}>
          <AnimatePresence initial={false}>
            {editMode ? (
              <motion.div key="save-btns"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="absolute inset-0 flex gap-2">
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleEditSave}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold text-white"
                  style={{ backgroundColor: "#10B981" }}>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  Guardar
                </motion.button>
                <motion.button whileTap={{ scale: 0.94 }} onClick={handleEditCancel}
                  className="flex items-center justify-center rounded-2xl shrink-0"
                  style={{ width: 44, backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <X className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button key="edit-btn" type="button"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.12, delay: 0.14, ease: "easeOut" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEditMode(true)}
                className="absolute inset-0 flex items-center justify-center gap-2 rounded-2xl border text-[13px] font-semibold w-full"
                style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                Editar detalles
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
