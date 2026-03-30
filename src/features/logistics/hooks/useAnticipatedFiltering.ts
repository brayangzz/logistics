"use client";

import { useState, useMemo } from "react";
import { useOrders } from "@/lib/OrdersContext";
import type { AnticipatedOrder, AnticipatedState } from "@/lib/OrdersContext";

export type FilterBucket = "Todos" | "Pendiente" | "En Proceso" | "Listo";

const stateToFilter = (state: AnticipatedState): FilterBucket => {
  if (state === "Programado") return "Pendiente";
  return "En Proceso";
};

const ITEMS_PER_PAGE = 5;

export const useAnticipatedFiltering = () => {
  const { anticipatedOrders } = useOrders();
  const [search,       setSearch]       = useState("");
  const [bucket,       setBucket]       = useState<FilterBucket>("Todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage,  setCurrentPage]  = useState(1);

  const filtered = useMemo(() => {
    let list: AnticipatedOrder[] = anticipatedOrders;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.clientName.toLowerCase().includes(q) ||
        o.invoiceNumber.toLowerCase().includes(q),
      );
    }
    if (bucket !== "Todos") {
      list = list.filter(o => stateToFilter(o.state) === bucket);
    }
    if (selectedDate) {
      list = list.filter(o => {
        const d = new Date(o.scheduledDate + "T00:00:00");
        d.setHours(0, 0, 0, 0);
        return d.getTime() === selectedDate.getTime();
      });
    }
    return list;
  }, [anticipatedOrders, search, bucket, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const startItem  = filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endItem    = Math.min(safePage * ITEMS_PER_PAGE, filtered.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    anticipatedOrders,
    filtered,
    paginated,
    totalPages,
    safePage,
    startItem,
    endItem,
    handlePageChange,
    search, setSearch,
    bucket, setBucket,
    selectedDate, setSelectedDate,
  };
};
