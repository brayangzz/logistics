"use client";

import {
  Truck, User,
  CheckCircle2, Clock, Package,
  ChevronDown, X, MapPin, Users, Check, Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import { useOrders, isReadyForRoute } from "@/lib/OrdersContext";
import type { Order } from "@/features/logistics/models";

/* ─────────────────────────── Types ─────────────────────────── */
type AssignState = "Asignado" | "Pendiente" | "En Ruta" | "Entregado";

interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  color: string;
  bg: string;
}

interface Block {
  id: string;
  name: string;
  zone: string;
  color: string;
  bg: string;
  border: string;
  drivers: Driver[];
}

interface LocalAssignment {
  state: AssignState;
  assignedBlock?: string;
  assignedDriver?: string;
}

/* ─────────────────────────── Mock Data ─────────────────────────── */
const BLOCKS: Block[] = [
  {
    id: "b1",
    name: "Bloque Norte",
    zone: "Escobedo · García · Salinas",
    color: "#155DFC",
    bg: "rgba(21,93,252,0.10)",
    border: "rgba(21,93,252,0.25)",
    drivers: [
      { id:"d1", name:"Carlos Mendoza",   initials:"CM", phone:"81 2345 6789", color:"#155DFC", bg:"rgba(21,93,252,0.12)" },
      { id:"d2", name:"Roberto Salinas",  initials:"RS", phone:"81 3456 7890", color:"#3B82F6", bg:"rgba(59,130,246,0.12)" },
      { id:"d3", name:"Miguel Torres",    initials:"MT", phone:"81 4567 8901", color:"#60A5FA", bg:"rgba(96,165,250,0.12)" },
    ],
  },
  {
    id: "b2",
    name: "Bloque Sur",
    zone: "Guadalupe · Cadereyta · Allende",
    color: "#10B981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.25)",
    drivers: [
      { id:"d4", name:"Fernando Vega",    initials:"FV", phone:"81 5678 9012", color:"#10B981", bg:"rgba(16,185,129,0.12)" },
      { id:"d5", name:"Alejandro Ruiz",   initials:"AR", phone:"81 6789 0123", color:"#34D399", bg:"rgba(52,211,153,0.12)" },
    ],
  },
  {
    id: "b3",
    name: "Bloque Centro",
    zone: "MTY Centro · San Nicolás · Apodaca",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    drivers: [
      { id:"d6", name:"Javier Morales",   initials:"JM", phone:"81 7890 1234", color:"#F59E0B", bg:"rgba(245,158,11,0.12)" },
      { id:"d7", name:"Luis Hernández",   initials:"LH", phone:"81 8901 2345", color:"#FBBF24", bg:"rgba(251,191,36,0.12)" },
      { id:"d8", name:"Pedro Castro",     initials:"PC", phone:"81 9012 3456", color:"#D97706", bg:"rgba(217,119,6,0.12)"  },
    ],
  },
  {
    id: "b4",
    name: "Bloque Poniente",
    zone: "San Pedro · Santa Catarina · Monterrey Ote",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.10)",
    border: "rgba(139,92,246,0.25)",
    drivers: [
      { id:"d9",  name:"Ernesto Gómez",   initials:"EG", phone:"81 0123 4567", color:"#8B5CF6", bg:"rgba(139,92,246,0.12)" },
      { id:"d10", name:"Samuel Díaz",     initials:"SD", phone:"81 1234 5678", color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
    ],
  },
];

/* ─────────────────────────── Config ─────────────────────────── */
const ASSIGN_STATE_CFG: Record<AssignState, { label:string; color:string; bg:string; border:string; Icon: React.ElementType }> = {
  Pendiente:  { label:"Pendiente",  color:"#64748B", bg:"rgba(100,116,139,0.10)", border:"rgba(100,116,139,0.25)", Icon: Clock          },
  Asignado:   { label:"Asignado",   color:"#155DFC", bg:"rgba(21,93,252,0.10)",   border:"rgba(21,93,252,0.25)",   Icon: CheckCircle2   },
  "En Ruta":  { label:"En Ruta",    color:"#F59E0B", bg:"rgba(245,158,11,0.10)",  border:"rgba(245,158,11,0.25)",  Icon: Truck          },
  Entregado:  { label:"Entregado",  color:"#10B981", bg:"rgba(16,185,129,0.10)",  border:"rgba(16,185,129,0.25)",  Icon: CheckCircle2   },
};

const AREA_CFG: Record<string, { color:string; bg:string }> = {
  Vidrio:   { color:"#0EA5E9", bg:"rgba(14,165,233,0.12)" },
  Aluminio: { color:"#818CF8", bg:"rgba(129,140,248,0.12)" },
  Herrajes: { color:"#34D399", bg:"rgba(52,211,153,0.12)" },
};

