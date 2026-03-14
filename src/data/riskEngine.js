import React, { useRef, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";

export default function CascadingNetwork({
  graphData,
  riskScores,
  activeLinks
}) {

  const fgRef = useRef();

  const processedData = useMemo(() => {

    return {
      nodes: graphData.nodes,
      links: graphData.links.map(link => {

        const active = activeLinks.find(
          l => l.source === link.source && l.target === link.target
        );

        return {
          ...link,
          value: active?.value || 0,
          color: active ? "#ef4444" : "rgba(255,255,255,0.15)",
          width: active ? 3 : 1
        };
      })
    };

  }, [graphData, activeLinks]);


  const drawNode = (node, ctx, globalScale) => {

    const risk = node.score || 0.3;
    const r = Math.max(5, (risk * 30) / globalScale);

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);

    ctx.fillStyle =
      risk > 0.6
        ? "#ef4444"
        : risk > 0.4
        ? "#f59e0b"
        : "#10b981";

    ctx.fill();

    // label
    ctx.font = `bold ${14 / globalScale}px Inter`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(node.name, node.x, node.y - r - 10);

    // risk number
    ctx.font = `${12 / globalScale}px Inter`;
    ctx.fillStyle = "#facc15";
    ctx.fillText(node.score.toFixed(2), node.x, node.y + 4);
  };


  const drawLink = (link, ctx, globalScale) => {

    if (!link.value) return;

    const start = link.source;
    const end = link.target;

    const x = start.x + (end.x - start.x) * 0.5;
    const y = start.y + (end.y - start.y) * 0.5;

    ctx.font = `${12 / globalScale}px Inter`;
    ctx.fillStyle = "#f87171";
    ctx.fillText(`+${link.value.toFixed(2)}`, x, y);
  };


  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[500px]">

      <ForceGraph2D
        ref={fgRef}
        graphData={processedData}
        nodeCanvasObject={drawNode}
        linkCanvasObject={drawLink}
        backgroundColor="#020617"

        linkColor={l => l.color}
        linkWidth={l => l.width}

        d3AlphaDecay={0.05}
        d3VelocityDecay={0.2}

        onEngineStop={() =>
          fgRef.current.zoomToFit(400, 50)
        }
      />
    </div>
  );
}