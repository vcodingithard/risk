import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// The data you provided (Simplified for the example, ensure your local file matches the structure)
const geoUrl = "/data/india.json"; 

export default function RiskMap({ regionalData }) {
  const [content, setContent] = useState("");

  // Helper to find data by name (Case sensitive match with TopoJSON 'name' property)
  const getRiskData = (name) => {
    const data = regionalData?.find(item => item.Region === name);
    // Return dummy data if not found in props
    return data || { 
      SystemicRisk: Math.random(), 
      ClimateImpact: Math.random() 
    }; 
  };

  const getColor = (risk) => {
    if (risk > 0.7) return "#f43f5e"; // rose-500
    if (risk > 0.4) return "#f59e0b"; // amber-500
    return "#10b981"; // emerald-500
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-2xl relative group">
      {/* Header */}
      <div className="p-6 pb-2 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex justify-between items-center z-10">
        <h3 className="text-xl font-bold text-white flex items-center tracking-tight">
          <span className="w-3 h-3 rounded-full bg-rose-500 mr-3 animate-pulse shadow-[0_0_10px_#f43f5e]"></span>
          Geospatial Intelligence Matrix
        </h3>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {content ? "Analyzing Region..." : "System Nominal"}
        </div>
      </div>
      
      <div className="flex-1 w-full bg-[#020617] relative cursor-crosshair">
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-20 w-full animate-scan pointer-events-none"></div>

        <ComposableMap
          // Adjusting projection for India-specific TopoJSON
          projection="geoMercator"
          projectionConfig={{ 
            scale: 1000, 
            center: [78.9, 22.9] // Centered on India
          }}
          className="w-full h-full"
        >
          <ZoomableGroup center={[78.9, 22.9]} zoom={1} maxZoom={8}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // KEY FIX: Using geo.properties.name as per your TopoJSON
                  const stateName = geo.properties.name;
                  const data = getRiskData(stateName);
                  const fill = getColor(data.SystemicRisk);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        setContent(`${stateName} | Risk: ${data.SystemicRisk.toFixed(2)}`);
                      }}
                      onMouseLeave={() => setContent("")}
                      style={{
                        default: { 
                          fill: fill,
                          stroke: "#020617",
                          strokeWidth: 0.5,
                          outline: "none", 
                          transition: "all 250ms" 
                        },
                        hover: { 
                          fill: "#6366f1", 
                          stroke: "#fff",
                          strokeWidth: 1,
                          outline: "none", 
                          filter: "drop-shadow(0 0 8px rgba(99,102,241,0.6))" 
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Dynamic Data Overlay */}
        {content && (
          <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-700 p-3 rounded px-4 text-xs font-mono text-white shadow-2xl backdrop-blur-md z-20 border-l-4 border-l-indigo-500">
            <div className="text-indigo-400 mb-1 opacity-70">REGION_DATA_STREAM</div>
            {content}
          </div>
        )}
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-slate-950/80 backdrop-blur-xl border border-slate-800 p-4 rounded-xl space-y-2 shadow-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Stability Scale</div>
          <div className="flex items-center text-xs text-slate-300">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span> High Risk
          </div>
          <div className="flex items-center text-xs text-slate-300">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span> Moderate
          </div>
          <div className="flex items-center text-xs text-slate-300">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span> Stable
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
        .animate-scan { animation: scan 6s linear infinite; }
      `}} />
    </div>
  );
}