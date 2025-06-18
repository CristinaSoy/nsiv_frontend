/**
 * Script para probar las APIs desde la consola del navegador
 * 
 * Instrucciones:
 * 1. Abre las herramientas de desarrollador (F12)
 * 2. Ve a la pestaña Console
 * 3. Copia y pega estas funciones
 * 4. Ejecuta las pruebas que necesites
 */

// Importar las APIs (esto ya debería estar disponible en el contexto de la app)
// import { authAPI, usersAPI, verbsAPI } from './src/services/api';

// Función auxiliar para mostrar resultados
const logResult = (name, result) => {
  console.group(`✅ ${name} - SUCCESS`);
  console.log('Result:', result);
  console.groupEnd();
};

const logError = (name, error) => {
  console.group(`❌ ${name} - ERROR`);
  console.error('Error:', error);
  console.groupEnd();
};

// Pruebas de autenticación
window.testLogin = async (email = 'test@example.com', password = 'password123') => {
  try {
    const result = await authAPI.login({ email, password });
    logResult('LOGIN', result);
    return result;
  } catch (error) {
    logError('LOGIN', error);
    throw error;
  }
};

window.testRegister = async (userData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  level: 'beginner'
}) => {
  try {
    const result = await authAPI.register(userData);
    logResult('REGISTER', result);
    return result;
  } catch (error) {
    logError('REGISTER', error);
    throw error;
  }
};

window.testCurrentUser = async () => {
  try {
    const result = await authAPI.getCurrentUser();
    logResult('CURRENT USER', result);
    return result;
  } catch (error) {
    logError('CURRENT USER', error);
    throw error;
  }
};

// Pruebas de verbos
window.testGroups = async () => {
  try {
    const result = await verbsAPI.getGroups();
    logResult('GROUPS', result);
    return result;
  } catch (error) {
    logError('GROUPS', error);
    throw error;
  }
};

window.testFamilies = async () => {
  try {
    const result = await verbsAPI.getFamilies();
    logResult('FAMILIES', result);
    return result;
  } catch (error) {
    logError('FAMILIES', error);
    throw error;
  }
};

window.testVerbs = async () => {
  try {
    const result = await verbsAPI.getVerbs();
    logResult('VERBS', result);
    return result;
  } catch (error) {
    logError('VERBS', error);
    throw error;
  }
};

// Prueba completa
window.testAllEndpoints = async () => {
  console.log('🚀 Iniciando pruebas de todos los endpoints...');
  
  const tests = [
    { name: 'Groups', fn: () => verbsAPI.getGroups() },
    { name: 'Families', fn: () => verbsAPI.getFamilies() },
    { name: 'Verbs', fn: () => verbsAPI.getVerbs() },
  ];

  for (const test of tests) {
    try {
      const result = await test.fn();
      logResult(test.name, result);
    } catch (error) {
      logError(test.name, error);
    }
  }
  
  console.log('✨ Pruebas completadas');
};

// Función para verificar la conectividad con el backend
window.testBackendConnection = async () => {
  console.log('🔍 Verificando conexión con el backend...');
  
  try {
    // Intentar hacer una petición simple
    const response = await fetch('http://localhost:8000/api/groups');
    
    if (response.ok) {
      console.log('✅ Backend conectado correctamente');
      console.log('Status:', response.status);
      console.log('Headers:', [...response.headers.entries()]);
    } else {
      console.log('⚠️ Backend responde pero con error');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
    }
  } catch (error) {
    console.log('❌ No se puede conectar al backend');
    console.error('Error:', error.message);
    console.log('💡 Asegúrate de que el backend esté ejecutándose en http://localhost:8000');
  }
};

console.log(`
🧪 FUNCIONES DE PRUEBA DISPONIBLES:

Conexión:
• testBackendConnection() - Verifica si el backend está corriendo

Autenticación:
• testLogin(email, password) - Prueba login
• testRegister(userData) - Prueba registro
• testCurrentUser() - Obtiene usuario actual

Verbos:
• testGroups() - Obtiene grupos
• testFamilies() - Obtiene familias  
• testVerbs() - Obtiene verbos

Prueba completa:
• testAllEndpoints() - Prueba todos los endpoints

Ejemplo de uso:
testBackendConnection()
testGroups()
testLogin('tu@email.com', 'tupassword')
`);
