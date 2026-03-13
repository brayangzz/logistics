"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChoferRoute } from "../models";
import { StateIndicator } from "@/features/logistics/components";
import { MapPin, FileText } from "lucide-react";

interface ChoferItineraryListProps {
  route: ChoferRoute;
  selectedInvoiceId: string | null;
  onSelectInvoice: (id: string) => void;
}

export const ChoferItineraryList = ({ route, selectedInvoiceId, onSelectInvoice }: ChoferItineraryListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1B2638] rounded-2xl p-4 md:p-5 border border-slate-700/50 shadow-lg flex items-center justify-between md:block">
        <div>
          <h2 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Ruta del Día</h2>
          <div className="text-lg md:text-xl font-extrabold text-white">
            {route.invoices.length} Paradas Programadas
          </div>
        </div>
        <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#155DFC]/10 text-[#155DFC]">
           <FileText className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-3 pb-4 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 md:mx-0 px-4 md:px-0">
        {route.invoices.map((invoice, index) => {
          const isSelected = selectedInvoiceId === invoice.id;

          return (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectInvoice(invoice.id)}
              className={cn(
                "group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px] md:min-w-0 snap-center shrink-0 w-[85%] md:w-auto",
                isSelected 
                  ? "bg-[#1E293A] border-[#155DFC]/50 shadow-[0_0_20px_rgba(21,93,252,0.15)]" 
                  : "bg-[#1E293A]/40 border-slate-700/50 hover:border-slate-500/50 hover:bg-[#1E293A]/80"
              )}
            >
              {isSelected && (
                <>
                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-[#155DFC] rounded-r-full shadow-[0_0_10px_rgba(21,93,252,0.8)]" />
                  <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-[#155DFC] rounded-b-full shadow-[0_0_10px_rgba(21,93,252,0.8)]" />
                </>
              )}

              <div className="flex items-start justify-between mb-3 pl-0 md:pl-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 mt-1 md:mt-0">
                    <FileText className={cn("w-4 h-4", isSelected ? "text-[#155DFC]" : "text-slate-400")} />
                    <span className="font-bold text-white tracking-wide">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className={cn("text-xs font-semibold leading-tight line-clamp-2", isSelected ? "text-slate-300" : "text-slate-400")}>
                      {invoice.client.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Semaphores small preview */}
              <div className="flex items-center justify-between bg-[#0F172A]/50 rounded-xl p-2 md:p-2.5 border border-slate-700/30 pl-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Alu</span>
                    <StateIndicator state={invoice.areas.aluminio} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Vid</span>
                    <StateIndicator state={invoice.areas.vidrio} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Her</span>
                    <StateIndicator state={invoice.areas.herrajes} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
