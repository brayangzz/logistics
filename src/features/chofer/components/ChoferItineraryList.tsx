"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChoferRoute } from "../models";
import { MapPin, FileText, Route } from "lucide-react";

interface ChoferItineraryListProps {
  route: ChoferRoute;
  selectedInvoiceId: string | null;
  onSelectInvoice: (id: string) => void;
}

export const ChoferItineraryList = ({
  route,
  selectedInvoiceId,
  onSelectInvoice,
}: ChoferItineraryListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header card */}
      <div
        className="rounded-2xl p-4 border flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <div>
          <h2
            className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Ruta del Día
          </h2>
          <div className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
            {route.invoices.length} Facturas
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-xl border flex items-center justify-center"
          style={{ backgroundColor: "rgba(21,93,252,0.08)", borderColor: "rgba(21,93,252,0.2)" }}
        >
          <Route className="w-4 h-4 text-[#155DFC]" />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-3 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 md:mx-0 px-4 md:px-0">
        {route.invoices.map((invoice, index) => {
          const isSelected = selectedInvoiceId === invoice.id;

          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.25 }}
              onClick={() => onSelectInvoice(invoice.id)}
              className={cn(
                "group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
                "min-w-[260px] md:min-w-0 snap-center shrink-0 w-[82%] md:w-auto"
              )}
              style={{
                backgroundColor: isSelected ? "var(--bg-card)" : "var(--bg-secondary)",
                borderColor: isSelected ? "#155DFC" : "var(--border-color)",
                boxShadow: isSelected ? "0 0 0 1px #155DFC, 0 4px 20px rgba(21,93,252,0.12)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--table-row-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)";
                }
              }}
            >
              {/* Active left bar (desktop) */}
              {isSelected && (
                <>
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[3px] bg-[#155DFC] rounded-r-full shadow-[0_0_10px_rgba(21,93,252,0.7)]" />
                  <div className="md:hidden absolute top-0 left-0 right-0 h-[3px] bg-[#155DFC] rounded-b-full shadow-[0_0_10px_rgba(21,93,252,0.7)]" />
                </>
              )}

              {/* Stop number badge */}
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: isSelected ? "rgba(21,93,252,0.15)" : "var(--bg-input)",
                  color: isSelected ? "#155DFC" : "var(--text-muted)",
                }}
              >
                {index + 1}
              </div>

              <div className="flex items-start gap-2 mb-3 pl-0 md:pl-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText
                      className="w-3.5 h-3.5"
                      style={{ color: isSelected ? "#155DFC" : "var(--text-muted)" }}
                    />
                    <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs leading-tight line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                      {invoice.client.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Single ready badge */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}
              >
                <div className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </div>
                <span className="text-xs font-bold text-emerald-400">Almacenes Listos</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
