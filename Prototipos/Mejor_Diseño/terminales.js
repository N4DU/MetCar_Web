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
  ],
};
