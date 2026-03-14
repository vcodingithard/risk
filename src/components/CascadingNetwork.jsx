import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import * as d3 from "d3-force";

export default function CascadingNetwork({ graphData, riskScores }) {

  const fgRef = useRef();
  const containerRef = useRef();

  const [size, setSize] = useState({ width: 0, height: 0 });


  // Resize graph with container
  useEffect(() => {

    const resize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);

  }, []);



  const processedData = useMemo(() => {
    return {
      nodes: graphData.nodes.map(node => ({
        ...node,
        score: riskScores[node.id]?.score || 0.3
      })),
      links: graphData.links.map(link => {

        const sourceRisk = riskScores[link.source]?.score || 0.3;

        return {
          ...link,
          speed: sourceRisk * 0.04,
          color: sourceRisk > 0.6 ? "#ef4444" : "rgba(255,255,255,0.2)",
          width: 1 + sourceRisk * 2
        };
      })
    };
  }, [graphData, riskScores]);



  // Layout forces
  useEffect(() => {

    if (!fgRef.current) return;

    const graph = fgRef.current;

    graph.d3Force("charge").strength(-700);

    graph.d3Force("link").distance(200);

    graph.d3Force("center", d3.forceCenter(0, 0));

    graph.d3Force("collision", d3.forceCollide(45));

  }, []);



  // Center graph after simulation
  const handleEngineStop = () => {

    if (!fgRef.current) return;

    fgRef.current.centerAt(0, 0, 800);

    fgRef.current.zoom(1.2, 800);

  };


const drawNode = useCallback((node, ctx, globalScale) => {

  // Guard: skip nodes without valid coordinates
  if (
    typeof node.x !== "number" ||
    typeof node.y !== "number" ||
    !isFinite(node.x) ||
    !isFinite(node.y)
  ) {
    return;
  }

  const risk = node.score || 0.3;

  const size = Math.max(6, risk * 22);

  const pulse = Math.sin(Date.now() * 0.003) * 2;

  const r = (size + pulse) / globalScale;

  // Guard: radius must also be valid
  if (!isFinite(r)) return;


  ctx.shadowColor =
    risk > 0.6
      ? "rgba(239,68,68,0.9)"
      : risk > 0.4
      ? "rgba(245,158,11,0.8)"
      : "rgba(16,185,129,0.8)";

  ctx.shadowBlur = 25 / globalScale;


  const gradient = ctx.createRadialGradient(
    node.x,
    node.y,
    r * 0.2,
    node.x,
    node.y,
    r * 1.5
  );


  if (risk > 0.6) {
    gradient.addColorStop(0, "#ef4444");
    gradient.addColorStop(1, "#7f1d1d");
  } else if (risk > 0.4) {
    gradient.addColorStop(0, "#f59e0b");
    gradient.addColorStop(1, "#78350f");
  } else {
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(1, "#064e3b");
  }


  ctx.beginPath();
  ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";


  const label = node.name || node.id;

  ctx.font = `bold ${12 / globalScale}px Inter`;
  ctx.fillStyle = "#fff";
  ctx.fillText(label, node.x, node.y - r - 10);


  ctx.font = `${10 / globalScale}px Inter`;
  ctx.fillStyle = "#facc15";
  ctx.fillText((node.score || 0).toFixed(2), node.x, node.y + 3);

}, []);


  return (

   <div
  ref={containerRef}
  className="bg-gradient-to-br from-slate-950 to-black border border-slate-800 rounded-3xl overflow-hidden relative h-[520px] w-full shadow-2xl flex items-center justify-center"
>

      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-800/50">

        <h3 className="text-white font-bold text-lg">
          Systemic Ripple Analysis
        </h3>

        <p className="text-xs text-slate-400">
          Particle velocity indicates risk propagation intensity
        </p>

      </div>


       <div className="w-[80%] h-[90%]">

    <ForceGraph2D
      ref={fgRef}
      width={size.width * 0.8}
      height={size.height * 0.9}
      graphData={processedData}
      nodeCanvasObject={drawNode}
      backgroundColor="#020617"

      linkDirectionalParticles={4}
      linkDirectionalParticleSpeed={d => d.speed}
      linkDirectionalParticleWidth={2}

      linkColor={d => d.color}
      linkWidth={d => d.width}

      linkOpacity={0.35}

      enableZoomInteraction={true}
      enablePanInteraction={true}
      enableNodeDrag={true}

      cooldownTicks={120}
      onEngineStop={handleEngineStop}

    />

  </div>

    </div>

  );

}