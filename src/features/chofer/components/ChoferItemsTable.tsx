"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PackageOpen, Check, CheckCircle2, Save, Weight, Package, Layers, Aperture, MapPin, X } from "lucide-react";
import { InvoiceDetail, InvoiceItem } from "../models";

type SaveState = "idle" | "dirty" | "saved";

interface ChoferItemsTableProps {
  invoice: InvoiceDetail;
}

const WH_COLOR: Record<string, string> = {
  Herrajes: "#F59E0B",
  Aluminio: "#155DFC",
  Vidrio:   "#10B981",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Location maps ───────────────────────────── */

// Aluminio: Árbol — poste central, 6 niveles, ramas izq (impares) y der (pares)
const AluminioMap = ({ activeSections }: { activeSections: Set<string> }) => {
  // levels top→bottom: level 0=[1,2], 1=[3,4], ... 5=[11,12]
  // left branch = odd number, right branch = even number
  const levels = [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]];

  const BLUE   = "#155DFC";
  const DIM    = "#374151";
  const STROKE = "#4B5563";

  // SVG dimensions
  const W = 220, H = 310;
  const cx = W / 2;         // trunk x
  const topY = 20;
  const botY = H - 20;
  const branchW = 76;       // half-width of each branch arm
  const levelH = (botY - topY) / 6;

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      {/* Labels */}
      <div className="w-full flex justify-between px-2">
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Izq</span>
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Der</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} fill="none">
        {/* ── Trunk ── */}
        <line x1={cx} y1={topY} x2={cx} y2={botY} stroke={STROKE} strokeWidth="3" strokeLinecap="round" />

        {levels.map(([odd, even], i) => {
          const leftActive  = activeSections.has(String(odd));
          const rightActive = activeSections.has(String(even));
          const y = topY + i * levelH + levelH / 2;
          const armLeft  = cx - branchW;
          const armRight = cx + branchW;
          const midLeft  = cx - branchW / 2;
          const midRight = cx + branchW / 2;

          return (
            <g key={odd}>
              {/* ── left arm ── */}
              <line
                x1={cx} y1={y} x2={armLeft} y2={y}
                stroke={leftActive ? BLUE : STROKE}
                strokeWidth={leftActive ? "4" : "2.5"}
                strokeLinecap="round"
              />
              {/* divider line at midpoint of left arm */}
              <line
                x1={midLeft} y1={y - 8} x2={midLeft} y2={y + 8}
                stroke={leftActive ? BLUE : DIM}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* left label */}
              <circle
                cx={armLeft} cy={y} r="13"
                fill={leftActive ? BLUE : "transparent"}
                stroke={leftActive ? BLUE : STROKE}
                strokeWidth="1.5"
              />
              <text
                x={armLeft} y={y + 4}
                textAnchor="middle" fontSize="10" fontWeight="800"
                fill={leftActive ? "#fff" : "#6B7280"}
              >{odd}</text>

              {/* ── right arm ── */}
              <line
                x1={cx} y1={y} x2={armRight} y2={y}
                stroke={rightActive ? BLUE : STROKE}
                strokeWidth={rightActive ? "4" : "2.5"}
                strokeLinecap="round"
              />
              {/* divider line at midpoint of right arm */}
              <line
                x1={midRight} y1={y - 8} x2={midRight} y2={y + 8}
                stroke={rightActive ? BLUE : DIM}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* right label */}
              <circle
                cx={armRight} cy={y} r="13"
                fill={rightActive ? BLUE : "transparent"}
                stroke={rightActive ? BLUE : STROKE}
                strokeWidth="1.5"
              />
              <text
                x={armRight} y={y + 4}
                textAnchor="middle" fontSize="10" fontWeight="800"
                fill={rightActive ? "#fff" : "#6B7280"}
              >{even}</text>
            </g>
          );
        })}

        {/* trunk cap */}
        <circle cx={cx} cy={topY} r="5" fill={STROKE} />
        <circle cx={cx} cy={botY} r="5" fill={STROKE} />
      </svg>

      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {activeSections.size === 0
          ? "Sin sección asignada"
          : `Sección${activeSections.size > 1 ? "es" : ""}: ${[...activeSections].sort((a,b) => Number(a)-Number(b)).join(", ")}`}
      </span>
    </div>
  );
};

