"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Truck,
  LogOut,
  PackageSearch,
  Menu,
  X,
  Sun,
  Moon,
  ClipboardCheck,
  Gauge,
} from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
  {
    path: "/logistics",
    label: "Logística",
    icon: LayoutDashboard,
    matchPrefix: "/logistics",
    roles: ["logistica"],
  },
  {
    path: "/asignar",
    label: "Asignar",
    icon: ClipboardCheck,
    matchPrefix: "/asignar",
    roles: ["logistica"],
  },
  {
    path: "/unidades",
    label: "Unidades",
    icon: Gauge,
    matchPrefix: "/unidades",
    roles: ["logistica"],
  },
  {
    path: "/chofer",
    label: "Mis entregas",
    icon: Truck,
    matchPrefix: "/chofer",
    roles: ["chofer"],
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Topbar móvil ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-[40] flex items-center justify-between px-4 h-14 border-b"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          boxShadow: "0 1px 0 var(--border-color)",
        }}
      >
        {/* Botón hamburguesa */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>

        {/* Logo derecha */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_0_10px_rgba(21,93,252,0.3)] flex items-center justify-center shrink-0">
            <PackageSearch className="w-[14px] h-[14px] text-white" />
          </div>
          <span
            className="font-black text-sm tracking-widest uppercase"
            style={{
              background: "linear-gradient(to right, var(--text-primary), var(--text-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            COMPERS
          </span>
        </div>
      </div>

      {/* ── Drawer móvil ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] h-screen border-r flex flex-col overflow-hidden z-[60]"
              style={{
                backgroundColor: "var(--bg-sidebar)",
                borderColor: "var(--sidebar-border)",
                boxShadow: "10px 0 40px -10px rgba(0,0,0,0.5)",
              }}
            >
              <SidebarContent
                pathname={pathname}
                onClose={() => setIsOpen(false)}
                isMobile
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex relative w-[280px] h-screen border-r flex-col overflow-hidden z-[60]"
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderColor: "var(--sidebar-border)",
          boxShadow: "10px 0 30px -15px rgba(0,0,0,0.3)",
        }}
      >
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
};

const SidebarContent = ({
  pathname,
  onClose,
  isMobile = false,
}: {
  pathname: string;
  onClose?: () => void;
  isMobile?: boolean;
}) => {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const visibleItems = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="h-[72px] flex items-center justify-between px-5 border-b shrink-0"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#155DFC] to-blue-700 shadow-[0_0_15px_rgba(21,93,252,0.35)] flex items-center justify-center shrink-0">
            <PackageSearch className="w-[18px] h-[18px] text-white" />
          </div>
          <span
            className="font-black text-base tracking-widest uppercase"
            style={{
              background:
                "linear-gradient(to right, var(--text-primary), var(--text-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            COMPERS
          </span>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        <p
          className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Módulos
        </p>

        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.matchPrefix);

          return (
            <Link key={item.path} href={item.path} onClick={onClose}>
              <div
                className="relative flex items-center gap-3.5 w-full px-3.5 py-3 rounded-xl transition-all duration-200 group cursor-pointer"
                style={{
                  color: isActive ? "#FFFFFF" : "var(--text-muted)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: "#155DFC",
                      boxShadow: "0 4px 20px rgba(21,93,252,0.3)",
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {!isActive && (
                  <motion.div
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#155DFC" }}
                  />
                )}

                <div
                  className="relative z-10 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.15)"
                      : "var(--accent-bg)",
                  }}
                >
                  <item.icon
                    className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"
                    style={{ color: isActive ? "#FFFFFF" : "#155DFC" }}
                  />
                </div>
                <span className="relative z-10 font-semibold text-sm tracking-tight">
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/70"
                    layoutId="sidebar-active-dot"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-3 shrink-0">
        <div
          className="flex items-center justify-between p-3 rounded-xl border transition-all"
          style={{
            backgroundColor: "var(--bg-input)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDark
                  ? "rgba(21,93,252,0.15)"
                  : "rgba(245,158,11,0.12)",
              }}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-[#155DFC]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className="text-xs font-bold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {isDark ? "Modo Oscuro" : "Modo Claro"}
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Activo
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label="Cambiar tema"
            className="relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#155DFC]/40 shrink-0"
            style={{ backgroundColor: isDark ? "#155DFC" : "#CBD5E1" }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
              animate={{ left: isDark ? "22px" : "2px" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </button>
        </div>
      </div>

      {/* User Footer */}
      <div
        className="p-4 border-t shrink-0"
        style={{
          borderColor: "var(--sidebar-border)",
          backgroundColor: isDark
            ? "rgba(17,24,39,0.4)"
            : "rgba(241,245,249,0.6)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 shrink-0 flex items-center justify-center"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: isDark ? "#1E293B" : "#E2E8F0",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.initials ?? "??"}
            </span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span
              className="text-sm font-bold leading-tight truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.name ?? "Usuario"}
            </span>
            <span
              className="text-[11px] truncate"
              style={{ color: "var(--text-muted)" }}
            >
              {user?.roleLabel ?? ""}
            </span>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="group p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
          >
            <LogOut
              className="w-4 h-4 transition-colors duration-200 group-hover:text-red-400"
              style={{ color: "var(--text-muted)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
