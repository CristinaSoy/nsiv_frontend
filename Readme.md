## Enunciat

### Desenvolupar

**Nivell 1** client frontend amb React

**Nivell 2** connectar frontend amb api

**Nivell 3** deckeritzar l'Api o l'entrega de nivell 1


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

2) Instalar dependencias principales
```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

3) Instalar D3.js para los gráficos
```bash
npm install d3
```

4) Crear la estructura de carpetas
```bash
mkdir src\components 
mkdir src\pages 
mkdir src\services 
mkdir src\hooks 
mkdir src\contexts
```

5) Instalar todas las dependencias del proyecto
```bash
npm install
```

6) Levantar el servidor de desarrollo
```bash
npm run dev
```

7) Verificar que la aplicación funciona en:
http://localhost:5173

### Notas importantes:
- Asegúrate de que Node.js está instalado en el sistema
- Si hay problemas con los permisos en Windows, ejecuta PowerShell como administrador
- Si el servidor no inicia, verifica que el puerto 5173 no está en uso
- Si hay errores de importación, verifica que todos los archivos tienen la extensión correcta (.jsx para archivos con JSX)



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

7) Creación de páginas principales
- `Home.jsx`: Página principal con la estructura básica de la aplicación
- Implementación de la visualización de datos con el componente SunburstChart

8) Configuración de estilos
- Creación de archivos CSS para cada componente
- Implementación de estilos responsivos y modernos

9) Configuración del punto de entrada
- Modificación de `main.jsx` para renderizar la aplicación React
- Configuración del enrutamiento básico

10) Pruebas iniciales
- Verificación de la compilación del proyecto
- Comprobación del funcionamiento del servidor de desarrollo
- Pruebas de los componentes implementados

## Interacciones con la IA

### Registro de Interacciones Significativas

1. **Configuración Inicial del Proyecto**
   - Selección de Vite como herramienta de construcción
   - Configuración de la estructura del proyecto
   - Resolución de problemas de importación de React

2. **Desarrollo de Componentes**
   - Creación del componente Button con estilos personalizados
   - Implementación del SunburstChart con D3.js
   - Integración de componentes en la página principal

3. **Resolución de Problemas**
   - Solución de errores de importación de React
   - Configuración correcta de Vite
   - Optimización de dependencias

### Análisis del Código Generado
- Los componentes siguen las mejores prácticas de React
- Implementación de hooks para manejo de estado y efectos
- Uso de D3.js para visualización de datos complejos

### Proceso de Aprendizaje
- Adaptación de conceptos de React para principiantes
- Integración de bibliotecas externas (D3.js)
- Implementación de patrones de diseño modernos

## Documentación Adicional

### Interacciones con la IA
Para ver el registro detallado de las interacciones con la IA y los problemas resueltos, consulta el archivo [IA_INTERACTIONS.md](./IA_INTERACTIONS.md).

### Resolución de Problemas Comunes

#### Errores de Importación de React
Si encuentras errores como:
```
Failed to resolve import "react" from "src/pages/Home.jsx"
```

Ejecuta los siguientes comandos:
```bash
npm install react react-dom
npm install @vitejs/plugin-react --save-dev
```

Luego, asegúrate de que tu `vite.config.js` contenga:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

#### Optimización de Dependencias
Si necesitas optimizar las dependencias:
```bash
npm run build
```