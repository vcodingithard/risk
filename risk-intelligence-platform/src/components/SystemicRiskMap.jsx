import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const getColor = (risk) => {
  if (risk <= 0.33) return '#22c55e'; // green
  if (risk <= 0.66) return '#eab308'; // yellow
  return '#ef4444'; // red
};

export const SystemicRiskMap = ({ data }) => {
  // We'll filter to show the latest year if multiple exist, or just show all points.
  // For clarity, let's group by region and show the max year if there's no year filter,
  // or just render all if there are lat/lng coordinates for each.
  // Let's assume data has ['Region', 'Lat', 'Lng', 'Year', 'SystemicRisk', 'RiskLevel']
  
  // Just take the data for the most recent year available to prevent overlapping identical markers.
  const latestData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxYear = Math.max(...data.map(d => d.Year));
    return data.filter(d => d.Year === maxYear);
  }, [data]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-[#09090b] shadow-[0_0_40px_-15px_rgba(255,255,255,0.05)] relative z-0">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {latestData.map((row, idx) => (
          row.Lat && row.Lng ? (
            <CircleMarker
              key={idx}
              center={[row.Lat, row.Lng]}
              radius={Math.max(10, row.SystemicRisk * 30)}
              pathOptions={{
                fillColor: getColor(row.SystemicRisk),
                fillOpacity: 0.7,
                color: getColor(row.SystemicRisk),
                weight: 1,
              }}
            >
              <Tooltip className="bg-[#18181b] text-white border-white/10 rounded-lg shadow-xl">
                <div className="flex flex-col gap-1 p-1">
                  <span className="font-semibold text-sm tracking-tight">{row.Region}</span>
                  <span className="text-xs text-zinc-400">Year: {row.Year}</span>
                  <span className="text-xs font-medium text-white">
                    Risk Score: {row.SystemicRisk.toFixed(4)}
                  </span>
                </div>
              </Tooltip>
            </CircleMarker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
};
