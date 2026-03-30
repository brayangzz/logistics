"use client";

export const VidrioMap = ({ activeSections }: { activeSections: Set<string> }) => {
  const firstSection = [...activeSections][0];
  const left  = firstSection === "1";
  const right = firstSection === "2";
  const GREEN   = "#10B981";
  const DIM     = "#374151";
  const LABEL_A = "#6B7280";

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="w-full flex justify-between px-4">
        <span className="text-xs font-bold" style={{ color: left ? GREEN : "var(--text-secondary)" }}>Lado 1</span>
        <span className="text-xs font-bold" style={{ color: right ? GREEN : "var(--text-secondary)" }}>Lado 2</span>
      </div>

      <svg viewBox="0 0 120 100" width="200" height="166" fill="none">
        <line x1="10" y1="90" x2="60" y2="10" stroke={left ? GREEN : DIM} strokeWidth="6" strokeLinecap="round" />
        <rect x="14" y="22" width="36" height="52" rx="3"
          fill={left ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)"}
          stroke={left ? GREEN : "#4B5563"} strokeWidth="1.5" />

        <line x1="110" y1="90" x2="60" y2="10" stroke={right ? GREEN : DIM} strokeWidth="6" strokeLinecap="round" />
        <rect x="70" y="22" width="36" height="52" rx="3"
          fill={right ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.04)"}
          stroke={right ? GREEN : "#4B5563"} strokeWidth="1.5" />

        <line x1="28" y1="58" x2="92" y2="58" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
        <circle cx="60" cy="10" r="4" fill={left || right ? GREEN : DIM} />

        <circle cx="18" cy="90" r="10" fill={left ? GREEN : "transparent"} stroke={left ? GREEN : DIM} strokeWidth="1.5" />
        <text x="18" y="95" textAnchor="middle" fontSize="10" fontWeight="800" fill={left ? "#fff" : LABEL_A}>1</text>

        <circle cx="102" cy="90" r="10" fill={right ? GREEN : "transparent"} stroke={right ? GREEN : DIM} strokeWidth="1.5" />
        <text x="102" y="95" textAnchor="middle" fontSize="10" fontWeight="800" fill={right ? "#fff" : LABEL_A}>2</text>
      </svg>

      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {left ? "Material en lado 1 (izq)" : right ? "Material en lado 2 (der)" : "Sin sección asignada"}
      </span>
    </div>
  );
};