// Vidrio: un solo caballete /\ — lado izq = sección 1, lado der = sección 2
// Una factura siempre está en un solo lado
const VidrioMap = ({ activeSections }: { activeSections: Set<string> }) => {
  // Take only the first section — one side per invoice
  const firstSection = [...activeSections][0];
  const left  = firstSection === "1";
  const right = firstSection === "2";

  const GREEN   = "#10B981";
  const DIM     = "#374151";
  const LABEL_A = "#6B7280";

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Labels above */}
      <div className="w-full flex justify-between px-4">
        <span className="text-xs font-bold" style={{ color: left ? GREEN : "var(--text-secondary)" }}>
          Lado 1
        </span>
        <span className="text-xs font-bold" style={{ color: right ? GREEN : "var(--text-secondary)" }}>
          Lado 2
        </span>
      </div>

      {/* Single caballete SVG */}
      <svg viewBox="0 0 120 100" width="200" height="166" fill="none">
        {/* ── left leg (side 1) ── */}
        <line
          x1="10" y1="90" x2="60" y2="10"
          stroke={left ? GREEN : DIM}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* glass panel on left side */}
        <rect
          x="14" y="22" width="36" height="52" rx="3"
          fill={left ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)"}
          stroke={left ? GREEN : "#4B5563"}
          strokeWidth="1.5"
        />

        {/* ── right leg (side 2) ── */}
        <line
          x1="110" y1="90" x2="60" y2="10"
          stroke={right ? GREEN : DIM}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* glass panel on right side */}
        <rect
          x="70" y="22" width="36" height="52" rx="3"
          fill={right ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)"}
          stroke={right ? GREEN : "#4B5563"}
          strokeWidth="1.5"
        />

        {/* ── horizontal brace ── */}
        <line
          x1="28" y1="58" x2="92" y2="58"
          stroke="#4B5563"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* ── apex dot ── */}
        <circle cx="60" cy="10" r="4" fill={left || right ? GREEN : DIM} />

        {/* ── section number badges ── */}
        <circle cx="18" cy="90" r="10" fill={left ? GREEN : "transparent"} stroke={left ? GREEN : DIM} strokeWidth="1.5" />
        <text x="18" y="95" textAnchor="middle" fontSize="10" fontWeight="800" fill={left ? "#fff" : LABEL_A}>1</text>

        <circle cx="102" cy="90" r="10" fill={right ? GREEN : "transparent"} stroke={right ? GREEN : DIM} strokeWidth="1.5" />
        <text x="102" y="95" textAnchor="middle" fontSize="10" fontWeight="800" fill={right ? "#fff" : LABEL_A}>2</text>
      </svg>

      {/* State label */}
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {left ? "Material en lado 1 (izq)" : right ? "Material en lado 2 (der)" : "Sin sección asignada"}
      </span>
    </div>
  );
};

/* ── Location modal ──────────────────────────── */
const LocationModal = ({
  warehouse,
  items,
  onClose,
}: {
  warehouse: string;
  items: InvoiceItem[];
  onClose: () => void;
}) => {
  const dot = WH_COLOR[warehouse] ?? "#155DFC";
  const activeSections = useMemo(
    () => new Set(items.map((i) => i.section).filter(Boolean) as string[]),
    [items]
  );

  const icon = (() => {
    if (warehouse === "Herrajes") return <Package className="w-4 h-4 text-white" strokeWidth={2} />;
    if (warehouse === "Aluminio") return <Layers className="w-4 h-4 text-white" strokeWidth={2} />;
    return <Aperture className="w-4 h-4 text-white" strokeWidth={2} />;
  })();

  const modal = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="w-full max-w-sm rounded-3xl border flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b shrink-0"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: dot }}
              >
                {icon}
              </div>
              <div>
                <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Ubicación · {warehouse === "Aluminio" ? "Árbol" : warehouse}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  {activeSections.size > 0
                    ? `Sección${activeSections.size > 1 ? "es" : ""}: ${[...activeSections].join(", ")}`
                    : "Sin sección asignada"}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center focus:outline-none"
              style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
            >
              <X className="w-4 h-4" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Map */}
          <div className="p-5 pb-6">
            {warehouse === "Aluminio" && <AluminioMap activeSections={activeSections} />}
            {warehouse === "Vidrio" && <VidrioMap activeSections={activeSections} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
};

