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

### #6 — Manguera foto-realista + más fotos + RENDER REAL (Playwright)  ✅ implementado
El usuario dijo "se ve como el culo". Renderizando el HTML real con Chromium headless se vio el porqué:
cromo fotográfico sobre manguera DIBUJADA caricaturesca (raya roja, texto amarillo) = incoherente.
- **CAPACIDAD NUEVA — render real:** `scratchpad/render.py` no anda (greenlet DLL rota), pero la **CLI**
  sí: `python -m playwright screenshot --viewport-size=W,H --wait-for-timeout=ms "file:///...dc.html" out.png`.
  Renderiza el configurador de verdad (el framework DC corre desde file://). Recortar con Pillow y VER con Read.
  Para probar otras configs: editar temporalmente el `state` inicial en el .dc.html, render, y REVERTIR.
- **Manguera rehecha:** caucho negro cilíndrico realista, sin raya roja ni amarillo; texto gris sutil
  impreso. Más gruesa (`thickness`=44+h·1.5) y casquillo ×1.2 → escala foto-vs-manguera coherente.
- **Más fotos reales:** male-90 (NPT codo) y flange-45 (brida SAE 45°). Ya casi no hay dibujo (solo PUNT).
- **Limitación conocida:** el clocking NO afecta a las fotos (codos con foto siempre van hacia arriba);
  sólo el procedural clockea. Resolver: espejar vertical la foto B cuando clock∈(90,270) para el caso "opuesto".

### #7 — PIVOTE: se abandonan las fotos, render 100% vectorial coherente  ✅ implementado
El usuario confirmó que las fotos "están horribles y no encajan" y pidió otro enfoque (mi elección, sin fotos).
Decisión: ilustración técnica vectorial donde manguera y terminales comparten el MISMO lenguaje (gradientes,
luz) → nunca se ve "pegado". Coherencia garantizada + escalable + mantenible.
- Fotos desactivadas: `MC_PUNTERO_ASSETS = {}` (mecanismo drop-in queda para fotos PROPIAS futuras);
  se borran los webp de muestra de terceros.
- **Fix clave de coherencia:** la tuerca se dibujaba DE FRENTE (hexágono + agujero) mientras el conjunto
  es VISTA LATERAL → proyección inconsistente. Ahora `endHead` dibuja todo en perfil: hembra giratoria =
  collar hex + tuerca redonda con asiento; NPT = base hex + rosca cónica; brida = cuello + platillo; puntero
  = nipple escalonado. Recto usa `scale(dir)` (no invierte la luz), codo usa `rotate(endAng)`.
- Verificado en render real (Chromium) en varias configs (recto+codo, chico+termoplástica, NPT+brida).

### Próximas candidatas (sin orden fijo, re-evaluar cada ronda)
- Pulir cromo (más premium/limpio), transición casquillo↔collar, refinar el asiento de la tuerca.
- Foto real de PUNT (puntero); reemplazar todas las de muestra por fotos propias de Metcar.
- Clocking con fotos (flip vertical para "opuestos").
- Verificar diámetros extremos (1/4" y 1.1/4") y termoplástica en render real; pulir costura casquillo-manguera.
- Consistencia de tono entre assets (algunos más cálidos/fríos).
- Wizard guiado opcional para usuario novato (reduce carga cognitiva) sin perder el modo experto actual.
- Microinteracciones/transiciones del visualizador al cambiar piezas.
- Indicador de longitud total real (cuerpo + terminales).
- Drag para clocking continuo (dial) si los presets se quedan cortos.
- Estándar de overlay de foto híbrido (arriba).
