/* ─── Types ─── */
export type DeliveryStatus = "Entregado" | "En Ruta" | "Pendiente";

export interface DeliveryItem {
  almacen: "Vidrio" | "Aluminio" | "Herrajes";
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnit: number;
  subtotal: number;
}

export interface Delivery {
  id: string;
  folio: string;
  time: string;
  dateKey: string;
  dateLabel: string;
  client: string;
  clientPhone: string;
  zone: string;
  address: string;
  weight: number;
  importe: number;
  status: DeliveryStatus;
  driverInitials: string;
  notes?: string;
  items: DeliveryItem[];
}

import { chofereDrivers, chofereDeliveries } from "@/data";
export const DRIVERS_LIST = chofereDrivers;
export const DELIVERIES: Delivery[] = chofereDeliveries;
