"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search, MapPin, ChevronDown, Check, Map as MapIcon,
  Pencil, Package, UserPlus, X, Route, Weight, Calendar,
  CheckCircle2, TrendingUp, Warehouse, Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────── */
type AssignState = "Asignado" | "Pendiente";
type SortKey     = "fecha" | "factura" | "cliente" | "peso";
type ViewMode    = "activos" | "anticipados";
type FilterState = AssignState | "Todos";

interface Driver { id: string; name: string; initials: string }
interface Block  { id: string; name: string; shortName: string; drivers: Driver[] }
interface InvoiceOrder {
  id: string; invoiceNumber: string; clientName: string;
  clientInitials: string; clientAddress: string; totalWeight: number;
  assignedBlock: string; assignedDriver?: string; state: AssignState;
  date: string; warehouses: string[];
  anticipated?: boolean; anticipatedDone?: number;
}
interface ToastData { id: number; invoice: string; driverName: string }

/* ─── Data ───────────────────────────────── */
const BLOCKS: Block[] = [
  { id:"b1", name:"Bloque Norte",    shortName:"Norte",
    drivers:[{id:"d1",name:"Carlos Mendoza",initials:"CM"},{id:"d2",name:"Roberto Salinas",initials:"RS"}] },
  { id:"b2", name:"Bloque Sur",      shortName:"Sur",
    drivers:[{id:"d4",name:"Fernando Vega",initials:"FV"},{id:"d5",name:"Alejandro Ruiz",initials:"AR"}] },
  { id:"b3", name:"Bloque Centro",   shortName:"Centro",
    drivers:[{id:"d6",name:"Javier Morales",initials:"JM"},{id:"d8",name:"Pedro Castro",initials:"PC"}] },
  { id:"b4", name:"Bloque Poniente", shortName:"Poniente",
    drivers:[{id:"d9",name:"Ernesto Gómez",initials:"EG"},{id:"d10",name:"Samuel Díaz",initials:"SD"}] },
];

const MOCK_ORDERS: InvoiceOrder[] = [
  { id:"o1",  invoiceNumber:"#2401", clientName:"Cristales Monterrey",       clientInitials:"CM", clientAddress:"Blvd. Escobedo 1420, Escobedo",      totalWeight:250.5, state:"Pendiente", assignedBlock:"b1", date:"18/03", warehouses:["Vidrio","Herrajes"] },
  { id:"o2",  invoiceNumber:"#2402", clientName:"Aluminios del Norte",        clientInitials:"AN", clientAddress:"Av. el Roble 554, San Nicolás",       totalWeight:180.2, state:"Pendiente", assignedBlock:"b3", date:"18/03", warehouses:["Aluminio","Herrajes"],          anticipated:true, anticipatedDone:1 },
  { id:"o3",  invoiceNumber:"#2403", clientName:"Fachadas de Vidrio MTY",     clientInitials:"FV", clientAddress:"Calz. del Valle 320, San Pedro",      totalWeight:310.8, state:"Asignado",  assignedBlock:"b4", date:"19/03", warehouses:["Aluminio","Vidrio","Herrajes"], assignedDriver:"d9" },
  { id:"o5",  invoiceNumber:"#2405", clientName:"Metalúrgica Vidal",          clientInitials:"MV", clientAddress:"Periférico Norte 4501, García",       totalWeight:420.0, state:"Pendiente", assignedBlock:"b1", date:"19/03", warehouses:["Aluminio","Herrajes"],          anticipated:true, anticipatedDone:2 },
  { id:"o6",  invoiceNumber:"#2406", clientName:"Vidrios Regios del Noreste", clientInitials:"VR", clientAddress:"Av. Morones Prieto 2907, MTY",        totalWeight:295.4, state:"Asignado",  assignedBlock:"b3", date:"20/03", warehouses:["Vidrio","Herrajes"],            assignedDriver:"d8" },
  { id:"o7",  invoiceNumber:"#2407", clientName:"Importadora Perfiles SA",    clientInitials:"IP", clientAddress:"Carretera Allende 2100, Cadereyta",   totalWeight:375.1, state:"Pendiente", assignedBlock:"b2", date:"20/03", warehouses:["Aluminio","Vidrio","Herrajes"], anticipated:true, anticipatedDone:2 },
  { id:"o8",  invoiceNumber:"#2408", clientName:"Sistemas de Aluminio Regio", clientInitials:"SA", clientAddress:"Av. Universidad 501, Santa Catarina", totalWeight:215.6, state:"Asignado",  assignedBlock:"b4", date:"21/03", warehouses:["Aluminio","Herrajes"],          assignedDriver:"d10" },
  { id:"o9",  invoiceNumber:"#2409", clientName:"Construcciones EB",          clientInitials:"EB", clientAddress:"Blvd. Díaz Ordaz 220, MTY",           totalWeight:198.3, state:"Pendiente", assignedBlock:"b3", date:"21/03", warehouses:["Aluminio","Vidrio","Herrajes"] },
];

