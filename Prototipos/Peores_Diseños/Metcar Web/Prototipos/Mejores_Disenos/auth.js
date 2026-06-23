/* ============================================================
   METCAR — CUENTAS + SESIÓN + ENVÍO DE CORREO  (auth.js)
   ------------------------------------------------------------
   Prototipo SIN backend. Las cuentas se guardan en el navegador
   (localStorage) y los correos se envían con FormSubmit (servicio
   gratuito que reenvía formularios a un email, sin servidor).

   ►► El correo de PRUEBAS está en config.js → window.MC.email
      (ahora: aleravsacul@gmail.com).

   ⚠ FormSubmit pide una ACTIVACIÓN la primera vez: al enviar el
     primer correo, llega un mail a esa casilla con un botón
     "Activate Form". Hay que apretarlo UNA vez. Después, todos
     los pedidos llegan solos.

   API pública  ──────────────────────────────────────────────
     MCAuth.current()              → cuenta logueada (o null)
     MCAuth.register(datos)        → crea cuenta + inicia sesión (Promise)
     MCAuth.login(email, pass)     → inicia sesión (Promise)
     MCAuth.logout()
     MCAuth.onChange(fn)
     MCAuth.sendQuote(items, nota) → manda el pedido por correo (Promise)
   ============================================================ */
