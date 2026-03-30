"use client";

import { useMemo } from "react";
import { Delivery } from "../data";

export interface ActivityPoint {
  label: string;
  minutes: number;
  value: 0 | 1;
}

const SESSION_GAP    = 90;  // min gap between deliveries to start new session
const RETURN_BUFFER  = 45;  // min added after last delivery in session
const DAY_START      = 480; // 08:00
const DAY_END        = 1110; // 18:30

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function buildActivityData(deliveries: Delivery[]): { activityData: ActivityPoint[]; hoursEnRuta: number } {
  const times = deliveries
    .map(d => toMinutes(d.time))
    .filter(m => m >= DAY_START && m <= DAY_END)
    .sort((a, b) => a - b);

  // Group into route sessions
  const sessions: { start: number; end: number }[] = [];
  if (times.length > 0) {
    let sessionStart = times[0];
    let sessionLast  = times[0];
    for (let i = 1; i < times.length; i++) {
      if (times[i] - sessionLast > SESSION_GAP) {
        sessions.push({ start: sessionStart, end: Math.min(sessionLast + RETURN_BUFFER, DAY_END) });
        sessionStart = times[i];
      }
      sessionLast = times[i];
    }
    sessions.push({ start: sessionStart, end: Math.min(sessionLast + RETURN_BUFFER, DAY_END) });
  }

  // Build 22 points: 08:00 to 18:30 every 30 min
  const activityData: ActivityPoint[] = Array.from({ length: 22 }, (_, i) => {
    const mins = DAY_START + i * 30;
    const mid  = mins + 15;
    const h    = Math.floor(mins / 60);
    const m    = mins % 60;
    const label = m === 0 ? `${h}h` : "";
    const value: 0 | 1 = sessions.some(s => mid >= s.start && mid <= s.end) ? 1 : 0;
    return { label, minutes: mins, value };
  });

  const totalMins  = sessions.reduce((s, sess) => s + (sess.end - sess.start), 0);
  const hoursEnRuta = +((totalMins / 60).toFixed(1));

  return { activityData, hoursEnRuta };
}

export const useDriverDeliveryMetrics = (driverInitials: string, deliveries: Delivery[]) => {
  const driverDeliveries = useMemo(
    () => deliveries.filter(d => d.driverInitials === driverInitials),
    [driverInitials, deliveries]
  );

  const entregadosCount = useMemo(() => driverDeliveries.filter(d => d.status === "Entregado").length, [driverDeliveries]);
  const enRutaCount     = useMemo(() => driverDeliveries.filter(d => d.status === "En Ruta").length,   [driverDeliveries]);
  const pendientesCount = useMemo(() => driverDeliveries.filter(d => d.status === "Pendiente").length, [driverDeliveries]);
  const importeTotal    = useMemo(() => driverDeliveries.filter(d => d.status === "Entregado").reduce((s, d) => s + d.importe, 0), [driverDeliveries]);

  const { activityData, hoursEnRuta } = useMemo(() => buildActivityData(driverDeliveries), [driverDeliveries]);

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
    activityData,
    hoursEnRuta,
    zoneData,
  };
};
