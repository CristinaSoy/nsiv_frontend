import React, { useState } from 'react';
import { authAPI, usersAPI, verbsAPI } from '../services/api';

const ApiTest: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customURL, setCustomURL] = useState('http://localhost/itacademy/Sprint5/nsiv_API/public/api');  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: '1234'
  });  const [registerData, setRegisterData] = useState({
    name: 'Test User',
    email: 'newuser@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    level: '1'
  });
  const [validationErrors, setValidationErrors] = useState<any>({});
  const testEndpoint = async (name: string, apiCall: () => Promise<any>) => {
    setLoading(name);
    setError(null);
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [name]: result }));
      
      // Si es un login exitoso, guardar el token
      if (name === 'login' && result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        console.log('🔐 Token guardado:', result.access_token);
        setError(null);
        // Mostrar mensaje de éxito
        setResults(prev => ({ 
          ...prev, 
          [name]: { 
            ...result, 
            _success_message: '✅ Login exitoso! Token guardado. Ahora puedes probar otros endpoints.' 
          } 
        }));
      }
    } catch (err: any) {
      setError(`Error en ${name}: ${err.message}`);
      console.error(`Error testing ${name}:`, err);
      
      // Si es error de login, limpiar token
      if (name === 'login') {
        localStorage.removeItem('access_token');
      }
    } finally {
      setLoading(null);
    }
  };
  const testCustomURL = async () => {
    setLoading('customURL');
    setError(null);
    try {
      console.log(`🔍 Probando conexión a: ${customURL}/groups`);
      
      const response = await fetch(`${customURL}/groups`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`📊 Respuesta recibida:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(prev => ({ ...prev, customURL: data }));
        setError(null);
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Respuesta: ${errorText}`);
      }
    } catch (err: any) {
      console.error('❌ Error completo:', err);
      setError(`Error probando URL personalizada: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  // Función para probar diferentes rutas comunes
  const testCommonRoutes = async () => {
    setLoading('commonRoutes');
    setError(null);
    
    const routesToTest = [
      `${customURL}/groups`,
      `${customURL}/families`,
      `${customURL}/verbs`,
      `${customURL.replace('/api', '')}/api/groups`, // Sin /api duplicado
      `${customURL.replace('/public/api', '/api')}`, // Laravel serve
    ];

    const results = {};
    
    for (const route of routesToTest) {
      try {
        console.log(`🔍 Probando: ${route}`);
        const response = await fetch(route, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        results[route] = {
          status: response.status,
          statusText: response.statusText,
          success: response.ok
        };
        
        if (response.ok) {
          const data = await response.json();
          results[route].data = data;
        }
      } catch (error) {
        results[route] = {
          error: error.message,
          success: false
        };
      }
    }
    
    setResults(prev => ({ ...prev, commonRoutes: results }));
    setLoading(null);
  };
  // Función para probar endpoints públicos (que no requieren autenticación)
  const testPublicEndpoints = async () => {
    setLoading('publicEndpoints');
    setError(null);
    
    const publicRoutes = [
      { name: 'Login', url: `${customURL}/login`, method: 'POST' },
      { name: 'Register', url: `${customURL}/register`, method: 'POST' },
      // Algunos endpoints pueden ser públicos
      { name: 'Groups (sin auth)', url: `${customURL}/groups`, method: 'GET' },
    ];

    const results = {};
    
    for (const route of publicRoutes) {
      try {
        console.log(`🔍 Probando ${route.name}: ${route.url}`);
          let options: any = {
          method: route.method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        };

        // Para POST, agregar datos de prueba
        if (route.method === 'POST' && route.name === 'Login') {
          options.body = JSON.stringify({
            email: 'test@test.com',
            password: 'password'
          });
        }
        
        const response = await fetch(route.url, options);
        
        results[route.name] = {
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          url: route.url
        };
        
        if (response.ok) {
          const data = await response.json();
          results[route.name].data = data;
        } else {
          const errorText = await response.text();
          results[route.name].error = errorText;
        }
      } catch (error) {
        results[route.name] = {
          error: error.message,
          success: false,
          url: route.url
        };
      }
    }
    
    setResults(prev => ({ ...prev, publicEndpoints: results }));
    setLoading(null);
  };
  const testLogin = () => {
    setLoading('login');
    setError(null);
    
    console.log('🔐 Intentando login con:', loginData);
    
    // Probar directamente con fetch para ver la respuesta completa
    fetch(`${customURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then(async response => {
      console.log('📊 Respuesta del login:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const responseText = await response.text();
      console.log('📄 Respuesta completa:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw_response: responseText };
      }
      
      if (response.ok) {
        setResults(prev => ({ 
          ...prev, 
          login: { 
            ...responseData, 
            _success_message: '✅ Login exitoso!' 
          } 
        }));
        
        if (responseData.access_token) {
          localStorage.setItem('access_token', responseData.access_token);
        }
      } else {
        setResults(prev => ({ 
          ...prev, 
          login_error: {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            sent_data: loginData
          }
        }));
        setError(`Error ${response.status}: ${JSON.stringify(responseData, null, 2)}`);
      }
    })
    .catch(error => {
      console.error('❌ Error de red:', error);
      setError(`Error de red: ${error.message}`);
    })
    .finally(() => {
      setLoading(null);
    });
  };
  const testRegister = () => {
    // Validar formulario antes de enviar
    if (!validateRegisterForm()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading('register');
    setError(null);
    
    console.log('📝 Intentando registro con:', registerData);
    
    // Probar directamente con fetch para ver la respuesta completa
    fetch(`${customURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(registerData)
    })
    .then(async response => {
      console.log('📊 Respuesta del registro:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const responseText = await response.text();
      console.log('📄 Respuesta completa del registro:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw_response: responseText };
      }
      
      if (response.ok) {
        setResults(prev => ({ 
          ...prev, 
          register: { 
            ...responseData, 
            _success_message: '✅ Registro exitoso! Ahora puedes hacer login.' 
          } 
        }));
        
        // Si el registro incluye token, guardarlo
        if (responseData.access_token) {
          localStorage.setItem('access_token', responseData.access_token);
        }

        // Limpiar errores de validación
        setValidationErrors({});
        
        // Autocompletar datos de login con el usuario recién creado
        setLoginData({
          email: registerData.email,
          password: registerData.password
        });
      } else {
        setResults(prev => ({ 
          ...prev, 
          register_error: {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            sent_data: registerData
          }
        }));
        setError(`Error ${response.status}: ${JSON.stringify(responseData, null, 2)}`);
      }
    })
    .catch(error => {
      console.error('❌ Error de red en registro:', error);
      setError(`Error de red: ${error.message}`);
    })
    .finally(() => {
      setLoading(null);
    });
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

  // Función para probar envío de token
  const testTokenSending = async () => {
    setLoading('tokenTest');
    setError(null);
    
    const token = localStorage.getItem('access_token');
    console.log('🔑 Token actual en localStorage:', token);
    
    if (!token) {
      setError('No hay token disponible. Haz login primero.');
      setLoading(null);
      return;
    }

    // Probar con fetch directo para ver exactamente qué se envía
    try {
      const response = await fetch(`${customURL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 Respuesta /me:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      console.log('📄 Respuesta /me completa:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw_response: responseText };
      }

      setResults(prev => ({ 
        ...prev, 
        tokenTest: {
          status: response.status,
          success: response.ok,
          data: responseData,
          token_sent: `Bearer ${token}`,
          url_tested: `${customURL}/me`
        }
      }));

    } catch (error) {
      console.error('❌ Error al probar token:', error);
      setError(`Error probando token: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  // Función para probar con axios (para comparar)
  const testWithAxios = async () => {
    setLoading('axiosTest');
    setError(null);
    
    try {
      console.log('🧪 Probando con axios configurado...');
      const result = await authAPI.getCurrentUser();
      setResults(prev => ({ 
        ...prev, 
        axiosTest: {
          success: true,
          data: result,
          message: '✅ Axios funcionando correctamente'
        }
      }));
    } catch (err: any) {
      console.error('❌ Error con axios:', err);
      setResults(prev => ({ 
        ...prev, 
        axiosTest: {
          success: false,
          error: err.message,
          details: err.response?.data || 'Sin detalles adicionales'
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  // Funciones de validación
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateLevel = (level: string): boolean => {
    return ['1', '2', '3', '4'].includes(level);
  };

  const validateRegisterForm = (): boolean => {
    const errors: any = {};

    // Validar nombre
    if (!registerData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }

    // Validar email
    if (!registerData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!validateEmail(registerData.email)) {
      errors.email = 'Formato de email inválido';
    }

    // Validar password
    if (!registerData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (!validatePassword(registerData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de password
    if (!registerData.password_confirmation) {
      errors.password_confirmation = 'Confirma tu contraseña';
    } else if (registerData.password !== registerData.password_confirmation) {
      errors.password_confirmation = 'Las contraseñas no coinciden';
    }

    // Validar nivel
    if (!validateLevel(registerData.level)) {
      errors.level = 'El nivel debe ser un número del 1 al 4';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 API Test Component</h2>
      
      {/* Indicador de estado de autenticación */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: localStorage.getItem('access_token') ? '#e8f5e8' : '#ffe8e8'
      }}>
        <h4>🔐 Estado de Autenticación:</h4>
        {localStorage.getItem('access_token') ? (
          <div style={{ color: '#2e7d32' }}>
            ✅ Autenticado - Token disponible
            <button
              onClick={() => {
                localStorage.removeItem('access_token');
                setResults({});
                setError(null);
              }}
              style={{
                marginLeft: '10px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <div style={{ color: '#d32f2f' }}>
            ❌ No autenticado - Necesitas hacer login primero
          </div>
        )}
      </div>
      
      {/* Sección para probar URLs personalizadas */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>🔧 Configuración de URL</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            URL Base de tu API:
          </label>
          <input
            type="text"
            value={customURL}
            onChange={(e) => setCustomURL(e.target.value)}
            style={{
              width: '400px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="http://localhost:8080/carpeta/public/api"
          />          <button
            onClick={testCustomURL}
            disabled={loading === 'customURL'}
            style={{
              background: '#2196F3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading === 'customURL' ? 'Probando...' : '🔍 Probar URL'}
          </button>
          <button
            onClick={testCommonRoutes}
            disabled={loading === 'commonRoutes'}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '5px'
            }}
          >
            {loading === 'commonRoutes' ? 'Probando...' : '🔍 Probar Rutas Comunes'}
          </button>
          <button
            onClick={() => {
              // Actualizar la configuración de API dinámicamente
              import('../config/api.config').then(module => {
                (module.API_CONFIG as any).baseURL = customURL;
                console.log('URL actualizada a:', customURL);
              });
            }}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '5px'
            }}
          >
            ✅ Usar esta URL
          </button>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>URLs comunes:</strong><br/>
          • http://localhost:8000/api (Laravel Serve)<br/>
          • http://localhost/carpeta/public/api (XAMPP)<br/>
          • http://localhost:8080/proyecto/public/api (XAMPP puerto 8080)
        </div>      </div>

      {/* Sección para probar login */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}>
        <h3>🔐 Prueba de Autenticación</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="admin@example.com"
          />
        </div>        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="password"
          />
        </div>
        
        {/* Botones de credenciales rápidas */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', marginRight: '10px' }}>
            Credenciales rápidas:
          </span>
          <button
            onClick={() => setLoginData({ email: 'test@example.com', password: '1234' })}
            style={{ 
              background: '#e0e0e0', 
              border: '1px solid #ccc', 
              padding: '4px 8px', 
              borderRadius: '3px',
              marginRight: '5px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            test@example.com / 1234
          </button>
          <button
            onClick={() => setLoginData({ email: 'admin@admin.com', password: 'password' })}
            style={{ 
              background: '#e0e0e0', 
              border: '1px solid #ccc', 
              padding: '4px 8px', 
              borderRadius: '3px',
              marginRight: '5px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            admin@admin.com / password
          </button>
          <button
            onClick={() => setLoginData({ email: 'test@example.com', password: 'password' })}
            style={{ 
              background: '#e0e0e0', 
              border: '1px solid #ccc', 
              padding: '4px 8px', 
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            test@example.com / password
          </button>
        </div>
        <div>
          <button
            onClick={testLogin}
            disabled={loading === 'login'}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {loading === 'login' ? 'Probando...' : '🔐 Probar Login'}
          </button>
          <button
            onClick={testPublicEndpoints}
            disabled={loading === 'publicEndpoints'}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading === 'publicEndpoints' ? 'Probando...' : '🌐 Probar Endpoints Públicos'}
          </button>
        </div>        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          <strong>💡 Sistema con Spatie Roles & Permisos:</strong><br/>
          • Primero haz login para obtener un token<br/>
          • Solo puedes ver tus propios datos<br/>
          • Los endpoints requieren permisos específicos<br/>
          • Credenciales: test@example.com / 1234
        </div>
      </div>

      {/* Sección para registrar nuevo usuario */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f0fff0'
      }}>
        <h3>📝 Registro de Nuevo Usuario</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Nombre:
            </label>            <input
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: validationErrors.name ? '2px solid #f44336' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="Test User"
            />
            {validationErrors.name && (
              <div style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
                {validationErrors.name}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>            <input
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: validationErrors.email ? '2px solid #f44336' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="newuser@example.com"
            />
            <button
              type="button"
              onClick={() => setRegisterData(prev => ({ 
                ...prev, 
                email: `user${Date.now()}@example.com` 
              }))}
              style={{
                marginTop: '5px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              🎲 Email único
            </button>
            {validationErrors.email && (
              <div style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
                {validationErrors.email}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>            <input
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: validationErrors.password ? '2px solid #f44336' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="password123 (mín. 8 caracteres)"
            />
            {validationErrors.password && (
              <div style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
                {validationErrors.password}
              </div>
            )}
            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              {registerData.password.length}/8 caracteres mínimos
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Confirmar Password:
            </label>            <input
              type="password"
              value={registerData.password_confirmation}
              onChange={(e) => setRegisterData(prev => ({ ...prev, password_confirmation: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                border: validationErrors.password_confirmation ? '2px solid #f44336' : '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="password123"
            />
            {validationErrors.password_confirmation && (
              <div style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
                {validationErrors.password_confirmation}
              </div>
            )}
            <div style={{ fontSize: '11px', color: registerData.password === registerData.password_confirmation ? '#4caf50' : '#666', marginTop: '2px' }}>
              {registerData.password === registerData.password_confirmation ? '✅ Coinciden' : '❌ No coinciden'}
            </div>
          </div>
        </div>        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nivel (1-4):
          </label>
          <select
            value={registerData.level}
            onChange={(e) => setRegisterData(prev => ({ ...prev, level: e.target.value }))}
            style={{
              width: '200px',
              padding: '8px',
              border: validationErrors.level ? '2px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="1">1 - Principiante</option>
            <option value="2">2 - Básico</option>
            <option value="3">3 - Intermedio</option>
            <option value="4">4 - Avanzado</option>
          </select>
          {validationErrors.level && (
            <div style={{ color: '#f44336', fontSize: '12px', marginTop: '2px' }}>
              {validationErrors.level}
            </div>
          )}
        </div>
        <div>
          <button
            onClick={testRegister}
            disabled={loading === 'register'}
            style={{
              background: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading === 'register' ? 'Registrando...' : '📝 Crear Usuario'}
          </button>
        </div>        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          <strong>💡 Validaciones:</strong><br/>
          • Nombre: requerido<br/>
          • Email: formato válido requerido<br/>
          • Password: mínimo 8 caracteres<br/>
          • Nivel: número del 1 al 4 (1=Principiante, 4=Avanzado)
        </div>
      </div>

      {/* Sección para registro de usuario */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px',
        backgroundColor: '#f9f0ff'
      }}>
        <h3>📝 Registro de Usuario</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre:
          </label>
          <input
            type="text"
            value={registerData.name}
            onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="Tu nombre"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="tuemail@example.com"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="password"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Confirmar Password:
          </label>
          <input
            type="password"
            value={registerData.password_confirmation}
            onChange={(e) => setRegisterData(prev => ({ ...prev, password_confirmation: e.target.value }))}
            style={{
              width: '300px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginRight: '10px'
            }}
            placeholder="Repite tu password"
          />
        </div>
        
        <div>
          <button
            onClick={testRegister}
            disabled={loading === 'register'}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {loading === 'register' ? 'Registrando...' : '📝 Registrar Usuario'}
          </button>
        </div>        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          <strong>📋 Requisitos de Registro:</strong><br/>
          • Todos los campos son obligatorios<br/>
          • El email debe ser válido y único<br/>
          • La contraseña debe tener al menos 6 caracteres
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Endpoints de Prueba (requieren autenticación):</h3>        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={testTokenSending} disabled={loading === 'tokenTest'}>
            {loading === 'tokenTest' ? 'Probando...' : '🔑 Test Token Sending'}
          </button>
          <button onClick={testWithAxios} disabled={loading === 'axiosTest'}>
            {loading === 'axiosTest' ? 'Probando...' : '🧪 Test con Axios'}
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
          ))        )}
      </div>
    </div>
  );
};

export default ApiTest;
