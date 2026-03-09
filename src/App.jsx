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

  const handleSimulate = (indicators) => {
    if (!data.matrix.length) return;

    // Mapping Scenario Indicators -> Sector Shocks
    // (Translating absolute/percentage values from UI to 0.0-0.5 risk increments)
    const shocks = {
      'Climate': (Math.abs(indicators.rainfall) / 60) * 0.2 + (indicators.temperature / 3) * 0.3,
      'Economy': ((indicators.inflation - 4) / 8) * 0.2 + ((indicators.interest - 5) / 7) * 0.1 + ((indicators.unemployment - 5) / 8) * 0.2,
      'Migration': (indicators.migration / 30) * 0.3,
      'Urban Infrastructure': (indicators.pollution / 250) * 0.15 + (indicators.urbanGrowth / 5) * 0.15,
      'Trade': (indicators.tradeImbalance / 20) * 0.3,
      'Social Stability': (indicators.foodPrices / 250) * 0.2 + (indicators.unemployment / 13) * 0.2
    };

    // Deep copy current base scores to calculate new ones
    const newScores = JSON.parse(JSON.stringify(currentScores));

    // Convert matrix array to lookup dictionary: row -> col -> weight
    const interMatrix = {};
    data.matrix.forEach(row => {
      interMatrix[row.Sector] = row;
    });

    // 1. Apply initial user shocks
    Object.keys(shocks).forEach(sectorName => {
      const delta = shocks[sectorName]; 
      if (newScores[sectorName]) {
        newScores[sectorName].score = Math.min(Math.max(newScores[sectorName].baseScore + delta, 0), 1);

        // 2. Cascade shock to other sectors using the matrix
        const row = interMatrix[sectorName];
        if (row) {
          Object.keys(row).forEach(targetSector => {
            if (targetSector !== 'Sector' && targetSector !== sectorName && newScores[targetSector]) {
              const weight = row[targetSector];
              const rippleEffect = delta * weight * 0.5; // Dampening factor
              newScores[targetSector].score = Math.min(Math.max(newScores[targetSector].score + rippleEffect, 0), 1);
            }
          });
        }
      }
    });

    // 3. Re-evaluate levels and node visuals
    Object.keys(newScores).forEach(key => {
      newScores[key].level = getLevel(newScores[key].score);
    });

    const newGNodes = graphData.nodes.map(node => ({
      ...node,
      score: newScores[node.id]?.score || node.score,
      val: (data.nodes.find(n => n.Sector === node.id)?.Centrality || 0.5) * 30 * (1 + (newScores[node.id]?.score || 0)),
    }));

    setCurrentScores(newScores);
    setGraphData({ nodes: newGNodes, links: graphData.links });
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300">Initializing Core Engine...</div>;
  }

  return (
    <DashboardLayout>
      <RiskOverview scores={currentScores} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RiskMap regionalData={data.systemic} />
        <CascadingNetwork graphData={graphData} simulatedScores={currentScores} />
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
