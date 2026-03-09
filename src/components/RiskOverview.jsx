import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function RiskOverview({ scores }) {
  if (!scores || Object.keys(scores).length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Object.entries(scores).map(([key, data]) => (
        <RiskCard key={key} data={data} id={key} />
      ))}
    </div>
  );
}

function RiskCard({ data }) {
  const isHigh = data.level === 'High';
  const isMedium = data.level === 'Medium';
  const isLow = data.level === 'Low';

  const colorClasses = isHigh
    ? 'border-rose-500/30 bg-rose-500/5'
    : isMedium
    ? 'border-amber-500/30 bg-amber-500/5'
    : 'border-emerald-500/30 bg-emerald-500/5';

  const textClass = isHigh
    ? 'text-rose-500'
    : isMedium
    ? 'text-amber-500'
    : 'text-emerald-400';
    
  const dropShadow = isHigh
    ? 'drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
    : isMedium
    ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
    : 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';

  const delta = data.score - data.baseScore;
  const changed = Math.abs(delta) > 0.001;
  const isWorse = delta > 0;

  return (
    <div className={`p-5 rounded-xl border ${colorClasses} backdrop-blur-sm transition-all duration-500 flex flex-col relative overflow-hidden group/card`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${isHigh ? 'bg-gradient-to-r from-rose-600 to-rose-400' : isMedium ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'} opacity-80`} />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {data.label}
        </h3>
        {changed && (
          <div className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${isWorse ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {isWorse ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {Math.abs(delta * 100).toFixed(1)}%
          </div>
        )}
        {!changed && (
          <div className="text-slate-600 text-xs px-2 py-0.5 border border-slate-700 rounded-full flex items-center">
            Baseline
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div>
          <span className={`text-4xl font-bold tracking-tighter transition-colors duration-500 ${textClass} ${dropShadow}`}>
            {data.score.toFixed(2)}
          </span>
          <p className="text-slate-500 text-xs mt-1 font-medium">{data.level} Risk Level</p>
        </div>
        
        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-400'}`}
            style={{ width: `${Math.min(data.score * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
