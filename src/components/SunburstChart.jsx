import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SunburstChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Configuración del gráfico
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    // Limpiar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    // Crear la jerarquía de datos
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    // Crear el layout del sunburst
    const partition = d3.partition()
      .size([2 * Math.PI, radius]);

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    // Dibujar los arcos
    svg.selectAll('path')
      .data(root.descendants())
      .enter()
      .append('path')
      .attr('d', arc)
      .style('fill', d => d.data.color || '#ccc')
      .style('stroke', '#fff')
      .style('stroke-width', '1px');

  }, [data]);

  return (
    <div className="sunburst-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SunburstChart; 