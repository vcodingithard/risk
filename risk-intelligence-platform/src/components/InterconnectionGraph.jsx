import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const InterconnectionGraph = ({ nodes = [], edges = [] }) => {
const svgRef = useRef();

useEffect(() => {
if (!nodes.length || !edges.length) return;

const width = 600;
const height = 400;

const svg = d3.select(svgRef.current);
svg.selectAll("*").remove();

// Clone data so D3 can mutate positions safely
const simulationNodes = nodes.map((d) => ({ ...d }));
const simulationLinks = edges.map((d) => ({ ...d }));

const simulation = d3
  .forceSimulation(simulationNodes)
  .force(
    "link",
    d3
      .forceLink(simulationLinks)
      .id((d) => d.sector)
      .distance(140)
  )
  .force("charge", d3.forceManyBody().strength(-350))
  .force("center", d3.forceCenter(width / 2, height / 2));

// LINKS
const link = svg
  .append("g")
  .selectAll("line")
  .data(simulationLinks)
  .enter()
  .append("line")
  .attr("stroke", "#334155")
  .attr("stroke-width", (d) => Math.max(1, Math.abs(d.weight || 0) * 4));

// NODES
const node = svg
  .append("g")
  .selectAll("circle")
  .data(simulationNodes)
  .enter()
  .append("circle")
  .attr("r", (d) =>
    Math.max(6, Math.abs(d.centrality || 0.3) * 25)
  )
  .attr("fill", (d) =>
    (d.risk_score || 0) > 0.6 ? "#f87171" : "#60a5fa"
  )
  .attr("stroke", "#020617")
  .attr("stroke-width", 2)
  .call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

node.append("title").text((d) => d.sector);

simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);
});

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

return () => simulation.stop();


}, [nodes, edges]);

return ( <svg
   ref={svgRef}
   className="w-full h-full"
   viewBox="0 0 600 400"
   preserveAspectRatio="xMidYMid meet"
 />
);
};

export default InterconnectionGraph;
