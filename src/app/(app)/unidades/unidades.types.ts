export type UnitStatus   = "disponible" | "asignado" | "mantenimiento";
export type StatusFilter = UnitStatus | "Todos";

export interface Driver { id: string; nombre: string; initials: string }
export interface Unit {
  id: string; numero: number; modelo: string; placa: string;
  choferId: string | null; gasolina: number; estado: UnitStatus;
}
