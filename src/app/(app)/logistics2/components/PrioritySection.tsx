"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Store } from "lucide-react";
import { InvoiceRow } from "./InvoiceRow";
import type { Order } from "../logistics2.types";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

interface PrioritySectionProps {
  orders: Order[];
}

export const PrioritySection = ({ orders }: PrioritySectionProps) => {
  if (orders.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[20px]"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
        >
          <Store className="w-4 h-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Recoge en Sucursal
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {orders.length} {orders.length === 1 ? "factura" : "facturas"} para recolección
          </p>
        </div>
        <span
          className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
          }}
        >
          {orders.length}
        </span>
      </div>

      <div className="p-4 grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {orders.map((order, i) => (
            <InvoiceRow key={order.id} order={order} index={i} showBlock />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
