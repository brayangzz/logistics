"use client";

import { useState, useEffect, useRef } from "react";
import { Unit, UnitStatus } from "../unidades.types";

export const useUnitCard = (unit: Unit, onUpdate: (id: string, patch: Partial<Unit>) => void) => {
  const [pendingId,  setPendingId]  = useState<string | null>(null);
  const [open,       setOpen]       = useState(false);
  const [editMode,   setEditMode]   = useState(false);
  const [localGas,   setLocalGas]   = useState(unit.gasolina);
  const [localMaint, setLocalMaint] = useState(unit.estado === "mantenimiento");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalGas(unit.gasolina);
    setLocalMaint(unit.estado === "mantenimiento");
  }, [unit.gasolina, unit.estado]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSave = () => {
    if (pendingId) {
      const newEstado: UnitStatus = localMaint ? "mantenimiento" : "asignado";
      onUpdate(unit.id, { choferId: pendingId, estado: newEstado });
      setPendingId(null);
      setOpen(false);
    }
  };

  const handleEditSave = () => {
    const newEstado: UnitStatus = localMaint
      ? "mantenimiento"
      : unit.choferId ? "asignado" : "disponible";
    onUpdate(unit.id, { estado: newEstado });
    setEditMode(false);
  };

  const handleEditCancel = () => {
    setLocalGas(unit.gasolina);
    setLocalMaint(unit.estado === "mantenimiento");
    setEditMode(false);
  };

  return {
    pendingId, setPendingId,
    open, setOpen,
    editMode, setEditMode,
    localGas, setLocalGas,
    localMaint, setLocalMaint,
    ref,
    handleSave, handleEditSave, handleEditCancel,
  };
};
