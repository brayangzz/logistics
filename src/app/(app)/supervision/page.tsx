"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrdersFilterPaginate } from "./hooks/useOrdersFilterPaginate";
import { OrderStatusStats } from "./components/OrderStatusStats";
import { DriversHorizontalList } from "./components/DriversHorizontalList";
import { OrdersTable } from "./components/OrdersTable";

export default function SupervisionPage() {
  const router = useRouter();
  const {
    search, setSearch,
    searchFocused, setSearchFocused,
    filterStatus, setFilterStatus,
    statusOpen, setStatusOpen,
    setPage,
    selectedDate, setSelectedDate,
    stats, driversSummary,
    filtered, totalPages, safePage, paginated,
    resetPage,
  } = useOrdersFilterPaginate();

  const goToHistorial = (initials: string) => router.push(`/supervision/choferes?chofer=${initials}`);

  return (
    <div
      className="w-full min-h-screen p-3 sm:p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: "var(--bg-primary)" }}
      onClick={() => setStatusOpen(() => false)}
    >
      <div className="w-full max-w-[1600px] mx-auto space-y-5 sm:space-y-6">

        {/* Header */}
        <motion.div
          className="flex items-center gap-3 sm:gap-3.5"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #155DFC, #2563EB)", boxShadow: "0 0 20px rgba(21,93,252,0.28)" }}
          >
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}>
              Panel de Supervisión
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {stats.enRuta} choferes en ruta · {stats.pendiente} pedidos pendientes
            </p>
          </div>
        </motion.div>

        <OrderStatusStats stats={stats} />

        <DriversHorizontalList driversSummary={driversSummary} onDriverClick={goToHistorial} />

        <OrdersTable
          paginated={paginated} filtered={filtered}
          safePage={safePage} totalPages={totalPages}
          search={search} setSearch={setSearch}
          searchFocused={searchFocused} setSearchFocused={setSearchFocused}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          statusOpen={statusOpen} setStatusOpen={setStatusOpen}
          selectedDate={selectedDate} setSelectedDate={setSelectedDate}
          resetPage={resetPage} setPage={setPage}
          onRowAction={goToHistorial}
        />

      </div>
    </div>
  );
}