const STATE_CFG: Record<AssignState,{label:string;color:string;bg:string;border:string}> = {
  Pendiente: { label:"Pendiente", color:"#EF4444", bg:"rgba(239,68,68,0.1)",  border:"rgba(239,68,68,0.18)"  },
  Asignado:  { label:"Asignado",  color:"#10B981", bg:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.18)" },
};

const FILTERS: {key:FilterState;label:string;dot:string|null}[] = [
  { key:"Todos",     label:"Todos",     dot:null      },
  { key:"Pendiente", label:"Pendiente", dot:"#EF4444" },
  { key:"Asignado",  label:"Asignado",  dot:"#10B981" },
];


const AVATAR: Record<string,string> = {
  CM:"bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30",
  AN:"bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
  FV:"bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30",
  MV:"bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30",
  VR:"bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
  IP:"bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30",
  SA:"bg-lime-500/10 text-lime-500 ring-1 ring-lime-500/30",
  EB:"bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30",
  RS:"bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30",
  AR:"bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
  JM:"bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/30",
  PC:"bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30",
  EG:"bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30",
  SD:"bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30",
};
const av = (i:string) => AVATAR[i] ?? "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/30";

const SPRING = { type:"spring" as const, stiffness:320, damping:36, mass:0.8 };

/* ─── Toast individual ───────────────────── */
const Toast = ({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) => {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3200);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:16, scale:0.95 }}
      animate={{ opacity:1, y:0,  scale:1    }}
      exit={{    opacity:0, y:8,  scale:0.96, transition:{ duration:0.18 } }}
      transition={{ ...SPRING }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl cursor-pointer select-none"
      style={{
        backgroundColor:"var(--bg-secondary)",
        border:"1px solid rgba(16,185,129,0.3)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(16,185,129,0.15)",
        minWidth: 260,
        maxWidth: 340,
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor:"rgba(16,185,129,0.15)" }}>
        <CheckCircle2 className="w-4.5 h-4.5" style={{ color:"#10B981" }} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight" style={{ color:"var(--text-primary)" }}>
          Chofer asignado
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color:"var(--text-muted)" }}>
          {toast.invoice} → {toast.driverName}
        </p>
      </div>
      <X className="w-3.5 h-3.5 shrink-0" style={{ color:"var(--text-muted)" }} strokeWidth={2} />
    </motion.div>
  );
};

/* ─── Toast container (portal-like, fixed) ── */
const ToastContainer = ({ toasts, onDismiss }:
  { toasts: ToastData[]; onDismiss: (id: number) => void }) => (
  <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto z-[9999] flex flex-col gap-2 items-stretch sm:items-end pointer-events-none">
    <AnimatePresence mode="sync">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);


