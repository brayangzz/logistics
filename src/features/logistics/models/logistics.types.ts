export type OrderState = "Pendiente" | "En Proceso" | "Listo" | "N/A";
export type Modalidad = "Domicilio" | "Recoge en Sucursal";
export type BloqueId  =
  | "b1" | "b2" | "b3" | "b4"
  | "aztlan1" | "aztlan2" | "aztlan3" | "aztlan4"
  | "camino1" | "camino2" | "camino3" | "camino4"
  | "felix" | "escobedo" | "aurora";

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
  sucursal?: string;
  areas: OrderAreaState;
  overallState: OrderState;
  vendedor?: string;
  modalidad?: Modalidad;
  tieneCorteVidrio?: boolean;
  bloque?: BloqueId | null;
}
