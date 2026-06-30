/* ============================================================
   METCAR — CARRITO / PEDIDO  (cart.js)
   ------------------------------------------------------------
   Módulo único del carrito de cotización. Lo usan TODAS las
   páginas (home, catálogo, configurador, carrito).

   · NO es un e-commerce: no hay precios ni pago online.
     El carrito arma un PEDIDO que el cliente envía a cotizar.
   · Estado en sessionStorage 'mc_cart' = [{code, qty, custom?}]
     (compatible con el formato anterior {code, qty}).
   · custom: para ítems configurados (manguera a medida) que no
     están en el catálogo. {name, cat, specs[], stock, detail[]}

   API pública  ──────────────────────────────────────────────
     MCCart.add(code, qty, opts)   opts.custom / opts.fromEl / opts.silent
     MCCart.addCustom(custom, qty) → ítem configurado (genera id)
     MCCart.setQty(line, qty)      line = code (o id de línea)
     MCCart.remove(line)
     MCCart.items()  → [{line, code, qty, p}]  (p = producto resuelto)
     MCCart.count()  → unidades totales
     MCCart.lines()  → cantidad de líneas
     MCCart.open() / MCCart.close()
     MCCart.onChange(fn)           se llama tras cada cambio
   ============================================================ */
(function () {
  'use strict';

  // Evita doble inicialización si el script se evalúa dos veces
  // (p. ej. al montarse dentro de un Design Component) → si no, se crean
  // dos drawers superpuestos y dos listeners de click.
  if (window.__mcCartLoaded) return;
  window.__mcCartLoaded = true;

  var KEY = 'mc_cart';
  var listeners = [];
  var lastAdded = null;       // id de línea recién agregada (para destacar en drawer)
  var _seq = 0;
  function genId() { return 'L' + Date.now().toString(36) + '-' + (_seq++) + '-' + Math.floor(Math.random() * 1e6).toString(36); }

  /* ── Estado ──
     Cada línea tiene un id ÚNICO propio. Quitar / editar usa ese id, nunca el
     code — así dos ítems con el mismo code (p. ej. dos mangueras a medida) no se
     borran juntos. read() asigna id a ítems viejos que no lo tengan (y lo persiste). */
  function read() {
    try {
      var a = JSON.parse(sessionStorage.getItem(KEY) || '[]');
      if (!Array.isArray(a)) return [];
      var changed = false;
      for (var i = 0; i < a.length; i++) { if (a[i] && !a[i].id) { a[i].id = genId(); changed = true; } }
      if (changed) sessionStorage.setItem(KEY, JSON.stringify(a));
      return a;
    } catch (e) { return []; }
  }
  function write(arr) {
    sessionStorage.setItem(KEY, JSON.stringify(arr));
    notify();
  }
  function notify() {
    renderBadges();
    if (panelOpen) renderDrawer();
    listeners.forEach(function (fn) { try { fn(); } catch (e) {} });
  }

  /* line id estable y único por línea */
  function lineId(it) { return it.id; }

  function resolve(it) {
    if (it.custom) {
      return Object.assign({ code: it.code, configured: true }, it.custom);
    }
    var c = window.MC_CATALOG;
    return (c && c.byCode(it.code)) || { code: it.code, name: it.code, cat: '', specs: [], stock: true, tipo: 'simple' };
  }

  var MCCart = {
    items: function () {
      return read().map(function (it) {
        return { line: lineId(it), code: it.code, qty: it.qty, custom: it.custom || null, p: resolve(it) };
      });
    },
    count: function () { return read().reduce(function (n, i) { return n + (i.qty || 0); }, 0); },
    lines: function () { return read().length; },

    add: function (code, qty, opts) {
      qty = qty || 1; opts = opts || {};
      var arr = read();
      var it = arr.find(function (i) { return i.code === code && !i.custom; });
      if (it) it.qty += qty; else { it = { id: genId(), code: code, qty: qty }; arr.push(it); }
      lastAdded = it.id;
      write(arr);
      if (opts.fromEl) flyToCart(opts.fromEl, code);
      if (!opts.silent) MCCart.open(it.id);
      return it.id;
    },

    addCustom: function (custom, qty, opts) {
      qty = qty || 1; opts = opts || {};
      var cfg = 'CFG-' + Date.now().toString(36) + Math.floor(Math.random() * 1000);   // ref visible (no única)
      var lid = genId();                                                                // id de línea Único
      var arr = read();
      arr.push({ id: lid, code: cfg, qty: qty, custom: custom });
      lastAdded = lid;
      write(arr);
      if (opts.fromEl) flyToCart(opts.fromEl, cfg);
      if (!opts.silent) MCCart.open(lid);
      return lid;
    },

    setQty: function (line, qty) {
      var arr = read();
      var it = arr.find(function (i) { return i.id === line; });
      if (!it) return;
      qty = Math.max(1, Math.min(999, qty | 0));
      it.qty = qty;
      write(arr);
    },

    remove: function (line) {
      write(read().filter(function (i) { return i.id !== line; }));   // quita SOLO esa línea
    },

    clear: function () { write([]); },

    onChange: function (fn) { listeners.push(fn); },

    open: function (highlight) { if (highlight) lastAdded = highlight; openDrawer(); },
    close: function () { closeDrawer(); },

    refresh: function () { renderBadges(); },   // re-pinta el badge (útil al montar un Design Component)
  };

  window.MCCart = MCCart;

  /* ════════════════════════════════════════════════════════
     BADGES — actualiza #cart-badge y [data-cart-badge]
     ════════════════════════════════════════════════════════ */
  function renderBadges() {
    var n = MCCart.count();
    var els = document.querySelectorAll('#cart-badge,[data-cart-badge]');
    els.forEach(function (el) {
      var prev = el.textContent;
      el.textContent = n;
      el.style.display = n > 0 ? '' : 'none';   // se oculta cuando el pedido está vacío (no mostrar "0")
      if (String(n) !== prev && n > 0) {
        el.classList.remove('mc-badge-bump');
        void el.offsetWidth;
        el.classList.add('mc-badge-bump');
      }
    });
  }

  /* ════════════════════════════════════════════════════════
     ANIMACIÓN "voló al carrito"
     ════════════════════════════════════════════════════════ */
  function cartBtnRect() {
    var btn = document.querySelector('[data-open-cart],#nav-cart-btn');
    return btn ? btn.getBoundingClientRect() : null;
  }
  function flyToCart(fromEl, code) {
    try {
      var to = cartBtnRect(); if (!to) return;
      var from = fromEl.getBoundingClientRect();
      var p = window.MC_CATALOG ? window.MC_CATALOG.byCode(code) : null;
      var icon = (p && window.MC_CATALOG.ICONS[p.cat]) || '';
      var fly = document.createElement('div');
      fly.className = 'mc-fly';
      fly.innerHTML = '<div class="mc-fly-in">' + (icon || '<span class="mc-fly-dot"></span>') + '</div>';
      document.body.appendChild(fly);
      var sx = from.left + from.width / 2, sy = from.top + from.height / 2;
      var ex = to.left + to.width / 2, ey = to.top + to.height / 2;
      fly.style.left = sx + 'px'; fly.style.top = sy + 'px';
      fly.style.transform = 'translate(-50%,-50%) scale(1)';
      fly.getBoundingClientRect();
      requestAnimationFrame(function () {
        fly.style.transition = 'transform .62s cubic-bezier(.5,-0.3,.4,1), opacity .62s ease';
        fly.style.transform = 'translate(-50%,-50%) translate(' + (ex - sx) + 'px,' + (ey - sy) + 'px) scale(.18)';
        fly.style.opacity = '.2';
      });
      setTimeout(function () {
        fly.remove();
        var btn = document.querySelector('[data-open-cart],#nav-cart-btn');
        if (btn) { btn.classList.remove('mc-cart-hit'); void btn.offsetWidth; btn.classList.add('mc-cart-hit'); }
      }, 640);
    } catch (e) {}
  }

  /* ════════════════════════════════════════════════════════
     DRAWER (mini-pedido)
     ════════════════════════════════════════════════════════ */
  var panelOpen = false, drawer = null, body = null;

  var WA = (window.MC && window.MC.wa) || '59899414733';

  var waSVG = '<svg width="15" height="15" viewBox="0 0 32 32" fill="currentColor"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.45.65 4.75 1.78 6.74L2 30l7.51-1.96A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5c-2.18 0-4.24-.6-6-1.65l-.43-.26-4.46 1.17 1.19-4.35-.28-.45A11.48 11.48 0 0 1 4.5 16c0-6.35 5.15-11.5 11.5-11.5S27.5 9.65 27.5 16 22.35 27.5 16 27.5z"/></svg>';

  function ensureDrawer() {
    if (drawer) return;
    injectStyles();
    var wrap = document.createElement('div');
    wrap.className = 'mc-cart';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<div class="mc-cart-ovl" data-cart-close></div>' +
      '<aside class="mc-cart-panel" role="dialog" aria-modal="true" aria-label="Mi pedido">' +
        '<header class="mc-cart-head">' +
          '<div class="mc-cart-title">Mi pedido <span class="mc-cart-n" id="mc-cart-headn"></span></div>' +
          '<button class="mc-cart-x" data-cart-close aria-label="Cerrar pedido"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '</header>' +
        '<div class="mc-cart-body" id="mc-cart-body"></div>' +
        '<footer class="mc-cart-foot" id="mc-cart-foot"></footer>' +
      '</aside>';
    document.body.appendChild(wrap);
    drawer = wrap;
    body = wrap.querySelector('#mc-cart-body');
    wrap.addEventListener('click', onDrawerClick);
  }

  function openDrawer() {
    ensureDrawer();
    renderDrawer();
    panelOpen = true;
    drawer.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // destacar el recién agregado y traerlo a la vista (sin scrollIntoView)
    requestAnimationFrame(function () {
      var hot = body.querySelector('.mc-ci.is-new');
      if (hot) body.scrollTop = Math.max(0, hot.offsetTop - 12);
      var cls = drawer.querySelector('[data-cart-close]');
    });
  }
  function closeDrawer() {
    if (!drawer) return;
    panelOpen = false;
    drawer.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function onDrawerClick(e) {
    if (e.target.closest('[data-cart-close]')) { closeDrawer(); return; }
    var inc = e.target.closest('[data-ci-inc]'); if (inc) { var c = inc.getAttribute('data-ci-inc'); MCCart.setQty(c, qtyOf(c) + 1); return; }
    var dec = e.target.closest('[data-ci-dec]'); if (dec) { var c2 = dec.getAttribute('data-ci-dec'); var q = qtyOf(c2); if (q > 1) MCCart.setQty(c2, q - 1); return; }   // mínimo 1; la papelera quita el ítem
    var rm = e.target.closest('[data-ci-rm]'); if (rm) { MCCart.remove(rm.getAttribute('data-ci-rm')); return; }
  }
  function qtyOf(id) { var it = read().find(function (i) { return i.id === id; }); return it ? it.qty : 1; }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]); }); }

  function stockTag(inStock) {
    return inStock
      ? '<span class="mc-ci-stk in"><span class="d"></span>En stock</span>'
      : '<span class="mc-ci-stk out"><span class="d"></span>A confirmar</span>';
  }

  /* Thumb del drawer: foto real (img/catalogo/<cat>/<código>, webp→png) o ícono. */
  window.MCThumbFallback = window.MCThumbFallback || function (img) {
    var base = img.getAttribute('data-base');
    if (base && img.getAttribute('data-step') !== 'png') { img.setAttribute('data-step', 'png'); img.src = base + '.png'; return; }
    var parent = img.parentNode;
    if (parent) { parent.innerHTML = decodeURIComponent(img.getAttribute('data-ic') || ''); }
  };
  function thumbInner(p, icon) {
    if (p.configured) return icon;
    var C = window.MC_CATALOG;
    var exact = p.img || null;
    var base = C && C.photoBase ? C.photoBase(p) : null;
    var src = exact || (base ? base + '.webp' : null);
    if (!src) return icon;
    return '<img alt="' + esc(p.name) + '" loading="lazy" data-base="' + (exact ? '' : (base || '')) + '" data-ic="' + encodeURIComponent(icon) + '" src="' + src + '" onerror="MCThumbFallback(this)">';
  }

  function itemHTML(it) {
    var p = it.p, isNew = it.line === lastAdded;
    var icon = (window.MC_CATALOG && window.MC_CATALOG.ICONS[p.cat]) || '';
    var thumb = thumbInner(p, icon);
    var catLbl = p.configured ? 'Manguera a medida' : (window.MC_CATALOG ? window.MC_CATALOG.catName(p.cat) : p.cat);
    var specs = (p.specs || []).map(function (s) { return '<span class="mc-ci-spec">' + esc(s) + '</span>'; }).join('');
    var detail = '';
    if (p.configured && p.detail && p.detail.length) {
      detail = '<div class="mc-ci-detail">' + p.detail.map(function (d) { return '<span>' + esc(d) + '</span>'; }).join('') + '</div>';
    }
    return '<div class="mc-ci' + (isNew ? ' is-new' : '') + '" data-line="' + esc(it.line) + '">' +
      (isNew ? '<span class="mc-ci-new">Agregado</span>' : '') +
      '<div class="mc-ci-thumb">' + thumb + '</div>' +
      '<div class="mc-ci-main">' +
        '<div class="mc-ci-cat">' + esc(catLbl) + '</div>' +
        '<div class="mc-ci-name">' + esc(p.name) + '</div>' +
        '<div class="mc-ci-code">' + esc(it.code.indexOf('CFG-') === 0 ? 'A medida' : it.code) + '</div>' +
        '<div class="mc-ci-specs">' + specs + '</div>' + detail +
        '<div class="mc-ci-row">' +
          stockTag(p.stock) +
          '<div class="mc-qty">' +
            '<button class="mc-qs' + (it.qty <= 1 ? ' mc-qs-off' : '') + '" data-ci-dec="' + esc(it.line) + '" aria-label="Restar"' + (it.qty <= 1 ? ' aria-disabled="true"' : '') + '>−</button>' +
            '<span class="mc-qn">' + it.qty + '</span>' +
            '<button class="mc-qs" data-ci-inc="' + esc(it.line) + '" aria-label="Sumar">+</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="mc-ci-rm" data-ci-rm="' + esc(it.line) + '" aria-label="Quitar del pedido"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg></button>' +
    '</div>';
  }

  function trashSVG() {
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>';
  }

  function emptyHTML() {
    return '<div class="mc-cart-empty">' +
      '<div class="mc-cart-empty-ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>' +
      '<div class="mc-cart-empty-h">Tu pedido está vacío</div>' +
      '<p class="mc-cart-empty-t">Agregá productos del catálogo o armá una manguera a medida en el configurador.</p>' +
      '<div class="mc-cart-empty-ctas">' +
        '<a class="mc-btn mc-btn-p mc-btn-block" href="catalogo.html">Ver catálogo<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>' +
        '<a class="mc-btn mc-btn-g mc-btn-block" href="Configurador Visual.dc.html">Configurar manguera</a>' +
      '</div>' +
    '</div>';
  }

  function renderDrawer() {
    if (!body) return;
    var items = MCCart.items();
    var n = MCCart.count();
    document.getElementById('mc-cart-headn').textContent = n ? '· ' + n + (n === 1 ? ' ítem' : ' ítems') : '';
    var foot = document.getElementById('mc-cart-foot');

    if (!items.length) {
      body.innerHTML = emptyHTML();
      foot.innerHTML = '';
      foot.style.display = 'none';
      return;
    }
    foot.style.display = '';
    body.innerHTML = items.map(itemHTML).join('');

    var anyOut = items.some(function (i) { return !i.p.stock; });
    var warn = anyOut
      ? '<div class="mc-cart-warn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg><span>Hay ítems sin stock. Confirmamos disponibilidad en la cotización.</span></div>'
      : '';
    foot.innerHTML =
      warn +
      '<div class="mc-cart-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span>Armá tu pedido sin precios. Metcar te cotiza y coordinás el pago aparte.</span></div>' +
      '<a class="mc-btn mc-btn-p mc-btn-block" href="carrito.html">Revisar pedido y cotizar<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>' +
      '<button class="mc-cart-keep" data-cart-close>Seguir comprando</button>';
  }

  /* ════════════════════════════════════════════════════════
     ESTILOS (inyectados una vez)
     ════════════════════════════════════════════════════════ */
  function injectStyles() {
    if (document.getElementById('mc-cart-styles')) return;
    var css = `
:root{--mc-red:#B83214;--mc-blk:#0B0B0B;--mc-yel:#F5C518;--mc-yel-dim:#8A7010;--mc-dark:#1B1916;--mc-owh:#F4F2EC;--mc-bdr:rgba(27,25,22,.10);--mc-ft:'Barlow Condensed',sans-serif;--mc-fb:'Barlow',sans-serif;--mc-fd:'Bebas Neue',sans-serif}
.mc-badge-bump{animation:mcBump .4s cubic-bezier(.22,1,.36,1)}
@keyframes mcBump{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(1)}}
.mc-cart-hit{animation:mcHit .5s ease}
@keyframes mcHit{0%,100%{transform:none}30%{transform:scale(1.18)}}
.mc-fly{position:fixed;z-index:9999;pointer-events:none;width:54px;height:54px}
.mc-fly-in{width:54px;height:54px;border-radius:3px;background:linear-gradient(150deg,#23211e,#0f0d0b);border-left:3px solid var(--mc-red);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 28px rgba(0,0,0,.45);overflow:hidden}
.mc-fly-in svg{width:40px;height:34px}
.mc-fly-dot{width:14px;height:14px;border-radius:50%;background:var(--mc-red)}

.mc-cart{position:fixed;inset:0;z-index:1000;visibility:hidden;pointer-events:none}
.mc-cart.show{visibility:visible;pointer-events:auto}
.mc-cart-ovl{position:absolute;inset:0;background:rgba(11,11,11,.5);opacity:0;transition:opacity .3s ease;backdrop-filter:blur(1px)}
.mc-cart.show .mc-cart-ovl{opacity:1}
.mc-cart-panel{position:absolute;top:0;right:0;height:100%;width:418px;max-width:100vw;background:var(--mc-owh);
  display:flex;flex-direction:column;transform:translateX(100%);transition:transform .34s cubic-bezier(.4,0,.2,1);
  box-shadow:-18px 0 50px rgba(0,0,0,.28)}
.mc-cart.show .mc-cart-panel{transform:translateX(0)}
.mc-cart-head{position:relative;flex-shrink:0;background:var(--mc-dark);padding:20px 22px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid var(--mc-red)}
.mc-cart-title{font-family:var(--mc-fd);font-size:23px;letter-spacing:1.5px;color:#fff;line-height:1}
.mc-cart-n{font-family:var(--mc-ft);font-weight:500;font-size:12px;letter-spacing:1px;color:rgba(255,255,255,.45);margin-left:4px}
.mc-cart-x{background:none;border:none;cursor:pointer;color:rgba(255,255,255,.55);padding:6px;display:flex;transition:color .16s ease}
.mc-cart-x:hover{color:#fff}
.mc-cart-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:6px 0}

.mc-ci{position:relative;display:flex;gap:13px;padding:18px 22px;border-bottom:1px solid var(--mc-bdr);background:transparent;transition:background .4s ease}
.mc-ci.is-new{animation:mcNew 1.6s ease}
@keyframes mcNew{0%{background:rgba(184,50,20,.12)}100%{background:transparent}}
.mc-ci-new{position:absolute;top:10px;right:42px;background:var(--mc-red);color:#fff;font-family:var(--mc-ft);font-weight:700;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;padding:2px 7px;border-radius:2px}
.mc-ci-thumb{position:relative;width:62px;height:62px;flex-shrink:0;border-radius:2px;background:linear-gradient(150deg,#23211e 0%,#161412 70%,#0f0d0b 100%);display:flex;align-items:center;justify-content:center;overflow:hidden;border-left:3px solid var(--mc-red)}
.mc-ci-thumb svg{width:50px;height:42px;opacity:.92}\n.mc-ci-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mc-ci-main{flex:1;min-width:0}
.mc-ci-cat{font-family:var(--mc-ft);font-weight:700;font-size:9px;letter-spacing:1.4px;text-transform:uppercase;color:var(--mc-red);margin-bottom:3px}
.mc-ci-name{font-family:var(--mc-ft);font-weight:700;font-size:14px;line-height:1.22;color:#1B1916;margin-bottom:2px}
.mc-ci-code{font-family:var(--mc-ft);font-weight:500;font-size:10px;letter-spacing:1px;color:#68686A;margin-bottom:7px}
.mc-ci-specs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px}
.mc-ci-spec{font-family:var(--mc-ft);font-weight:700;font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;color:var(--mc-yel);background:var(--mc-blk);padding:3px 7px;border-radius:3px;white-space:nowrap}
.mc-ci-detail{display:flex;flex-direction:column;gap:1px;margin:-3px 0 9px}
.mc-ci-detail span{font-family:var(--mc-fb);font-size:11px;color:#4A4744;line-height:1.4}
.mc-ci-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
.mc-ci-stk{display:inline-flex;align-items:center;gap:5px;font-family:var(--mc-ft);font-weight:700;font-size:9px;letter-spacing:1px;text-transform:uppercase}
.mc-ci-stk .d{width:5px;height:5px;border-radius:50%}
.mc-ci-stk.in{color:var(--mc-yel-dim)}
.mc-ci-stk.in .d{background:#1F8A5B;box-shadow:0 0 0 0 rgba(31,138,91,.5);animation:mcPulse 2s ease-in-out infinite}
.mc-ci-stk.out{color:var(--mc-yel-dim)}
.mc-ci-stk.out .d{background:var(--mc-yel-dim)}
@keyframes mcPulse{0%,100%{opacity:1}50%{opacity:.35}}
.mc-qty{display:flex;align-items:center;border:1.5px solid var(--mc-bdr);border-radius:2px;background:#fff}
.mc-qs{width:30px;height:28px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;font-family:var(--mc-ft);font-weight:700;font-size:15px;color:#4A4744;transition:background .16s ease,color .16s ease}
.mc-qs:hover{background:var(--mc-owh);color:var(--mc-red)}
.mc-qs-off{opacity:.32;cursor:default}
.mc-qs-off:hover{background:none;color:#4A4744}
.mc-qn{min-width:26px;text-align:center;font-family:var(--mc-ft);font-weight:700;font-size:13px;color:#1B1916;border-left:1.5px solid var(--mc-bdr);border-right:1.5px solid var(--mc-bdr);height:28px;line-height:28px}
.mc-ci-rm{align-self:flex-start;background:none;border:none;cursor:pointer;color:#9b9893;padding:4px;display:flex;transition:color .16s ease}
.mc-ci-rm:hover{color:var(--mc-red)}

.mc-cart-empty{padding:64px 32px;text-align:center;display:flex;flex-direction:column;align-items:center}
.mc-cart-empty-ic{width:64px;height:64px;border:1.5px solid var(--mc-bdr);border-radius:3px;display:flex;align-items:center;justify-content:center;color:#9b9893;margin-bottom:20px}
.mc-cart-empty-h{font-family:var(--mc-fd);font-size:24px;letter-spacing:.5px;color:#1B1916;margin-bottom:8px}
.mc-cart-empty-t{font-family:var(--mc-fb);font-size:13.5px;line-height:1.6;color:#4A4744;max-width:260px;margin-bottom:24px}

.mc-cart-foot{flex-shrink:0;background:#fff;border-top:1px solid var(--mc-bdr);padding:16px 22px 20px}
.mc-cart-warn{display:flex;gap:9px;align-items:flex-start;background:rgba(245,197,24,.12);border-left:3px solid var(--mc-yel);padding:9px 11px;border-radius:2px;margin-bottom:11px}
.mc-cart-warn svg{color:var(--mc-yel-dim);flex-shrink:0;margin-top:1px}
.mc-cart-warn span{font-family:var(--mc-fb);font-size:11.5px;line-height:1.45;color:#4A4744}
.mc-cart-note{display:flex;gap:9px;align-items:flex-start;margin-bottom:14px}
.mc-cart-note svg{color:#1F8A5B;flex-shrink:0;margin-top:1px}
.mc-cart-note span{font-family:var(--mc-fb);font-size:11.5px;line-height:1.45;color:#68686A}
.mc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--mc-ft);font-weight:700;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;border-radius:1px;cursor:pointer;transition:background .16s ease,border-color .16s ease,color .16s ease,transform .1s ease;text-decoration:none}
.mc-btn:active{transform:scale(.985)}
.mc-btn-p{background:var(--mc-red);color:#fff;border:2px solid var(--mc-red);padding:14px 22px}
.mc-btn-p:hover{background:#9E2810;border-color:#9E2810}
.mc-btn-block{width:100%}
.mc-btn-g{background:transparent;color:#1B1916;border:1.5px solid var(--mc-bdr);padding:13px 22px}
.mc-btn-g:hover{border-color:var(--mc-red);color:var(--mc-red)}
.mc-cart-empty-ctas{display:flex;flex-direction:column;gap:10px;width:100%;max-width:280px}
.mc-cart-keep{display:block;width:100%;text-align:center;margin-top:10px;background:none;border:none;cursor:pointer;font-family:var(--mc-ft);font-weight:700;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#68686A;padding:6px;transition:color .16s ease}
.mc-cart-keep:hover{color:#1B1916}

@media(max-width:480px){
  .mc-cart-panel{width:100%}
  .mc-ci-thumb{width:54px;height:54px}
}
@media(prefers-reduced-motion:reduce){
  .mc-cart-panel,.mc-cart-ovl{transition-duration:.01ms}
  .mc-fly{display:none}
  .mc-ci.is-new,.mc-badge-bump,.mc-cart-hit{animation:none}
}`;
    var style = document.createElement('style');
    style.id = 'mc-cart-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ════════════════════════════════════════════════════════
     INIT
     ════════════════════════════════════════════════════════ */
  function init() {
    renderBadges();
    // Cualquier botón con [data-open-cart] o #nav-cart-btn abre el drawer
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open-cart],#nav-cart-btn');
      if (b) { e.preventDefault(); openDrawer(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
