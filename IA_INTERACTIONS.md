# Interacciones con la IA Cursor

# Sesión 1: Creación del proyecto. Instalación de React y D3.

## Registro de Interacciones Significativas

### 1. Configuración Inicial del Proyecto
- **Problema**: Errores de importación de React en múltiples archivos
- **Solución**: Configuración correcta de Vite y reinstalación de dependencias
- **Aprendizaje**: Importancia de la configuración correcta del entorno de desarrollo

### 2. Desarrollo de Componentes
- **Button Component**
  - Creación de un componente reutilizable
  - Implementación de estilos personalizados
  - Manejo de diferentes tipos de botones

- **SunburstChart Component**
  - Integración de D3.js para visualización de datos
  - Implementación de gráficos interactivos
  - Manejo de datos jerárquicos

### 3. Resolución de Problemas Técnicos
- **Problemas de Importación**
  ```
  Failed to resolve import "react" from "src/pages/Home.jsx"
  Failed to resolve import "react" from "src/components/Button.jsx"
  Failed to resolve import "react" from "src/components/SunburstChart.jsx"
  ```
- **Solución**: Reinstalación y optimización de dependencias
  ```
  ✨ new dependencies optimized: react, react-dom
  ```

## Análisis del Código Generado

### Características Principales
1. **Componentes React**
   - Uso de hooks (useState, useEffect, useRef)
   - Implementación de props para configuración
   - Estilos modulares y reutilizables

2. **Visualización de Datos**
   - Integración con D3.js
   - Gráficos interactivos y responsivos
   - Manejo eficiente de datos complejos

### Ajustes y Modificaciones
- Adaptación de componentes para mejor usabilidad
- Optimización de rendimiento en gráficos
- Mejora de la accesibilidad

## Proceso de Aprendizaje

### Aspectos Destacados
1. **Desarrollo Frontend**
   - Aprendizaje de React desde cero
   - Comprensión de la arquitectura de componentes
   - Manejo de estados y efectos

2. **Integración de Bibliotecas**
   - D3.js para visualización de datos
   - Configuración de Vite
   - Gestión de dependencias

3. **Mejores Prácticas**
   - Estructura de proyecto organizada
   - Código modular y reutilizable
   - Documentación clara y concisa

### Desafíos y Soluciones
1. **Configuración del Entorno**
   - Problemas iniciales con Vite
   - Resolución de dependencias
   - Optimización del entorno de desarrollo

2. **Desarrollo de Componentes**
   - Creación de componentes reutilizables
   - Implementación de estilos
   - Manejo de estados y props

3. **Visualización de Datos**
   - Integración de D3.js
   - Optimización de rendimiento
   - Mejora de la interactividad

## Interacción con la API

### Solicitud de Documentación de la API

# Sesión 2: Obtención de la información necesaria de la API 

## Prompt generado por la IA de Cursor para la IA del proyecto API:**

