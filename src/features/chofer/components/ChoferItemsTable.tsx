"use client";

import { useMemo } from "react";
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
    <div className="bg-[#1E293A]/40 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden backdrop-blur-xl relative">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Table Header Area */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 md:p-8 border-b border-slate-700/50 bg-[#1B2638]/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
            <PackageOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Detalle del Pedido</h2>
            <p className="text-sm text-slate-400">Desglose de mercancía por almacén</p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex flex-col items-end bg-[#0F172A]/50 px-5 py-3 rounded-2xl border border-slate-700/50 shadow-inner">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Scale className="w-3.5 h-3.5" />
            Peso Total Estimado
          </span>
          <span className="text-2xl font-extrabold text-white text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-200">
            {totalWeight.toFixed(2)} <span className="text-sm font-semibold text-slate-400">kg</span>
          </span>
        </div>
      </div>

      {/* Grouped Lists */}
      <div className="p-6 md:p-8 space-y-8">
        {Object.entries(itemsByWarehouse).map(([warehouse, wItems]) => (
          <div key={warehouse} className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#155DFC] uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#155DFC] shadow-[0_0_10px_rgba(21,93,252,0.8)]" />
              Almacén: {warehouse}
            </h3>

            <div className="bg-[#0F172A]/30 rounded-2xl border border-slate-700/30 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-700/50 bg-[#1B2638]/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-6">Descripción del Artículo</div>
                <div className="col-span-2 text-center">Cantidad</div>
                <div className="col-span-2 text-center">Peso Unitario</div>
                <div className="col-span-2 text-right">Subtotal Kg</div>
              </div>

              <div className="divide-y divide-slate-700/30">
                {wItems.map(item => (
                  <div key={item.id} className="group flex flex-col md:grid md:grid-cols-12 gap-y-2 gap-x-4 px-6 py-4 items-center hover:bg-[#1B2638] transition-colors relative">
                    <div className="col-span-6 w-full font-medium text-slate-200">
                      {item.description}
                    </div>

                    <div className="col-span-2 w-full md:text-center text-sm">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase mr-2">CANT:</span>
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-[#1E293A] rounded-lg border border-slate-700 font-semibold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="col-span-2 w-full md:text-center text-sm text-slate-400">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase mr-2">P.U:</span>
                      {item.weightPerUnit.toFixed(2)} kg
                    </div>

                    <div className="col-span-2 w-full md:text-right font-bold text-emerald-400">
                      <span className="md:hidden text-xs text-slate-500 font-bold uppercase mr-2">SUBTOTAL:</span>
                      {(item.quantity * item.weightPerUnit).toFixed(2)} kg
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
