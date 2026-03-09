import React from "react";
import { useRiskData } from "../hooks/useRiskData";

import RiskMap from "./RiskMap";
import InterconnectionGraph from "./InterconnectionGraph";
import RiskTrendChart from "./RiskTrendChart";
import RiskTable from "./RiskTable";
import CorrelationHeatmap from "./CorrelationHeatmap";

const Dashboard = () => {

const {
sectorRisk,
networkNodes,
networkEdges,
systemicRisk,
loading
} = useRiskData();

if (loading) {
return ( <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-blue-400 font-mono">


    <div className="w-48 h-1 bg-slate-900 mb-4 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
    </div>

    <div className="animate-pulse tracking-[0.2em] text-xs">
      SYNCHRONIZING GLOBAL RISK DATA
    </div>

  </div>
);


}

return ( <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-blue-500/30">

  {/* HEADER */}

  <header className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">

    <div>
      <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
        INTELLIGENCE ENGINE
        <span className="text-slate-700 text-sm font-light"> v1.0.4</span>
      </h1>

      <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-1">
        Multi-Vector Cascading Risk Analysis
      </p>
    </div>

    <div className="flex gap-8 text-right">

      <div>
        <div className="text-[10px] text-slate-500 uppercase font-bold">
          System Status
        </div>
        <div className="text-xs text-green-500 font-bold tracking-widest">
          NOMINAL
        </div>
      </div>

      <div>
        <div className="text-[10px] text-slate-500 uppercase font-bold">
          Core Load
        </div>
        <div className="text-xs text-blue-400 font-bold tracking-widest">
          12.4%
        </div>
      </div>

    </div>

  </header>

  {/* GRID */}

  <div className="grid grid-cols-12 gap-6">

    {/* LEFT */}

    <div className="col-span-12 lg:col-span-8 space-y-6">

      <div className="h-[500px] bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">

        <div className="absolute top-4 left-4 z-[1000] bg-slate-950/80 border border-slate-800 p-2 rounded backdrop-blur-md">
          <span className="text-[10px] text-blue-400 font-bold uppercase">
            Geo-Spatial Risk Layer
          </span>
        </div>

        <RiskMap data={systemicRisk} />

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="h-[400px] bg-slate-900/30 border border-slate-800 rounded-xl p-5">

          <h2 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">
            Sector Interconnections
          </h2>

          <InterconnectionGraph
            nodes={networkNodes}
            edges={networkEdges}
          />

        </div>

        <div className="h-[400px] bg-slate-900/30 border border-slate-800 rounded-xl p-5">

          <h2 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">
            Cross-Sector Correlation
          </h2>

          <CorrelationHeatmap data={sectorRisk} />

        </div>

      </div>

    </div>

    {/* RIGHT */}

    <div className="col-span-12 lg:col-span-4 space-y-6">

      <div className="h-[440px] bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex flex-col">

        <h2 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">
          Risk Propagation Trends
        </h2>

        <div className="flex-1">
          <RiskTrendChart data={sectorRisk} />
        </div>

      </div>

      <div className="h-[460px] bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex flex-col">

        <h2 className="text-[11px] font-bold text-slate-500 mb-4 uppercase">
          Critical Regional Indices
        </h2>

        <div className="flex-1 overflow-y-auto">
          <RiskTable data={systemicRisk} />
        </div>

      </div>

    </div>

  </div>

</div>


);
};

export default Dashboard;
