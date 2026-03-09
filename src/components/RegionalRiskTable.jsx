import React, { useMemo } from 'react';

export const RegionalRiskTable = ({ data }) => {
  // Sort by Year descending, then Risk descending
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (b.Year !== a.Year) return b.Year - a.Year;
      return b.SystemicRisk - a.SystemicRisk;
    });
  }, [data]);

  return (
    <div className="flex flex-col h-full w-full bg-[#18181b]/50 rounded-2xl border border-white/5 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-white/5 sticky top-0 bg-[#18181b]/80 backdrop-blur z-10">
        <h3 className="text-lg font-semibold tracking-tight text-white">Regional Risk Index</h3>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-[#09090b]/80 sticky top-0 z-10 text-[10px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-5 py-3 border-b border-white/10 font-medium">Region</th>
              <th className="px-5 py-3 border-b border-white/10 font-medium">Year</th>
              <th className="px-5 py-3 border-b border-white/10 font-medium text-right">Systemic Risk</th>
              <th className="px-5 py-3 border-b border-white/10 font-medium text-center">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {sortedData.map((row, idx) => {
              const riskVal = parseFloat(row.SystemicRisk || 0).toFixed(4);
              const level = row.RiskLevel?.toLowerCase() || 'low';
              
              const levelColors = {
                high: 'text-red-400 bg-red-400/10 border-red-500/30',
                medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30',
                low: 'text-green-400 bg-green-400/10 border-green-500/30'
              };
              
              return (
                <tr key={`${row.Region}-${row.Year}-${idx}`} className="hover:bg-white/5 transition-colors duration-200 group">
                  <td className="px-5 py-3 font-medium text-white">{row.Region}</td>
                  <td className="px-5 py-3 text-zinc-400">{row.Year}</td>
                  <td className="px-5 py-3 text-right text-zinc-300 font-semibold">{riskVal}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md border ${levelColors[level]}`}>
                      {level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
