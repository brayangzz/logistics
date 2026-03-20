"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  icon,
  className,
  id,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 w-full focus:outline-none focus:ring-2 focus:ring-[#155DFC]/40"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: isOpen ? "rgba(21,93,252,0.5)" : "var(--border-color)",
          color: "var(--text-primary)",
          boxShadow: isOpen ? "0 0 0 3px rgba(21,93,252,0.1)" : "none",
        }}
      >
        {icon && (
          <span style={{ color: isOpen ? "#155DFC" : "var(--text-secondary)" }} className="transition-colors shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            className="absolute top-full left-0 mt-2 min-w-full w-max z-[100] rounded-xl border overflow-hidden"
            style={{
              backgroundColor: "var(--dropdown-bg)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--dropdown-shadow)",
            }}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-left transition-colors relative"
                  style={{
                    color: isSelected ? "#155DFC" : "var(--text-primary)",
                    backgroundColor: isSelected ? "var(--accent-bg)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--select-option-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {option.icon && <span className="shrink-0">{option.icon}</span>}
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-[#155DFC]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
