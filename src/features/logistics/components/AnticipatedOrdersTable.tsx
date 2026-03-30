"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import type { AnticipatedState } from "@/lib/OrdersContext";
import { StateIndicator } from "./StateIndicator";
import type { OrderState } from "../models";
import { AnticipatedFilterRow } from "./anticipated/AnticipatedFilterRow";
import { useAnticipatedFiltering } from "@/features/logistics/hooks/useAnticipatedFiltering";

/* ─── Helpers ─── */
const toSemaphoreState = (state: AnticipatedState): OrderState => {
  if (state === "Programado") return "Pendiente";
  if (state === "Cancelado")  return "N/A";
  return "En Proceso";
};

const PROGRESS_STAGE: Record<AnticipatedState, number> = {
  Programado:       1,
  Confirmado:       2,
  "En Preparación": 3,
  Cancelado:        0,
};

const stageColor = (stage: number): string => {
  if (stage === 0) return "#EF4444";
  if (stage === 1) return "#64748B";
  if (stage === 2) return "#155DFC";
  if (stage === 3) return "#F59E0B";
  return "#10B981";
};

const INITIALS_CFG: Record<string, { color: string; bg: string }> = {
  PV: { color:"#0EA5E9", bg:"rgba(14,165,233,0.12)"  },
  AP: { color:"#818CF8", bg:"rgba(129,140,248,0.12)" },
  DR: { color:"#F472B6", bg:"rgba(244,114,182,0.12)" },
  VN: { color:"#34D399", bg:"rgba(52,211,153,0.12)"  },
  GE: { color:"#FB923C", bg:"rgba(251,146,60,0.12)"  },
  IM: { color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
  AL: { color:"#38BDF8", bg:"rgba(56,189,248,0.12)"  },
  CD: { color:"#F59E0B", bg:"rgba(245,158,11,0.12)"  },
  HP: { color:"#4ADE80", bg:"rgba(74,222,128,0.12)"  },
  VA: { color:"#FB7185", bg:"rgba(251,113,133,0.12)" },
};
const getIC = (i: string) => INITIALS_CFG[i] ?? { color:"#155DFC", bg:"rgba(21,93,252,0.12)" };

/* ─────────────────────────── Component ─────────────────────────── */
export const AnticipatedOrdersTable = () => {
  const {
    anticipatedOrders, filtered, paginated,
    totalPages, safePage, startItem, endItem, handlePageChange,
    search, setSearch, bucket, setBucket, selectedDate, setSelectedDate,
  } = useAnticipatedFiltering();

  return (
    <div className="space-y-4">

      <AnticipatedFilterRow
        bucket={bucket} setBucket={setBucket}
        search={search} setSearch={setSearch}
        selectedDate={selectedDate} setSelectedDate={setSelectedDate}
      />

      {/* Table */}
      <div
        className="rounded-3xl border shadow-2xl overflow-hidden relative backdrop-blur-xl"
        style={{ backgroundColor: "var(--table-row-bg)", borderColor: "var(--border-color)" }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/20 to-transparent" />

        {/* Column Headers */}
        <div
          className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b text-[11px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: "var(--table-header-bg)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <div className="col-span-3">Factura #</div>
          <div className="col-span-3">Cliente</div>
          <div className="col-span-1 text-center">Aluminio</div>
          <div className="col-span-1 text-center">Vidrio</div>
          <div className="col-span-1 text-center">Herrajes</div>
          <div className="col-span-3 text-right">Progreso</div>
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-16 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-semibold">No se encontraron anticipados.</p>
                <p className="text-sm mt-1 opacity-70">Intenta ajustar los filtros</p>
              </motion.div>
            ) : (
              paginated.map((order, i) => {
                const semState    = toSemaphoreState(order.state);
                const stage       = PROGRESS_STAGE[order.state];
                const color       = stageColor(stage);
                const ic          = getIC(order.clientInitials);
                const hasAluminio = order.items.some(it => it.area === "Aluminio");
                const hasVidrio   = order.items.some(it => it.area === "Vidrio");
                const hasHerrajes = order.items.some(it => it.area === "Herrajes");

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
                    className="group flex flex-col md:grid md:grid-cols-12 gap-y-4 gap-x-4 px-5 py-5 md:px-8 md:py-6 items-center transition-all duration-300 ease-out relative"
                    style={{ borderColor: "var(--border-color)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#155DFC] scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300" />

                    {/* Mobile header */}
                    <div className="flex md:hidden justify-between w-full items-center mb-1">
                      <span className="font-semibold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {order.invoiceNumber}
                      </span>
                      <span className="text-xs font-bold" style={{ color }}>{stage}/4 entregas</span>
                    </div>

                    {/* Col 1: Factura */}
                    <div className="hidden md:block col-span-3">
                      <div
                        className="font-semibold text-base tracking-tight group-hover:text-[#155DFC] transition-colors"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.invoiceNumber}
                      </div>
                      <div className="mt-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {new Date(order.scheduledDate + "T00:00:00").toLocaleDateString("es-MX", { day:"numeric", month:"short", year:"numeric" })}
                      </div>
                    </div>

                    {/* Col 2: Cliente */}
                    <div className="col-span-3 flex items-center gap-3.5 w-full md:w-auto">
                      <div
                        className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-xs md:text-sm font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
                        style={{ backgroundColor: ic.bg, color: ic.color, outline: `1px solid ${ic.color}30` }}
                      >
                        {order.clientInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm md:text-base transition-colors truncate" style={{ color: "var(--text-primary)" }}>
                          {order.clientName}
                        </span>
                      </div>
                    </div>

                    {/* Cols 3-5: Semaphore */}
                    <div
                      className="col-span-3 flex justify-between w-full md:contents mt-2 md:mt-0 px-2 md:px-0 p-3 md:p-0 rounded-xl border md:border-transparent"
                      style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}
                    >
                      <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                        <span className="text-[10px] uppercase font-bold md:hidden" style={{ color: "var(--text-muted)" }}>Aluminio</span>
                        <StateIndicator state={hasAluminio ? semState : "N/A"} />
                      </div>
                      <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                        <span className="text-[10px] uppercase font-bold md:hidden" style={{ color: "var(--text-muted)" }}>Vidrio</span>
                        <StateIndicator state={hasVidrio ? semState : "N/A"} />
                      </div>
                      <div className="col-span-1 flex flex-col md:flex-row items-center justify-center gap-2">
                        <span className="text-[10px] uppercase font-bold md:hidden" style={{ color: "var(--text-muted)" }}>Herrajes</span>
                        <StateIndicator state={hasHerrajes ? semState : "N/A"} />
                      </div>
                    </div>

                    {/* Col 6: Progreso (desktop) */}
                    <div className="hidden md:flex col-span-3 flex-col items-end gap-2.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold leading-none" style={{ color }}>{stage}</span>
                        <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>/ 4 entregas</span>
                      </div>
                      <div className="flex gap-1 w-full">
                        {[1, 2, 3, 4].map(seg => (
                          <motion.div
                            key={seg}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.04 + seg * 0.07 }}
                            className="h-2 flex-1 rounded-full"
                            style={{
                              backgroundColor: seg <= stage ? color : "var(--bg-input)",
                              boxShadow: seg <= stage && stage > 0 ? `0 0 6px ${color}70` : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mobile: segmented progress */}
                    <div className="flex md:hidden flex-col gap-1.5 w-full">
                      <div className="flex gap-1 w-full">
                        {[1, 2, 3, 4].map(seg => (
                          <div
                            key={seg}
                            className="h-2 flex-1 rounded-full"
                            style={{ backgroundColor: seg <= stage ? color : "var(--bg-input)" }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer + Pagination */}
        <div
          className="px-5 md:px-8 py-4 border-t flex flex-col sm:flex-row gap-4 items-center justify-between text-sm backdrop-blur-md"
          style={{ backgroundColor: "var(--footer-bg)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          <span className="text-sm">
            {filtered.length === 0 ? "Sin resultados" : (
              <>
                Mostrando{" "}
                <strong style={{ color: "var(--text-primary)" }}>{startItem}–{endItem}</strong>
                {" "}de{" "}
                <strong style={{ color: "var(--text-primary)" }}>{filtered.length}</strong>
                {" "}anticipados
                {filtered.length < anticipatedOrders.length && (
                  <span style={{ color: "var(--text-muted)" }}> (filtrado de {anticipatedOrders.length})</span>
                )}
              </>
            )}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                disabled={safePage === 1}
                onClick={() => handlePageChange(safePage - 1)}
                className="p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={e => { if (safePage !== 1) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, j) => j + 1).map(page => {
                const isActive = page === safePage;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className="w-9 h-9 rounded-lg border text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: isActive ? "#155DFC" : "transparent",
                      borderColor: isActive ? "#155DFC" : "var(--border-color)",
                      color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                      boxShadow: isActive ? "0 4px 12px rgba(21,93,252,0.3)" : "none",
                    }}
                    onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
                    onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; } }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={safePage === totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className="p-2 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)", backgroundColor: "transparent" }}
                onMouseEnter={e => { if (safePage !== totalPages) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
