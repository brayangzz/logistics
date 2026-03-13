"use client";

import { Search, Calendar, ArrowUpDown, ChevronDown } from "lucide-react";
import { SortOrder, DateRange } from "../hooks/useLogisticsPageState";
import { cn } from "@/lib/utils";

interface LogisticsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOrder;
  onSortChange: (value: SortOrder) => void;
  dateRange: DateRange;
  onDateChange: (value: DateRange) => void;
}

export const LogisticsFiltersPanel = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  dateRange,
  onDateChange
}: LogisticsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 mt-2 md:mt-0">
      {/* Search Input */}
      <div className="relative group w-full sm:w-auto flex-1 md:flex-none">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#155DFC] transition-colors" />
        <input
          type="text"
          placeholder="Buscar factura o cliente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full sm:w-[280px] bg-[#1E293A]/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/50 focus:border-[#155DFC]/50 transition-all backdrop-blur-md shadow-inner"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Sort Filter */}
        <div className="relative w-full sm:w-auto flex-1">
          <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="appearance-none pl-10 pr-10 py-2.5 w-full sm:w-[140px] bg-[#1E293A]/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#155DFC]/50 focus:border-[#155DFC]/50 transition-all backdrop-blur-md shadow-inner cursor-pointer"
          >
            <option value="Recientes">Recientes</option>
            <option value="Antiguos">Antiguos</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative w-full sm:w-auto flex-1">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <select
            value={dateRange}
            onChange={(e) => onDateChange(e.target.value as DateRange)}
            className="appearance-none pl-10 pr-10 py-2.5 w-full sm:w-[160px] bg-[#1E293A]/50 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#155DFC]/50 focus:border-[#155DFC]/50 transition-all backdrop-blur-md shadow-inner cursor-pointer"
          >
            <option value="Todos">Todas las fechas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