/* ── Item row ─────────────────────────────── */
const ItemRow = ({
  item,
  isStaged,
  isSaved,
  onToggle,
}: {
  item: InvoiceItem;
  isStaged: boolean;
  isSaved: boolean;
  onToggle: () => void;
}) => {
  const totalKg = (item.quantity * item.weightPerUnit).toFixed(1);
  const isPending = isStaged !== isSaved;
  const checked = isStaged;

  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.97 }}
      className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl focus:outline-none"
      style={{
        backgroundColor: "var(--bg-input)",
        border: `1px solid ${isPending ? "rgba(21,93,252,0.5)" : "var(--border-color)"}`,
        cursor: "pointer",
        transition: "border-color 0.12s",
        minHeight: 52,
      }}
    >
      {/* Checkbox */}
      <div
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
        style={{
          border: `2px solid ${checked ? "#155DFC" : "var(--border-hover)"}`,
          backgroundColor: checked ? "#155DFC" : "transparent",
          transition: "background-color 0.12s, border-color 0.12s",
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 10 10" width="12" height="12" fill="none">
          <polyline
            points="1.5,5.5 4,8 8.5,2"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: checked ? 1 : 0, transition: "opacity 0.1s ease" }}
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug"
          style={{
            color: isSaved ? "var(--text-secondary)" : "var(--text-primary)",
            textDecoration: isSaved ? "line-through" : "none",
            transition: "color 0.12s",
          }}
        >
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
            ×{item.quantity}
          </span>
          <span className="text-[10px]" style={{ color: "var(--border-hover)" }}>·</span>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
            {totalKg} kg
          </span>
        </div>
      </div>

      {/* Pending dot */}
      <div
        className="shrink-0 w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: "#155DFC",
          visibility: isPending ? "visible" : "hidden",
        }}
      />
    </motion.button>
  );
};

