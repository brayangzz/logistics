"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout";
import { useAuth } from "@/lib/AuthContext";
import type { ReactNode } from "react";

const ROLE_GUARD: Record<string, string[]> = {
  "/chofer":            ["chofer"],
  "/logistics2":        ["logistica"],
  "/logistics":         ["logistica"],
  "/asignar":           ["logistica"],
  "/unidades":          ["logistica"],
  "/autorizar":         ["logistica", "guardia"],
  "/supervision":       ["admin"],
  "/supervision/chofer":["admin"],
  "/caja":              ["caja"],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    if (!user) {
      hasRedirected.current = true;
      router.replace("/login");
      return;
    }

    for (const [route, roles] of Object.entries(ROLE_GUARD)) {
      if (pathname.startsWith(route) && !roles.includes(user.role)) {
        hasRedirected.current = true;
        router.replace(
          user.role === "chofer"  ? "/chofer"
          : user.role === "guardia" ? "/autorizar"
          : user.role === "admin"   ? "/supervision"
          : user.role === "caja"    ? "/caja"
          : "/logistics"
        );
        return;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user?.role, pathname]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div
      className="flex h-screen overflow-hidden selection:bg-[#155DFC]/30"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-0 scroll-smooth pt-14 md:pt-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% -20%, var(--radial-bg), transparent)",
          }}
        />
        {children}
      </main>
    </div>
  );
}
