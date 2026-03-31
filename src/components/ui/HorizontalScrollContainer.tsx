"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  scrollAmount?: number;
  fadeColor?: string;
}

const BTN_SPRING = { type: "spring", stiffness: 400, damping: 28 } as const;

export function HorizontalScrollContainer({
  children,
  className,
  scrollAmount = 280,
  fadeColor = "var(--bg-primary)",
}: HorizontalScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => { update(); }, [update]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={update}
        className={cn(
          "overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className
        )}
      >
        {children}
      </div>

      {/* ← Left */}
      <AnimatePresence>
        {canScrollLeft && (
          <>
            <motion.div
              key="fade-left"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none md:hidden"
              style={{ background: `linear-gradient(to right, ${fadeColor} 30%, transparent)` }}
            />
            <motion.button
              key="btn-left"
              initial={{ opacity: 0, x: -8, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.8 }}
              transition={BTN_SPRING}
              whileHover={{ scale: 1.12, boxShadow: "0 0 20px rgba(21,93,252,0.7)" }}
              whileTap={{ scale: 0.88 }}
              onClick={() => scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 md:hidden flex items-center justify-center rounded-full focus:outline-none"
              style={{ width: 32, height: 32, backgroundColor: "#155DFC", boxShadow: "0 0 14px rgba(21,93,252,0.5)", border: "1px solid rgba(21,93,252,0.6)" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* → Right */}
      <AnimatePresence>
        {canScrollRight && (
          <>
            <motion.div
              key="fade-right"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none md:hidden"
              style={{ background: `linear-gradient(to left, ${fadeColor} 30%, transparent)` }}
            />
            <motion.button
              key="btn-right"
              initial={{ opacity: 0, x: 8, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.8 }}
              transition={BTN_SPRING}
              whileHover={{ scale: 1.12, boxShadow: "0 0 20px rgba(21,93,252,0.7)" }}
              whileTap={{ scale: 0.88 }}
              onClick={() => scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 md:hidden flex items-center justify-center rounded-full focus:outline-none"
              style={{ width: 32, height: 32, backgroundColor: "#155DFC", boxShadow: "0 0 14px rgba(21,93,252,0.5)", border: "1px solid rgba(21,93,252,0.6)" }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
