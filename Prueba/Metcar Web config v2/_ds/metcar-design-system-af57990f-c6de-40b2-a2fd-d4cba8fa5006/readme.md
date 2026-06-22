# Metcar Design System

> **Rojo Metcar · Negro Industrial · Amarillo Manguera · Bebas Neue como voz**

Metcar Uruguay es un importador y distribuidor de insumos hidráulicos e industriales con sede en Sarandí Grande, Florida, Uruguay. Fundada en 2014, opera en todo el territorio nacional: venta por WhatsApp, envíos en 24–48h y giras mensuales al interior del país. Su catálogo cubre mangueras hidráulicas SAE, terminales/fittings, discos de corte, herramientas de torno, gatos hidráulicos y prensas.

**Fuentes usadas para construir este sistema:**
- Brand system HTML: `uploads/metcar_brand_system.html` (proporcionado por el equipo)
- Repositorio principal: **https://github.com/LucasVarelaCarreras/MetCar_Web** — el diseño de referencia más avanzado está en `Prototipos/Mejores_Diseños/metcar_homepage_v5.html`
- Logo original: `assets/logoMetcar.webp` / `assets/logoMetcar.png`
- Foto hero: `assets/heroBackground.webp` (depósito Metcar, estilo "modo taller")

---

## Contexto de productos

Un único producto digital: el **sitio web de Metcar** (`metcar.uy`). Es una tienda/catálogo industrial con:
- **Homepage** con hero de pantalla completa, catálogo por categorías, configurador de mangueras, productos destacados, cobertura nacional y testimonios
- **Configurador** paso a paso (tipo · diámetro · largo · terminal A · terminal B)
- Canal de venta primario: **WhatsApp** (+598 92 195 010)

---

## CONTENT FUNDAMENTALS

### Voz y tono
- **Directa, técnica, confiable.** El cliente es un mecánico, encargado de taller o productor agropecuario. Sabe lo que necesita; Metcar le habla de igual a igual.
- **"Vos" siempre**, nunca "usted" ni "tú". Uruguay habla en voseo: "elegís", "configurás", "recibís".
- **Sin floreos.** Cada frase tiene un trabajo específico. Si no aporta información o acción, no va.
- **Español uruguayo.** "Manguera", "taller", "gira", "encomienda", "departamentos". Sin anglicismos innecesarios.
- Números técnicos como protagonistas: `225 BAR`, `SAE 100R2AT`, `1/2"`. No se esconden en el texto secundario — son el headline.
- Mayúsculas sostenidas para specs y badges (el "idioma" de la manguera impresa), title case para títulos de sección, oración normal para cuerpo.
- CTA examples: **"Ver catálogo" · "Configurar manguera" · "Solicitar cotización" · "Contactar por WhatsApp"**
- No se usan emoji en la UI. WhatsApp Business puede usarlos con moderación en mensajes directos.

### Casing
| Contexto | Convención |
|---|---|
| Hero H1 / Display | TODO MAYÚSCULAS (Bebas Neue) |
| Section eyebrow | TODO MAYÚSCULAS, Barlow Condensed |
| Section title | Title Case, Bebas Neue |
| Body copy | Oración normal |
| Badges/specs | TODO MAYÚSCULAS |
| Botones | TODO MAYÚSCULAS |

---

## VISUAL FOUNDATIONS

### Paleta de colores
| Token | Hex | Rol |
|---|---|---|
| `--mc-red` / `--color-brand` | `#B83214` | Logo, CTAs, toda acción primaria |
| `--mc-black` / `--surface-black` | `#0B0B0B` | Fondos de specs, navbar anchor, hose-code base |
| `--mc-yellow` / `--color-accent` | `#F5C518` | Texto técnico sobre negro ("Hose Yellow") |
| `--mc-yellow-dim` | `#8A7010` | Sub-etiquetas sobre negro, stock agotado |
| `--mc-steel` | `#68686A` | Texto secundario, bordes, iconos |
| `--mc-offwhite` / `--surface-page` | `#F4F2EC` | Fondo principal — cálido, no frío |
| `--mc-dark-iron` / `--surface-dark` | `#1B1916` | Footer, secciones oscuras, paneles |
| `--mc-dark-iron-2` / `--surface-darker` | `#131110` | Base del hero |

