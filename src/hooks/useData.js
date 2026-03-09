import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useData = () => {
  const [data, setData] = useState({
    combinedSectorRisk: [],
    riskNetworkNodes: [],
    riskNetworkEdges: [],
    sectorInterconnectionMatrix: [],
    systemicRiskIndex: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async (filePath) => {
      const response = await fetch(filePath);
      const text = await response.text();
      return new Promise((resolve) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
        });
      });
    };

    const loadData = async () => {
      try {
        const [
          combinedSectorRisk,
          riskNetworkNodes,
          riskNetworkEdges,
          sectorInterconnectionMatrix,
          systemicRiskIndex,
        ] = await Promise.all([
          fetchCSV('/data/combined_sector_risk.csv'),
          fetchCSV('/data/risk_network_nodes.csv'),
          fetchCSV('/data/risk_network_edges.csv'),
          fetchCSV('/data/sector_interconnection_matrix.csv'),
          fetchCSV('/data/systemic_risk_index.csv'),
        ]);

        setData({
          combinedSectorRisk,
          riskNetworkNodes,
          riskNetworkEdges,
          sectorInterconnectionMatrix,
          systemicRiskIndex,
        });
      } catch (error) {
        console.error('Failed to load datasets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
