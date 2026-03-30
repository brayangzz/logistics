"use client";

export const AluminioMap = ({ activeSections }: { activeSections: Set<string> }) => {
  const levels = [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]];
  const BLUE   = "#155DFC";
  const DIM    = "#374151";
  const STROKE = "#4B5563";
  const W = 220, H = 310;
  const cx = W / 2;
  const topY = 20;
  const botY = H - 20;
  const branchW = 76;
  const levelH = (botY - topY) / 6;

  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <div className="w-full flex justify-between px-2">
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Izq</span>
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Der</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} fill="none">
        <line x1={cx} y1={topY} x2={cx} y2={botY} stroke={STROKE} strokeWidth="3" strokeLinecap="round" />

        {levels.map(([odd, even], i) => {
          const leftActive  = activeSections.has(String(odd));
          const rightActive = activeSections.has(String(even));
          const y = topY + i * levelH + levelH / 2;
          const armLeft  = cx - branchW;
          const armRight = cx + branchW;
          const midLeft  = cx - branchW / 2;
          const midRight = cx + branchW / 2;

          return (
            <g key={odd}>
              <line x1={cx} y1={y} x2={armLeft} y2={y} stroke={leftActive ? BLUE : STROKE} strokeWidth={leftActive ? "4" : "2.5"} strokeLinecap="round" />
              <line x1={midLeft} y1={y - 8} x2={midLeft} y2={y + 8} stroke={leftActive ? BLUE : DIM} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx={armLeft} cy={y} r="13" fill={leftActive ? BLUE : "transparent"} stroke={leftActive ? BLUE : STROKE} strokeWidth="1.5" />
              <text x={armLeft} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={leftActive ? "#fff" : "#6B7280"}>{odd}</text>

              <line x1={cx} y1={y} x2={armRight} y2={y} stroke={rightActive ? BLUE : STROKE} strokeWidth={rightActive ? "4" : "2.5"} strokeLinecap="round" />
              <line x1={midRight} y1={y - 8} x2={midRight} y2={y + 8} stroke={rightActive ? BLUE : DIM} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx={armRight} cy={y} r="13" fill={rightActive ? BLUE : "transparent"} stroke={rightActive ? BLUE : STROKE} strokeWidth="1.5" />
              <text x={armRight} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={rightActive ? "#fff" : "#6B7280"}>{even}</text>
            </g>
          );
        })}

        <circle cx={cx} cy={topY} r="5" fill={STROKE} />
        <circle cx={cx} cy={botY} r="5" fill={STROKE} />
      </svg>

      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {activeSections.size === 0
          ? "Sin sección asignada"
          : `Sección${activeSections.size > 1 ? "es" : ""}: ${[...activeSections].sort((a,b) => Number(a)-Number(b)).join(", ")}`}
      </span>
    </div>
  );
};
