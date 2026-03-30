export type AssignState = "Asignado" | "Pendiente" | "En Ruta" | "Entregado";
export type FilterState = AssignState | "Todos";

export interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  color: string;
  bg: string;
}

export interface Block {
  id: string;
  name: string;
  zone: string;
  color: string;
  bg: string;
  border: string;
  drivers: Driver[];
}

export interface LocalAssignment {
  state: AssignState;
  assignedBlock?: string;
  assignedDriver?: string;
}