type FilterState = AssignState | "Todos";

const STATE_FILTERS: { value: FilterState; label: string }[] = [
  { value:"Todos",     label:"Todos"     },
  { value:"Pendiente", label:"Pendiente" },
  { value:"Asignado",  label:"Asignado"  },
  { value:"En Ruta",   label:"En Ruta"   },
  { value:"Entregado", label:"Entregado" },
];

/* ─────────────────────────── Block Selector Dropdown ─────────────────────────── */
interface BlockSelectorProps {
  orderId: string;
  currentBlock?: string;
  currentDriver?: string;
  onAssign: (orderId: string, blockId: string, driverId: string) => void;
}

const BlockSelector = ({ orderId, currentBlock, currentDriver, onAssign }: BlockSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(
    currentBlock ? (BLOCKS.find(b => b.id === currentBlock) ?? null) : null
  );
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    if (!selectedBlock) return;
    setSaving(true);
    setTimeout(() => {
      onAssign(orderId, selectedBlock.id, driver.id);
      setSaving(false);
      setOpen(false);
    }, 600);
  };

  const blockData = currentBlock ? BLOCKS.find(b => b.id === currentBlock) : null;
  const driverData = blockData && currentDriver
    ? blockData.drivers.find(d => d.id === currentDriver)
    : null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/30"
        style={{
          backgroundColor: blockData ? blockData.bg : "var(--bg-input)",
          borderColor: blockData ? blockData.border : "var(--border-color)",
          color: blockData ? blockData.color : "var(--text-muted)",
        }}
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : blockData ? (
          <MapPin className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Truck className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="whitespace-nowrap max-w-[100px] truncate">
          {driverData ? driverData.name.split(" ")[0] : blockData ? blockData.name : "Asignar"}
        </span>
        {blockData && driverData && (
          <span className="hidden sm:block text-[9px] opacity-70 font-mono">
            {driverData.initials}
          </span>
        )}
        <ChevronDown
          className="w-3 h-3 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--dropdown-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--dropdown-shadow)",
              width: "clamp(280px, 90vw, 360px)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#155DFC] to-blue-700 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                  Asignar Bloque & Chofer
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-muted)" }}>
                  1. Selecciona un bloque
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BLOCKS.map(block => {
                    const isSelected = selectedBlock?.id === block.id;
                    return (
                      <button
                        key={block.id}
                        onClick={() => setSelectedBlock(block)}
                        className="relative text-left p-2.5 rounded-xl border transition-all duration-150 focus:outline-none group"
                        style={{
                          backgroundColor: isSelected ? block.bg : "transparent",
                          borderColor: isSelected ? block.border : "var(--border-color)",
                        }}
                      >
                        {!isSelected && (
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: block.bg + "60" }}
                          />
                        )}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-0.5">
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: isSelected ? block.color : "var(--text-primary)" }}
                            >
                              {block.name}
                            </span>
                            {isSelected && <Check className="w-3 h-3" style={{ color: block.color }} />}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" style={{ color: "var(--text-muted)" }} />
                            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                              {block.drivers.length} choferes
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedBlock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t pt-3" style={{ borderColor: "var(--border-color)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-muted)" }}>
                        2. Selecciona un chofer — <span style={{ color: selectedBlock.color }}>{selectedBlock.name}</span>
                      </p>
                      <div className="space-y-1">
                        {selectedBlock.drivers.map(driver => {
                          const isCurrent = driver.id === currentDriver && selectedBlock.id === currentBlock;
                          return (
                            <button
                              key={driver.id}
                              onClick={() => handleDriverSelect(driver)}
                              disabled={saving}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-150 focus:outline-none group text-left disabled:opacity-50"
                              style={{
                                backgroundColor: isCurrent ? selectedBlock.bg : "transparent",
                                borderColor: isCurrent ? selectedBlock.border : "var(--border-color)",
                              }}
                              onMouseEnter={e => {
                                if (!isCurrent) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                              }}
                              onMouseLeave={e => {
                                if (!isCurrent) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ backgroundColor: driver.bg, color: driver.color, outline: `1px solid ${driver.color}30` }}
                              >
                                {driver.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                  {driver.name}
                                </p>
                                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                  {driver.phone}
                                </p>
                              </div>
                              {isCurrent ? (
                                <Check className="w-4 h-4 shrink-0" style={{ color: selectedBlock.color }} />
                              ) : (
                                <div
                                  className="w-6 h-6 rounded-lg border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ borderColor: selectedBlock.border, backgroundColor: selectedBlock.bg }}
                                >
                                  <Check className="w-3 h-3" style={{ color: selectedBlock.color }} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedBlock && (
                <p className="text-center text-xs py-2" style={{ color: "var(--text-muted)" }}>
                  Selecciona un bloque para ver sus choferes disponibles
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── helpers ─── */
function getAreaBadges(order: Order) {
  const out: string[] = [];
  if (order.areas.aluminio !== "N/A") out.push("Aluminio");
  if (order.areas.vidrio   !== "N/A") out.push("Vidrio");
  if (order.areas.herrajes !== "N/A") out.push("Herrajes");
  return out;
}

const INITIALS_COLORS: Record<string, { color: string; bg: string }> = {
  MH:{ color:"#34D399",  bg:"rgba(52,211,153,0.12)"  },
  UD:{ color:"#155DFC",  bg:"rgba(21,93,252,0.12)"   },
  AR:{ color:"#A78BFA",  bg:"rgba(167,139,250,0.12)" },
  VC:{ color:"#22D3EE",  bg:"rgba(34,211,238,0.12)"  },
  PB:{ color:"#2DD4BF",  bg:"rgba(45,212,191,0.12)"  },
  FV:{ color:"#FB7185",  bg:"rgba(251,113,133,0.12)" },
  SA:{ color:"#A3E635",  bg:"rgba(163,230,53,0.12)"  },
  VR:{ color:"#38BDF8",  bg:"rgba(56,189,248,0.12)"  },
  IP:{ color:"#F472B6",  bg:"rgba(244,114,182,0.12)" },
  CG:{ color:"#FBBF24",  bg:"rgba(251,191,36,0.12)"  },
};
const getInitialCfg = (i: string) => INITIALS_COLORS[i] ?? { color:"#155DFC", bg:"rgba(21,93,252,0.12)" };

/* ─────────────────────────── Main Component ─────────────────────────── */
export const AsignarOrdenesTable = () => {
  const { orders: allOrders } = useOrders();

  // Ready-for-route, non-urgent orders from shared context
  const readyOrders = useMemo(
    () => allOrders.filter(o => isReadyForRoute(o) && !o.isUrgent),
    [allOrders]
  );

  // Local assignment state (block/driver/status per order)
  const [assignments, setAssignments] = useState<Record<string, LocalAssignment>>({});

  const getAssignment = (id: string): LocalAssignment =>
    assignments[id] ?? { state: "Pendiente" };

  const handleAssign = (orderId: string, blockId: string, driverId: string) => {
    setAssignments(prev => ({
      ...prev,
      [orderId]: { state: "Asignado", assignedBlock: blockId, assignedDriver: driverId },
    }));
  };

  const [stateFilter, setStateFilter] = useState<FilterState>("Todos");
  const [blockFilter, setBlockFilter] = useState<string>("Todos");

  const filtered = useMemo(() => {
    let list = readyOrders;
    if (stateFilter !== "Todos")
      list = list.filter(o => getAssignment(o.id).state === stateFilter);
    if (blockFilter !== "Todos")
      list = list.filter(o => getAssignment(o.id).assignedBlock === blockFilter);
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyOrders, stateFilter, blockFilter, assignments]);

  const pendingCount  = readyOrders.filter(o => getAssignment(o.id).state === "Pendiente").length;
  const assignedCount = readyOrders.filter(o => getAssignment(o.id).state === "Asignado").length;
  const enRutaCount   = readyOrders.filter(o => getAssignment(o.id).state === "En Ruta").length;

  return (
    <div className="space-y-4">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {([
          { label:"Listos para ruta", value: readyOrders.length, color:"#10B981", bg:"rgba(16,185,129,0.10)", border:"rgba(16,185,129,0.22)", Icon: CheckCircle2 },
          { label:"Asignados",        value: assignedCount,      color:"#155DFC", bg:"rgba(21,93,252,0.10)",   border:"rgba(21,93,252,0.22)",   Icon: Truck        },
          { label:"Pendientes",       value: pendingCount,       color:"#64748B", bg:"rgba(100,116,139,0.10)", border:"rgba(100,116,139,0.22)", Icon: Clock        },
        ] as const).map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl border"
            style={{ backgroundColor: card.bg, borderColor: card.border }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: card.bg, outline: `1px solid ${card.border}` }}
            >
              <card.Icon className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <div>
              <p className="text-xl font-extrabold leading-none" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--text-muted)" }}>
                {card.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <div className="relative">
          <select
            value={blockFilter}
            onChange={e => setBlockFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#155DFC]/35 transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--bg-input)",
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <option value="Todos">Todos los bloques</option>
            {BLOCKS.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
        </div>

      </div>

      {/* ── State filter pills ── */}
      <div
        className="flex flex-wrap gap-1 p-1.5 rounded-xl border w-full sm:w-max"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        {STATE_FILTERS.map(f => {
          const isActive = stateFilter === f.value;
          const cfg = f.value !== "Todos" ? ASSIGN_STATE_CFG[f.value as AssignState] : null;
          return (
            <button
              key={f.value}
              onClick={() => setStateFilter(f.value)}
              className="relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 focus:outline-none"
              style={{ color: isActive ? (cfg?.color ?? "#155DFC") : "var(--text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="assign-state-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: cfg?.bg ?? "var(--accent-bg)", outline: `1px solid ${cfg?.border ?? "var(--accent-border)"}` }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "var(--select-option-hover)" }}
                  aria-hidden
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
        {/* Header */}
        <div
          className="hidden lg:grid lg:grid-cols-[2.5fr_2fr_2fr_1.8fr_1.8fr_1.6fr] gap-4 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b"
          style={{
            backgroundColor: "var(--table-header-bg)",
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <div>Factura / Cliente</div>
          <div>Almacenes</div>
          <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bloque</div>
          <div className="flex items-center gap-1"><User className="w-3 h-3" /> Chofer</div>
          <div className="text-center">Estado</div>
          <div className="text-right">Asignar</div>
        </div>

        {/* Rows */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Package className="w-10 h-10 mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
              <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>Sin pedidos listos</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Los pedidos aparecerán aquí cuando los 3 almacenes estén en Listo
              </p>
            </motion.div>
          ) : (
            filtered.map((order, i) => {
              const asgn = getAssignment(order.id);
              const s = ASSIGN_STATE_CFG[asgn.state];
              const ic = getInitialCfg(order.clientInitials);
              const blockData = asgn.assignedBlock ? BLOCKS.find(b => b.id === asgn.assignedBlock) : null;
              const driverData = blockData && asgn.assignedDriver
                ? blockData.drivers.find(d => d.id === asgn.assignedDriver)
                : null;
              const StateIcon = s.Icon;
              const areas = getAreaBadges(order);

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group relative flex flex-col lg:grid lg:grid-cols-[2.5fr_2fr_2fr_1.8fr_1.8fr_1.6fr] gap-y-3 gap-x-4 px-6 py-4 lg:py-5 border-b transition-colors duration-150 last:border-b-0"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--table-row-bg)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-bg)"; }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r"
                    style={{ backgroundColor: blockData?.color ?? s.color }}
                  />

                  {/* ── Col 1: Cliente ── */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: ic.bg, color: ic.color, outline: `1px solid ${ic.color}30` }}
                    >
                      {order.clientInitials}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-sm truncate block" style={{ color: "var(--text-primary)" }}>
                        {order.clientName}
                      </span>
                      <span className="text-[11px] font-mono mt-0.5 block" style={{ color: "var(--text-muted)" }}>
                        {order.invoiceNumber}
                      </span>
                    </div>
                  </div>

                  {/* ── Col 2: Almacenes ── */}
                  <div className="flex flex-wrap items-center gap-1.5 lg:py-0">
                    {areas.map(area => (
                      <span
                        key={area}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{
                          backgroundColor: AREA_CFG[area]?.bg ?? "var(--accent-bg)",
                          color: AREA_CFG[area]?.color ?? "var(--text-secondary)",
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* ── Col 3: Bloque ── */}
                  <div className="flex items-center">
                    {blockData ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                        style={{ backgroundColor: blockData.bg, color: blockData.color, outline: `1px solid ${blockData.border}` }}
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        {blockData.name}
                      </span>
                    ) : (
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>— Sin bloque</span>
                    )}
                  </div>

                  {/* ── Col 4: Chofer ── */}
                  <div className="flex items-center">
                    {driverData ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: driverData.bg, color: driverData.color }}
                        >
                          {driverData.initials}
                        </div>
                        <span className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>
                          {driverData.name.split(" ")[0]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>— Sin asignar</span>
                    )}
                  </div>

                  {/* ── Col 5: Estado ── */}
                  <div className="flex items-center lg:justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                      style={{ backgroundColor: s.bg, color: s.color, outline: `1px solid ${s.border}` }}
                    >
                      <StateIcon className="w-3 h-3 shrink-0" />
                      {s.label}
                    </span>
                  </div>

                  {/* ── Col 6: Assign button ── */}
                  <div className="flex items-center lg:justify-end">
                    <BlockSelector
                      orderId={order.id}
                      currentBlock={asgn.assignedBlock}
                      currentDriver={asgn.assignedDriver}
                      onAssign={handleAssign}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t flex items-center justify-between flex-wrap gap-2"
          style={{ backgroundColor: "var(--footer-bg)", borderColor: "var(--border-color)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Mostrando{" "}
            <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong>
            {" "}de{" "}
            <strong style={{ color: "var(--text-primary)" }}>{readyOrders.length}</strong>
            {" "}pedidos listos
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "#155DFC" }}>{assignedCount + enRutaCount}</strong> asignados ·{" "}
            <strong style={{ color: "#64748B" }}>{pendingCount}</strong> pendientes
          </span>
        </div>
      </div>
    </div>
  );
};
