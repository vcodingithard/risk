import React, { useState, useEffect, useMemo } from "react";
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

const sectorColors = {
  Climate: "#ef4444",
  Economy: "#f59e0b",
  Trade: "#10b981",
  Migration: "#3b82f6",
  "Urban Infrastructure": "#8b5cf6",
  "Social Stability": "#ec4899",
  "Geopolitical Sentiment": "#06b6d4"
};

export default function RiskTrendChart() {
  const [activeSector, setActiveSector] = useState("Climate");
  const [rawData, setRawData] = useState("");

  // Load CSV
  useEffect(() => {
    fetch("/data/combined_sector_risk.csv")
      .then((res) => res.text())
      .then((data) => setRawData(data));
  }, []);

  const chartData = useMemo(() => {
    if (!rawData) return [];

    const lines = rawData.trim().split("\n").slice(1);

    return lines
      .map((line) => {
        const [Date, Sector, RiskScore] = line.split(",");
        return {
          Date,
          Sector,
          RiskScore: parseFloat(RiskScore)
        };
      })
      .filter((item) => item.Sector === activeSector)
      .map((item) => ({
        date: item.Date.substring(0, 7),
        risk: item.RiskScore
      }));
  }, [rawData, activeSector]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-slate-950 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-white font-mono">
          Risk: {payload[0].value.toFixed(3)}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[420px] flex flex-col shadow-2xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
          <span
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: sectorColors[activeSector] }}
          />
          Systemic Risk Trends
        </h3>

        <select
          className="bg-slate-800 text-xs text-white border border-slate-700 rounded px-2 py-1"
          value={activeSector}
          onChange={(e) => setActiveSector(e.target.value)}
        >
          {sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* CHART */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={sectorColors[activeSector]}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={sectorColors[activeSector]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 1]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="risk"
              stroke={sectorColors[activeSector]}
              strokeWidth={3}
              fill="url(#riskGradient)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}