import { useState, useEffect } from "react";
import Papa from "papaparse";

export const useRiskData = () => {

const [sectorRisk, setSectorRisk] = useState([]);
const [networkNodes, setNetworkNodes] = useState([]);
const [networkEdges, setNetworkEdges] = useState([]);
const [systemicRisk, setSystemicRisk] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const loadCsv = (file) => {
  return new Promise((resolve) => {
    Papa.parse(`/data/${file}`, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data || []),
      error: () => resolve([])
    });
  });
};

async function fetchData() {

  const [
    sectorRiskData,
    nodesData,
    edgesData,
    systemicRiskData
  ] = await Promise.all([
    loadCsv("combined_sector_risk.csv"),
    loadCsv("risk_network_nodes.csv"),
    loadCsv("risk_network_edges.csv"),
    loadCsv("systemic_risk_index.csv")
  ]);

  setSectorRisk(sectorRiskData);
  setNetworkNodes(nodesData);
  setNetworkEdges(edgesData);
  setSystemicRisk(systemicRiskData);

  setLoading(false);
}

fetchData();
}, []);

return {
sectorRisk,
networkNodes,
networkEdges,
systemicRisk,
loading
};

};
