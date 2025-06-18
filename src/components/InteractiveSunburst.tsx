import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { verbsAPI } from '../services/api';
import { Group, Family, Subfamily, ColorInfo } from '../types/api.types';

// Tipos para el estado de navegación
type NavigationLevel = 'groups' | 'families' | 'subfamilies' | 'verbs';

interface NavigationState {
  level: NavigationLevel;
  selectedGroup?: Group;
  selectedFamily?: Family;
  selectedSubfamily?: Subfamily;
}

// Tipos para los datos del gráfico
interface SunburstData {
  name: string;
  id: number;
  colors: ColorInfo;
  value: number;
  children?: SunburstData[];
  // Datos adicionales
  description?: string;
  comments?: string;
  sample?: string;
  total?: number;
}

interface HierarchyNode extends d3.HierarchyNode<SunburstData> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface InteractiveSunburstProps {
  width?: number;
  height?: number;
  centerText?: string;
}

const InteractiveSunburst: React.FC<InteractiveSunburstProps> = ({ 
  width = 800, 
  height = 800,
  centerText
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    level: 'groups'
  });
  const [data, setData] = useState<SunburstData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos según el nivel actual
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        switch (navigation.level) {
          case 'groups':
            await loadGroups();
            break;
          case 'families':
            if (navigation.selectedGroup) {
              await loadFamilies(navigation.selectedGroup.id);
            }
            break;
          case 'subfamilies':
            if (navigation.selectedFamily) {
              await loadSubfamilies(navigation.selectedFamily.id);
            }
            break;
          case 'verbs':
            if (navigation.selectedSubfamily) {
              await loadVerbs(navigation.selectedSubfamily.id);
            }
            break;
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigation]);
  const loadGroups = async () => {
    const response = await verbsAPI.getGroups();
    const sunburstData: SunburstData[] = response.groups.map(group => ({
      name: group.name,
      id: group.id,
      colors: group.colors,
      value: group.total,
      description: group.description,
      comments: group.comments,
      sample: group.sample,
      total: group.total
    }));
    setData(sunburstData);
  };

  const loadFamilies = async (groupId: number) => {
    const response = await verbsAPI.getGroupDetail(groupId);
    const sunburstData: SunburstData[] = response.families.map(family => ({
      name: family.name,
      id: family.id,
      colors: family.colors,
      value: family.total,
      description: family.description,
      comments: family.comments,
      sample: family.sample,
      total: family.total
    }));
    setData(sunburstData);
  };

  const loadSubfamilies = async (familyId: number) => {
    const response = await verbsAPI.getFamilyDetail(familyId);
    const sunburstData: SunburstData[] = response.subfamilies.map(subfamily => ({
      name: subfamily.name,
      id: subfamily.id,
      colors: subfamily.colors,
      value: subfamily.total,
      description: subfamily.description,
      comments: subfamily.comments,
      sample: subfamily.sample,
      total: subfamily.total
    }));
    setData(sunburstData);
  };

  const loadVerbs = async (subfamilyId: number) => {
    const response = await verbsAPI.getSubfamilyDetail(subfamilyId);
    const sunburstData: SunburstData[] = response.verbs.map((verb, index) => ({
      name: verb.all_forms,
      id: index, // Los verbos no tienen ID único en la respuesta
      colors: navigation.selectedSubfamily!.colors, // Usar el color de la subfamilia
      value: 1 // Cada verbo vale 1
    }));
    setData(sunburstData);
  };

  // Navegar a un nivel más profundo
  const handleItemClick = async (item: SunburstData) => {
    switch (navigation.level) {
      case 'groups':
        // Cargar el grupo completo para tener toda la información
        const groupResponse = await verbsAPI.getGroupDetail(item.id);
        setNavigation({
          level: 'families',
          selectedGroup: groupResponse.group
        });
        break;
      case 'families':
        // Cargar la familia completa
        const familyResponse = await verbsAPI.getFamilyDetail(item.id);
        setNavigation({
          ...navigation,
          level: 'subfamilies',
          selectedFamily: familyResponse.family
        });
        break;
      case 'subfamilies':
        // Para subfamilias, necesitamos cargar la subfamilia completa
        const subfamilyResponse = await verbsAPI.getSubfamilyDetail(item.id);
        setNavigation({
          ...navigation,
          level: 'verbs',
          selectedSubfamily: subfamilyResponse.subfamily
        });
        break;
      case 'verbs':
        // En el nivel de verbos, podríamos mostrar detalles del verbo
        console.log('Clicked on verb:', item.name);
        break;
    }
  };

  // Navegar hacia atrás
  const navigateBack = (targetLevel: NavigationLevel) => {
    switch (targetLevel) {
      case 'groups':
        setNavigation({ level: 'groups' });
        break;
      case 'families':
        setNavigation({
          level: 'families',
          selectedGroup: navigation.selectedGroup
        });
        break;
      case 'subfamilies':
        setNavigation({
          level: 'subfamilies',
          selectedGroup: navigation.selectedGroup,
          selectedFamily: navigation.selectedFamily
        });
        break;
    }
  };

  // Renderizar el gráfico D3
  useEffect(() => {
    if (!svgRef.current || !data.length || loading) return;

    // Limpiar el SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const radius = Math.min(width, height) / 2;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif");

    // Preparar los datos para D3
    const root = d3.hierarchy<SunburstData>({
      name: "root",
      id: 0,
      colors: { border: "", bg: "", shadow: "" },
      value: 0,
      children: data
    })
    .sum(d => d.value)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Crear el layout del gráfico
    const partition = d3.partition<SunburstData>()
      .size([2 * Math.PI, radius]);

    partition(root);

    const arc = d3.arc<HierarchyNode>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 0.1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    // Crear grupo para los arcos
    const arcGroup = svg.append("g");

    // Añadir los arcos
    arcGroup.selectAll("path")
      .data(root.descendants().filter(d => d.depth > 0)) // Excluir el nodo root
      .join("path")
      .attr("fill", d => d.data.colors.bg || "#ccc")
      .attr("stroke", d => d.data.colors.border || "#fff")
      .attr("stroke-width", 2)
      .attr("d", d => arc(d as HierarchyNode))
      .style("cursor", "pointer")
      .style("opacity", 0.8)      .on("mouseover", function() {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 0.8);
      })
      .on("click", async (_, d) => {
        await handleItemClick(d.data);
      });

    // Añadir las etiquetas
    const labelGroup = svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none");

    labelGroup.selectAll("text")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill", "#333")
      .attr("font-weight", "500")
      .attr("transform", d => {
        const node = d as HierarchyNode;
        const x = (node.x0 + node.x1) / 2 * 180 / Math.PI;
        const y = (node.y0 + node.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .text(d => {
        const node = d as HierarchyNode;
        const angle = node.x1 - node.x0;
        const minAngle = 0.1; // Ángulo mínimo para mostrar texto
        return angle > minAngle ? d.data.name : '';
      });    // Título y texto central mejorado
    const centerGroup = svg.append("g");
    
    // Fondo circular para el texto central
    centerGroup.append("circle")
      .attr("r", radius * 0.15)
      .attr("fill", "white")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 2);

    // Título principal
    centerGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text(getTitleText());

    // Texto descriptivo si se proporciona
    if (centerText) {
      const textLines = wrapText(centerText, 25);
      const lineHeight = 12;
      const startY = 10;

      textLines.slice(0, 6).forEach((line, index) => { // Máximo 6 líneas
        centerGroup.append("text")
          .attr("text-anchor", "middle")
          .attr("y", startY + (index * lineHeight))
          .attr("font-size", "10px")
          .attr("fill", "#666")
          .text(line);
      });
    }

  }, [data, loading, navigation.level, width, height, centerText]);

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

  const getTitleText = (): string => {
    switch (navigation.level) {
      case 'groups':
        return 'Grupos de Verbos';
      case 'families':
        return `Familias de ${navigation.selectedGroup?.name}`;
      case 'subfamilies':
        return `Subfamilias de ${navigation.selectedFamily?.name}`;
      case 'verbs':
        return `Verbos de ${navigation.selectedSubfamily?.name}`;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div>🔄 Cargando gráfico...</div>
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
      {/* Breadcrumb Navigation */}
      <nav style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button 
          onClick={() => navigateBack('groups')}
          style={{
            background: navigation.level === 'groups' ? '#4ecdc4' : 'transparent',
            color: navigation.level === 'groups' ? 'white' : '#4ecdc4',
            border: '1px solid #4ecdc4',
            padding: '4px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🏠 Grupos
        </button>
        
        {navigation.selectedGroup && (
          <>
            <span style={{ color: '#666' }}>→</span>
            <button 
              onClick={() => navigateBack('families')}
              style={{
                background: navigation.level === 'families' ? '#4ecdc4' : 'transparent',
                color: navigation.level === 'families' ? 'white' : '#4ecdc4',
                border: '1px solid #4ecdc4',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {navigation.selectedGroup.name}
            </button>
          </>
        )}
        
        {navigation.selectedFamily && (
          <>
            <span style={{ color: '#666' }}>→</span>
            <button 
              onClick={() => navigateBack('subfamilies')}
              style={{
                background: navigation.level === 'subfamilies' ? '#4ecdc4' : 'transparent',
                color: navigation.level === 'subfamilies' ? 'white' : '#4ecdc4',
                border: '1px solid #4ecdc4',
                padding: '4px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {navigation.selectedFamily.name}
            </button>
          </>
        )}
        
        {navigation.selectedSubfamily && (
          <>
            <span style={{ color: '#666' }}>→</span>
            <span style={{
              background: '#4ecdc4',
              color: 'white',
              border: '1px solid #4ecdc4',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {navigation.selectedSubfamily.name}
            </span>
          </>
        )}
      </nav>

      {/* Gráfico Sunburst */}
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

      {/* Información adicional */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>💡 Instrucciones:</strong> Haz clic en cualquier sector del gráfico para explorar el siguiente nivel de detalle.
        {data.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            📊 Mostrando {data.length} elemento(s) | 
            Total: {data.reduce((sum, item) => sum + item.value, 0)} verbos
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveSunburst;