```
Necesito la documentación completa de mi API REST desarrollada en PHP 8.2 y Laravel 12 para poder desarrollar el frontend en React. Por favor, proporciona la siguiente información:

1. Información General de la API:
   - URL base de la API
   - Versión de la API
   - Entorno de desarrollo (URL de desarrollo, staging, producción)

2. Autenticación:
   - Método de autenticación utilizado (Bearer token, API key, etc.)
   - Endpoints de autenticación (/login, /register, etc.)
   - Estructura de las peticiones de autenticación
   - Estructura de las respuestas de autenticación
   - Tiempo de expiración de los tokens

3. Endpoints para Gráficos Sunburst:
   - Lista completa de endpoints que devuelven datos para los gráficos
   - Método HTTP de cada endpoint
   - Parámetros requeridos y opcionales
   - Ejemplo de petición para cada endpoint
   - Ejemplo de respuesta JSON para cada endpoint, incluyendo:
     * Estructura de datos jerárquicos
     * Información de colores
     * Cualquier metadato relevante

4. Estructura de Datos:
   - Descripción detallada de la estructura JSON pde todos los endopoints
   - Ejemplo de la jerarquía de datos
   - Formato de los colores en las respuestas
   - Campos obligatorios y opcionales
   - Tipos de datos de cada campo

5. Manejo de Errores:
   - Códigos de estado HTTP utilizados
   - Estructura de las respuestas de error
   - Ejemplos de mensajes de error comunes

6. Limitaciones y Consideraciones:
   - Límites de rate limiting
   - Tamaño máximo de las respuestas
   - Tiempos de timeout
   - Cualquier restricción de CORS

7. Ejemplos de Uso:
   - Ejemplo completo de una petición exitosa
   - Ejemplo de manejo de errores
   - Ejemplo de actualización de datos en tiempo real (si aplica)

8. Documentación Adicional:
   - ¿Existe documentación Swagger/OpenAPI?
   - ¿Hay algún endpoint de prueba disponible?
   - ¿Hay algún entorno de sandbox para pruebas?

Por favor, proporciona esta información en un formato estructurado y detalla los códigos markdown de tal manera que pueda copiar el bloque entero. 
Recuerda que es muy importante que detalles todos los atributos que se devuelven en las reponses de cada enfpoint. Incluye ejemplos de código para las todas las peticiones y respuestas.
```

## Respuesta recibida de Cursor del proyecto API:

### 1. Información General de la API
- **URL Base**: http://localhost:8000/api
- **Versión**: Laravel 12, PHP 8.2, Passport 13
- **Entornos**:
  - Desarrollo: http://localhost:8000/api
  - Producción: No especificado

### 2. Autenticación
- **Método**: OAuth 2.0 con Laravel Passport 13 (Bearer Token)
**Endpoints de autenticación**:

#### Endpoints Autenticación
- `POST /api/register`: Registro de usuarios
- `POST /api/login`: Inicio de sesión
- `POST /api/logout`: Cierre de sesión
- `GET /api/me`: Información del usuario actual
#### Gestión de Usuarios
- `GET /api/users`: Listar todos los usuarios
- `GET /api/users/{id}`: Obtener usuario específico
- `PUT /api/users/{id}`: Actualizar usuario
- `DELETE /api/users/{id}`: Eliminar usuario

**Estructura de peticiones**
Registro (/api/register)
```json
{
  "name": "Nombre",
  "level": "1",
  "email": "usuario@email.com",
  "password": "12341234",
  "password_confirmation": "12341234"
}
```
Login (/api/login)
```json
{
  "email": "usuario@email.com",
  "password": "12341234"
}
```
**Estructura de respuestas**

Registro exitoso
```json
{
  "user": {
    "id": 1,
    "name": "Nombre",
    "level": "1",
    "email": "usuario@email.com",
    "created_at": "...",
    "updated_at": "..."
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "token_type": "Bearer",
  "message": "User created successfully. Wellcome to nsiv!"
}
```
Login exitoso

```json
{
  "user": {
    "email": "usuario@email.com",
    "id": 1
  },
  "message": "Successful login. Wellcome back!",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "token_type": "Bearer"
}
```
Logout exitoso
```json
{
  "message": "Logged out successfully"
}
```
/api/me (usuario autenticado)
```json
{
  "id": 1,
  "name": "Nombre",
  "level": "1",
  "email": "usuario@email.com",
  "created_at": "...",
  "updated_at": "..."
}
```

### 3. Endpoints para Gráficos Sunburst

Recursos: Group, Family, Subfamily, Verb

#### 3.1. Groups

**GET /api/groups**: Devuelve todos los grupos con totales de verbos filtrados por nivel de usuario.

Ejemplo de petición
```json
GET /api/groups
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "groups": [
    {
      "id": 1,
      "name": "Grupo 1",
      "sample": "to be",
      "description": "Grupo de verbos básicos",
      "total": 25,
      "comments": "Comentarios...",
      "taxonomy": "group",
      "colors": {
        "border": "#f43f5e",
        "bg": "#fee2e2",
        "shadow": "shadow-pink-200"
      }
    },
    ...
  ],
  "userLevel": 1
}
```
#### 3.2. Group Show
**GET /api/groups/{id}** Devuelve un grupo y sus familias con totales de verbos filtrados.

