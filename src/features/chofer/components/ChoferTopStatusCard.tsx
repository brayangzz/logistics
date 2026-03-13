"use client";

import { Package, Truck } from "lucide-react";
import { InvoiceDetail } from "../models";
import { StateIndicator, OverallBadge } from "@/features/logistics/components";

interface ChoferTopStatusCardProps {
  invoice: InvoiceDetail;
}

export const ChoferTopStatusCard = ({ invoice }: ChoferTopStatusCardProps) => {
  return (
    <div className="bg-[#1E293A]/40 rounded-3xl border border-slate-700/50 shadow-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#155DFC]/40 to-transparent" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#155DFC]/10 rounded-full blur-2xl group-hover:bg-[#155DFC]/20 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-b from-[#1E293A] to-[#1B2638] border border-slate-700/50 shadow-inner flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-[#155DFC]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Factura de Ruta</h2>
            <div className="text-3xl font-extrabold text-white flex items-center gap-3">
              {invoice.invoiceNumber}
              <OverallBadge state={invoice.overallState} />
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-[#155DFC]/10 text-[#155DFC] ring-1 ring-[#155DFC]/30">
          <Truck className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700/50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Estado por Almacén</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-[#1B2638] p-3 rounded-xl border border-slate-700/50">
            <span className="text-sm font-medium text-slate-300 w-20">Aluminio</span>
            <StateIndicator state={invoice.areas.aluminio} />
          </div>
          <div className="flex items-center gap-3 bg-[#1B2638] p-3 rounded-xl border border-slate-700/50">
            <span className="text-sm font-medium text-slate-300 w-20">Vidrio</span>
            <StateIndicator state={invoice.areas.vidrio} />
          </div>
          <div className="flex items-center gap-3 bg-[#1B2638] p-3 rounded-xl border border-slate-700/50">
            <span className="text-sm font-medium text-slate-300 w-20">Herrajes</span>
            <StateIndicator state={invoice.areas.herrajes} />
          </div>
        </div>
      </div>
    </div>
  );
};
