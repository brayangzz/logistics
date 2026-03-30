"use client";

import { Truck, User, MapPin, Package, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import type { Order } from "@/features/logistics/models";
import { BlockSelector, BLOCKS } from "./asignar/BlockSelector";
import { AssignmentSummaryCards } from "./asignar/AssignmentSummaryCards";
import { useAssignmentFiltering } from "@/features/logistics/hooks/useAssignmentFiltering";
import type { AssignState, FilterState } from "./asignar/asignar.types";

/* ─── Config ─── */
const ASSIGN_STATE_CFG: Record<AssignState, { label:string; color:string; bg:string; border:string; Icon: React.ElementType }> = {
  Pendiente:  { label:"Pendiente",  color:"#64748B", bg:"rgba(100,116,139,0.10)", border:"rgba(100,116,139,0.25)", Icon: Clock        },
  Asignado:   { label:"Asignado",   color:"#155DFC", bg:"rgba(21,93,252,0.10)",   border:"rgba(21,93,252,0.25)",   Icon: CheckCircle2 },
  "En Ruta":  { label:"En Ruta",    color:"#F59E0B", bg:"rgba(245,158,11,0.10)",  border:"rgba(245,158,11,0.25)",  Icon: Truck        },
  Entregado:  { label:"Entregado",  color:"#10B981", bg:"rgba(16,185,129,0.10)",  border:"rgba(16,185,129,0.25)",  Icon: CheckCircle2 },
};

const AREA_CFG: Record<string, { color:string; bg:string }> = {
  Vidrio:   { color:"#0EA5E9", bg:"rgba(14,165,233,0.12)"  },
  Aluminio: { color:"#818CF8", bg:"rgba(129,140,248,0.12)" },
  Herrajes: { color:"#34D399", bg:"rgba(52,211,153,0.12)"  },
};

const STATE_FILTERS: { value: FilterState; label: string }[] = [
  { value:"Todos",     label:"Todos"     },
  { value:"Pendiente", label:"Pendiente" },
  { value:"Asignado",  label:"Asignado"  },
  { value:"En Ruta",   label:"En Ruta"   },
  { value:"Entregado", label:"Entregado" },
];

const INITIALS_COLORS: Record<string, { color: string; bg: string }> = {
  MH:{ color:"#34D399", bg:"rgba(52,211,153,0.12)"  },
  UD:{ color:"#155DFC", bg:"rgba(21,93,252,0.12)"   },
  AR:{ color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
  VC:{ color:"#22D3EE", bg:"rgba(34,211,238,0.12)"  },
  PB:{ color:"#2DD4BF", bg:"rgba(45,212,191,0.12)"  },
  FV:{ color:"#FB7185", bg:"rgba(251,113,133,0.12)" },
  SA:{ color:"#A3E635", bg:"rgba(163,230,53,0.12)"  },
  VR:{ color:"#38BDF8", bg:"rgba(56,189,248,0.12)"  },
  IP:{ color:"#F472B6", bg:"rgba(244,114,182,0.12)" },
  CG:{ color:"#FBBF24", bg:"rgba(251,191,36,0.12)"  },
};
const getInitialCfg = (i: string) => INITIALS_COLORS[i] ?? { color:"#155DFC", bg:"rgba(21,93,252,0.12)" };

function getAreaBadges(order: Order) {
  const out: string[] = [];
  if (order.areas.aluminio !== "N/A") out.push("Aluminio");
  if (order.areas.vidrio   !== "N/A") out.push("Vidrio");
  if (order.areas.herrajes !== "N/A") out.push("Herrajes");
  return out;
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export const AsignarOrdenesTable = () => {
  const {
    readyOrders, filtered, getAssignment, handleAssign,
    stateFilter, setStateFilter,
    blockFilter, setBlockFilter,
    pendingCount, assignedCount, enRutaCount,
  } = useAssignmentFiltering();

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <AssignmentSummaryCards
        total={readyOrders.length}
        assignedCount={assignedCount}
        pendingCount={pendingCount}
      />

      {/* Toolbar */}
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

      {/* State filter pills */}
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

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-color)" }}>
        {/* Header */}
        <div
          className="hidden lg:grid lg:grid-cols-[2.5fr_2fr_2fr_1.8fr_1.8fr_1.6fr] gap-4 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b"
          style={{ backgroundColor: "var(--table-header-bg)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              const asgn       = getAssignment(order.id);
              const s          = ASSIGN_STATE_CFG[asgn.state];
              const ic         = getInitialCfg(order.clientInitials);
              const blockData  = asgn.assignedBlock ? BLOCKS.find(b => b.id === asgn.assignedBlock) : null;
              const driverData = blockData && asgn.assignedDriver
                ? blockData.drivers.find(d => d.id === asgn.assignedDriver)
                : null;
              const StateIcon  = s.Icon;
              const areas      = getAreaBadges(order);

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group relative flex flex-col lg:grid lg:grid-cols-[2.5fr_2fr_2fr_1.8fr_1.8fr_1.6fr] gap-y-3 gap-x-4 px-6 py-4 lg:py-5 border-b transition-colors duration-150 last:border-b-0"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-row-bg)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-bg)"; }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-r"
                    style={{ backgroundColor: blockData?.color ?? s.color }}
                  />

                  {/* Col 1: Cliente */}
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

                  {/* Col 2: Almacenes */}
                  <div className="flex flex-wrap items-center gap-1.5 lg:py-0">
                    {areas.map(area => (
                      <span
                        key={area}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ backgroundColor: AREA_CFG[area]?.bg ?? "var(--accent-bg)", color: AREA_CFG[area]?.color ?? "var(--text-secondary)" }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Col 3: Bloque */}
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

                  {/* Col 4: Chofer */}
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

                  {/* Col 5: Estado */}
                  <div className="flex items-center lg:justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                      style={{ backgroundColor: s.bg, color: s.color, outline: `1px solid ${s.border}` }}
                    >
                      <StateIcon className="w-3 h-3 shrink-0" />
                      {s.label}
                    </span>
                  </div>

                  {/* Col 6: Asignar */}
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
