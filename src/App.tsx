import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Auth from './components/Auth';
import VerbHierarchy from './components/VerbHierarchy';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <div className="app">
      <header className="app-header">
        <h1>Visualizador de Verbos</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        )}
      </header>

      <main className="app-main">
        {isAuthenticated ? (
          <VerbHierarchy />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
};

export default App; 