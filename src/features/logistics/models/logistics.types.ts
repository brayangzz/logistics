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
  clientInitials: string;
  clientName: string;
  areas: OrderAreaState;
  overallState: OrderState;
}
