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

    // 1. Map Sliders to Primary Shocks
    const primaryShocks = {
      'Climate': (Math.abs(indicators.rainfall) / 60) * 0.4 + (indicators.temperature / 3) * 0.6,
      'Economy': ((indicators.inflation - 4) / 8) * 0.4 + ((indicators.interest - 5) / 7) * 0.6,
      'Social Stability': (indicators.unemployment / 13) * 0.5 + (indicators.foodPrices / 250) * 0.5,
      'Urban Infrastructure': (indicators.pollution / 250) * 0.5 + (indicators.urbanGrowth / 5) * 0.5,
      'Migration': (indicators.migration / 30) * 0.8,
      'Trade': (indicators.tradeImbalance / 20) * 0.8
    };

    // 2. Initialize scores with base data
    const nextScores = JSON.parse(JSON.stringify(currentScores));
    const propagationSteps = [];
    Object.keys(nextScores).forEach(s => nextScores[s].score = nextScores[s].baseScore);

    // 3. Multi-Pass Propagation (Simulating the ripple)
    // Pass 1: Primary Shock from Sliders
    Object.entries(primaryShocks).forEach(([sector, intensity]) => {
      if (nextScores[sector]) nextScores[sector].score += intensity;
    });

    // Pass 2: Matrix Propagation (How Sector A hits Sector B)
    const matrixMap = {};
    data.matrix.forEach(row => { matrixMap[row.Sector] = row; });

    Object.keys(nextScores).forEach(sourceSector => {
      const shockLevel = nextScores[sourceSector].score;
      const connections = matrixMap[sourceSector];

      if (connections) {
        Object.keys(connections).forEach(targetSector => {
          if (targetSector !== 'Sector' && nextScores[targetSector]) {
            const weight = parseFloat(connections[targetSector]) || 0;
            const transfer = shockLevel * weight * 0.3;

            nextScores[targetSector].score += transfer;

            propagationSteps.push({
              source: sourceSector,
              target: targetSector,
              value: transfer
            });
          }
        });
      }
    });

    // 4. Final Processing
    Object.keys(nextScores).forEach(key => {
      nextScores[key].score = Math.min(Math.max(nextScores[key].score, 0), 0.95);
      nextScores[key].level = getLevel(nextScores[key].score);
    });

    setCurrentScores(nextScores);
runCascade(propagationSteps);
    // Update Graph Nodes to reflect new "Realistic" sizes
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({
        ...node,
        score: nextScores[node.id]?.score || 0.3,
        val: 15 + (nextScores[node.id]?.score * 40) // Sizes grow based on risk
      }))
    }));
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
