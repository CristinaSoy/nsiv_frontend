export const API_CONFIG = {
  // URL base de la API
  baseURL: 'http://localhost/itacademy/Sprint5/nsiv_API/public/api',
  
  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Configuración de timeout (30 segundos)
  timeout: 30000,

  // Configuración de rate limiting (60 peticiones por minuto)
  rateLimit: {
    maxRequests: 60,
    perMilliseconds: 60000
  },

  // Endpoints de autenticación
  endpoints: {
    auth: {
      register: '/register',
      login: '/login',
      logout: '/logout',
      me: '/me'
    },
    users: {
      list: '/users',
      detail: (id: number) => `/users/${id}`,
      update: (id: number) => `/users/${id}`,
      delete: (id: number) => `/users/${id}`
    },
    verbs: {
      groups: {
        list: '/groups',
        detail: (id: number) => `/groups/${id}`
      },
      families: {
        list: '/families',
        detail: (id: number) => `/families/${id}`
      },
      subfamilies: {
        list: '/subfamilies',
        detail: (id: number) => `/subfamilies/${id}`
      },
      verbs: {
        list: '/verbs',
        detail: (id: number) => `/verbs/${id}`
      }
    }
  },

  // Configuración de autenticación
  auth: {
    tokenKey: 'access_token',
    tokenType: 'Bearer'
  }
};
