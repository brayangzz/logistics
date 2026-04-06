"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin, ChevronDown, Check, Pencil, Package, Truck, X, Box,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvoiceOrder, Driver, Block } from "../asignar.types";
import { asignarBlocks } from "@/data";

const BLOCKS: Block[] = asignarBlocks as Block[];

const STATE_CFG: Record<string, { label: string; color: string }> = {
  Pendiente: { label: "Pendiente", color: "#EF4444" },
  Asignado: { label: "Asignado", color: "#10B981" },
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

// hex → rgba helper
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
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left"
      style={{
        backgroundColor: isSelected ? hexAlpha(ac.bg, 0.12) : hov ? "var(--select-option-hover)" : "transparent",
        border: isSelected ? `1px solid ${hexAlpha(ac.bg, 0.30)}` : "1px solid transparent",
        transition: "background-color 0.12s, border-color 0.12s",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0"
        style={{ backgroundColor: ac.bg, color: ac.color, boxShadow: `0 3px 10px ${hexAlpha(ac.bg, 0.4)}` }}
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
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: ac.bg }}>
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

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pending = pendingId ? block.drivers.find(d => d.id === pendingId) : null;
  const handleSave = () => {
    if (pendingId && pending) {
      onAssign(order.id, pendingId);
      onToast(order.invoiceNumber, pending.name);
      setPendingId(null);
    }
  };

  const stage: "empty" | "pending" | "saved" = pending ? "pending" : saved ? "saved" : "empty";
  const totalW = order.warehouses.length;
  const doneW = order.anticipatedDone ?? 0;
  const pct = totalW > 0 ? Math.round((doneW / totalW) * 100) : 0;

  const clientAc = avatarColor(order.clientInitials);
  const savedAc = saved ? avatarColor(saved.initials) : null;
  const pendingAc = pending ? avatarColor(pending.initials) : null;
  const isAsignado = order.state === "Asignado";

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{
        type: "spring", stiffness: 500, damping: 32,
        opacity: { duration: 0.15 },
        layout: { type: "spring", stiffness: 260, damping: 26 },
        delay: index * 0.02,
      }}
      whileHover={{ y: open ? 0 : -6 }}
      onMouseEnter={e => {
        if (open) return;
        const el = e.currentTarget;
        el.style.borderRightColor = hexAlpha(clientAc.bg, 0.45);
        el.style.borderBottomColor = hexAlpha(clientAc.bg, 0.45);
        el.style.borderLeftColor = hexAlpha(clientAc.bg, 0.45);
        el.style.boxShadow = `0 24px 64px rgba(0,0,0,0.30), 0 0 0 1px ${hexAlpha(clientAc.bg, 0.20)}, 0 8px 32px ${hexAlpha(clientAc.bg, 0.18)}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderRightColor = "var(--border-color)";
        el.style.borderBottomColor = "var(--border-color)";
        el.style.borderLeftColor = "var(--border-color)";
        el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.10)";
      }}
      className="flex flex-col"
      style={{
        position: "relative",
        zIndex: open ? 40 : 1,
        borderRadius: "0 0 18px 18px",
        overflow: "visible",
        borderRight: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
        borderLeft: "1px solid var(--border-color)",
        borderTop: `4px solid ${clientAc.bg}`,
        backgroundColor: "var(--bg-secondary)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
        transition: "border-color 0.15s ease-out, box-shadow 0.15s ease-out",
      }}
    >

      {/* ZONA HERO — número de factura grande + cliente */}
      <div
        style={{
          padding: "16px 18px 14px",
          background: hexAlpha(clientAc.bg, 0.06),
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {/* Número factura + badge estado */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-col gap-1.5">
            <span
              style={{
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: "-1.5px",
                lineHeight: 1,
                color: "var(--text-primary)",
              }}
            >
              {order.invoiceNumber}
            </span>
            {/* Block tag + meta inline */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                style={{
                  backgroundColor: hexAlpha(clientAc.bg, 0.15),
                  color: clientAc.bg,
                  border: `1px solid ${hexAlpha(clientAc.bg, 0.30)}`,
                }}
              >
                {block.shortName}
              </span>
              {order.anticipated && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.22)" }}>
                  Anticip.
                </span>
              )}
            </div>
          </div>

          {/* Status pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 mt-0.5"
            style={{
              backgroundColor: isAsignado ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
              border: `1px solid ${isAsignado ? "rgba(16,185,129,0.32)" : "rgba(239,68,68,0.32)"}`,
            }}
          >
            {!isAsignado ? (
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full opacity-70" style={{ backgroundColor: s.color }} />
                <span className="relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            )}
            <span className="text-[11px] font-semibold" style={{ color: s.color }}>{s.label}</span>
          </div>
        </div>

        {/* Cliente */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-extrabold shrink-0"
            style={{ backgroundColor: clientAc.bg, color: "#fff", boxShadow: `0 3px 12px ${hexAlpha(clientAc.bg, 0.35)}`, transition: "box-shadow 0.2s ease" }}
          >
            {order.clientInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
              {order.clientName}
            </p>
            <motion.a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.clientAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.96 }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.color = clientAc.bg;
                const icon = e.currentTarget.querySelector('svg');
                if(icon) icon.style.color = clientAc.bg;
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.color = "var(--text-muted)";
                const icon = e.currentTarget.querySelector('svg');
                if(icon) icon.style.color = "var(--text-muted)";
              }}
              className="flex items-center gap-1.5 mt-1 mt-0.5 inline-flex w-fit max-w-full"
              style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
            >
              <MapPin className="w-3 h-3 shrink-0 transition-colors duration-200" strokeWidth={2} style={{ color: "var(--text-muted)" }} />
              <span className="text-[11px] font-medium truncate underline hover:no-underline transition-colors duration-200 block">
                {order.clientAddress}
              </span>
            </motion.a>
          </div>
          {/* Peso + fecha a la derecha del cliente */}
          <div className="flex flex-col items-end shrink-0 gap-0.5">
            <span className="text-[13px] font-extrabold tabular-nums" style={{ color: "var(--text-primary)" }}>
              {order.totalWeight}<span className="text-[10px] font-semibold ml-0.5" style={{ color: "var(--text-muted)" }}>kg</span>
            </span>
            <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>{order.date}</span>
          </div>
        </div>
      </div>

      {/* ZONA ALMACENES */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-color)" }}>
        {/* Divider con label centrado */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
          <div className="flex items-center gap-1.5 shrink-0">
            <Package className="w-3 h-3" style={{ color: "var(--text-muted)" }} strokeWidth={2} />
            <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Almacenes</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {order.warehouses.map((w, i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <Box className="w-3 h-3 shrink-0" style={{ color: "var(--text-muted)" }} strokeWidth={1.75} />
              <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>{w}</span>
            </motion.div>
          ))}
        </div>
        {order.anticipated && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Preparación</span>
              <span className="text-[11px] font-extrabold tabular-nums"
                style={{ color: pct === 100 ? "#10B981" : "var(--text-secondary)" }}>{doneW}/{totalW}</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
              <motion.div className="h-full rounded-full"
                style={{ backgroundColor: pct === 100 ? "#10B981" : clientAc.bg }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ZONA ASIGNACIÓN */}
      <div
        ref={ref}
        style={{
          padding: "13px 18px",
          borderRadius: "0 0 17px 17px",
          position: "relative",
          overflow: "visible",
          backgroundColor: "transparent",
          transition: "background-color 0.15s ease-out",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>

          {stage === "empty" && (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 rounded-2xl text-[13px] font-bold focus:outline-none"
                style={{
                  height: 50,
                  backgroundColor: open ? "#155DFC" : "var(--bg-tertiary)",
                  border: `1.5px solid ${open ? "#155DFC" : "var(--border-color)"}`,
                  color: open ? "#fff" : "var(--text-secondary)",
                  transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
                }}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 shrink-0" strokeWidth={2} />
                  <span>Asignar chofer</span>
                </div>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 32 }}>
                  <ChevronDown className="w-4 h-4" strokeWidth={2} />
                </motion.div>
              </button>
            </motion.div>
          )}

          {stage === "pending" && pending && pendingAc && (
            <motion.div key="pending"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <div className="flex flex-col gap-2.5">
                <div
                  className="flex items-center gap-3 px-3.5 rounded-2xl"
                  style={{
                    height: 52,
                    backgroundColor: hexAlpha(pendingAc.bg, 0.08),
                    border: `1px solid ${hexAlpha(pendingAc.bg, 0.28)}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{ backgroundColor: pendingAc.bg, color: "#fff", boxShadow: `0 3px 10px ${hexAlpha(pendingAc.bg, 0.45)}` }}
                  >
                    {pending.initials}
                  </div>
                  <span className="text-[13px] font-semibold flex-1 truncate" style={{ color: "var(--text-primary)" }}>
                    {pending.name}
                  </span>
                  <span className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.22)" }}>
                    Sin guardar
                  </span>
                </div>
                <div className="flex gap-2" style={{ height: 42 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold text-white"
                    style={{ backgroundColor: "#10B981", boxShadow: "0 4px 18px rgba(16,185,129,0.35)" }}>
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    Confirmar asignación
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => { setPendingId(null); setOpen(false); }}
                    className="flex items-center justify-center rounded-2xl shrink-0"
                    style={{ width: 42, backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <X className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "saved" && saved && savedAc && (
            <motion.div key="saved"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[12px] font-extrabold shrink-0"
                  style={{
                    backgroundColor: savedAc.bg,
                    color: "#fff",
                    boxShadow: `0 4px 16px ${hexAlpha(savedAc.bg, 0.50)}`,
                  }}
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.91 }}
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
            </motion.div>
          )}

        </AnimatePresence>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="absolute left-0 right-0 top-full mt-2 z-[500] rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-hover)",
                boxShadow: `0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px ${hexAlpha(clientAc.bg, 0.15)}`,
              }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: clientAc.bg }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>{block.name}</span>
              </div>
              <div className="p-2 flex flex-col gap-0.5">
                {block.drivers.map((d, i) => (
                  <DriverOption key={d.id} driver={d}
                    isSelected={d.id === (pendingId ?? order.assignedDriver)}
                    index={i} onSelect={() => { setPendingId(d.id); setOpen(false); }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};
