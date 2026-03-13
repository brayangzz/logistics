"use client";

import { Package } from "lucide-react";
import {
  LogisticsFiltersPanel,
  LogisticsLegend,
  LogisticsTable,
  useLogisticsPageState,
  useLogisticsQuery
} from "@/features/logistics";

export default function LogisticsPage() {
  const { data: initialOrders, isLoading } = useLogisticsQuery();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    dateRange,
    setDateRange,
    filteredOrders
  } = useLogisticsPageState(initialOrders);

  const pendingCount = initialOrders.filter(o => o.overallState === "Pendiente").length;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">

        {/* Header Section */}
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end justify-between">
          <div className="space-y-1 relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-[#155DFC] to-blue-700 shadow-[0_0_20px_rgba(21,93,252,0.3)]">
                <Package className="w-6 h-6 text-white" />
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              </div>
              Pedidos Activos
            </h1>
            <p className="text-slate-300 mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm md:text-base">
              Monitoree el estado de preparación de pedidos.
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#155DFC]/10 text-[#155DFC] ring-1 ring-[#155DFC]/30 w-max">
                {pendingCount} Pendientes
              </span>
            </p>
          </div>

          <LogisticsFiltersPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
        </div>

        <LogisticsLegend
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <LogisticsTable
          orders={filteredOrders}
          isLoading={isLoading}
          totalCount={initialOrders.length}
        />
      </div>
    </div>
  );
}