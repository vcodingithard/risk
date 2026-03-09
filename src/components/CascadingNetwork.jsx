import React, { useEffect, useRef, useState, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function CascadingNetwork({ graphData }) {
  const fgRef = useRef();
  const containerRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 450 });
  const [hoverNode, setHoverNode] = useState(null);

  /*
  ----------------------------------------------------
  1. Add Dummy Simulation Data
  ----------------------------------------------------
  */

  const enrichedGraphData = useMemo(() => {
    return {
      nodes: graphData.nodes.map((node) => ({
        ...node,
        score: node.score ?? Math.random(), // systemic risk
        exposure: (Math.random() * 100).toFixed(1),
        volatility: (Math.random() * 5).toFixed(2),
        loss: (Math.random() * 40).toFixed(1)
      })),
      links: graphData.links
    };
  }, [graphData]);

  /*
  ----------------------------------------------------
  2. Compute System Statistics
  ----------------------------------------------------
  */

  const stats = useMemo(() => {
    if (!enrichedGraphData.nodes.length) return null;

    const scores = enrichedGraphData.nodes.map((n) => n.score);

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const critical = scores.filter((s) => s > 0.6).length;

    return {
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      critical
    };
  }, [enrichedGraphData]);

  /*
  ----------------------------------------------------
  3. ForceGraph Layout Settings
  ----------------------------------------------------
  */

  useEffect(() => {
    if (fgRef.current && enrichedGraphData.nodes.length > 0) {
      fgRef.current.d3Force("charge").strength(-400);
      fgRef.current.d3Force("link").distance(130);

      const t = setTimeout(() => fgRef.current.zoomToFit(600, 50), 500);

      return () => clearTimeout(t);
    }
  }, [enrichedGraphData]);

  /*
  ----------------------------------------------------
  4. Responsive Width
  ----------------------------------------------------
  */

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 450
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  /*
  ----------------------------------------------------
  5. Custom Node Renderer
  ----------------------------------------------------
  */

  const renderNode = (node, ctx, globalScale) => {
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const risk = node.score || 0.2;

    const r = Math.max(4, (risk * 25) / globalScale);

    let color = "#10b981";

    if (risk > 0.7) color = "#ef4444";
    else if (risk > 0.4) color = "#f59e0b";

    const fontSize = 12 / globalScale;

    if (risk > 0.7) {
      const glowRadius = r * 3;

      const gradient = ctx.createRadialGradient(
        node.x,
        node.y,
        0,
        node.x,
        node.y,
        glowRadius
      );

      gradient.addColorStop(0, "rgba(239,68,68,0.3)");
      gradient.addColorStop(1, "rgba(239,68,68,0)");

      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.arc(node.x, node.y, glowRadius, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1 / globalScale;
    ctx.stroke();

    if (globalScale > 0.8) {
      ctx.font = `600 ${fontSize}px Inter`;

      ctx.textAlign = "center";
      ctx.fillStyle = "white";

      ctx.fillText(node.name, node.x, node.y + r + 12 / globalScale);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

      {/* HEADER */}

      <div className="p-6 border-b border-slate-800 flex justify-between">

        <h3 className="text-white font-bold text-lg">
          Neural Risk Propagation
        </h3>

        {stats && (
          <div className="flex gap-6 text-right">

            <div>
              <p className="text-xs text-slate-500">Avg Risk</p>
              <p className="text-emerald-400 font-mono">{stats.avg}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Max Impact</p>
              <p className="text-rose-400 font-mono">{stats.max}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Critical</p>
              <p className="text-white font-mono">{stats.critical}</p>
            </div>

          </div>
        )}
      </div>

      {/* GRAPH AREA */}

      <div
        ref={containerRef}
        className="relative bg-[#020617]"
      >

        {dimensions.width > 0 && enrichedGraphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={fgRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={enrichedGraphData}
            nodeCanvasObject={renderNode}
            onNodeHover={(node) => setHoverNode(node)}

            linkDirectionalParticles={4}
            linkDirectionalParticleSpeed={(d) => (d.weight || 0.1) * 0.02}
            linkDirectionalParticleWidth={1.5}
            linkDirectionalParticleColor={() => "#fb7185"}

            linkColor={() => "rgba(51,65,85,0.3)"}
            linkWidth={(d) => (d.weight || 1) * 1.2}

            backgroundColor="transparent"
          />
        ) : (
          <div className="h-[450px] flex items-center justify-center text-slate-600">
            CALIBRATING ENGINE...
          </div>
        )}

        {/* HOVER PANEL */}

        {hoverNode && (
          <div className="absolute bottom-4 left-4 bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-xs w-56">

            <p className="text-white font-bold mb-2">
              {hoverNode.name}
            </p>

            <div className="flex justify-between">
              <span className="text-slate-400">Risk Score</span>
              <span className="text-rose-400 font-mono">
                {hoverNode.score.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Exposure</span>
              <span className="text-yellow-400 font-mono">
                {hoverNode.exposure}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Volatility</span>
              <span className="text-indigo-400 font-mono">
                {hoverNode.volatility}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Projected Loss</span>
              <span className="text-red-500 font-mono">
                {hoverNode.loss}%
              </span>
            </div>

          </div>
        )}

      </div>

      {/* SYSTEMIC STRESS BAR */}

      {stats && (
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">

          <div className="flex justify-between mb-1">
            <span>Systemic Stress Level</span>
            <span className="text-rose-400 font-mono">
              {stats.max}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded">

            <div
              className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded"
              style={{ width: `${stats.max * 100}%` }}
            />

          </div>

        </div>
      )}
    </div>
  );
}