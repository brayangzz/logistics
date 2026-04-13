"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { BlockCard } from "./BlockCard";
import type { Block } from "../logistics2.types";
import type { BlockMap } from "../hooks/useLogistics2Data";

const SMOOTH = { type: "spring", stiffness: 260, damping: 26 } as const;

interface RegionalGridProps {
  blocks: Block[];
  blockMap: BlockMap;
  total: number;
}

export const RegionalGrid = ({ blocks, blockMap, total }: RegionalGridProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SMOOTH, delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
        >
          <Truck className="w-4 h-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Envío a Domicilio</p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {total} {total === 1 ? "factura" : "facturas"} en {blocks.length} bloques regionales
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {[...blocks]
          .sort((a, b) => (blockMap[b.id]?.length ?? 0) - (blockMap[a.id]?.length ?? 0))
          .map((block, i) => (
            <BlockCard
              key={block.id}
              block={block}
              orders={blockMap[block.id] ?? []}
              index={i}
            />
          ))}
      </div>
    </motion.section>
  );
};