(function () {
  'use strict';
  if (window.MCAuth) return;

  var UKEY = 'mc_users', SKEY = 'mc_session';
  var listeners = [];

  function email() { return (window.MC && window.MC.email) || 'aleravsacul@gmail.com'; }
  function users() { try { return JSON.parse(localStorage.getItem(UKEY) || '[]'); } catch (e) { return []; } }
  function saveUsers(a) { localStorage.setItem(UKEY, JSON.stringify(a)); }
  function session() { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } }
  function setSession(s) { if (s) localStorage.setItem(SKEY, JSON.stringify(s)); else localStorage.removeItem(SKEY); notify(); }

  function notify() { renderNav(); listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  async function hash(s) {
    try {
      var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mc:' + s));
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join('');
    } catch (e) { return 'p:' + s; } // fallback (file://, navegadores viejos)
  }

  function normEmail(e) { return String(e || '').trim().toLowerCase(); }

  var MCAuth = {
    current: function () {
      var s = session(); if (!s) return null;
      return users().find(function (u) { return u.email === s.email; }) || null;
    },

    register: async function (d) {
      var e = normEmail(d.email);
      if (!e || !d.pass || !d.nombre) throw new Error('Faltan datos obligatorios.');
      var all = users();
      if (all.some(function (u) { return u.email === e; })) throw new Error('Ya existe una cuenta con ese correo. Probá iniciar sesión.');
      var user = {
        id: 'U' + Date.now().toString(36),
        nombre: d.nombre.trim(),
        email: e,
        pass: await hash(d.pass),
        tel: (d.tel || '').trim(),
        tipo: d.tipo || 'particular',
        dir: { calle: (d.calle || '').trim(), ciudad: (d.ciudad || '').trim(), depto: (d.depto || '').trim(), cp: (d.cp || '').trim() },
        estado: 'pendiente',          // pendiente → validado (lo valida Patricia)
        createdAt: new Date().toISOString()
      };
      all.push(user); saveUsers(all);
      setSession({ email: e });
      // Avisar a Metcar que se registró un cliente nuevo (no bloquea el registro)
      MCAuth.sendMail({
        _subject: 'Nuevo cliente registrado — ' + user.nombre,
        'Tipo de aviso': 'REGISTRO DE CLIENTE',
        Cliente: user.nombre,
        Email: user.email,
        Teléfono: user.tel || '—',
        'Tipo de cuenta': user.tipo === 'empresa' ? 'Empresa' : 'Particular',
        Dirección: dirText(user),
        Estado: 'Pendiente de validación',
        _template: 'table'
      }).catch(function () {});
      return user;
    },

    login: async function (eRaw, pass) {
      var e = normEmail(eRaw);
      var u = users().find(function (x) { return x.email === e; });
      if (!u) throw new Error('No encontramos una cuenta con ese correo.');
      var h = await hash(pass);
      if (h !== u.pass) throw new Error('La contraseña no es correcta.');
      setSession({ email: e });
      return u;
    },

    logout: function () { setSession(null); },
    onChange: function (fn) { listeners.push(fn); },

    /* Envío genérico vía FormSubmit (AJAX, sin backend) */
    sendMail: async function (fields) {
      var url = 'https://formsubmit.co/ajax/' + encodeURIComponent(email());
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (!res.ok) throw new Error('No se pudo enviar (HTTP ' + res.status + ').');
      return res.json();
    },

    /* Manda el pedido del cliente logueado a cotizar */
    sendQuote: async function (items, nota) {
      var u = MCAuth.current();
      if (!u) throw new Error('Tenés que iniciar sesión.');
      var pedido = (items || []).map(function (i, n) {
        var code = i.code && i.code.indexOf('CFG-') === 0 ? 'a medida' : i.code;
        var line = (n + 1) + '. ' + i.qty + 'x ' + i.p.name + ' (' + code + ')';
        var specs = (i.p.specs || []).join(' · ');
        if (specs) line += ' — ' + specs;
        if (i.p.configured && i.p.detail && i.p.detail.length) line += '\n   ' + i.p.detail.join(' | ');
        if (!i.p.stock) line += '\n   [sin stock — disponibilidad a confirmar]';
        return line;
      }).join('\n');
      var ref = 'MC-' + Date.now().toString(36).toUpperCase();
      var fields = {
        _subject: 'Nuevo pedido de cotización — ' + u.nombre + ' (' + ref + ')',
        'Tipo de aviso': 'PEDIDO DE COTIZACIÓN',
        Referencia: ref,
        Cliente: u.nombre,
        Email: u.email,
        Teléfono: u.tel || '—',
        'Tipo de cuenta': u.tipo === 'empresa' ? 'Empresa' : 'Particular',
        Dirección: dirText(u),
        'Estado de cuenta': u.estado === 'validado' ? 'Validada' : 'Pendiente de validación',
        Pedido: pedido || '(vacío)',
        Nota: (nota || '').trim() || '—',
        _template: 'table'
      };
      var r = await MCAuth.sendMail(fields);
      return { ref: ref, result: r, estado: u.estado };
    }
  };

  function dirText(u) {
    var d = u.dir || {};
    var parts = [d.calle, d.ciudad, d.depto].filter(Boolean).join(', ');
    if (d.cp) parts += (parts ? ' · CP ' : 'CP ') + d.cp;
    return parts || '—';
  }

  window.MCAuth = MCAuth;

  /* ════════════════════════════════════════════════════════
     BOTÓN "INGRESAR" / MENÚ DE CUENTA  (en todas las páginas)
     ════════════════════════════════════════════════════════ */
  function injectStyles() {
    if (document.getElementById('mc-auth-styles')) return;
    var css = ''
      + '.mc-acct{position:relative}'
      + '.mc-acct-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.18);'
      + 'color:rgba(255,255,255,.78);padding:6px 13px 6px 9px;margin-left:10px;font-family:"Barlow Condensed",sans-serif;'
      + 'font-weight:700;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;border-radius:1px;cursor:pointer;'
      + 'transition:border-color .16s ease,color .16s ease;background:none}'
      + '.mc-acct-btn:hover{border-color:rgba(255,255,255,.45);color:#fff}'
      + '.mc-acct-av{width:21px;height:21px;border-radius:50%;background:#B83214;color:#fff;display:flex;align-items:center;'
      + 'justify-content:center;font-size:11px;font-weight:700;letter-spacing:0;flex-shrink:0}'
      + '.mc-acct-ca{transition:transform .2s ease}'
      + '.mc-acct.open .mc-acct-ca{transform:rotate(180deg)}'
      + '.mc-acct-menu{position:absolute;top:calc(100% + 9px);right:0;width:248px;background:#fff;border-radius:3px;'
      + 'box-shadow:0 16px 44px rgba(0,0,0,.32);opacity:0;visibility:hidden;transform:translateY(-6px);'
      + 'transition:opacity .18s ease,transform .18s ease,visibility .18s;z-index:300;overflow:hidden}'
      + '.mc-acct.open .mc-acct-menu{opacity:1;visibility:visible;transform:translateY(0)}'
      + '.mc-acct-top{background:#1B1916;padding:16px 16px 15px;border-bottom:2px solid #B83214}'
      + '.mc-acct-nm{font-family:"Barlow Condensed",sans-serif;font-weight:700;font-size:15px;letter-spacing:.5px;color:#fff;line-height:1.1}'
      + '.mc-acct-em{font-family:"Barlow",sans-serif;font-size:12px;color:rgba(255,255,255,.5);margin-top:2px;word-break:break-all}'
      + '.mc-acct-badge{display:inline-flex;align-items:center;gap:5px;margin-top:9px;font-family:"Barlow Condensed",sans-serif;'
      + 'font-weight:700;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;border-radius:2px}'
      + '.mc-acct-badge .d{width:5px;height:5px;border-radius:50%}'
      + '.mc-acct-badge.ok{background:rgba(31,138,91,.16);color:#7fd3a8}.mc-acct-badge.ok .d{background:#1F8A5B}'
      + '.mc-acct-badge.pend{background:rgba(245,197,24,.16);color:#e3c45a}.mc-acct-badge.pend .d{background:#F5C518}'
      + '.mc-acct-links{padding:6px}'
      + '.mc-acct-li{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px 11px;border-radius:2px;'
      + 'font-family:"Barlow",sans-serif;font-size:13.5px;color:#1B1916;cursor:pointer;background:none;border:none;'
      + 'transition:background .14s ease}'
      + '.mc-acct-li:hover{background:#F4F2EC}'
      + '.mc-acct-li svg{color:#68686A;flex-shrink:0}'
      + '.mc-acct-li.danger{color:#B83214}.mc-acct-li.danger svg{color:#B83214}'
      + '.mc-acct-sep{height:1px;background:rgba(27,25,22,.09);margin:4px 8px}';
    var st = document.createElement('style'); st.id = 'mc-auth-styles'; st.textContent = css;
    document.head.appendChild(st);
  }

  function initials(name) {
    var p = String(name || '').trim().split(/\s+/);
    return ((p[0] || '')[0] || '') + (p.length > 1 ? (p[p.length - 1][0] || '') : '');
  }
  function firstName(name) { return String(name || '').trim().split(/\s+/)[0] || 'Mi cuenta'; }

  var built = [];   // botones ya envueltos (se reconstruyen en cada cambio de sesión)
  function renderNav() {
    // Envolver los botones originales una sola vez
    document.querySelectorAll('.btn-login:not([data-mc-skip])').forEach(function (orig) {
      if (orig.dataset.mcBuilt === '1') return;
      orig.dataset.mcBuilt = '1';
      injectStyles();
      var wrap = document.createElement('div');
      wrap.className = 'mc-acct';
      orig.parentNode.insertBefore(wrap, orig);
      wrap.appendChild(orig);
      orig.__mcWrap = wrap;
      built.push(orig);
    });
    // Re-pintar TODOS según el estado de sesión actual (login/logout en vivo)
    built.forEach(function (orig) { if (orig.isConnected) buildAcct(orig); });
  }

  function buildAcct(orig) {
    var u = MCAuth.current();
    var wrap = orig.__mcWrap;
    // limpiar menú previo
    var oldMenu = wrap.querySelector('.mc-acct-menu'); if (oldMenu) oldMenu.remove();

    if (!u) {
      orig.className = 'btn-login';
      orig.style.display = '';
      orig.textContent = 'Ingresar';
      orig.onclick = function () { location.href = loginHref(); };
      return;
    }

    // Logueado → botón con avatar + menú
    orig.className = 'mc-acct-btn';
    orig.innerHTML = '<span class="mc-acct-av">' + esc(initials(u.nombre).toUpperCase()) + '</span>'
      + '<span>' + esc(firstName(u.nombre)) + '</span>'
      + '<svg class="mc-acct-ca" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

    var badge = u.estado === 'validado'
      ? '<span class="mc-acct-badge ok"><span class="d"></span>Cuenta validada</span>'
      : '<span class="mc-acct-badge pend"><span class="d"></span>Pendiente de validación</span>';

    var menu = document.createElement('div');
    menu.className = 'mc-acct-menu';
    menu.innerHTML =
      '<div class="mc-acct-top">'
        + '<div class="mc-acct-nm">' + esc(u.nombre) + '</div>'
        + '<div class="mc-acct-em">' + esc(u.email) + '</div>'
        + badge
      + '</div>'
      + '<div class="mc-acct-links">'
        + '<button class="mc-acct-li" data-go="carrito.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Mi pedido</button>'
        + '<div class="mc-acct-sep"></div>'
        + '<button class="mc-acct-li danger" data-logout><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>Cerrar sesión</button>'
      + '</div>';
    wrap.appendChild(menu);

    orig.onclick = function (e) { e.stopPropagation(); wrap.classList.toggle('open'); };
    menu.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]'); if (go) { location.href = go.getAttribute('data-go'); return; }
      if (e.target.closest('[data-logout]')) { wrap.classList.remove('open'); MCAuth.logout(); }
    });
  }

  function updateAcct(btn) {}

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]); }); }
  function loginHref() {
    var here = location.pathname.split('/').pop() || 'index.html';
    return 'login.html?next=' + encodeURIComponent(here + location.search);
  }

  // Cerrar menú al hacer click afuera
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.mc-acct.open').forEach(function (w) { if (!w.contains(e.target)) w.classList.remove('open'); });
  });

  function init() { renderNav(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
