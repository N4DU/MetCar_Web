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

### #2 — Ficha técnica de ingeniería  ✅ implementado
Los configuradores pro (CEJN) muestran datos de ingeniería; nosotros mostrábamos poco. Sube la
sensación de precisión/ingeniería. Cambio sólo de datos/display, cero riesgo al visualizador.
- Datos nuevos en `catalog.gauges` (`dn`, `mbr`=radio mín. curvatura mm) y `catalog.tempRange` por tipo.
- Helpers `workingBar/burstBar(4:1)/bendRadius/tempRange`.
- Bloque "Ficha técnica" en el panel (norma, Ø interior/DN, presión trabajo, presión rotura, radio mín., temperatura).
- Datos de presión/radio agregados al detalle del carrito (viajan en la cotización).
- Valores referenciales SAE 100R (rotura ≈ 4× trabajo; radios estándar por ID).

### #3 — Layout apilado (visualizador arriba, config abajo)  ✅ implementado
El usuario reportó la config "apretada". Se pasó de 2 columnas (panel 420px) a layout vertical:
visualizador hero sticky arriba (48vh), config centrada (max 920px) con aire, Terminales A/B lado a
lado (`.mcfg-ab`), tarjetas de tipo con grid auto-fit, footer resumen centrado. Sólo estructura/estilos.

### #4 — Punteros distintos por familia + drop-in de fotos reales  ✅ implementado
El usuario pidió punteros "reales, distintos por tipo". Análisis: no hay forma de bajar fotos limpias,
transparentes, con licencia y verificables en este entorno (retailers dan 403; stock es pago/marca de
agua; Commons trae fondo). Se resolvió el problema real ("todas las familias se dibujaban igual"):
- `headType(fam)` + `endHead()`: cabeza propia por familia — NPT rosca macho cónica, BRIDA placa SAE
  con agujeros, PUNT nipple escalonado; JIC/BSP/MET/MULTI/ASP mantienen tuerca hex giratoria.
- **Sistema drop-in de fotos** (`punteros-assets.js` + hook en `fitting()`): si existe
  `MC_PUNTERO_ASSETS["FAM-ANGLE"]`, una foto real reemplaza el dibujo de esa familia SIN tocar código.
  Registro vacío por ahora → sin cambios visuales hasta que haya fotos. Estándar documentado en el .js.
- **Pendiente de fotos reales:** conseguir imágenes transparentes que cumplan el estándar (las provee
  el usuario o se buscan fuentes con licencia). El día que existan, entran solas.
- **A verificar por el usuario:** que las cabezas NPT/BRIDA/PUNT se vean bien en recto y en codo.

### #5 — FOTOS REALES de punteros (drop-in funcionando) + de-cramp  ✅ implementado
El usuario insistió (con énfasis) en punteros reales como imágenes. Se logró:
- **Pipeline de imagen** (`scratchpad/process.py`, Python+Pillow): descarga con curl (UA de navegador
  evita el 403), quita fondo blanco por flood-fill desde bordes (no agujerea brillos del cromo),
  recorta, centra el EJE DEL CASQUILLO (`--anchor`), mide `fh` (fracción del casquillo) y `ar` (aspecto),
  exporta WebP transparente. **Verificación visual con la tool Read** (descargar→ver→ajustar→ver).
- **4 assets reales** en `img/configurador/punteros/`: swivel-0/45/90 (hembra giratoria recta/45/90) y
  male-0 (macho NPT). Fuente: fotos de producto de hydraulichosetogo (BigCommerce CDN).
  ⚠ Son de muestra (terceros) — reemplazar por fotos propias de Metcar con el mismo estándar.
- **Registro** `punteros-assets.js`: mapea JIC/BSP/MET/MULTI/ASP × {0,45,90} y NPT-0 a esos assets con
  fh/ar. NPT-45/90, BRIDA, PUNT siguen en dibujo procedural (fallback).
- **Hook en `fitting()`**: escala la foto para que el casquillo ≈ 1.28× el grosor de manguera
  (Hs=fer/fh, Ws=Hs·ar), la centra en el eje, la solapa `ov` sobre la manguera y la espeja en el extremo A.
- **Cómo agregar fotos (proceso):** `python process.py <in> <out.webp> --thresh N [--rotate g] [--flip] [--flipv] --anchor`
  → imprime fh/ar → pegar línea en `punteros-assets.js`. Estándar: perfil, casquillo IZQ, boca DER, codo ARRIBA, fondo transparente.
- **De-cramp:** padding de secciones 20→28px vert / 24→32px horiz, ficha técnica y nombre con más aire,
  visualizador 48→44vh para dar más espacio a la config.
- **A verificar por el usuario:** que las fotos se vean bien pegadas a la manguera en el navegador real
  (con la manguera SVG detallada, no el mock), en distintos diámetros; y que ya no se sienta apretado.

### Próximas candidatas (sin orden fijo, re-evaluar cada ronda)
- Conseguir/tomar fotos propias de Metcar (reemplazar las de muestra) y sumar BRIDA, PUNT, NPT codo.
- Wizard guiado opcional para usuario novato (reduce carga cognitiva) sin perder el modo experto actual.
- Microinteracciones/transiciones del visualizador al cambiar piezas.
- Indicador de longitud total real (cuerpo + terminales).
- Drag para clocking continuo (dial) si los presets se quedan cortos.
- Estándar de overlay de foto híbrido (arriba).
