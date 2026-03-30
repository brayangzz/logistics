"use client";

import { useMemo } from "react";
import { Delivery } from "../data";

export const useDriverDeliveryMetrics = (driverInitials: string, deliveries: Delivery[]) => {
  const driverDeliveries = useMemo(
    () => deliveries.filter(d => d.driverInitials === driverInitials),
    [driverInitials, deliveries]
  );

  const entregadosCount = useMemo(() => driverDeliveries.filter(d => d.status === "Entregado").length, [driverDeliveries]);
  const enRutaCount     = useMemo(() => driverDeliveries.filter(d => d.status === "En Ruta").length,   [driverDeliveries]);
  const pendientesCount = useMemo(() => driverDeliveries.filter(d => d.status === "Pendiente").length, [driverDeliveries]);
  const importeTotal    = useMemo(() => driverDeliveries.filter(d => d.status === "Entregado").reduce((s, d) => s + d.importe, 0), [driverDeliveries]);

  const hourData = useMemo(() => {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8);
    const counts: Record<number, number> = {};
    hours.forEach(h => { counts[h] = 0; });
    driverDeliveries.forEach(d => {
      const h = parseInt(d.time.split(":")[0], 10);
      if (h >= 8 && h <= 18) counts[h] = (counts[h] ?? 0) + 1;
    });
    return hours.map(h => ({ label: `${h}h`, hour: h, count: counts[h] }));
  }, [driverDeliveries]);

  const zoneData = useMemo(() => {
    const map = new Map<string, number>();
    driverDeliveries.forEach(d => map.set(d.zone, (map.get(d.zone) ?? 0) + 1));
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([zone, count]) => ({ zone, count }));
  }, [driverDeliveries]);

  return {
    driverDeliveries,
    entregadosCount,
    enRutaCount,
    pendientesCount,
    importeTotal,
    totalDeliveries: driverDeliveries.length,
    hourData,
    zoneData,
  };
};
