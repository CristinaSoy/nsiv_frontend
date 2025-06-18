# Introducción y planteamiento del proyecto

Para realizar la investigación sobre diferentes ias con el objetivo de elegir con cual iba desarrollar el proyecto he planteado el mismo prompt a 4 ias (Ver Prompt 1)
- Agente de Cursor
- Agente de Claude Sonnet 4 en VSC Copilot (cuota mensual de 10USD)
- Agente entregado en React de Chat GPT 4 
- Deepseek

Rápidamente he descartado estos dos:
- Chat GPT4: en vsc no permite acceder a agentes entrenados y me ha dado malos resultados en el pasado
- Deepseek: por la dificultad de usarlo fuera del IDE

He seleccionado Cursor y VSC con Claude por la facilidad de integrarlo en el códido y, en el caso de Claude por las buenas referencias de Bovilas.

Durante el proyecto he alternado entre los dos IDEs -VSC y Cursor- con sus dos ias -Claude Sonnet 4 y otra inderminada (al menos yo no he conseguido que Cursor me dijera cuál es el modelo que usa)-.

La alternancia ha seguido casi siempre el mismo flujo.
1. Planteo petición a Cursor porque me daba la sensación de que tenía que ser más potente
2. Cursor antes o después se mete en bucles de error y corrección sin salida.
3. Descarto todos los cambios de Cursor y planteo la petición Claude
4. Claude resuelve la peticion sin grandes dificultades e informando sobre sus pasos de manera que podía orientarla para solucionar algún atasco.

Los retos planteados han sido, por tanto, saber cortar los bucles de error de la ia, y cambiar hacia aquella que mejor funciona. 

**He aprendido** a trabajar en equipo con la ia, en este caso con Claude. A usarla con el agente activado en VSC, proporcionando el contexto necesario, a la vez que mantengo el control de lo que está pasando y puedo intervenir cuando es necesario.


# Interacciones más relevantes con la Ia:
## Prompt 1: contexto general
Soy estudiante de fullstack.
- He desarrollado mi primera API Rest en PHP 8.2, Laravel 12, Passport 13 y Spatie para la gestión de roles y permisos.
- Ahora estoy realizando un ejercicio de clase en el que debo desarrollar el frontend de mi API para un hipotético client y necesito que me ayudes a desarrollar el frontend con React. 
- Debes saber que nunca he trabajando con React por lo que empezaremos por que me expliques desde cero todos los pasos necesarios para realizar el proyecto, empezando por cómo instalarlo y también cómo renderizar el frontend de forma que pueda probarlo.
Cuando hayamos superado este paso pasaremos al siguiente.
- También debes saber que el ejercicio de clase consiste en, además de desarrollar el frontend tal como te he dicho, realizar una investigación sobre diferentes modelos de IA para ver cuál es más competente y eficaz para el desarrollo de código. Al realizar mi entrega, además del frontend, haré una presentación con mis conclusiones sobre los retos encontrados en el proyecto y cómo los hemos superado, la idoneidad de las respuestas recibidas y los resultados obtenidos con cada IA.
Esto quiere decir que voy a iniciar esta misma conversación con este prompt con **Claude Sonnet 4** en VSC, con **Cursor** y con **DeepSeek**

Sobre el proyecto:
- En el readme veras los requisitos técnicos y académicos
- El frontend deberá mostrar los datos obtenidos de los diferentes endpoints en graficos sunburts. Los colores se reciben de las respuestas json de cada endpoint.

## Prompt2: Datos de la API y configuración inicial. Prompt obtenido de la ia
A continuación se detalla toda la info necesaria de una API para desarrollar el Frontend,
Tu misión es realizar todos los pasos para desarrollar el frontend de esta api en el proyecto en donde estamos. 
Revisa la información que se detalla más abajo y pídeme todo aquello que necesites para llevar a cabo tu misión.

###Tecnología del proyecto actual
**PHP 8.2**
**React**
**D3** para gráficos sunburst


### 1. Información General de la API
- **URL Base**: http://localhost:8000/api
- **Versión**: Laravel 12, PHP 8.2, Passport 13
- **Entornos**:
  - Desarrollo: http://localhost:8000/api
  - Producción: No especificado

### 2. Autenticación
- **Método**: OAuth 2.0 con Laravel Passport 13 (Bearer Token)
- **Endpoints**:
  - Registro de Usuario
  - Login
  - Logout
  - Obtener Datos del Usuario

