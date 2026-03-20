export type OrderState = "Pendiente" | "En Proceso" | "Listo" | "N/A";

export interface OrderAreaState {
  aluminio: OrderState;
  vidrio: OrderState;
  herrajes: OrderState;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  isUrgent: boolean;
  date: string;
  orderDate: string; // ISO date string e.g. "2026-03-17"
  clientInitials: string;
  clientName: string;
  sucursal?: string; // shown for urgent orders
  areas: OrderAreaState;
  overallState: OrderState;
}