Ejemplo de petición
```json
GET /api/groups/1
Authorization: Bearer {access_token}
```
Ejemplo de respuesta
```json
{
  "group": {
    "id": 1,
    "name": "Grupo 1",
    "sample": "to be",
    "description": "Grupo de verbos básicos",
    "total": 25,
    "comments": "Comentarios...",
    "taxonomy": "group",
    "colors": {
      "border": "#f43f5e",
      "bg": "#fee2e2",
      "shadow": "shadow-pink-200"
    }
  },
  "families": [
    {
      "id": 1,
      "name": "Family 1",
      "description": "Descripción...",
      "sample": "to have",
      "comments": "Comentarios...",
      "colors": {
        "border": "#f9a8d4",
        "bg": "#fce7f3",
        "shadow": "shadow-pink-200"
      },
      "total": 10
    },
    ...
  ]
}
```

#### 3.3. Families
**GET /api/families** Devuelve todas las familias con totales de verbos filtrados.

Ejemplo de petición
```json
GET /api/families
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "families": [
    {
      "id": 1,
      "name": "Family 1",
      "description": "Descripción...",
      "sample": "to have",
      "comments": "Comentarios...",
      "colors": {
        "border": "#f9a8d4",
        "bg": "#fce7f3",
        "shadow": "shadow-pink-200"
      },
      "total": 10
    },
    ...
  ]
}
```

#### 3.4. Family Show
**GET /api/families/{id}** Devuelve una familia y sus subfamilias con totales de verbos filtrados.

Ejemplo de petición
```json
GET /api/families/1
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "family": {
    "id": 1,
    "name": "Family 1",
    "description": "Descripción...",
    "sample": "to have",
    "comments": "Comentarios...",
    "colors": {
      "border": "#f9a8d4",
      "bg": "#fce7f3",
      "shadow": "shadow-pink-200"
    },
    "total": 10
  },
  "subfamilies": [
    {
      "id": 1,
      "name": "Subfamily 1",
      "description": "Descripción...",
      "sample": "to do",
      "comments": "Comentarios...",
      "colors": {
        "border": "#f9a8d4",
        "bg": "#fce7f3",
        "shadow": "shadow-pink-200"
      },
      "total": 5
    },
    ...
  ]
}
```

#### 3.5. Subfamilies
**GET /api/subfamilies** Devuelve todas las subfamilias con totales de verbos filtrados.

Ejemplo de petición
```json
GET /api/subfamilies
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "subfamilies": [
    {
      "id": 1,
      "name": "Subfamily 1",
      "description": "Descripción...",
      "sample": "to do",
      "comments": "Comentarios...",
      "colors": {
        "border": "#f9a8d4",
        "bg": "#fce7f3",
        "shadow": "shadow-pink-200"
      },
      "total": 5
    },
    ...
  ]
}
```

#### 3.6. Subfamily Show
**GET /api/subfamilies/{id}** Devuelve una subfamilia y sus verbos filtrados.

Ejemplo de petición
```json
GET /api/subfamilies/1
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "subfamily": {
    "id": 1,
    "name": "Subfamily 1",
    "description": "Descripción...",
    "sample": "to do",
    "comments": "Comentarios...",
    "colors": {
      "border": "#f9a8d4",
      "bg": "#fce7f3",
      "shadow": "shadow-pink-200"
    },
    "total": 5
  },
  "verbs": [
    {
      "all_forms": "do/did/done",
      "spanish": "hacer"
    },
    ...
  ]
}
```

#### 3.7. Verbs
**GET /api/verbs**
Devuelve todos los verbos filtrados por nivel de usuario.

