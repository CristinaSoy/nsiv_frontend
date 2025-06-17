import axios from 'axios';
import { API_CONFIG, AuthResponse, User, Group, Family, Subfamily, Verb } from '../types/api.types';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers
});

// Interceptor para añadir el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de autenticación
export const authAPI = {
  register: async (userData: Partial<User>): Promise<AuthResponse> => {
    const response = await api.post(API_CONFIG.endpoints.auth.register, userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post(API_CONFIG.endpoints.auth.login, credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post(API_CONFIG.endpoints.auth.logout);
    localStorage.removeItem('access_token');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get(API_CONFIG.endpoints.auth.me);
    return response.data;
  }
};

// Funciones para obtener datos de verbos
export const verbsAPI = {
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.groups.list);
    return response.data;
  },
  
  getGroupDetail: async (id: number): Promise<Group> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.groups.detail(id));
    return response.data;
  },
  
  getFamilies: async (): Promise<Family[]> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.families.list);
    return response.data;
  },
  
  getFamilyDetail: async (id: number): Promise<Family> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.families.detail(id));
    return response.data;
  },
  
  getSubfamilies: async (): Promise<Subfamily[]> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.subfamilies.list);
    return response.data;
  },
  
  getSubfamilyDetail: async (id: number): Promise<Subfamily> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.subfamilies.detail(id));
    return response.data;
  },
  
  getVerbs: async (): Promise<Verb[]> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.verbs.list);
    return response.data;
  },
  
  getVerbDetail: async (id: number): Promise<Verb> => {
    const response = await api.get(API_CONFIG.endpoints.verbs.verbs.detail(id));
    return response.data;
  }
}; 