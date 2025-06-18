import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { AuthUser } from '../types/api.types';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersAPI.getUsers();
        setUsers(data);
        setError(null);
      } catch (err: any) {
        setError(`Error al cargar usuarios: ${err.message}`);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (loading) {
    return (
      <div className="loading-state">
        <div>🔄 Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>❌ Error</h3>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="users-container">
      <h2>👥 Lista de Usuarios</h2>
      
      {users.length === 0 ? (
        <div className="loading-state">
          <p>No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">📧 {user.email}</div>
                <div className="user-level">Nivel {user.level}</div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px'
              }}>
                <div style={{
                  background: user.email_verified_at ? '#4CAF50' : '#FF9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {user.email_verified_at ? '✅ Verificado' : '⏳ Pendiente'}
                </div>
              </div>
              
              <div className="user-dates">
                📅 Registrado: {new Date(user.created_at).toLocaleDateString()}
                {user.updated_at && user.updated_at !== user.created_at && (
                  <div>🔄 Actualizado: {new Date(user.updated_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="success-message" style={{ marginTop: '20px' }}>
        <strong>💡 Información:</strong> Mostrando {users.length} usuario(s) total(es)
      </div>
    </div>
  );
};

export default UsersList;
