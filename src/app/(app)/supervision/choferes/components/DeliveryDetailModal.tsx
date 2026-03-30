"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, Package, Weight, DollarSign, ShoppingCart, X } from "lucide-react";
import { Delivery, DeliveryStatus } from "../data";

const STATUS_CFG: Record<DeliveryStatus, { color: string; bg: string; border: string; label: string }> = {
  Entregado: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", label: "Entregado" },
  "En Ruta": { color: "#155DFC", bg: "rgba(21,93,252,0.12)",  border: "rgba(21,93,252,0.25)",  label: "En Ruta"   },
  Pendiente: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Pendiente" },
};
const ALMACEN_CFG: Record<string, { color: string; bg: string }> = {
  Vidrio:   { color: "#0EA5E9", bg: "rgba(14,165,233,0.1)"  },
  Aluminio: { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
  Herrajes: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
};
const ALMACEN_ORDER = ["Vidrio", "Aluminio", "Herrajes"];
const SPRING = { type: "spring", stiffness: 300, damping: 28 } as const;
const fmt$ = (n: number) => `$${n.toLocaleString("es-MX")}`;

interface DeliveryDetailModalProps {
  delivery: Delivery;
  onClose: () => void;
}

function ModalBody({ d, onClose }: { d: Delivery; onClose: () => void }) {
  const cfg = STATUS_CFG[d.status];
  const totalItems = d.items.reduce((s, it) => s + it.subtotal, 0);

  // Group and sort items by almacén
  const grouped = ALMACEN_ORDER
    .map(alm => ({ alm, items: d.items.filter(it => it.almacen === alm) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-extrabold" style={{ color: "var(--text-primary)" }}>{d.folio}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
              {d.status === "Entregado" && <CheckCircle2 className="w-3 h-3" />}
              {cfg.label}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{d.dateLabel} · {d.time}</p>
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      <div style={{ height: 1, backgroundColor: "var(--border-color)" }} className="mb-4 shrink-0" />

      {/* Cliente + Bloque en una fila */}
      <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
        <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Package className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cliente</p>
          </div>
          <p className="text-xs font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{d.client}</p>
        </div>
        <div className="rounded-2xl p-3" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Destino</p>
          </div>
          <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{d.address}</p>
        </div>
      </div>

      {/* Items agrupados por almacén */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Detalles de Factura</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: "rgba(21,93,252,0.1)", color: "#155DFC" }}>
            {d.items.length} piezas
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:flex flex-col flex-1 min-h-0 rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border-color)" }}>
          <div className="grid text-[9px] font-bold uppercase tracking-widest px-3 py-2 shrink-0"
            style={{ gridTemplateColumns: "1fr 52px 60px 70px", backgroundColor: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
            <span>Descripción</span>
            <span className="text-right">Cant.</span>
            <span className="text-right">P.Unit</span>
            <span className="text-right">Subtotal</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {grouped.map(({ alm, items }) => {
              const almCfg = ALMACEN_CFG[alm] ?? { color: "var(--text-muted)", bg: "transparent" };
              return (
                <div key={alm}>
                  {/* Almacén header row */}
                  <div className="flex items-center gap-2 px-3 py-1.5"
                    style={{ backgroundColor: almCfg.bg, borderBottom: "1px solid var(--border-color)" }}>
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: almCfg.color }}>{alm}</span>
                  </div>
                  {items.map((item, idx) => (
                    <div key={`${alm}-${item.descripcion}-${idx}`}
                      className="grid items-center px-3 py-2.5 text-xs"
                      style={{ gridTemplateColumns: "1fr 52px 60px 70px", borderBottom: "1px solid var(--border-color)" }}>
                      <span className="font-semibold pr-3 leading-snug" style={{ color: "var(--text-primary)" }}>{item.descripcion}</span>
                      <span className="text-right font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                        {item.cantidad} <span className="font-normal text-[10px]" style={{ color: "var(--text-muted)" }}>{item.unidad}</span>
                      </span>
                      <span className="text-right tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt$(item.precioUnit)}</span>
                      <span className="text-right font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{fmt$(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile cards agrupados */}
        <div className="sm:hidden overflow-y-auto flex-1 space-y-3">
          {grouped.map(({ alm, items }) => {
            const almCfg = ALMACEN_CFG[alm] ?? { color: "var(--text-muted)", bg: "transparent" };
            return (
              <div key={alm}>
                <div className="flex items-center gap-1.5 mb-1.5 px-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: almCfg.color }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: almCfg.color }}>{alm}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={`${alm}-${item.descripcion}-${idx}`} className="rounded-xl p-3"
                      style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>{item.descripcion}</p>
                        <span className="text-xs font-bold tabular-nums shrink-0" style={{ color: "var(--text-primary)" }}>{fmt$(item.subtotal)}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.cantidad} {item.unidad}</span>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>c/u {fmt$(item.precioUnit)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-xl shrink-0"
          style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="flex items-center gap-2">
            <Weight className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{d.weight} kg</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            <span className="text-sm font-extrabold tabular-nums" style={{ color: "#10B981" }}>Total: {fmt$(totalItems)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DeliveryDetailModal({ delivery, onClose }: DeliveryDetailModalProps) {
  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9998]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)" }}
        onClick={onClose} />

      {/* Desktop */}
      <motion.div key="modal-desktop"
        initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={SPRING}
        className="fixed inset-0 z-[9999] hidden md:flex items-center justify-center p-6 pointer-events-none">
        <div className="w-full max-w-xl h-auto max-h-[85vh] rounded-3xl p-5 pointer-events-auto flex flex-col"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
          <ModalBody d={delivery} onClose={onClose} />
        </div>
      </motion.div>

      {/* Mobile bottom sheet */}
      <motion.div key="modal-mobile"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden rounded-t-3xl flex flex-col"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderBottom: "none", boxShadow: "0 -16px 60px rgba(0,0,0,0.45)", maxHeight: "88vh" }}>
        <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-0 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-8">
          <ModalBody d={delivery} onClose={onClose} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
