import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Group, Family, Subfamily, Verb } from '../types/api.types';

interface SunburstChartProps {
  data: Group[];
  width?: number;
  height?: number;
}

interface HierarchyData {
  name: string;
  color?: string;
  value?: number;
  children?: HierarchyData[];
}

type HierarchyNode = d3.HierarchyNode<HierarchyData> & {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

const SunburstChart: React.FC<SunburstChartProps> = ({ 
  data, 
  width = 800, 
  height = 800 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Limpiar el SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Preparar los datos para D3
    const hierarchyData: HierarchyData = {
      name: "root",
      children: data.map(group => ({
        name: group.name,
        color: group.color,
        children: group.families?.map(family => ({
          name: family.name,
          color: family.color,
          children: family.subfamilies?.map(subfamily => ({
            name: subfamily.name,
            color: subfamily.color,
            children: subfamily.verbs?.map(verb => ({
              name: verb.name,
              value: 1
            }))
          }))
        }))
      }))
    };

    // Crear la jerarquía
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0);

    // Crear el layout del gráfico
    const partition = d3.partition<HierarchyData>()
      .size([2 * Math.PI, root.height + 1]);

    const arc = d3.arc<HierarchyNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(width * 1.5)
      .innerRadius(d => d.y0 * width / 2)
      .outerRadius(d => Math.max(d.y0 * width / 2, d.y1 * width / 2 - 1));

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "10px sans-serif");

    // Añadir los arcos
    svg.append("g")
      .selectAll("path")
      .data(root.descendants())
      .join("path")
      .attr("fill", d => d.data.color || "#ccc")
      .attr("fill-opacity", d => arcVisible(d as HierarchyNode) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("pointer-events", d => arcVisible(d as HierarchyNode) ? "auto" : "none")
      .attr("d", d => arc(d as HierarchyNode));

    // Añadir las etiquetas
    svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d as HierarchyNode))
      .attr("transform", d => labelTransform(d as HierarchyNode))
      .text(d => d.data.name);

    // Función para determinar si un arco es visible
    function arcVisible(d: HierarchyNode) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    // Función para determinar si una etiqueta es visible
    function labelVisible(d: HierarchyNode) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    // Función para transformar las etiquetas
    function labelTransform(d: HierarchyNode) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * width / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default SunburstChart; 