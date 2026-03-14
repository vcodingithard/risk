/**
 * SIMULATION ENGINE
 * Maps slider indicators to primary nodes and calculates cascading effects.
 */

const SLIDER_MAPPING = {
  rainfall: { sector: "Climate", weight: 0.6 },
  temperature: { sector: "Climate", weight: 0.8 },
  pollution: { sector: "Urban Infrastructure", weight: 0.5 },
  inflation: { sector: "Economy", weight: 0.7 },
  interest: { sector: "Economy", weight: 0.5 },
  unemployment: { sector: "Social Stability", weight: 0.8 },
  migration: { sector: "Migration", weight: 0.7 },
  urbanGrowth: { sector: "Urban Infrastructure", weight: 0.6 },
  tradeImbalance: { sector: "Trade", weight: 0.7 },
  foodPrices: { sector: "Social Stability", weight: 0.7 },
};

// Extracted from your risk_network_edges.csv
const NETWORK_EDGES = [
  { source: "Climate", target: "Economy", weight: 0.8 },
  { source: "Climate", target: "Migration", weight: 0.6 },
  { source: "Economy", target: "Social Stability", weight: 0.7 },
  { source: "Economy", target: "Trade", weight: 0.5 },
  { source: "Migration", target: "Urban Infrastructure", weight: 0.9 },
  { source: "Urban Infrastructure", target: "Social Stability", weight: 0.6 },
  { source: "Social Stability", target: "Geopolitical Sentiment", weight: 0.8 },
  { source: "Trade", target: "Economy", weight: 0.6 },
  { source: "Climate", target: "Trade", weight: 0.4 },
];

export const runInference = (sliders) => {
  const scores = {
    "Climate": 0.2,
    "Economy": 0.2,
    "Trade": 0.2,
    "Migration": 0.2,
    "Urban Infrastructure": 0.2,
    "Social Stability": 0.2,
    "Geopolitical Sentiment": 0.2
  };

  // 1. Calculate Primary Impacts
  // We normalize slider values roughly to a 0-1 scale for risk
  Object.keys(sliders).forEach(key => {
    const mapping = SLIDER_MAPPING[key];
    if (mapping) {
      let val = Math.abs(sliders[key]);
      // Simple normalization based on typical max ranges in your data
      let normalized = key === 'pollution' || key === 'foodPrices' ? val / 250 : val / 20;
      scores[mapping.sector] += normalized * mapping.weight;
    }
  });

  // 2. Run Cascading Propagation (2 Passes for ripple effects)
  for (let i = 0; i < 2; i++) {
    NETWORK_EDGES.forEach(edge => {
      const effect = scores[edge.source] * edge.weight * 0.4;
      scores[edge.target] = Math.min(0.98, scores[edge.target] + effect);
    });
  }

  // Ensure bounds
  Object.keys(scores).forEach(k => {
    scores[k] = Math.min(0.95, Math.max(0.15, scores[k]));
  });

  return scores;
};