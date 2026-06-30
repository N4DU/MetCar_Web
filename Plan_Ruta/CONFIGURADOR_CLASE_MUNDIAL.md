# Configurador de Mangueras → Clase Mundial · Hoja de ruta

Objetivo: llevar el Configurador (`Prototipos/Mejor_Diseño/Configurador Visual.dc.html`) al nivel
de los mejores configuradores industriales (CEJN, Hydromot, Schwer, Parker) manteniendo la
identidad Metcar. Trabajo **iterativo**: cada ronda analiza todo, elige la mejor mejora, no rompe nada
(Git como red de seguridad), y deja registro acá.

## Decisión de arquitectura de render (evaluada)
| Opción | Realismo | Mantenimiento | Escala (miles SKU) | Veredicto |
|---|---|---|---|---|
| SVG procedural (actual) | medio-alto | alto | excelente | **base elegida** |
| Fotos reales por SKU | alto | bajo | malo | no escala |
| 3D / Three.js | muy alto | bajo | malo | sobre-ingeniería |
| Híbrido SVG + overlay foto opcional | alto | alto | excelente | candidato futuro |

**Conclusión:** mantener procedural; agregar capacidades que los referentes tienen y nosotros no.
El cuerpo de la manguera (SVG pseudo-3D) ya está logrado: NO reemplazar sin mejora clara y verificada.

## Estándar de assets (futuro, para overlay híbrido opcional)
Si algún día se suben fotos de punteros: `img/catalogo/Terminales_Hidraulicos/<CODIGO>.webp`
ya es la convención (ver `terminales.js`). Para que un puntero entre SIN tocar código haría falta
definir: punto de unión (x,y), eje, escala (mm/px), recorte fondo transparente, orientación canónica
(eje horizontal, boca hacia afuera), iluminación arriba-izquierda. → especificar cuando se aborde.

## Iteraciones
### #1 — Orientación relativa entre extremos (clocking)  ✅ implementado
Hueco funcional real vs. referentes (Schwer lo tiene como paso 4). Antes no existía.
- Estado nuevo `endBClock` (0/45/90/135/180), relativo: A es referencia, B se clockea.
- Sección "06 · Orientación entre extremos" que aparece **sólo cuando ambos extremos son codos**.
- Diagrama de sección transversal en vivo (mirando por el eje) + presets.
- Visualizador: escorzo `cos(φ)` del brazo perpendicular del codo B (0=arriba, 180=abajo, 90=de frente).
- Persiste en carrito (`config.endBClock`), refCode (`-R{φ}`), detalle y WhatsApp.
- **A verificar visualmente por el usuario:** el escorzo del codo B en ángulos intermedios (45/90/135).

### Próximas candidatas (sin orden fijo, re-evaluar cada ronda)
- Wizard guiado opcional para usuario novato (reduce carga cognitiva) sin perder el modo experto actual.
- Feedback de validación más rico (presión vs. diámetro, radio mínimo de curvatura).
- Microinteracciones/transiciones del visualizador al cambiar piezas.
- Indicador de longitud total real (cuerpo + terminales) y advertencia de radio de curvatura.
- Drag para clocking continuo (dial) si los presets se quedan cortos.
- Estándar de overlay de foto híbrido (arriba).
