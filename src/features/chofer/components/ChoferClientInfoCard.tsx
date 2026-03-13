"use client";

import { MapPin, Phone, Calendar as CalendarIcon, FileText } from "lucide-react";
import { InvoiceDetail } from "../models";
import { OverallBadge } from "@/features/logistics/components/OverallBadge";

interface ChoferClientInfoCardProps {
  invoice: InvoiceDetail;
}

export const ChoferClientInfoCard = ({ invoice }: ChoferClientInfoCardProps) => {
  const { client, invoiceNumber, overallState } = invoice;

  return (
    <div className="bg-[#1E293A]/40 rounded-3xl border border-slate-700/50 shadow-2xl p-5 md:p-6 lg:p-8 backdrop-blur-md relative overflow-hidden group">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#155DFC]/40 to-transparent" />
      
      {/* Top row: Invoice info and status */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#155DFC]/10 border border-[#155DFC]/30 text-[#155DFC] shadow-inner flex items-center justify-center shrink-0 font-bold text-lg md:text-xl">
            {client.initials}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              {client.name}
            </h2>
            <div className="flex items-center flex-wrap gap-2 md:gap-3 mt-2">
              <span className="text-xs md:text-sm font-semibold text-slate-400 tracking-widest flex items-center gap-1.5 bg-[#0F172A]/50 px-2.5 py-1 rounded-lg border border-slate-700/50">
                <FileText className="w-3.5 h-3.5" />
                {invoiceNumber}
              </span>
              <OverallBadge state={overallState} />
            </div>
          </div>
        </div>

        {/* Date and Phone side-by-side or stacked on right on desktop */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center gap-3 bg-[#1B2638] md:bg-transparent md:p-0 p-3.5 rounded-xl border md:border-transparent border-slate-700/50 w-full md:w-auto">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">{client.phone}</span>
          </div>
          <div className="flex items-center gap-3 bg-[#1B2638] md:bg-transparent md:p-0 p-3.5 rounded-xl border md:border-transparent border-slate-700/50 w-full md:w-auto">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">{client.deliveryDate}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-[#1B2638] p-4 rounded-xl border border-slate-700/50 hover:border-slate-500/50 transition-colors">
          <MapPin className="w-5 h-5 text-[#155DFC] shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dirección de Entrega</span>
            <span className="text-sm font-medium text-slate-200 leading-relaxed">{client.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
