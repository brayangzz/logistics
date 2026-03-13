"use client";

import { useState, useEffect } from "react";
import { Loader2, Truck } from "lucide-react";
import {
  useChoferRouteHook,
  ChoferClientInfoCard,
  ChoferItemsTable,
  ChoferItineraryList
} from "@/features/chofer";

export default function ChoferPage() {
  const { data: route, isLoading, error } = useChoferRouteHook();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Auto-select first invoice when data loads
  useEffect(() => {
    if (route && route.invoices.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(route.invoices[0].id);
    }
  }, [route, selectedInvoiceId]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-[#0B1120]">
        <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#155DFC]" />
        <p className="text-lg text-slate-400 font-medium">Cargando ruta de hoy...</p>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-[#0B1120]">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-md shadow-lg">
          <p className="text-red-400 mb-2 font-bold text-lg">Error al cargar ruta</p>
          <p className="text-sm text-red-500/80">{error || "No se encontraron rutas asignadas"}</p>
        </div>
      </div>
    );
  }

  const activeInvoice = route.invoices.find(inv => inv.id === selectedInvoiceId);

  return (
    <div className="w-full min-h-screen bg-[#0B1120] text-slate-200 p-4 md:p-6 lg:p-8">

      {/* HEADER PRINCIPAL - Optimizado para responsividad y uso de espacio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-[#111827] p-5 md:p-6 rounded-2xl border border-slate-800 shadow-sm">

        <div className="flex flex-col gap-5">
          {/* Título (Sin itálicas, colores divididos blanco/azul) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_4px_20px_rgba(21,93,252,0.3)] flex items-center justify-center shrink-0 border border-blue-400/20">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
              <span className="text-white">Pedidos</span>{" "}
              <span className="text-[#155DFC]">Asignados</span>
            </h1>
          </div>

          {/* Etiquetas de Información (Azul y Blanco) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#1E293B]/80 border border-slate-700/50 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#155DFC] text-[10px] md:text-xs font-bold uppercase tracking-widest mr-2">Chofer:</span>
              <span className="text-white font-semibold text-xs md:text-sm">{route.driverName}</span>
            </div>

            <div className="flex items-center bg-[#1E293B]/80 border border-slate-700/50 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-[#155DFC] text-[10px] md:text-xs font-bold uppercase tracking-widest mr-2">Fecha:</span>
              <span className="text-white font-semibold text-xs md:text-sm">{route.date}</span>
            </div>
          </div>
        </div>

        {/* Badge de Sincronización */}
        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full self-start md:self-auto shrink-0 shadow-sm">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sincronizado</span>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL - Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* Columna Izquierda: Lista de Itinerario */}
        <div className="lg:col-span-4 xl:col-span-3 h-full">
          <div className="sticky top-6">
            <ChoferItineraryList
              route={route}
              selectedInvoiceId={selectedInvoiceId}
              onSelectInvoice={setSelectedInvoiceId}
            />
          </div>
        </div>

        {/* Columna Derecha: Detalles de Factura Activa */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8 pb-12">
          {activeInvoice ? (
            // CAMBIO APLICADO AQUÍ: Quitamos animate-in y agregamos el key
            <div key={activeInvoice.id} className="flex flex-col gap-6">
              <div className="w-full">
                <ChoferClientInfoCard invoice={activeInvoice} />
              </div>

              <div className="w-full">
                <ChoferItemsTable invoice={activeInvoice} />
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#111827]/50 border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Truck className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">Selecciona una parada del itinerario</p>
              <p className="text-slate-500 text-sm mt-2">Los detalles de la entrega aparecerán aquí</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}