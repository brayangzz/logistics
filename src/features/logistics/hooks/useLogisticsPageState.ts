"use client";

import { useState, useMemo } from "react";
import { Order, OrderState } from "../models";

export type SortOrder = "Recientes" | "Antiguos";
export type DateRange = "Todos" | "7d" | "30d";

export const useLogisticsPageState = (initialOrders: Order[] = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderState | "Todos">("Todos");
  const [sortBy, setSortBy] = useState<SortOrder>("Recientes");
  const [dateRange, setDateRange] = useState<DateRange>("Todos");
  
  const [localOrders, setLocalOrders] = useState<Order[]>(initialOrders);

  useMemo(() => {
    if (initialOrders.length > 0) {
      setLocalOrders(initialOrders);
    }
  }, [initialOrders]);

  const filteredOrders = useMemo(() => {
    let result = localOrders.filter((order) => {
      const matchesSearch = order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || order.overallState === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Mock Date Sort (En un mundo real se parsea la fecha, aquí simulamos que la lista original viene más o menos en orden)
    if (sortBy === "Antiguos") {
      result = [...result].reverse(); // Simula orden inverso
    }

    return result;
  }, [localOrders, searchTerm, statusFilter, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    localOrders,
    setLocalOrders,
    filteredOrders,
  };
};