**Combinaciones correctas:**
- Rojo + negro = fuerza máxima (logo, CTA sobre fondo oscuro)
- Negro + amarillo = lenguaje técnico (hose code, spec badges)
- Rojo sobre off-white = acción principal en secciones claras
- **Prohibidas:** rojo sobre amarillo · amarillo sobre off-white

### Tipografía
| Familia | Rol | Token |
|---|---|---|
| **Bebas Neue** | Display — titulares, números técnicos gigantes | `--font-display` |
| **Barlow** | Body — párrafos, formularios, cuerpo | `--font-body` |
| **Barlow Condensed Bold** | Técnico — specs, badges, botones, labels | `--font-tech` |

Las tres familias están en Google Fonts. No se necesitan archivos locales.
`JetBrains Mono` se usa para `--font-mono` (códigos de referencia, hex); requiere carga manual.

### Fondos y superficies
- **Claro:** Off-White `#F4F2EC` (secciones de contenido) o Blanco puro (tarjetas, formularios)
- **Oscuro:** Dark Iron `#1B1916` (secciones de feature, configurador, footer)
- **Más oscuro:** `#131110` (hero, fondo de hose-code)
- **Sin gradientes decorativos.** El único gradiente intencional es el cuerpo del HoseStrip (efecto manguera cilíndrica).
- Fotografía: **"modo taller"** — fondo negro absoluto, iluminación lateral dramática, producto como protagonista. Ver `assets/heroBackground.webp`.
- La fotografía en el hero usa un blur lateral (`backdrop-filter: blur(7px)`) con un mask que desvanece el texto sobre la imagen.

### La "Banda de Presión" (Pressure Band)
Una franja roja horizontal de 2px de alto es el elemento de diseño recurrente: aparece en el borde superior del footer, como subrayado animado en hover de tarjetas y testimonios, como acento en cards. Siempre roja, siempre Metcar.

### El "Hose Code" — la firma visual central
Las mangueras hidráulicas reales llevan texto técnico impreso en amarillo sobre negro. Metcar adopta esa superficie como lenguaje de marca:
- `HoseStrip` component: gradiente cilíndrico oscuro + banda roja lateral + texto `Barlow Condensed 700` amarillo con tracking amplio
- `SpecBadge`: negro + amarillo, Barlow Condensed, pill 4px — el fragmento de hose code más pequeño posible
- Números de presión enormes en Bebas Neue rojo como elementos gráficos de fondo

### Bordes y radios
- **Casi cuadrado.** Radio máximo normal: `2px` (tarjetas, inputs). `1px` para botones y badges estándar. `4px` para pills de spec. `999px` solo para dots de stock y avatars.
- Bordes muy sutiles: `0.5px solid rgba(27,25,22,.09)` sobre superficies claras; `rgba(255,255,255,.07)` sobre oscuras.
- La "Pressure Band" entra como borde bottom `2px solid #B83214` animado con `scaleX` en hover.

### Sombras
- Mínimas. `--shadow-card` apenas perceptible. `--shadow-lift` solo en hover de tarjetas.
- Paneles flotantes (menú mobile, dropdown): `--shadow-panel` más dramático sobre fondo oscuro.
- Sin caja de sombra en la mayoría de elementos estáticos — la estructura habla sola.

### Motion y animaciones
- Entrada estándar: `fadeUp` 0.65s con `cubic-bezier(0.22, 1, 0.36, 1)` (la ease de marca).
- Transiciones interactivas: `0.16s ease` (fast) / `0.28s ease` (base).
- Press/click: `transform: scale(0.98)`, `0.1s ease`.
- Hover de tarjetas: `translateY(-2px)` suave.
- La "Pressure Band" bottom-border: `scaleX(0 → 1)` con `transform-origin: left`.
- El dot "EN STOCK": `opacity pulse 2s ease-in-out infinite`.
- Sin looping decorativo. Sin bouncing. El movimiento es funcional.

### Hover / press states
- **Botón primary hover:** red más oscuro `#9E2810`
- **Botón ghost hover (light):** borde → rojo, texto → rojo
- **Botón ghost hover (dark):** borde → blanco 45%, texto → blanco
- **Tarjeta hover:** translateY(-2px) + borde más marcado + pressure band scaleX
- **Nav links hover:** texto → blanco + subrayado sutil
- **Press:** scale(0.98)

### Iconografía
Ver sección **ICONOGRAPHY** más abajo.