/* ─── DriverOption ───────────────────────── */
const DriverOption = ({ driver, isSelected, index, onSelect }:
  { driver:Driver; isSelected:boolean; index:number; onSelect:()=>void }) => {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      initial={{ opacity:0, y:4 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.05, duration:0.18, ease:[0.22,1,0.36,1] }}
      whileTap={{ scale:0.98 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left"
      style={{
        backgroundColor: isSelected ? "var(--accent-bg)" : hov ? "var(--select-option-hover)" : "transparent",
        transition:"background-color 0.12s",
      }}
    >
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0", av(driver.initials))}>
        {driver.initials}
      </div>
      <span className="text-[15px] font-medium flex-1 truncate" style={{ color:"var(--text-primary)" }}>
        {driver.name}
      </span>
      <AnimatePresence>
        {isSelected && (
          <motion.div initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
            transition={{ type:"spring", stiffness:400, damping:22 }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor:"var(--accent)" }}>
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

/* ─── InvoiceCard ────────────────────────── */
const InvoiceCard = ({ order, onAssign, onToast, index }:
  { order:InvoiceOrder; onAssign:(id:string,dId:string)=>void; onToast:(inv:string,name:string)=>void; index:number }) => {

  const s     = STATE_CFG[order.state];
  const block = BLOCKS.find(b => b.id === order.assignedBlock)!;
  const saved = block.drivers.find(d => d.id === order.assignedDriver);

  const [pendingId, setPendingId] = useState<string|null>(null);
  const [open,      setOpen]      = useState(false);
  const [hovered,   setHovered]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pending    = pendingId ? block.drivers.find(d => d.id === pendingId) : null;
  const handleSave = () => {
    if (pendingId && pending) {
      onAssign(order.id, pendingId);
      onToast(order.invoiceNumber, pending.name);
      setPendingId(null);
    }
  };

  const stage: "empty"|"pending"|"saved" = pending ? "pending" : saved ? "saved" : "empty";
  const totalW = order.warehouses.length;
  const doneW  = order.anticipatedDone ?? 0;
  const pct    = totalW > 0 ? Math.round((doneW/totalW)*100) : 0;
  const assignH = stage === "pending" ? 130 : 60;

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.96, transition:{ duration:0.15, ease:[0.4,0,1,1] } }}
      transition={{
        opacity: { duration:0.22, ease:"easeOut" },
        y:       { ...SPRING, delay: index * 0.04 },
        delay:   index * 0.04,
      }}
      whileHover={open ? {} : { y:-3, transition:{ ...SPRING } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col"
      style={{
        position:"relative", zIndex: open ? 40 : 1,
        backgroundColor:"var(--bg-secondary)",
        borderRadius: 24,
        borderTop:`3px solid ${s.color}`,
        borderLeft:`1px solid ${hovered ? s.color+"55" : "var(--border-color)"}`,
        borderRight:`1px solid ${hovered ? s.color+"55" : "var(--border-color)"}`,
        borderBottom:`1px solid ${hovered ? s.color+"55" : "var(--border-color)"}`,
        boxShadow: hovered
          ? `0 0 0 3px ${s.color}18, 0 16px 48px rgba(0,0,0,0.2)`
          : "0 2px 12px rgba(0,0,0,0.1)",
        transition:"border-color 0.2s ease, box-shadow 0.2s ease",
        overflow:"visible",
      }}
    >
      <div style={{ padding:24, display:"flex", flexDirection:"column", gap:18 }}>

        {/* ── Row 1: Factura + estado ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[22px] font-extrabold tracking-tight leading-none" style={{ color:"var(--text-primary)" }}>
              {order.invoiceNumber}
            </span>
            {order.anticipated && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                style={{ backgroundColor:"#F59E0B", color:"#fff" }}>
                Anticipado
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
            style={{ backgroundColor:s.bg, border:`1px solid ${s.border}` }}>
            {order.state === "Pendiente" ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full opacity-50" style={{ backgroundColor:s.color }} />
                <span className="relative h-2 w-2 rounded-full" style={{ backgroundColor:s.color }} />
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor:s.color }} />
            )}
            <span className="text-[11px] font-bold leading-none" style={{ color:s.color }}>{s.label}</span>
          </div>
        </div>

        {/* ── Row 2: Cliente ── */}
        <div className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ backgroundColor:"var(--bg-tertiary)", border:"1px solid var(--border-color)" }}>
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-extrabold shrink-0", av(order.clientInitials))}>
            {order.clientInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold leading-tight truncate" style={{ color:"var(--text-primary)" }}>
              {order.clientName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 shrink-0" style={{ color:"#155DFC" }} strokeWidth={2.5} />
              <p className="text-[12px] truncate" style={{ color:"var(--text-secondary)" }}>{order.clientAddress}</p>
            </div>
          </div>
        </div>

        {/* ── Row 3: Meta grid ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon:<Route    className="w-4 h-4" strokeWidth={2}/>, label:"Bloque", value:block.shortName, color:"#155DFC" },
            { icon:<Weight   className="w-4 h-4" strokeWidth={2}/>, label:"Peso",   value:`${order.totalWeight} kg`, color:"#8B5CF6" },
            { icon:<Calendar className="w-4 h-4" strokeWidth={2}/>, label:"Fecha",  value:order.date, color:"#F59E0B" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border"
              style={{ backgroundColor:"var(--bg-tertiary)", borderColor:"var(--border-color)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor:color+"18" }}>
                {React.cloneElement(icon, { style:{ color } })}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color:"var(--text-secondary)" }}>{label}</span>
              <span className="text-[13px] font-extrabold leading-none" style={{ color:"var(--text-primary)" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Row 4: Almacenes ── */}
        <div className="flex flex-col gap-2.5">
          <div className="grid gap-2" style={{ gridTemplateColumns:`repeat(${order.warehouses.length}, 1fr)` }}>
            {order.warehouses.map(w => (
              <div key={w}
                className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl border text-center"
                style={{ backgroundColor:"var(--bg-tertiary)", borderColor:"var(--border-color)" }}>
                <Warehouse className="w-4 h-4 shrink-0" style={{ color:"#155DFC" }} strokeWidth={2} />
                <span className="text-[11px] font-bold leading-tight" style={{ color:"var(--text-primary)" }}>{w}</span>
              </div>
            ))}
          </div>

          {/* Barra de progreso anticipados */}
          {order.anticipated && (
            <div className="flex flex-col gap-2 px-3 py-2.5 rounded-xl"
              style={{ backgroundColor:"var(--bg-tertiary)", border:"1px solid var(--border-color)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold" style={{ color:"var(--text-secondary)" }}>Preparación</span>
                <span className="text-[11px] font-extrabold tabular-nums"
                  style={{ color: pct===100 ? "#10B981" : "#3B82F6" }}>{doneW}/{totalW}</span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor:"var(--border-color)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: pct===100 ? "#10B981" : "#3B82F6" }}
                  initial={{ width:0 }} animate={{ width:`${pct}%` }}
                  transition={{ duration:0.6, ease:[0.25,0.46,0.45,0.94], delay:0.1 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Separador ── */}
        <div style={{ height:1, margin:"0 -24px", backgroundColor:"var(--border-color)" }} />

        {/* ── Row 5: Asignación ── */}
        <div className="relative" ref={ref}
          style={{ height: assignH, transition:"height 0.22s cubic-bezier(0.4,0,0.2,1)", overflow:"visible" }}>
          <AnimatePresence mode="sync" initial={false}>

            {stage === "empty" && (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.12 }} className="absolute inset-x-0 top-0">
                <button onClick={() => setOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 rounded-2xl text-[13px] font-bold focus:outline-none"
                  style={{
                    height: 52,
                    backgroundColor: open ? "#155DFC" : "var(--bg-tertiary)",
                    border:`1px solid ${open ? "#155DFC" : "var(--border-color)"}`,
                    color: open ? "#fff" : "var(--text-primary)",
                    transition:"all 0.15s",
                  }}>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span>Asignar chofer</span>
                  </div>
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.2, ease:[0.4,0,0.2,1] }}>
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </motion.div>
                </button>
              </motion.div>
            )}

            {stage === "pending" && pending && (
              <motion.div key="pending" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.12 }} className="absolute inset-x-0 top-0 flex flex-col" style={{ gap:14 }}>
                <div className="flex items-center gap-3 px-4 rounded-2xl"
                  style={{ height:54, backgroundColor:"var(--bg-tertiary)", border:"2px solid #F59E0B" }}>
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0", av(pending.initials))}>
                    {pending.initials}
                  </div>
                  <span className="text-[13px] font-bold flex-1 truncate" style={{ color:"var(--text-primary)" }}>
                    {pending.name}
                  </span>
                  <span className="text-[10px] font-bold shrink-0 px-2 py-0.5 rounded-md"
                    style={{ backgroundColor:"#F59E0B", color:"#fff" }}>
                    Sin guardar
                  </span>
                </div>
                <div className="flex gap-2.5" style={{ height:48 }}>
                  <motion.button whileHover={{ filter:"brightness(1.1)" }} whileTap={{ scale:0.97 }}
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl text-[13px] font-bold text-white"
                    style={{ backgroundColor:"#059669" }}>
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    Guardar
                  </motion.button>
                  <motion.button whileTap={{ scale:0.97 }}
                    onClick={() => { setPendingId(null); setOpen(false); }}
                    className="flex items-center justify-center rounded-2xl shrink-0"
                    style={{ width:48, backgroundColor:"var(--bg-tertiary)", border:"1px solid var(--border-color)", color:"var(--text-secondary)" }}>
                    <X className="w-4 h-4" strokeWidth={2} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {stage === "saved" && saved && (
              <motion.div key="saved" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.12 }} className="absolute inset-x-0 top-0">
                <div className="flex items-center gap-3 px-4 rounded-2xl"
                  style={{ height:60, backgroundColor:"var(--bg-tertiary)", border:"1px solid var(--border-color)" }}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-extrabold shrink-0", av(saved.initials))}>
                    {saved.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-bold leading-tight block truncate" style={{ color:"var(--text-primary)" }}>
                      {saved.name}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Truck className="w-3 h-3 shrink-0" style={{ color:"#10B981" }} strokeWidth={2.5} />
                      <span className="text-[11px] font-semibold" style={{ color:"#10B981" }}>Asignado</span>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                    onClick={() => setOpen(v => !v)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                    style={{
                      backgroundColor: open ? "#155DFC" : "var(--bg-secondary)",
                      border:"1px solid var(--border-color)",
                      color: open ? "#fff" : "#155DFC",
                      transition:"all 0.15s",
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
                initial={{ opacity:0, y:-6, scale:0.97 }}
                animate={{ opacity:1, y:0,  scale:1    }}
                exit={{    opacity:0, y:-6,  scale:0.97 }}
                transition={{ ...SPRING }}
                className="absolute left-0 right-0 top-full mt-3 z-[500] rounded-2xl overflow-hidden"
                style={{
                  backgroundColor:"var(--bg-secondary)",
                  border:"1px solid var(--border-hover)",
                  boxShadow:"0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)",
                }}>
                <div className="px-4 py-2.5 flex items-center gap-2 border-b" style={{ borderColor:"var(--border-color)" }}>
                  <Package className="w-3.5 h-3.5" style={{ color:"#155DFC" }} strokeWidth={2} />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color:"var(--text-secondary)" }}>{block.name}</span>
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

      </div>
    </motion.div>
  );
};

/* ─── Page ───────────────────────────────── */
export default function AsignarPage() {
  const [orders,        setOrders]        = useState<InvoiceOrder[]>(MOCK_ORDERS);
  const [search,        setSearch]        = useState("");
  const [filterState,   setFilterState]   = useState<FilterState>("Todos");
  const [sortKey] = useState<SortKey>("fecha");
  const [viewMode,      setViewMode]      = useState<ViewMode>("activos");
  const [searchFocused, setSearchFocused] = useState(false);
  const [toasts,        setToasts]        = useState<ToastData[]>([]);
  const toastCounter = useRef(0);

  const handleAssign = useCallback((orderId:string, driverId:string) =>
    setOrders(prev => prev.map(o => o.id===orderId ? {...o, assignedDriver:driverId, state:"Asignado"} : o))
  , []);

  const handleToast = useCallback((invoice: string, driverName: string) => {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, invoice, driverName }]);
  }, []);

  const dismissToast = useCallback((id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id))
  , []);

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setFilterState("Todos");
    setSearch("");
  };

  const activos    = useMemo(() => orders.filter(o => !o.anticipated), [orders]);
  const anticipados = useMemo(() => orders.filter(o =>  o.anticipated), [orders]);

  const counts = useMemo(() => ({
    Todos:     activos.length,
    Pendiente: activos.filter(o => o.state==="Pendiente").length,
    Asignado:  activos.filter(o => o.state==="Asignado").length,
  }), [activos]);

  /* Resumen anticipados */
  const anticipStats = useMemo(() => {
    const totalSlots = anticipados.reduce((s, o) => s + o.warehouses.length, 0);
    const doneSlots  = anticipados.reduce((s, o) => s + (o.anticipatedDone ?? 0), 0);
    const assigned   = anticipados.filter(o => o.assignedDriver).length;
    return { totalSlots, doneSlots, pct: totalSlots > 0 ? Math.round(doneSlots/totalSlots*100) : 0, assigned };
  }, [anticipados]);

  const sortFn = (a: InvoiceOrder, b: InvoiceOrder) => {
    if (sortKey === "fecha")   return a.date.localeCompare(b.date);
    if (sortKey === "factura") return a.invoiceNumber.localeCompare(b.invoiceNumber);
    if (sortKey === "cliente") return a.clientName.localeCompare(b.clientName);
    if (sortKey === "peso")    return b.totalWeight - a.totalWeight;
    return 0;
  };

  const filtered = useMemo(() => {
    let list = viewMode === "anticipados"
      ? [...anticipados]
      : activos.filter(o => filterState === "Todos" || o.state === filterState);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => o.invoiceNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q));
    }
    return list.sort(sortFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, search, filterState, viewMode, sortKey, activos, anticipados]);

  const SWITCH_TABS: { key: ViewMode; label: string; count: number }[] = [
    { key:"activos",     label:"Pedidos Activos", count: activos.length     },
    { key:"anticipados", label:"Anticipados",     count: anticipados.length },
  ];

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor:"var(--bg-primary)" }}>
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
              style={{ background:"linear-gradient(135deg,#155DFC,#2563EB)", boxShadow:"0 0 20px rgba(21,93,252,0.28)" }}>
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color:"var(--text-primary)" }}>
                Asignación de Rutas
              </h1>
              <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>
                {activos.length} activos · {anticipados.length} anticipados
              </p>
            </div>
          </div>
          {/* Search desktop */}
          <div className="relative hidden sm:flex items-center w-64 lg:w-72 shrink-0 rounded-2xl"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none", transition:"box-shadow 0.15s ease" }}>
            <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color:"var(--text-muted)" }} />
            <input type="text" placeholder="Buscar factura o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor:"var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color:"var(--text-primary)", transition:"border-color 0.15s",
              }}
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Barra de controles */}
        <div className="flex flex-col gap-3">

          {/* Fila 1: Switch vista + filtros (en desktop en la misma línea) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">

            {/* Switch vista */}
            <div className="flex items-center gap-1 p-1 rounded-2xl border w-full sm:w-auto"
              style={{ backgroundColor:"var(--bg-secondary)", borderColor:"var(--border-color)" }}>
              {SWITCH_TABS.map(({ key, label, count }) => {
                const isActive = viewMode === key;
                return (
                  <button key={key} onClick={() => handleViewMode(key)}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none flex-1 sm:flex-none justify-center"
                    style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}>
                    {isActive && (
                      <motion.div layoutId="view-switch" className="absolute inset-0 rounded-xl"
                        style={{ background:"linear-gradient(135deg,#155DFC,#2563EB)", boxShadow:"0 3px 10px rgba(21,93,252,0.3)" }}
                        transition={{ type:"spring", stiffness:440, damping:34 }} />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                        style={{ backgroundColor:"var(--select-option-hover)" }} aria-hidden />
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

            {/* Separador */}
            <div className="hidden sm:block w-px h-7 shrink-0" style={{ backgroundColor:"var(--border-color)" }} />

            {/* Filtros estado — solo vista activos */}
            <AnimatePresence mode="wait">
              {viewMode === "activos" && (
                <motion.div key="state-filters"
                  initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }}
                  transition={{ duration:0.18, ease:[0.22,1,0.36,1] }}
                  className="flex items-center gap-1 p-1 rounded-2xl border w-full sm:w-auto overflow-x-auto"
                  style={{ backgroundColor:"var(--bg-secondary)", borderColor:"var(--border-color)" }}>
                  {FILTERS.map(({ key, label, dot }) => {
                    const isActive = filterState === key;
                    return (
                      <button key={key} onClick={() => setFilterState(key)}
                        className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold focus:outline-none flex-1 sm:flex-none justify-center shrink-0"
                        style={{ color: isActive ? "#fff" : "var(--text-secondary)" }}>
                        {isActive && (
                          <motion.div layoutId="asignar-tab" className="absolute inset-0 rounded-xl"
                            style={{ background:"linear-gradient(135deg,#155DFC,#2563EB)", boxShadow:"0 3px 10px rgba(21,93,252,0.3)" }}
                            transition={{ type:"spring", stiffness:440, damping:34 }} />
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                            style={{ backgroundColor:"var(--select-option-hover)" }} aria-hidden />
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

          {/* Fila 2: Search (móvil ocupa fila propia, desktop ya está arriba en el header) */}
          <div className="relative sm:hidden flex items-center w-full rounded-2xl"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none", transition:"box-shadow 0.15s ease" }}>
            <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color:"var(--text-muted)" }} />
            <input type="text" placeholder="Buscar factura o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{
                backgroundColor:"var(--bg-secondary)",
                borderColor: searchFocused ? "var(--accent-border)" : "var(--border-color)",
                color:"var(--text-primary)", transition:"border-color 0.15s",
              }}
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Banner resumen — solo vista anticipados */}
        <AnimatePresence>
          {viewMode === "anticipados" && anticipados.length > 0 && (
            <motion.div
              initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
              className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4"
              style={{
                backgroundColor:"var(--bg-secondary)",
                border:"1px solid var(--border-color)",
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor:"rgba(59,130,246,0.12)" }}>
                  <TrendingUp className="w-4 h-4" style={{ color:"#3B82F6" }} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
                    Progreso de preparación
                  </p>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {anticipStats.doneSlots} de {anticipStats.totalSlots} almacenes listos · {anticipStats.assigned}/{anticipados.length} asignados
                  </p>
                </div>
              </div>
              <div className="flex-1 w-full sm:w-auto flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color:"var(--text-muted)" }}>Almacenes</span>
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: anticipStats.pct===100 ? "#10B981" : "var(--text-secondary)" }}>
                    {anticipStats.pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor:"var(--border-color)" }}>
                  <motion.div className="h-full rounded-full"
                    style={{ backgroundColor: anticipStats.pct===100 ? "#10B981" : "#3B82F6" }}
                    initial={{ width:0 }} animate={{ width:`${anticipStats.pct}%` }}
                    transition={{ duration:0.7, ease:[0.25,0.46,0.45,0.94], delay:0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ overflow:"visible" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((order, i) => (
              <InvoiceCard key={order.id} order={order} onAssign={handleAssign}
                onToast={handleToast} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor:"var(--bg-secondary)", border:"1px solid var(--border-color)" }}>
                <Search className="w-7 h-7" style={{ color:"var(--text-muted)" }} />
              </div>
              <p className="text-base font-semibold" style={{ color:"var(--text-primary)" }}>Sin resultados</p>
              <p className="text-sm" style={{ color:"var(--text-secondary)" }}>
                {viewMode === "anticipados" ? "No hay pedidos anticipados" : "Intenta con otro término de búsqueda"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
