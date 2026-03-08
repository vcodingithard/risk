import React from 'react';
import { useRiskData } from './hooks/useRiskData';
import RiskMap from './components/RiskMap';
import InterconnectionGraph from './components/InterconnectionGraph';
import RiskTrendChart from './components/RiskTrendChart';
import RiskTable from './components/RiskTable';

export default function App() {
  const { sectorRisk, networkNodes, networkEdges, systemicRisk, loading } = useRiskData();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">Initializing Intelligence Engine...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-mono">
      <header className="border-b border-slate-800 mb-6 pb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tighter text-blue-400">GLOBAL RISK INTERCONNECTION INTELLIGENCE <span className="text-slate-500 text-sm font-normal">v1.0.4</span></h1>
        <div className="text-xs text-slate-400 uppercase tracking-widest">System Status: Optimal</div>
      </header>

      {/* Top Section: Full Width Map */}
      <section className="mb-6 h-[400px] border border-slate-800 bg-slate-900/50 rounded-lg overflow-hidden shadow-2xl">
        <RiskMap data={systemicRisk} />
      </section>

      {/* Middle Section: Graph and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-[450px] border border-slate-800 bg-slate-900/50 rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-4 text-slate-400 uppercase">Sector Interconnection Network</h2>
          <InterconnectionGraph nodes={networkNodes} edges={networkEdges} />
        </div>
        <div className="h-[450px] border border-slate-800 bg-slate-900/50 rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-4 text-slate-400 uppercase">Sector Risk Trends</h2>
          <RiskTrendChart data={sectorRisk} />
        </div>
      </div>

      {/* Bottom Section: Table */}
      <section className="border border-slate-800 bg-slate-900/50 rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-4 text-slate-400 uppercase">Regional Risk Ranking</h2>
        <RiskTable data={systemicRisk} />
      </section>
    </div>
  );
}