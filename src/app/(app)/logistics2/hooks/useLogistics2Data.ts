"use client";

import { useMemo } from "react";
import { useOrders } from "@/lib/OrdersContext";
import { BLOCKS } from "../logistics2.types";
import type { Order } from "../logistics2.types";

export type BlockMap = Record<string, Order[]>;

const EMPTY_BLOCK_MAP = (): BlockMap =>
  Object.fromEntries(BLOCKS.map((b) => [b.id, []]));

export const useLogistics2Data = () => {
  const { orders } = useOrders();

  const domicilioMap = useMemo<BlockMap>(() => {
    const map = EMPTY_BLOCK_MAP();
    for (const order of orders) {
      if (order.bloque && order.bloque in map && order.modalidad === "Domicilio") {
        map[order.bloque].push(order);
      }
    }
    return map;
  }, [orders]);

  const sucursalOrders = useMemo(
    () => orders.filter((o) => o.modalidad === "Recoge en Sucursal"),
    [orders]
  );

  const totalDomicilio = BLOCKS.reduce((acc, b) => acc + domicilioMap[b.id].length, 0);
  const totalOrders = orders.filter((o) => o.bloque).length;

  return { domicilioMap, sucursalOrders, totalDomicilio, totalOrders };
};
