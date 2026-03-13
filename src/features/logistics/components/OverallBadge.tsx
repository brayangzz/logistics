import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderState } from "../models";

interface OverallBadgeProps {
  state: OrderState;
}

export const OverallBadge = ({ state }: OverallBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-300",
        state === "Pendiente" && "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
        state === "En Proceso" && "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        state === "Listo" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        state === "N/A" && "bg-white/5 text-gray-400 border-white/10"
      )}
    >
      {state === "Pendiente" && (
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
      )}
      {state === "En Proceso" && (
        <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2 animate-spin text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
      )}
      {state === "Listo" && (
        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
      )}
      {state}
    </div>
  );
};
