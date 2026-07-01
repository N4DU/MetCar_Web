/* ============================================================
   METCAR — ASSETS DE PUNTEROS PARA EL CONFIGURADOR (drop-in)
   ------------------------------------------------------------
   Este registro permite REEMPLAZAR el dibujo procedural de un terminal
   por una FOTO REAL en el visualizador del configurador, SIN tocar código.

   ►► Cómo agregar una foto:
   1) Preparala siguiendo el ESTÁNDAR de abajo (fondo transparente).
   2) Guardala en:  img/configurador/punteros/<FAM>-<ANGLE>.webp
      FAM   = id de familia (JIC, BSP, NPT, MET, MULTI, ASP, BRIDA, PUNT)
      ANGLE = 0 (recto) · 45 · 90
      Ej:  img/configurador/punteros/JIC-90.webp
   3) Agregá una línea acá en `assets` con la misma clave "FAM-ANGLE".
      (Es la única línea de código; el resto es automático.)

   ►► ESTÁNDAR DE IMAGEN (para que entre sin ajustes)
   - Fondo TRANSPARENTE (PNG/WebP con alpha). Nada de fondo blanco.
   - Orientación CANÓNICA: terminal horizontal, la BOCA/rosca apuntando a la
     DERECHA y el casquillo de prensado (unión a la manguera) a la IZQUIERDA.
     (El configurador espeja solo para el extremo A.)
   - El casquillo debe tocar el BORDE IZQUIERDO de la imagen (ahí se une la manguera).
   - Eje del terminal alineado al CENTRO VERTICAL de la imagen.
   - Para codos (45/90): el codo apunta HACIA ARRIBA (12 en punto).
   - Iluminación desde arriba-izquierda, coherente con el resto de la escena.
   - Recorte ajustado (mínimo margen). Resolución sugerida: alto ~360px, WebP.

   NOTA: con foto real, la "orientación relativa entre codos" (clocking) no se
   puede reescorzar en 3D; se usa la foto tal cual. El dibujo procedural sí clockea.
   ============================================================ */
window.MC_PUNTERO_ASSETS = {
  // "JIC-0":  "img/configurador/punteros/JIC-0.webp",
  // "JIC-90": "img/configurador/punteros/JIC-90.webp",
  // ...agregar acá a medida que existan fotos que cumplan el estándar.
};
