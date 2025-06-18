import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Auth from './components/Auth';
import VerbHierarchy from './components/VerbHierarchy';
import ApiTest from './components/ApiTest';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showApiTest, setShowApiTest] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          await authAPI.getCurrentUser();
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="app">      <header className="app-header">
        <h1>Visualizador de Verbos</h1>
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
      </header>      <main className="app-main">
        {showApiTest ? (
          <ApiTest />
        ) : isAuthenticated ? (
          <VerbHierarchy />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
};

export default App; 