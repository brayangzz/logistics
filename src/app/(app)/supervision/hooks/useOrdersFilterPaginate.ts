"use client";

import { useState, useMemo } from "react";
import { supervisionDrivers, supervisionOrders } from "@/data";
import { Order, Driver, FilterStatus } from "../supervision.types";

const DRIVERS_LIST: Driver[] = supervisionDrivers as Driver[];
const ORDERS: Order[]       = supervisionOrders as Order[];

export const PAGE_SIZE = 8;

export const useOrdersFilterPaginate = () => {
  const [search,        setSearch]        = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterStatus,  setFilterStatus]  = useState<FilterStatus>("Todos");
  const [statusOpen,    setStatusOpen]    = useState(false);
  const [page,          setPage]          = useState(1);
  const [selectedDate,  setSelectedDate]  = useState<Date | null>(null);

  const resetPage = () => setPage(1);

  const stats = useMemo(() => ({
    total:     ORDERS.length,
    pendiente: ORDERS.filter(o => o.status === "Pendiente").length,
    enRuta:    ORDERS.filter(o => o.status === "En Ruta").length,
    entregado: ORDERS.filter(o => o.status === "Entregado").length,
  }), []);

  const driversSummary = useMemo(() =>
    DRIVERS_LIST.map(d => {
      const orders = ORDERS.filter(o => o.driver === d.name);
      return {
        ...d,
        total:     orders.length,
        entregado: orders.filter(o => o.status === "Entregado").length,
        enRuta:    orders.filter(o => o.status === "En Ruta").length,
      };
    })
  , []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ORDERS.filter(o => {
      const matchStatus = filterStatus === "Todos" || o.status === filterStatus;
      const matchSearch = !q
        || o.folio.toLowerCase().includes(q)
        || o.client.toLowerCase().includes(q)
        || o.address.toLowerCase().includes(q)
        || o.driver.toLowerCase().includes(q);
      let matchDate = true;
      if (selectedDate) {
        const label = selectedDate.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
          .replace(".", "").toLowerCase();
        matchDate = o.deliveryDate.toLowerCase().startsWith(label);
      }
      return matchStatus && matchSearch && matchDate;
    });
  }, [search, filterStatus, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    search, setSearch,
    searchFocused, setSearchFocused,
    filterStatus, setFilterStatus,
    statusOpen, setStatusOpen,
    page, setPage,
    selectedDate, setSelectedDate,
    stats, driversSummary,
    filtered, totalPages, safePage, paginated,
    resetPage,
  };
};
