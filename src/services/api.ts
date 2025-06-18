import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import type {
  AuthResponse,
  GroupsResponse,
  GroupShowResponse,
  FamiliesResponse,
  FamilyShowResponse,
  SubfamiliesResponse,
  SubfamilyShowResponse,
  VerbsResponse,
  VerbShowResponse,
  AuthUser,
  ApiError
} from '../types/api.types';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: API_CONFIG.headers,
  timeout: API_CONFIG.timeout
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.auth.tokenKey);
  if (token && config.headers) {
    config.headers.Authorization = `${API_CONFIG.auth.tokenType} ${token}`;
  }
  return config;
});

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(API_CONFIG.auth.tokenKey);
      // Redirigir a login si es necesario
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funciones de autenticación
export const authAPI = {  register: async (userData: {
    name: string;
    level: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> => {
    const response = await api.post(
      API_CONFIG.endpoints.auth.register,
      userData
    );
    return response.data as AuthResponse;
  },
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post(
      API_CONFIG.endpoints.auth.login,
      credentials
    );
    return response.data as AuthResponse;
  },
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post(
      API_CONFIG.endpoints.auth.logout
    );
    return response.data as { message: string };
  },
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get(
      API_CONFIG.endpoints.auth.me
    );
    return response.data as AuthUser;
  }
};

// Funciones para gestión de usuarios
export const usersAPI = {
  getUsers: async (): Promise<AuthUser[]> => {
    const response = await api.get(
      API_CONFIG.endpoints.users.list
    );
    return response.data as AuthUser[];
  },

  getUser: async (id: number): Promise<AuthUser> => {
    const response = await api.get(
      API_CONFIG.endpoints.users.detail(id)
    );
    return response.data as AuthUser;
  },

  updateUser: async (id: number, userData: Partial<AuthUser>): Promise<AuthUser> => {
    const response = await api.put(
      API_CONFIG.endpoints.users.update(id),
      userData
    );
    return response.data as AuthUser;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(
      API_CONFIG.endpoints.users.delete(id)
    );
    return response.data as { message: string };
  }
};

// Funciones para obtener datos de verbos
export const verbsAPI = {
  getGroups: async (): Promise<GroupsResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.groups.list
    );
    return response.data as GroupsResponse;
  },

  getGroupDetail: async (id: number): Promise<GroupShowResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.groups.detail(id)
    );
    return response.data as GroupShowResponse;
  },

  getFamilies: async (): Promise<FamiliesResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.families.list
    );
    return response.data as FamiliesResponse;
  },

  getFamilyDetail: async (id: number): Promise<FamilyShowResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.families.detail(id)
    );
    return response.data as FamilyShowResponse;
  },

  getSubfamilies: async (): Promise<SubfamiliesResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.subfamilies.list
    );
    return response.data as SubfamiliesResponse;
  },

  getSubfamilyDetail: async (id: number): Promise<SubfamilyShowResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.subfamilies.detail(id)
    );
    return response.data as SubfamilyShowResponse;
  },

  getVerbs: async (): Promise<VerbsResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.verbs.list
    );
    return response.data as VerbsResponse;
  },

  getVerbDetail: async (id: number): Promise<VerbShowResponse> => {
    const response = await api.get(
      API_CONFIG.endpoints.verbs.verbs.detail(id)
    );
    return response.data as VerbShowResponse;
  }
};

// Helper para manejo de errores
export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  return {
    message: error.message || 'Error desconocido',
    errors: {}
  };
};

// Helper para guardar token
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(API_CONFIG.auth.tokenKey, token);
};

// Helper para obtener token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(API_CONFIG.auth.tokenKey);
};

// Helper para remover token
export const removeAuthToken = (): void => {
  localStorage.removeItem(API_CONFIG.auth.tokenKey);
};

export default api;