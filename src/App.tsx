import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Auth from './components/Auth';
import VerbHierarchy from './components/VerbHierarchy';
import ApiTest from './components/ApiTest';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showApiTest, setShowApiTest] = useState(true); // Mostrar test por defecto
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      console.log('Token encontrado:', token); // Debug
      if (token) {
        try {
          await authAPI.getCurrentUser();
          setIsAuthenticated(true);
          console.log('Usuario autenticado'); // Debug
        } catch (error) {
          console.log('Error de autenticación:', error); // Debug
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      } else {
        console.log('No hay token, usuario no autenticado'); // Debug
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
    }
  };
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>🔄 Cargando...</div>;
  }
  return (
    <div className="app">
      <header className="app-header">
        <h1>🧪 Modo de Prueba - Configuración de APIs</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowApiTest(!showApiTest)}
            style={{ 
              background: showApiTest ? '#ff6b6b' : '#4ecdc4', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showApiTest ? '❌ Cerrar Test' : '🧪 Test APIs'}
          </button>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* FORZAR MOSTRAR SOLO APITEST PARA DEPURACIÓN */}
        <ApiTest />
      </main>

      {/* Debug info */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        border: '1px solid #ccc'
      }}>
        <div>🔐 Autenticado: {isAuthenticated ? 'Sí' : 'No'}</div>
        <div>🧪 Mostrando Test: {showApiTest ? 'Sí' : 'No'}</div>
        <div>📱 Componente: APITEST (FORZADO)</div>
      </div>
    </div>
  );
};

export default App; 