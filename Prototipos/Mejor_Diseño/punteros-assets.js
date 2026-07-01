/* ============================================================
   METCAR — ASSETS DE PUNTEROS PARA EL CONFIGURADOR (drop-in, OPCIONAL)
   ------------------------------------------------------------
   Mecanismo para REEMPLAZAR el dibujo vectorial de un terminal por una FOTO
   real en el visualizador, sin tocar el HTML. HOY ESTÁ DESACTIVADO a propósito:
   el visualizador usa render vectorial (coherente con la manguera). Las fotos
   de stock no encajaban con el dibujo, así que se optó por ilustración técnica.

   Si en el futuro hay fotos PROPIAS de Metcar con fondo transparente y el
   estándar correcto (perfil, casquillo a la izquierda, codo hacia arriba),
   descomentar y registrar acá:  "FAM-ANGLE": {src, fh, ar}
   (fh = fracción del alto que ocupa el casquillo; ar = ancho/alto).
   ============================================================ */
window.MC_PUNTERO_ASSETS = {};
