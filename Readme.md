## Requeriments acadèmics

### Desenvolupar

**Nivell 1** client frontend amb React

**Nivell 2** connectar frontend amb api

**Nivell 3** deckeritzar l'Api o l'entrega de nivell 1

## Tecnologia aplicada

1. PHP 8.2
2. Laravel 12
3. Passport 13


### Treball amb la IA
L'entrega ha d'incloure una presentació on exposis els següents punts:

1. Descripció del model IA seleccionat i el motiu de la seva elecció.
2. Registre de les interaccions més significatives amb la IA.
3. Anàlisi del codi generat per la IA: característiques principals i ajustos o modificacions realitzats per adaptar-lo als requisits.
4. Descripció del procés de connexió entre el frontend i el backend: Explica com has aconseguit connectar el frontend generat per la IA amb el backend implementat en PHP/Laravel, reptes enfrontats les solucions implementades.
5. Reflexió sobre el procés d'aprenentatge: aspectes més interessants o desafiants, habilitats o coneixements adquirits.
6. Codi al repositori de GitHub:
La presentació ha de ser clara, organitzada i amb contingut visual rellevant, documentada de manera clara i organitzada al README

### Recomanacions

#### Selecció de la IA
1) Investiga i tria entre diferents models d'IA:   ChatGPT, DALL·E, Gemini, DeepSeek, Claude
2) Considera la facilitat d'ús, la qualitat de les respostes i la compatibilitat amb el projecte.

#### Interacció amb la IA
Formulació de prompts, iteracions, registre, URLs si convé

#### Comprendre codi generat
1) llegir i entendre el codi generat per la IA, identifir les diferents parts i com s'integren.
2) Provar i depurar el codi per assegurar-te funcionionament correcte.

#### Ajustar i personalitzar i millores

#### Progrés pas a pas
1)  comença generant un component senzill amb la IA i prova'l.
2) Integra gradualment més funcionalitats, fent proves a cada pas per assegurar-te que tot funcioni correctament abans de continuar.
3) Documenta qualsevol problema que trobis i com l'has solucionat

**Presentació**
**Reflexió** Aspectes mes interessants i reptes, habilitats i coneixements adquirits
**Gestió del temps** : planifica







## Desenvolupament

Ias triades per fer la investigació inicial: 
- Cursor
- Chat GPT 4 agente entrenado en Javascript React PHP SQL+ de Chat GPT
- Claude 4 Sonnet 
- Deepseek


## Instal.lació a un PC on ja existeix el projecte

1) Clonar el repositorio (si no está ya clonado)
```bash
git clone [URL_DEL_REPOSITORIO]
cd nsiv-frontend
```

2) **Configurar variables de entorno (IMPORTANTE)**
```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar el archivo .env con la URL de tu API local
# Ejemplo para XAMPP:
REACT_APP_API_URL=http://localhost/ccardona_NO_ESBORRAR/Sprint5/nsiv_API/public/api
```

**URLs comunes segons el teu entorn:**
- **XAMPP (port 80):** `http://localhost/[tu_carpeta]/Sprint5/nsiv_API/public/api`
- **XAMPP (port 8080):** `http://localhost:8080/[tu_carpeta]/Sprint5/nsiv_API/public/api`
- **Laravel Serve:** `http://localhost:8000/api`

