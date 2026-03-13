"use client";

import { useState, useEffect } from "react";
import { Order } from "../models";
import { logisticsApi } from "../services";

// Hook diseñado para la carga remota de datos (Data Fetching), separado de la UI local
export const useLogisticsQuery = () => {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Aquí interactuaría con httpClient, pero usamos el mockApi directo
        const orders = await logisticsApi.getOrders();
        if (mounted) setData(orders);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    // Devolvemos el método de refresco por si se quiere re-cargar la data manual
    refetch: () => logisticsApi.getOrders().then(setData).catch(console.error)
  };
};
