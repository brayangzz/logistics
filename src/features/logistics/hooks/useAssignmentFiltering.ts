"use client";

import { useState, useMemo } from "react";
import { useOrders, isReadyForRoute } from "@/lib/OrdersContext";
import type { LocalAssignment, AssignState, FilterState } from "@/features/logistics/components/asignar/asignar.types";

export const useAssignmentFiltering = () => {
  const { orders: allOrders } = useOrders();

  const readyOrders = useMemo(
    () => allOrders.filter(o => isReadyForRoute(o) && !o.isUrgent),
    [allOrders],
  );

  const [assignments, setAssignments] = useState<Record<string, LocalAssignment>>({});
  const [stateFilter, setStateFilter] = useState<FilterState>("Todos");
  const [blockFilter, setBlockFilter] = useState<string>("Todos");

  const getAssignment = (id: string): LocalAssignment =>
    assignments[id] ?? { state: "Pendiente" };

  const handleAssign = (orderId: string, blockId: string, driverId: string) => {
    setAssignments(prev => ({
      ...prev,
      [orderId]: { state: "Asignado" as AssignState, assignedBlock: blockId, assignedDriver: driverId },
    }));
  };

  const filtered = useMemo(() => {
    let list = readyOrders;
    if (stateFilter !== "Todos")
      list = list.filter(o => getAssignment(o.id).state === stateFilter);
    if (blockFilter !== "Todos")
      list = list.filter(o => getAssignment(o.id).assignedBlock === blockFilter);
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyOrders, stateFilter, blockFilter, assignments]);

  const pendingCount  = readyOrders.filter(o => getAssignment(o.id).state === "Pendiente").length;
  const assignedCount = readyOrders.filter(o => getAssignment(o.id).state === "Asignado").length;
  const enRutaCount   = readyOrders.filter(o => getAssignment(o.id).state === "En Ruta").length;

  return {
    readyOrders,
    filtered,
    assignments,
    getAssignment,
    handleAssign,
    stateFilter, setStateFilter,
    blockFilter, setBlockFilter,
    pendingCount, assignedCount, enRutaCount,
  };
};
