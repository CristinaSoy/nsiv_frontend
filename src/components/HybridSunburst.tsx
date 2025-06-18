import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { verbsAPI } from '../services/api';
import { Group, Family, Subfamily, ColorInfo } from '../types/api.types';

// Tipos para el modo de visualización
type VisualizationMode = 'drill-down' | 'multilevel';

// Tipos para los datos del gráfico
interface HybridData {
  name: string;
  id: number;
  colors: ColorInfo;
  value: number;
  level: 'group' | 'family' | 'subfamily';
  parent?: string;
  children?: HybridData[];
  // Datos adicionales
  description?: string;
  comments?: string;
  sample?: string;
  total?: number;
}

// Estado de navegación para el modo drill-down
type NavigationLevel = 'groups' | 'families' | 'subfamilies' | 'verbs';

interface NavigationState {
  level: NavigationLevel;
  selectedGroup?: Group;
  selectedFamily?: Family;
  selectedSubfamily?: Subfamily;
}

interface HierarchyNode extends d3.HierarchyNode<HybridData> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface HybridSunburstProps {
  width?: number;
  height?: number;
  initialMode?: VisualizationMode;
}

const HybridSunburst: React.FC<HybridSunburstProps> = ({ 
  width = 800, 
  height = 800,
  initialMode = 'drill-down'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Estados para el modo
  const [mode, setMode] = useState<VisualizationMode>(initialMode);
  
  // Estados para datos
  const [drillDownData, setDrillDownData] = useState<HybridData | null>(null);
  const [multiLevelData, setMultiLevelData] = useState<HybridData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para navegación drill-down
  const [navigation, setNavigation] = useState<NavigationState>({
    level: 'groups'
  });
  
  // Estados para configuración visual
  const [labelOrientation, setLabelOrientation] = useState<'horizontal' | 'radial' | 'curved'>('horizontal');
  const [selectedItem, setSelectedItem] = useState<HybridData | null>(null);

  // Cargar datos según el modo
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (mode === 'drill-down') {
          await loadDrillDownData();
        } else {
          await loadMultiLevelData();
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mode, navigation.level, navigation.selectedGroup, navigation.selectedFamily]);
  // Cargar datos para drill-down
  const loadDrillDownData = async () => {
    const { level, selectedGroup, selectedFamily } = navigation;
    
    if (level === 'groups') {
      const response = await verbsAPI.getGroups();
      const groups = response.groups;
      const transformedData: HybridData = {
        name: 'Root',
        id: 0,
        colors: { border: '#ffffff', bg: '#ffffff', shadow: '#000000' },
        value: 1,
        level: 'group',
        children: groups.map(group => ({
          name: group.name,
          id: group.id,
          colors: group.colors,
          value: group.total || 1,
          level: 'group' as const,
          description: group.description,
          comments: group.comments,
          sample: group.sample,
          total: group.total
        }))
      };
      setDrillDownData(transformedData);
    } else if (level === 'families' && selectedGroup) {
      const response = await verbsAPI.getGroupDetail(selectedGroup.id);
      const families = response.families;
      const transformedData: HybridData = {
        name: selectedGroup.name,
        id: selectedGroup.id,
        colors: selectedGroup.colors,
        value: 1,
        level: 'group',
        children: families.map(family => ({
          name: family.name,
          id: family.id,
          colors: family.colors,
          value: family.total || 1,
          level: 'family' as const,
          description: family.description,
          comments: family.comments,
          sample: family.sample,
          total: family.total
        }))
      };
      setDrillDownData(transformedData);
    } else if (level === 'subfamilies' && selectedFamily) {
      const response = await verbsAPI.getFamilyDetail(selectedFamily.id);
      const subfamilies = response.subfamilies;
      const transformedData: HybridData = {
        name: selectedFamily.name,
        id: selectedFamily.id,
        colors: selectedFamily.colors,
        value: 1,
        level: 'family',
        children: subfamilies.map(subfamily => ({
          name: subfamily.name,
          id: subfamily.id,
          colors: subfamily.colors,
          value: subfamily.total || 1,
          level: 'subfamily' as const,
          description: subfamily.description,
          comments: subfamily.comments,
          sample: subfamily.sample,
          total: subfamily.total
        }))
      };
      setDrillDownData(transformedData);
    }
  };
  // Cargar datos para multi-nivel
  const loadMultiLevelData = async () => {
    const groupsResponse = await verbsAPI.getGroups();
    const groups = groupsResponse.groups;
    
    const root: HybridData = {
      name: 'Root',
      id: 0,
      colors: { border: '#ffffff', bg: '#ffffff', shadow: '#000000' },
      value: 1,
      level: 'group',
      children: []
    };

    for (const group of groups) {
      const familiesResponse = await verbsAPI.getGroupDetail(group.id);
      const families = familiesResponse.families;
      
      const groupNode: HybridData = {
        name: group.name,
        id: group.id,
        colors: group.colors,
        value: group.total || 1,
        level: 'group',
        description: group.description,
        comments: group.comments,
        sample: group.sample,
        total: group.total,
        children: []
      };

      for (const family of families) {
        const subfamiliesResponse = await verbsAPI.getFamilyDetail(family.id);
        const subfamilies = subfamiliesResponse.subfamilies;
        
        const familyNode: HybridData = {
          name: family.name,
          id: family.id,
          colors: family.colors,
          value: family.total || 1,
          level: 'family',
          description: family.description,
          comments: family.comments,
          sample: family.sample,
          total: family.total,
          children: subfamilies.map((subfamily: Subfamily) => ({
            name: subfamily.name,
            id: subfamily.id,
            colors: subfamily.colors,
            value: subfamily.total || 1,
            level: 'subfamily' as const,
            description: subfamily.description,
            comments: subfamily.comments,
            sample: subfamily.sample,
            total: subfamily.total
          }))
        };

        groupNode.children?.push(familyNode);
      }

      root.children?.push(groupNode);
    }

    setMultiLevelData(root);
  };

  // Renderizar el gráfico
  useEffect(() => {
    const data = mode === 'drill-down' ? drillDownData : multiLevelData;
    if (!data || !svgRef.current) return;

    renderSunburst(data);
  }, [drillDownData, multiLevelData, mode, labelOrientation]);

  // Función principal de renderizado
  const renderSunburst = (data: HybridData) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const innerRadius = mode === 'multilevel' ? radius * 0.15 : radius * 0.2;

    // Configuración del partition
    const partition = d3.partition<HybridData>()
      .size([2 * Math.PI, radius - innerRadius]);

    // Crear jerarquía
    const root = d3.hierarchy(data)
      .sum(d => d.children ? 0 : d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const nodes = partition(root).descendants() as HierarchyNode[];

    // Configurar el contenedor principal
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Función para obtener el radio según el nivel en modo multilevel
    const getRadius = (depth: number) => {
      if (mode === 'drill-down') {
        return innerRadius + (radius - innerRadius) * (depth + 1) / (root.height + 1);
      } else {
        // Para multilevel, asignar anillos específicos por nivel
        switch (depth) {
          case 0: return innerRadius; // Root (no visible)
          case 1: return innerRadius + (radius - innerRadius) * 0.33; // Groups
          case 2: return innerRadius + (radius - innerRadius) * 0.66; // Families
          case 3: return radius; // Subfamilies
          default: return radius;
        }
      }
    };

    // Crear el generador de arcos
    const arc = d3.arc<HierarchyNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => getRadius(d.depth - 1))
      .outerRadius(d => getRadius(d.depth));    // Renderizar los sectores
    const paths = g.selectAll('path')
      .data(nodes.filter(d => d.depth > 0))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.colors.bg || '#dddddd')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('opacity', 0.9);

    // Añadir interacciones
    paths
      .on('mouseover', function(_event, d) {
        d3.select(this).style('opacity', 1);
        setSelectedItem(d.data);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.9);
      })
      .on('click', (_event, d) => {
        if (mode === 'drill-down') {
          handleDrillDown(d.data);
        }
      });

    // Añadir etiquetas
    renderLabels(g, nodes.filter(d => d.depth > 0));

    // Añadir texto central
    renderCenterText(g);
  };
  // Manejar drill-down
  const handleDrillDown = (data: HybridData) => {
    if (data.level === 'group' && navigation.level === 'groups') {
      // Para crear un Group completo, incluimos la propiedad taxonomy requerida
      const group: Group = {
        id: data.id,
        name: data.name,
        colors: data.colors,
        description: data.description || '',
        comments: data.comments || '',
        sample: data.sample || '',
        total: data.total || 0,
        taxonomy: '' // Valor por defecto para la propiedad requerida
      };
      setNavigation({
        level: 'families',
        selectedGroup: group
      });
    } else if (data.level === 'family' && navigation.level === 'families') {
      // Para crear una Family completa
      const family: Family = {
        id: data.id,
        name: data.name,
        colors: data.colors,
        description: data.description || '',
        comments: data.comments || '',
        sample: data.sample || '',
        total: data.total || 0
      };
      setNavigation({
        ...navigation,
        level: 'subfamilies',
        selectedFamily: family
      });
    }
  };

  // Renderizar etiquetas
  const renderLabels = (g: d3.Selection<SVGGElement, unknown, null, undefined>, nodes: HierarchyNode[]) => {
    // Solo mostrar etiquetas para sectores lo suficientemente grandes
    const visibleNodes = nodes.filter(d => {
      const angle = d.x1 - d.x0;
      return angle > 0.05; // Mínimo ángulo para mostrar etiqueta
    });

    const labels = g.selectAll('.label')
      .data(visibleNodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('pointer-events', 'none')
      .style('fill', '#000000'); // Usar color fijo por ahora

    // Posicionar etiquetas según la orientación
    if (labelOrientation === 'horizontal') {
      labels
        .attr('transform', d => {
          const angle = (d.x0 + d.x1) / 2;
          const labelRadius = (getRadiusForDepth(d.depth - 1) + getRadiusForDepth(d.depth)) / 2;
          const x = Math.cos(angle - Math.PI / 2) * labelRadius;
          const y = Math.sin(angle - Math.PI / 2) * labelRadius;
          return `translate(${x}, ${y})`;
        });
    } else {
      labels
        .attr('transform', d => {
          const angle = (d.x0 + d.x1) / 2;
          const labelRadius = (getRadiusForDepth(d.depth - 1) + getRadiusForDepth(d.depth)) / 2;
          const x = Math.cos(angle - Math.PI / 2) * labelRadius;
          const y = Math.sin(angle - Math.PI / 2) * labelRadius;
          const rotation = angle < Math.PI ? (angle - Math.PI / 2) * 180 / Math.PI : (angle + Math.PI / 2) * 180 / Math.PI;
          return `translate(${x}, ${y}) rotate(${rotation})`;
        });
    }

    // Truncar texto largo
    labels.text(d => {
      const maxLength = mode === 'multilevel' ? 8 : 12;
      return d.data.name.length > maxLength ? d.data.name.substring(0, maxLength) + '...' : d.data.name;
    });
  };

  // Función auxiliar para obtener el radio por profundidad
  const getRadiusForDepth = (depth: number) => {
    const totalRadius = Math.min(width, height) / 2;
    const innerRadius = mode === 'multilevel' ? totalRadius * 0.15 : totalRadius * 0.2;
    
    if (mode === 'drill-down') {
      return innerRadius + (totalRadius - innerRadius) * (depth + 1) / 4;
    } else {
      // Para multilevel, asignar anillos específicos por nivel
      switch (depth) {
        case 0: return innerRadius; // Root (no visible)
        case 1: return innerRadius + (totalRadius - innerRadius) * 0.33; // Groups
        case 2: return innerRadius + (totalRadius - innerRadius) * 0.66; // Families
        case 3: return totalRadius; // Subfamilies
        default: return totalRadius;
      }
    }
  };

  // Renderizar texto central
  const renderCenterText = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => {
    const centerGroup = g.append('g').attr('class', 'center-text');

    // Título principal
    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', -20)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(mode === 'drill-down' ? 'Drill-Down' : 'Multi-Nivel');

    // Texto descriptivo
    const description = mode === 'drill-down' 
      ? 'Haz clic para explorar'
      : 'Vista completa';

    centerGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 0)
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(description);

    // Información del nivel actual (para drill-down)
    if (mode === 'drill-down') {
      let levelText = '';
      switch (navigation.level) {
        case 'groups':
          levelText = 'Grupos';
          break;
        case 'families':
          levelText = `Familias de ${navigation.selectedGroup?.name}`;
          break;
        case 'subfamilies':
          levelText = `Subfamilias de ${navigation.selectedFamily?.name}`;
          break;
      }

      centerGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('y', 20)
        .style('font-size', '10px')
        .style('fill', '#888')
        .text(levelText);
    }
  };

  // Función para ir hacia atrás en la navegación
  const goBack = () => {
    if (navigation.level === 'families') {
      setNavigation({ level: 'groups' });
    } else if (navigation.level === 'subfamilies') {
      setNavigation({
        level: 'families',
        selectedGroup: navigation.selectedGroup
      });
    }
  };

  // Función para resetear al inicio
  const resetToGroups = () => {
    setNavigation({ level: 'groups' });
  };

  const getCenterText = () => {
    if (mode === 'drill-down') {
      return "Modo Drill-Down: Haz clic en cualquier sector para explorar el siguiente nivel.";
    } else {
      return "Modo Multi-Nivel: Vista completa de la jerarquía en anillos concéntricos.";
    }
  };

  return (
    <div className="hybrid-sunburst">
      {/* Controles principales */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2>🔄 Gráfico Sunburst Híbrido</h2>
        
        {/* Toggle de modo */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            Modo:
          </label>
          <button
            onClick={() => setMode('drill-down')}
            style={{
              background: mode === 'drill-down' ? '#ff6b6b' : 'transparent',
              color: mode === 'drill-down' ? 'white' : '#ff6b6b',
              border: '2px solid #ff6b6b',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            🎯 Drill-Down
          </button>
          <button
            onClick={() => setMode('multilevel')}
            style={{
              background: mode === 'multilevel' ? '#4ecdc4' : 'transparent',
              color: mode === 'multilevel' ? 'white' : '#4ecdc4',
              border: '2px solid #4ecdc4',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            🌐 Multi-Nivel
          </button>
        </div>
      </div>

      {/* Controles secundarios */}
      <div style={{
        margin: '0 20px 20px',
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          {/* Orientación de etiquetas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontWeight: '500' }}>Etiquetas:</label>
            <select
              value={labelOrientation}
              onChange={(e) => setLabelOrientation(e.target.value as 'horizontal' | 'radial' | 'curved')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              <option value="horizontal">Horizontales</option>
              <option value="radial">Radiales</option>
              <option value="curved">Curvadas</option>
            </select>
          </div>

          {/* Navegación para drill-down */}
          {mode === 'drill-down' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontWeight: '500' }}>Navegación:</label>
              {navigation.level !== 'groups' && (
                <button
                  onClick={goBack}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ← Atrás
                </button>
              )}
              <button
                onClick={resetToGroups}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🏠 Inicio
              </button>
            </div>
          )}
        </div>

        {/* Descripción del modo actual */}
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: mode === 'drill-down' ? '#fff5f5' : '#f0fff4',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#666'
        }}>
          {getCenterText()}
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>
          🔄 Cargando datos...
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          fontSize: '16px', 
          color: '#dc3545',
          background: '#f8d7da',
          margin: '20px',
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ Error: {error}
        </div>
      )}

      {/* SVG del gráfico */}
      {!loading && !error && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg ref={svgRef}></svg>
        </div>
      )}

      {/* Panel de información del elemento seleccionado */}
      {selectedItem && (
        <div style={{
          margin: '20px',
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '2px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>          <h3 style={{ 
            margin: '0 0 12px 0', 
            color: selectedItem.colors.bg,
            borderBottom: `2px solid ${selectedItem.colors.bg}`,
            paddingBottom: '8px'
          }}>
            📊 {selectedItem.name}
          </h3>
          
          {selectedItem.description && (
            <p style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Descripción:</strong> {selectedItem.description}
            </p>
          )}
          
          {selectedItem.total && (
            <p style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Total de verbos:</strong> {selectedItem.total}
            </p>
          )}
          
          {selectedItem.sample && (
            <p style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Ejemplo:</strong> {selectedItem.sample}
            </p>
          )}
          
          {selectedItem.comments && (
            <p style={{ margin: '8px 0', fontSize: '14px', fontStyle: 'italic', color: '#666' }}>
              💭 {selectedItem.comments}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HybridSunburst;
