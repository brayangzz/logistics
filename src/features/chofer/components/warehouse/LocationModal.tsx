"use client";

import { useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Layers, Aperture, X } from "lucide-react";
import { InvoiceItem } from "../../models";
import { AluminioMap } from "./AluminioMap";
import { VidrioMap } from "./VidrioMap";

const WH_COLOR: Record<string, string> = { Herrajes: "#F59E0B", Aluminio: "#155DFC", Vidrio: "#10B981" };
const EASE = [0.22, 1, 0.36, 1] as const;

interface LocationModalProps {
  warehouse: string;
  items: InvoiceItem[];
  onClose: () => void;
}

export const LocationModal = ({ warehouse, items, onClose }: LocationModalProps) => {
  const dot = WH_COLOR[warehouse] ?? "#155DFC";
  const activeSections = useMemo(
    () => new Set(items.map((i) => i.section).filter(Boolean) as string[]),
    [items]
  );

  const icon = (() => {
    if (warehouse === "Herrajes") return <Package className="w-4 h-4 text-white" strokeWidth={2} />;
    if (warehouse === "Aluminio") return <Layers className="w-4 h-4 text-white" strokeWidth={2} />;
    return <Aperture className="w-4 h-4 text-white" strokeWidth={2} />;
  })();

  const modal = (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.24, ease: EASE }}
          className="w-full max-w-sm rounded-3xl border flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b shrink-0"
            style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: dot }}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Ubicación · {warehouse === "Aluminio" ? "Árbol" : warehouse}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  {activeSections.size > 0
                    ? `Sección${activeSections.size > 1 ? "es" : ""}: ${[...activeSections].join(", ")}`
                    : "Sin sección asignada"}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }} onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center focus:outline-none"
              style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}
            >
              <X className="w-4 h-4" style={{ color: "var(--text-primary)" }} strokeWidth={2.5} />
            </motion.button>
          </div>

          <div className="p-5 pb-6">
            {warehouse === "Aluminio" && <AluminioMap activeSections={activeSections} />}
            {warehouse === "Vidrio" && <VidrioMap activeSections={activeSections} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
};
