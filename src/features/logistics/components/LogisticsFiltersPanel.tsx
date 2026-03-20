"use client";

import { Search, ArrowUpDown } from "lucide-react";
import { SortOrder, DateRange } from "../hooks/useLogisticsPageState";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { MiniCalendar } from "@/components/ui/MiniCalendar";

interface LogisticsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOrder;
  onSortChange: (value: SortOrder) => void;
  dateRange: DateRange;
  onDateChange: (value: DateRange) => void;
  selectedDate: Date | null;
  onCalendarDateChange: (date: Date | null) => void;
}

const SORT_OPTIONS = [
  { value: "Recientes", label: "Más recientes" },
  { value: "Antiguos", label: "Más antiguos" },
];

const DATE_RANGE_OPTIONS = [
  { value: "Todos", label: "Todas las fechas" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
];

export const LogisticsFiltersPanel = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  dateRange,
  onDateChange,
  selectedDate,
  onCalendarDateChange,
}: LogisticsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 mt-2 md:mt-0 flex-wrap">
      {/* Search Input */}
      <div className="relative group w-full sm:w-auto flex-1 md:flex-none">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[#155DFC]"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          id="search-orders"
          type="text"
          placeholder="Buscar factura o cliente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full sm:w-[260px] border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#155DFC]/40"
          style={{
            backgroundColor: "var(--bg-input)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
        {/* Sort Filter - Custom Select */}
        <div className="flex-1 sm:flex-none min-w-[150px]">
          <CustomSelect
            id="sort-select"
            value={sortBy}
            onChange={(v) => onSortChange(v as SortOrder)}
            options={SORT_OPTIONS}
            icon={<ArrowUpDown className="w-4 h-4" />}
          />
        </div>

        {/* Date Range - Custom Select */}
        <div className="flex-1 sm:flex-none min-w-[160px]">
          <CustomSelect
            id="date-range-select"
            value={dateRange}
            onChange={(v) => onDateChange(v as DateRange)}
            options={DATE_RANGE_OPTIONS}
          />
        </div>

        {/* Mini Calendar - Date Picker */}
        <div className="flex-1 sm:flex-none min-w-[180px]">
          <MiniCalendar
            id="calendar-picker"
            selectedDate={selectedDate}
            onDateChange={onCalendarDateChange}
          />
        </div>
      </div>
    </div>
  );
};