3) Instalar dependencias principals
```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

4) Instalar D3.js per als gràfics
```bash
npm install D3
```

5) Instalar totes les dependències del projecte
```bash
npm install
```

6) Llevar el servidor de desenvolupament
```bash
npm run dev
```

7) Verificar que l'aplicació funciona a:
http://localhost:5173

### Notes importants:
- Assegura't que Node.js està instal·lat al sistema
- Si hi ha problemes amb els permisos a Windows, executa PowerShell com a administrador
- Si el servidor no s'inicia, verifica que el port 5173 no està en ús
- Si hi ha errors d'importació, verifica que tots els fitxers tenen l'extensió correcta (.jsx per fitxers amb JSX)

## Configuració de Entorns

### Variables de Entorn

El projecte utilitza variables d'entorn per configurar la URL de l'API backend. Això permet que cada desenvolupador configuri el seu entorn local sense modificar el codi font.

#### Configuració Inicial

1. **Copia el fitxer d'exemple:**
```bash
copy .env.example .env
```

2. **Edita el fitxer `.env` amb la teva configuració local:**
```properties
REACT_APP_API_URL=http://localhost/tu_carpeta/Sprint5/nsiv_API/public/api
```

#### URLs per Entorn

| Entorn | URL | Ús |
|---------|-----|-----|
| **XAMPP Local** | `http://localhost/ccardona_NO_ESBORRAR/Sprint5/nsiv_API/public/api` | Desenvolupament local amb XAMPP |
| **XAMPP Puerto 8080** | `http://localhost:8080/carpeta/Sprint5/nsiv_API/public/api` | XAMPP en port alternatiu |
| **Laravel Serve** | `http://localhost:8000/api` | Servidor de desenvolupament de Laravel |
| **Producció** | `https://tu-dominio.com/api` | Servidor de producció |

#### Verificar Configuració

Per verificar que la teva URL és correcta:

1. **Obre al navegador:** `[TU_URL]/groups`
2. **Resultat esperat:** JSON amb dades o error d'autenticació (401)
3. **Error 404:** La URL no és correcta

#### Solució de Problemes

**❌ Error: "Cannot find name 'process'"**
- **Causa:** Problema amb variables d'entorn
- **Solució:** Reinicia el servidor després de canviar `.env`

**❌ Error: "Network Error" o "Failed to fetch"**
- **Causa:** URL incorrecta o servidor backend no està corrent
- **Solució:** 
  1. Verifica que el backend està corrent
  2. Comprova la URL al fitxer `.env`
  3. Reinicia el servidor frontend

**⚠️ Important:**
- El fitxer `.env` **NO s'puja a Git** (està a .gitignore)
- Cada desenvolupador ha de configurar el seu propi `.env`
- Sempre reinicia el servidor després de canviar variables d'entorn

## Creacion del proyecto

1) Inicialización del proyecto con Vite
```bash
npm create vite@latest nsiv-frontend -- --template react
cd nsiv-frontend
```

2) Instalación de dependencias principales
```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

3) Configuración de Vite
- Creación del archivo `vite.config.js` con la configuración necesaria para React
- Configuración del alias '@' para importaciones absolutas

4) Estructura de carpetas
```bash
mkdir src\components 
mkdir src\pages 
mkdir src\services 
mkdir src\hooks 
mkdir src\contexts
```

5) Instalación de D3.js para visualización de datos
```bash
npm install d3
```

6) Creación de componentes base
- `Button.jsx`: Componente reutilizable para botones con estilos personalizados
- `SunburstChart.jsx`: Componente para visualización de datos jerárquicos usando D3.js

7) Creación de pàgines principals
- `Home.jsx`: Página principal amb l'estructura bàsica de l'aplicació
- Implementació de la visualització de dades amb el component SunburstChart

8) Configuració d'estils
- Creació de fitxers CSS per a cada component
- Implementació d'estils responsius i moderns

9) Configuració del punt d'entrada
- Modificació de `main.jsx` per renderitzar l'aplicació React
- Configuració de l'enrutament bàsic

10) Proves inicials
- Verificació de la compilació del projecte
- Comprovació del funcionament del servidor de desenvolupament
- Proves dels components implementats

## Documentació Adicional

### Interaccions amb la IA
Per veure el registre detallat de les interaccions amb la IA i els problemes resolts, consulta el fitxer [IA_INTERACTIONS.md](./IA_INTERACTIONS.md).

### Resolució de Problemes Comuns

#### Errores de Configuració de API

**❌ Error de autenticació 401**
```
Error al carregar perfil: Request failed with status code 401
```
**Solució:**
1. Verifica que has fet login correctament
2. Comprueba que el token se guardó en localStorage
3. Usa el componente ApiTest per hacer login i obtenir un token vàlid

**❌ Error de connexió "Network Error"**
```
Error al carregar perfil: Network Error
```
**Solució:**
1. Verifica la URL en el teu fitxer `.env`
2. Comprueba que el servidor backend està corrent
3. Obre manualment la URL en el navegador: `[TU_URL]/groups`

**❌ Error "Cannot find name 'process'"**
```
Cannot find name 'process'. Do you need to install type definitions for node?
```
**Solució:**
1. Reinicia completament el servidor de desenvolupament
2. Verifica que el teu fitxer `.env` existeix i té la variable `REACT_APP_API_URL`

#### Errores de Importació de React
Si trobes errors com:
```
Failed to resolve import "react" from "src/pages/Home.jsx"
```

Executa els següents comandos:
```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

