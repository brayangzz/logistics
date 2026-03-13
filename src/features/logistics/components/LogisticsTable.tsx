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
}

export const LogisticsTable = ({ orders, isLoading, totalCount }: LogisticsTableProps) => {
  return (
    <div className="bg-[#1E293A]/40 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden backdrop-blur-xl relative">
      {/* Subtle top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/20 to-transparent" />

      {/* Column Headers (Hidden on Mobile) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-700/50 bg-[#1B2638] text-[11px] font-bold text-slate-300 uppercase tracking-widest">
        <div className="col-span-3">Factura #</div>
        <div className="col-span-3">Cliente</div>
        <div className="col-span-1 text-center">Aluminio</div>
        <div className="col-span-1 text-center">Vidrio</div>
        <div className="col-span-1 text-center">Herrajes</div>
        <div className="col-span-3 text-right">Estado General</div>
      </div>

      {/* Rows List */}
      <div className="divide-y divide-slate-700/50">
        {/* Añadido mode="popLayout" para evitar saltos raros al filtrar */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 flex flex-col items-center justify-center text-slate-400"
            >
              <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#155DFC]" />
              <p className="text-lg">Cargando pedidos...</p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center text-slate-400"
            >
              <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <p className="text-lg">No se encontraron pedidos.</p>
            </motion.div>
          ) : (
            orders.map((order, i) => (
              <motion.div
                key={order.id}
                // ELIMINÉ LA PROPIEDAD "layout" que causaba los rebotes
                // ANIMACIÓN AJUSTADA: Más corta (y: 8), más rápida, y con easeOut
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.04, // Retraso en cascada un poco más rápido
                  ease: "easeOut"
                }}
                className={cn(
                  "group flex flex-col md:grid md:grid-cols-12 gap-y-4 gap-x-4 px-5 py-5 md:px-8 md:py-6 items-center transition-all duration-500 ease-out",
                  "hover:bg-[#1B2638] relative",
                  order.overallState === "Pendiente" && "hover:bg-red-500/5"
                )}
              >
                {/* Hover Indicator line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#155DFC] scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300" />

                {/* Mobile Header: Invoice + Badge */}
                <div className="flex md:hidden justify-between w-full items-start mb-2">
                  <div className="flex flex-col">
                    <div className="font-semibold text-white text-lg tracking-tight flex items-center gap-2">
                      {order.invoiceNumber}
                      {order.isUrgent && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 ring-1 ring-red-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5 w-max">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                          Urgente
                        </span>
                      )}
                    </div>
                  </div>
                  <OverallBadge state={order.overallState} />
                </div>

                {/* Invoice (Desktop) */}
                <div className="hidden md:block col-span-3">
                  <div className="font-semibold text-white text-base tracking-tight group-hover:text-[#155DFC] transition-colors flex items-center gap-2">
                    {order.invoiceNumber}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {order.isUrgent ? (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 ring-1 ring-red-500/20 px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-1.5 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        Urgente
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">{order.date}</span>
                    )}
                  </div>
                </div>

                {/* Client */}
                <div className="col-span-3 flex items-center gap-3.5 w-full md:w-auto">
                  <div className={cn(
                    "w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
                    order.clientInitials === "EB" && "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30",
                    order.clientInitials === "CS" && "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30",
                    order.clientInitials === "MH" && "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
                    order.clientInitials === "UD" && "bg-[#155DFC]/10 text-[#155DFC] ring-1 ring-[#155DFC]/30",
                    order.clientInitials === "AR" && "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30"
                  )}>
                    {order.clientInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white transition-colors text-sm md:text-base">
                      {order.clientName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium md:hidden block mt-0.5">{order.date}</span>
                  </div>
                </div>

                {/* Areas - Semáforo Indicators (Mobile Layout vs Desktop Layout) */}
                <div className="col-span-3 flex justify-between w-full md:contents mt-2 md:mt-0 px-2 md:px-0 bg-[#0F172A]/50 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-700/50 md:border-transparent">

                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold md:hidden">Aluminio</span>
                    <StateIndicator state={order.areas.aluminio} isUrgent={order.isUrgent} />
                  </div>
                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold md:hidden">Vidrio</span>
                    <StateIndicator state={order.areas.vidrio} isUrgent={order.isUrgent} />
                  </div>
                  <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold md:hidden">Herrajes</span>
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
      <div className="px-5 md:px-8 py-4 border-t border-slate-700/50 bg-[#1B2638] flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-slate-300 backdrop-blur-md">
        <span>
          Mostrando <strong className="text-white font-semibold">{orders.length}</strong> de <strong className="text-white font-semibold">{totalCount}</strong> pedidos activos
        </span>
        <div className="flex gap-2">
          <button disabled className="p-2 border border-slate-700/50 rounded-lg opacity-40 cursor-not-allowed bg-[#1E293A]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 border border-slate-700/50 rounded-lg hover:bg-[#1E293A] hover:border-slate-500 transition-all text-slate-300 hover:text-white bg-[#0F172A]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};