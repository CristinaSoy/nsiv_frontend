import React, { useState } from 'react';
import Button from '../components/Button';
import SunburstChart from '../components/SunburstChart';

const Home = () => {
  const [showChart, setShowChart] = useState(false);
  
  // Datos de ejemplo para el gráfico
  const sampleData = {
    name: "root",
    children: [
      {
        name: "Categoría 1",
        value: 30,
        color: "#ff0000",
        children: [
          { name: "Subcategoría 1.1", value: 15, color: "#ff3333" },
          { name: "Subcategoría 1.2", value: 15, color: "#ff6666" }
        ]
      },
      {
        name: "Categoría 2",
        value: 20,
        color: "#00ff00",
        children: [
          { name: "Subcategoría 2.1", value: 10, color: "#33ff33" },
          { name: "Subcategoría 2.2", value: 10, color: "#66ff66" }
        ]
      }
    ]
  };

  const handleLoadData = () => {
    console.log('Cargando datos...');
    // Aquí irá la lógica para cargar datos de la API
  };

  const handleShowChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div className="home-container">
      <h1>Mi Aplicación de Visualización</h1>
      <div className="button-container">
        <Button 
          text="Cargar Datos" 
          onClick={handleLoadData}
          type="primary"
        />
        <Button 
          text={showChart ? "Ocultar Gráfico" : "Ver Gráfico"} 
          onClick={handleShowChart}
          type="secondary"
        />
      </div>
      {showChart && (
        <div className="chart-container">
          <SunburstChart data={sampleData} />
        </div>
      )}
    </div>
  );
};

export default Home; 