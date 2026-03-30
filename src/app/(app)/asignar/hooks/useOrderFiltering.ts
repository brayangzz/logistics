"use client";

import { useState, useMemo, useCallback } from "react";
import { InvoiceOrder, FilterState, ViewMode } from "../asignar.types";
import { asignarOrders as INITIAL_MOCK_ORDERS } from "@/data";

const MOCK_ORDERS: InvoiceOrder[] = INITIAL_MOCK_ORDERS as InvoiceOrder[];

export const useOrderFiltering = () => {
  const [orders,        setOrders]        = useState<InvoiceOrder[]>(MOCK_ORDERS);
  const [search,        setSearch]        = useState("");
  const [filterState,   setFilterState]   = useState<FilterState>("Todos");
  const [viewMode,      setViewMode]      = useState<ViewMode>("activos");
  const [searchFocused, setSearchFocused] = useState(false);
  const sortKey = "fecha";

  const handleAssign = useCallback((orderId: string, driverId: string) =>
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, assignedDriver: driverId, state: "Asignado" } : o
    ))
  , []);

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setFilterState("Todos");
    setSearch("");
  };

  const activos    = useMemo(() => orders.filter(o => !o.anticipated), [orders]);
  const anticipados = useMemo(() => orders.filter(o =>  o.anticipated), [orders]);

  const counts = useMemo(() => ({
    Todos:     activos.length,
    Pendiente: activos.filter(o => o.state === "Pendiente").length,
    Asignado:  activos.filter(o => o.state === "Asignado").length,
  }), [activos]);

  const anticipStats = useMemo(() => {
    const totalSlots = anticipados.reduce((s, o) => s + o.warehouses.length, 0);
    const doneSlots  = anticipados.reduce((s, o) => s + (o.anticipatedDone ?? 0), 0);
    const assigned   = anticipados.filter(o => o.assignedDriver).length;
    return { totalSlots, doneSlots, pct: totalSlots > 0 ? Math.round(doneSlots / totalSlots * 100) : 0, assigned };
  }, [anticipados]);

  const filtered = useMemo(() => {
    let list = viewMode === "anticipados"
      ? [...anticipados]
      : activos.filter(o => filterState === "Todos" || o.state === filterState);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.invoiceNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (sortKey === "fecha")   return a.date.localeCompare(b.date);
      if (sortKey === "factura") return a.invoiceNumber.localeCompare(b.invoiceNumber);
      if (sortKey === "cliente") return a.clientName.localeCompare(b.clientName);
      if (sortKey === "peso")    return b.totalWeight - a.totalWeight;
      return 0;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, search, filterState, viewMode, activos, anticipados]);

  return {
    search, setSearch,
    filterState, setFilterState,
    viewMode,
    searchFocused, setSearchFocused,
    activos, anticipados,
    counts, anticipStats, filtered,
    handleAssign, handleViewMode,
  };
};
