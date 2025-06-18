import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import {
  AuthResponse,
  AuthUser,
  GroupsResponse,
  GroupShowResponse,
  FamiliesResponse,
  FamilyShowResponse,
  SubfamiliesResponse,
  SubfamilyShowResponse,
  VerbsResponse,
  VerbShowResponse
} from '../types/api.types';

// Crear instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(API_CONFIG.auth.tokenKey);
    if (token) {
      config.headers.Authorization = `${API_CONFIG.auth.tokenType} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.auth.tokenKey);
      // Aquí podríamos redirigir al login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {
  register: async (userData: Partial<AuthUser>): Promise<AuthResponse> => {
    const response = await api.post(API_CONFIG.endpoints.auth.register, userData);
    // Guardar el token después del registro
    if (response.data.access_token) {
      localStorage.setItem(API_CONFIG.auth.tokenKey, response.data.access_token);
    }
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post(API_CONFIG.endpoints.auth.login, credentials);
    // Guardar el token después del login
    if (response.data.access_token) {
      localStorage.setItem(API_CONFIG.auth.tokenKey, response.data.access_token);
    }
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post(API_CONFIG.endpoints.auth.logout);
    // Eliminar el token al hacer logout
    localStorage.removeItem(API_CONFIG.auth.tokenKey);
  },
  
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get(API_CONFIG.endpoints.auth.me);
    return response.data;
  }
};

// Funciones para obtener datos de verbos
export const verbsAPI = {
  getGroups: async (): Promise<GroupsResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.groups.list);
    return response.data;
  },
  
  getGroupDetail: async (id: number): Promise<GroupShowResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.groups.detail(id));
    return response.data;
  },
  
  getFamilies: async (): Promise<FamiliesResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.families.list);
    return response.data;
  },
  
  getFamilyDetail: async (id: number): Promise<FamilyShowResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.families.detail(id));
    return response.data;
  },
  
  getSubfamilies: async (): Promise<SubfamiliesResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.subfamilies.list);
    return response.data;
  },
  
  getSubfamilyDetail: async (id: number): Promise<SubfamilyShowResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.subfamilies.detail(id));
    return response.data;
  },
  
  getVerbs: async (): Promise<VerbsResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.verbs.list);
    return response.data;
  },
  
  getVerbDetail: async (id: number): Promise<VerbShowResponse> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.verbs.detail(id));
    return response.data;
  }
};

export default api; 