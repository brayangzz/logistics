import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrderState } from "../models";

interface StateIndicatorProps {
  state: OrderState;
  isUrgent?: boolean;
}

export const StateIndicator = ({ state, isUrgent = false }: StateIndicatorProps) => {
  if (state === "N/A") {
    return (
      <div className="flex justify-center items-center w-6 h-6">
        <div className="w-2 h-0.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
    );
  }

  const isPendiente = state === "Pendiente";
  const isEnProceso = state === "En Proceso";
  const isListo = state === "Listo";

  return (
    <div className="flex justify-center items-center relative w-6 h-6 cursor-help group">
      {/* Halo for urgency (only on pending state) */}
      {isPendiente && isUrgent && (
        <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-red-400 opacity-75" />
      )}
      
      {/* En Proceso Pulse */}
      {isEnProceso && (
        <motion.span 
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inline-flex h-4 w-4 rounded-full bg-amber-400/50"
        />
      )}

      {/* Main Dot */}
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-125",
          isPendiente && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
          isEnProceso && "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
          isListo && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        )}
      />
      
      {/* Tooltip on hover */}
      <span className="absolute -top-8 scale-0 transition-transform rounded bg-gray-900 border border-white/10 p-2 text-xs text-white group-hover:scale-100 z-10 whitespace-nowrap shadow-lg backdrop-blur-sm shadow-black/50">
        {state}
      </span>
    </div>
  );
};
