import React, { useEffect, useState } from 'react';
import { verbsAPI } from '../services/api';
import { Group } from '../types/api.types';
import SunburstChart from './SunburstChart';

const VerbHierarchy: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setDebugInfo('Iniciando petición de grupos...');
        const response = await verbsAPI.getGroups();
        setDebugInfo(prev => prev + '\nRespuesta recibida: ' + JSON.stringify(response, null, 2));
        setGroups(response.groups);
        setDebugInfo(prev => prev + '\nGrupos establecidos: ' + response.groups.length);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setDebugInfo(prev => prev + '\nError: ' + errorMessage);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="verb-hierarchy">
      <h1>Jerarquía de Verbos</h1>
      
      {/* Panel de depuración */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        margin: '10px 0', 
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}>
        <h3>Estado del componente:</h3>
        <p>Loading: {loading ? '✅' : '❌'}</p>
        <p>Error: {error ? '✅' : '❌'}</p>
        <p>Número de grupos: {groups.length}</p>
        <p>Datos de grupos: {JSON.stringify(groups, null, 2)}</p>
        <h3>Log de eventos:</h3>
        <p>{debugInfo}</p>
      </div>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          background: '#e3f2fd',
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          Cargando datos...
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          background: '#ffebee',
          borderRadius: '4px',
          margin: '10px 0',
          color: '#c62828'
        }}>
          Error: {error}
        </div>
      )}

      <div className="chart-container">
        <div style={{textAlign: 'center', color: 'red', fontWeight: 'bold', marginBottom: '10px'}}>
          Test SunburstChart
        </div>
        {groups.length > 0 ? (
          <SunburstChart data={groups} />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            background: '#fff3e0',
            borderRadius: '4px'
          }}>
            No hay datos para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default VerbHierarchy; 