Ejemplo de petición
```json
GET /api/verbs
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "verbs": [
    {
      "group": "Grupo 1",
      "family": "Family 1",
      "subfamily": "Subfamily 1",
      "details": "Detalles...",
      "all_forms": "do/did/done",
      "spanish": "hacer"
    },
    ...
  ]
}
```
#### 3.8. Verb Show
**GET /api/verbs/{id}**
Devuelve los detalles de un verbo.

Ejemplo de petición
```json
GET /api/verbs/1
Authorization: Bearer {access_token}
```

Ejemplo de respuesta
```json
{
  "group": "Grupo 1",
  "family": "Family 1",
  "subfamily": "Subfamily 1",
  "verb": {
    "all_forms": "do/did/done",
    "base": "do",
    "present": "do",
    "past": "did",
    "participle": "done",
    "fonetics_present": "duː",
    "fonetics_past": "dɪd",
    "fonetics_participle": "dʌn",
    "details": "Detalles...",
    "level": 1,
    "spanish": "hacer"
  }
}
```
### 4. Estructura de Datos

**Estructura Jerárquica (4 niveles)**:
1. Groups (Grupos)
2. Families (Familias)
3. Subfamilies (Subfamilias)
4. Verbs (Verbos)

**Formato de colores**
Siempre es un objeto:

```json
{
  "border": "#f43f5e",
  "bg": "#fee2e2",
  "shadow": "shadow-pink-200"
}
```

**Campos obligatorios y tipos**

Campo	Tipo	Obligatorio	Descripción
id	number	sí	Identificador
name	string	sí	Nombre
description	string	sí	Descripción
sample	string	sí	Ejemplo de verbo
comments	string	sí	Comentarios
colors	object	sí	Colores (border, bg, shadow)
total	number	sí	Total de verbos (filtrados)
taxonomy	string	opcional	Solo en Group
Verbos

Campo	Tipo	Obligatorio	Descripción
all_forms	string	sí	Todas las formas
base	string	sí	Forma base
present	string	sí	Presente
past	string	sí	Pasado
participle	string	sí	Participio
fonetics_present	string	sí	Fonética presente
fonetics_past	string	sí	Fonética pasado
fonetics_participle	string	sí	Fonética participio
details	string	sí	Detalles
level	number	sí	Nivel
spanish	string	sí	Traducción

### 5. Consideraciones Técnicas

#### Autenticación
- Todos los endpoints requieren autenticación excepto `/api/register` y `/api/login`
- Se utiliza Laravel Passport 13 para la autenticación
- Los tokens se envían en el header `Authorization: Bearer {token}`

#### Respuestas
- Formato JSON
- Incluyen códigos de estado HTTP apropiados
- Estructura de respuesta estándar:
  ```json
  {
    "data": {
      // Datos de la respuesta
    },
    "message": "Mensaje descriptivo",
    "status": "success/error"
  }
  ```

#### Filtrado de Datos
- Los endpoints de verbos devuelven datos filtrados según el nivel del usuario

### 5. Manejo de Errores
**Códigos de Estado HTTP**:
- 200: Éxito
- 201: Creado
- 400: Error de validación
- 401: No autenticado
- 403: No autorizado
- 404: Recurso no encontrado
- 500: Error del servidor

Estructura de Error
```json
{
  "message": "Mensaje de error",
  "errors": {
    "campo": [
      "Detalle del error"
    ]
  }
}
```
Ejemplos:
```json
{
  "message": "Unauthenticated."
}

{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}

{
  "message": "No query results for model [App\\Models\\Group] 99999"
}
```
### 6. Limitaciones y Consideraciones
- Filtrado por nivel de dificultad del usuario
- Solo verbos con nivel igual o menor al del usuario
Rate limiting:
Por defecto, Laravel aplica 60 peticiones/minuto por usuario.
(Configurable en RouteServiceProvider)

- Tamaño máximo de respuesta:
Depende de la cantidad de datos, pero no hay paginación por defecto.

- Timeouts:
Dependen de la configuración del servidor (usualmente 30-60s).

