"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Order, OrderState } from "@/features/logistics/models";

/* ─── Helpers ─── */
function computeOverall(areas: Order["areas"]): OrderState {
  const vals = [areas.aluminio, areas.vidrio, areas.herrajes].filter((s) => s !== "N/A");
  if (vals.length === 0) return "N/A";
  if (vals.every((s) => s === "Listo")) return "Listo";
  if (vals.some((s) => s !== "Pendiente")) return "En Proceso";
  return "Pendiente";
}

/** Returns true when all active warehouses are "Listo" (no pending/in-process). */
export function isReadyForRoute(order: Order): boolean {
  const { aluminio, vidrio, herrajes } = order.areas;
  return (
    [aluminio, vidrio, herrajes].every((s) => s === "Listo" || s === "N/A") &&
    [aluminio, vidrio, herrajes].some((s) => s === "Listo")
  );
}

/* ─── Canonical master data (single source of truth) ─── */
const INITIAL_ORDERS: Order[] = [
  {
    id: "1", invoiceNumber: "#1015", isUrgent: true,
    date: "17 de marzo 2026", orderDate: "2026-03-17",
    clientInitials: "EB", clientName: "Cristales Monterrey",
    sucursal: "Sucursal Monterrey Centro",
    areas: { aluminio: "Pendiente", vidrio: "Pendiente", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "2", invoiceNumber: "#1024", isUrgent: false,
    date: "16 de marzo 2026", orderDate: "2026-03-16",
    clientInitials: "CS", clientName: "Aluminios del Norte",
    areas: { aluminio: "Listo", vidrio: "En Proceso", herrajes: "Pendiente" },
    overallState: "En Proceso",
  },
  {
    id: "3", invoiceNumber: "#1023", isUrgent: false,
    date: "15 de marzo 2026", orderDate: "2026-03-15",
    clientInitials: "MH", clientName: "Herrajes y Perfiles SA",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "4", invoiceNumber: "#1021", isUrgent: false,
    date: "14 de marzo 2026", orderDate: "2026-03-14",
    clientInitials: "UD", clientName: "Vidrios San Pedro",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "5", invoiceNumber: "#1019", isUrgent: false,
    date: "13 de marzo 2026", orderDate: "2026-03-13",
    clientInitials: "AR", clientName: "Construcciones Regiomontanas",
    areas: { aluminio: "En Proceso", vidrio: "Listo", herrajes: "N/A" },
    overallState: "En Proceso",
  },
  {
    id: "6", invoiceNumber: "#1018", isUrgent: true,
    date: "12 de marzo 2026", orderDate: "2026-03-12",
    clientInitials: "GL", clientName: "Grupo Laminar MTY",
    sucursal: "Sucursal San Nicolás",
    areas: { aluminio: "Pendiente", vidrio: "En Proceso", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "7", invoiceNumber: "#1017", isUrgent: false,
    date: "12 de marzo 2026", orderDate: "2026-03-12",
    clientInitials: "VC", clientName: "Vidrio y Color SA",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "En Proceso" },
    overallState: "En Proceso",
  },
  {
    id: "8", invoiceNumber: "#1016", isUrgent: false,
    date: "11 de marzo 2026", orderDate: "2026-03-11",
    clientInitials: "PB", clientName: "Perfiles Blancos del Norte",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "9", invoiceNumber: "#1014", isUrgent: false,
    date: "10 de marzo 2026", orderDate: "2026-03-10",
    clientInitials: "TA", clientName: "Techados y Aluminio Regio",
    areas: { aluminio: "En Proceso", vidrio: "Pendiente", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "10", invoiceNumber: "#1013", isUrgent: false,
    date: "10 de marzo 2026", orderDate: "2026-03-10",
    clientInitials: "CG", clientName: "Cristalería García Hnos.",
    areas: { aluminio: "Listo", vidrio: "En Proceso", herrajes: "Listo" },
    overallState: "En Proceso",
  },
  {
    id: "11", invoiceNumber: "#1012", isUrgent: false,
    date: "8 de marzo 2026", orderDate: "2026-03-08",
    clientInitials: "FV", clientName: "Fachadas de Vidrio MTY",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "12", invoiceNumber: "#1011", isUrgent: true,
    date: "7 de marzo 2026", orderDate: "2026-03-07",
    clientInitials: "MV", clientName: "Metalúrgica Vidal",
    sucursal: "Sucursal Apodaca Industrial",
    areas: { aluminio: "Pendiente", vidrio: "Pendiente", herrajes: "En Proceso" },
    overallState: "Pendiente",
  },
  {
    id: "13", invoiceNumber: "#1010", isUrgent: false,
    date: "6 de marzo 2026", orderDate: "2026-03-06",
    clientInitials: "SA", clientName: "Sistemas de Aluminio Regio",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "14", invoiceNumber: "#1009", isUrgent: false,
    date: "5 de marzo 2026", orderDate: "2026-03-05",
    clientInitials: "IP", clientName: "Importadora Perfiles SA",
    areas: { aluminio: "En Proceso", vidrio: "Listo", herrajes: "En Proceso" },
    overallState: "En Proceso",
  },
  {
    id: "15", invoiceNumber: "#1008", isUrgent: false,
    date: "4 de marzo 2026", orderDate: "2026-03-04",
    clientInitials: "VR", clientName: "Vidrios Regios del Noreste",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
];

/* ─── Anticipated orders ─── */
export type AnticipatedState = "Programado" | "Confirmado" | "En Preparación" | "Cancelado";
export interface AnticipatedItem { area: "Vidrio" | "Aluminio" | "Herrajes"; qty: number }
export interface AnticipatedOrder {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientInitials: string;
  scheduledDate: string;
  description: string;
  state: AnticipatedState;
  items: AnticipatedItem[];
}

const INITIAL_ANTICIPATED: AnticipatedOrder[] = [
  { id:"a1",  invoiceNumber:"#ANT-001", clientName:"Proyecto Vidrio Norte",      clientInitials:"PV", scheduledDate:"2026-04-02", description:"Ventanas panorámicas serie 400 — Proyecto residencial Cumbres",             state:"Confirmado",     items:[{area:"Vidrio",qty:24},{area:"Aluminio",qty:12},{area:"Herrajes",qty:48}] },
  { id:"a2",  invoiceNumber:"#ANT-002", clientName:"Alumiperfil SA de CV",        clientInitials:"AP", scheduledDate:"2026-04-07", description:"Puertas corredizas y marcos — Edificio comercial San Pedro",              state:"Programado",     items:[{area:"Aluminio",qty:30},{area:"Herrajes",qty:60}] },
  { id:"a3",  invoiceNumber:"#ANT-003", clientName:"Divisiones Regio MTY",        clientInitials:"DR", scheduledDate:"2026-04-12", description:"Fachada completa cristal templado 10mm — Torre corporativa Valle",        state:"En Preparación", items:[{area:"Vidrio",qty:80},{area:"Aluminio",qty:40}] },
  { id:"a4",  invoiceNumber:"#ANT-004", clientName:"Ventanas del Noreste",         clientInitials:"VN", scheduledDate:"2026-04-18", description:"Kit herraje premium para 200 ventanas — Fraccionamiento Cielito",         state:"Confirmado",     items:[{area:"Herrajes",qty:200},{area:"Vidrio",qty:50}] },
  { id:"a5",  invoiceNumber:"#ANT-005", clientName:"Glass Experts MTY",            clientInitials:"GE", scheduledDate:"2026-04-25", description:"Perfiles estructurales para cubierta metálica industrial",               state:"Programado",     items:[{area:"Aluminio",qty:100}] },
  { id:"a6",  invoiceNumber:"#ANT-006", clientName:"Instalaciones MTY SA",         clientInitials:"IM", scheduledDate:"2026-05-03", description:"Mampara divisoria vidrio esmerilado — Oficinas Apodaca Norte",           state:"Programado",     items:[{area:"Vidrio",qty:15},{area:"Herrajes",qty:30}] },
  { id:"a7",  invoiceNumber:"#ANT-007", clientName:"Alu-Perfiles SA",              clientInitials:"AL", scheduledDate:"2026-05-05", description:"Perfiles de aluminio natural línea comercial — Gran Proyecto Escobedo",  state:"Programado",     items:[{area:"Aluminio",qty:200},{area:"Herrajes",qty:80}] },
  { id:"a8",  invoiceNumber:"#ANT-008", clientName:"Cristal Design MTY",           clientInitials:"CD", scheduledDate:"2026-05-12", description:"Cancelería de aluminio serie residencial — Fraccionamiento Las Brisas",  state:"Confirmado",     items:[{area:"Aluminio",qty:60},{area:"Vidrio",qty:90},{area:"Herrajes",qty:120}] },
  { id:"a9",  invoiceNumber:"#ANT-009", clientName:"Herrajes Pro Regio",           clientInitials:"HP", scheduledDate:"2026-04-30", description:"Panel sándwich fachada ventilada — Hub tecnológico García",              state:"En Preparación", items:[{area:"Aluminio",qty:120},{area:"Vidrio",qty:60}] },
  { id:"a10", invoiceNumber:"#ANT-010", clientName:"Vidrio Arquitectónico MTY",    clientInitials:"VA", scheduledDate:"2026-05-20", description:"Cristal decorativo serigrafía — Restaurante cadena nacional",             state:"Programado",     items:[{area:"Vidrio",qty:45},{area:"Herrajes",qty:90}] },
];

/* ─── Context ─── */
interface OrdersContextValue {
  orders: Order[];
  anticipatedOrders: AnticipatedOrder[];
  updateAreaState: (orderId: string, area: keyof Order["areas"], state: OrderState) => void;
}

const OrdersContext = createContext<OrdersContextValue>({
  orders: [],
  anticipatedOrders: [],
  updateAreaState: () => {},
});

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [anticipatedOrders] = useState<AnticipatedOrder[]>(INITIAL_ANTICIPATED);

  const updateAreaState = useCallback(
    (orderId: string, area: keyof Order["areas"], state: OrderState) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          const areas = { ...o.areas, [area]: state };
          return { ...o, areas, overallState: computeOverall(areas) };
        })
      );
    },
    []
  );

  return (
    <OrdersContext.Provider value={{ orders, anticipatedOrders, updateAreaState }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
