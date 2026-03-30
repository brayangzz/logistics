"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // esperar hydration
    if (!user) {
      router.replace("/login");
      return;
    }
    
    if (user.role === "chofer")       router.replace("/chofer");
    else if (user.role === "guardia") router.replace("/autorizar");
    else if (user.role === "admin")   router.replace("/supervision");
    else                              router.replace("/logistics");
  }, [user, isLoading, router]);

  return null;
}
