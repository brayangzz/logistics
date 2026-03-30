"use client";

import { useState, useMemo } from "react";
import { Delivery, DeliveryStatus } from "../data";

const PAGE_SIZE = 10;

export const useDeliveryFiltering = (driverDeliveries: Delivery[]) => {
  const [rangeOpen, setRangeOpen]         = useState(false);
  const [range, setRange]                 = useState("Últimos 30 días");
  const [statusFilter, setStatusFilter]   = useState<DeliveryStatus | "Todos">("Todos");
  const [statusOpen, setStatusOpen]       = useState(false);
  const [search, setSearch]               = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [page, setPage]                   = useState(1);
  const [selectedDate, setSelectedDate]   = useState<Date | null>(null);

  const resetPage = () => setPage(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return driverDeliveries.filter(d => {
      const matchSearch = !q || d.folio.toLowerCase().includes(q) || d.client.toLowerCase().includes(q) || d.zone.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || d.status === statusFilter;
      let matchDate = true;
      if (selectedDate) {
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        matchDate = d.dateKey === `${y}-${m}-${day}`;
      }
      return matchSearch && matchStatus && matchDate;
    });
  }, [driverDeliveries, search, statusFilter, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return {
    rangeOpen, setRangeOpen,
    range, setRange,
    statusFilter, setStatusFilter,
    statusOpen, setStatusOpen,
    search, setSearch,
    searchFocused, setSearchFocused,
    page: safePage, setPage,
    selectedDate, setSelectedDate,
    resetPage,
    filtered,
    paginated,
    totalPages,
  };
};
