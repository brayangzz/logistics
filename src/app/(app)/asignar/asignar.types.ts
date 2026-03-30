export type AssignState = "Asignado" | "Pendiente";
export type SortKey     = "fecha" | "factura" | "cliente" | "peso";
export type ViewMode    = "activos" | "anticipados";
export type FilterState = AssignState | "Todos";

export interface Driver { id: string; name: string; initials: string }
export interface Block  { id: string; name: string; shortName: string; drivers: Driver[] }
export interface InvoiceOrder {
  id: string; invoiceNumber: string; clientName: string;
  clientInitials: string; clientAddress: string; totalWeight: number;
  assignedBlock: string; assignedDriver?: string; state: AssignState;
  date: string; warehouses: string[];
  anticipated?: boolean; anticipatedDone?: number;
}
export interface ToastData { id: number; invoice: string; driverName: string }
