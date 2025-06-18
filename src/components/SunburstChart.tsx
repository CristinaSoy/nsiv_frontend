import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Group } from '../types/api.types';

interface SunburstChartProps {
  data: Group[];
  width?: number;
  height?: number;
}

interface HierarchyData {
  name: string;
  value?: number;
  color?: string;
  children?: HierarchyData[];
}

type HierarchyRectangularNode = d3.HierarchyRectangularNode<HierarchyData>;

const SunburstChart: React.FC<SunburstChartProps> = ({ 
  data, 
  width = 600, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    console.log('SunburstChart - Datos recibidos:', data);
    
    if (!svgRef.current) {
      console.error('SunburstChart - No hay referencia al SVG');
      return;
    }

    if (!data || data.length === 0) {
      console.error('SunburstChart - No hay datos para mostrar');
      return;
    }

    try {
      // Limpiar el SVG anterior
      d3.select(svgRef.current).selectAll("*").remove();

      // Crear el SVG
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      console.log('SunburstChart - SVG creado con dimensiones:', { width, height });

      // Calcular el radio
      const radius = Math.min(width, height) / 2;
      console.log('SunburstChart - Radio calculado:', radius);

      // Crear el layout del gráfico
      const partition = d3.partition<HierarchyData>()
        .size([2 * Math.PI, radius]);

      // Preparar los datos
      const hierarchyData: HierarchyData = {
        name: "root",
        children: data.map(group => ({
          name: group.name,
          value: group.total,
          color: group.colors.bg
        }))
      };

      console.log('SunburstChart - Datos de jerarquía preparados:', hierarchyData);

      const root = d3.hierarchy<HierarchyData>(hierarchyData)
        .sum(d => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      console.log('SunburstChart - Jerarquía creada:', root);

      // Aplicar el layout
      const nodes = partition(root);
      console.log('SunburstChart - Nodos creados:', nodes);

      // Crear el generador de arcos
      const arc = d3.arc<HierarchyRectangularNode>()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);

      // Añadir los arcos
      const pathGroup = svg.append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

      const paths = pathGroup.selectAll("path")
        .data(nodes.descendants().slice(1))
        .join("path")
        .attr("fill", d => d.data.color || "#ccc")
        .attr("fill-opacity", 0.7)
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}\n${d.value} verbos`);

      console.log('SunburstChart - Arcos creados:', paths.size());

      // Añadir las etiquetas
      const textGroup = svg.append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

      const texts = textGroup.selectAll("text")
        .data(nodes.descendants().slice(1))
        .join("text")
        .attr("transform", d => {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", "12px")
        .style("font-family", "sans-serif");

      console.log('SunburstChart - Etiquetas creadas:', texts.size());

    } catch (error) {
      console.error('SunburstChart - Error al crear el gráfico:', error);
    }
  }, [data, width, height]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <svg
        ref={svgRef}
        style={{
          maxWidth: '100%',
          height: 'auto',
          overflow: 'visible',
          backgroundColor: 'white',
          borderRadius: '4px'
        }}
      >
        <text x="50%" y="50%" textAnchor="middle" fill="blue" fontSize="24">
          SVG Renderizado
        </text>
      </svg>
    </div>
  );
};

export default SunburstChart; 