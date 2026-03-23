"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  id?: string;
}

const DAYS_SHORT = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const MiniCalendar = ({ selectedDate, onDateChange, id }: MiniCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calcDropdownStyle = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const calendarWidth = Math.min(300, window.innerWidth - 16);
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;
    let left: number;
    if (spaceRight >= calendarWidth) {
      left = rect.left;
    } else if (spaceLeft >= calendarWidth) {
      left = rect.right - calendarWidth;
    } else {
      left = 8;
    }
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const maxH = spaceBelow >= 320 ? spaceBelow : Math.max(spaceAbove, spaceBelow);
    const top = spaceBelow >= 200 ? rect.bottom + 8 : rect.top - Math.min(360, spaceAbove) - 8;
    setDropdownStyle({
      position: "fixed",
      top,
      left,
      width: calendarWidth,
      maxHeight: maxH,
      overflowY: "auto",
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => calcDropdownStyle();
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen, calcDropdownStyle]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (days.length % 7 !== 0) days.push(null);

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);
    clicked.setHours(0, 0, 0, 0);
    if (selectedDate && selectedDate.getTime() === clicked.getTime()) {
      onDateChange(null);
    } else {
      onDateChange(clicked);
    }
    setIsOpen(false);
  };

  const displayLabel = selectedDate
    ? selectedDate.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Filtrar por fecha";

  return (
    <div ref={containerRef} className="relative" id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => { calcDropdownStyle(); setIsOpen((p) => !p); }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-[#155DFC]/40"
        style={{
          backgroundColor: selectedDate ? "var(--accent-bg)" : "var(--bg-input)",
          borderColor: isOpen
            ? "rgba(21,93,252,0.5)"
            : selectedDate
            ? "var(--accent-border)"
            : "var(--border-color)",
          color: selectedDate ? "#155DFC" : "var(--text-primary)",
          boxShadow: isOpen ? "0 0 0 3px rgba(21,93,252,0.08)" : "none",
        }}
      >
        <CalendarDays
          className="w-4 h-4 shrink-0"
          style={{ color: selectedDate ? "#155DFC" : "var(--text-secondary)" }}
        />
        <span className="flex-1 text-left whitespace-nowrap truncate">{displayLabel}</span>
        {selectedDate ? (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onDateChange(null);
            }}
            className="shrink-0 hover:opacity-60 transition-opacity cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
          </motion.span>
        )}
      </button>

      {/* Calendar Dropdown — fixed position to avoid overflow */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border p-4"
            style={{
              ...dropdownStyle,
              backgroundColor: "var(--calendar-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--dropdown-shadow)",
            }}
          >
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[#155DFC]/10 active:scale-90"
                style={{ color: "var(--text-secondary)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {MONTHS[month]}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{year}</p>
              </div>
              <button
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[#155DFC]/10 active:scale-90"
                style={{ color: "var(--text-secondary)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_SHORT.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold uppercase py-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {days.map((day, idx) => {
                if (day === null)
                  return <div key={`e-${idx}`} className="h-9" />;

                const thisDate = new Date(year, month, day);
                thisDate.setHours(0, 0, 0, 0);
                const isToday = thisDate.getTime() === today.getTime();
                const isSelected =
                  selectedDate &&
                  selectedDate.getTime() === thisDate.getTime();

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95"
                    )}
                    style={{
                      backgroundColor: isSelected
                        ? "#155DFC"
                        : isToday
                        ? "var(--calendar-today)"
                        : "transparent",
                      color: isSelected
                        ? "#FFFFFF"
                        : isToday
                        ? "#155DFC"
                        : "var(--text-primary)",
                      fontWeight: isToday || isSelected ? 700 : 500,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "var(--calendar-hover)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          isToday ? "var(--calendar-today)" : "transparent";
                      }
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between"
              style={{ borderColor: "var(--border-color)" }}
            >
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {selectedDate
                  ? `Filtrado: ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                  : "Selecciona un día"}
              </span>
              <button
                onClick={() => { onDateChange(null); setIsOpen(false); }}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-[#155DFC]/10"
                style={{ color: "var(--text-muted)" }}
              >
                Limpiar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
