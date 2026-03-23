"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout";
import { useAuth } from "@/lib/AuthContext";
import type { ReactNode } from "react";

const ROLE_GUARD: Record<string, string[]> = {
  "/chofer":    ["chofer"],
  "/logistics": ["logistica"],
  "/asignar":   ["logistica"],
  "/unidades":  ["logistica"],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    if (!user) {
      hasRedirected.current = true;
      router.replace("/login");
      return;
    }

    for (const [route, roles] of Object.entries(ROLE_GUARD)) {
      if (pathname.startsWith(route) && !roles.includes(user.role)) {
        hasRedirected.current = true;
        router.replace(user.role === "chofer" ? "/chofer" : "/logistics");
        return;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, pathname]);

  if (!user) return null;

  return (
    <div
      className="flex h-screen overflow-hidden selection:bg-[#155DFC]/30"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-0 scroll-smooth pt-14 lg:pt-0">
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
