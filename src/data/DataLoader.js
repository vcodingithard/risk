import Papa from 'papaparse';

// Path prefix depending on deployment - using root for Vite public folder
const DATA_PATH = '/data';

const fetchCsv = async (filename) => {
  try {
    const response = await fetch(`${DATA_PATH}/${filename}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true, // Automatically converts numbers
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          console.error(`Error parsing ${filename}:`, error);
          reject(error);
        }
      });
    });
  } catch (err) {
    console.error(`Failed to fetch ${filename}:`, err);
    return [];
  }
};

export const loadAllDatasets = async () => {
  const [
    nodesData,
    edgesData,
    matrixData,
    combinedRiskData,
    systemicRiskData,
  ] = await Promise.all([
    fetchCsv('risk_network_nodes.csv'),
    fetchCsv('risk_network_edges.csv'),
    fetchCsv('sector_interconnection_matrix.csv'),
    fetchCsv('combined_sector_risk.csv'),
    fetchCsv('systemic_risk_index.csv')
  ]);
  
  return {
    nodesData,
    edgesData,
    matrixData,
    combinedRiskData,
    systemicRiskData,
  };
};
