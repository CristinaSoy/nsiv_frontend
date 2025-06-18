import React, { useState } from 'react';
import InteractiveSunburst from './InteractiveSunburst';
import MultiLevelSunburst from './MultiLevelSunburst';
import HybridSunburst from './HybridSunburst';

type SunburstVersion = 'interactive' | 'multilevel' | 'hybrid';

const VerbHierarchy: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<SunburstVersion>('hybrid');
  const renderSunburst = () => {
    const interactiveText = "Explora los verbos nivel por nivel. Haz clic en cualquier sector para profundizar en familias y subfamilias específicas.";
    const multiLevelText = "Vista completa de la jerarquía de verbos organizados en anillos concéntricos por grupos, familias y subfamilias.";

    switch (currentVersion) {
      case 'interactive':
        return <InteractiveSunburst centerText={interactiveText} />;
      case 'multilevel':
        return <MultiLevelSunburst centerText={multiLevelText} />;
      case 'hybrid':
        return <HybridSunburst />;
      default:
        return <HybridSunburst />;
    }
  };

  return (
    <div className="verb-hierarchy">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 20px'
      }}>
        <h1>Jerarquía de Verbos</h1>
        
        {/* Selector de versiones */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>
            🧪 Versión:
          </label>          <button
            onClick={() => setCurrentVersion('interactive')}
            style={{
              background: currentVersion === 'interactive' ? '#4ecdc4' : 'transparent',
              color: currentVersion === 'interactive' ? 'white' : '#4ecdc4',
              border: '2px solid #4ecdc4',
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
            onClick={() => setCurrentVersion('multilevel')}
            style={{
              background: currentVersion === 'multilevel' ? '#4ecdc4' : 'transparent',
              color: currentVersion === 'multilevel' ? 'white' : '#4ecdc4',
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
          <button
            onClick={() => setCurrentVersion('hybrid')}
            style={{
              background: currentVersion === 'hybrid' ? '#ff6b6b' : 'transparent',
              color: currentVersion === 'hybrid' ? 'white' : '#ff6b6b',
              border: '2px solid #ff6b6b',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 Híbrido
          </button>
        </div>
      </div>      {/* Descripción de la versión actual */}
      <div style={{
        margin: '0 20px 20px',
        padding: '12px 16px',
        background: '#f0f8ff',
        borderRadius: '6px',
        border: '1px solid #b3d9ff',
        fontSize: '14px'
      }}>
        {currentVersion === 'interactive' ? (
          <div>
            <strong>🎯 Drill-Down Interactivo:</strong> Haz clic en cualquier sector para explorar el siguiente nivel. 
            Usa los breadcrumbs para navegar hacia atrás.
          </div>
        ) : currentVersion === 'multilevel' ? (
          <div>
            <strong>🌐 Vista Multi-Nivel:</strong> Visualiza toda la jerarquía en anillos concéntricos. 
            Centro: Grupos, Medio: Familias, Exterior: Subfamilias.
          </div>
        ) : (
          <div>
            <strong>🔄 Gráfico Híbrido:</strong> Combina ambos modos con un toggle para alternar entre drill-down y vista multinivel. 
            Incluye controles de navegación y orientación de etiquetas.
          </div>
        )}
      </div>

      {/* Renderizar el componente seleccionado */}
      {renderSunburst()}
    </div>
  );
};

export default VerbHierarchy; 