import fs from 'fs';
import path from 'path';

const SECTORS = [
  'Climate',
  'Economy',
  'Geopolitics',
  'Migration',
  'Social Stability',
  'Trade',
  'Urban Infrastructure',
];

const REGIONS = [
  { name: 'North America', lat: 45.0, lng: -100.0 },
  { name: 'South America', lat: -15.0, lng: -60.0 },
  { name: 'Europe', lat: 50.0, lng: 10.0 },
  { name: 'Africa', lat: 0.0, lng: 20.0 },
  { name: 'Asia', lat: 35.0, lng: 100.0 },
  { name: 'Oceania', lat: -25.0, lng: 135.0 },
];

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

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
      const riskScore = (Math.random() * 0.5 + 0.2).toFixed(4); // 0.2 to 0.7
      combinedSectorRiskRows.push([date, sector, riskScore]);
    }
  }
}
generateCSV('combined_sector_risk.csv', ['Date', 'Sector', 'RiskScore'], combinedSectorRiskRows);

// 2. risk_network_nodes.csv
const riskNetworkNodesRows = [];
for (const sector of SECTORS) {
  const centrality = (Math.random() * 0.8 + 0.1).toFixed(4);
  const riskScore = (Math.random() * 0.8 + 0.1).toFixed(4);
  riskNetworkNodesRows.push([sector, centrality, riskScore]);
}
generateCSV('risk_network_nodes.csv', ['Sector', 'Centrality', 'RiskScore'], riskNetworkNodesRows);

// 3. risk_network_edges.csv
const riskNetworkEdgesRows = [];
for (let i = 0; i < SECTORS.length; i++) {
  for (let j = i + 1; j < SECTORS.length; j++) {
    const weight = (Math.random()).toFixed(4);
    if (Math.random() > 0.3) {
      riskNetworkEdgesRows.push([SECTORS[i], SECTORS[j], weight]);
    }
  }
}
generateCSV('risk_network_edges.csv', ['Source', 'Target', 'Weight'], riskNetworkEdgesRows);

// 4. sector_interconnection_matrix.csv
const sectorMatrixRows = [];
for (let i = 0; i < SECTORS.length; i++) {
  const row = [SECTORS[i]];
  for (let j = 0; j < SECTORS.length; j++) {
    if (i === j) {
      row.push('1.0');
    } else {
      // Correlation between -1 and 1
      row.push(((Math.random() * 2) - 1).toFixed(4));
    }
  }
  sectorMatrixRows.push(row);
}
generateCSV('sector_interconnection_matrix.csv', ['Sector', ...SECTORS], sectorMatrixRows);

// 5. systemic_risk_index.csv
const systemicRiskRows = [];
for (const region of REGIONS) {
  for (const year of YEARS) {
    const risk = (Math.random() * 0.8 + 0.1).toFixed(4);
    let level = 'Low';
    if (risk > 0.66) level = 'High';
    else if (risk > 0.33) level = 'Medium';
    systemicRiskRows.push([region.name, region.lat, region.lng, year, risk, level]);
  }
}
generateCSV('systemic_risk_index.csv', ['Region', 'Lat', 'Lng', 'Year', 'SystemicRisk', 'RiskLevel'], systemicRiskRows);
