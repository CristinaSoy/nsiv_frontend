import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { verbsAPI } from '../services/api';
import { ColorInfo } from '../types/api.types';

// Tipos para los datos del gráfico multi-nivel
interface MultiLevelData {
  name: string;
  id: number;
  colors: ColorInfo;
  value: number;
  level: 'group' | 'family' | 'subfamily';
  parent?: string;
  children?: MultiLevelData[];
  // Datos adicionales para mostrar
  description?: string;
  comments?: string;
  sample?: string;
  total?: number;
}

interface HierarchyNode extends d3.HierarchyNode<MultiLevelData> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface MultiLevelSunburstProps {
  width?: number;
  height?: number;
  centerText?: string;
}

const MultiLevelSunburst: React.FC<MultiLevelSunburstProps> = ({ 
  width = 800, 
  height = 800,
  centerText = "Explora la jerarquía completa de verbos organizados por grupos, familias y subfamilias. Cada color representa una categoría diferente con su propia estructura interna."
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<MultiLevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labelOrientation, setLabelOrientation] = useState<'horizontal' | 'radial' | 'curved'>('radial');
  const [selectedItem, setSelectedItem] = useState<MultiLevelData | null>(null);
  // Cargar todos los datos necesarios
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Iniciando carga de datos multi-nivel...');

        // Cargar grupos
        console.log('📡 Cargando grupos...');
        const groupsResponse = await verbsAPI.getGroups();
        const groups = groupsResponse.groups;
        console.log(`✅ Cargados ${groups.length} grupos:`, groups.map(g => g.name));

        // Cargar todas las familias y subfamilias
        const hierarchyData: MultiLevelData = {
          name: "Verbos",
          id: 0,
          colors: { border: "#333", bg: "#f8f9fa", shadow: "#ddd" },
          value: 0,
          level: 'group',
          children: []
        };

        let totalValue = 0;

        for (const group of groups) {
          console.log(`📡 Cargando familias del grupo: ${group.name}`);
          
          try {
            // Cargar familias del grupo
            const groupDetailResponse = await verbsAPI.getGroupDetail(group.id);
            const families = groupDetailResponse.families;
            console.log(`✅ Cargadas ${families.length} familias para ${group.name}`);

            const groupData: MultiLevelData = {
              name: group.name,
              id: group.id,
              colors: group.colors,
              value: 0,
              level: 'group',
              parent: 'root',
              children: [],
              description: group.description,
              comments: group.comments,
              sample: group.sample,
              total: group.total
            };

            let groupValue = 0;

            for (const family of families) {
              console.log(`📡 Cargando subfamilias de la familia: ${family.name}`);
              
              try {
                // Cargar subfamilias de la familia
                const familyDetailResponse = await verbsAPI.getFamilyDetail(family.id);
                const subfamilies = familyDetailResponse.subfamilies;
                console.log(`✅ Cargadas ${subfamilies.length} subfamilias para ${family.name}`);

                const familyData: MultiLevelData = {
                  name: family.name,
                  id: family.id,
                  colors: family.colors,
                  value: 0,
                  level: 'family',
                  parent: group.name,
                  children: [],
                  description: family.description,
                  comments: family.comments,
                  sample: family.sample,
                  total: family.total
                };

                let familyValue = 0;

                for (const subfamily of subfamilies) {
                  const subfamilyData: MultiLevelData = {
                    name: subfamily.name,
                    id: subfamily.id,
                    colors: subfamily.colors,
                    value: subfamily.total,
                    level: 'subfamily',
                    parent: family.name,
                    description: subfamily.description,
                    comments: subfamily.comments,
                    sample: subfamily.sample,
                    total: subfamily.total
                  };

                  familyData.children!.push(subfamilyData);
                  familyValue += subfamily.total;
                }

                familyData.value = familyValue;
                groupData.children!.push(familyData);
                groupValue += familyValue;
              } catch (familyError) {
                console.error(`❌ Error cargando subfamilias para familia ${family.name}:`, familyError);
                // Continuar con la siguiente familia en lugar de fallar completamente
              }
            }

            groupData.value = groupValue;
            hierarchyData.children!.push(groupData);
            totalValue += groupValue;
          } catch (groupError) {
            console.error(`❌ Error cargando familias para grupo ${group.name}:`, groupError);
            // Continuar con el siguiente grupo
          }
        }

        hierarchyData.value = totalValue;
        console.log('🎯 Datos jerárquicos completados:', hierarchyData);
        setData(hierarchyData);

      } catch (err) {
        console.error('❌ Error general en carga de datos multi-nivel:', err);
        setError(`Error al cargar los datos jerárquicos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Renderizar el gráfico D3
  useEffect(() => {
    if (!svgRef.current || !data || loading) return;

    // Limpiar el SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 40;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

    // Crear la jerarquía
    const root = d3.hierarchy<MultiLevelData>(data)
      .sum(d => d.children ? 0 : d.value) // Solo contar las hojas (subfamilias)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Crear el layout del gráfico con anillos específicos
    const partition = d3.partition<MultiLevelData>()
      .size([2 * Math.PI, radius]);

    partition(root);

    // Función de arco personalizada para diferentes niveles
    const arc = d3.arc<HierarchyNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 0.05)
      .innerRadius(d => {
        // Anillos concéntricos por nivel
        if (d.depth === 1) return radius * 0.2; // Groups (centro)
        if (d.depth === 2) return radius * 0.45; // Families
        if (d.depth === 3) return radius * 0.7; // Subfamilies
        return 0;
      })
      .outerRadius(d => {
        if (d.depth === 1) return radius * 0.4; // Groups
        if (d.depth === 2) return radius * 0.65; // Families  
        if (d.depth === 3) return radius * 0.9; // Subfamilies
        return 0;
      });

    // Crear grupo para los arcos
    const arcGroup = svg.append("g");

    // Añadir los arcos
    const arcs = arcGroup.selectAll("path")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("path")
      .attr("fill", d => d.data.colors.bg || "#ccc")
      .attr("stroke", d => d.data.colors.border || "#fff")
      .attr("stroke-width", d => d.depth === 1 ? 3 : 2)
      .attr("d", d => arc(d as HierarchyNode))
      .style("cursor", "pointer")
      .style("opacity", 0.8);

    // Eventos de interacción
    arcs
      .on("mouseover", function(_, d) {
        d3.select(this).style("opacity", 1);
        setSelectedItem(d.data);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.8);
        setSelectedItem(null);
      })
      .on("click", (_, d) => {
        console.log(`Clicked on ${d.data.level}: ${d.data.name}`);
        // Aquí podrías implementar drill-down o mostrar detalles
      });

    // Añadir las etiquetas según la orientación seleccionada
    const labelGroup = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none");

    labelGroup.selectAll("text")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill", "#333")
      .attr("font-weight", d => d.depth === 1 ? "bold" : "500")
      .attr("font-size", d => d.depth === 1 ? "14px" : d.depth === 2 ? "12px" : "10px")
      .attr("transform", d => {
        const node = d as HierarchyNode;
        const x = (node.x0 + node.x1) / 2 * 180 / Math.PI;
        const y = (node.y0 + node.y1) / 2;

        switch (labelOrientation) {
          case 'horizontal':
            return `rotate(${x - 90}) translate(${y},0)`;
          case 'curved':
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
          case 'radial':
          default:
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }
      })      .text(d => {
        const node = d as HierarchyNode;
        const angle = node.x1 - node.x0;
        const minAngle = d.depth === 1 ? 0.05 : d.depth === 2 ? 0.08 : 0.12;
        if (angle <= minAngle) return '';
        
        // Mostrar nombre y total según el espacio disponible
        const name = d.data.name;
        const total = d.data.total || d.data.value;
        
        if (angle > 0.2) {
          return `${name} (${total})`;
        } else if (angle > 0.15) {
          return name;
        } else {
          return name.length > 8 ? name.substring(0, 8) + '...' : name;
        }
      });

    // Texto central con información
    const centerGroup = svg.append("g");
    
    // Fondo circular para el texto central
    centerGroup.append("circle")
      .attr("r", radius * 0.18)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 2);

    // Texto central dividido en líneas
    const centerTextLines = wrapText(centerText, 30); // 30 caracteres por línea aprox
    const lineHeight = 14;
    const startY = -(centerTextLines.length * lineHeight) / 2;

    centerTextLines.forEach((line, index) => {
      centerGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", startY + (index * lineHeight))
        .attr("font-size", "11px")
        .attr("fill", "#666")
        .text(line);
    });

  }, [data, loading, labelOrientation, centerText, width, height]);

  // Función para dividir texto en líneas
  const wrapText = (text: string, maxCharsPerLine: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div>🔄 Cargando gráfico multi-nivel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Controles de visualización */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
            📝 Orientación de etiquetas:
          </label>
          <select 
            value={labelOrientation}
            onChange={(e) => setLabelOrientation(e.target.value as any)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="radial">📡 Radial (sigue el arco)</option>
            <option value="horizontal">↔️ Horizontal</option>
            <option value="curved">🌊 Curvada</option>
          </select>
        </div>        {selectedItem && (
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            minWidth: '300px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              borderBottom: '1px solid #eee', 
              paddingBottom: '8px', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: selectedItem.colors.bg,
                  border: `2px solid ${selectedItem.colors.border}`
                }}
              ></div>
              <strong style={{ fontSize: '16px' }}>{selectedItem.name}</strong>
              <span style={{ 
                background: '#e3f2fd', 
                color: '#1976d2', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {selectedItem.level}
              </span>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <div>
                <strong>📊 Total verbos:</strong> {selectedItem.total || selectedItem.value}
              </div>
              
              {selectedItem.sample && (
                <div>
                  <strong>🔤 Ejemplo:</strong> {selectedItem.sample}
                </div>
              )}
              
              {selectedItem.description && (
                <div>
                  <strong>📝 Descripción:</strong> 
                  <div style={{ 
                    marginTop: '4px', 
                    padding: '8px', 
                    background: '#f8f9fa', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    lineHeight: '1.4'
                  }}>
                    {selectedItem.description}
                  </div>
                </div>
              )}
              
              {selectedItem.comments && (
                <div>
                  <strong>💬 Comentarios:</strong>
                  <div style={{ 
                    marginTop: '4px', 
                    padding: '8px', 
                    background: '#fff3e0', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    borderLeft: '3px solid #ff9800'
                  }}>
                    {selectedItem.comments}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico multi-nivel */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Leyenda */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>📊 Leyenda:</strong>
        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
          <div>🎯 <strong>Centro:</strong> Grupos principales</div>
          <div>🔵 <strong>Anillo medio:</strong> Familias de verbos</div>
          <div>🟡 <strong>Anillo exterior:</strong> Subfamilias específicas</div>
        </div>
        {data && (
          <div style={{ marginTop: '8px' }}>
            📈 Total: {data.value} verbos en {data.children?.length || 0} grupos
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiLevelSunburst;
