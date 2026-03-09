import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const sectors = [
  "Climate",
  "Economy",
  "Trade",
  "Migration",
  "Urban Infrastructure",
  "Social Stability",
  "Geopolitical Sentiment"
];

// Map sectors to colors for a better look
const sectorColors = {
  "Climate": "#ef4444",
  "Economy": "#f59e0b",
  "Trade": "#10b981",
  "Migration": "#3b82f6",
  "Urban Infrastructure": "#8b5cf6",
  "Social Stability": "#ec4899",
  "Geopolitical Sentiment": "#06b6d4"
};

const RiskTrendChart = ({ rawData = "" }) => {
  const [activeSector, setActiveSector] = useState("Climate");

  // Parse CSV and Filter
  const chartData = useMemo(() => {
    if (!rawData) return [];
    
    return rawData
      .trim()
      .split("\n")
      .map(line => {
        const [Date, Sector, RiskScore] = line.split(",");
        return { Date, Sector, RiskScore: parseFloat(RiskScore) };
      })
      .filter(item => item.Sector === activeSector)
      .map(item => ({
        // Show month and year for cleaner X-axis
        date: item.Date.substring(0, 7), 
        risk: item.RiskScore
      }));
  }, [rawData, activeSector]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
          <span 
            className="w-2 h-2 rounded-full mr-2 transition-colors duration-500" 
            style={{ backgroundColor: sectorColors[activeSector] }}
          ></span>
          Systemic Risk Trends
        </h3>
        
        <select
          className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
          value={activeSector}
          onChange={(e) => setActiveSector(e.target.value)}
        >
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* minHeight={300} fixes the "height -1" error in the console */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={sectorColors[activeSector]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={sectorColors[activeSector]} stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10}} 
              minTickGap={40}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 10}} 
              domain={[0, 1]}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: sectorColors[activeSector] }}
            />
            
            <Area
              type="monotone"
              dataKey="risk"
              stroke={sectorColors[activeSector]}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRisk)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrendChart;