export type OrderStatus  = "Pendiente" | "En Ruta" | "Entregado";
export type DriverStatus = "En Ruta" | "Pendiente" | "Disponible";
export type FilterStatus = OrderStatus | "Todos";

export interface Order {
  id: string; folio: string; client: string; address: string;
  driver: string; driverInitials: string; deliveryDate: string;
  status: OrderStatus; weight: number; zone: string;
}

export interface Driver {
  name: string; initials: string; color: string;
  status: DriverStatus; phone: string; rating: number;
}

export interface DriverSummary extends Driver {
  total: number; entregado: number; enRuta: number;
}
