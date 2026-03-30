"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PackageOpen, Weight, CheckCircle2, AlertTriangle } from "lucide-react";
import { InvoiceDetail, InvoiceItem } from "../models";
import { WarehouseCard } from "./items/WarehouseCard";
import { ReportMissingModal } from "./modals/ReportMissingModal";
import { useVerificationState } from "../hooks/useVerificationState";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ChoferItemsTableProps {
  invoice: InvoiceDetail;
}

export const ChoferItemsTable = ({ invoice }: ChoferItemsTableProps) => {
  const { items, invoiceNumber } = invoice;

  const {
    savedVerified,
    reportedItems,
    cardKey,
    isReportModalOpen,
    setIsReportModalOpen,
    handleCommit,
    handleReportSubmit,
  } = useVerificationState(invoiceNumber, items);

  const itemsByWarehouse = useMemo(() =>
    items.reduce((acc: Record<string, InvoiceItem[]>, item) => {
      if (!acc[item.warehouse]) acc[item.warehouse] = [];
      acc[item.warehouse].push(item);
      return acc;
    }, {}),
  [items]);

  const totalVerified = items.filter((i) => savedVerified[i.id]).length;
  const allDone = totalVerified === items.length;
  const totalKg = items.reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);
  const savedKg = items.filter((i) => savedVerified[i.id]).reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(21,93,252,0.1)", borderColor: "rgba(21,93,252,0.22)" }}
            >
              <PackageOpen className="w-[18px] h-[18px] text-[#155DFC]" />
            </div>
            <div>
              <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Detalle del Pedido</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Marca artículos y guarda por almacén</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl whitespace-nowrap shrink-0"
              style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
            >
              <Weight className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-secondary)" }} strokeWidth={2} />
              <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{savedKg.toFixed(1)}</span>
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>/ {totalKg.toFixed(1)} kg</span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {allDone ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.15, ease: EASE }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: "#16A34A" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  <span className="text-xs font-bold text-white">Verificado</span>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 shrink-0" key="actions">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors focus:outline-none"
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Reportar Faltante
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
                  >
                    <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{totalVerified}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>/{items.length} art.</span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Warehouse cards grid */}
      <div className="p-4 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {Object.entries(itemsByWarehouse).map(([warehouse, wItems]) => (
          <WarehouseCard
            key={`${warehouse}-${cardKey}`}
            warehouse={warehouse}
            items={wItems as InvoiceItem[]}
            savedVerified={savedVerified}
            reportedItems={reportedItems}
            onCommit={handleCommit}
          />
        ))}
      </div>

      {isReportModalOpen && (
        <ReportMissingModal
          items={items.filter(i => !savedVerified[i.id])}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </motion.div>
  );
};
