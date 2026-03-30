"use client";

import { Package, ClipboardList } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogisticsFiltersPanel,
  LogisticsLegend,
  LogisticsTable,
  AnticipatedOrdersTable,
} from "@/features/logistics/components";
import { useLogisticsPageState } from "@/features/logistics";
import { useOrders } from "@/lib/OrdersContext";

type Tab = "activos" | "anticipados";

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("activos");
  const { orders: initialOrders, anticipatedOrders } = useOrders();
  const isLoading = false;
  const {
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
    paginatedOrders,
    currentPage,
    totalPages,
    totalFiltered,
    handlePageChange,
    itemsPerPage,
  } = useLogisticsPageState(initialOrders);

  const pendingCount = initialOrders.filter((o) => o.overallState === "Pendiente").length;
  const totalCount = initialOrders.length;

  const TABS = [
    {
      id: "activos" as Tab,
      label: "Pedidos Normales",
      icon: Package,
      badge: pendingCount > 0 ? `${pendingCount}` : null,
    },
    {
      id: "anticipados" as Tab,
      label: "Anticipados",
      icon: ClipboardList,
      badge: anticipatedOrders.length > 0 ? `${anticipatedOrders.length}` : null,
    },
  ];

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="w-full p-4 md:p-6 lg:p-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-[#155DFC] to-blue-700 shadow-[0_0_20px_rgba(21,93,252,0.3)] shrink-0">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Logística
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {totalCount} pedidos registrados
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl border w-full sm:w-max overflow-x-auto"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 flex-1 sm:flex-none justify-center focus:outline-none shrink-0"
                style={{ color: isActive ? "#FFFFFF" : "var(--text-muted)" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="page-tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #155DFC, #2563EB)",
                      boxShadow: "0 4px 12px rgba(21,93,252,0.3)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-150"
                    style={{ backgroundColor: "var(--select-option-hover)" }}
                    aria-hidden
                  />
                )}
                <Icon className="relative z-10 w-4 h-4 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                {tab.badge && (
                  <span
                    className="relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap hidden sm:inline"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--border-color)",
                      color: isActive ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "activos" ? (
            <motion.div
              key="activos"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <LogisticsLegend
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                />
                <LogisticsFiltersPanel
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  dateRange={dateRange}
                  onDateChange={setDateRange}
                  selectedDate={selectedDate}
                  onCalendarDateChange={setSelectedDate}
                />
              </div>
              <LogisticsTable
                orders={paginatedOrders}
                isLoading={isLoading}
                totalCount={totalCount}
                currentPage={currentPage}
                totalPages={totalPages}
                totalFiltered={totalFiltered}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="anticipados"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <AnticipatedOrdersTable />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}