import React, { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const SectorTrendChart = ({ data }) => {
  const [selectedSector, setSelectedSector] = useState('');

  // Extract unique sectors
  const sectors = Array.from(new Set(data.map(d => d.Sector)));
  
  useEffect(() => {
    if (sectors.length > 0 && !selectedSector) {
      setSelectedSector(sectors[0]);
    }
  }, [sectors, selectedSector]);

  // Filter data for the selected sector
  const filteredData = data.filter(d => d.Sector === selectedSector).sort((a, b) => new Date(a.Date) - new Date(b.Date));

  return (
    <div className="flex flex-col h-full w-full bg-[#18181b]/50 p-5 rounded-2xl border border-white/5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-white">Sector Risk Trend</h3>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="bg-[#27272a] border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:border-white/30 transition-colors"
        >
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="Date"
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickMargin={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 1]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#ffffff', fontWeight: 500 }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              labelFormatter={(label) => new Date(label).toDateString()}
            />
            <Legend wrapperStyle={{ fontSize: '13px', color: '#a1a1aa', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="RiskScore"
              name="Risk Score"
              stroke="#ffffff"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#18181b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
