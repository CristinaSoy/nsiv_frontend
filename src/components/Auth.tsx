import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types/api.types';

interface AuthProps {
  onAuthSuccess: (token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    level: 1
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        onAuthSuccess(response.access_token);
      } else {
        const response = await authAPI.register(formData as Partial<User>);
        onAuthSuccess(response.access_token);
      }
    } catch (err) {
      setError('Error en la autenticación');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="level">Nivel:</label>
              <input
                type="number"
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                min="1"
                max="5"
                required
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmar Contraseña:</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        
        <button type="submit">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>
      
      <button
        type="button"
        className="toggle-auth"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
};

export default Auth; 