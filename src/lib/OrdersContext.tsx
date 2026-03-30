"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Order, OrderState } from "@/features/logistics/models";
import { orders as INITIAL_ORDERS_DATA, anticipatedOrders as INITIAL_ANTICIPATED_DATA } from "@/data";

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
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS_DATA);
  const [anticipatedOrders] = useState<AnticipatedOrder[]>(INITIAL_ANTICIPATED_DATA);

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
