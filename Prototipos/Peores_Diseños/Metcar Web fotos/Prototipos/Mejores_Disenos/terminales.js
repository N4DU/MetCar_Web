/* ============================================================
   METCAR — TERMINALES / PUNTEROS  (terminales.js)
   ------------------------------------------------------------
   ►► FUENTE ÚNICA de los terminales hidráulicos. ◄◄
   Editá la lista de abajo y se actualiza solo en LOS DOS lados:
     · El catálogo (categoría "Terminales")
     · El configurador de mangueras (extremos A y B)

   Cada terminal:
     code     → código de catálogo (MC-TH-###)
     fam      → familia de rosca (id corto). Agrupa los extremos en el configurador.
     famLabel → cómo se muestra la familia (ej. "JIC 74°")
     name     → nombre completo para el catálogo
     angle    → 0 (recto) · 45 · 90  — la orientación del codo
     size     → medida nominal (solo informativa para el catálogo)
     stock    → true / false
     end      → true: sirve como extremo de manguera (aparece en el configurador)
                false: solo catálogo (ej. adaptadores) — NO aparece en el configurador

   FOTO DEL PUNTERO (automática, sin tocar este archivo):
     Subí la imagen nombrada con el CÓDIGO del terminal a:
       img/catalogo/Terminales_Hidraulicos/<CODIGO>.webp   (o .png)
     Ej: img/catalogo/Terminales_Hidraulicos/MC-TH-209.webp
     El catálogo la toma sola. Si no hay foto, usa el ícono genérico.
     (Opcional: campo img:'ruta' para forzar otra ruta puntual.)
   ============================================================ */
window.MC_TERMINALES = {
  angleLabel: { 0: 'Recto', 45: 'Codo 45°', 90: 'Codo 90°' },
  items: [
    { code:'MC-TH-201', fam:'JIC', famLabel:'JIC 74°',     name:'Terminal JIC 74° hembra giratoria', angle:0,  size:'1/4"', stock:true,  end:true },
    { code:'MC-TH-202', fam:'JIC', famLabel:'JIC 74°',     name:'Terminal JIC 74° hembra giratoria', angle:0,  size:'3/8"', stock:true,  end:true },
    { code:'MC-TH-203', fam:'JIC', famLabel:'JIC 74°',     name:'Terminal JIC 74° hembra · codo 90°', angle:90, size:'1/2"', stock:true,  end:true },
    { code:'MC-TH-204', fam:'BSP', famLabel:'BSP 60°',     name:'Terminal BSP 60° hembra giratoria', angle:0,  size:'1/2"', stock:true,  end:true },
    { code:'MC-TH-205', fam:'BSP', famLabel:'BSP 60°',     name:'Terminal BSP 60° hembra · codo 45°', angle:45, size:'3/8"', stock:true,  end:true },
    { code:'MC-TH-206', fam:'NPT', famLabel:'NPT',         name:'Terminal NPT macho fijo', angle:0,  size:'1/4"', stock:false, end:true },
    { code:'MC-TH-207', fam:'MET', famLabel:'Métrico 24°', name:'Terminal métrico 24° serie liviana', angle:0,  size:'M16', stock:true,  end:true },
    { code:'MC-TH-208', fam:'ADP', famLabel:'Adaptador',   name:'Adaptador JIC macho – BSP macho', angle:0,  size:'1/2"', stock:true,  end:false },
    { code:'MC-TH-209', fam:'NPT', famLabel:'NPT',         name:'Terminal NPT 3/4" hembra giratoria · codo 90°', angle:90, size:'1"', stock:true, end:true },

    /* ── Altas del catálogo físico (28-06) ── */
    { code:'MC-TH-210', fam:'MET',   famLabel:'Métrico',           name:'Terminal hembra métrica · codo 90° · 3/8" – 18 mm',        angle:90, size:'3/8"', stock:true, end:true },
    { code:'MC-TH-211', fam:'MET',   famLabel:'Métrico',           name:'Terminal hembra métrica giratoria · 3/8" – 14 mm',         angle:0,  size:'3/8"', stock:true, end:true },
    { code:'MC-TH-212', fam:'JIC',   famLabel:'JIC 74°',           name:'Terminal JIC 74° hembra · codo 45° · 3/8" – 9/16"',        angle:45, size:'3/8"', stock:true, end:true },
    { code:'MC-TH-213', fam:'MULTI', famLabel:'Multiasiento 24°',  name:'Terminal hembra multiasiento 24° · codo 90° · 1/2"',       angle:90, size:'1/2"', stock:true, end:true },
    { code:'MC-TH-214', fam:'ASP',   famLabel:'ASP',               name:'Terminal hembra ASP · codo 45° · 1/2" – 1"',              angle:45, size:'1/2"', stock:true, end:true },
    { code:'MC-TH-215', fam:'ASP',   famLabel:'ASP',               name:'Terminal hembra ASP giratoria · 1/2" – 1"3/16',           angle:0,  size:'1/2"', stock:true, end:true },
    { code:'MC-TH-216', fam:'ASP',   famLabel:'ASP',               name:'Terminal hembra ASP giratoria · 3/8" – 11/16"',           angle:0,  size:'3/8"', stock:true, end:true },
    { code:'MC-TH-217', fam:'JIC',   famLabel:'JIC 74°',           name:'Terminal JIC 74° macho fijo · 3/8" – 3/4"',               angle:0,  size:'3/8"', stock:true, end:true },
    { code:'MC-TH-218', fam:'JIC',   famLabel:'JIC 74°',           name:'Terminal JIC 74° hembra giratoria · 3/4" – 1"5/16',       angle:0,  size:'3/4"', stock:true, end:true },
    { code:'MC-TH-219', fam:'PUNT',  famLabel:'Puntero',           name:'Puntero hidráulico · 1/4" – 22 mm',                       angle:0,  size:'1/4"', stock:true, end:true },
    { code:'MC-TH-220', fam:'MULTI', famLabel:'Multiasiento 24°',  name:'Terminal hembra multiasiento 24° giratoria · 1/2"',        angle:0,  size:'1/2"', stock:true, end:true },
    { code:'MC-TH-221', fam:'BRIDA', famLabel:'Brida SAE 3000',    name:'Brida SAE 3000 PSI · codo 45° · 1" – 50,8 mm',            angle:45, size:'1"',   stock:true, end:true },
    { code:'MC-TH-222', fam:'JIC',   famLabel:'JIC 74°',           name:'Terminal JIC 74° macho fijo · 1/4" – 7/16"',             angle:0,  size:'1/4"', stock:true, end:true },
  ],
};
