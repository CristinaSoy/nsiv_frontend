# Configuración del Proyecto

## Variables de Entorno

Para que el proyecto funcione correctamente en tu entorno local, necesitas configurar la URL de tu API.

### Configuración Rápida

1. **Copia el archivo de ejemplo:**
   ```bash
   copy .env.example .env
   ```

2. **Edita el archivo `.env` con tu configuración:**
   ```
   REACT_APP_API_URL=http://localhost/itacademy/Sprint5/nsiv_API/public/api
   ```

### URLs Comunes según tu entorno:

#### XAMPP (puerto 80)
```
REACT_APP_API_URL=http://localhost/itacademy/Sprint5/nsiv_API/public/api
```

#### XAMPP (puerto 8080)
```
REACT_APP_API_URL=http://localhost:8080/itacademy/Sprint5/nsiv_API/public/api
```

#### Laravel Serve
```
REACT_APP_API_URL=http://localhost:8000/api
```

#### Otras configuraciones
```
REACT_APP_API_URL=http://localhost:3000/api
```

### ¿Cómo saber cuál usar?

1. **Verifica que tu servidor backend esté corriendo**
2. **Abre en el navegador:** `http://localhost/itacademy/Sprint5/nsiv_API/public/api/groups`
3. **Si ves JSON o un error de autenticación:** ✅ URL correcta
4. **Si ves error 404:** ❌ Cambia la URL en el `.env`

### Después de cambiar el .env

1. **Detén el servidor de desarrollo** (Ctrl+C)
2. **Reinicia el servidor:**
   ```bash
   npm start
   ```

### Notas Importantes

- ⚠️ **El archivo `.env` NO se debe subir a Git** (ya está en .gitignore)
- ✅ **Cada desarrollador puede tener su propia configuración**
- 🔄 **Siempre reinicia el servidor después de cambiar el .env**
