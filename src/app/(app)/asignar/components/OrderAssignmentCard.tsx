"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Pencil, Package, Truck, UserX, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceOrder, Driver, Block } from "../asignar.types";
import { asignarBlocks } from "@/data";

const BLOCKS: Block[] = asignarBlocks as Block[];

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

const STATE_CFG: Record<string, { label: string; color: string }> = {
  Pendiente: { label: "Pendiente", color: "#F59E0B" },
  Asignado:  { label: "Asignado",  color: "#10B981" },
};

const AVATAR_COLORS = [
  { bg: "#155DFC", color: "#fff" },
  { bg: "#10B981", color: "#fff" },
  { bg: "#8B5CF6", color: "#fff" },
  { bg: "#0EA5E9", color: "#fff" },
  { bg: "#F59E0B", color: "#fff" },
  { bg: "#6366F1", color: "#fff" },
] as const;

const avatarColor = (i: string) =>
  AVATAR_COLORS[(i.charCodeAt(0) + (i.charCodeAt(1) ?? 0)) % AVATAR_COLORS.length];

const hexAlpha = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const DriverOption = ({ driver, isSelected, index, onSelect }:
  { driver: Driver; isSelected: boolean; index: number; onSelect: () => void }) => {
  const [hov, setHov] = useState(false);
  const ac = avatarColor(driver.initials);
  return (
    <motion.button
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
      style={{
        backgroundColor: isSelected
          ? "rgba(21,93,252,0.10)"
          : hov ? "var(--select-option-hover)" : "transparent",
        border: isSelected ? "1px solid rgba(21,93,252,0.22)" : "1px solid transparent",
        transition: "background-color 0.12s, border-color 0.12s",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
        style={{ backgroundColor: ac.bg, color: ac.color }}
      >
        {driver.initials}
      </div>
      <span className="text-[13px] font-semibold flex-1 truncate" style={{ color: "var(--text-primary)" }}>
        {driver.name}
      </span>
      <AnimatePresence>
        {isSelected && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#155DFC" }}>
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

interface OrderAssignmentCardProps {
  order: InvoiceOrder;
  onAssign: (id: string, dId: string) => void;
  onToast: (inv: string, name: string) => void;
  index: number;
}

export const OrderAssignmentCard = ({ order, onAssign, onToast, index }: OrderAssignmentCardProps) => {
  const s = STATE_CFG[order.state];
  const block = BLOCKS.find(b => b.id === order.assignedBlock)!;
  const saved = block.drivers.find(d => d.id === order.assignedDriver);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelect = (driverId: string, driverName: string) => {
    onAssign(order.id, driverId);
    if (driverId) onToast(order.invoiceNumber, driverName);
    setOpen(false);
  };

  const totalW = order.warehouses.length;
  const doneW = order.anticipatedDone ?? 0;
  const pct = totalW > 0 ? Math.round((doneW / totalW) * 100) : 0;

  const clientAc = avatarColor(order.clientInitials);
  const savedAc = saved ? avatarColor(saved.initials) : null;
  const isAsignado = order.state === "Asignado";

  return (
    <div
      className="relative flex flex-col h-full rounded-[28px]"
      style={{
        zIndex: open ? 40 : 1,
        overflow: "visible",
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex flex-col flex-1 p-5 gap-5">

        {/* Header: folio grande + badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="font-extrabold tracking-tight leading-none" style={{ color: "var(--text-primary)", fontSize: 34 }}>
              {order.invoiceNumber}
            </span>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: isAsignado ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
                  border: `1px solid ${isAsignado ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.22)"}`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isAsignado ? "#10B981" : "#F59E0B" }} />
                <span className="text-[10px] leading-none font-bold" style={{ color: isAsignado ? "#10B981" : "#F59E0B" }}>
                  {s.label}
                </span>
              </div>
              {order.anticipated && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: "rgba(245,158,11,0.10)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.20)" }}>
                  Anticip.
                </span>
              )}
            </div>
          </div>
          <p className="text-[12px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
            {order.clientName}
          </p>
        </div>

        {/* Meta: bloque + peso — secundario */}
        <div
          className="grid grid-cols-2 rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
        >
          <div className="flex items-center justify-center gap-2 py-2.5 px-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>Bloque</span>
            <span className="text-[13px] font-bold tabular-nums truncate" style={{ color: "var(--text-secondary)" }}>
              {block.shortName}
            </span>
          </div>
          <div
            className="flex items-center justify-center gap-1.5 py-2.5 px-3"
            style={{ borderLeft: "1px solid var(--border-color)" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>Peso</span>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: "var(--text-secondary)" }}>
              {order.totalWeight}<span className="text-[10px] font-medium ml-0.5" style={{ color: "var(--text-muted)" }}>kg</span>
            </span>
          </div>
        </div>

        {/* Dirección */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
          <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
            {order.clientAddress}
          </span>
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)" }} />

        {/* Almacenes */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <Package className="w-3 h-3" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.04em]" style={{ color: "var(--text-secondary)" }}>
              Almacenes
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {order.warehouses.map((w) => (
              <span
                key={w}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
                {w}
              </span>
            ))}
          </div>

          {order.anticipated && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Preparación</span>
                <span className="text-[11px] font-extrabold tabular-nums"
                  style={{ color: pct === 100 ? "#10B981" : "var(--text-secondary)" }}>{doneW}/{totalW}</span>
              </div>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: pct === 100 ? "#10B981" : clientAc.bg }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 180, damping: 24, delay: 0.1 }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border-color)" }} />

        {/* Zona asignación */}
        <div ref={ref} className="relative mt-auto" style={{ overflow: "visible" }}>
          {saved && savedAc ? (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
                style={{ backgroundColor: savedAc.bg, color: "#fff", boxShadow: `0 4px 14px ${hexAlpha(savedAc.bg, 0.40)}` }}
              >
                {saved.initials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-bold leading-tight block truncate" style={{ color: "var(--text-primary)" }}>
                  {saved.name}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 shrink-0" style={{ color: "#10B981" }} strokeWidth={3} />
                  <span className="text-[11px] font-semibold" style={{ color: "#10B981" }}>Ruta asignada</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setOpen(v => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-xl shrink-0"
                style={{
                  backgroundColor: open ? "#155DFC" : "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  color: open ? "#fff" : "var(--text-secondary)",
                  transition: "background-color 0.13s, color 0.13s",
                }}>
                <Pencil className="w-3.5 h-3.5" strokeWidth={2.5} />
              </motion.button>
            </div>
          ) : (
            <div style={{ willChange: "transform" }}>
              <motion.button
                whileHover={{ scale: 1.025, boxShadow: "0 10px 24px rgba(21,93,252,0.30)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ scale: { type: "spring", stiffness: 380, damping: 30, restDelta: 0.001 }, boxShadow: { duration: 0.18 } }}
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 rounded-2xl text-[13px] font-bold focus:outline-none"
                style={{
                  height: 46,
                  background: "linear-gradient(135deg,#155DFC,#2563EB)",
                  border: "none",
                  color: "#fff",
                  boxShadow: "0 6px 18px rgba(21,93,252,0.28)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span>Asignar chofer</span>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>
                  <ChevronDown className="w-4 h-4" strokeWidth={2} />
                </motion.div>
              </motion.button>
            </div>
          )}

          {/* Dropdown */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="absolute left-0 right-0 top-full mt-2 z-[500] rounded-2xl"
                style={{
                  backgroundColor: "var(--dropdown-bg)",
                  border: "1px solid var(--border-hover)",
                  boxShadow: "0 24px 56px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.18)",
                  overflow: "hidden",
                }}>
                <div className="p-2 flex flex-col gap-0.5">
                  {/* Sin asignar — tenue, separado */}
                  <motion.button
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect("", "")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid transparent",
                      opacity: 0.6,
                      transition: "background-color 0.12s, opacity 0.12s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--select-option-hover)"; e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.opacity = "0.6"; }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                      <UserX className="w-3 h-3" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
                    </div>
                    <span className="text-[12px] font-medium flex-1" style={{ color: "var(--text-secondary)" }}>
                      Sin asignar
                    </span>
                    <AnimatePresence>
                      {!order.assignedDriver && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 24 }}>
                          <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#10B981" }}>
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="my-1 mx-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />

                  {block.drivers.map((d, i) => (
                    <DriverOption key={d.id} driver={d}
                      isSelected={d.id === order.assignedDriver}
                      index={i + 1} onSelect={() => handleSelect(d.id, d.name)} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
