import { useState } from "react";
import { cajaChoferes } from "@/data";

export interface Pedido {
  folio: string;
  cliente: string;
  monto: number;
  ubicacion: string;
  formaPago: "efectivo" | "transferencia" | "credito";
}

export interface Chofer {
  id: string;
  name: string;
  initials: string;
  pedidos: Pedido[];
  entregado: boolean;
}

export function useCaja() {
  const [choferes, setChoferes] = useState<Chofer[]>(cajaChoferes);
  const firstPending = cajaChoferes.find(c => !c.entregado)?.id ?? cajaChoferes[0].id;
  const [selectedId, setSelectedId] = useState<string>(firstPending);

  const selected = choferes.find((c) => c.id === selectedId) ?? choferes[0];

  const marcarEntregado = () => {
    setChoferes((prev) =>
      prev.map((ch) =>
        ch.id === selectedId ? { ...ch, entregado: true } : ch
      )
    );
  };

  const revertirEntregado = () => {
    setChoferes((prev) =>
      prev.map((ch) =>
        ch.id === selectedId ? { ...ch, entregado: false } : ch
      )
    );
  };

  const cancelarPedido = (folio: string) => {
    setChoferes((prev) =>
      prev.map((ch) =>
        ch.id === selectedId
          ? { ...ch, pedidos: ch.pedidos.filter((p) => p.folio !== folio) }
          : ch
      )
    );
  };

  const activosCount = choferes.filter((c) => !c.entregado).length;

  return {
    choferes,
    selected,
    selectedId,
    setSelectedId,
    marcarEntregado,
    revertirEntregado,
    cancelarPedido,
    activosCount,
  };
}
