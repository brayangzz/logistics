export interface InvoiceItem {
  descripcion: string;
  cantidad: number;
  peso: number;
}

export interface Invoice {
  code: string;
  folio: string;
  client: string;
  destino: string;
  items: number;
  peso: number;
  almacenes: { nombre: string; articulos: InvoiceItem[] }[];
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  facturas: number;
  pesoTotal: number;
  destinos: string[];
  avatar: { bg: string; color: string };
  invoices: Invoice[];
}

export type FilterTab = "pendientes" | "en_ruta";
