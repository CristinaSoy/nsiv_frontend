// Tipos de autenticación
export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  token_type: string;
  message: string;
}

export interface AuthUser {
  id: number;
  name: string;
  level: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Base color interface
export interface ColorInfo {
  border: string;
  bg: string;
  shadow: string;
}

// Tipos para la estructura jerárquica
export interface VerbListItem {
  group: string;
  family: string;
  subfamily: string;
  details: string;
  all_forms: string;
  spanish: string;
}

export interface VerbDetail {
  all_forms: string;
  base: string;
  present: string;
  past: string;
  participle: string;
  fonetics_present: string;
  fonetics_past: string;
  fonetics_participle: string;
  details: string;
  level: number;
  spanish: string;
}

export interface Subfamily {
  id: number;
  name: string;
  description: string;
  sample: string;
  comments: string;
  colors: ColorInfo;
  total: number;
}

export interface Family {
  id: number;
  name: string;
  description: string;
  sample: string;
  comments: string;
  colors: ColorInfo;
  total: number;
}

export interface Group {
  id: number;
  name: string;
  sample: string;
  description: string;
  total: number;
  comments: string;
  taxonomy: string;
  colors: ColorInfo;
}

// Interfaces de respuesta
export interface GroupsResponse {
  groups: Group[];
  userLevel: number;
}

export interface GroupShowResponse {
  group: Group;
  families: Family[];
}

export interface FamiliesResponse {
  families: Family[];
}

export interface FamilyShowResponse {
  family: Family;
  subfamilies: Subfamily[];
}

export interface SubfamiliesResponse {
  subfamilies: Subfamily[];
}

export interface SubfamilyShowResponse {
  subfamily: Subfamily;
  verbs: Pick<VerbDetail, 'all_forms' | 'spanish'>[];
}

export interface VerbsResponse {
  verbs: VerbListItem[];
}

export interface VerbShowResponse {
  group: string;
  family: string;
  subfamily: string;
  verb: VerbDetail;
}

// Error interface
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
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