- CORS:
Laravel permite configurar CORS en config/cors.php.
Por defecto, acepta peticiones desde cualquier origen en desarrollo.

### 7. Ejemplos de Uso
Ejemplo de Petición Autenticada
```typescript
const response = await fetch('http://localhost:8000/api/groups', {
  headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    }
});
```

Ejemplo de Respuesta Exitosa
```typescript
// TypeScript + fetch
const res = await fetch('http://localhost:8000/api/groups', {
  headers: { Authorization: `Bearer ${accessToken}` }
});
const data = await res.json();
console.log(data.groups);

```
Ejemplo de manejo de error

```typescript

try {
  const res = await fetch('http://localhost:8000/api/groups/99999', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw await res.json();
} catch (err) {
  alert(err.message); // "No query results for model [App\\Models\\Group] 99999"
}


```
Ejemplo de actualización de datos en tiempo real
No hay endpoints push/streaming. Para datos en tiempo real, usa polling.

### 8. Interfaces TypeScript

```typescript
// Base color interface
export interface ColorInfo {
  border: string;
  bg: string;
  shadow: string;
}

// Group
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

// Family
export interface Family {
  id: number;
  name: string;
  description: string;
  sample: string;
  comments: string;
  colors: ColorInfo;
  total: number;
}

// Subfamily
export interface Subfamily {
  id: number;
  name: string;
  description: string;
  sample: string;
  comments: string;
  colors: ColorInfo;
  total: number;
}

// Verb (list)
export interface VerbListItem {
  group: string;
  family: string;
  subfamily: string;
  details: string;
  all_forms: string;
  spanish: string;
}

// Verb (detail)
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

// Auth
export interface AuthUser {
  id: number;
  name: string;
  level: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  token_type: string;
  message: string;
}

// Error
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Respuestas de endpoints
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
```

### 9. Implementación Técnica
Se ha proporcionado un archivo de tipos TypeScript completo (`types/api.types.ts`) que incluye:
- Interfaces para todos los tipos de datos
- Configuración de la API
- Implementación de funciones con axios
- Manejo de autenticación
- Endpoints para todos los recursos

**Fecha de la interacción**: 16/6/25
**Estado**: Completado

**Próximos pasos**:
1. Implementar la configuración de la API en el frontend
2. Crear los servicios de autenticación
3. Desarrollar los componentes para la visualización de datos
4. Implementar la lógica de los gráficos sunburst 

### Primera propuesta de la IA de interfaces y otros elementos:

```typescript

// Configuración de la API
const API_CONFIG = {
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

// Ejemplo de uso con axios
import axios from 'axios';

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

Esta estructura proporciona:
Tipos TypeScript para todas las entidades
Configuración centralizada de la API
Funciones de autenticación listas para usar
Funciones para obtener datos de la estructura jerárquica
Interceptores para manejar el token de autenticación
Para usar esto en tu proyecto frontend:
Crea un archivo types/api.types.ts con estos tipos
Crea un archivo services/api.ts con las funciones
Importa y usa las funciones donde las necesites
Ejemplo de uso:
// En un componente React
import { verbsAPI } from '../services/api';

const MyComponent = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await verbsAPI.getGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    // Renderizar los grupos
  );
};
```

## Nuevo prompt 

Al generar los datos de respuesta json para definir el frontend, Cursor ha obviado varios campos y ha inventado otros.
He cambiado el protmp para insistir en que genere las respuestas Json de todos los endpoints y de todos los atributos en lugar de detallar "algunos ejemplos de los endpoints más importantes, si es posible" y los "atributos para gráficos sunburst" y lo he pedido de nuevo. Esta vez a Chat GPT 4 en Copylot. Añadiendo los modelos, controladores, servicios y tests al contexto.

La información adicional obtenida se ha añadido al informe anterior y se ha pedido a Cursor que compare las dos propuestas de interfaces y que propusiera las modificaciones oportunas razonando el porque. 
En concreto se le ha pedido que compare el epígrafe 8 con el 9.

Los cambios se han grabado en api.types.ts
