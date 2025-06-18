import React, { useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';
import { AuthUser } from '../types/api.types';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    level: ''
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const data = await authAPI.getCurrentUser();
        setUser(data);
        setEditForm({
          name: data.name,
          email: data.email,
          level: data.level
        });
        setError(null);
      } catch (err: any) {
        setError(`Error al cargar perfil: ${err.message}`);
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser = await usersAPI.updateUser(user.id, editForm);
      setUser(updatedUser);
      setEditing(false);
      setError(null);
    } catch (err: any) {
      setError(`Error al actualizar perfil: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        level: user.level
      });
    }
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div>🔄 Cargando perfil...</div>
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

  if (!user) {
    return (
      <div className="loading-state">
        <div>❌ No se pudo cargar el perfil del usuario</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2>👤 Mi Perfil</h2>
      </div>
      
      {!editing ? (
        // Vista de solo lectura
        <div className="profile-form">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px',
                color: '#333'
              }}>
                👤 Nombre:
              </label>
              <div style={{ 
                padding: '8px 0', 
                fontSize: '16px',
                color: '#666'
              }}>
                {user.name}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px',
                color: '#333'
              }}>
                📧 Email:
              </label>
              <div style={{ 
                padding: '8px 0', 
                fontSize: '16px',
                color: '#666'
              }}>
                {user.email}
                {user.email_verified_at && (
                  <span style={{ 
                    marginLeft: '8px', 
                    color: '#4CAF50', 
                    fontSize: '12px' 
                  }}>
                    ✅ Verificado
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px',
                color: '#333'
              }}>
                📊 Nivel:
              </label>
              <div style={{ 
                padding: '8px 0', 
                fontSize: '16px',
                color: '#666'
              }}>
                {user.level} - {
                  user.level === '1' ? 'Principiante' :
                  user.level === '2' ? 'Básico' :
                  user.level === '3' ? 'Intermedio' :
                  user.level === '4' ? 'Avanzado' : 'Desconocido'
                }
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px',
                color: '#333'
              }}>
                📅 Registrado:
              </label>
              <div style={{ 
                padding: '8px 0', 
                fontSize: '14px',
                color: '#666'
              }}>
                {new Date(user.created_at).toLocaleDateString()} a las {new Date(user.created_at).toLocaleTimeString()}
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✏️ Editar Perfil
            </button>
          </div>
        ) : (
          // Vista de edición
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px'
              }}>
                👤 Nombre:
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px'
              }}>
                📧 Email:
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 'bold', 
                marginBottom: '4px'
              }}>
                📊 Nivel:
              </label>
              <select
                value={editForm.level}
                onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                <option value="1">1 - Principiante</option>
                <option value="2">2 - Básico</option>
                <option value="3">3 - Intermedio</option>
                <option value="4">4 - Avanzado</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '⏳ Guardando...' : '💾 Guardar'}
              </button>
              
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  opacity: loading ? 0.6 : 1
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default UserProfile;