/* ── Warehouse card ───────────────────────── */
const WarehouseCard = ({
  warehouse,
  items,
  savedVerified,
  onCommit,
}: {
  warehouse: string;
  items: InvoiceItem[];
  savedVerified: Record<string, boolean>;
  onCommit: (patch: Record<string, boolean>) => void;
}) => {
  const dot = WH_COLOR[warehouse] ?? "#155DFC";
  const [staged, setStaged] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, savedVerified[i.id] ?? false]))
  );
  const [saveAnim, setSaveAnim] = useState<"idle" | "saved">("idle");
  const [showMap, setShowMap] = useState(false);

  const hasDirty = items.some((i) => staged[i.id] !== (savedVerified[i.id] ?? false));
  const effectiveSave: SaveState = saveAnim === "saved" ? "saved" : hasDirty ? "dirty" : "idle";

  const savedCount = items.filter((i) => savedVerified[i.id]).length;
  const wDone = savedCount === items.length;
  const totalKg = items.reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);
  const savedKg = items.filter((i) => savedVerified[i.id]).reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);

  const hasMap = (warehouse === "Aluminio" || warehouse === "Vidrio") && items.some((i) => i.section);

  const icon = (() => {
    if (warehouse === "Herrajes") return <Package className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
    if (warehouse === "Aluminio") return <Layers  className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
    return <Aperture className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
  })();

  const handleToggle = (id: string) => {
    setStaged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    if (effectiveSave !== "dirty") return;
    const committed = { ...staged };
    onCommit(committed);
    setStaged(committed);
    setSaveAnim("saved");
    setTimeout(() => setSaveAnim("idle"), 1600);
  };

  return (
    <>
      <div
        className="rounded-2xl border flex flex-col"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: dot }}
            >
              {icon}
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>
              {warehouse}
            </span>

            {/* Location button — icon only, Aluminio/Vidrio only */}
            {hasMap && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowMap(true)}
                className="w-6 h-6 rounded-lg flex items-center justify-center focus:outline-none"
                style={{
                  backgroundColor: `${dot}18`,
                  border: `1px solid ${dot}44`,
                }}
                title="Ver ubicación"
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: dot }} strokeWidth={2.5} />
              </motion.button>
            )}
          </div>

          {/* Pill */}
          <div className="w-[76px] flex justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {wDone ? (
                <motion.div
                  key="listo"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#16A34A" }}
                >
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-white">Listo</span>
                </motion.div>
              ) : (
                <motion.div
                  key="count"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${dot}22`, color: dot }}
                >
                  {savedCount}/{items.length}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Items */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              isStaged={staged[item.id] ?? false}
              isSaved={savedVerified[item.id] ?? false}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>

        {/* Weight */}
        <div
          className="mx-3 mb-3 px-3.5 py-2 rounded-xl flex items-center justify-between"
          style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
        >
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} strokeWidth={2} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Peso verificado</span>
          </div>
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {savedKg.toFixed(1)}{" "}
            <span className="font-medium" style={{ color: "var(--text-secondary)" }}>/ {totalKg.toFixed(1)} kg</span>
          </span>
        </div>

        {/* Save footer */}
        <motion.div
          className="px-3 overflow-hidden"
          animate={{ height: effectiveSave === "idle" ? 0 : "auto", paddingBottom: effectiveSave === "idle" ? 0 : 12 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {effectiveSave === "saved" ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
              >
                <Check className="w-4 h-4" strokeWidth={2.5} /> Guardado
              </motion.div>
            ) : effectiveSave === "dirty" ? (
              <motion.button
                key="dirty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                onClick={handleSave}
                whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                style={{ backgroundColor: "#155DFC", color: "#fff", border: "none", cursor: "pointer" }}
              >
                <Save className="w-4 h-4" strokeWidth={2} /> Guardar cambios
              </motion.button>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Location modal */}
      {showMap && (
        <LocationModal
          warehouse={warehouse}
          items={items}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};

/* ── Main ─────────────────────────────────── */
export const ChoferItemsTable = ({ invoice }: ChoferItemsTableProps) => {
  const { items, invoiceNumber } = invoice;
  const storageKey = `chofer_verified_${invoiceNumber}`;

  const [savedVerified, setSavedVerified] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, false]))
  );
  const [cardKey, setCardKey] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setSavedVerified(Object.fromEntries(items.map((i) => [i.id, parsed[i.id] ?? false])));
        setCardKey(1);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const itemsByWarehouse = useMemo(() =>
    items.reduce((acc: Record<string, InvoiceItem[]>, item) => {
      if (!acc[item.warehouse]) acc[item.warehouse] = [];
      acc[item.warehouse].push(item);
      return acc;
    }, {}),
  [items]);

  const totalVerified = items.filter((i) => savedVerified[i.id]).length;
  const allDone = totalVerified === items.length;
  const totalKg = items.reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);
  const savedKg = items.filter((i) => savedVerified[i.id]).reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);

  const handleCommit = useCallback((patch: Record<string, boolean>) => {
    setSavedVerified((prev) => {
      const next = { ...prev, ...patch };
      try { sessionStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [storageKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3 border-b"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(21,93,252,0.1)", borderColor: "rgba(21,93,252,0.22)" }}
            >
              <PackageOpen className="w-[18px] h-[18px] text-[#155DFC]" />
            </div>
            <div>
              <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
                Detalle del Pedido
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Marca artículos y guarda por almacén
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
            >
              <Weight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-secondary)" }} strokeWidth={2} />
              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                {savedKg.toFixed(1)}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                / {totalKg.toFixed(1)} kg
              </span>
            </div>

            <div className="w-[106px] flex justify-end">
              <AnimatePresence mode="wait" initial={false}>
                {allDone ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: "#16A34A" }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-white">Verificado</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="count"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                      {totalVerified}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      /{items.length} art.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse cards grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(itemsByWarehouse).map(([warehouse, wItems]) => (
          <WarehouseCard
            key={`${warehouse}-${cardKey}`}
            warehouse={warehouse}
            items={wItems as InvoiceItem[]}
            savedVerified={savedVerified}
            onCommit={handleCommit}
          />
        ))}
      </div>
    </motion.div>
  );
};
