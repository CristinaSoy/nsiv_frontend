import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Auth from './components/Auth';
import VerbHierarchy from './components/VerbHierarchy';
import UsersList from './components/UsersList';
import UserProfile from './components/UserProfile';
import ApiTest from './components/ApiTest';
import './App.css';

type ActiveTab = 'verbs' | 'users' | 'profile' | 'test';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('verbs');
  const [showApiTest, setShowApiTest] = useState(false); // Para desarrollo/debug
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
    setActiveTab('verbs'); // Resetear a la pestaña principal al hacer login
  };
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setActiveTab('verbs'); // Resetear navegación al cerrar sesión
    }
  };

  const renderContent = () => {
    if (showApiTest) return <ApiTest />;
    
    switch (activeTab) {
      case 'verbs':
        return <VerbHierarchy />;
      case 'users':
        return <UsersList />;
      case 'profile':
        return <UserProfile />;
      default:
        return <VerbHierarchy />;
    }
  };
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>🔄 Cargando...</div>;
  }  return (
    <div className="app">
      <header className="app-header">
        <h1>Visualizador de Verbos</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Navegación principal - solo visible si está autenticado */}
          {isAuthenticated && !showApiTest && (
            <nav style={{ display: 'flex', gap: '8px', marginRight: '20px' }}>
              <button 
                onClick={() => setActiveTab('verbs')}
                style={{ 
                  background: activeTab === 'verbs' ? '#4ecdc4' : '#e0e0e0', 
                  color: activeTab === 'verbs' ? 'white' : '#333',
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🌳 Verbos
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                style={{ 
                  background: activeTab === 'users' ? '#4ecdc4' : '#e0e0e0', 
                  color: activeTab === 'users' ? 'white' : '#333',
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                👥 Usuarios
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                style={{ 
                  background: activeTab === 'profile' ? '#4ecdc4' : '#e0e0e0', 
                  color: activeTab === 'profile' ? 'white' : '#333',
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                👤 Mi Perfil
              </button>
            </nav>
          )}
          
          {/* Botón de test para desarrollo */}
          <button 
            onClick={() => setShowApiTest(!showApiTest)}
            style={{ 
              background: showApiTest ? '#ff6b6b' : '#4ecdc4', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showApiTest ? '❌ Cerrar Test' : '🧪 Test APIs'}
          </button>
          
          {/* Botón de logout */}
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {isAuthenticated ? (
          renderContent()
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
};

export default App; 