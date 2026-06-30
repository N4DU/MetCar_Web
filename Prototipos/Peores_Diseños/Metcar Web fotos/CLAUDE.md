# Metcar Web — mapa del proyecto

Sitio/catálogo industrial de **Metcar Uruguay** (insumos hidráulicos). Venta por
cotización (sin precios públicos ni pago online); canal primario WhatsApp.

## Producto vivo — `Prototipos/Mejores_Disenos/`
TODO el sitio funcional vive acá. Es la única fuente de verdad. Páginas:
- `metcar_homepage_v5.html` — **home / entry point**, diseño de referencia más avanzado
- `catalogo.html` — catálogo (render por JS desde `catalog-data.js`)
- `Configurador Visual.dc.html` — configurador de mangueras a medida (el que enlaza todo el sitio)
- `carrito.html` — carrito de cotización
- `mi-cuenta.html` — cuenta del cliente / edición de pedidos
- `sobre-nosotros.html`, `login.html`, `registro.html`
- `admin.html` — panel interno (Patricia): pedidos, catálogo, precios, taller

Módulos JS compartidos: `cart.js`, `catalog-data.js`, `terminales.js`, `config.js`,
`auth.js`, `admin.js`, `admin-ui.js`. Imágenes en `Prototipos/Mejores_Disenos/img/`.
Editá datos de contacto en `config.js`, terminales en `terminales.js`.

## Diseño / referencia (raíz)
- `_ds/metcar-design-system-…/` — **design system Metcar** (cargar el bundle al crear DCs)
- `METCAR_ESPECIFICACIONES_PROYECTO.txt` — spec maestro de requisitos
- `AUDITORIA_METCAR.txt` — auditoría técnica (problemas + fixes priorizados)
- `ANALISIS_FLUJO_CLIENTE.txt` — análisis del flujo de compra real
- `Configurador Mangueras - Documento Maestro v2.dc.html` — deck de diseño del configurador (35+ slides)
- `support.js` — runtime de Design Components (no tocar)

## Notas
- Repo de referencia: https://github.com/LucasVarelaCarreras/MetCar_Web
- Voseo uruguayo siempre ("elegís", "configurás"). Sin emoji en UI.
