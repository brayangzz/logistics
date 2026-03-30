"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Package, Truck, CheckCircle2,
  Search, ScanBarcode, X, Keyboard,
  FileText, Hash, CircleAlert, ScanLine,
} from "lucide-react";
import { Driver } from "../autorizar.types";

const SMOOTH = { type: "spring" as const, stiffness: 260, damping: 26 };

const ALMACEN_COLOR: Record<string, { color: string; bg: string }> = {
  Aluminio: { color: "#155DFC", bg: "rgba(21,93,252,0.12)" },
  Vidrio:   { color: "#0EA5E9", bg: "rgba(14,165,233,0.12)" },
  Herrajes: { color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
};

interface ScanModalProps {
  driver: Driver;
  onClose: () => void;
  onComplete: () => void;
}

export function ScanModal({ driver, onClose, onComplete }: ScanModalProps) {
  const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());
  const [currentCode, setCurrentCode] = useState("");
  const [inputMode, setInputMode] = useState<"scan" | "manual">("scan");
  const [scanResult, setScanResult] = useState<{ invoice: typeof driver.invoices[0]; isNew: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (inputRef.current && !scanResult && inputMode === "manual") {
      inputRef.current.focus();
    }
  }, [scanResult, inputMode]);

  const totalInvoices = driver.invoices.length;
  const scannedCount = scannedCodes.size;
  const allScanned = scannedCount === totalInvoices;
  const progress = totalInvoices > 0 ? (scannedCount / totalInvoices) * 100 : 0;

  const handleScan = useCallback((code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setError(null);
    const found = driver.invoices.find((inv) =>
      inv.code.toUpperCase() === trimmed ||
      inv.folio.toUpperCase() === trimmed ||
      inv.code.replace(/^FAC-/i, "") === trimmed ||
      inv.folio.replace(/^#/, "") === trimmed
    );
    if (!found) {
      setError(`Código "${trimmed}" no encontrado en las facturas de ${driver.name}`);
      setCurrentCode("");
      return;
    }
    if (scannedCodes.has(found.code)) {
      setError(`Factura ${found.folio} ya fue escaneada`);
      setScanResult({ invoice: found, isNew: false });
      setCurrentCode("");
      return;
    }
    setScanResult({ invoice: found, isNew: true });
    setScannedCodes((prev) => new Set(prev).add(found.code));
    setCurrentCode("");
  }, [driver, scannedCodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentCode.trim()) handleScan(currentCode);
  };

  const handleConfirmAuthorize = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1200));
    setConfirming(false);
    onComplete();
  };

  const accent = driver.avatar.bg;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={SMOOTH}
          className="w-full sm:max-w-lg max-h-[95vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-5" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-[12px] font-extrabold shrink-0"
                  style={{ backgroundColor: accent, color: "#fff", boxShadow: `0 4px 14px ${accent}45` }}
                >
                  {driver.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[15px] leading-tight truncate" style={{ color: "var(--text-primary)" }}>{driver.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    Verificar {totalInvoices} {totalInvoices === 1 ? "factura" : "facturas"} para autorizar
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                <X className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Progreso de escaneo</span>
                <motion.span
                  className="text-sm font-extrabold tabular-nums"
                  animate={{ color: allScanned ? "#10B981" : "var(--text-primary)" }}
                  transition={{ duration: 0.35 }}
                  style={{ color: "var(--text-primary)" }}
                >
                  {scannedCount}/{totalInvoices}
                </motion.span>
              </div>
              <div className="relative h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%`, backgroundColor: allScanned ? "#10B981" : "#155DFC" }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                />
              </div>
            </div>

            {/* Invoice Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {driver.invoices.map((inv) => {
                const isScanned = scannedCodes.has(inv.code);
                return (
                  <motion.div
                    key={inv.code} layout
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                    animate={{
                      backgroundColor: isScanned ? "rgba(16,185,129,0.15)" : "var(--bg-tertiary)",
                      borderColor: isScanned ? "rgba(16,185,129,0.4)" : "var(--border-color)",
                    }}
                    style={{ border: "1px solid var(--border-color)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div animate={{ scale: isScanned ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                      {isScanned
                        ? <CheckCircle2 className="w-3 h-3" style={{ color: "#10B981" }} />
                        : <FileText className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      }
                    </motion.div>
                    <span style={{ color: isScanned ? "#10B981" : "var(--text-secondary)" }}>{inv.folio}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Body (scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" style={{ overscrollBehavior: "contain" }}>
            {/* Mode Toggle */}
            <div className="flex rounded-2xl p-1" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
              {([
                { key: "scan" as const, label: "Escanear", icon: ScanBarcode },
                { key: "manual" as const, label: "Manual", icon: Keyboard },
              ]).map((mode) => {
                const isActive = inputMode === mode.key;
                return (
                  <button
                    key={mode.key}
                    onClick={() => { setInputMode(mode.key); setError(null); setScanResult(null); }}
                    className="relative flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-colors duration-200"
                    style={{ color: isActive ? "#fff" : "var(--text-muted)" }}
                  >
                    {isActive && (
                      <motion.div layoutId="scan-mode-pill" className="absolute inset-0 rounded-xl"
                        style={{ backgroundColor: "#155DFC" }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <mode.icon className="relative z-10 w-4 h-4" />
                    <span className="relative z-10">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="space-y-3">
              {inputMode === "scan" ? (
                <div className="space-y-3">
                  <motion.div
                    className="relative flex flex-col items-center justify-center py-8 rounded-2xl overflow-hidden"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "2px dashed var(--border-color)" }}
                    animate={{ borderColor: allScanned ? "#10B981" : "var(--border-color)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <ScanLine className="w-10 h-10 mb-3" style={{ color: allScanned ? "#10B981" : "#155DFC" }} />
                    </motion.div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {allScanned ? "Todas las facturas escaneadas" : "Escanear código de barras"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      {allScanned ? "Puedes autorizar la salida" : "Enfoca el lector en el código de la factura"}
                    </p>
                    <input
                      ref={inputRef} type="text" value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="absolute inset-0 opacity-0 cursor-default"
                      inputMode="none"
                    />
                    {!allScanned && (
                      <motion.div
                        className="absolute left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: "#155DFC", opacity: 0.5 }}
                        animate={{ top: ["30%", "70%", "30%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.div>
                  {currentCode && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-center font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Leyendo: {currentCode}...
                    </motion.p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <input
                      ref={inputRef} type="text" placeholder="Ej: FAC-1015 o #1015"
                      value={currentCode}
                      onChange={(e) => { setCurrentCode(e.target.value); setError(null); }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border focus:outline-none text-sm font-semibold"
                      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                      autoFocus
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleScan(currentCode)}
                    disabled={!currentCode.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-opacity"
                    style={{
                      backgroundColor: "#155DFC", color: "#fff",
                      opacity: currentCode.trim() ? 1 : 0.5,
                      boxShadow: currentCode.trim() ? "0 4px 16px rgba(21,93,252,0.3)" : "none",
                    }}
                  >
                    <Search className="w-4 h-4" />
                    Buscar Factura
                  </motion.button>
                </div>
              )}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && !scanResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <CircleAlert className="w-4 h-4 shrink-0" style={{ color: "#EF4444" }} />
                    <p className="text-sm font-semibold" style={{ color: "#EF4444" }}>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan Result */}
            <AnimatePresence mode="popLayout">
              {scanResult && (
                <motion.div
                  key={scanResult.invoice.code}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={SMOOTH}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)", border: `1px solid ${scanResult.isNew ? "rgba(16,185,129,0.4)" : "rgba(245,158,11,0.4)"}` }}
                >
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <div className="flex items-center gap-2">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}>
                        {scanResult.isNew
                          ? <CheckCircle2 className="w-5 h-5" style={{ color: "#10B981" }} />
                          : <CircleAlert className="w-5 h-5" style={{ color: "#F59E0B" }} />
                        }
                      </motion.div>
                      <span className="text-sm font-bold" style={{ color: scanResult.isNew ? "#10B981" : "#F59E0B" }}>
                        {scanResult.isNew ? "Factura verificada" : "Ya escaneada"}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => { setScanResult(null); setError(null); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                      <X className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                    </motion.button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(21,93,252,0.15)" }}>
                        <FileText className="w-3.5 h-3.5" style={{ color: "#155DFC" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>{scanResult.invoice.folio}</span>
                          <span className="text-xs font-semibold truncate" style={{ color: "var(--text-secondary)" }}>{scanResult.invoice.client}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {scanResult.invoice.almacenes.map((alm, ai) => {
                        const c = ALMACEN_COLOR[alm.nombre] ?? { color: "var(--text-secondary)", bg: "var(--bg-secondary)" };
                        return (
                          <motion.div key={alm.nombre} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + ai * 0.07, ...SMOOTH }}
                            className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                            <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: c.bg, borderBottom: "1px solid var(--border-color)" }}>
                              <Package className="w-3.5 h-3.5 shrink-0" style={{ color: c.color }} />
                              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: c.color }}>{alm.nombre}</span>
                              <span className="ml-auto text-[10px] font-extrabold tabular-nums px-1.5 py-0.5 rounded-md" style={{ backgroundColor: c.bg, color: c.color }}>
                                {alm.articulos.length} {alm.articulos.length === 1 ? "art." : "arts."}
                              </span>
                            </div>
                            {alm.articulos.map((art, idx) => (
                              <div key={idx} className="flex items-center gap-2.5 px-3 py-2"
                                style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: idx < alm.articulos.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                                <span className="text-[11px] font-extrabold tabular-nums w-5 text-center shrink-0" style={{ color: "var(--text-secondary)" }}>{art.cantidad}×</span>
                                <span className="text-xs font-semibold flex-1 truncate" style={{ color: "var(--text-primary)" }}>{art.descripcion}</span>
                                <span className="text-[11px] font-semibold shrink-0 tabular-nums" style={{ color: "var(--text-muted)" }}>{art.peso} kg</span>
                              </div>
                            ))}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scanned List */}
            <AnimatePresence>
              {scannedCount > 0 && !scanResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Facturas verificadas</span>
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                      {driver.invoices.filter((inv) => scannedCodes.has(inv.code)).map((inv, idx, arr) => (
                        <motion.div key={inv.code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3 px-3.5 py-2.5"
                          style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: idx < arr.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#10B981" }} />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{inv.folio}</span>
                            <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>{inv.client}</span>
                          </div>
                          <span className="text-xs font-semibold shrink-0" style={{ color: "var(--text-secondary)" }}>{inv.peso} kg</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-4 sm:p-5" style={{ borderTop: "1px solid var(--border-color)" }}>
            <motion.button
              whileHover={allScanned ? { scale: 1.015 } : {}}
              whileTap={allScanned ? { scale: 0.96 } : {}}
              disabled={!allScanned || confirming}
              onClick={handleConfirmAuthorize}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300"
              style={{
                backgroundColor: allScanned ? "#10B981" : "var(--bg-secondary)",
                color: allScanned ? "#fff" : "var(--text-muted)",
                boxShadow: allScanned ? "0 4px 20px rgba(16,185,129,0.35)" : "none",
                border: allScanned ? "none" : "1px solid var(--border-color)",
                cursor: allScanned ? "pointer" : "not-allowed",
              }}
            >
              {confirming ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Truck className="w-4 h-4" />
                  </motion.div>
                  <span>Autorizando salida...</span>
                </>
              ) : allScanned ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Autorizar Salida — {totalInvoices} facturas verificadas</span>
                </>
              ) : (
                <>
                  <ScanBarcode className="w-4 h-4" />
                  <span>Escanea {totalInvoices - scannedCount} {totalInvoices - scannedCount === 1 ? "factura" : "facturas"} restantes</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
