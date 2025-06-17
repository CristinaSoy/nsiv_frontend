// Tipos de autenticación
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  level: number;
}

// Tipos para la estructura jerárquica
export interface Verb {
  id: number;
  name: string;
  level: number;
  description: string;
  subfamily_id: number;
}

export interface Subfamily {
  id: number;
  name: string;
  color: string;
  description: string;
  family_id: number;
  verbs?: Verb[];
}

export interface Family {
  id: number;
  name: string;
  color: string;
  description: string;
  group_id: number;
  subfamilies?: Subfamily[];
}

export interface Group {
  id: number;
  name: string;
  color: string;
  description: string;
  families?: Family[];
}

// Configuración de la API
export const API_CONFIG = {
  baseURL: 'http://localhost:8000/api',
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
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}; 