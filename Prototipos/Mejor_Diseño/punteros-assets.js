/* ============================================================
   METCAR — ASSETS DE PUNTEROS PARA EL CONFIGURADOR (fotos reales)
   ------------------------------------------------------------
   Reemplaza el dibujo procedural de un terminal por una FOTO REAL en el
   visualizador, sin tocar el HTML del configurador.

   Cada entrada "FAM-ANGLE":
     src → ruta de la foto (WebP con fondo transparente)
     fh  → fracción del ALTO de la imagen que ocupa el CASQUILLO (para escalar
           el terminal al grosor de la manguera). La mide el pipeline de imagen.
     ar  → aspecto de la imagen (ancho/alto).

   ►► Cómo agregar/actualizar una foto (drop-in):
   1) Foto de perfil, casquillo a la IZQUIERDA, boca a la DERECHA, codos hacia
      ARRIBA, fondo transparente (ver proceso en Plan_Ruta/CONFIGURADOR_CLASE_MUNDIAL.md).
   2) Guardala en img/configurador/punteros/ y agregá/edita su línea acá.
   El configurador la espeja solo para el extremo A y la escala con fh/ar.

   NOTA: las fotos NO se pueden reescorzar en 3D, así que la "orientación
   relativa entre codos" (clocking) sólo aplica al dibujo procedural.

   ⚠ Las fotos actuales son de muestra (terceros) para validar el sistema.
   Reemplazalas por fotos propias de Metcar siguiendo el mismo estándar.
   ============================================================ */
(function(){
  var P = "img/configurador/punteros/";
  var swivel0  = { src:P+"swivel-0.webp",  fh:0.959, ar:2.072 };  // hembra giratoria recta
  var swivel45 = { src:P+"swivel-45.webp", fh:0.462, ar:1.503 };  // hembra giratoria codo 45°
  var swivel90 = { src:P+"swivel-90.webp", fh:0.378, ar:0.869 };  // hembra giratoria codo 90°
  var male0    = { src:P+"male-0.webp",    fh:0.978, ar:2.219 };  // macho NPT recto
  var male90   = { src:P+"male-90.webp",   fh:0.316, ar:0.803 };  // macho NPT codo 90°
  var flange45 = { src:P+"flange-45.webp", fh:0.369, ar:1.406 };  // brida SAE codo 45°

  var A = {};
  // Familias de tuerca giratoria (JIC/BSP/métrico/multiasiento/ASP): muy parecidas en la realidad.
  ["JIC","BSP","MET","MULTI","ASP"].forEach(function(f){
    A[f+"-0"]  = swivel0;
    A[f+"-45"] = swivel45;
    A[f+"-90"] = swivel90;
  });
  A["NPT-0"]  = male0;
  A["NPT-90"] = male90;
  A["BRIDA-45"] = flange45;
  // PUNT-* aún sin foto → usa el dibujo procedural (nipple).

  window.MC_PUNTERO_ASSETS = A;
})();
