import { Unit, Driver, ApiUnit, ApiDriver } from "../unidades.types";

const BASE = "https://ds29pw03-7297.usw3.devtunnels.ms/Logistics";

function getInitials(nombre: string): string {
  const parts = nombre.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function mapUnit(raw: ApiUnit, index: number): Unit {
  const match  = raw.sNombre_Unidad.match(/\d+/);
  const numero = match ? parseInt(match[0], 10) : index + 1;
  return {
    id:       `unit-${index}`,
    numero,
    modelo:   raw.sSucursal,
    placa:    raw.sNombre_Unidad,
    choferId: null,
    gasolina: 0,
    estado:   "disponible",
  };
}

function mapDriver(raw: ApiDriver): Driver {
  return {
    id:       String(raw.iId),
    nombre:   raw.sNombre,
    initials: getInitials(raw.sNombre),
  };
}

export const unidadesApi = {
  getUnits: async (): Promise<Unit[]> => {
    const res = await fetch(`${BASE}/GetUnits`);
    if (!res.ok) throw new Error(`GetUnits failed: ${res.status}`);
    const data: ApiUnit[] = await res.json();
    return data.map(mapUnit);
  },

  getDrivers: async (): Promise<Driver[]> => {
    const res = await fetch(`${BASE}/GetDrivers`);
    if (!res.ok) throw new Error(`GetDrivers failed: ${res.status}`);
    const data: ApiDriver[] = await res.json();
    return data.filter(d => d.bActivo).map(mapDriver);
  },
};
