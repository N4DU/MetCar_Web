/* ============================================================
   METCAR — PANEL INTERNO (admin.js)
   ------------------------------------------------------------
   Capa de datos del panel de administración. Prototipo SIN
   backend: lee y escribe sobre el MISMO localStorage que usa
   el sitio público (auth.js / cart.js), y agrega su propio
   estado interno (precios base, multiplicadores, consultas,
   reseñas, notas internas, bitácora de actividad y config).

   Comparte estas claves con el resto del sitio:
     mc_users    → cuentas de clientes (auth.js)
     mc_orders   → pedidos por cliente (auth.js)
   Claves propias del panel:
     mc_admin_catalog  → overrides de stock / precio base por código
     mc_consultas      → consultas del formulario de contacto
     mc_resenas        → reseñas para moderar
     mc_admin_config   → configuración general del sitio
     mc_admin_log      → bitácora de actividad por pedido
     mc_admin_seeded   → flag: ya se cargaron datos de demostración

   API:  window.MCAdmin   (ver más abajo)
   ============================================================ */
(function () {
  'use strict';
  if (window.MCAdmin) return;

  /* ── Estados del pedido (espejo de auth.js, con fallback propio) ── */
  var STATES = (window.MCAuth && MCAuth.STATES) || [
    { idx: 1, short: 'Validación',     full: 'Pendiente de validación de cuenta', phase: 'cotizacion' },
    { idx: 2, short: 'En cotización',  full: 'Recibido, en cotización',            phase: 'cotizacion' },
    { idx: 3, short: 'Esperando pago', full: 'Cotización aprobada, esperando pago', phase: 'curso' },
    { idx: 4, short: 'En preparación', full: 'Pago confirmado, en preparación',     phase: 'curso' },
    { idx: 5, short: 'Para despachar', full: 'Listo para despachar',                phase: 'curso' },
    { idx: 6, short: 'Enviado',        full: 'Enviado / En camino',                phase: 'curso' },
    { idx: 7, short: 'Entregado',      full: 'Entregado / Completado',             phase: 'completado' }
  ];

  /* ── helpers localStorage ── */
  function read(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch (e) { return def; } }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  var listeners = [];
  function notify() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* ════════════════════════════════════════════════════════
     DATOS DE DEMOSTRACIÓN  (solo se cargan una vez, si no hay
     datos reales). Permiten que el panel se vea "vivo" sin
     depender de que un cliente haya operado el sitio antes.
     ════════════════════════════════════════════════════════ */
  function daysAgo(d, h) { var t = new Date(); t.setDate(t.getDate() - d); if (h != null) t.setHours(h, Math.floor(Math.random()*59), 0, 0); return t.toISOString(); }

  function seed() {
    if (read('mc_admin_seeded', false)) return;

    /* Clientes demo (no pisan cuentas reales: solo si no existe el email) */
    var demoUsers = [
      { id:'D1', nombre:'Talleres Sosa SRL', email:'compras@tallersosa.com.uy', tel:'099 612 304', tipo:'empresa',
        dir:{calle:'Ruta 5 km 142', ciudad:'Durazno', depto:'Durazno', cp:'97000'}, estado:'validado', mult:1.0, demo:true, createdAt:daysAgo(120,10) },
      { id:'D2', nombre:'Agropecuaria El Ceibo', email:'eldelceibo@gmail.com', tel:'098 220 117', tipo:'empresa',
        dir:{calle:'Camino de los Tropas s/n', ciudad:'Trinidad', depto:'Flores', cp:'85000'}, estado:'validado', mult:0.9, demo:true, createdAt:daysAgo(86,9) },
      { id:'D3', nombre:'Marcelo Píriz', email:'marce.piriz@gmail.com', tel:'091 845 622', tipo:'particular',
        dir:{calle:'José Pedro Varela 455', ciudad:'Sarandí Grande', depto:'Florida', cp:'94000'}, estado:'validado', mult:1.0, demo:true, createdAt:daysAgo(54,16) },
      { id:'D4', nombre:'Metalúrgica Rivera Hnos.', email:'taller@riverahnos.com', tel:'099 410 980', tipo:'empresa',
        dir:{calle:'Av. Sarandí 1290', ciudad:'Rivera', depto:'Rivera', cp:'40000'}, estado:'pendiente', mult:1.0, demo:true, createdAt:daysAgo(2,11) },
      { id:'D5', nombre:'Juan Carlos Méndez', email:'jcmendez.campo@gmail.com', tel:'095 332 071', tipo:'particular',
        dir:{calle:'Colonia Esperanza, padrón 1142', ciudad:'Young', depto:'Río Negro', cp:'85200'}, estado:'pendiente', mult:1.0, demo:true, createdAt:daysAgo(1,15) },
      { id:'D6', nombre:'Cosechas del Litoral S.A.', email:'logistica@cosechaslitoral.uy', tel:'099 778 451', tipo:'empresa',
        dir:{calle:'Parque Industrial, nave 7', ciudad:'Paysandú', depto:'Paysandú', cp:'60000'}, estado:'validado', mult:0.85, demo:true, createdAt:daysAgo(210,10) }
    ];
    var users = read('mc_users', []);
    demoUsers.forEach(function (du) {
      if (!users.some(function (u) { return u.email === du.email; })) users.push(du);
    });
    write('mc_users', users);

    /* Pedidos demo, repartidos en varios estados */
    var orders = read('mc_orders', {});
    function pushOrder(email, o) { (orders[email] = orders[email] || []); if (!orders[email].some(function (x) { return x.ref === o.ref; })) orders[email].unshift(o); }

    pushOrder('compras@tallersosa.com.uy', {
      ref:'MC-LX8F2A', createdAt:daysAgo(0,9), estadoIdx:2, nota:'Necesito las dos mangueras de 1/2" con urgencia para una retro parada.',
      items:[
        {code:'MC-MH-105', name:'Manguera SAE 100R2AT · 2 mallas', qty:2, specs:['1/2"','275 BAR'], cat:'mangueras', stock:true},
        {code:'CFG-1', name:'Manguera hidráulica a medida', qty:3, specs:['2 mallas','1/2"'], cat:'mangueras', configured:true, stock:true,
          detail:['Tipo: 2 mallas','Medida: 1/2"','Largo: 1,80 m','Terminal A: Recto 1/2"','Terminal B: Codo 90° 1/2"']},
        {code:'MC-DC-302', name:'Disco de corte acero', qty:25, specs:['4½"','1.6 MM'], cat:'discos', stock:true}
      ]
    });
    pushOrder('eldelceibo@gmail.com', {
      ref:'MC-KP3D9Q', createdAt:daysAgo(1,14), estadoIdx:3, nota:'', comprobante:'transferencia-brou-2640.pdf',
      items:[
        {code:'MC-GH-503', name:'Gato hidráulico tipo botella', qty:1, specs:['10 T'], cat:'gatos', stock:true},
        {code:'MC-PA-602', name:'Masa para trailer · 4 agujeros', qty:2, specs:['4 AG','C/RULEMANES'], cat:'prensas', stock:true}
      ]
    });
    pushOrder('marce.piriz@gmail.com', {
      ref:'MC-JJ1A7M', createdAt:daysAgo(3,11), estadoIdx:4, nota:'Paso a retirar por el local si está pronto el viernes.',
      items:[
        {code:'CFG-2', name:'Manguera hidráulica a medida', qty:1, specs:['4 mallas','3/4"'], cat:'mangueras', configured:true, stock:true,
          detail:['Tipo: 4 mallas espiral','Medida: 3/4"','Largo: 2,40 m','Terminal A: Recto 3/4"','Terminal B: Recto 3/4"']}
      ]
    });
    pushOrder('compras@tallersosa.com.uy', {
      ref:'MC-HG9R4T', createdAt:daysAgo(6,10), estadoIdx:6, nota:'', encomienda:'DAC 4471-228',
      items:[
        {code:'MC-MH-108', name:'Manguera SAE 100R12 · 4 mallas espiral', qty:1, specs:['1/2"','420 BAR'], cat:'mangueras', stock:true},
        {code:'MC-HT-402', name:'Puntero de torno con inserto widia', qty:4, specs:['12 MM','WIDIA'], cat:'torno', stock:true}
      ]
    });
    pushOrder('logistica@cosechaslitoral.uy', {
      ref:'MC-FD2W8K', createdAt:daysAgo(14,12), estadoIdx:7, nota:'', encomienda:'DAC 4390-101',
      items:[
        {code:'MC-MH-103', name:'Manguera SAE 100R2AT · 2 mallas', qty:2, specs:['1/4"','400 BAR'], cat:'mangueras', stock:true},
        {code:'MC-GH-504', name:'Gato hidráulico tipo botella', qty:2, specs:['20 T'], cat:'gatos', stock:true},
        {code:'MC-DC-304', name:'Disco de corte acero', qty:40, specs:['7"','1.6 MM'], cat:'discos', stock:true}
      ]
    });
    pushOrder('eldelceibo@gmail.com', {
      ref:'MC-CC7B5N', createdAt:daysAgo(22,15), estadoIdx:7, nota:'', encomienda:'COTMI 8821',
      items:[ {code:'MC-PA-603', name:'Masa para trailer · 5 agujeros', qty:4, specs:['5 AG','C/RULEMANES'], cat:'prensas', stock:true} ]
    });
    /* Pedido del cliente nuevo aún pendiente de validación */
    pushOrder('taller@riverahnos.com', {
      ref:'MC-AA0X1P', createdAt:daysAgo(2,11), estadoIdx:1, nota:'Primer pedido. Trabajamos con maquinaria vial, vamos a necesitar reposición seguido.',
      items:[
        {code:'MC-MH-106', name:'Manguera SAE 100R2AT · 2 mallas', qty:1, specs:['3/4"','215 BAR'], cat:'mangueras', stock:false},
        {code:'CFG-3', name:'Manguera hidráulica a medida', qty:2, specs:['2 mallas','3/8"'], cat:'mangueras', configured:true, stock:true,
          detail:['Tipo: 2 mallas','Medida: 3/8"','Largo: 1,20 m','Terminal A: Recto 3/8"','Terminal B: Codo 45° 3/8"']}
      ]
    });
    write('mc_orders', orders);

    /* Consultas del formulario de contacto */
    write('mc_consultas', [
      { id:'Q1', nombre:'Pablo Methol', email:'pmethol@hotmail.com', tel:'099 145 332', estado:'nueva', createdAt:daysAgo(0,10),
        mensaje:'¿Tienen manguera R2 de 1" en stock? Necesito 6 metros para una pala cargadora.', productos:['MC-MH-107'] },
      { id:'Q2', nombre:'Estancia La Tradición', email:'admin@latradicion.com.uy', tel:'', estado:'nueva', createdAt:daysAgo(1,16),
        mensaje:'Quería saber si hacen envíos a Tacuarembó y cada cuánto pasan con la gira por la zona.', productos:[] },
      { id:'Q3', nombre:'Diego Fernández', email:'dfernandez.mec@gmail.com', tel:'091 778 220', estado:'proceso', createdAt:daysAgo(2,9),
        mensaje:'Necesito presupuesto por 100 discos de corte de 4½" y 20 de 7".', productos:['MC-DC-302','MC-DC-304'] },
      { id:'Q4', nombre:'Carlos Bentancor', email:'cbentancor@gmail.com', tel:'098 003 921', estado:'cerrada', createdAt:daysAgo(5,11),
        mensaje:'¿El gato de 20 toneladas sirve para camión? Gracias.', productos:['MC-GH-504'] }
    ]);

    /* Reseñas para moderar / publicadas */
    write('mc_resenas', [
      { id:'R1', cliente:'Talleres Sosa SRL', anon:false, rating:5, estado:'pendiente', createdAt:daysAgo(0,12), pedido:'MC-HG9R4T',
        texto:'Pedí mangueras a medida un martes y el jueves ya las tenía en Durazno. Prensado impecable, todo derecho.' },
      { id:'R2', cliente:'M. Píriz', anon:false, rating:5, estado:'pendiente', createdAt:daysAgo(1,18), pedido:'MC-JJ1A7M',
        texto:'Atención de primera, te asesoran bien con el tema de los terminales. Recomendados.' },
      { id:'R3', cliente:'Anónimo', anon:true, rating:4, estado:'aprobada', createdAt:daysAgo(12,10), pedido:'MC-FD2W8K',
        texto:'Buenos precios y cumplen con los tiempos. La encomienda llegó bien embalada.' },
      { id:'R4', cliente:'J. C. Méndez', anon:false, rating:2, estado:'rechazada', createdAt:daysAgo(20,9), pedido:'',
        texto:'Tardaron en contestar el WhatsApp un fin de semana.' }
    ]);

    /* Configuración general por defecto */
    if (!read('mc_admin_config', null)) {
      write('mc_admin_config', {
        empresa: { nombre:'Metcar', tel:(window.MC&&MC.tel)||'4354-9363', cel:(window.MC&&MC.cel)||'099 414 733',
                   email:(window.MC&&MC.email)||'info@metcar.com.uy', dir:'Andrés Romero esq. Treinta y Tres, Sarandí Grande, Florida',
                   horario:(window.MC&&MC.horario)||'Lun–Vie 8:00–17:00 · Sáb 8:00–12:00' },
        banco: { titular:'Metcar — José Pedro Carreras', banco:'BROU', cuenta:'001-2345678 (Caja de Ahorro $)', cuentaUSD:'001-2345679 (Caja de Ahorro US$)', rut:'21 500123 0018' },
        notif: { pedidoNuevo:true, registroCliente:true, comprobante:true, cambioEstado:true, resenaNueva:true },
        resenas: { moderacion:true, soloCompletados:true, mostrarSeccion:true },
        registro: { telObligatorio:true, dirObligatoria:true, tipoCuenta:true }
      });
    }

    write('mc_admin_log', read('mc_admin_log', {}));
    write('mc_admin_seeded', true);
  }

  /* ════════════════════════════════════════════════════════
     PRECIOS BASE (USD) — internos. En producción vienen del
     Excel de la empresa. Acá se generan una vez por código y
     quedan guardados (editables desde el panel de catálogo).
     ════════════════════════════════════════════════════════ */
  var BASE_PRICE_HINT = {
    mangueras: [3.2, 9.5], terminales: [0.9, 3.4], discos: [0.35, 2.1],
    torno: [4, 38], gatos: [22, 140], prensas: [60, 320]
  };
  function seedPrices() {
    var store = read('mc_admin_catalog', {});
    var prods = (window.MC_CATALOG && MC_CATALOG.PRODUCTS) || [];
    var changed = false;
    prods.forEach(function (p) {
      if (!store[p.code]) store[p.code] = {};
      if (store[p.code].price == null) {
        var r = BASE_PRICE_HINT[p.cat] || [1, 10];
        // precio estable por código (hash simple → reproducible)
        var h = 0; for (var i = 0; i < p.code.length; i++) h = (h * 31 + p.code.charCodeAt(i)) >>> 0;
        var val = r[0] + (h % 1000) / 1000 * (r[1] - r[0]);
        store[p.code].price = Math.round(val * 100) / 100;
        changed = true;
      }
    });
    if (changed) write('mc_admin_catalog', store);
  }

  /* ════════════════════════════════════════════════════════
     COSTO AUTOMÁTICO DE MANGUERAS A MEDIDA
     ────────────────────────────────────────────────────────
     Una manguera armada no está en el catálogo (no tiene precio
     propio). Su costo se calcula solo:
        precio del cuerpo por metro × largo  +  terminal A  +  terminal B
     Los datos salen del detalle del ítem configurado (tipo,
     medida, largo y los dos terminales), que ya guarda el
     configurador. Cada componente toma su precio base del catálogo.
     ════════════════════════════════════════════════════════ */
  var SIZES = ['1/4"', '3/8"', '1/2"', '3/4"', '1"', 'M16', 'M18', 'M22'];
  function detailLines(item) { return (item.detail || []); }
  function findLine(item, re) { return detailLines(item).find(function (d) { return re.test(d); }) || ''; }

  function parseMeters(item) {
    var line = findLine(item, /^\s*largo/i);
    var hay = line || (item.specs || []).join(' ');
    var m = hay.match(/([\d]+(?:[.,]\d+)?)\s*(cm|mm|m)\b/i);
    if (!m) { var any = hay.match(/([\d]+(?:[.,]\d+)?)/); if (!any) return null; return parseFloat(any[1].replace(',', '.')); }
    var v = parseFloat(m[1].replace(',', '.'));
    if (/cm/i.test(m[2])) v = v / 100; else if (/mm/i.test(m[2])) v = v / 1000;
    return v;
  }
  function findSize(hay) { hay = String(hay || ''); for (var i = 0; i < SIZES.length; i++) { if (hay.indexOf(SIZES[i]) >= 0) return SIZES[i]; } return null; }

  function hosePerMeter(item, size) {
    var prods = ((window.MC_CATALOG && MC_CATALOG.PRODUCTS) || []).filter(function (p) { return p.cat === 'mangueras' && p.tipo === 'metraje'; });
    if (!prods.length) return { code: null, price: 0 };
    var typeStr = (findLine(item, /^\s*tipo/i) + ' ' + (item.specs || []).join(' ')).toLowerCase();
    var want4 = /4\s*malla|espiral|r12|r13/.test(typeStr);
    var want2 = /2\s*malla|r2/.test(typeStr);
    var cands = size ? prods.filter(function (p) { return (p.specs || []).indexOf(size) >= 0; }) : [];
    if (!cands.length) cands = prods;
    var pick = cands.find(function (p) { var n = (p.name || '').toLowerCase(); if (want4) return /espiral|r12|r13|4\s*malla/.test(n); if (want2) return /2\s*malla|r2/.test(n); return true; }) || cands[0];
    return { code: pick.code, price: MCAdmin.priceOf(pick.code) };
  }

  function terminalCost(line) {
    var L = String(line || '').replace(/^\s*terminal\s*[ab]\s*:/i, '').trim();
    if (!L) return { name: '', code: null, price: 0 };
    var size = findSize(L);
    var angle = /codo\s*90|90°/i.test(L) ? 90 : (/codo\s*45|45°/i.test(L) ? 45 : 0);
    var terms = ((window.MC_TERMINALES && MC_TERMINALES.items) || []).filter(function (t) { return t.end !== false; });
    if (!terms.length) return { name: L, code: null, price: 0 };
    var bySize = size ? terms.filter(function (t) { return t.size === size; }) : [];
    var pool = bySize.length ? bySize : terms;
    var pick = pool.find(function (t) { return t.angle === angle; }) || pool[0];
    return { name: L, code: pick.code, price: MCAdmin.priceOf(pick.code) };
  }

  /* ════════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════════ */
  var MCAdmin = {
    STATES: STATES,
    stateOf: function (idx) { return STATES[Math.max(0, Math.min(STATES.length - 1, idx - 1))]; },
    onChange: function (fn) { listeners.push(fn); },

    /* ── Clientes ── */
    users: function () { return read('mc_users', []); },
    userByEmail: function (e) { return MCAdmin.users().find(function (u) { return u.email === e; }) || null; },
    updateUser: function (email, patch) {
      var us = MCAdmin.users();
      var u = us.find(function (x) { return x.email === email; });
      if (!u) return null;
      Object.assign(u, patch);
      write('mc_users', us); notify(); return u;
    },
    setUserState: function (email, estado, motivo) {
      var u = MCAdmin.updateUser(email, { estado: estado, motivoRechazo: motivo || '' });
      // al validar una cuenta, sus pedidos "pendientes de validación" pasan a "en cotización"
      if (estado === 'validado') {
        var ords = read('mc_orders', {});
        (ords[email] || []).forEach(function (o) { if (o.estadoIdx === 1) { o.estadoIdx = 2; MCAdmin.log(o.ref, 'Cuenta validada → pedido pasa a cotización'); } });
        write('mc_orders', ords);
      }
      return u;
    },

    /* ── Pedidos ── */
    ordersFor: function (email) { return (read('mc_orders', {})[email] || []).slice(); },
    orders: function () {
      var all = read('mc_orders', {}); var out = [];
      Object.keys(all).forEach(function (email) {
        (all[email] || []).forEach(function (o) { out.push(Object.assign({ email: email }, o)); });
      });
      out.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
      return out;
    },
    orderByRef: function (ref) { return MCAdmin.orders().find(function (o) { return o.ref === ref; }) || null; },
    updateOrder: function (email, ref, patch) {
      var all = read('mc_orders', {});
      var o = (all[email] || []).find(function (x) { return x.ref === ref; });
      if (!o) return null;
      Object.assign(o, patch); write('mc_orders', all); notify(); return o;
    },
    advanceOrder: function (email, ref, newIdx) {
      var o = MCAdmin.orderByRef(ref); if (!o) return null;
      var name = MCAdmin.stateOf(newIdx).full;
      MCAdmin.updateOrder(email, ref, { estadoIdx: newIdx });
      MCAdmin.log(ref, 'Estado → ' + name);
      return MCAdmin.orderByRef(ref);
    },

    /* ── Precios / catálogo ── */
    priceOf: function (code) { var s = read('mc_admin_catalog', {})[code]; return s && s.price != null ? s.price : 0; },
    setPrice: function (code, usd) { var st = read('mc_admin_catalog', {}); (st[code] = st[code] || {}).price = Math.max(0, +usd || 0); write('mc_admin_catalog', st); notify(); },
    stockOf: function (code) {
      var s = read('mc_admin_catalog', {})[code];
      if (s && s.stock != null) return !!s.stock;
      var p = window.MC_CATALOG && MC_CATALOG.byCode(code); return p ? p.stock !== false : true;
    },
    setStock: function (code, inStock) { var st = read('mc_admin_catalog', {}); (st[code] = st[code] || {}).stock = !!inStock; write('mc_admin_catalog', st); notify(); },
    catalog: function () {
      var prods = (window.MC_CATALOG && MC_CATALOG.PRODUCTS) || [];
      return prods.map(function (p) { return Object.assign({}, p, { price: MCAdmin.priceOf(p.code), stock: MCAdmin.stockOf(p.code) }); });
    },

    /* ── Stock por línea de pedido ──
       Cada ítem puede estar en uno de tres estados:
         'ok'    → en stock, suma normalmente
         'out'   → sin stock, queda visible pero NO suma a la cotización
         'delay' → con demora / reposición, suma pero se avisa la fecha
       Compat: si el ítem viejo solo tiene it.stock (bool), se deriva. */
    STOCK_PRESETS: ['Sin stock por el momento', 'Sin stock confirmado', 'Se repone próximamente', 'Producto discontinuado'],
    lineStockState: function (it) {
      if (it && it.stockState) return it.stockState;
      return (it && it.stock === false) ? 'out' : 'ok';
    },
    setLineStock: function (email, ref, idx, info) {
      var all = read('mc_orders', {});
      var o = (all[email] || []).find(function (x) { return x.ref === ref; });
      if (!o || !o.items || !o.items[idx]) return null;
      var it = o.items[idx];
      it.stockState = info.state;
      it.stock = info.state !== 'out';            // 'ok' y 'delay' cuentan como vendibles
      it.stockNote = info.note || '';
      it.restockDate = info.date || '';
      it.missingComp = info.missingComp || '';
      write('mc_orders', all); notify();
      var lbl = info.state === 'out' ? 'Sin stock' : (info.state === 'delay' ? 'Con demora' : 'En stock');
      MCAdmin.log(ref, 'Stock de “' + it.name + '” → ' + lbl +
        (info.missingComp ? ' · ' + info.missingComp : '') +
        (info.note ? ' (' + info.note + ')' : '') +
        (info.date ? ' · repone ' + info.date : ''));
      return o;
    },
    /* Divide una línea: qtyInStock unidades con stock + el resto sin stock */
    splitLine: function (email, ref, idx, qtyInStock, info) {
      var all = read('mc_orders', {});
      var o = (all[email] || []).find(function (x) { return x.ref === ref; });
      if (!o || !o.items || !o.items[idx]) return null;
      var it = o.items[idx];
      var total = it.qty;
      qtyInStock = Math.max(0, Math.min(total, Math.floor(qtyInStock)));
      var rest = total - qtyInStock;
      if (rest <= 0 || qtyInStock <= 0) return null;
      it.qty = qtyInStock; it.stockState = 'ok'; it.stock = true; it.stockNote = ''; it.restockDate = ''; it.missingComp = '';
      var clone = JSON.parse(JSON.stringify(it));
      clone.qty = rest; clone.stockState = 'out'; clone.stock = false;
      clone.stockNote = (info && info.note) || 'Sin stock por el momento';
      clone.restockDate = (info && info.date) || ''; clone.missingComp = '';
      o.items.splice(idx + 1, 0, clone);
      if (o.overrides) o.overrides.splice(idx + 1, 0, (o.overrides[idx] != null ? o.overrides[idx] : null));
      write('mc_orders', all); notify();
      MCAdmin.log(ref, 'Línea “' + it.name + '” dividida: ' + qtyInStock + ' con stock + ' + rest + ' sin stock');
      return o;
    },
    /* Cotización de un pedido: aplica overrides por ítem + multiplicador.
       Las líneas 'out' (sin stock) quedan en la lista pero NO suman al total. */
    quote: function (o) {
      var user = MCAdmin.userByEmail(o.email);
      var mult = (o.multOverride != null) ? o.multOverride : (user && user.mult != null ? user.mult : 1);
      var lines = (o.items || []).map(function (it, i) {
        var cfg = it.configured ? MCAdmin.configuredCost(it) : null;
        var base = cfg ? cfg.total : MCAdmin.priceOf(it.code);
        var ov = (o.overrides && o.overrides[i] != null) ? o.overrides[i] : null;
        var unit = ov != null ? ov : base * mult;
        var ss = MCAdmin.lineStockState(it);
        var excluded = (ss === 'out');
        return {
          name: it.name, code: it.code, qty: it.qty, base: base, unit: unit, override: ov != null,
          subtotal: unit * it.qty, configured: !!it.configured, cfg: cfg, detail: it.detail || null, cat: it.cat,
          stockState: ss, stockNote: it.stockNote || '', restockDate: it.restockDate || '',
          missingComp: it.missingComp || '', excluded: excluded
        };
      });
      var total = lines.reduce(function (s, l) { return s + (l.excluded ? 0 : l.subtotal); }, 0);
      var excludedCount = lines.filter(function (l) { return l.excluded; }).length;
      return { mult: mult, lines: lines, total: total, excludedCount: excludedCount };
    },
    /* Congela la cotización y se la "envía" al cliente (snapshot que Mi cuenta
       puede leer sin depender de admin.js). Avanza el pedido a "esperando pago". */
    sendClientQuote: function (email, ref) {
      var o = MCAdmin.orderByRef(ref); if (!o) return null;
      var q = MCAdmin.quote(o);
      var snap = {
        sentAt: new Date().toISOString(), mult: q.mult, total: q.total, excludedCount: q.excludedCount,
        lines: q.lines.map(function (l) {
          return {
            name: l.name, code: l.code, qty: l.qty, unit: l.unit, subtotal: l.subtotal,
            configured: l.configured, detail: l.detail, cat: l.cat, stockState: l.stockState,
            stockNote: l.stockNote, restockDate: l.restockDate, missingComp: l.missingComp, excluded: l.excluded
          };
        })
      };
      MCAdmin.updateOrder(email, ref, { quote: snap, multOverride: (o.multOverride != null ? o.multOverride : q.mult) });
      MCAdmin.advanceOrder(email, ref, 3);
      return MCAdmin.orderByRef(ref);
    },

    /* Costo base (USD) de una manguera armada a medida:
       cuerpo por metro × largo + terminal A + terminal B */
    configuredCost: function (item) {
      var meters = parseMeters(item);
      var size = findSize((item.specs || []).join(' ') + ' ' + detailLines(item).join(' '));
      var hose = hosePerMeter(item, size);
      var termA = terminalCost(findLine(item, /terminal\s*a/i));
      var termB = terminalCost(findLine(item, /terminal\s*b/i));
      var hoseCost = (meters || 0) * hose.price;
      var total = Math.round((hoseCost + termA.price + termB.price) * 100) / 100;
      return {
        found: meters != null && hose.price > 0,
        meters: meters, size: size, perMeter: hose.price, hoseCode: hose.code, hoseCost: Math.round(hoseCost * 100) / 100,
        termA: termA, termB: termB, total: total
      };
    },

    /* ── Consultas ── */
    consultas: function () { return read('mc_consultas', []); },
    updateConsulta: function (id, patch) { var a = MCAdmin.consultas(); var c = a.find(function (x) { return x.id === id; }); if (c) { Object.assign(c, patch); write('mc_consultas', a); notify(); } return c; },

    /* ── Reseñas ── */
    resenas: function () { return read('mc_resenas', []); },
    updateResena: function (id, patch) { var a = MCAdmin.resenas(); var r = a.find(function (x) { return x.id === id; }); if (r) { Object.assign(r, patch); write('mc_resenas', a); notify(); } return r; },

    /* ── Configuración ── */
    config: function () { return read('mc_admin_config', {}); },
    saveConfig: function (cfg) { write('mc_admin_config', cfg); notify(); },

    /* ── Bitácora de actividad por pedido ── */
    log: function (ref, text) {
      var L = read('mc_admin_log', {}); (L[ref] = L[ref] || []).unshift({ t: new Date().toISOString(), text: text, by: 'Patricia' });
      write('mc_admin_log', L); notify();
    },
    activity: function (ref) { return (read('mc_admin_log', {})[ref] || []).slice(); },

    /* ── Cola de acciones requeridas (para el dashboard) ── */
    actionQueue: function () {
      var q = [];
      MCAdmin.users().forEach(function (u) { if (u.estado === 'pendiente') q.push({ type: 'cuenta', email: u.email, label: 'Validar cuenta nueva', who: u.nombre, when: u.createdAt }); });
      MCAdmin.orders().forEach(function (o) {
        if (o.estadoIdx === 2) q.push({ type: 'cotizar', ref: o.ref, email: o.email, label: 'Cotizar pedido', who: (MCAdmin.userByEmail(o.email) || {}).nombre, when: o.createdAt });
        if (o.estadoIdx === 3) q.push({ type: 'pago', ref: o.ref, email: o.email, label: 'Confirmar pago', who: (MCAdmin.userByEmail(o.email) || {}).nombre, when: o.createdAt });
      });
      MCAdmin.consultas().forEach(function (c) { if (c.estado === 'nueva') q.push({ type: 'consulta', id: c.id, label: 'Responder consulta', who: c.nombre, when: c.createdAt }); });
      MCAdmin.resenas().forEach(function (r) { if (r.estado === 'pendiente') q.push({ type: 'resena', id: r.id, label: 'Moderar reseña', who: r.cliente, when: r.createdAt }); });
      q.sort(function (a, b) { return new Date(b.when) - new Date(a.when); });
      return q;
    },

    lowStock: function () { return MCAdmin.catalog().filter(function (p) { return !p.stock; }); }
  };

  seed(); seedPrices();
  window.MCAdmin = MCAdmin;
})();
