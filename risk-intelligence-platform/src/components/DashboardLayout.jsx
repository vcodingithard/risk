import React from 'react';
import { useData } from '../hooks/useData';
import { SystemicRiskMap } from './SystemicRiskMap';
import { SectorNetwork } from './SectorNetwork';
import { SectorTrendChart } from './SectorTrendChart';
import { CorrelationHeatmap } from './CorrelationHeatmap';
import { RegionalRiskTable } from './RegionalRiskTable';

export const DashboardLayout = () => {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-[3px] border-white/10 border-t-white animate-spin"></div>
          <div className="text-sm font-medium text-zinc-400">Loading Intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] p-4 md:p-8 text-white font-sans selection:bg-white/10">
      
      {/* Header */}
      <header className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-sm">
            Global Risk Intelligence
          </h1>
          <p className="text-sm font-medium text-zinc-400 mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Systemic Integration
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300">
            Node / Primary
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300">
            Status / Verified
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full max-w-[1920px] mx-auto auto-rows-min">
        
        {/* Top Section: Full Width */}
        <section className="col-span-1 lg:col-span-2 h-[400px] lg:h-[500px] w-full">
          <SystemicRiskMap data={data.systemicRiskIndex} />
        </section>

        {/* Middle Sections: Split */}
        <section className="col-span-1 h-[400px]">
          <SectorNetwork
            nodesData={data.riskNetworkNodes}
            edgesData={data.riskNetworkEdges}
          />
        </section>
        <section className="col-span-1 h-[400px]">
          <SectorTrendChart
            data={data.combinedSectorRisk}
          />
        </section>

        {/* Bottom Sections: Split */}
        <section className="col-span-1 h-[400px]">
          <CorrelationHeatmap
            data={data.sectorInterconnectionMatrix}
          />
        </section>
        <section className="col-span-1 h-[400px]">
          <RegionalRiskTable
            data={data.systemicRiskIndex}
          />
        </section>

      </main>
    </div>
  );
};