### 3. Endpoints para Gráficos Sunburst
**Estructura Jerárquica (4 niveles)**:
1. Groups (Grupos)
2. Families (Familias)
3. Subfamilies (Subfamilias)
4. Verbs (Verbos)

#### Atributos de Verbos
- **Grupos**:
  - `id`: Identificador único
  - `name`: Nombre del grupo
  - `color`: Color en formato hexadecimal
  - `description`: Descripción del grupo

- **Familias**:
  - `id`: Identificador único
  - `name`: Nombre de la familia
  - `color`: Color en formato hexadecimal
  - `description`: Descripción de la familia
  - `group_id`: Referencia al grupo padre

- **Subfamilias**:
  - `id`: Identificador único
  - `name`: Nombre de la subfamilia
  - `color`: Color en formato hexadecimal
  - `description`: Descripción de la subfamilia
  - `family_id`: Referencia a la familia padre

- **Verbos**:
  - `id`: Identificador único
  - `name`: Nombre del verbo
  - `description`: Descripción del verbo
  - `subfamily_id`: Referencia a la subfamilia padre

### 2. Endpoints de la API

#### Autenticación
- `POST /api/register`: Registro de usuarios
- `POST /api/login`: Inicio de sesión
- `POST /api/logout`: Cierre de sesión
- `GET /api/me`: Información del usuario actual

#### Gestión de Usuarios
- `GET /api/users`: Listar todos los usuarios
- `GET /api/users/{id}`: Obtener usuario específico
- `PUT /api/users/{id}`: Actualizar usuario
- `DELETE /api/users/{id}`: Eliminar usuario

#### Gestión de Verbos
- `GET /api/groups`: Listar todos los grupos
- `GET /api/groups/{id}`: Obtener familias de un grupo
- `GET /api/families`: Listar todas las familias
- `GET /api/families/{id}`: Obtener subfamilias de una familia
- `GET /api/subfamilies`: Listar todas las subfamilias
- `GET /api/subfamilies/{id}`: Obtener verbos de una subfamilia
- `GET /api/verbs`: Listar todos los verbos
- `GET /api/verbs/{id}`: Obtener verbo específico

### 3. Consideraciones Técnicas

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

- Las respuestas incluyen colores en formato hexadecimal para la visualización en gráficos sunburst

### 4. Estructura de Datos
- **Formato de Colores**: Strings en formato hexadecimal
- **Jerarquía**: Cada nivel mantiene tonalidad similar a su padre
#### Endpoints de usuario y autenticación

**POST /api/register**
Estructura de la peticion:
```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "password_confirmation": "string",
    "level": "integer" // Nivel de dificultad del usuario
}
```
**POST /api/login**
Estructura de la peticion:
```json
{
    "email": "string",
    "password": "string"
}
```

**POST /api/logout**
Requiere token de autenticación en el header:
Authorization: Bearer {token}

**GET /api/me**
Obtener Datos del Usuario
Requiere token de autenticación en el header.

#### Endpoints para Gráficos Sunburst


**GET /api/groups**
Devuelve todos los grupos con sus colores asociados.
**GET /api/groups/{id}**
Devuelve las familias pertenecientes a un grupo específico.

**GET /api/families**
Todas las Familias

**GET /api/families/{id}**
Subfamilias en una Familia

**GET /api/families/{id}**
Devuelve las subfamilias pertenecientes a una familia específica.
**GET /api/subfamilies**
Todas las Subfamilias
**GET /api/subfamilies/{id}**
Devuelve los verbos pertenecientes a una subfamilia específica.

**GET /api/verbs**
Todos los Verbos

**GET /api/verbs/{id}**
Verbo Específico


