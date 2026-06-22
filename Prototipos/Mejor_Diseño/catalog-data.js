/* ============================================================
   METCAR — DATOS DEL CATÁLOGO  (catalog-data.js)
   ------------------------------------------------------------
   ►► FUENTE ÚNICA de las categorías, íconos y productos. ◄◄
   La usan el catálogo (catalogo.html) Y el carrito (carrito.html),
   así un producto se describe en UN solo lugar y nunca se
   desincroniza entre páginas.

   Requiere que terminales.js se cargue ANTES (los terminales
   se inyectan automáticamente en la categoría "Terminales").

   tipo: 'simple' | 'metraje' | 'configurable'
   ============================================================ */
(function () {

  /* ── Categorías ── */
  var CATS = [
    { id: 'mangueras',  name: 'Mangueras Hidráulicas' },
    { id: 'terminales', name: 'Terminales Hidráulicos' },
    { id: 'discos',     name: 'Discos de Corte' },
    { id: 'torno',      name: 'Herramientas de Torno' },
    { id: 'gatos',      name: 'Gatos Hidráulicos' },
    { id: 'prensas',    name: 'Prensas y Accesorios' },
  ];

  /* ── Íconos SVG por categoría (línea Lucide-style, currentColor) ── */
  var ICONS = {
    mangueras:'<svg class="pc-svg" width="104" height="84" viewBox="0 0 120 96" fill="none"><path d="M16 86 C 6 50, 34 30, 60 42 C 72 47, 76 48, 82 50" stroke="#201d1a" stroke-width="19" stroke-linecap="round"/><path d="M16 86 C 6 50, 34 30, 60 42 C 72 47, 76 48, 82 50" stroke="#332f2b" stroke-width="13" stroke-linecap="round"/><path d="M14 84 C 5 50, 33 29, 58 41" stroke="rgba(255,255,255,.08)" stroke-width="3.5" stroke-linecap="round"/><rect x="77" y="38" width="6" height="24" rx="1" fill="#B83214"/><rect x="82" y="40" width="22" height="20" rx="2" fill="#6f6f71"/><rect x="82" y="40" width="22" height="6" rx="2" fill="#909092"/><line x1="87" y1="40" x2="87" y2="60" stroke="#48464a" stroke-width="1.5"/><line x1="92" y1="40" x2="92" y2="60" stroke="#48464a" stroke-width="1.5"/><line x1="97" y1="40" x2="97" y2="60" stroke="#48464a" stroke-width="1.5"/><polygon points="104,42 113,46 113,54 104,58" fill="#9a9a9c"/></svg>',
    terminales:'<svg class="pc-svg" width="104" height="84" viewBox="0 0 120 96" fill="none"><g transform="translate(0,2)"><polygon points="14,34 26,27 42,27 42,67 26,67 14,60" fill="#7c7c7e"/><polygon points="14,34 26,27 42,27 42,37 14,44" fill="#9a9a9c"/><rect x="42" y="34" width="20" height="26" fill="#6a6a6c"/><rect x="42" y="34" width="20" height="7" fill="#8a8a8c"/><rect x="62" y="34" width="5" height="26" fill="#B83214"/><rect x="67" y="38" width="38" height="18" fill="#73736f"/><line x1="72" y1="38" x2="67" y2="56" stroke="#48464a" stroke-width="1.6"/><line x1="80" y1="38" x2="75" y2="56" stroke="#48464a" stroke-width="1.6"/><line x1="88" y1="38" x2="83" y2="56" stroke="#48464a" stroke-width="1.6"/><line x1="96" y1="38" x2="91" y2="56" stroke="#48464a" stroke-width="1.6"/><line x1="104" y1="38" x2="99" y2="56" stroke="#48464a" stroke-width="1.6"/></g></svg>',
    discos:'<svg class="pc-svg" width="88" height="84" viewBox="0 0 100 96" fill="none"><g transform="translate(50,48)"><circle r="40" fill="#39352f"/><circle r="40" fill="none" stroke="#5a564f" stroke-width="1.5"/><g stroke="#4a463f" stroke-width="1"><line x1="0" y1="-38" x2="0" y2="38"/><line x1="-38" y1="0" x2="38" y2="0"/><line x1="-27" y1="-27" x2="27" y2="27"/><line x1="27" y1="-27" x2="-27" y2="27"/><line x1="-14" y1="-35" x2="14" y2="35"/><line x1="14" y1="-35" x2="-14" y2="35"/><line x1="-35" y1="-14" x2="35" y2="14"/><line x1="35" y1="-14" x2="-35" y2="14"/></g><circle r="17" fill="#B83214"/><circle r="17" fill="none" stroke="#8f2810" stroke-width="1"/><circle r="9.5" fill="#9a9a9c"/><circle r="5" fill="#17150f"/></g></svg>',
    torno:'<svg class="pc-svg" width="104" height="84" viewBox="0 0 120 96" fill="none"><g transform="rotate(-26 60 48)"><rect x="16" y="44" width="30" height="9" rx="1.5" fill="#56565a"/><rect x="46" y="43" width="44" height="11" fill="#86868a"/><path d="M50 43 L58 54 M60 43 L68 54 M70 43 L78 54 M80 43 L88 54" stroke="#46444a" stroke-width="1.8"/><polygon points="90,43 100,48.5 90,54" fill="#b6b6b8"/></g><g transform="rotate(16 60 48)"><rect x="30" y="56" width="24" height="6" rx="1" fill="#3e3e42"/><rect x="54" y="55" width="30" height="8" fill="#6c6c70"/><path d="M58 55 L64 63 M66 55 L72 63 M74 55 L80 63" stroke="#34343a" stroke-width="1.5"/><polygon points="84,55 91,59 84,63" fill="#8a8a8e"/></g></svg>',
    gatos:'<svg class="pc-svg" width="78" height="84" viewBox="0 0 86 96" fill="none"><g transform="translate(20,4)"><rect x="0" y="78" width="50" height="11" rx="2" fill="#56565a"/><rect x="8" y="32" width="32" height="48" rx="3" fill="#6f6f71"/><rect x="8" y="32" width="9" height="48" rx="3" fill="#8c8c8e"/><rect x="8" y="48" width="32" height="8" fill="#B83214"/><rect x="19" y="8" width="11" height="26" fill="#9a9a9c"/><rect x="13" y="2" width="23" height="8" rx="2" fill="#b6b6b8"/><rect x="38" y="56" width="18" height="7" rx="2" fill="#6c6c70" transform="rotate(-20 38 59)"/></g></svg>',
    prensas:'<svg class="pc-svg" width="98" height="84" viewBox="0 0 110 96" fill="none"><g transform="translate(6,4)"><rect x="8" y="8" width="9" height="80" fill="#56565a"/><rect x="83" y="8" width="9" height="80" fill="#56565a"/><rect x="2" y="8" width="96" height="11" fill="#6f6f71"/><rect x="42" y="19" width="18" height="24" rx="2" fill="#7c7c7e"/><rect x="42" y="28" width="18" height="6" fill="#B83214"/><rect x="47" y="43" width="8" height="17" fill="#9a9a9c"/><rect x="37" y="60" width="28" height="8" rx="1" fill="#8a8a8c"/><rect x="22" y="76" width="58" height="9" fill="#6a6a6c"/></g></svg>',
  };

  /* ── Productos (en producción: base de datos / Excel) ── */
  var PRODUCTS = [
    // ── Mangueras hidráulicas
    {code:'MC-MH-101', cat:'mangueras', name:'Manguera SAE 100R1AT · 1 malla', specs:['1/4"','225 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-102', cat:'mangueras', name:'Manguera SAE 100R1AT · 1 malla', specs:['3/8"','180 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-103', cat:'mangueras', name:'Manguera SAE 100R2AT · 2 mallas', specs:['1/4"','400 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-104', cat:'mangueras', name:'Manguera SAE 100R2AT · 2 mallas', specs:['3/8"','330 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-105', cat:'mangueras', name:'Manguera SAE 100R2AT · 2 mallas', specs:['1/2"','275 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-106', cat:'mangueras', name:'Manguera SAE 100R2AT · 2 mallas', specs:['3/4"','215 BAR'], stock:false, tipo:'metraje'},
    {code:'MC-MH-107', cat:'mangueras', name:'Manguera SAE 100R4 · retorno y succión', specs:['1"','28 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-108', cat:'mangueras', name:'Manguera SAE 100R12 · 4 mallas espiral', specs:['1/2"','420 BAR'], stock:true,  tipo:'metraje'},
    {code:'MC-MH-109', cat:'mangueras', name:'Manguera SAE 100R12 · 4 mallas espiral', specs:['3/4"','380 BAR'], stock:false, tipo:'metraje'},
    {code:'MC-MH-100', cat:'mangueras', name:'Manguera hidráulica armada a medida', specs:['CORTE','PRENSADO'], stock:true,  tipo:'configurable'},
    // ── Terminales (fuente única: terminales.js)
    ...(((window.MC_TERMINALES && window.MC_TERMINALES.items) || []).map(function (t) {
      return {
        code: t.code, cat: 'terminales', name: t.name,
        specs: [t.size, t.fam === 'ADP' ? 'ADAPT' : (t.angle ? t.angle + '°' : 'RECTO')],
        stock: t.stock, tipo: 'simple'
      };
    })),
    // ── Discos de corte
    {code:'MC-DC-301', cat:'discos', name:'Disco de corte acero', specs:['4½"','1.0 MM'], stock:true,  tipo:'simple'},
    {code:'MC-DC-302', cat:'discos', name:'Disco de corte acero', specs:['4½"','1.6 MM'], stock:true,  tipo:'simple'},
    {code:'MC-DC-303', cat:'discos', name:'Disco de corte acero inoxidable', specs:['4½"','INOX'], stock:true,  tipo:'simple'},
    {code:'MC-DC-304', cat:'discos', name:'Disco de corte acero', specs:['7"','1.6 MM'], stock:true,  tipo:'simple'},
    {code:'MC-DC-305', cat:'discos', name:'Disco de corte acero', specs:['9"','2.0 MM'], stock:false, tipo:'simple'},
    {code:'MC-DC-306', cat:'discos', name:'Disco de desbaste', specs:['4½"','6.0 MM'], stock:true,  tipo:'simple'},
    {code:'MC-DC-307', cat:'discos', name:'Disco flap lija', specs:['4½"','GR 60'], stock:true,  tipo:'simple'},
    // ── Herramientas de torno
    {code:'MC-HT-401', cat:'torno', name:'Juego de brocas HSS · 13 piezas', specs:['1–13 MM','HSS'], stock:true,  tipo:'simple'},
    {code:'MC-HT-402', cat:'torno', name:'Puntero de torno con inserto widia', specs:['12 MM','WIDIA'], stock:true,  tipo:'simple'},
    {code:'MC-HT-403', cat:'torno', name:'Puntero de torno con inserto widia', specs:['16 MM','WIDIA'], stock:true,  tipo:'simple'},
    {code:'MC-HT-404', cat:'torno', name:'Broca cónica escalonada', specs:['4–32 MM','TITANIO'], stock:false, tipo:'simple'},
    {code:'MC-HT-405', cat:'torno', name:'Mecha centro HSS · punto 60°', specs:['Ø 3.15','HSS'], stock:true,  tipo:'simple'},
    // ── Gatos hidráulicos
    {code:'MC-GH-501', cat:'gatos', name:'Gato hidráulico tipo botella', specs:['2 T'], stock:true,  tipo:'simple'},
    {code:'MC-GH-502', cat:'gatos', name:'Gato hidráulico tipo botella', specs:['5 T'], stock:true,  tipo:'simple'},
    {code:'MC-GH-503', cat:'gatos', name:'Gato hidráulico tipo botella', specs:['10 T'], stock:true,  tipo:'simple'},
    {code:'MC-GH-504', cat:'gatos', name:'Gato hidráulico tipo botella', specs:['20 T'], stock:true,  tipo:'simple'},
    {code:'MC-GH-505', cat:'gatos', name:'Gato carretilla hidráulico', specs:['2.5 T','PALLET'], stock:false, tipo:'simple'},
    // ── Prensas y accesorios
    {code:'MC-PA-601', cat:'prensas', name:'Prensa manual para mangueras', specs:['1/4"–1"','MANUAL'], stock:true,  tipo:'simple'},
    {code:'MC-PA-602', cat:'prensas', name:'Masa para trailer · 4 agujeros', specs:['4 AG','C/RULEMANES'], stock:true,  tipo:'simple'},
    {code:'MC-PA-603', cat:'prensas', name:'Masa para trailer · 5 agujeros', specs:['5 AG','C/RULEMANES'], stock:true,  tipo:'simple'},
    {code:'MC-PA-604', cat:'prensas', name:'Eje para trailer con puntas', specs:['1.500 KG'], stock:false, tipo:'simple'},
  ];

  window.MC_CATALOG = {
    CATS: CATS,
    ICONS: ICONS,
    PRODUCTS: PRODUCTS,
    catName: function (id) { return (CATS.find(function (c) { return c.id === id; }) || {}).name || id; },
    byCode: function (code) { return PRODUCTS.find(function (p) { return p.code === code; }) || null; },
  };
})();
