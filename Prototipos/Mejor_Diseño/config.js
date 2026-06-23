/* ============================================================
   METCAR — DATOS DE LA EMPRESA  (config.js)
   ------------------------------------------------------------
   ►► ESTE ES EL ÚNICO LUGAR donde se editan los datos de contacto. ◄◄
   Cambiá un valor acá abajo y se actualiza solo en TODAS las
   páginas del sitio (home, catálogo y las que se agreguen).

   Reglas simples:
   - Escribí el valor entre comillas, sin borrar la coma del final.
   - El celular se escribe DOS veces:
       · "cel" = como se ve en pantalla     →  099 414 733
       · "wa"  = el mismo número para WhatsApp, en formato internacional:
                 598 + el número SIN el 0 inicial y SIN espacios  →  59899414733
   - Los mensajes de WhatsApp (waMsg…) son el texto que aparece YA ESCRITO
     cuando el cliente abre el chat — así solo aprieta "enviar" y arranca
     la conversación. Editalos libremente.
   ============================================================ */
window.MC = {
  tel:       '4354-9363',                          // Teléfono fijo
  cel:       '099 414 733',                         // Celular (como se muestra)
  wa:        '59899414733',                         // Mismo celular para WhatsApp (598 + número sin 0, sin espacios)
  email:     'aleravsacul@gmail.com',               // Email de contacto (MODO PRUEBAS — cambiar a info@metcar.com.uy en producción)
  dirCalle:  'Andrés Romero esq. Treinta y Tres',   // Dirección — calle
  dirCiudad: 'Sarandí Grande, Florida',             // Dirección — ciudad / departamento
  horario:   'Lun–Vie 8:00–17:00 · Sáb 8:00–12:00', // Horario de atención

  // ── Mensajes pre-escritos de WhatsApp (editá el texto a gusto) ──
  // En los de producto/búsqueda podés usar estos "campos" entre llaves; se reemplazan solos:
  //   {nombre}  = nombre del producto      {codigo} = código (ej. MC-MH-105)
  //   {medida}  = medidas/specs del producto   {busqueda} = lo que el cliente escribió
  waMsg:         '¡Hola Metcar! Quería hacerles una consulta.',                                  // botones de WhatsApp generales
  waMsgProducto: '¡Hola Metcar! Me interesa este producto: {nombre} (cód. {codigo} · {medida}). ¿Me confirman disponibilidad y precio?',  // al consultar por un producto
  waMsgBusqueda: '¡Hola Metcar! Estoy buscando: {busqueda}. ¿Lo tienen disponible?',              // al buscar algo que no aparece
};

/* Rellena los campos {entre llaves} de un mensaje con los datos del producto.
   (No hace falta tocar esto.) */
window.waMsg = function (tpl, vars) {
  return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) {
    return (vars && vars[k] != null) ? vars[k] : '';
  });
};

/* ============================================================
   De acá para abajo NO hace falta tocar nada.
   Reparte los datos de arriba por toda la página automáticamente.
   ============================================================ */
(function () {
  function apply() {
    var MC = window.MC;
    var waURL = 'https://wa.me/' + MC.wa + '?text=' + encodeURIComponent(MC.waMsg);

    document.querySelectorAll('[data-mc]').forEach(function (el) {
      var k = el.dataset.mc;
      if (k === 'wa-href')       el.href = waURL;                               // link de WhatsApp (con mensaje pre-escrito)
      else if (k === 'tel-href') el.href = 'tel:+598' + MC.tel.replace(/\D/g, ''); // link de llamada
      else if (k === 'mail-href')el.href = 'mailto:' + MC.email;               // link de email
      else if (MC[k] !== undefined) el.textContent = MC[k];                    // texto (cel, tel, email, dirección, horario…)
    });

    // Botones que abren WhatsApp al hacer click (con mensaje pre-escrito)
    document.querySelectorAll('[data-mc-wa]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.open(waURL, '_blank'); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
