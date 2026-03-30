"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, MapPin, ChevronDown, X, Users, Check, Loader2 } from "lucide-react";
import type { Block, Driver } from "./asignar.types";

export const BLOCKS: Block[] = [
  {
    id: "b1",
    name: "Bloque Norte",
    zone: "Escobedo · García · Salinas",
    color: "#155DFC",
    bg: "rgba(21,93,252,0.10)",
    border: "rgba(21,93,252,0.25)",
    drivers: [
      { id:"d1", name:"Carlos Mendoza",  initials:"CM", phone:"81 2345 6789", color:"#155DFC", bg:"rgba(21,93,252,0.12)"  },
      { id:"d2", name:"Roberto Salinas", initials:"RS", phone:"81 3456 7890", color:"#3B82F6", bg:"rgba(59,130,246,0.12)" },
      { id:"d3", name:"Miguel Torres",   initials:"MT", phone:"81 4567 8901", color:"#60A5FA", bg:"rgba(96,165,250,0.12)" },
    ],
  },
  {
    id: "b2",
    name: "Bloque Sur",
    zone: "Guadalupe · Cadereyta · Allende",
    color: "#10B981",
    bg: "rgba(16,185,129,0.10)",
    border: "rgba(16,185,129,0.25)",
    drivers: [
      { id:"d4", name:"Fernando Vega",  initials:"FV", phone:"81 5678 9012", color:"#10B981", bg:"rgba(16,185,129,0.12)" },
      { id:"d5", name:"Alejandro Ruiz", initials:"AR", phone:"81 6789 0123", color:"#34D399", bg:"rgba(52,211,153,0.12)" },
    ],
  },
  {
    id: "b3",
    name: "Bloque Centro",
    zone: "MTY Centro · San Nicolás · Apodaca",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    drivers: [
      { id:"d6", name:"Javier Morales",  initials:"JM", phone:"81 7890 1234", color:"#F59E0B", bg:"rgba(245,158,11,0.12)" },
      { id:"d7", name:"Luis Hernández",  initials:"LH", phone:"81 8901 2345", color:"#FBBF24", bg:"rgba(251,191,36,0.12)" },
      { id:"d8", name:"Pedro Castro",    initials:"PC", phone:"81 9012 3456", color:"#D97706", bg:"rgba(217,119,6,0.12)"  },
    ],
  },
  {
    id: "b4",
    name: "Bloque Poniente",
    zone: "San Pedro · Santa Catarina · Monterrey Ote",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.10)",
    border: "rgba(139,92,246,0.25)",
    drivers: [
      { id:"d9",  name:"Ernesto Gómez", initials:"EG", phone:"81 0123 4567", color:"#8B5CF6", bg:"rgba(139,92,246,0.12)" },
      { id:"d10", name:"Samuel Díaz",   initials:"SD", phone:"81 1234 5678", color:"#A78BFA", bg:"rgba(167,139,250,0.12)" },
    ],
  },
];

interface BlockSelectorProps {
  orderId: string;
  currentBlock?: string;
  currentDriver?: string;
  onAssign: (orderId: string, blockId: string, driverId: string) => void;
}

export function BlockSelector({ orderId, currentBlock, currentDriver, onAssign }: BlockSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(
    currentBlock ? (BLOCKS.find(b => b.id === currentBlock) ?? null) : null,
  );
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    if (!selectedBlock) return;
    setSaving(true);
    setTimeout(() => {
      onAssign(orderId, selectedBlock.id, driver.id);
      setSaving(false);
      setOpen(false);
    }, 600);
  };

  const blockData  = currentBlock  ? BLOCKS.find(b => b.id === currentBlock) : null;
  const driverData = blockData && currentDriver ? blockData.drivers.find(d => d.id === currentDriver) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/30"
        style={{
          backgroundColor: blockData ? blockData.bg : "var(--bg-input)",
          borderColor:     blockData ? blockData.border : "var(--border-color)",
          color:           blockData ? blockData.color : "var(--text-muted)",
        }}
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : blockData ? (
          <MapPin className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Truck className="w-3.5 h-3.5 shrink-0" />
        )}
        <span className="whitespace-nowrap max-w-[100px] truncate">
          {driverData ? driverData.name.split(" ")[0] : blockData ? blockData.name : "Asignar"}
        </span>
        {blockData && driverData && (
          <span className="hidden sm:block text-[9px] opacity-70 font-mono">{driverData.initials}</span>
        )}
        <ChevronDown
          className="w-3 h-3 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50 rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--dropdown-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--dropdown-shadow)",
              width: "clamp(280px, 90vw, 360px)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#155DFC] to-blue-700 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                  Asignar Bloque &amp; Chofer
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-muted)" }}>
                  1. Selecciona un bloque
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {BLOCKS.map(block => {
                    const isSelected = selectedBlock?.id === block.id;
                    return (
                      <button
                        key={block.id}
                        onClick={() => setSelectedBlock(block)}
                        className="relative text-left p-2.5 rounded-xl border transition-all duration-150 focus:outline-none group"
                        style={{
                          backgroundColor: isSelected ? block.bg : "transparent",
                          borderColor: isSelected ? block.border : "var(--border-color)",
                        }}
                      >
                        {!isSelected && (
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: block.bg + "60" }}
                          />
                        )}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-0.5">
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: isSelected ? block.color : "var(--text-primary)" }}
                            >
                              {block.name}
                            </span>
                            {isSelected && <Check className="w-3 h-3" style={{ color: block.color }} />}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" style={{ color: "var(--text-muted)" }} />
                            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                              {block.drivers.length} choferes
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {selectedBlock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t pt-3" style={{ borderColor: "var(--border-color)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--text-muted)" }}>
                        2. Selecciona un chofer —{" "}
                        <span style={{ color: selectedBlock.color }}>{selectedBlock.name}</span>
                      </p>
                      <div className="space-y-1">
                        {selectedBlock.drivers.map(driver => {
                          const isCurrent = driver.id === currentDriver && selectedBlock.id === currentBlock;
                          return (
                            <button
                              key={driver.id}
                              onClick={() => handleDriverSelect(driver)}
                              disabled={saving}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-150 focus:outline-none group text-left disabled:opacity-50"
                              style={{
                                backgroundColor: isCurrent ? selectedBlock.bg : "transparent",
                                borderColor: isCurrent ? selectedBlock.border : "var(--border-color)",
                              }}
                              onMouseEnter={e => {
                                if (!isCurrent) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                              }}
                              onMouseLeave={e => {
                                if (!isCurrent) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ backgroundColor: driver.bg, color: driver.color, outline: `1px solid ${driver.color}30` }}
                              >
                                {driver.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                  {driver.name}
                                </p>
                                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{driver.phone}</p>
                              </div>
                              {isCurrent ? (
                                <Check className="w-4 h-4 shrink-0" style={{ color: selectedBlock.color }} />
                              ) : (
                                <div
                                  className="w-6 h-6 rounded-lg border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{ borderColor: selectedBlock.border, backgroundColor: selectedBlock.bg }}
                                >
                                  <Check className="w-3 h-3" style={{ color: selectedBlock.color }} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedBlock && (
                <p className="text-center text-xs py-2" style={{ color: "var(--text-muted)" }}>
                  Selecciona un bloque para ver sus choferes disponibles
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
