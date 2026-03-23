"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "../models";
import { StateIndicator } from "./StateIndicator";
import { OverallBadge } from "./OverallBadge";

interface LogisticsTableProps {
  orders: Order[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const LogisticsTable = ({
  orders,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  totalFiltered,
  itemsPerPage,
  onPageChange,
}: LogisticsTableProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalFiltered);

  return (
    <div
      className="rounded-3xl border shadow-2xl overflow-hidden relative backdrop-blur-xl"
      style={{
        backgroundColor: "var(--table-row-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Subtle top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/20 to-transparent" />

      {/* Column Headers (Hidden on Mobile) */}
      <div
        className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b text-[11px] font-bold uppercase tracking-widest"
        style={{
          backgroundColor: "var(--table-header-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        <div className="col-span-3">Factura #</div>
        <div className="col-span-3">Cliente</div>
        <div className="col-span-1 text-center">Aluminio</div>
        <div className="col-span-1 text-center">Vidrio</div>
        <div className="col-span-1 text-center">Herrajes</div>
        <div className="col-span-3 text-right">Estado General</div>
      </div>

      {/* Rows List */}
      <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 flex flex-col items-center justify-center"
              style={{ color: "var(--text-muted)" }}
            >
              <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#155DFC]" />
              <p className="text-lg">Cargando pedidos...</p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold">No se encontraron pedidos.</p>
              <p className="text-sm mt-1 opacity-70">Intenta ajustar los filtros</p>
            </motion.div>
          ) : (
            orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.04,
                  ease: "easeOut",
                }}
                className={cn(
                  "group flex flex-col md:grid md:grid-cols-12 gap-y-4 gap-x-4 px-5 py-5 md:px-8 md:py-6 items-center transition-all duration-300 ease-out relative"
                )}
                style={{ borderColor: "var(--border-color)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                {/* Hover Indicator line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#155DFC] scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300" />

                {/* Mobile Header: Invoice + Badge */}
                <div className="flex md:hidden justify-between w-full items-start mb-2">
                  <div className="flex flex-col gap-1">
                    <span
                      className="font-semibold text-lg tracking-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.invoiceNumber}
                    </span>
                    {order.isUrgent && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 ring-1 ring-red-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        Cliente en sucursal
                      </span>
                    )}
                  </div>
                  <OverallBadge state={order.overallState} />
                </div>

                {/* Invoice (Desktop) */}
                <div className="hidden md:block col-span-3">
                  <div
                    className="font-semibold text-base tracking-tight group-hover:text-[#155DFC] transition-colors flex items-center gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {order.invoiceNumber}
                  </div>
                  <div className="mt-1.5">
                    {order.isUrgent ? (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 ring-1 ring-red-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        Cliente en sucursal
                      </span>
                    ) : (
                      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {order.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Client */}
                <div className="col-span-3 flex items-center gap-3.5 w-full md:w-auto">
                  <div
                    className={cn(
                      "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3",
                      order.clientInitials === "EB" && "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30",
                      order.clientInitials === "CS" && "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
                      order.clientInitials === "MH" && "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
                      order.clientInitials === "UD" && "bg-[#155DFC]/10 text-[#155DFC] ring-1 ring-[#155DFC]/30",
                      order.clientInitials === "AR" && "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30",
                      order.clientInitials === "GL" && "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30",
                      order.clientInitials === "VC" && "bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30",
                      order.clientInitials === "PB" && "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30",
                      order.clientInitials === "TA" && "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/30",
                      order.clientInitials === "CG" && "bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/30",
                      order.clientInitials === "FV" && "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30",
                      order.clientInitials === "MV" && "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30",
                      order.clientInitials === "SA" && "bg-lime-500/10 text-lime-500 ring-1 ring-lime-500/30",
                      order.clientInitials === "IP" && "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30",
                      order.clientInitials === "VR" && "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
                    )}
                  >
                    {order.clientInitials}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-semibold transition-colors text-sm md:text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.clientName}
                    </span>
                    {order.isUrgent && order.sucursal ? (
                      <span className="text-[11px] font-medium mt-0.5" style={{ color: "#FB923C" }}>
                        {order.sucursal}
                      </span>
                    ) : (
                      <span
                        className="text-xs font-medium md:hidden block mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {order.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Areas - Semáforo Indicators */}
                <div
                  className="col-span-3 flex justify-between w-full md:contents mt-2 md:mt-0 px-2 md:px-0 p-3 md:p-0 rounded-xl border md:border-transparent"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span
                      className="text-[10px] uppercase font-bold md:hidden"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Aluminio
                    </span>
                    <StateIndicator state={order.areas.aluminio} isUrgent={order.isUrgent} />
                  </div>
                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span
                      className="text-[10px] uppercase font-bold md:hidden"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Vidrio
                    </span>
                    <StateIndicator state={order.areas.vidrio} isUrgent={order.isUrgent} />
                  </div>
                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span
                      className="text-[10px] uppercase font-bold md:hidden"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Herrajes
                    </span>
                    <StateIndicator state={order.areas.herrajes} isUrgent={order.isUrgent} />
                  </div>
                </div>

                {/* Status Badge (Desktop) */}
                <div className="hidden md:flex col-span-3 justify-end items-center">
                  <OverallBadge state={order.overallState} />
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Pagination */}
      <div
        className="px-5 md:px-8 py-4 border-t flex flex-col sm:flex-row gap-4 items-center justify-between text-sm backdrop-blur-md"
        style={{
          backgroundColor: "var(--footer-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        {/* Info */}
        <span className="text-sm">
          {totalFiltered === 0 ? (
            "Sin resultados"
          ) : (
            <>
              Mostrando{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {startItem}–{endItem}
              </strong>{" "}
              de{" "}
              <strong style={{ color: "var(--text-primary)" }}>{totalFiltered}</strong>{" "}
              pedidos
              {totalFiltered < totalCount && (
                <span style={{ color: "var(--text-muted)" }}> (filtrado de {totalCount})</span>
              )}
            </>
          )}
        </span>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className="w-9 h-9 rounded-lg border text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: isActive ? "#155DFC" : "transparent",
                    borderColor: isActive ? "#155DFC" : "var(--border-color)",
                    color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                    boxShadow: isActive ? "0 4px 12px rgba(21,93,252,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--text-secondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};