"use client";

import { Package, Truck } from "lucide-react";
import { InvoiceDetail } from "../models";
import { StateIndicator, OverallBadge } from "@/features/logistics/components";

interface ChoferTopStatusCardProps {
  invoice: InvoiceDetail;
}

export const ChoferTopStatusCard = ({ invoice }: ChoferTopStatusCardProps) => {
  return (
    <div
      className="rounded-2xl border p-5 md:p-7 relative overflow-hidden group"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/40 to-transparent" />
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-[#155DFC]/8 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}
          >
            <Package className="w-6 h-6 text-[#155DFC]" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
              Factura de Ruta
            </h2>
            <div className="text-2xl font-extrabold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
              {invoice.invoiceNumber}
              <OverallBadge state={invoice.overallState} />
            </div>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border"
          style={{ backgroundColor: "rgba(21,93,252,0.08)", borderColor: "rgba(21,93,252,0.2)" }}
        >
          <Truck className="w-5 h-5 text-[#155DFC]" />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--border-color)" }}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          Estado por Almacén
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Aluminio", state: invoice.areas.aluminio },
            { label: "Vidrio",   state: invoice.areas.vidrio },
            { label: "Herrajes", state: invoice.areas.herrajes },
          ].map(({ label, state }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}
            >
              <span className="text-sm font-semibold w-20" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
              <StateIndicator state={state} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
