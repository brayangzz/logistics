"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Truck, LogOut, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    path: "/logistics",
    label: "Logística",
    icon: LayoutDashboard,
  },
  {
    path: "/chofer",
    label: "Rutas y Envíos",
    icon: Truck,
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Botón de Hamburguesa (Solo visible en Móvil) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[40] w-12 h-12 rounded-xl bg-[#111827] border border-slate-700/50 flex items-center justify-center text-white shadow-lg shadow-black/20 hover:bg-[#1E293B] transition-all group"
      >
        <LayoutDashboard className="w-5 h-5 text-slate-300 group-hover:text-[#155DFC] transition-colors" />
      </button>

      {/* Fondo oscuro al abrir el menú (Solo visible en Móvil) */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar - Fijo en Desktop, deslizable en Móvil */}
      <aside
        className={cn(
          "fixed lg:relative left-0 top-0 bottom-0 w-[280px] h-screen bg-[#0B1120] border-r border-slate-800 flex flex-col justify-between overflow-hidden shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] z-[60] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* Cabecera / Logo */}
        <div className="h-24 flex items-center px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_0_15px_rgba(21,93,252,0.3)] flex items-center justify-center shrink-0">
              <PackageSearch className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 text-xl tracking-wider uppercase">
              COMPERS
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                <div
                  className={cn(
                    "relative flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer",
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:bg-[#111827] hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-pill"
                      className="absolute inset-0 bg-[#155DFC] rounded-xl shadow-[0_4px_15px_rgba(21,93,252,0.25)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="relative z-10 shrink-0">
                    <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  </div>
                  <span className="relative z-10 font-semibold text-sm">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Pie del Sidebar (Usuario) */}
        <div className="p-6 border-t border-slate-800/80 bg-[#111827]/30">
          <div className="flex items-center gap-3 rounded-2xl transition-colors cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0 flex items-center justify-center overflow-hidden relative">
              <span className="text-sm font-bold text-slate-200">AD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">Admin User</span>
              <span className="text-xs text-slate-400">Administrador</span>
            </div>
            <LogOut className="w-5 h-5 text-slate-500 hover:text-red-400 ml-auto transition-colors duration-300" />
          </div>
        </div>

      </aside>
    </>
  );
};