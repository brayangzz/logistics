"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { InvoiceRow } from "./InvoiceRow";
import type { Block, Order } from "../logistics2.types";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

interface BlockCardProps {
  block: Block;
  orders: Order[];
  index: number;
}

export const BlockCard = ({ block, orders, index }: BlockCardProps) => {
  const isEmpty = orders.length === 0;
  const accent = block.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isEmpty ? 0.38 : 1, y: 0 }}
      transition={{ ...SMOOTH, delay: Math.min(index * 0.06, 0.22) }}
      /* Outer shell — doble-bezel */
      className="flex flex-col rounded-[22px] p-[3px]"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Inner core */}
      <div
        className="flex flex-col flex-1 rounded-[19px] overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: "var(--text-muted)" }}
            >
              Bloque
            </span>
            <span
              className="font-extrabold leading-none tracking-tight"
              style={{
                color: isEmpty ? "var(--text-muted)" : "var(--text-primary)",
                fontSize: "1.35rem",
              }}
            >
              {block.name}
            </span>
          </div>

          {/* Count pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <span
              className="text-xs font-extrabold tabular-nums leading-none"
              style={{ color: isEmpty ? "var(--text-muted)" : "var(--text-primary)" }}
            >
              {orders.length}
            </span>
            <span
              className="text-[10px] leading-none"
              style={{ color: "var(--text-muted)" }}
            >
              {orders.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>
        </div>

        {/* Facturas */}
        <div
          className="flex flex-col p-4 flex-1 overflow-y-auto"
          style={{ maxHeight: 520 }}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-2.5 py-10 select-none">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
              >
                <Package className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Sin pedidos pendientes
              </span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {orders.map((order, i) => (
                <div key={order.id} className="flex flex-col">
                  {i > 0 && (
                    <div className="flex items-center gap-2 px-1 my-3">
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--border-hover)" }} />
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--border-color)" }} />
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--border-hover)" }} />
                      </div>
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-color)" }} />
                    </div>
                  )}
                  <InvoiceRow order={order} index={i} accent={accent} />
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};
