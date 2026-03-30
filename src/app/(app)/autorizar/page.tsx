"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, CalendarDays, CheckCircle2, Truck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { autorizarDrivers } from "@/data";
import { Driver, FilterTab } from "./autorizar.types";
import { ScanModal } from "./components/ScanModal";
import { AuthDriverCard } from "./components/AuthDriverCard";

const DRIVERS: Driver[] = autorizarDrivers as Driver[];

export default function AutorizarPage() {
  const [authorizedDrivers, setAuthorizedDrivers] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard]             = useState<string | null>(null);
  const [activeTab, setActiveTab]                 = useState<FilterTab>("pendientes");
  const [search, setSearch]                       = useState("");
  const [searchFocused, setSearchFocused]         = useState(false);
  const [scanningDriver, setScanningDriver]       = useState<Driver | null>(null);

  const today = format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es });
  const pendienteCount = DRIVERS.filter((d) => !authorizedDrivers.has(d.id)).length;
  const enRutaCount    = authorizedDrivers.size;

  const handleScanComplete = () => {
    if (scanningDriver) {
      setAuthorizedDrivers((prev) => new Set(prev).add(scanningDriver.id));
      setScanningDriver(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return DRIVERS.filter((d) => {
      const matchTab = activeTab === "pendientes" ? !authorizedDrivers.has(d.id) : authorizedDrivers.has(d.id);
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.destinos.some((dest) => dest.toLowerCase().includes(q));
      return matchTab && matchSearch;
    });
  }, [activeTab, authorizedDrivers, search]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="w-full space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0"
              style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 0 20px rgba(21,93,252,0.28)" }}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
                Autorizar Salida
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>{pendienteCount} pendientes</span>
                {enRutaCount > 0 && <span style={{ color: "var(--text-secondary)" }}> · {enRutaCount} en ruta</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl w-fit"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#155DFC,#2563EB)", boxShadow: "0 0 12px rgba(21,93,252,0.25)" }}>
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Fecha de hoy</p>
              <p className="text-sm font-bold capitalize leading-tight" style={{ color: "var(--text-primary)" }}>{today}</p>
            </div>
          </div>
        </div>

        {/* Filtros + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex rounded-2xl p-1 shrink-0"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            {([
              { key: "pendientes", label: "Pendientes", count: pendienteCount, dot: "#F59E0B" },
              { key: "en_ruta",    label: "En ruta",    count: enRutaCount,    dot: "#10B981" },
            ] as { key: FilterTab; label: string; count: number; dot: string }[]).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200"
                  style={{ color: isActive ? "#fff" : "var(--text-muted)" }}>
                  {isActive && (
                    <motion.div layoutId="autorizar-tab-pill" className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: "#155DFC" }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative z-10 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: isActive ? "#fff" : tab.dot }} />
                  <span className="relative z-10">{tab.label}</span>
                  <span className="relative z-10 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold tabular-nums"
                    style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--border-color)", color: isActive ? "#fff" : "var(--text-secondary)" }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center w-full md:max-w-md rounded-2xl transition-all duration-200"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(21,93,252,0.14)" : "none" }}>
            <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input
              type="text" placeholder="Buscar chofer o destino..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border focus:outline-none text-sm"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: searchFocused ? "#155DFC" : "var(--border-color)", color: "var(--text-primary)", transition: "border-color 0.15s ease" }}
            />
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                  {activeTab === "en_ruta"
                    ? <Truck className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                    : <ShieldCheck className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                  }
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                  {activeTab === "en_ruta" ? "No hay choferes en ruta aún" : "Todos los choferes autorizados"}
                </p>
              </motion.div>
            ) : (
              filtered.map((driver, index) => (
                <motion.div key={driver.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.28, delay: index * 0.05 }}
                  className="flex flex-col h-full">
                  <AuthDriverCard
                    driver={driver}
                    isAuthorized={authorizedDrivers.has(driver.id)}
                    isHovered={hoveredCard === driver.id}
                    onHoverStart={() => setHoveredCard(driver.id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    onScan={() => setScanningDriver(driver)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <AnimatePresence>
          {enRutaCount > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className="flex items-center justify-center gap-2 py-3">
              <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
              <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                {enRutaCount} de {DRIVERS.length} choferes en ruta
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {scanningDriver && (
        <ScanModal
          driver={scanningDriver}
          onClose={() => setScanningDriver(null)}
          onComplete={handleScanComplete}
        />
      )}
    </div>
  );
}
