"use client";

import { useState, useMemo } from "react";
import { Order, OrderState } from "../models";

export type SortOrder = "Recientes" | "Antiguos";
export type DateRange = "Todos" | "7d" | "30d";

const ITEMS_PER_PAGE = 5;

export const useLogisticsPageState = (initialOrders: Order[] = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderState | "Todos">("Todos");
  const [sortBy, setSortBy] = useState<SortOrder>("Recientes");
  const [dateRange, setDateRange] = useState<DateRange>("Todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [localOrders, setLocalOrders] = useState<Order[]>(initialOrders);

  useMemo(() => {
    if (initialOrders.length > 0) {
      setLocalOrders(initialOrders);
    }
  }, [initialOrders]);

  const filteredOrders = useMemo(() => {
    const now = new Date();

    let result = localOrders.filter((order) => {
      const matchesSearch =
        order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "Todos" || order.overallState === statusFilter;

      // Date range filter (simulated using order position/index)
      let matchesDateRange = true;
      if (dateRange !== "Todos") {
        const days = dateRange === "7d" ? 7 : 30;
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - days);
        // We compare against the orderDate if it exists, otherwise use position heuristic
        if (order.orderDate) {
          matchesDateRange = new Date(order.orderDate) >= cutoff;
        }
      }

      // Specific calendar date filter
      let matchesCalendarDate = true;
      if (selectedDate && order.orderDate) {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        matchesCalendarDate = orderDate.getTime() === selectedDate.getTime();
      }

      return matchesSearch && matchesStatus && matchesDateRange && matchesCalendarDate;
    });

    if (sortBy === "Antiguos") {
      result = [...result].reverse();
    }

    return result;
  }, [localOrders, searchTerm, statusFilter, sortBy, dateRange, selectedDate]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, safePage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, dateRange, selectedDate]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    selectedDate,
    setSelectedDate,
    localOrders,
    setLocalOrders,
    filteredOrders,
    paginatedOrders,
    currentPage: safePage,
    totalPages,
    totalFiltered: filteredOrders.length,
    handlePageChange,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