Després, assegura't que el teu `vite.config.js` contingui:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

#### Optimització de Dependències
Si necessites optimitzar les dependències:
```bash
npm run build
```

## Flujo de Trabajo del Equipo

### Para Nuevos Desarrolladores

1. **Clona el repositorio**
2. **Configura tu entorno local:**
   ```bash
   copy .env.example .env
   # Edita .env con tu URL específica
   ```
3. **Instala dependencias:** `npm install`
4. **Inicia el servidor:** `npm run dev`
5. **Verifica la conexión amb la API** usando el componente ApiTest

### Para Cambios en el Proyecto

1. **Antes de hacer cambios:** Asegúrate de que tu `.env` está configurado correctamente
2. **Al encontrar problemas de API:** Verifica primero la configuración de entorno
3. **No subas archivos `.env`** al repositorio (están en .gitignore)
4. **Documenta cambios** en las URLs o configuración en este README

### Componente ApiTest

El proyecto incluye un componente `ApiTest` que permet:
- ✅ Probar la conexión con diferentes URLs de API
- ✅ Hacer login y obtener tokens de autenticación
- ✅ Verificar todos los endpoints
- ✅ Diagnosticar problemas de configuración

**Uso recomendado:** Antes de trabajar con otros componentes, usa ApiTest para verificar que tu configuración funciona correctamente.

## Endpoints de l'API

### Endpoints de Usuari

| Método | Endpoint | Acción | Controlador | Testing |
|--------|----------|---------|-------------|----------|
| POST | `api/register` | Crear usuario | AuthController.register | AuthManagementTest.php |
| POST | `api/login` | Autenticar usuario | AuthController.login | AuthManagementTest.php |
| POST | `api/logout` | Cerrar sesión | AuthController.logout | AuthManagementTest.php |
| GET | `api/me` | Leer datos propios | AuthController.me | AuthManagementTest.php |
| GET | `api/users` | Mostrar todos los usuarios | UserController.index | UserManagementTest.php |
| GET | `api/users/{id}` | Leer usuario específico | UserController.show | UserManagementTest.php |
| PUT | `api/users/{id}` | Actualizar usuario | UserController.update | UserManagementTest.php |
| DELETE | `api/users/{id}` | Eliminar usuario | UserController.destroy | UserManagementTest.php |

### Endpoints de Verbos

| Método | Endpoint | Acción | Controlador | Testing |
|--------|----------|---------|-------------|----------|
| GET | `api/groups` | Mostrar todos los grupos | Group.index | GroupControllerTest.php |
| GET | `api/groups/{id}` | Mostrar familias en un grupo | Group.show | GroupControllerTest.php |
| GET | `api/families` | Mostrar todas las familias | Family.index | FamilyControllerTest.php |
| GET | `api/families/{id}` | Mostrar subfamilias en una familia | Family.show | FamilyControllerTest.php |
| GET | `api/subfamilies` | Mostrar todas las subfamilies | Subfamily.index | SubFamilyControllerTest.php |
| GET | `api/subfamilies/{id}` | Mostrar verbos en una subfamilia | Subfamily.show | SubfamilyControllerTest.php |
| GET | `api/verbs` | Mostrar todos los verbos | Verb.index | VerbControllerTest.php |
| GET | `api/verbs/{id}` | Mostrar un verbo específico | Verb.show | VerbControllerTest.php |

**Notas**:
- Todos los endpoints requieren autenticación excepto `api/register` i `api/login`
- Los endpoints de verbos devuelven datos filtrados segons el nivell del usuari
- Les respostes inclouen colors en format hexadecimal per la visualització en gràfics sunburst