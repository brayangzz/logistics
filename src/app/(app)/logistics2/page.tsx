"use client";

import { useState } from "react";
import { LayoutGrid, Truck, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PrioritySection } from "./components/PrioritySection";
import { RegionalGrid } from "./components/RegionalGrid";
import { useLogistics2Data } from "./hooks/useLogistics2Data";
import { BLOCKS } from "./logistics2.types";
import { cn } from "@/lib/utils";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

type Tab = "domicilio" | "sucursal";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "domicilio", label: "Envío a Domicilio", icon: Truck  },
  { id: "sucursal",  label: "Recoge en Sucursal", icon: Store },
];

export default function Logistics2Page() {
  const { domicilioMap, sucursalOrders, totalDomicilio, totalOrders } = useLogistics2Data();
  const [tab, setTab] = useState<Tab>("domicilio");

  const counts: Record<Tab, number> = {
    domicilio: totalDomicilio,
    sucursal:  sucursalOrders.length,
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative z-10">

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#155DFC,#2563EB)",
              boxShadow: "0 0 20px rgba(21,93,252,0.28)",
            }}
          >
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Logística 2
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {totalOrders} pedidos registrados · {sucursalOrders.length} recogen en sucursal
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 p-1 rounded-2xl w-fit"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <motion.button
                key={id}
                onClick={() => setTab(id)}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn("relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold")}
                style={{
                  color: active ? "#fff" : "var(--text-secondary)",
                  backgroundColor: active ? "#155DFC" : "transparent",
                  transition: "background-color 180ms cubic-bezier(0.23,1,0.32,1), color 180ms cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                <span>{label}</span>
                <span
                  className="text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.18)" : "var(--bg-tertiary)",
                    color: active ? "#fff" : "var(--text-muted)",
                    transition: "background-color 180ms cubic-bezier(0.23,1,0.32,1), color 180ms cubic-bezier(0.23,1,0.32,1)",
                  }}
                >
                  {counts[id]}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Contenido */}
        <AnimatePresence mode="popLayout">
          {tab === "domicilio" ? (
            <motion.div
              key="domicilio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <RegionalGrid blocks={BLOCKS} blockMap={domicilioMap} total={totalDomicilio} />
            </motion.div>
          ) : (
            <motion.div
              key="sucursal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <PrioritySection orders={sucursalOrders} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
