"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Calendar as CalendarIcon, FileText } from "lucide-react";
import { InvoiceDetail } from "../models";
import { OverallBadge } from "@/features/logistics/components/OverallBadge";

interface ChoferClientInfoCardProps {
  invoice: InvoiceDetail;
}

export const ChoferClientInfoCard = ({ invoice }: ChoferClientInfoCardProps) => {
  const { client, invoiceNumber, overallState } = invoice;

  return (
    // Agregamos motion.div con una animación inicial de fade-in y ligero slide hacia arriba
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl p-5 md:p-6 lg:p-8 relative overflow-hidden group"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/40 to-transparent" />

      {/* Top row: Invoice info and status */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-start gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_4px_20px_rgba(21,93,252,0.3)] text-white flex items-center justify-center shrink-0 font-bold text-lg md:text-xl border border-blue-400/20">
            {client.initials}
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
              {client.name}
            </h2>
            <div className="flex items-center flex-wrap gap-2 md:gap-3 mt-2">
              <span className="text-xs md:text-sm font-semibold text-slate-300 tracking-widest flex items-center gap-1.5 bg-[#1E293B]/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {invoiceNumber}
              </span>
              <OverallBadge state={overallState} />
            </div>
          </div>
        </div>

        {/* Date and Phone side-by-side or stacked on right on desktop */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 w-full md:w-auto mt-2 md:mt-0">
          <div className="flex items-center gap-3 bg-[#1E293B]/50 p-3.5 rounded-xl border border-slate-700/50 w-full md:w-auto hover:bg-[#1E293B] transition-colors">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">{client.phone}</span>
          </div>
          <div className="flex items-center gap-3 bg-[#1E293B]/50 p-3.5 rounded-xl border border-slate-700/50 w-full md:w-auto hover:bg-[#1E293B] transition-colors">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">{client.deliveryDate}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 bg-[#1E293B]/30 p-5 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-colors">
          <div className="mt-1 p-2 rounded-lg bg-[#155DFC]/10 border border-[#155DFC]/20 shrink-0">
            <MapPin className="w-5 h-5 text-[#155DFC]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Dirección de Entrega</span>
            <span className="text-sm md:text-base font-medium text-slate-200 leading-relaxed">{client.address}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};