"use client";

import { useState, useRef, useCallback } from "react";
import { ToastData } from "../asignar.types";

export const useToastManager = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastCounter = useRef(0);

  const handleToast = useCallback((invoice: string, driverName: string) => {
    const id = ++toastCounter.current;
    setToasts(prev => [...prev, { id, invoice, driverName }]);
  }, []);

  const dismissToast = useCallback((id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id))
  , []);

  return { toasts, handleToast, dismissToast };
};
