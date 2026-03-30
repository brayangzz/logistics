"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { MiniCalendar } from "@/components/ui/MiniCalendar";
import type { FilterBucket } from "@/features/logistics/hooks/useAnticipatedFiltering";

const FILTER_PILLS: { value: FilterBucket; label: string; dotColor: string; dotGlow: string }[] = [
  { value: "Todos",      label: "Todos",      dotColor: "#3B82F6", dotGlow: "rgba(59,130,246,0.6)"  },
  { value: "Pendiente",  label: "Pendiente",  dotColor: "#EF4444", dotGlow: "rgba(239,68,68,0.6)"   },
  { value: "En Proceso", label: "En Proceso", dotColor: "#F59E0B", dotGlow: "rgba(245,158,11,0.6)"  },
  { value: "Listo",      label: "Listo",      dotColor: "#10B981", dotGlow: "rgba(16,185,129,0.6)"  },
];

interface Props {
  bucket: FilterBucket;
  setBucket: (v: FilterBucket) => void;
  search: string;
  setSearch: (v: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
}

export function AnticipatedFilterRow({ bucket, setBucket, search, setSearch, selectedDate, setSelectedDate }: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">

      {/* Filter pills */}
      <div
        className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border relative z-10 w-full md:w-max"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        {FILTER_PILLS.map(pill => {
          const isActive = bucket === pill.value;
          return (
            <button
              key={pill.value}
              onClick={() => setBucket(pill.value)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 flex-1 md:flex-none justify-center md:justify-start focus:outline-none"
              style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="ant-legend-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: "var(--accent-bg)", outline: "1px solid var(--accent-border)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!isActive && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-150"
                  style={{ backgroundColor: "var(--select-option-hover)" }}
                  aria-hidden
                />
              )}
              <span
                className="relative z-10 w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: pill.dotColor,
                  boxShadow: isActive ? `0 0 8px ${pill.dotGlow}` : "none",
                }}
              />
              <span className="relative z-10 whitespace-nowrap">{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search + Calendar */}
      <div className="flex-1 flex justify-start lg:justify-end">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 md:mt-0 flex-wrap">
          <div className="relative group w-full sm:w-auto flex-1 md:flex-none">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[#155DFC]"
              style={{ color: "var(--text-secondary)" }}
            />
            <input
              type="text"
              placeholder="Buscar factura o cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-[260px] border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#155DFC]/40"
              style={{
                backgroundColor: "var(--bg-input)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none min-w-[180px]">
              <MiniCalendar id="ant-calendar" selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
