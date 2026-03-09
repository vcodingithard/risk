import fs from 'fs';
import path from 'path';

const SECTORS = [
  'Climate',
  'Economy',
  'Trade',
  'Migration',
  'Urban Infrastructure',
  'Social Stability',
  'Geopolitical Sentiment',
];

const INDICATORS = [
  'Rainfall Anomaly',
  'Temperature Anomaly',
  'Air Pollution Index',
  'Inflation Rate',
  'Interest Rates',
  'Unemployment Rate',
  'Migration Inflow',
  'Urban Population Growth',
  'Trade Imbalance',
  'Food Price Index'
];

const STATES_INDIA = [
  { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
  { name: 'West Bengal', lat: 22.9868, lng: 87.8550 },
  { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { name: 'Punjab', lat: 31.1471, lng: 75.3412 },
  { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 }
];

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const generateCSV = (filename, header, rows) => {
  const dir = path.resolve('public/data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
  fs.writeFileSync(path.join(dir, filename), content);
  console.log(`Generated ${filename}`);
};

// 1. combined_sector_risk.csv
const combinedSectorRiskRows = [];
for (const year of YEARS) {
  for (let month = 1; month <= 12; month++) {
    const date = `${year}-${month.toString().padStart(2, '0')}-01`;
    for (const sector of SECTORS) {
      const riskScore = (Math.random() * 0.4 + 0.3).toFixed(4); // 0.3 to 0.7
      combinedSectorRiskRows.push([date, sector, riskScore]);
    }
  }
}
generateCSV('combined_sector_risk.csv', ['Date', 'Sector', 'RiskScore'], combinedSectorRiskRows);

// 2. risk_network_nodes.csv
const riskNetworkNodesRows = [];
for (const sector of SECTORS) {
  const centrality = (Math.random() * 0.5 + 0.3).toFixed(4);
  const riskScore = (Math.random() * 0.4 + 0.3).toFixed(4);
  riskNetworkNodesRows.push([sector, centrality, riskScore]);
}
generateCSV('risk_network_nodes.csv', ['Sector', 'Centrality', 'RiskScore'], riskNetworkNodesRows);

// 3. risk_network_edges.csv
const edges = [
  ['Climate', 'Economy', 0.8],
  ['Climate', 'Migration', 0.6],
  ['Economy', 'Social Stability', 0.7],
  ['Economy', 'Trade', 0.5],
  ['Migration', 'Urban Infrastructure', 0.9],
  ['Urban Infrastructure', 'Social Stability', 0.6],
  ['Social Stability', 'Geopolitical Sentiment', 0.8],
  ['Trade', 'Economy', 0.6],
  ['Climate', 'Trade', 0.4]
];
generateCSV('risk_network_edges.csv', ['Source', 'Target', 'Weight'], edges);

// 4. sector_interconnection_matrix.csv
const sectorMatrixRows = [];
for (let i = 0; i < SECTORS.length; i++) {
  const row = [SECTORS[i]];
  for (let j = 0; j < SECTORS.length; j++) {
    if (i === j) {
      row.push('1.0');
    } else {
      // Check if there is a predefined edge
      const edge = edges.find(e => (e[0] === SECTORS[i] && e[1] === SECTORS[j]) || (e[0] === SECTORS[j] && e[1] === SECTORS[i]));
      row.push(edge ? edge[2].toFixed(4) : (Math.random() * 0.2).toFixed(4));
    }
  }
  sectorMatrixRows.push(row);
}
generateCSV('sector_interconnection_matrix.csv', ['Sector', ...SECTORS], sectorMatrixRows);

// 5. systemic_risk_index.csv (Regional Risk)
const systemicRiskRows = [];
for (const state of STATES_INDIA) {
  for (const year of YEARS) {
    const risk = (Math.random() * 0.6 + 0.2).toFixed(4);
    let level = 'Low';
    if (risk > 0.6) level = 'High';
    else if (risk > 0.4) level = 'Medium';
    systemicRiskRows.push([state.name, state.lat, state.lng, year, risk, level]);
  }
}
generateCSV('systemic_risk_index.csv', ['Region', 'Lat', 'Lng', 'Year', 'SystemicRisk', 'RiskLevel'], systemicRiskRows);

// 6. indicator_historical_data.csv (For the simulation initial values)
const indicatorRows = [];
for (const year of YEARS) {
    for (let month = 1; month <= 12; month++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-01`;
        indicatorRows.push([
            date,
            (Math.random() * 100 - 60).toFixed(2), // Rainfall
            (Math.random() * 3).toFixed(2),       // Temp
            (Math.random() * 200 + 50).toFixed(2), // Air Pollution
            (Math.random() * 10 + 2).toFixed(2),   // Inflation
            (Math.random() * 8 + 4).toFixed(2),    // Interest
            (Math.random() * 10 + 3).toFixed(2),   // Unemployment
            (Math.random() * 40 - 10).toFixed(2),  // Migration Inflow
            (Math.random() * 5).toFixed(2),        // Urban Pop Growth
            (Math.random() * 20).toFixed(2),       // Trade Imbalance
            (Math.random() * 150 + 100).toFixed(2) // Food Price Index
        ]);
    }
}
const indicatorHeader = ['Date', ...INDICATORS];
generateCSV('indicators_data.csv', indicatorHeader, indicatorRows);
