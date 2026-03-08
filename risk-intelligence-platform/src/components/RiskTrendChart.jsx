import React, { useState, useMemo } from "react";
import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer
} from "recharts";

const sectors = [
"Climate",
"Economy",
"Geopolitics",
"Migration",
"Social",
"Trade",
"Urban Infrastructure"
];

const RiskTrendChart = ({ data = [] }) => {
const [activeSector, setActiveSector] = useState("Climate");

const chartData = useMemo(() => {
if (!data || data.length === 0) return [];

return [...data]
  .filter((row) => row[activeSector] !== undefined)
  .sort((a, b) => a.Year - b.Year)
  .map((row) => ({
    year: row.Year,
    risk: Number(row[activeSector])
  }));


}, [data, activeSector]);

return ( <div className="w-full">

```
  <div className="mb-3">
    <select
      className="bg-slate-800 text-slate-200 text-xs border border-slate-700 rounded px-2 py-1"
      value={activeSector}
      onChange={(e) => setActiveSector(e.target.value)}
    >
      {sectors.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={chartData}
      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

      <XAxis
        dataKey="year"
        stroke="#64748b"
        tickLine={false}
        axisLine={false}
      />

      <YAxis
        stroke="#64748b"
        tickLine={false}
        axisLine={false}
        domain={[0, 1]}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: "#0f172a",
          border: "1px solid #334155"
        }}
      />

      <Line
        type="monotone"
        dataKey="risk"
        stroke="#60a5fa"
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 5 }}
      />
    </LineChart>
  </ResponsiveContainer>

</div>

);
};

export default RiskTrendChart;
