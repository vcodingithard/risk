import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const SectorNetwork = ({ nodesData, edgesData }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (nodesData && edgesData && d3Container.current) {
      const width = d3Container.current.clientWidth;
      const height = d3Container.current.clientHeight;

      // Clear previous chart
      d3.select(d3Container.current).selectAll('*').remove();

      // Deep copy to prevent D3 from mutating original React props
      const nodes = nodesData.map(d => ({ ...d, id: d.Sector }));
      const links = edgesData.map(d => ({ ...d, source: d.Source, target: d.Target }));

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

      // Color scale based on RiskScore
      const colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([0, 1]);

      const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(120))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => d.Centrality * 40 + 20)); // Size logic

      // Draw links
      const link = svg.append('g')
        .attr('stroke', 'rgba(255,255,255,0.15)')
        .attr('stroke-opacity', 0.8)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.Weight) * 2);

      // Node group
      const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .call(drag(simulation));

      // Draw circles
      node.append('circle')
        .attr('r', d => Math.max(10, d.Centrality * 30))
        .attr('fill', d => colorScale(d.RiskScore))
        .attr('stroke', '#09090b')
        .attr('stroke-width', 3);

      // Labels
      node.append('text')
        .text(d => d.id)
        .attr('x', 0)
        .attr('y', d => Math.max(10, d.Centrality * 30) + 16)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('class', 'drop-shadow-sm')
        .style('pointer-events', 'none');
        
      // Title
      node.append('title')
        .text(d => `${d.id}\nCentrality: ${d.Centrality.toFixed(3)}\nRisk: ${d.RiskScore.toFixed(3)}`);

      simulation.on('tick', () => {
        link
          .attr('x1', d => Math.max(0, Math.min(width, d.source.x)))
          .attr('y1', d => Math.max(0, Math.min(height, d.source.y)))
          .attr('x2', d => Math.max(0, Math.min(width, d.target.x)))
          .attr('y2', d => Math.max(0, Math.min(height, d.target.y)));

        node
          .attr('transform', d => {
            d.x = Math.max(15, Math.min(width - 15, d.x));
            d.y = Math.max(15, Math.min(height - 15, d.y));
            return `translate(${d.x},${d.y})`;
          });
      });

      // Cleanup
      return () => simulation.stop();
    }
  }, [nodesData, edgesData]);

  // Drag logic
  const drag = simulation => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#18181b]/50 p-5 rounded-2xl border border-white/5 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight text-white mb-2">Interconnection Network</h3>
      <div className="flex-1 w-full relative min-h-[300px]" ref={d3Container}></div>
    </div>
  );
};
