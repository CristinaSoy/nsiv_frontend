import React, { useState } from 'react';
import { authAPI, usersAPI, verbsAPI } from '../services/api';

const ApiTest: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async (name: string, apiCall: () => Promise<any>) => {
    setLoading(name);
    setError(null);
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: result }));
    } catch (err: any) {
      setError(`Error en ${name}: ${err.message}`);
      console.error(`Error testing ${name}:`, err);
    } finally {
      setLoading(null);
    }
  };

  const testLogin = () => {
    testEndpoint('login', () =>
      authAPI.login({
        email: 'test@example.com',
        password: 'password123'
      })
    );
  };

  const testGroups = () => {
    testEndpoint('groups', () => verbsAPI.getGroups());
  };

  const testFamilies = () => {
    testEndpoint('families', () => verbsAPI.getFamilies());
  };

  const testVerbs = () => {
    testEndpoint('verbs', () => verbsAPI.getVerbs());
  };

  const testCurrentUser = () => {
    testEndpoint('currentUser', () => authAPI.getCurrentUser());
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 API Test Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Endpoints de Prueba:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={testLogin} disabled={loading === 'login'}>
            {loading === 'login' ? 'Probando...' : 'Test Login'}
          </button>
          <button onClick={testGroups} disabled={loading === 'groups'}>
            {loading === 'groups' ? 'Probando...' : 'Test Groups'}
          </button>
          <button onClick={testFamilies} disabled={loading === 'families'}>
            {loading === 'families' ? 'Probando...' : 'Test Families'}
          </button>
          <button onClick={testVerbs} disabled={loading === 'verbs'}>
            {loading === 'verbs' ? 'Probando...' : 'Test Verbs'}
          </button>
          <button onClick={testCurrentUser} disabled={loading === 'currentUser'}>
            {loading === 'currentUser' ? 'Probando...' : 'Test Current User'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {loading && (
        <div style={{ 
          color: 'blue', 
          background: '#e6f3ff', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ⏳ Probando: {loading}...
        </div>
      )}

      <div>
        <h3>Resultados:</h3>
        {Object.keys(results).length === 0 ? (
          <p>No hay resultados aún. Haz clic en los botones para probar.</p>
        ) : (
          Object.entries(results).map(([key, value]) => (
            <div key={key} style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              background: '#f5f5f5', 
              borderRadius: '5px'
            }}>
              <h4>✅ {key}:</h4>
              <pre style={{ 
                background: 'white', 
                padding: '10px', 
                borderRadius: '3px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApiTest;
