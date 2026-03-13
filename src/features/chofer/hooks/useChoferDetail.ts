"use client";

import { useState, useEffect } from "react";
import { ChoferRoute } from "../models";
import { choferApi } from "../services";

export const useChoferRouteHook = () => {
  const [data, setData] = useState<ChoferRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const detail = await choferApi.getRouteDetails();
        if (mounted) setData(detail);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : "Error obteniendo datos de ruta.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
};
