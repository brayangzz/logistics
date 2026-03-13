"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Scale, PackageOpen } from "lucide-react";
import { InvoiceDetail, InvoiceItem } from "../models";

interface ChoferItemsTableProps {
  invoice: InvoiceDetail;
}

export const ChoferItemsTable = ({ invoice }: ChoferItemsTableProps) => {
  const { items } = invoice;

  const totalWeight = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.quantity * curr.weightPerUnit), 0);
  }, [items]);

  const itemsByWarehouse = useMemo(() => {
    return items.reduce((acc: Record<string, InvoiceItem[]>, item: InvoiceItem) => {
      if (!acc[item.warehouse]) acc[item.warehouse] = [];
      acc[item.warehouse].push(item);
      return acc;
    }, {});
  }, [items]);

  return (
    // Agregamos motion.div con un delay de 0.15s para crear el efecto cascada
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="bg-[#111827] rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Table Header Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 border-b border-slate-800/80 bg-[#111827]/80">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner shrink-0">
            <PackageOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white leading-tight">Detalle del Pedido</h2>
            <p className="text-sm font-medium text-slate-400">Desglose de mercancía por almacén</p>
          </div>
        </div>

        <div className="mt-5 sm:mt-0 flex flex-col items-start sm:items-end bg-[#1E293B]/50 px-5 py-3.5 rounded-2xl border border-slate-700/50 shadow-inner w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-500" />
            Peso Estimado
          </span>
          <span className="text-2xl font-black text-white flex items-baseline gap-1">
            {totalWeight.toFixed(2)} <span className="text-sm font-semibold text-emerald-400">kg</span>
          </span>
        </div>
      </div>

      {/* Grouped Lists */}
      <div className="p-6 md:p-8 space-y-8">
        {Object.entries(itemsByWarehouse).map(([warehouse, wItems]) => (
          <div key={warehouse} className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#155DFC] uppercase tracking-widest flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#155DFC] shadow-[0_0_12px_rgba(21,93,252,0.6)]" />
              Almacén: {warehouse}
            </h3>

            <div className="bg-[#1E293B]/20 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-slate-800 bg-[#1E293B]/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-6">Descripción del Artículo</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-center">Peso Unitario</div>
                <div className="col-span-2 text-right">Subtotal Kg</div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {wItems.map(item => (
                  <div key={item.id} className="group flex flex-col md:grid md:grid-cols-12 gap-y-3 gap-x-4 px-6 py-4 items-center hover:bg-[#1E293B]/60 transition-colors relative">
                    <div className="col-span-6 w-full font-semibold text-slate-200 text-sm md:text-base">
                      {item.description}
                    </div>

                    <div className="col-span-2 w-full md:text-center text-sm flex items-center md:justify-center justify-between">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase">Cant:</span>
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-[#0B1120] rounded-lg border border-slate-700 font-bold text-white shadow-sm">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="col-span-2 w-full md:text-center text-sm text-slate-400 flex items-center md:justify-center justify-between">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase">P.U:</span>
                      <span>{item.weightPerUnit.toFixed(2)} kg</span>
                    </div>

                    <div className="col-span-2 w-full md:text-right font-bold text-emerald-400 flex items-center md:justify-end justify-between">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase">Subtotal:</span>
                      <span>{(item.quantity * item.weightPerUnit).toFixed(2)} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};