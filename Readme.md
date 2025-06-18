# Frontend NSIV - Visualitzador de Verbs Jerárquic

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646cff?style=for-the-badge&logo=vite)
![D3.js](https://img.shields.io/badge/D3.js-7.9.0-f68e56?style=for-the-badge&logo=d3dotjs)
![Axios](https://img.shields.io/badge/Axios-1.10.0-5a29e4?style=for-the-badge&logo=axios)

**Client frontend interactiu amb gràfics sunburst per visualitzar la jerarquia de verbs**

[📱 Demo en viu](#) • [📖 Documentació](#taula-de-continguts) • [🚀 Instal·lació](#instal·lació-ràpida) • [🧠 Informe IA](./Trabajo-sobre-la-ia/Informe_ia.md)

</div>

---

## 📋 Taula de continguts

- [📋 Taula de continguts](#-taula-de-continguts)
- [🎯 Sobre el projecte](#-sobre-el-projecte)
  - [Funcionalitats principals](#funcionalitats-principals)
  - [Requeriments acadèmics](#requeriments-acadèmics)
- [🛠️ Tecnologies aplicades](#️-tecnologies-aplicades)
- [🚀 Instal·lació ràpida](#-instal·lació-ràpida)
  - [Prerequisits](#prerequisits)
  - [Configuració inicial](#configuració-inicial)
- [⚙️ Configuració d'entorn](#️-configuració-dentorn)
  - [Variables d'entorn](#variables-dentorn)
  - [URLs per entorn](#urls-per-entorn)
  - [Verificació de la configuració](#verificació-de-la-configuració)
- [📊 Components de visualització](#-components-de-visualització)
  - [InteractiveSunburst](#interactivesunburst)
  - [MultiLevelSunburst](#multilevelsunburst)
  - [HybridSunburst](#hybridsunburst)
- [🔗 Endpoints de l'API](#-endpoints-de-lapi)
  - [Endpoints d'usuari](#endpoints-dusuari)
  - [Endpoints de verbs](#endpoints-de-verbs)
- [🧠 Treball amb intel·ligència artificial](#-treball-amb-intel·ligència-artificial)
  - [Models d'IA utilitzats](#models-dia-utilitzats)
  - [Procés de desenvolupament](#procés-de-desenvolupament)
- [🔧 Resolució de problemes](#-resolució-de-problemes)
  - [Errors comuns d'API](#errors-comuns-dapi)
  - [Errors d'importació](#errors-dimportació)
- [👥 Flux de treball de l'equip](#-flux-de-treball-de-lequip)
- [📁 Estructura del projecte](#-estructura-del-projecte)
- [🤝 Contribució](#-contribució)

---

## 🎯 Sobre el projecte

Aquest projecte és una aplicació web frontend desenvolupada com a part del **Sprint 5 de l'IT Academy**, centrada en la creació d'un client React que consumeix una API Laravel per visualitzar verbs organitzats jeràrquicament.

L'aplicació ofereix múltiples formes de visualitzar la informació mitjançant **gràfics sunburst interactius** creats amb D3.js, permetent als usuaris explorar la jerarquia de verbs de manera intuïtiva i visual.

### Funcionalitats principals

- 🔐 **Autenticació completa**: Registre, login i gestió de perfils d'usuari
- 👥 **Gestió d'usuaris**: Llistat, visualització i edició de perfils
- 📊 **Visualització jerárquica**: Múltiples tipus de gràfics sunburst
  - **InteractiveSunburst**: Drill-down per nivells amb breadcrumbs
  - **MultiLevelSunburst**: Vista multinivell amb anells concèntrics
  - **HybridSunburst**: Combinació de drill-down selectiu i etiquetes horizontals
- 🎨 **Interfície moderna**: Disseny responsive amb components reutilitzables
- 🛠️ **Eina de testing**: Component ApiTest per verificar connexions i endpoints

### Requeriments acadèmics

- ✅ **Nivell 1**: Client frontend amb React - **REALITZAT**
- ✅ **Nivell 2**: Connexió frontend amb API - **REALITZAT**  
- ⏳ **Nivell 3**: Dockerització de l'API o entrega de nivell 1

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🛠️ Tecnologies aplicades

| Tecnologia | Versió | Funció |
|------------|--------|--------|
| **React** | 19.1.0 | Framework frontend principal |
| **TypeScript** | 5.0+ | Tipat estàtic i desenvolupament robust |
| **Vite** | 6.3.5 | Eina de construcció i servidor de desenvolupament |
| **D3.js** | 7.9.0 | Visualització de dades i gràfics interactius |
| **Axios** | 1.10.0 | Client HTTP per consumir l'API |
| **React Router DOM** | 7.6.2 | Navegació i enrutament |

### Backend (API Laravel)
| Tecnologia | Versió | Funció |
|------------|--------|--------|
| **PHP** | 8.2+ | Llenguatge del backend |
| **Laravel** | 12.x | Framework PHP |
| **Laravel Passport** | 13.x | Autenticació OAuth2 |
| **Spatie Laravel Permission** | 6.x | Gestió de rols i permisos |

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🚀 Instal·lació ràpida

### Prerequisits

- **Node.js** (versió 18 o superior)
- **npm** o **yarn**
- **Servidor local** (XAMPP, Laravel Serve, etc.)
- **API Backend** funcionant ([Repository Backend](URL_DEL_BACKEND))

### Configuració inicial

1. **Clonar el repositori**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd nsiv_frontend
   ```

2. **Instal·lar dependències**
   ```bash
   npm install
   ```

3. **Configurar variables d'entorn** ⚠️ **IMPORTANT**
   ```bash
   copy .env.example .env
   ```
   
   Editar `.env` amb la URL de la teva API:
   ```properties
   REACT_APP_API_URL=http://localhost/la-teva-carpeta/Sprint5/nsiv_API/public/api
   ```

4. **Iniciar el servidor de desenvolupament**
   ```bash
   npm run dev
   ```

5. **Verificar el funcionament**
   - Obre: `http://localhost:5173`
   - Usa el component **ApiTest** per verificar la connexió amb l'API

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## ⚙️ Configuració d'entorn

### Variables d'entorn

El projecte utilitza variables d'entorn per configurar la URL de l'API backend. Això permet que cada desenvolupador configuri el seu entorn local sense modificar el codi font.

#### Configuració pas a pas

1. **Crear el fitxer d'entorn**
   ```bash
   copy .env.example .env
   ```

2. **Editar el fitxer `.env`**
   ```properties
   # Configura la URL segons el teu entorn local
   REACT_APP_API_URL=http://localhost/la-teva-carpeta/Sprint5/nsiv_API/public/api
   ```

### URLs per entorn

| Entorn | URL d'exemple | Quan utilitzar |
|---------|---------------|----------------|
| **XAMPP Local** | `http://localhost/la-teva-carpeta/Sprint5/nsiv_API/public/api` | Desenvolupament amb XAMPP (port 80) |
| **XAMPP Port 8080** | `http://localhost:8080/la-teva-carpeta/Sprint5/nsiv_API/public/api` | XAMPP en port alternatiu |
| **Laravel Serve** | `http://localhost:8000/api` | Servidor de desenvolupament Laravel |
| **Producció** | `https://el-teu-domini.com/api` | Servidor de producció |

### Verificació de la configuració

1. **Obre al navegador**: `[LA_TEVA_URL]/groups`
2. **Resultat esperat**: 
   - ✅ JSON amb dades o error 401 (autenticació requerida)
   - ❌ Error 404: la URL no és correcta

> **⚠️ Important**: Sempre reinicia el servidor de desenvolupament després de canviar el fitxer `.env`

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 📊 Components de visualització

L'aplicació ofereix tres tipus diferents de gràfics sunburst per visualitzar la jerarquia de verbs:

### InteractiveSunburst
- **Funcionalitat**: Drill-down per nivells amb navegació breadcrumb
- **Característiques**:
  - Navegació per clic a cada segment
  - Breadcrumbs per tornar als nivells anteriors
  - Panel d'informació expandida
  - Etiquetes orientades radialment

### MultiLevelSunburst
- **Funcionalitat**: Vista multinivell amb anells concèntrics
- **Característiques**:
  - Visualització simultània de tots els nivells
  - Anells concèntrics per cada jerarquia
  - Informació rica en hover
  - Colors diferenciats per nivell

### HybridSunburst
- **Funcionalitat**: Combinació de drill-down selectiu i etiquetes horizontals
- **Característiques**:
  - Expansió selectiva de seccions
  - Etiquetes horizontals intel·ligents
  - Transicions suaus
  - Navegació optimitzada

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🔗 Endpoints de l'API

### Endpoints d'usuari

| Mètode | Endpoint | Acció | Autenticació |
|--------|----------|-------|--------------|
| POST | `api/register` | Crear usuari | ❌ No requerida |
| POST | `api/login` | Autenticar usuari | ❌ No requerida |
| POST | `api/logout` | Tancar sessió | ✅ Requerida |
| GET | `api/me` | Obtenir dades pròpies | ✅ Requerida |
| GET | `api/users` | Llistar tots els usuaris | ✅ Requerida |
| GET | `api/users/{id}` | Obtenir usuari específic | ✅ Requerida |
| PUT | `api/users/{id}` | Actualitzar usuari | ✅ Requerida |
| DELETE | `api/users/{id}` | Eliminar usuari | ✅ Requerida |

### Endpoints de verbs

| Mètode | Endpoint | Acció | Dades retornades |
|--------|----------|-------|------------------|
| GET | `api/groups` | Obtenir tots els grups | Grups amb colors |
| GET | `api/groups/{id}` | Obtenir famílies d'un grup | Famílies del grup especificat |
| GET | `api/families` | Obtenir totes les famílies | Famílies amb colors |
| GET | `api/families/{id}` | Obtenir subfamílies d'una família | Subfamílies de la família |
| GET | `api/subfamilies` | Obtenir totes les subfamílies | Subfamílies amb colors |
| GET | `api/subfamilies/{id}` | Obtenir verbs d'una subfamília | Verbs de la subfamília |
| GET | `api/verbs` | Obtenir tots els verbs | Verbs amb detalls complets |
| GET | `api/verbs/{id}` | Obtenir verb específic | Detalls del verb |

> **📝 Notes**: 
> - Tots els endpoints de verbs retornen colors en format hexadecimal per la visualització
> - Les dades estan filtrades segons el nivell de l'usuari autenticat
> - Els endpoints inclouen informació rica (comentaris, descripcions, exemples)

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🧠 Treball amb intel·ligència artificial

Aquest projecte ha estat desenvolupat amb l'assistència de múltiples models d'intel·ligència artificial, documentant el procés per complir amb els requeriments acadèmics.

### Models d'IA utilitzats

| Model | Funció principal | Avantatges identificats |
|-------|------------------|-------------------------|
| **GitHub Copilot (Claude 3.5 Sonnet)** | Desenvolupament principal, refactorització | Excel·lent comprensió de context, suggeriments precisos |
| **Cursor AI** | Generació inicial del projecte | Configuració ràpida de projectes React |
| **ChatGPT 4** | Consultes específiques i depuració | Bones explicacions i resolució de problemes |
| **DeepSeek** | Investigació i comparatives | Anàlisi de millors pràctiques |

### Procés de desenvolupament

1. **Configuració inicial**: Cursor AI per la configuració base de Vite + React
2. **Desenvolupament de components**: GitHub Copilot per components complexos
3. **Integració D3.js**: Combinació de models per visualitzacions avançades
4. **Depuració i optimització**: ChatGPT per resolució de problemes específics
5. **Documentació**: GitHub Copilot per documentació completa

> 📖 **Documentació completa**: Consulta el [registre detallat d'interaccions](./IA_INTERACTIONS.md) per veure el procés complet de desenvolupament amb IA.

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🔧 Resolució de problemes

### Errors comuns d'API

#### ❌ Error d'autenticació 401
```
Error al carregar perfil: Request failed with status code 401
```
**Solucions**:
1. Verifica que has fet login correctament
2. Comprova que el token s'ha guardat a localStorage
3. Usa el component ApiTest per obtenir un token vàlid

#### ❌ Error de connexió "Network Error"
```
Error al carregar perfil: Network Error
```
**Solucions**:
1. Verifica la URL al fitxer `.env`
2. Comprova que el servidor backend està funcionant
3. Obre manualment: `[LA_TEVA_URL]/groups`

#### ❌ Error "Cannot find name 'process'"
```
Cannot find name 'process'. Do you need to install type definitions for node?
```
**Solucions**:
1. Reinicia completament el servidor de desenvolupament
2. Verifica que el fitxer `.env` existeix amb `REACT_APP_API_URL`

### Errors d'importació

#### ❌ Failed to resolve import "react"
```bash
# Reinstal·lar dependències
npm install react react-dom
npm install @vitejs/plugin-react --save-dev

# Verificar vite.config.js
npm run build
```

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 👥 Flux de treball de l'equip

### Per a nous desenvolupadors

1. **Clona el repositori i configura l'entorn**
   ```bash
   git clone [URL_REPO]
   cd nsiv_frontend
   npm install
   copy .env.example .env
   # Edita .env amb la teva URL
   ```

2. **Verifica la connexió**
   ```bash
   npm run dev
   # Usa el component ApiTest per verificar l'API
   ```

### Per a canvis en el projecte

- ✅ **Abans de fer canvis**: Verifica que `.env` està configurat correctament
- ✅ **En trobar problemes d'API**: Comprova primer la configuració d'entorn
- ❌ **No pugis fitxers `.env`**: Estan a .gitignore per seguretat
- 📝 **Documenta canvis**: Actualitza aquest README si cal

### Component ApiTest

El component `ApiTest` inclòs permet:
- ✅ Provar connexions amb diferents URLs d'API
- ✅ Fer login i obtenir tokens d'autenticació
- ✅ Verificar tots els endpoints
- ✅ Diagnosticar problemes de configuració

> **💡 Recomanació**: Usa sempre ApiTest abans de treballar amb altres components

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 📁 Estructura del projecte

```
nsiv_frontend/
├── 📁 public/                  # Fitxers estàtics
│   └── vite.svg
├── 📁 src/                     # Codi font principal
│   ├── 📁 components/          # Components React reutilitzables
│   │   ├── ApiTest.tsx         # Eina de testing d'API
│   │   ├── Auth.tsx            # Gestió d'autenticació
│   │   ├── UsersList.tsx       # Llistat d'usuaris
│   │   ├── UserProfile.tsx     # Perfil i edició d'usuari
│   │   ├── VerbHierarchy.tsx   # Contenidor de gràfics
│   │   ├── InteractiveSunburst.tsx     # Sunburst drill-down
│   │   ├── MultiLevelSunburst.tsx      # Sunburst multinivell
│   │   └── HybridSunburst.tsx          # Sunburst híbrid
│   ├── 📁 config/              # Configuració
│   │   └── api.config.ts       # Configuració d'API
│   ├── 📁 services/            # Serveis i lògica de negoci
│   │   └── api.ts              # Client API amb Axios
│   ├── 📁 types/               # Definicions de tipus TypeScript
│   │   └── api.types.ts        # Tipus per l'API
│   ├── 📁 utils/               # Utilitats auxiliars
│   │   └── apiTestUtils.js     # Utilitats per testing
│   ├── App.tsx                 # Component principal
│   ├── main.tsx                # Punt d'entrada de l'aplicació
│   └── index.css               # Estils globals
├── 📁 Trabajo-sobre-la-ia/     # Documentació IA
│   └── Informe_ia.md          # Informe complet sobre ús d'IA
├── package.json                # Dependències i scripts
├── vite.config.ts             # Configuració de Vite
├── tsconfig.json              # Configuració TypeScript
└── README.md                  # Aquest fitxer
```

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

---

## 🤝 Contribució

Si vols contribuir a aquest projecte:

1. **Fes un fork del repositori**
2. **Crea una branca per la teva funcionalitat**
   ```bash
   git checkout -b feature/nova-funcionalitat
   ```
3. **Fes els teus canvis i commits**
   ```bash
   git commit -m "Afegir nova funcionalitat"
   ```
4. **Puja els canvis**
   ```bash
   git push origin feature/nova-funcionalitat
   ```
5. **Obre una Pull Request**

### Convencions de codi

- Utilitza **TypeScript** per tots els components nous
- Segueix les convencions de **nomenclatura React**
- Documenta les funcions complexes
- Afegeix tests quan sigui possible

---

<div align="center">

**🎓 Projecte desenvolupat per a l'IT Academy - Sprint 5**

*Amb col·laboració d'intel·ligència artificial per l'aprenentatge i desenvolupament*

[⬆️ Tornar a dalt](#frontend-nsiv---visualitzador-de-verbos-jerárquic)

</div>