#### Ejemplo de Respuesta para Grupos
```json
{
    "data": [
        {
            "id": 1,
            "name": "string",
            "color": "string",
            "total_verbs": "integer",
            "families": [
                {
                    "id": 1,
                    "name": "string",
                    "color": "string",
                    "total_verbs": "integer"
                }
            ]
        }
    ]
}
```

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
    "error": {
        "message": "string",
        "code": "integer"
    }
}
```

### 6. Limitaciones y Consideraciones
- Filtrado por nivel de dificultad del usuario
- Solo verbos con nivel igual o menor al del usuario
- CORS: Pendiente de configuración

7. Ejemplos de Uso
Ejemplo de Petición Autenticada
const response = await fetch('http://localhost:8000/api/groups', {
```json
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    }
});
```

Ejemplo de Respuesta Exitosa
```json
{
    "data": [
        {
            "id": 1,
            "name": "Grupo 1",
            "color": "#FF5733",
            "total_verbs": 10,
            "families": [
                {
                    "id": 1,
                    "name": "Familia 1",
                    "color": "#FF7F50",
                    "total_verbs": 5
                }
            ]
        }
    ]
}
```

### 7. Implementación Técnica
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

Información en un formato más estructurado y copiable para el frontend:

```typescript
// types/api.types.ts

// Tipos de autenticación
interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  level: number;
}

// Tipos para la estructura jerárquica
interface Verb {
  id: number;
  name: string;
  level: number;
  // Otros campos específicos del verbo
}

interface Subfamily {
  id: number;
  name: string;
  color: string;
  total_verbs: number;
  verbs?: Verb[];
}

interface Family {
  id: number;
  name: string;
  color: string;
  total_verbs: number;
  subfamilies?: Subfamily[];
}

interface Group {
  id: number;
  name: string;
  color: string;
  total_verbs: number;
  families?: Family[];
}

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

## Resumen de las actuaciones realizadas por Cursor en respuesta al Prompt 2

Cursor implementa:

1. **Estructura de Tipos (`src/types/api.types.ts`)**
   - Definimos las interfaces para todos los datos que vienen de la API:
     - `AuthResponse`: Para las respuestas de autenticación
     - `User`: Para los datos de usuario
     - `Verb`, `Subfamily`, `Family`, `Group`: Para la jerarquía de verbos
   - Configuramos las constantes de la API (URLs, endpoints, headers)

2. **Servicio de API (`src/services/api.ts`)**
   - Implementamos las funciones para comunicarnos con el backend:
     - Funciones de autenticación (`login`, `register`, `logout`, `getCurrentUser`)
     - Funciones para obtener datos de verbos (`getGroups`, `getFamilies`, etc.)
   - Configuramos Axios con interceptores para manejar el token de autenticación

3. **Componente de Autenticación (`src/components/Auth.tsx`)**
   - Creamos un formulario que maneja tanto login como registro
   - Incluye campos para:
     - Email y contraseña (login)
     - Nombre, email, contraseña, confirmación y nivel (registro)
   - Maneja estados de error y éxito

4. **Componente SunburstChart (`src/components/SunburstChart.tsx`)**
   - Implementamos la visualización de datos jerárquicos usando D3.js
   - Definimos tipos específicos para D3:
     - `HierarchyData`: Estructura de datos para la jerarquía
     - `HierarchyNode`: Tipo extendido para los nodos del gráfico
   - El gráfico muestra:
     - Grupos en el nivel más externo
     - Familias en el segundo nivel
     - Subfamilias en el tercer nivel
     - Verbos en el nivel más interno
   - Cada nivel mantiene los colores definidos en la API

5. **Componente VerbHierarchy (`src/components/VerbHierarchy.tsx`)**
   - Componente contenedor que:
     - Obtiene los datos de la API
     - Maneja estados de carga y error
     - Renderiza el SunburstChart con los datos

6. **Componente Principal (`src/App.tsx`)**
   - Gestiona el estado de autenticación
   - Maneja la navegación entre:
     - Pantalla de login/registro
     - Visualización de la jerarquía de verbos
   - Implementa el logout

7. **Estilos (`src/App.css` y `src/index.css`)**
   - `App.css`: Estilos específicos para los componentes
   - `index.css`: Estilos globales y configuración base

8. **Punto de Entrada (`src/main.tsx`)**
   - Inicializa la aplicación React
   - Configura el modo estricto

##La aplicación sigue este flujo:

1. El usuario llega a la aplicación y ve el formulario de login/registro
2. Al autenticarse, se guarda el token en localStorage
3. Se muestra la visualización de la jerarquía de verbos
4. El gráfico Sunburst se actualiza automáticamente con los datos de la API
5. El usuario puede cerrar sesión en cualquier momento

Los datos fluyen así:
```
API Backend → Servicios API → Componentes → D3.js → Visualización
```


## Resultados tras implementación respuesta

