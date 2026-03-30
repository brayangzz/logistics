export type WarehouseType = "Aluminio" | "Vidrio" | "Herrajes";
export type OrderStatus = "Pendiente" | "En Proceso" | "Listo" | "N/A";

export interface InvoiceItem {
  id: string;
  warehouse: WarehouseType;
  description: string;
  quantity: number;
  weightPerUnit: number; // in kg
  section?: string; // e.g. "A3", "Caballete 1"
}

export interface ClientInfo {
  name: string;
  initials: string;
  address: string;
  phone: string;
  deliveryDate: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  client: ClientInfo;
  areas: {
    aluminio: OrderStatus;
    vidrio: OrderStatus;
    herrajes: OrderStatus;
  };
  overallState: OrderStatus;
  items: InvoiceItem[];
}

export interface ChoferRoute {
  id: string;
  driverName: string;
  unidad?: string;
  totalPendingInvoices: number;
  date: string;
  invoices: InvoiceDetail[];
}
