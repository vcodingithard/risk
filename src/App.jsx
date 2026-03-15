import React, { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import RiskOverview from './components/RiskOverview';
import RiskMap from './components/RiskMap';
import CascadingNetwork from './components/CascadingNetwork';
import RiskTrends from './components/RiskTrends';
import ScenarioSimulator from './components/ScenarioSimulator';

import { loadAllDatasets } from './data/DataLoader';

function App() {
  const [data, setData] = useState({ nodes: [], edges: [], matrix: [], combined: [], systemic: [] });
  const [loading, setLoading] = useState(true);
  const [activeLinks, setActiveLinks] = useState([]);
  // State for the calculated risk scores (base + simulated)
  const [currentScores, setCurrentScores] = useState({});
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    async function init() {
      const rawData = await loadAllDatasets();
      setData({
        nodes: rawData.nodesData,
        edges: rawData.edgesData,
        matrix: rawData.matrixData,
        combined: rawData.combinedRiskData,
        systemic: rawData.systemicRiskData
      });

      // Parse current scores from nodes data
      if (rawData.nodesData.length > 0) {
        const initialScores = {};
        const gNodes = [];

        // Define some color mapping
        const colorMap = {
          'Climate': '#ef4444',
          'Economy': '#f59e0b',
          'Geopolitics': '#a855f7',
          'Migration': '#3b82f6',
          'Social Stability': '#10b981',
          'Trade': '#ec4899',
          'Urban Infrastructure': '#6366f1'
        };

        rawData.nodesData.forEach(node => {
          if (!node.Sector) return;
          initialScores[node.Sector] = {
            score: node.RiskScore,
            baseScore: node.RiskScore,
            label: node.Sector,
            level: getLevel(node.RiskScore)
          };
          gNodes.push({
            id: node.Sector,
            name: node.Sector,
            val: (node.Centrality || 0.5) * 30,
            color: colorMap[node.Sector] || '#94a3b8',
            score: node.RiskScore
          });
        });

        // Parse edges
        const gLinks = [];
        rawData.edgesData.forEach(edge => {
          if (!edge.Source || !edge.Target) return;
          gLinks.push({
            source: edge.Source,
            target: edge.Target,
            width: edge.Weight * 5,
            weight: edge.Weight
          });
        });

        // Simple trend data from combined (taking last 12 months for specific sectors)
        const recentTrends = {};
        rawData.combinedRiskData.slice(-100).forEach(row => {
          if (!row.Date || !row.Sector) return;
          const year = row.Date.substring(0, 7); // YYYY-MM
          if (!recentTrends[year]) recentTrends[year] = { year };
          recentTrends[year][row.Sector] = row.RiskScore;
        });

        setTrendData(Object.values(recentTrends).slice(-10)); // Top 10 recent months
        setCurrentScores(initialScores);
        setGraphData({ nodes: gNodes, links: gLinks });
      }
      setLoading(false);
    }
    init();
  }, []);

  const getLevel = (score) => {
    if (score > 0.6) return 'High';
    if (score > 0.4) return 'Medium';
    return 'Low';
  };
  async function runCascade(steps) {

    for (let step of steps) {

      setActiveLinks([step]);

      await new Promise(resolve => setTimeout(resolve, 600));

    }

    setActiveLinks([]);
  }
  const handleSimulate = (indicators) => {
  if (!data.matrix.length) return;

  // 1. Calculate Primary Shocks (Scaled down to 0-1 range)
  const primaryShocks = {
    'Climate': (Math.abs(indicators.rainfall) / 100) * 0.2 + (indicators.temperature / 5) * 0.3,
    'Economy': ((indicators.inflation - 4) / 20) * 0.3,
    // ... apply similar scaling to others
  };

  const nextScores = JSON.parse(JSON.stringify(currentScores));
  const propagationSteps = [];

  // 2. Reset to base but allow for "Delta"
  Object.keys(nextScores).forEach(s => {
    // Start from baseScore, but don't let it exceed a threshold before ripples
    nextScores[s].score = nextScores[s].baseScore; 
  });

  // 3. Matrix Propagation with Dampening
  data.matrix.forEach(row => {
    const sourceSector = row.Sector;
    if (!nextScores[sourceSector]) return;

    Object.keys(row).forEach(targetSector => {
      if (targetSector !== 'Sector' && nextScores[targetSector]) {
        const weight = parseFloat(row[targetSector]) || 0;
        // The "Shock" should be the difference caused by the simulator
        const shockSource = primaryShocks[sourceSector] || 0;
        const transfer = shockSource * weight * 0.5; // 0.5 is a dampening factor

        if (transfer > 0.01) {
          nextScores[targetSector].score += transfer;
          propagationSteps.push({ source: sourceSector, target: targetSector, value: transfer });
        }
      }
    });
  });

  // 4. Final Processing with a more realistic Cap
  Object.keys(nextScores).forEach(key => {
    // Ensure we don't just stay at 0.95 unless it's truly catastrophic
    nextScores[key].score = Math.min(nextScores[key].score, 0.98); 
    nextScores[key].level = getLevel(nextScores[key].score);
  });

  setCurrentScores(nextScores);
  runCascade(propagationSteps);
};

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300">Initializing Core Engine...</div>;
  }

  return (
    <DashboardLayout>
      <RiskOverview scores={currentScores} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RiskMap regionalData={data.systemic} />
        <CascadingNetwork
          graphData={graphData}
          riskScores={currentScores}
          activeLinks={activeLinks}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <RiskTrends data={trendData} />
        </div>
        <div className="lg:col-span-1">
          <ScenarioSimulator indicatorState={null} onSimulate={handleSimulate} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
