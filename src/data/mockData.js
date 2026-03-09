export const overviewScores = {
  climate: { score: 0.85, label: 'Climate Risk', level: 'High' },
  economic: { score: 0.72, label: 'Economic Risk', level: 'High' },
  migration: { score: 0.65, label: 'Migration Risk', level: 'Medium' },
  trade: { score: 0.42, label: 'Trade Risk', level: 'Low' },
  urban: { score: 0.51, label: 'Urban Infrastructure', level: 'Medium' },
  social: { score: 0.39, label: 'Social Stability', level: 'Low' },
};

export const networkGraphData = {
  nodes: [
    { id: 'climate', name: 'Climate Risk', val: 20, color: '#ef4444' }, // red-500
    { id: 'agri', name: 'Agriculture Stress', val: 15, color: '#f59e0b' }, // amber-500
    { id: 'economic', name: 'Economic Instability', val: 15, color: '#ef4444' },
    { id: 'migration', name: 'Migration Pressure', val: 10, color: '#f59e0b' },
    { id: 'urban', name: 'Urban Overcrowding', val: 10, color: '#f59e0b' },
    { id: 'social', name: 'Social Unrest', val: 8, color: '#10b981' }, // emerald-500
  ],
  links: [
    { source: 'climate', target: 'agri', width: 3 },
    { source: 'agri', target: 'economic', width: 2 },
    { source: 'economic', target: 'migration', width: 2 },
    { source: 'climate', target: 'migration', width: 1.5 },
    { source: 'migration', target: 'urban', width: 2 },
    { source: 'urban', target: 'social', width: 1 },
    { source: 'economic', target: 'social', width: 1.5 },
  ]
};

export const trendData = [
  { year: '2020', climate: 0.45, economic: 0.50, migration: 0.30 },
  { year: '2021', climate: 0.48, economic: 0.45, migration: 0.32 },
  { year: '2022', climate: 0.55, economic: 0.55, migration: 0.38 },
  { year: '2023', climate: 0.61, economic: 0.62, migration: 0.45 },
  { year: '2024', climate: 0.75, economic: 0.65, migration: 0.52 },
  { year: '2025', climate: 0.85, economic: 0.72, migration: 0.65 },
];

export const mapData = {
  // ISO 3166-2 codes for Indian states as an example mapping
  // Using arbitrary colors for demo
  "IN-MH": { risk_level: "High", score: 0.85, color: "#ef4444" },
  "IN-KA": { risk_level: "High", score: 0.75, color: "#ef4444" },
  "IN-TN": { risk_level: "Medium", score: 0.60, color: "#f59e0b" },
  "IN-UP": { risk_level: "Medium", score: 0.65, color: "#f59e0b" },
  "IN-RJ": { risk_level: "Low", score: 0.40, color: "#10b981" },
  "IN-GJ": { risk_level: "Low", score: 0.35, color: "#10b981" },
  "IN-WB": { risk_level: "High", score: 0.80, color: "#ef4444" },
  "IN-KL": { risk_level: "Medium", score: 0.50, color: "#f59e0b" },
};
