import React, { useMemo } from 'react';
import * as d3 from 'd3';

export const CorrelationHeatmap = ({ data }) => {
  // Extract sectors from keys, ignoring 'Sector' key
  const sectors = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(k => k !== 'Sector');
  }, [data]);

  // Color scale map -1 to 1: Blue -> Dark -> Red
  const colorScale = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["#3b82f6", "#09090b", "#ef4444"]); // blue -> black -> red

  // Ensure matrix data is rendered properly
  return (
    <div className="flex flex-col h-full w-full bg-[#18181b]/50 p-5 rounded-2xl border border-white/5 shadow-sm overflow-auto custom-scrollbar">
      <h3 className="text-lg font-semibold tracking-tight text-white mb-6 sticky left-0">Sector Correlation</h3>
      <div className="min-w-max">
        <div className="grid gap-[1px] bg-white/5" style={{ gridTemplateColumns: `auto repeat(${sectors.length}, 1fr)` }}>
          {/* Header Row */}
          <div className="font-medium p-2 text-zinc-500 text-[10px] uppercase tracking-wider bg-[#09090b]"></div>
          {sectors.map(sector => (
            <div key={sector} className="p-2 flex items-center justify-center text-[10px] font-medium text-zinc-400 bg-[#09090b] truncate" title={sector}>
              {sector.substring(0, 4).toUpperCase()}
            </div>
          ))}

          {/* Data Rows */}
          {data.map((row) => (
            <React.Fragment key={row.Sector}>
              {/* Row Header */}
              <div className="p-2 flex items-center text-[10px] font-medium text-zinc-400 bg-[#09090b] truncate uppercase tracking-wider" title={row.Sector}>
                {row.Sector.substring(0, 4)}
              </div>
              {/* Values */}
              {sectors.map(col => {
                const val = parseFloat(row[col] || 0);
                const isDiagonal = row.Sector === col;
                const bgColor = isDiagonal ? '#09090b' : colorScale(val);
                return (
                  <div
                    key={`${row.Sector}-${col}`}
                    className="h-10 relative group cursor-pointer transition-all duration-300"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                      <span className="text-white text-[10px] font-semibold">
                        {isDiagonal ? '-' : val.toFixed(2)}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#18181b] border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl transition-opacity">
                      <div className="font-medium text-zinc-400 mb-0.5">{row.Sector} ↔ {col}</div>
                      <div className="font-semibold text-white">Corr: {val.toFixed(3)}</div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
