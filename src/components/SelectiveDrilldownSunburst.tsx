import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { verbsAPI } from '../services/api';
import { ColorInfo } from '../types/api.types';

// Tipos para los datos del gráfico híbrido
interface HybridSunburstData {
  name: string;
  id: number;
  colors: ColorInfo;
  value: number;
  level: 'group' | 'family' | 'subfamily';
  parent?: string;
  children?: HybridSunburstData[];
  // Datos adicionales
  description?: string;
  comments?: string;
  sample?: string;
  total?: number;
  // Control de expansión
  isExpanded?: boolean;
  isLoaded?: boolean;
}

interface HierarchyNode extends d3.HierarchyNode<HybridSunburstData> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface SelectiveDrilldownSunburstProps {
  width?: number;
  height?: number;
  centerText?: string;
}

const SelectiveDrilldownSunburst: React.FC<SelectiveDrilldownSunburstProps> = ({ 
  width = 800, 
  height = 800,
  centerText = "Haz clic en cualquier sector para expandir solo esa sección. Etiquetas siempre horizontales para mejor legibilidad."
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<HybridSunburstData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HybridSunburstData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Cargar datos iniciales (solo grupos)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Cargando datos iniciales (grupos)...');
        const groupsResponse = await verbsAPI.getGroups();
        const groups = groupsResponse.groups;

        const hierarchyData: HybridSunburstData = {
          name: "Verbos",
          id: 0,
          colors: { border: "#333", bg: "#f8f9fa", shadow: "#ddd" },
          value: 0,
          level: 'group',
          children: groups.map(group => ({
            name: group.name,
            id: group.id,
            colors: group.colors,
            value: group.total,
            level: 'group' as const,
            parent: 'root',
            description: group.description,
            comments: group.comments,
            sample: group.sample,
            total: group.total,
            isExpanded: false,
            isLoaded: false
          }))
        };

        hierarchyData.value = groups.reduce((sum, group) => sum + group.total, 0);
        setData(hierarchyData);

        console.log('✅ Datos iniciales cargados:', hierarchyData);
      } catch (err) {
        console.error('❌ Error cargando datos iniciales:', err);
        setError(`Error al cargar los datos: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Función para expandir/contraer una sección específica
  const toggleSectionExpansion = async (targetItem: HybridSunburstData) => {
    if (!data) return;

    const sectionKey = `${targetItem.level}-${targetItem.id}`;
    const newExpandedSections = new Set(expandedSections);

    try {
      setLoading(true);

      if (expandedSections.has(sectionKey)) {
        // Contraer: remover hijos
        newExpandedSections.delete(sectionKey);
        setExpandedSections(newExpandedSections);
        
        const newData = await collapseSectionInData(data, targetItem);
        setData(newData);
      } else {
        // Expandir: cargar y agregar hijos
        newExpandedSections.add(sectionKey);
        setExpandedSections(newExpandedSections);

        const newData = await expandSectionInData(data, targetItem);
        setData(newData);
      }
    } catch (err) {
      console.error('❌ Error al expandir/contraer sección:', err);
      setError(`Error al cargar datos de ${targetItem.name}`);
    } finally {
      setLoading(false);
    }
  };

  // Expandir una sección cargando sus datos
  const expandSectionInData = async (
    currentData: HybridSunburstData, 
    targetItem: HybridSunburstData
  ): Promise<HybridSunburstData> => {
    const expandNode = (node: HybridSunburstData): HybridSunburstData => {
      if (node.id === targetItem.id && node.level === targetItem.level) {
        // Este es el nodo a expandir
        return { ...node, isExpanded: true, isLoaded: true };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => expandNode(child))
        };
      }

      return node;
    };

    let expandedData = expandNode(currentData);

    // Cargar los datos específicos según el nivel
    if (targetItem.level === 'group') {
      const groupDetailResponse = await verbsAPI.getGroupDetail(targetItem.id);
      const families = groupDetailResponse.families;

      // Encontrar el grupo en los datos y agregar familias
      expandedData = addChildrenToNode(expandedData, targetItem, families.map(family => ({
        name: family.name,
        id: family.id,
        colors: family.colors,
        value: family.total,
        level: 'family' as const,
        parent: targetItem.name,
        description: family.description,
        comments: family.comments,
        sample: family.sample,
        total: family.total,
        isExpanded: false,
        isLoaded: false
      })));
    } else if (targetItem.level === 'family') {
      const familyDetailResponse = await verbsAPI.getFamilyDetail(targetItem.id);
      const subfamilies = familyDetailResponse.subfamilies;

      expandedData = addChildrenToNode(expandedData, targetItem, subfamilies.map(subfamily => ({
        name: subfamily.name,
        id: subfamily.id,
        colors: subfamily.colors,
        value: subfamily.total,
        level: 'subfamily' as const,
        parent: targetItem.name,
        description: subfamily.description,
        comments: subfamily.comments,
        sample: subfamily.sample,
        total: subfamily.total,
        isExpanded: false,
        isLoaded: false
      })));
    }

    return expandedData;
  };

  // Contraer una sección removiendo sus hijos
  const collapseSectionInData = async (
    currentData: HybridSunburstData, 
    targetItem: HybridSunburstData
  ): Promise<HybridSunburstData> => {
    const collapseNode = (node: HybridSunburstData): HybridSunburstData => {
      if (node.id === targetItem.id && node.level === targetItem.level) {
        // Remover hijos y marcar como no expandido
        return { 
          ...node, 
          isExpanded: false,
          children: undefined 
        };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => collapseNode(child))
        };
      }

      return node;
    };

    return collapseNode(currentData);
  };

  // Función auxiliar para agregar hijos a un nodo específico
  const addChildrenToNode = (
    data: HybridSunburstData, 
    targetItem: HybridSunburstData, 
    children: HybridSunburstData[]
  ): HybridSunburstData => {
    const updateNode = (node: HybridSunburstData): HybridSunburstData => {
      if (node.id === targetItem.id && node.level === targetItem.level) {
        return { ...node, children };
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => updateNode(child))
        };
      }

      return node;
    };

    return updateNode(data);
  };

  // Renderizar el gráfico D3 con etiquetas horizontales inteligentes
  useEffect(() => {
    if (!svgRef.current || !data || loading) return;

    // Limpiar el SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 60;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

    // Crear la jerarquía
    const root = d3.hierarchy<HybridSunburstData>(data)
      .sum(d => d.children ? 0 : d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Crear el layout del gráfico con anillos dinámicos
    const partition = d3.partition<HybridSunburstData>()
      .size([2 * Math.PI, radius]);

    partition(root);

    // Función de arco con anillos dinámicos
    const arc = d3.arc<HierarchyNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 0.02)
      .innerRadius(d => {
        const ringWidth = radius / (root.height + 1);
        return d.depth * ringWidth;
      })
      .outerRadius(d => {
        const ringWidth = radius / (root.height + 1);
        return (d.depth + 1) * ringWidth;
      });

    // Crear grupo para los arcos
    const arcGroup = svg.append("g");

    // Añadir los arcos con animación
    const arcs = arcGroup.selectAll("path")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("path")
      .attr("fill", d => d.data.colors.bg || "#ccc")
      .attr("stroke", d => d.data.colors.border || "#fff")
      .attr("stroke-width", 2)
      .attr("d", d => arc(d as HierarchyNode))
      .style("cursor", "pointer")
      .style("opacity", 0.85)
      .style("transition", "opacity 0.3s ease");

    // Eventos de interacción mejorados
    arcs
      .on("mouseover", function(_, d) {
        d3.select(this).style("opacity", 1);
        setSelectedItem(d.data);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.85);
      })
      .on("click", async (_, d) => {
        // Solo permitir expansión en grupos y familias
        if (d.data.level === 'group' || d.data.level === 'family') {
          await toggleSectionExpansion(d.data);
        }
      });

    // Añadir indicadores de expansión (+ / -)
    const expansionGroup = svg.append("g");
    
    expansionGroup.selectAll("circle")
      .data(root.descendants().filter(d => 
        d.depth > 0 && (d.data.level === 'group' || d.data.level === 'family')
      ))
      .join("circle")
      .attr("cx", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2;
        return Math.sin(angle) * radius;
      })
      .attr("cy", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2;
        return -Math.cos(angle) * radius;
      })
      .attr("r", 8)
      .attr("fill", "white")
      .attr("stroke", "#4ecdc4")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    expansionGroup.selectAll("text.expansion-indicator")
      .data(root.descendants().filter(d => 
        d.depth > 0 && (d.data.level === 'group' || d.data.level === 'family')
      ))
      .join("text")
      .attr("class", "expansion-indicator")
      .attr("x", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2;
        return Math.sin(angle) * radius;
      })
      .attr("y", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2;
        return -Math.cos(angle) * radius;
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#4ecdc4")
      .style("pointer-events", "none")
      .text(d => {
        const sectionKey = `${d.data.level}-${d.data.id}`;
        return expandedSections.has(sectionKey) ? "−" : "+";
      });

    // Añadir etiquetas horizontales inteligentes
    const labelGroup = svg.append("g")
      .attr("pointer-events", "none")
      .style("user-select", "none");

    labelGroup.selectAll("text")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("text")
      .attr("x", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2 + 15; // Offset desde el centro del arco
        return Math.sin(angle) * radius;
      })
      .attr("y", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const radius = (node.y0 + node.y1) / 2 + 15;
        return -Math.cos(angle) * radius;
      })
      .attr("text-anchor", d => {
        const node = d as HierarchyNode;
        const angle = (node.x0 + node.x1) / 2;
        const degrees = angle * 180 / Math.PI;
        // Centrar texto para sectores grandes, ajustar para pequeños
        if ((node.x1 - node.x0) > 0.3) return "middle";
        return degrees > 90 && degrees < 270 ? "end" : "start";
      })
      .attr("dominant-baseline", "middle")
      .attr("font-size", d => d.depth === 1 ? "13px" : d.depth === 2 ? "11px" : "10px")
      .attr("font-weight", d => d.depth === 1 ? "bold" : "500")
      .attr("fill", "#333")
      .text(d => {
        const node = d as HierarchyNode;
        const angle = node.x1 - node.x0;
        
        if (angle < 0.08) return ''; // No mostrar texto en sectores muy pequeños
        
        const name = d.data.name;
        const total = d.data.total || d.data.value;
        
        if (angle > 0.25) {
          return `${name}\n(${total})`;
        } else if (angle > 0.15) {
          return name.length > 12 ? name.substring(0, 12) + '...' : name;
        } else {
          return name.length > 8 ? name.substring(0, 8) + '...' : name;
        }
      });

    // Texto central con información
    const centerGroup = svg.append("g");
    
    // Fondo circular para el texto central
    centerGroup.append("circle")
      .attr("r", radius * 0.15)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 2);

    // Texto central dividido en líneas
    const centerTextLines = wrapText(centerText, 28);
    const lineHeight = 12;
    const startY = -(centerTextLines.length * lineHeight) / 2;

    centerTextLines.forEach((line, index) => {
      centerGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", startY + (index * lineHeight))
        .attr("font-size", "10px")
        .attr("fill", "#666")
        .text(line);
    });

  }, [data, loading, expandedSections, centerText, width, height]);

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
        <div>🔄 {expandedSections.size > 0 ? 'Expandiendo sección...' : 'Cargando gráfico híbrido...'}</div>
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
      {/* Panel de información expandida */}
      {selectedItem && (
        <div style={{
          marginBottom: '20px',
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '14px',
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
            {(selectedItem.level === 'group' || selectedItem.level === 'family') && (
              <span style={{ 
                background: selectedItem.isExpanded ? '#e8f5e8' : '#fff3e0', 
                color: selectedItem.isExpanded ? '#2e7d32' : '#f57c00', 
                padding: '2px 8px', 
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {selectedItem.isExpanded ? '📂 Expandido' : '📁 Contraído'}
              </span>
            )}
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

      {/* Gráfico híbrido */}
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

      {/* Leyenda e instrucciones */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>🎯 Gráfico Híbrido - Instrucciones:</strong>
        <div style={{ marginTop: '8px', display: 'grid', gap: '6px' }}>
          <div>🖱️ <strong>Hover:</strong> Ver información detallada de cada sección</div>
          <div>🔄 <strong>Click:</strong> Expandir/contraer grupos y familias selectivamente</div>
          <div>➕ <strong>Indicadores:</strong> + para expandir, − para contraer</div>
          <div>📏 <strong>Etiquetas:</strong> Siempre horizontales para mejor legibilidad</div>
        </div>
        {data && (
          <div style={{ marginTop: '8px' }}>
            📈 Total: {data.value} verbos en {data.children?.length || 0} grupos | 
            🔓 Secciones expandidas: {expandedSections.size}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectiveDrilldownSunburst;
