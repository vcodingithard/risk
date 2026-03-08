import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useRiskData = () => {
  const [data, setData] = useState({
    sectorRisk: [],
    networkNodes: [],
    networkEdges: [],
    matrix: [],
    systemicRisk: [],
    loading: true
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchCsv = (file) => 
        new Promise((resolve) => {
          Papa.parse(`/data/${file}`, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
          });
        });

      const [sectorRisk, nodes, edges, matrix, systemic] = await Promise.all([
        fetchCsv('combined_sector_risk.csv'),
        fetchCsv('risk_network_nodes.csv'),
        fetchCsv('risk_network_edges.csv'),
        fetchCsv('sector_interconnection_matrix.csv'),
        fetchCsv('systemic_risk_index.csv'),
      ]);

      setData({
        sectorRisk,
        networkNodes: nodes,
        networkEdges: edges,
        matrix,
        systemicRisk: systemic,
        loading: false
      });
    };

    fetchData();
  }, []);

  return data;
};