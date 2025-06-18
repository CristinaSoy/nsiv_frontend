# Instrucciones para migrar y depurar el gráfico Sunburst de grupos

## 1. Estado actual
- El frontend recibe correctamente los datos de los grupos desde la API.
- El componente `VerbHierarchy` muestra el panel de depuración y el texto "Test SunburstChart".
- El componente `SunburstChart` no muestra el gráfico ni logs de D3, pero sí puede mostrar un texto SVG fijo si se añade manualmente.

## 2. Archivos clave
- `src/components/VerbHierarchy.tsx`: Contenedor que obtiene los datos y renderiza el gráfico.
- `src/components/SunburstChart.tsx`: Componente que debería renderizar el gráfico Sunburst usando D3.

## 3. Pasos para depurar en el nuevo equipo

1. **Verifica que los datos llegan bien**
   - El panel de depuración debe mostrar los grupos correctamente.
   - El array de grupos debe tener 3 elementos.

2. **Comprueba el renderizado del SVG**
   - El texto "Test SunburstChart" debe aparecer sobre el área del gráfico.
   - El texto azul "SVG Renderizado" debe aparecer en el centro del SVG (esto comprueba que el SVG se monta).

3. **Si el SVG aparece pero no el gráfico:**
   - El problema está en la lógica de D3 dentro de `SunburstChart.tsx`.
   - Revisa los logs de consola que se añaden en el useEffect de ese componente.
   - Si no aparecen logs de D3, asegúrate de que el useEffect se ejecuta y que el array de datos no está vacío.

4. **Si no aparece el SVG:**
   - El problema está en el renderizado de React o en el propio JSX del SVG.

## 4. Sugerencias para depuración
- Añade logs en el useEffect de `SunburstChart` para ver si se ejecuta.
- Añade un `<text>` SVG fijo para comprobar el renderizado.
- Comprueba que D3 y sus tipos están correctamente instalados (`d3` y `@types/d3`).
- Si el gráfico sigue sin aparecer, prueba a renderizar un círculo SVG simple para descartar problemas de D3.

## 5. Contacto
Si necesitas ayuda, comparte:
- El contenido del panel de depuración
- Los logs de consola
- Una captura de pantalla del área del gráfico

¡Suerte con la migración y seguimos depurando cuando estés listo! 