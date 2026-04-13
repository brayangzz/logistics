"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Unit, Driver } from "../unidades.types";
import { unidadesApi } from "../services/unidades.api";

interface UnidadesData {
  units:    Unit[];
  drivers:  Driver[];
  loading:  boolean;
  error:    string | null;
  setUnits: Dispatch<SetStateAction<Unit[]>>;
}

export function useUnidadesData(): UnidadesData {
  const [units,   setUnits]   = useState<Unit[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([unidadesApi.getUnits(), unidadesApi.getDrivers()])
      .then(([u, d]) => {
        if (cancelled) return;
        setUnits(u);
        setDrivers(d);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { units, drivers, loading, error, setUnits };
}