A diferencia de lo que la IA dice, la vista en localhost:5173 muestra dos botones "Cargar datos" y "Ver/Ocultar grafico" que no hacen nada.
Se le pide que revise todos los componentes y resto de codigo para comprobar que todos los elementos necesarios para que funcione el frontend estan adecuadamente definidos

## Resultados de la revisión
después de muchas revisiones, creación, modificacion y eliminación de ficheros parece que Cursor ha entrado en un bucle. Descarto todos los cambios.

## Corrección de errores con **VSC y Claude 4** modo agente
Se le pide a Claude que corrija el problema. Para eso se le refirer al fichero IA_INTERACTIONS que muestra toda la info de la api para crear el frontend
 
**Claude* encuentra el problema y lo soluciona de forma rápida y sin titubeos.

## Configuracion de Axios y creación de ApiTest para Testing de rutas.
Claude revisa la configuración de Axios y a petición mía crea un ApiTest.tsx para probar todas las rutas.

El acceso a las rutas autenticadas presenta incidencias. 
Claude entra en bucle. 
Le sugiero que revise el envío del token y le insto a que debuguee el flujo del token para detectar donde está el problema.

Claude se muestra receptiva a mis propuestas, encuentra el problema 
y lo soluciona ràpidamente.

## Mejora de los datos iniciales

Detecto que los datos procedentes de la API son deficientes. 
Le pido a **Cursor** que vuelva a declarar los interfaces de acuerdo con los datos completos.
Cuando le planteo cuestiones sobre sus outputs cambia de opinión continuamente.
Finalmente le pido a **Copilot Claude** que genere las interfaces, cuando le pido explicaciones me las da sin cambiar de opinión y de forma convincente.




## User endpoints *VSC Claude sonet 4 modo Agente*
Copio el mensaje de error que da el localhost:5173 y le sugiero que revise el fichero ApiTest en el que todos los endpoints funcionan.
Claude detecta varios errores que corrige, como sigue dando error, propone algunas opciones. Detecto que el problema es con la URL que es distinta en este equipo y está hardcodeada.
Propongo definir la url mediante una variable. Claude hace varios cambios que siempre acaban hardcodeando la url.
A instancias mías crea el fichero .env para albergar la url como variable de entorno y después de varios errores que ella misma corrige produce un codigo sin errores para los endpoints de usuario.

Durante todo el proceso Claude informa de lo que está haciendo: 
- se informa leyendo los ficheros que necesita
- informe de los cambios que ejecuta y donde
- cuando detecta que ha cometido errores lo anuncia y informa de la corrección.


## Graficos sunburst VSC Claude Sonnet 4 vs Cursor·
Se ha pedido a las dos ias que realicen los gráficos sunburst y se les ha realizado preguntas sobre cómo y dónde se definen los gráficos.
- Cursor: ha hecho caso omiso de las preguntas, se ha lanzado a programar y ha entrado en un bucle de errores y correcciones que tras una hora de ejecución no ha llegado a buen puerto.
- Claude: ha respondido a mis preguntas y ha dedicado tiempo a estudiar el código existente antes de hacer una propuesta de usabilidad que yo he ajustado y que ha entendido perfectamente. A continuación ha hecho una propuesta de implementación que, tras mi aprobación, ha funcionado a la primera.
A partir de esa primnera versión, hemos explorado otras opciones para mejorar el gráfico. Claude ha añadido sucesivos botones a la vista a medida que le pedía explorar otras opciones de gráficos generando, de este modo, una plataforma para perfeccionar el frontend y adaptarlo a las necesidades del proyecto.


# Retos encontrados durante el proyecto

Saber proporcionar el prompt adecuado con el contexto necesario.
Saber detectar cuando la ia entra en bucle y abandonar el hilo infructuoso.
Saber acompañar a la ia cuando es necesario intervenir para resolver problemas que por algún motivo ella no alcanza. (ejemplo del token en el login).
Saber elegir la ia adecuada para las necesidades del momento.

# Conclusiones

A pesar de que en el inicio pensé en empezar con 4 ias para compararlas, descarté rápidamente a Deepseek y al agente entrenado en React de GPT4 por la ventaja enorme que suponen los agentes activos de Cursor y de VSC. 
Durante el proyecto ha quedado demostrada la superioridad de Claude Sonnet 4