"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Truck, CalendarDays, User2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useChoferRouteHook,
  ChoferClientInfoCard,
  ChoferItemsTable,
  ChoferItineraryList,
} from "@/features/chofer";
import { useOrders } from "@/lib/OrdersContext";

export default function ChoferPage() {
  const { data: rawRoute, isLoading, error } = useChoferRouteHook();
  const { orders: sharedOrders } = useOrders();
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Merge shared semaphore states + filter to only fully-ready (all Listo) invoices
  const syncedRoute = useMemo(() => {
    if (!rawRoute) return null;
    const merged = rawRoute.invoices.map((invoice) => {
      const shared = sharedOrders.find((o) => o.invoiceNumber === invoice.invoiceNumber);
      if (!shared) return invoice;
      return { ...invoice, areas: shared.areas, overallState: shared.overallState };
    });
    const readyInvoices = merged.filter(
      (inv) =>
        inv.areas.aluminio === "Listo" &&
        inv.areas.vidrio   === "Listo" &&
        inv.areas.herrajes === "Listo"
    );
    return { ...rawRoute, invoices: readyInvoices };
  }, [rawRoute, sharedOrders]);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (syncedRoute && syncedRoute.invoices.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(syncedRoute.invoices[0].id);
    }
  }, [syncedRoute, selectedInvoiceId]);

  // Filter invoices by search (invoice number or client name)
  const filteredInvoices = useMemo(() => {
    if (!syncedRoute) return [];
    const q = search.trim().toLowerCase();
    if (!q) return syncedRoute.invoices;
    return syncedRoute.invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.client.name.toLowerCase().includes(q)
    );
  }, [syncedRoute, search]);

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}
      >
        <Loader2 className="w-10 h-10 mb-3 animate-spin text-[#155DFC]" />
        <p className="text-base font-medium">Cargando ruta de hoy...</p>
      </div>
    );
  }

  if (error || !syncedRoute) {
    return (
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="p-8 rounded-2xl text-center max-w-md border" style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
          <p className="text-red-400 mb-2 font-bold text-lg">Error al cargar ruta</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error ?? "No se encontraron rutas asignadas"}</p>
        </div>
      </div>
    );
  }

  const activeInvoice = filteredInvoices.find((inv) => inv.id === selectedInvoiceId)
    ?? (filteredInvoices.length > 0 ? filteredInvoices[0] : undefined);

  return (
    <div
      className="w-full min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* ── Header + Search (mismo card) ── */}
      <div
        className="flex flex-col gap-4 mb-7 p-5 md:p-6 rounded-2xl border"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        {/* Top row: título izq + búsqueda der */}
        <div className="flex items-center justify-between gap-4">
          {/* Icon + título */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_4px_20px_rgba(21,93,252,0.28)] flex items-center justify-center shrink-0 border border-blue-400/20">
              <Truck className="w-4.5 h-4.5 text-white" />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap", lineHeight: 1 }}>
              <span style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 800 }}>Pedidos </span>
              <span style={{ color: "#155DFC", fontSize: 26, fontWeight: 800 }}>Asignados</span>
            </h1>
          </div>

          {/* Search — fixed width, right side */}
          <motion.div
            animate={{
              borderColor: searchFocused ? "#155DFC" : "rgba(255,255,255,0.25)",
              boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.15)" : "none",
            }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-64"
            style={{ backgroundColor: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.25)" }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.7)" }} strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar factura o cliente..."
              className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-white/40"
              style={{ color: "var(--text-primary)" }}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => setSearch("")}
                  className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center focus:outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <X className="w-2.5 h-2.5" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2.5">
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold"
            style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)" }}
          >
            <User2 className="w-3.5 h-3.5 text-[#155DFC]" />
            <span style={{ color: "var(--text-muted)" }}>Chofer:</span>
            <span style={{ color: "var(--text-primary)" }}>{syncedRoute.driverName}</span>
          </div>
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold"
            style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)" }}
          >
            <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
            <span style={{ color: "var(--text-muted)" }}>Fecha:</span>
            <span style={{ color: "var(--text-primary)" }}>{syncedRoute.date}</span>
          </div>
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold"
            style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-color)" }}
          >
            <span style={{ color: "var(--text-muted)" }}>Facturas:</span>
            <span style={{ color: "var(--text-primary)" }}>{filteredInvoices.length}</span>
            {search && (
              <span style={{ color: "var(--text-muted)" }}>/ {syncedRoute.invoices.length}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

        {/* Sidebar: Itinerary */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-6">
            <ChoferItineraryList
              route={{ ...syncedRoute, invoices: filteredInvoices }}
              selectedInvoiceId={activeInvoice?.id ?? null}
              onSelectInvoice={setSelectedInvoiceId}
            />
          </div>
        </div>

        {/* Main: Invoice Detail */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5 pb-10">
          {activeInvoice ? (
            <div key={activeInvoice.id} className="flex flex-col gap-5">
              <ChoferClientInfoCard invoice={activeInvoice} />
              <ChoferItemsTable invoice={activeInvoice} />
            </div>
          ) : (
            <div
              className="min-h-[400px] flex flex-col items-center justify-center rounded-2xl border p-12 text-center"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
            >
              <div
                className="w-14 h-14 mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <Truck className="w-7 h-7" style={{ color: "var(--text-muted)" }} />
              </div>
              <p className="font-semibold text-base" style={{ color: "var(--text-secondary)" }}>
                {search ? "Sin resultados para la búsqueda" : "Selecciona una factura del itinerario"}
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {search ? `No hay facturas que coincidan con "${search}"` : "Los detalles de la entrega aparecerán aquí"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