### Layout
- Max-width: `1160px` centrado con `--layout-gutter: 32px` de padding lateral.
- Grids: 3 cols para categorías, 4 cols para productos, 2 cols para feature sections. `gap: 14px`.
- Secciones alternas: off-white → blanco → dark iron → off-white... Ritmo intencional de "oscuro y claro".
- Navbar sticky: `62px` de alto, fondo Dark Iron, borde inferior sutil.
- Footer: borde superior `3px solid #B83214` (la pressure band en macro).

### Imágenes
- Fotografía de producto: fondo negro absoluto, iluminación dramática lateral. Nunca fondo blanco genérico.
- Color vibe: oscuro, contrastes altos, tonos cálidos (hierro, acero, petróleo). No frío, no azulado.
- Sin grain artificial — la textura viene de los materiales reales.

---

## ICONOGRAPHY

- **Sistema primario:** SVG inline sin sistema externo. Los iconos del homepage están todos dibujados inline con `stroke="currentColor"`, `stroke-width 1.5–2`, `stroke-linecap="round"`, sin fill. Estilo: **Lucide-compatible** (misma gramática de trazo).
- **Sin icon font.** Sin sprite sheet. Los SVG se insertan directamente o como componentes React.
- **Tamaño estándar:** 16px en nav/botones, 24–32px en feature items, 40px en cards de categoría.
- **Color:** `currentColor` — hereda del contexto (rojo en secciones de acción, blanco semi-transparente en navbar, gris en secundarios).
- **WhatsApp** tiene su propio SVG de marca (`fill="currentColor"`) — no reemplazar con Lucide.
- **Sin emoji** en la UI de producto.
- El **fitting hidráulico** del logo (círculos concéntricos) es el isotipo de la marca. Puede usarse solo como favicon, sello, ícono de WhatsApp Business. No rediseñar.

**Lucide CDN** (si se necesita expandir el set):
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```

---

## ARCHIVOS DISPONIBLES

```
Metcar Design System/
├── styles.css                    ← entrada global (solo @imports)
├── tokens/
│   ├── fonts.css                 ← Google Fonts import
│   ├── colors.css                ← paleta completa + aliases semánticos
│   ├── typography.css            ← escala tipográfica y familias
│   ├── spacing.css               ← espaciado, radios y layout
│   └── effects.css               ← sombras, motion, Hose Code gradient, keyframes
├── assets/
│   ├── logoMetcar.webp           ← logo principal (transparente, sobre oscuro)
│   ├── logoMetcar.png            ← logo PNG alternativo
│   └── heroBackground.webp      ← foto del depósito ("modo taller")
├── components/
│   ├── buttons/
│   │   ├── Button.jsx / .d.ts / .prompt.md
│   │   ├── IconButton.jsx / .d.ts / .prompt.md
│   │   └── buttons.card.html    ← @dsCard "Buttons"
│   └── brand/
│       ├── SpecBadge.jsx / .d.ts / .prompt.md   ← hose code en miniatura
│       ├── CategoryTag.jsx / .d.ts / .prompt.md
│       ├── StockIndicator.jsx / .d.ts / .prompt.md
│       ├── HoseStrip.jsx / .d.ts               ← la superficie firma
│       └── brand.card.html      ← @dsCard "Brand Language"
└── readme.md                    ← este archivo
```

### Componentes disponibles (namespace: `MetcarDesignSystem_af5799`)

| Componente | Directorio | Descripción |
|---|---|---|
| `Button` | `components/buttons` | CTA industrial, 4 variantes + 3 tamaños |
| `IconButton` | `components/buttons` | Icono cuadrado para navbar/toolbar |
| `SpecBadge` | `components/brand` | Spec negro+amarillo — "1/2" · 225 BAR" |
| `CategoryTag` | `components/brand` | Etiqueta roja de categoría |
| `StockIndicator` | `components/brand` | EN STOCK pulsante / SIN STOCK |
| `HoseStrip` | `components/brand` | Superficie hose-code completa |

---

## Para consumidores de este sistema

```html
<link rel="stylesheet" href="path/to/styles.css">
<script src="path/to/_ds_bundle.js"></script>
<script type="text/babel">
const { Button, HoseStrip, SpecBadge } = window.MetcarDesignSystem_af5799;
</script>
```

Para el repositorio de referencia y explorar el diseño más avanzado disponible:
👉 https://github.com/LucasVarelaCarreras/MetCar_Web
