import React, { useEffect, useState } from 'react';
import { verbsAPI } from '../services/api';
import { Group } from '../types/api.types';
import SunburstChart from './SunburstChart';

const VerbHierarchy: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await verbsAPI.getGroups();
        setGroups(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="verb-hierarchy">
      <h1>Jerarquía de Verbos</h1>
      <div className="chart-container">
        <SunburstChart data={groups} />
      </div>
    </div>
  );
};

export default VerbHierarchy; 