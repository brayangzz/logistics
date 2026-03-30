"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Layers, Aperture, MapPin, Weight, Check, CheckCircle2, Save } from "lucide-react";
import { InvoiceItem } from "../../models";
import { ItemRow } from "./ItemRow";
import { LocationModal } from "../warehouse/LocationModal";

const WH_COLOR: Record<string, string> = { Herrajes: "#F59E0B", Aluminio: "#155DFC", Vidrio: "#10B981" };
const EASE = [0.22, 1, 0.36, 1] as const;
type SaveState = "idle" | "dirty" | "saved";

interface WarehouseCardProps {
  warehouse: string;
  items: InvoiceItem[];
  savedVerified: Record<string, boolean>;
  reportedItems: Record<string, number>;
  onCommit: (patch: Record<string, boolean>) => void;
}

export const WarehouseCard = ({ warehouse, items, savedVerified, reportedItems, onCommit }: WarehouseCardProps) => {
  const dot = WH_COLOR[warehouse] ?? "#155DFC";
  const [staged, setStaged] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, savedVerified[i.id] ?? false]))
  );
  const [saveAnim, setSaveAnim] = useState<"idle" | "saved">("idle");
  const [showMap, setShowMap] = useState(false);

  const hasDirty = items.some((i) => staged[i.id] !== (savedVerified[i.id] ?? false));
  const effectiveSave: SaveState = saveAnim === "saved" ? "saved" : hasDirty ? "dirty" : "idle";
  const savedCount = items.filter((i) => savedVerified[i.id]).length;
  const wDone = savedCount === items.length;
  const totalKg = items.reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);
  const savedKg = items.filter((i) => savedVerified[i.id]).reduce((s, i) => s + i.quantity * i.weightPerUnit, 0);
  const hasMap = (warehouse === "Aluminio" || warehouse === "Vidrio") && items.some((i) => i.section);

  const icon = (() => {
    if (warehouse === "Herrajes") return <Package className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
    if (warehouse === "Aluminio") return <Layers className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
    return <Aperture className="w-3.5 h-3.5 text-white" strokeWidth={2} />;
  })();

  const handleToggle = (id: string) => setStaged((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSave = () => {
    if (effectiveSave !== "dirty") return;
    const committed = { ...staged };
    onCommit(committed);
    setStaged(committed);
    setSaveAnim("saved");
    setTimeout(() => setSaveAnim("idle"), 1600);
  };

  return (
    <>
      <div className="rounded-2xl border flex flex-col" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--table-header-bg)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: dot }}>
              {icon}
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>{warehouse}</span>
            {hasMap && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowMap(true)}
                className="w-6 h-6 rounded-lg flex items-center justify-center focus:outline-none"
                style={{ backgroundColor: `${dot}18`, border: `1px solid ${dot}44` }}
                title="Ver ubicación"
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: dot }} strokeWidth={2.5} />
              </motion.button>
            )}
          </div>

          <div className="w-[76px] flex justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {wDone ? (
                <motion.div key="listo" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.15, ease: EASE }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#16A34A" }}>
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold text-white">Listo</span>
                </motion.div>
              ) : (
                <motion.div key="count" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.88 }} transition={{ duration: 0.15, ease: EASE }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${dot}22`, color: dot }}>
                  {savedCount}/{items.length}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-3 flex flex-col gap-2 flex-1">
          {items.map((item) => (
            <ItemRow
              key={item.id} item={item}
              isStaged={staged[item.id] ?? false}
              isSaved={savedVerified[item.id] ?? false}
              reportedQty={reportedItems[item.id]}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>

        <div className="mx-3 mb-3 px-3.5 py-2 rounded-xl flex items-center justify-between"
          style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-1.5">
            <Weight className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} strokeWidth={2} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Peso verificado</span>
          </div>
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {savedKg.toFixed(1)}{" "}<span className="font-medium" style={{ color: "var(--text-secondary)" }}>/ {totalKg.toFixed(1)} kg</span>
          </span>
        </div>

        <motion.div
          className="px-3 overflow-hidden"
          animate={{ height: effectiveSave === "idle" ? 0 : "auto", paddingBottom: effectiveSave === "idle" ? 0 : 12 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {effectiveSave === "saved" ? (
              <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                <Check className="w-4 h-4" strokeWidth={2.5} /> Guardado
              </motion.div>
            ) : effectiveSave === "dirty" ? (
              <motion.button key="dirty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
                onClick={handleSave} whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
                style={{ backgroundColor: "#155DFC", color: "#fff", border: "none", cursor: "pointer" }}>
                <Save className="w-4 h-4" strokeWidth={2} /> Guardar cambios
              </motion.button>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {showMap && <LocationModal warehouse={warehouse} items={items} onClose={() => setShowMap(false)} />}
    </>
  );
};
