"use client";

import { useState, useEffect } from "react";
import { Banknote } from "lucide-react";
import { useCaja } from "@/features/caja/hooks/useCaja";
import { CajaChoferPanel } from "./components/CajaChoferPanel";
import { CajaPedidosTable } from "./components/CajaPedidosTable";
import { CajaSummaryActions } from "./components/CajaSummaryActions";

export default function CajaPage() {
  const {
    choferes, selected, selectedId, setSelectedId,
    marcarEntregado, revertirEntregado, cancelarPedido,
    activosCount,
  } = useCaja();

  const [checkedFolios, setCheckedFolios] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setCheckedFolios({});
  }, [selectedId]);
  const toggleCheck = (folio: string) =>
    setCheckedFolios(prev => ({ ...prev, [folio]: !prev[folio] }));

  const totalMonto = selected.pedidos.reduce((s, p) => s + p.monto, 0);
  const totalCredito = selected.pedidos.filter(p => p.formaPago === "credito").reduce((s, p) => s + p.monto, 0);
  const totalTransferencia = selected.pedidos.filter(p => p.formaPago === "transferencia").reduce((s, p) => s + p.monto, 0);
  const totalEfectivo = selected.pedidos.filter(p => p.formaPago === "efectivo").reduce((s, p) => s + p.monto, 0);
  const checkedCount = selected.pedidos.filter(p => !!checkedFolios[p.folio]).length;

  const handleSelect = (id: string) => setSelectedId(id);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
            style={{ background: "linear-gradient(135deg, #155DFC, #2563EB)", boxShadow: "0 0 20px rgba(21,93,252,0.28)" }}>
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
              Caja
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {activosCount} chofer{activosCount !== 1 ? "es" : ""} pendiente{activosCount !== 1 ? "s" : ""} · {choferes.length} en total
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">

        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <CajaChoferPanel choferes={choferes} selectedId={selectedId} onSelect={handleSelect}
            onFilterChange={(id) => { if (id) setSelectedId(id); }} />
        </div>

        {/* Panel central */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5 pb-10">
          <CajaPedidosTable
            selected={selected} selectedId={selectedId}
            totalMonto={totalMonto} cancelarPedido={cancelarPedido}
            checkedFolios={checkedFolios} toggleCheck={toggleCheck}
            entregado={selected.entregado}
          />
          <CajaSummaryActions
            totalEfectivo={totalEfectivo} totalCredito={totalCredito} totalTransferencia={totalTransferencia}
            entregado={selected.entregado}
            marcarEntregado={marcarEntregado} revertirEntregado={revertirEntregado}
            checkedCount={checkedCount}
            totalCount={selected.pedidos.length}
          />
        </div>

      </div>
    </div>
  );
}
