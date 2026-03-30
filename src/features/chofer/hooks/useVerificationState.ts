"use client";

import { useState, useEffect, useCallback } from "react";
import { InvoiceItem } from "../models";

export const useVerificationState = (invoiceNumber: string, items: InvoiceItem[]) => {
  const storageKey = `chofer_verified_${invoiceNumber}`;
  const storageKeyReported = `chofer_reported_${invoiceNumber}`;

  const [savedVerified, setSavedVerified] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((i) => [i.id, false]))
  );
  const [reportedItems, setReportedItems] = useState<Record<string, number>>({});
  const [cardKey, setCardKey] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setSavedVerified(Object.fromEntries(items.map((i) => [i.id, parsed[i.id] ?? false])));
        setCardKey(1);
      }
      const rawRep = sessionStorage.getItem(storageKeyReported);
      if (rawRep) setReportedItems(JSON.parse(rawRep));
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, storageKeyReported]);

  const handleCommit = useCallback((patch: Record<string, boolean>) => {
    setSavedVerified((prev) => {
      const next = { ...prev, ...patch };
      try { sessionStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });

    setReportedItems(prev => {
      const next = { ...prev };
      let updated = false;
      for (const [id, isVerified] of Object.entries(patch)) {
        if (isVerified && next[id] !== undefined) {
          delete next[id];
          updated = true;
        }
      }
      if (updated) {
        try { sessionStorage.setItem(storageKeyReported, JSON.stringify(next)); } catch {}
      }
      return updated ? next : prev;
    });
  }, [storageKey, storageKeyReported]);

  const handleReportSubmit = (entries: { itemId: string; qty: number }[]) => {
    setReportedItems(prev => {
      const next = { ...prev };
      for (const { itemId, qty } of entries) next[itemId] = qty;
      try { sessionStorage.setItem(storageKeyReported, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return {
    savedVerified,
    reportedItems,
    cardKey,
    isReportModalOpen,
    setIsReportModalOpen,
    handleCommit,
    handleReportSubmit,
  };
};
