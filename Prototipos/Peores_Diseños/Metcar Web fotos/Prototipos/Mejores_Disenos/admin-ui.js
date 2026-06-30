/* ============================================================
   METCAR — PANEL INTERNO · Render UI  (admin-ui.js)
   Router por hash + render de cada sección. Lee/escribe vía MCAdmin.
   ============================================================ */
(function () {
  'use strict';
  window.boot = boot;

  /* ── helpers ── */
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]);}); }
  function el(id){ return document.getElementById(id); }
  function initials(n){ var p=String(n||'').trim().split(/\s+/); return (((p[0]||'')[0]||'')+(p.length>1?(p[p.length-1][0]||''):'')).toUpperCase(); }
  function money(n){ return 'US$ '+ (Number(n)||0).toLocaleString('es-UY',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function fmtDate(iso){ var d=new Date(iso); if(isNaN(d))return'—'; return d.toLocaleDateString('es-UY',{day:'2-digit',month:'short',year:'numeric'}); }
  function fmtDateTime(iso){ var d=new Date(iso); if(isNaN(d))return'—'; return d.toLocaleDateString('es-UY',{day:'2-digit',month:'short'})+' · '+d.toLocaleTimeString('es-UY',{hour:'2-digit',minute:'2-digit'}); }
  function timeAgo(iso){
    var d=new Date(iso); if(isNaN(d))return'—';
    var s=(Date.now()-d)/1000;
    if(s<60)return'hace instantes'; if(s<3600)return'hace '+Math.floor(s/60)+' min';
    if(s<86400)return'hace '+Math.floor(s/3600)+' h'; var d=Math.floor(s/86400);
    if(d===1)return'ayer'; if(d<30)return'hace '+d+' días'; return fmtDate(iso);
  }
  function icon(cat){ var C=window.MC_CATALOG; return (C&&C.ICONS[cat])||'<svg width="30" height="26" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'; }
  function catName(id){ return (window.MC_CATALOG&&MC_CATALOG.catName(id))||id; }
  function ic(name){
    var P={fill:'none',stroke:'currentColor','stroke-width':'1.9','stroke-linecap':'round','stroke-linejoin':'round'};
    var paths={
      arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',
      check:'<path d="M20 6 9 17l-5-5"/>',
      x:'<path d="M18 6 6 18M6 6l12 12"/>',
      user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      box:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
      chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
      star:'<path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
      dollar:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
      alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      truck:'<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      wa:'<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
      edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
      note:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
      file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
      upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
      clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
      print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
      tag:'<path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
      bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
      sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
      sheet:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>',
      pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
      pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
      play:'<polygon points="5 3 19 12 5 21 5 3"/>',
      eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
      copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'
    };
    var attr=Object.keys(P).map(function(k){return k+'="'+P[k]+'"';}).join(' ');
    return '<svg viewBox="0 0 24 24" width="16" height="16" '+attr+'>'+(paths[name]||'')+'</svg>';
  }
  function stars(r){ var out=''; for(var i=1;i<=5;i++){ out+='<svg viewBox="0 0 24 24" fill="'+(i<=r?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.5" class="'+(i<=r?'':'off')+'"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>'; } return '<span class="stars">'+out+'</span>'; }

  function toast(msg){ var t=el('toast'); el('toast-tx').textContent=msg; t.classList.add('show'); clearTimeout(t._tm); t._tm=setTimeout(function(){t.classList.remove('show');},2600); }

  /* modal de confirmación */
  function confirmModal(opts){
    var m=el('modal');
    el('modal-h').textContent=opts.title||'Confirmar';
    el('modal-p').textContent=opts.text||'';
    el('modal-extra').innerHTML=opts.extra||'';
    var ok=el('modal-ok'); ok.textContent=opts.okLabel||'Confirmar';
    ok.className='btn btn-sm '+(opts.danger?'btn-pri':'btn-dark');
    m.classList.add('show');
    function onKey(e){ if(e.key==='Escape') close(); }
    function close(){ m.classList.remove('show'); ok.onclick=null; document.removeEventListener('keydown',onKey); }
    ok.onclick=function(){ var extra=el('modal-extra').querySelector('textarea,input'); close(); if(opts.onOk) opts.onOk(extra?extra.value:null); };
    m.querySelectorAll('[data-close]').forEach(function(b){ b.onclick=close; });
    document.addEventListener('keydown',onKey);
    setTimeout(function(){ var f=el('modal-extra').querySelector('input,textarea')||ok; try{ f.focus(); }catch(e){} },30);
  }

  /* ── WhatsApp ── */
  function waLink(tel, msg){
    var num=String(tel||'').replace(/\D/g,''); if(num&&num[0]==='0')num=num.slice(1); if(num&&num.length<=9)num='598'+num;
    return 'https://wa.me/'+num+'?text='+encodeURIComponent(msg||'');
  }

  /* ════════════════ ROUTER ════════════════ */
  var ROUTES = {
    dashboard:{ crumb:['Resumen'], render:renderDashboard },
    pedidos:{ crumb:['Pedidos'], render:renderPedidos },
    clientes:{ crumb:['Clientes'], render:renderClientes },
    catalogo:{ crumb:['Catálogo'], render:renderCatalogo },
    consultas:{ crumb:['Consultas'], render:renderConsultas },
    resenas:{ crumb:['Reseñas'], render:renderResenas },
    config:{ crumb:['Configuración'], render:renderConfig },
    taller:{ crumb:['Taller (Maxi)'], render:renderTaller }
  };

  function parseHash(){
    var h=(location.hash||'#/dashboard').replace(/^#\/?/,'');
    var parts=h.split('/');
    return { name:parts[0]||'dashboard', arg:parts[1]?decodeURIComponent(parts[1]):null };
  }
  function go(route){ location.hash='#/'+route; }
  function route(){
    var p=parseHash();
    priceUndo=null;
    // detail routes
    if(p.name==='pedido'){ renderPedidoDetail(p.arg); setActive('pedidos'); setCrumbs(['Pedidos','Pedido '+p.arg]); window.scrollTo(0,0); return; }
    if(p.name==='cliente'){ renderClienteDetail(p.arg); setActive('clientes'); setCrumbs(['Clientes', (MCAdmin.userByEmail(p.arg)||{}).nombre||'Cliente']); window.scrollTo(0,0); return; }
    var r=ROUTES[p.name]||ROUTES.dashboard;
    setActive(p.name in ROUTES ? p.name : 'dashboard');
    setCrumbs(r.crumb);
    r.render();
    window.scrollTo(0,0);
  }
  function setActive(name){ document.querySelectorAll('.sb-link').forEach(function(b){ b.classList.toggle('on', b.dataset.route===name); }); }
  function setCrumbs(arr){
    var html='<span class="c">Panel</span>';
    arr.forEach(function(c,i){ html+='<span class="sep">/</span><span class="c'+(i===arr.length-1?' on':'')+'">'+esc(c)+'</span>'; });
    el('crumbs').innerHTML=html;
  }

  /* ════════════════ SIDEBAR BADGES ════════════════ */
  function updateBadges(){
    var orders=MCAdmin.orders();
    var pedAcc=orders.filter(function(o){return o.estadoIdx===2||o.estadoIdx===3;}).length;
    var cli=MCAdmin.users().filter(function(u){return u.estado==='pendiente';}).length;
    var con=MCAdmin.consultas().filter(function(c){return c.estado==='nueva';}).length;
    var res=MCAdmin.resenas().filter(function(r){return r.estado==='pendiente';}).length;
    var tal=orders.filter(function(o){return o.estadoIdx===4;}).length;
    var map={pedidos:pedAcc,clientes:cli,consultas:con,resenas:res,taller:tal};
    document.querySelectorAll('.sb-count').forEach(function(b){ var n=map[b.dataset.c]||0; b.textContent=n; b.style.display=n?'flex':'none'; });
  }

  /* ════════════════ DASHBOARD ════════════════ */
  function renderDashboard(){
    var orders=MCAdmin.orders();
    var users=MCAdmin.users();
    var queue=MCAdmin.actionQueue();
    var low=MCAdmin.lowStock();

    var enCurso=orders.filter(function(o){return o.estadoIdx>=2&&o.estadoIdx<=6;}).length;
    var aCotizar=orders.filter(function(o){return o.estadoIdx===2;}).length;
    var pendCuentas=users.filter(function(u){return u.estado==='pendiente';}).length;
    var mesCompletados=orders.filter(function(o){return o.estadoIdx===7;}).length;

    var qIcons={cuenta:'user',cotizar:'dollar',pago:'check',consulta:'chat',resena:'star'};
    var qHTML = queue.length ? queue.slice(0,7).map(function(q){
      return '<div class="aq-item" data-q="'+esc(q.type)+'" data-arg="'+esc(q.ref||q.id||q.email||'')+'" data-email="'+esc(q.email||'')+'">'+
        '<div class="aq-ic t-'+q.type+'">'+ic(qIcons[q.type])+'</div>'+
        '<div class="aq-main"><div class="aq-l">'+esc(q.label)+(q.ref?' · '+esc(q.ref):'')+'</div><div class="aq-w">'+esc(q.who||'')+'</div></div>'+
        '<span class="aq-when">'+esc(timeAgo(q.when))+'</span>'+
        '<span class="aq-go">'+ic('arrow')+'</span>'+
      '</div>';
    }).join('') : '<div class="aq-empty">'+ic('check').replace('width="16" height="16"','width="34" height="34"')+'<p>Todo al día. No hay nada pendiente.</p></div>';

    var recent = orders.slice(0,6).map(function(o){
      var st=MCAdmin.stateOf(o.estadoIdx); var u=MCAdmin.userByEmail(o.email);
      return '<div class="mini-row"><div class="mini-dot" style="background:'+(st.phase==='completado'?'var(--green)':st.phase==='cotizacion'?'var(--yel)':'var(--red)')+'"></div>'+
        '<div><div class="mini-tx"><b>'+esc(o.ref)+'</b> · '+esc((u&&u.nombre)||o.email)+' · '+esc(st.full)+'</div><div class="mini-tm">'+esc(timeAgo(o.createdAt))+'</div></div></div>';
    }).join('');

    var alerts='';
    if(pendCuentas) alerts+='<div class="alert-row">'+ic('user')+'<div class="alert-tx"><b>'+pendCuentas+'</b> cuenta'+(pendCuentas>1?'s':'')+' nueva'+(pendCuentas>1?'s':'')+' esperando validación</div><button class="btn btn-ghost btn-sm" data-route="clientes">Revisar</button></div>';
    if(aCotizar) alerts+='<div class="alert-row">'+ic('dollar')+'<div class="alert-tx"><b>'+aCotizar+'</b> pedido'+(aCotizar>1?'s':'')+' sin cotizar</div><button class="btn btn-ghost btn-sm" data-route="pedidos">Ver</button></div>';
    if(low.length) alerts+='<div class="alert-row">'+ic('alert')+'<div class="alert-tx"><b>'+low.length+'</b> producto'+(low.length>1?'s':'')+' sin stock en catálogo</div><button class="btn btn-ghost btn-sm" data-route="catalogo">Gestionar</button></div>';
    if(!alerts) alerts='<div class="alert-row" style="color:var(--txt3)">'+ic('check')+'<div class="alert-tx">Sin alertas. Stock y cuentas en orden.</div></div>';

    el('view').innerHTML =
      '<div class="vhead"><div class="vh-eyebrow">Panel interno</div><h1 class="vh-title">Buen día, Patricia</h1></div>'+

      '<div class="kpis">'+
        kpi('k-red',enCurso,'box','Pedidos en curso','Activos en el sistema')+
        kpi('k-yel',aCotizar,'dollar','Por cotizar','Esperan tu precio')+
        kpi('k-blk',pendCuentas,'user','Cuentas a validar','Clientes nuevos')+
        kpi('k-grn',mesCompletados,'check','Completados','Histórico')+
      '</div>'+

      '<div class="grid2" style="margin-top:14px">'+
        '<div class="card"><div class="cbox-h">'+ic('clock')+' Requiere tu atención <button class="sect-link" data-route="pedidos">Ver pedidos '+ic('arrow')+'</button></div><div class="aq">'+qHTML+'</div></div>'+
        '<div>'+
          '<div class="card" style="margin-bottom:14px"><div class="cbox-h">Alertas</div><div>'+alerts+'</div></div>'+
          '<div class="card"><div class="cbox-h">Actividad reciente</div><div class="mini">'+(recent||'<div class="mini-row"><div class="mini-tx" style="color:var(--txt3)">Sin movimientos.</div></div>')+'</div></div>'+
        '</div>'+
      '</div>';

    el('view').querySelectorAll('[data-q]').forEach(function(item){
      item.addEventListener('click',function(){
        var t=item.dataset.q, arg=item.dataset.arg, email=item.dataset.email;
        if(t==='cotizar'||t==='pago') go('pedido/'+arg);
        else if(t==='cuenta') go('cliente/'+email);
        else if(t==='consulta') go('consultas');
        else if(t==='resena') go('resenas');
      });
    });
    el('view').querySelectorAll('[data-route]').forEach(function(b){ b.addEventListener('click',function(e){e.stopPropagation();go(b.dataset.route);}); });
  }
  function kpi(cls,n,icn,label,desc){
    return '<div class="kpi '+cls+'"><div class="kpi-top"><div class="kpi-n">'+n+'</div><div class="kpi-ic">'+ic(icn)+'</div></div>'+
      '<div class="kpi-l">'+label+'</div><div class="kpi-d">'+desc+'</div></div>';
  }

  /* ════════════════ PEDIDOS ════════════════ */
  var priceUndo=null;
  var pedFilter='accion';
  function renderPedidos(){
    var orders=MCAdmin.orders();
    var counts={ todos:orders.length, accion:0, cotizacion:0, curso:0, completado:0 };
    orders.forEach(function(o){ var ph=MCAdmin.stateOf(o.estadoIdx).phase; counts[ph]++; if(o.estadoIdx===2||o.estadoIdx===3) counts.accion++; });

    function chip(k,l){ return '<button class="chip'+(pedFilter===k?' on':'')+'" data-f="'+k+'">'+l+'<b>'+(counts[k]||0)+'</b></button>'; }
    var list=orders.filter(function(o){
      if(pedFilter==='todos')return true;
      if(pedFilter==='accion')return o.estadoIdx===2||o.estadoIdx===3;
      return MCAdmin.stateOf(o.estadoIdx).phase===pedFilter;
    });

    var rows=list.map(function(o){
      var st=MCAdmin.stateOf(o.estadoIdx); var u=MCAdmin.userByEmail(o.email);
      var units=(o.items||[]).reduce(function(s,i){return s+i.qty;},0);
      return '<tr class="clk" data-ref="'+esc(o.ref)+'">'+
        '<td><div class="t-ref">'+esc(o.ref)+'</div><div class="t-mut">'+esc(fmtDate(o.createdAt))+'</div></td>'+
        '<td><div class="t-strong">'+esc((u&&u.nombre)||o.email)+'</div><div class="t-mut">'+esc((u&&u.dir&&u.dir.depto)||'')+'</div></td>'+
        '<td><span class="t-mut">'+(o.items||[]).length+' líneas · '+units+' u.</span></td>'+
        '<td><span class="pill '+st.phase+'"><span class="d"></span>'+esc(st.full)+'</span></td>'+
        '<td class="t-right"><span class="aq-go">'+ic('arrow')+'</span></td>'+
      '</tr>';
    }).join('');

    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Operación</div><h1 class="vh-title">Pedidos</h1></div>'+
      '<div class="toolbar"><div class="chips">'+chip('accion','Requieren acción')+chip('cotizacion','En cotización')+chip('curso','En curso')+chip('completado','Completados')+chip('todos','Todos')+'</div>'+
      '<div class="tb-search">'+ic('search')+'<input type="text" id="ped-q" placeholder="Buscar por cliente o referencia…"></div></div>'+
      (list.length?'<table class="tbl"><thead><tr><th>Pedido</th><th>Cliente</th><th>Ítems</th><th>Estado</th><th></th></tr></thead><tbody id="ped-body">'+rows+'</tbody></table>'
        :'<div class="empty"><div class="empty-ic">'+ic('box').replace('width="16" height="16"','width="26" height="26"')+'</div><div class="empty-h">Sin pedidos en este filtro</div><p class="empty-t">Probá con otro estado.</p></div>');

    el('view').querySelectorAll('[data-f]').forEach(function(c){ c.onclick=function(){ pedFilter=c.dataset.f; renderPedidos(); }; });
    el('view').querySelectorAll('tr[data-ref]').forEach(function(r){ r.onclick=function(){ go('pedido/'+r.dataset.ref); }; });
    var q=el('ped-q'); if(q) q.oninput=function(){
      var v=q.value.toLowerCase().trim();
      el('ped-body').querySelectorAll('tr').forEach(function(tr){ tr.style.display = (!v||tr.textContent.toLowerCase().indexOf(v)>=0)?'':'none'; });
    };
  }

  function renderPedidoDetail(ref){
    var o=MCAdmin.orderByRef(ref);
    if(!o){ el('view').innerHTML='<a class="back" data-back>'+ic('arrow')+' Volver</a><div class="empty"><div class="empty-h">Pedido no encontrado</div></div>'; bindBack(); return; }
    var u=MCAdmin.userByEmail(o.email)||{};
    var st=MCAdmin.stateOf(o.estadoIdx);
    var quote=MCAdmin.quote(o);
    var hasStockIssue=(o.items||[]).some(function(i){return MCAdmin.lineStockState(i)==='out';});

    var itemsHTML=(o.items||[]).map(function(it,i){
      var meta=it.configured?'Manguera a medida':catName(it.cat); var specs=(it.specs||[]).join(' · ');
      var detail=it.configured&&it.detail?('<div style="margin-top:7px;display:flex;flex-direction:column;gap:2px">'+it.detail.map(function(d){return '<span class="t-mut" style="font-size:11.5px">'+esc(d)+'</span>';}).join('')+'</div>'):'';
      var ss=MCAdmin.lineStockState(it);
      var tagMap={ok:['st-ok','En stock'],out:['st-rej','Sin stock'],delay:['st-pend','Con demora']};
      var tg=tagMap[ss]||tagMap.ok;
      var tag='<span class="tag-st '+tg[0]+'" style="margin-left:8px"><span class="d"></span>'+tg[1]+'</span>';
      var noteTxt='';
      if(ss==='out'||ss==='delay'){
        var bits=[]; if(it.missingComp)bits.push(it.missingComp); if(it.stockNote)bits.push(it.stockNote); if(it.restockDate)bits.push('repone '+it.restockDate);
        if(bits.length) noteTxt='<span class="oi-stocknote '+ss+'">'+ic('alert')+esc(bits.join(' · '))+'</span>';
      }
      var stockBtn='<button class="lnk-stock" data-stock-edit="'+i+'">'+ic('box')+(it.qty>1?'Stock / dividir':'Editar stock')+'</button>';
      return '<div class="oi"><div class="oi-th">'+icon(it.cat)+'</div><div class="oi-m"><div class="oi-n">'+esc(it.name)+tag+'</div><div class="oi-mt">'+esc(meta)+(specs?' · '+esc(specs):'')+' · '+esc(it.code)+'</div>'+detail+
        '<div class="oi-stock">'+noteTxt+stockBtn+'</div>'+
      '</div><div class="oi-q">×'+it.qty+'</div></div>';
    }).join('');

    /* pricing */
    function fmtM(n){ return (Number(n)||0).toLocaleString('es-UY',{minimumFractionDigits:2,maximumFractionDigits:2})+' m'; }
    var priceRows=quote.lines.map(function(l,i){
      var bd = l.cfg ? (l.cfg.found
        ? '<div class="t-mut" style="font-size:11px;margin-top:3px">'+fmtM(l.cfg.meters)+' × '+money(l.cfg.perMeter)+'/m'+(l.cfg.hoseCode?' ('+esc(l.cfg.hoseCode)+')':'')+'<br>+ Terminal A '+money(l.cfg.termA.price)+' · Terminal B '+money(l.cfg.termB.price)+'</div>'
        : '<div class="t-mut" style="font-size:11px;margin-top:3px;color:var(--red)">No se pudo calcular el costo automáticamente. Ingresá el precio a mano</div>') : '';
      if(l.excluded){
        var emsg=[]; if(l.missingComp)emsg.push(l.missingComp); if(l.stockNote)emsg.push(l.stockNote);
        return '<tr class="prow-excl"><td class="pname"><span>'+esc(l.name)+'</span><div class="t-mut nm-on">'+esc(l.code)+(l.configured?' · a medida':'')+'</div>'+
          (emsg.length?'<div class="t-mut nm-on" style="color:var(--red);margin-top:3px">'+esc(emsg.join(' · '))+'</div>':'')+'</td>'+
          '<td>'+l.qty+'</td><td>'+money(l.base)+'</td>'+
          '<td><span class="t-mut">—</span></td>'+
          '<td><span class="tag-st st-rej"><span class="d"></span>No suma</span></td></tr>';
      }
      return '<tr><td class="pname">'+esc(l.name)+'<div class="t-mut">'+esc(l.code)+(l.configured?' · a medida':'')+'</div>'+bd+'</td>'+
        '<td>'+l.qty+'</td>'+
        '<td>'+money(l.base)+'</td>'+
        '<td><input class="pov'+(l.override?' edited':'')+'" data-ov="'+i+'" type="number" step="0.01" min="0" value="'+l.unit.toFixed(2)+'"></td>'+
        '<td><b style="color:var(--txt)">'+money(l.subtotal)+'</b></td></tr>';
    }).join('');

    var advHTML=MCAdmin.STATES.map(function(s){
      var cls=s.idx<o.estadoIdx?'done':(s.idx===o.estadoIdx?'cur':'');
      return '<div class="adv-step '+cls+'"><div class="adv-dot">'+(s.idx<o.estadoIdx?ic('check'):'')+'</div><div class="adv-t">'+esc(s.full)+'</div>'+(s.idx===o.estadoIdx?'<span class="adv-cur-lbl">Actual</span>':'')+'</div>';
    }).join('');

    /* next action button */
    var nextBtn='';
    if(o.estadoIdx===1) nextBtn='<button class="btn btn-pri" data-validate><span>'+ic('check')+'</span>Validar cuenta del cliente</button>';
    else if(o.estadoIdx===2) nextBtn='<button class="btn btn-pri" data-savequote><span>'+ic('check')+'</span>Enviar cotización al cliente</button>';
    else if(o.estadoIdx===3) nextBtn='<button class="btn btn-grn" data-confirmpay><span>'+ic('check')+'</span>Confirmar pago recibido</button>';
    else if(o.estadoIdx===4) nextBtn='<button class="btn btn-dark" data-advance="5"><span>'+ic('check')+'</span>Marcar listo para despachar</button>';
    else if(o.estadoIdx===5) nextBtn='<button class="btn btn-dark" data-ship><span>'+ic('truck')+'</span>Registrar envío</button>';
    else if(o.estadoIdx===6) nextBtn='<button class="btn btn-grn" data-advance="7"><span>'+ic('check')+'</span>Marcar como entregado</button>';

    var activity=MCAdmin.activity(ref);
    var actHTML = activity.length ? activity.map(function(a){ return '<div class="mini-row"><div class="mini-dot"></div><div><div class="mini-tx">'+esc(a.text)+'</div><div class="mini-tm">'+esc(a.by)+' · '+esc(fmtDateTime(a.t))+'</div></div></div>'; }).join('')
      : '<div class="mini-row"><div class="mini-tx" style="color:var(--txt3)">Pedido recibido. Sin acciones registradas todavía.</div></div>';

    var waMsg='¡Hola '+(u.nombre||'')+'! Te escribo de Metcar por tu pedido '+o.ref+'.';

    var compHTML = (o.estadoIdx>=3) ? ('<div class="cbox"><div class="cbox-h">'+ic('file')+' Comprobante de pago</div><div class="cbox-b">'+
      (o.comprobante
        ? '<div class="notebox" style="background:rgba(31,138,91,.08);border:1px solid rgba(31,138,91,.25)">'+ic('check')+'<p><b>'+esc(o.comprobante)+'</b><br><span class="t-mut">Subido por el cliente</span></p></div><button class="btn btn-ghost btn-sm" data-comp-view style="width:100%;margin-top:10px"><span>'+ic('eye')+'</span>Ver comprobante</button>'
        : '<p class="t-mut">El cliente todavía no subió comprobante. Podés avanzar el pedido igual.</p>')+
      '</div></div>') : '';

    el('view').innerHTML=
      '<a class="back" data-back>'+ic('arrow')+' Volver a pedidos</a>'+
      '<div class="dt-head"><div><div class="vh-eyebrow">Pedido</div><h1 class="vh-title">'+esc(o.ref)+'</h1>'+
        '<div style="display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap"><span class="pill '+st.phase+'"><span class="d"></span>'+esc(st.full)+'</span><span class="t-mut">'+esc(fmtDateTime(o.createdAt))+'</span></div></div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+nextBtn+'<a class="btn btn-wa" href="'+waLink(u.tel,waMsg)+'" target="_blank"><span>'+ic('wa')+'</span>WhatsApp</a><button class="btn btn-ghost btn-sm" data-print><span>'+ic('print')+'</span>Imprimir</button></div>'+
      '</div>'+

      (hasStockIssue?'<div class="notebox" style="background:rgba(245,197,24,.1);border:1px solid rgba(245,197,24,.35);margin-bottom:16px">'+ic('alert')+'<p><b>Atención:</b> este pedido tiene productos sin stock. Las líneas marcadas <b>“Sin stock”</b> quedan en gris y <b>no se suman</b> al total. El cliente verá esa cotización y podrá aceptar el resto o editar el pedido.</p></div>':'')+

      '<div class="dt-grid"><div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('box')+' Productos del pedido <span class="t-mut">'+(o.items||[]).length+' líneas</span></div><div class="cbox-b flush">'+itemsHTML+'</div></div>'+
        (o.nota?'<div class="cbox"><div class="cbox-h">'+ic('note')+' Nota del cliente</div><div class="cbox-b"><div class="notebox">'+ic('chat')+'<p>'+esc(o.nota)+'</p></div></div></div>':'')+

        '<div class="cbox"><div class="cbox-h">'+ic('dollar')+' Cotización <span class="t-mut">interno · no visible al cliente</span></div>'+
          '<div class="mult-row"><label>Multiplicador del pedido</label><input type="number" step="0.05" min="0" id="multinput" value="'+quote.mult.toFixed(2)+'"><span class="note">Cliente: ×'+((u.mult!=null?u.mult:1).toFixed(2))+(o.multOverride!=null?' · override aplicado':'')+'</span></div>'+
          '<div class="cbox-b" style="padding:6px 14px;overflow-x:auto"><table class="ptbl"><thead><tr><th>Producto</th><th>Cant.</th><th>Base USD</th><th>Precio final</th><th>Subtotal</th></tr></thead><tbody id="pbody">'+priceRows+'</tbody></table></div>'+
          (quote.excludedCount?'<div class="ptot-note">'+ic('alert')+'<span>'+quote.excludedCount+' producto'+(quote.excludedCount>1?'s':'')+' sin stock — no se suma'+(quote.excludedCount>1?'n':'')+' a la cotización</span></div>':'')+
          '<div class="ptot"><span class="l">Total cotización</span><span class="v" id="ptotal">'+money(quote.total)+'</span></div>'+
        '</div>'+
      '</div>'+

      '<div>'+
        '<div class="cbox"><div class="cbox-h">Avanzar estado</div><div class="cbox-b"><div class="adv">'+advHTML+'</div></div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('user')+' Cliente</div><div class="cbox-b">'+
          '<div class="t-strong" style="font-size:15px">'+esc(u.nombre||o.email)+'</div>'+
          '<div class="t-mut" style="margin:3px 0 10px">'+esc(u.email||'')+'</div>'+
          clientStateTag(u)+
          '<div style="margin-top:14px;display:flex;flex-direction:column;gap:7px">'+
            infoLine('Teléfono',u.tel||'—')+infoLine('Tipo',u.tipo==='empresa'?'Empresa':'Particular')+
            infoLine('Dirección',(u.dir&&[u.dir.calle,u.dir.ciudad,u.dir.depto].filter(Boolean).join(', '))||'—')+
          '</div>'+
          '<button class="btn btn-ghost btn-sm" data-client="'+esc(o.email)+'" style="width:100%;margin-top:14px">Ver ficha del cliente</button>'+
        '</div></div>'+
        compHTML+
        (o.encomienda?'<div class="cbox"><div class="cbox-h">'+ic('truck')+' Envío</div><div class="cbox-b">'+infoLine('N° de encomienda',o.encomienda)+'</div></div>':'')+
        '<div class="cbox"><div class="cbox-h">'+ic('clock')+' Bitácora</div><div class="mini">'+actHTML+'</div></div>'+
      '</div></div>';

    bindBack();
    el('view').querySelectorAll('[data-stock-edit]').forEach(function(b){ b.onclick=function(){ stockModal(o, +b.dataset.stockEdit); }; });
    el('view').querySelector('[data-print]').onclick=function(){ window.print(); };
    var cb=el('view').querySelector('[data-client]'); if(cb) cb.onclick=function(){ go('cliente/'+cb.dataset.client); };
    var cv=el('view').querySelector('[data-comp-view]'); if(cv) cv.onclick=function(){ toast('El archivo se descarga en la versión con backend'); };

    /* live pricing con override por ítem, multiplicador y deshacer (Ctrl+Z) */
    var manual={};
    quote.lines.forEach(function(l,i){ if(l.override) manual[i]=true; });
    var bases=(o.items||[]).map(function(it){ return it.configured?(MCAdmin.configuredCost(it).total):MCAdmin.priceOf(it.code); });
    var hist=[];

    function recompute(fromMult){
      var mult=parseFloat(el('multinput').value)||0;
      var rows=el('view').querySelectorAll('#pbody tr');
      var ov={}, total=0;
      (o.items||[]).forEach(function(it,i){
        if(MCAdmin.lineStockState(it)==='out') return;   // sin stock: no suma
        var auto=bases[i]*mult, inp=rows[i]&&rows[i].querySelector('.pov');
        if(inp&&!manual[i]&&fromMult){ inp.value=auto.toFixed(2); inp._lv=inp.value; }
        var unit=inp?(parseFloat(inp.value)||0):auto;
        if(manual[i]) ov[i]=unit;
        if(inp) inp.classList.toggle('edited', !!manual[i]);
        var sub=unit*it.qty; total+=sub;
        var b=rows[i]&&rows[i].querySelector('td:last-child b'); if(b) b.textContent=money(sub);
      });
      el('ptotal').textContent=money(total);
      o._pendingMult=mult; o._pendingOv=ov; o._pendingTotal=total;
    }

    var mi=el('multinput');
    if(mi){
      mi._lv=mi.value;
      mi.addEventListener('input',function(){ hist.push({el:mi,prev:mi._lv,kind:'mult'}); mi._lv=mi.value; recompute(true); });
      el('view').querySelectorAll('[data-ov]').forEach(function(inp){
        var i=+inp.dataset.ov; inp._lv=inp.value;
        inp.addEventListener('input',function(){ hist.push({el:inp,prev:inp._lv,kind:'price',idx:i,manualPrev:!!manual[i]}); inp._lv=inp.value; manual[i]=true; recompute(false); });
        inp.addEventListener('blur',function(){ if(inp.value.trim()===''){ hist.push({el:inp,prev:inp._lv,kind:'price',idx:i,manualPrev:!!manual[i]}); manual[i]=false; recompute(true); inp._lv=inp.value; } });
      });
    }

    /* Deshacer (Ctrl/Cmd+Z) el último cambio de precio o multiplicador */
    recompute(false);   // inicializa _pendingOv/_pendingTotal preservando overrides ya guardados
    priceUndo=function(){
      if(!hist.length||!el('multinput')) return false;
      var h=hist.pop();
      h.el.value=h.prev; h.el._lv=h.prev;
      if(h.kind==='price') manual[h.idx]=h.manualPrev;
      recompute(h.kind==='mult');
      try{ h.el.focus(); }catch(e){}
      return true;
    };

    function persistQuote(){ var ovArr=[]; if(o._pendingOv) Object.keys(o._pendingOv).forEach(function(k){ovArr[+k]=o._pendingOv[k];}); MCAdmin.updateOrder(o.email,o.ref,{ multOverride:(o._pendingMult!=null?o._pendingMult:quote.mult), overrides:ovArr }); }

    var sq=el('view').querySelector('[data-savequote]');
    if(sq) sq.onclick=function(){
      persistQuote();
      var q=MCAdmin.quote(o);
      var total=(o._pendingTotal!=null?o._pendingTotal:q.total);
      var allOut=q.lines.length && q.lines.every(function(l){return l.excluded;});
      var msg= allOut
        ? 'Ningún producto de este pedido tiene stock. Se le envía igual al cliente para que edite el pedido (quite o agregue productos) y vuelva a pedir cotización.'
        : (q.excludedCount
            ? ('Se envía la cotización al cliente. '+q.excludedCount+' producto'+(q.excludedCount>1?'s':'')+' sin stock aparecerá'+(q.excludedCount>1?'n':'')+' en gris y no se cobra'+(q.excludedCount>1?'n':'')+'. El cliente podrá aceptar el resto o editar el pedido.')
            : 'Se envía la cotización al cliente para que la acepte y coordine el pago.');
      confirmModal({title:'Enviar cotización', text:msg, okLabel:'Enviar al cliente', onOk:function(){
        MCAdmin.sendClientQuote(o.email,o.ref);
        MCAdmin.log(o.ref,'Cotización enviada al cliente — total '+money(total)+(q.excludedCount?' · '+q.excludedCount+' sin stock':''));
        toast('Cotización enviada al cliente'); refresh(); route();
      }});
    };
    var vb=el('view').querySelector('[data-validate]');
    if(vb) vb.onclick=function(){ MCAdmin.setUserState(o.email,'validado'); toast('Cuenta validada'); refresh(); route(); };
    var cp=el('view').querySelector('[data-confirmpay]');
    if(cp) cp.onclick=function(){ confirmModal({title:'Confirmar pago',text:(o.comprobante?('El cliente subió el comprobante “'+o.comprobante+'”. '):'El cliente todavía no subió comprobante. ')+'Al confirmar, el pedido pasa a preparación y se notifica a Maxi.',okLabel:'Confirmar pago',onOk:function(){ MCAdmin.advanceOrder(o.email,o.ref,4); MCAdmin.log(o.ref,'Pago confirmado'); toast('Pago confirmado · Maxi notificado'); refresh(); route(); }}); };
    el('view').querySelectorAll('[data-advance]').forEach(function(b){ b.onclick=function(){ MCAdmin.advanceOrder(o.email,o.ref,+b.dataset.advance); toast('Estado actualizado'); refresh(); route(); }; });
    var ship=el('view').querySelector('[data-ship]');
    if(ship) ship.onclick=function(){
      confirmModal({title:'Registrar envío',text:'Cargá el número de encomienda o tracking. El cliente lo verá en su panel y recibirá un email.',extra:'<div class="field" style="margin:0"><label>N° de encomienda / tracking</label><input type="text" placeholder="Ej: DAC 4471-228"></div>',okLabel:'Marcar enviado',onOk:function(v){ MCAdmin.updateOrder(o.email,o.ref,{encomienda:(v||'').trim()}); MCAdmin.advanceOrder(o.email,o.ref,6); MCAdmin.log(o.ref,'Envío registrado'+(v?' · '+v:'')); toast('Pedido enviado'); refresh(); route(); }});
    };
  }
  /* Modal de disponibilidad/stock por línea (3 estados + mensaje + reposición + división) */
  function stockModal(o, idx){
    var it=o.items[idx]; if(!it) return;
    var m=el('modal'); var card=m.querySelector('.modal-c'); card.classList.add('wide');
    el('modal-h').textContent='Disponibilidad — '+(it.name.length>42?it.name.slice(0,42)+'…':it.name);
    el('modal-p').textContent='Marcá el stock de este producto. Se refleja en la cotización del cliente y queda en la bitácora.';
    var state=MCAdmin.lineStockState(it), note=it.stockNote||'', date=it.restockDate||'', missing=it.missingComp||'';
    var compOpts=(it.configured&&it.detail)?it.detail.filter(function(d){return /terminal|tipo|medida|cuerpo|manguera|larg/i.test(d);}):[];
    var ex=el('modal-extra');
    function field(){
      var html='';
      if(state==='ok'){
        html='<p class="t-mut" style="font-size:12.5px">Este producto se cotiza normalmente y suma al total.</p>';
      } else {
        if(it.configured && compOpts.length){
          html+='<div class="sm-field"><label>Componente sin stock</label><select id="sm-comp"><option value="">Toda la manguera a medida</option>'+
            compOpts.map(function(d){return '<option'+(missing===d?' selected':'')+'>'+esc(d)+'</option>';}).join('')+'</select></div>';
        }
        html+='<div class="sm-field"><label>Mensaje para el cliente</label>'+
          '<div class="sm-chips">'+MCAdmin.STOCK_PRESETS.map(function(p){return '<button type="button" class="sm-chip" data-preset="'+esc(p)+'">'+esc(p)+'</button>';}).join('')+'</div>'+
          '<input type="text" id="sm-note" placeholder="Escribí un mensaje o elegí uno de arriba" value="'+esc(note)+'"></div>';
        if(state==='delay') html+='<div class="sm-field"><label>Fecha estimada de reposición</label><input type="text" id="sm-date" placeholder="Ej: 15/07, próxima semana, gira de julio…" value="'+esc(date)+'"></div>';
        if(state==='out' && it.qty>1) html+='<div class="sm-split"><div class="sm-split-h">Stock parcial (opcional)</div>'+
          '<div class="sm-split-d">Si tenés algunas unidades, dividí la línea: se cotiza lo que hay y el resto queda sin stock.</div>'+
          '<div class="sm-split-row">Tengo <input type="number" id="sm-partial" min="0" max="'+(it.qty-1)+'" placeholder="0"> de '+it.qty+' en stock</div></div>';
      }
      ex.innerHTML='<div class="sm-states">'+['ok|En stock','out|Sin stock','delay|Con demora'].map(function(s){var p=s.split('|');return '<button type="button" class="sm-st'+(state===p[0]?' on':'')+'" data-st="'+p[0]+'"><span class="dotx"></span>'+p[1]+'</button>';}).join('')+'</div>'+html;
      ex.querySelectorAll('.sm-st').forEach(function(b){ b.onclick=function(){ var n=ex.querySelector('#sm-note'); if(n)note=n.value; var d=ex.querySelector('#sm-date'); if(d)date=d.value; var c=ex.querySelector('#sm-comp'); if(c)missing=c.value; state=b.dataset.st; field(); }; });
      ex.querySelectorAll('[data-preset]').forEach(function(c){ c.onclick=function(){ var n=ex.querySelector('#sm-note'); if(n){ n.value=c.dataset.preset; n.focus(); } }; });
    }
    field();
    var ok=el('modal-ok'); ok.textContent='Guardar'; ok.className='btn btn-sm btn-pri';
    m.classList.add('show');
    function onKey(e){ if(e.key==='Escape') close(); }
    function close(){ m.classList.remove('show'); card.classList.remove('wide'); ok.onclick=null; document.removeEventListener('keydown',onKey); }
    ok.onclick=function(){
      var n=ex.querySelector('#sm-note'), d=ex.querySelector('#sm-date'), c=ex.querySelector('#sm-comp'), pr=ex.querySelector('#sm-partial');
      var info={state:state, note:n?n.value.trim():'', date:d?d.value.trim():'', missingComp:c?c.value:''};
      var partial=pr?parseInt(pr.value,10):NaN;
      close();
      if(state==='out' && !isNaN(partial) && partial>0 && partial<it.qty){
        MCAdmin.splitLine(o.email,o.ref,idx,partial,{note:info.note||'Sin stock por el momento',date:info.date});
      } else {
        MCAdmin.setLineStock(o.email,o.ref,idx,info);
      }
      toast('Stock actualizado'); refresh(); route();
    };
    m.querySelectorAll('[data-close]').forEach(function(b){ b.onclick=close; });
    document.addEventListener('keydown',onKey);
  }

  function infoLine(l,v){ return '<div style="display:flex;justify-content:space-between;gap:12px"><span class="t-mut">'+esc(l)+'</span><span class="t-strong" style="font-size:12.5px;text-align:right">'+esc(v)+'</span></div>'; }
  function clientStateTag(u){
    var m={validado:['st-ok','Cuenta validada'],pendiente:['st-pend','Pendiente de validación'],rechazado:['st-rej','Rechazada'],suspendido:['st-susp','Suspendida']};
    var s=m[u.estado||'pendiente']||m.pendiente;
    return '<span class="tag-st '+s[0]+'"><span class="d"></span>'+s[1]+'</span>';
  }

  /* ════════════════ CLIENTES ════════════════ */
  var cliFilter='todos';
  function renderClientes(){
    var users=MCAdmin.users();
    var counts={todos:users.length,pendiente:0,validado:0,suspendido:0};
    users.forEach(function(u){ counts[u.estado]=(counts[u.estado]||0)+1; });
    function chip(k,l){ return '<button class="chip'+(cliFilter===k?' on':'')+'" data-f="'+k+'">'+l+'<b>'+(counts[k]||0)+'</b></button>'; }
    var list=users.filter(function(u){ return cliFilter==='todos'||u.estado===cliFilter; });
    list.sort(function(a,b){ if((a.estado==='pendiente')!==(b.estado==='pendiente'))return a.estado==='pendiente'?-1:1; return new Date(b.createdAt||0)-new Date(a.createdAt||0); });

    var rows=list.map(function(u){
      var ords=MCAdmin.ordersFor(u.email);
      return '<tr class="clk" data-email="'+esc(u.email)+'">'+
        '<td><div style="display:flex;align-items:center;gap:11px"><div class="sb-av" style="width:34px;height:34px;font-size:14px;background:'+(u.estado==='pendiente'?'var(--yel-dim)':'var(--red)')+'">'+esc(initials(u.nombre)||'·')+'</div><div><div class="t-strong">'+esc(u.nombre)+'</div><div class="t-mut">'+esc(u.email)+'</div></div></div></td>'+
        '<td><span class="t-mut">'+esc(u.tipo==='empresa'?'Empresa':'Particular')+'</span></td>'+
        '<td><span class="t-mut">'+esc((u.dir&&u.dir.depto)||'—')+'</span></td>'+
        '<td><span class="t-mut">'+ords.length+'</span></td>'+
        '<td>'+clientStateTag(u)+'</td>'+
        '<td class="t-right">'+(u.estado==='pendiente'?'<button class="btn btn-grn btn-sm" data-val="'+esc(u.email)+'">Validar</button>':'<span class="aq-go">'+ic('arrow')+'</span>')+'</td>'+
      '</tr>';
    }).join('');

    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Gestión</div><h1 class="vh-title">Clientes</h1></div>'+
      '<div class="toolbar"><div class="chips">'+chip('todos','Todos')+chip('pendiente','Pendientes')+chip('validado','Validados')+chip('suspendido','Suspendidos')+'</div>'+
      '<div class="tb-search">'+ic('search')+'<input type="text" id="cli-q" placeholder="Buscar cliente…"></div></div>'+
      (list.length?'<table class="tbl"><thead><tr><th>Cliente</th><th>Tipo</th><th>Departamento</th><th>Pedidos</th><th>Estado</th><th></th></tr></thead><tbody id="cli-body">'+rows+'</tbody></table>'
        :'<div class="empty"><div class="empty-h">Sin clientes en este filtro</div></div>');

    el('view').querySelectorAll('[data-f]').forEach(function(c){ c.onclick=function(){ cliFilter=c.dataset.f; renderClientes(); }; });
    el('view').querySelectorAll('tr[data-email]').forEach(function(r){ r.onclick=function(e){ if(e.target.closest('[data-val]'))return; go('cliente/'+r.dataset.email); }; });
    el('view').querySelectorAll('[data-val]').forEach(function(b){ b.onclick=function(e){ e.stopPropagation(); doValidate(b.dataset.val); }; });
    var q=el('cli-q'); if(q) q.oninput=function(){ var v=q.value.toLowerCase().trim(); el('cli-body').querySelectorAll('tr').forEach(function(tr){ tr.style.display=(!v||tr.textContent.toLowerCase().indexOf(v)>=0)?'':'none'; }); };
  }
  function doValidate(email){
    var u=MCAdmin.userByEmail(email);
    confirmModal({title:'Validar cuenta',text:'Vas a validar la cuenta de '+(u?u.nombre:email)+'. Sus pedidos pendientes pasarán a cotización y el cliente podrá operar normalmente.',okLabel:'Validar cuenta',onOk:function(){ MCAdmin.setUserState(email,'validado'); toast('Cuenta validada'); refresh(); route(); }});
  }
  function doReject(email){
    var u=MCAdmin.userByEmail(email);
    confirmModal({title:'Rechazar cuenta',danger:true,text:'Se rechazará la cuenta de '+(u?u.nombre:email)+'. Podés indicar un motivo (se le comunica al cliente).',extra:'<div class="field" style="margin:0"><label>Motivo (opcional)</label><textarea placeholder="Ej: datos incompletos, fuera de zona de cobertura…"></textarea></div>',okLabel:'Rechazar',onOk:function(v){ MCAdmin.setUserState(email,'rechazado',v); toast('Cuenta rechazada'); refresh(); route(); }});
  }

  function renderClienteDetail(email){
    var u=MCAdmin.userByEmail(email);
    if(!u){ el('view').innerHTML='<a class="back" data-back>'+ic('arrow')+' Volver</a><div class="empty"><div class="empty-h">Cliente no encontrado</div></div>'; bindBack(); return; }
    var ords=MCAdmin.ordersFor(email);
    var actions='';
    if(u.estado==='pendiente') actions='<button class="btn btn-grn" data-val><span>'+ic('check')+'</span>Validar cuenta</button><button class="btn btn-ghost" data-rej><span>'+ic('x')+'</span>Rechazar</button>';
    else if(u.estado==='validado') actions='<button class="btn btn-ghost" data-susp><span>'+ic('pause')+'</span>Suspender</button>';
    else if(u.estado==='suspendido') actions='<button class="btn btn-dark" data-reactivate><span>'+ic('play')+'</span>Reactivar</button>';
    else if(u.estado==='rechazado') actions='<button class="btn btn-grn" data-val><span>'+ic('check')+'</span>Validar de todos modos</button>';

    var ordRows=ords.length?ords.map(function(o){ var st=MCAdmin.stateOf(o.estadoIdx);
      return '<tr class="clk" data-ref="'+esc(o.ref)+'"><td><div class="t-ref" style="font-size:16px">'+esc(o.ref)+'</div><div class="t-mut">'+esc(fmtDate(o.createdAt))+'</div></td><td><span class="t-mut">'+(o.items||[]).length+' líneas</span></td><td><span class="pill '+st.phase+'"><span class="d"></span>'+esc(st.full)+'</span></td></tr>';
    }).join(''):'<tr><td colspan="3"><span class="t-mut" style="padding:8px 0;display:block">Todavía no hizo pedidos.</span></td></tr>';

    var waMsg='¡Hola '+(u.nombre||'')+'! Te escribo de Metcar.';

    el('view').innerHTML=
      '<a class="back" data-back>'+ic('arrow')+' Volver a clientes</a>'+
      '<div class="dt-head"><div style="display:flex;align-items:center;gap:16px"><div class="sb-av" style="width:56px;height:56px;font-size:24px;background:'+(u.estado==='pendiente'?'var(--yel-dim)':'var(--red)')+'">'+esc(initials(u.nombre)||'·')+'</div>'+
        '<div><h1 class="vh-title">'+esc(u.nombre)+'</h1><div style="display:flex;align-items:center;gap:12px;margin-top:8px;flex-wrap:wrap">'+clientStateTag(u)+'<span class="t-mut">'+esc(u.email)+'</span></div></div></div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+actions+'<a class="btn btn-wa" href="'+waLink(u.tel,waMsg)+'" target="_blank"><span>'+ic('wa')+'</span>WhatsApp</a></div></div>'+

      (u.motivoRechazo?'<div class="notebox intnote" style="margin-bottom:16px">'+ic('alert')+'<p><b>Motivo de rechazo:</b> '+esc(u.motivoRechazo)+'</p></div>':'')+

      '<div class="dt-grid"><div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('box')+' Pedidos del cliente <span class="t-mut">'+ords.length+'</span></div><div class="cbox-b flush"><table class="tbl" style="border:none"><tbody>'+ordRows+'</tbody></table></div></div>'+
      '</div><div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('user')+' Datos</div><div class="cbox-b"><div style="display:flex;flex-direction:column;gap:9px">'+
          infoLine('Tipo',u.tipo==='empresa'?'Empresa':'Particular')+infoLine('Teléfono',u.tel||'—')+
          infoLine('Departamento',(u.dir&&u.dir.depto)||'—')+infoLine('Ciudad',(u.dir&&u.dir.ciudad)||'—')+
          infoLine('Dirección',(u.dir&&u.dir.calle)||'—')+infoLine('Registrado',u.createdAt?fmtDate(u.createdAt):'—')+
        '</div></div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('sliders')+' Multiplicador de precio</div><div class="cbox-b">'+
          '<p class="t-mut" style="margin-bottom:10px">Ajusta el precio base para este cliente. ×1.00 = precio estándar. Solo afecta cotizaciones futuras.</p>'+
          '<div style="display:flex;gap:9px"><input type="number" step="0.05" min="0" id="multcli" value="'+((u.mult!=null?u.mult:1).toFixed(2))+'" style="flex:1;border:1.5px solid var(--bdr);border-radius:2px;padding:10px 12px;font-family:var(--ft);font-weight:700;font-size:15px;text-align:center;outline:none"><button class="btn btn-dark btn-sm" id="savemult">Guardar</button></div>'+
        '</div></div>'+
      '</div></div>';

    bindBack();
    el('view').querySelectorAll('tr[data-ref]').forEach(function(r){ r.onclick=function(){ go('pedido/'+r.dataset.ref); }; });
    var b;
    if(b=el('view').querySelector('[data-val]')) b.onclick=function(){ doValidate(email); };
    if(b=el('view').querySelector('[data-rej]')) b.onclick=function(){ doReject(email); };
    if(b=el('view').querySelector('[data-susp]')) b.onclick=function(){ confirmModal({title:'Suspender cuenta',danger:true,text:'El cliente no podrá enviar pedidos hasta que reactives su cuenta.',okLabel:'Suspender',onOk:function(){ MCAdmin.setUserState(email,'suspendido'); toast('Cuenta suspendida'); route(); }}); };
    if(b=el('view').querySelector('[data-reactivate]')) b.onclick=function(){ MCAdmin.setUserState(email,'validado'); toast('Cuenta reactivada'); route(); };
    el('savemult').onclick=function(){ MCAdmin.updateUser(email,{mult:parseFloat(el('multcli').value)||1}); toast('Multiplicador guardado'); };
  }

  /* ════════════════ CATÁLOGO ════════════════ */
  var catFilter='todos';
  function renderCatalogo(){
    var prods=MCAdmin.catalog();
    if(!prods.length){ el('view').innerHTML='<div class="vhead"><div class="vh-eyebrow">Gestión</div><h1 class="vh-title">Catálogo</h1></div><div class="empty"><div class="empty-ic">'+ic('alert').replace('width="16" height="16"','width="26" height="26"')+'</div><div class="empty-h">No se pudo cargar el catálogo</div><p class="empty-t">Revisá la conexión y reintentá. Si el problema sigue, avisá al equipo técnico.</p></div>'; return; }
    var cats=(window.MC_CATALOG&&MC_CATALOG.CATS)||[];
    var low=prods.filter(function(p){return !p.stock;}).length;
    function chip(k,l){ var n=k==='todos'?prods.length:prods.filter(function(p){return p.cat===k;}).length; return '<button class="chip'+(catFilter===k?' on':'')+'" data-f="'+k+'">'+l+'<b>'+n+'</b></button>'; }
    var list=prods.filter(function(p){return catFilter==='todos'||p.cat===catFilter;});

    var rows=list.map(function(p){
      return '<tr data-code="'+esc(p.code)+'">'+
        '<td><div style="display:flex;align-items:center;gap:11px"><div class="oi-th" style="width:36px;height:36px">'+icon(p.cat)+'</div><div><div class="t-strong">'+esc(p.name)+'</div><div class="t-mut">'+esc(p.code)+'</div></div></div></td>'+
        '<td><span class="cattag">'+esc(catName(p.cat))+'</span></td>'+
        '<td>'+(p.specs||[]).map(function(s){return '<span class="spec">'+esc(s)+'</span>';}).join('')+'</td>'+
        '<td class="t-right"><div style="display:inline-flex;align-items:center;gap:5px"><span class="t-mut">US$</span><input class="pov" data-price="'+esc(p.code)+'" type="number" step="0.01" min="0" value="'+p.price.toFixed(2)+'" style="width:78px"></div></td>'+
        '<td class="t-right"><button class="sw'+(p.stock?' on':'')+'" data-stock="'+esc(p.code)+'" role="switch" aria-checked="'+(p.stock?'true':'false')+'" aria-label="Stock de '+esc(p.name)+'"></button></td>'+
      '</tr>';
    }).join('');

    el('view').innerHTML=
      '<div class="vhead" style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><div class="vh-eyebrow">Gestión</div><h1 class="vh-title">Catálogo</h1></div>'+
      '<div style="display:flex;gap:8px"><button class="btn btn-ghost" id="excel"><span>'+ic('sheet')+'</span>Importar Excel</button><button class="btn btn-pri" id="newprod"><span>'+ic('plus')+'</span>Nuevo producto</button></div></div>'+
      (low?'<div class="notebox" style="background:rgba(245,197,24,.1);border:1px solid rgba(245,197,24,.35);margin-bottom:16px">'+ic('alert')+'<p><b>'+low+' producto'+(low>1?'s':'')+' sin stock.</b> Siguen visibles en el catálogo público con el aviso "disponibilidad a confirmar".</p></div>':'')+
      '<div class="toolbar"><div class="chips">'+chip('todos','Todos')+cats.map(function(c){return chip(c.id,c.name.split(' ')[0]);}).join('')+'</div>'+
      '<div class="tb-search">'+ic('search')+'<input type="text" id="cat-q" placeholder="Buscar producto o código…"></div></div>'+
      '<table class="tbl"><thead><tr><th>Producto</th><th>Categoría</th><th>Especificaciones</th><th class="t-right">Precio base</th><th class="t-right">En stock</th></tr></thead><tbody id="cat-body">'+rows+'</tbody></table>';

    el('view').querySelectorAll('[data-f]').forEach(function(c){ c.onclick=function(){ catFilter=c.dataset.f; renderCatalogo(); }; });
    el('view').querySelectorAll('[data-stock]').forEach(function(b){ b.onclick=function(){ var on=!b.classList.contains('on'); b.classList.toggle('on',on); b.setAttribute('aria-checked',on?'true':'false'); MCAdmin.setStock(b.dataset.stock,on); toast(on?'Marcado en stock':'Marcado sin stock'); updateBadges(); }; });
    el('view').querySelectorAll('[data-price]').forEach(function(inp){ inp.onchange=function(){ MCAdmin.setPrice(inp.dataset.price,inp.value); toast('Precio actualizado'); }; });
    el('newprod').onclick=function(){ confirmModal({title:'Nuevo producto',text:'El alta completa de productos (foto, descripción, specs, compatibilidades del configurador y stock) se conecta a la base de datos en la versión con backend. Acá querés ver el formulario.',okLabel:'Entendido',onOk:function(){}}); };
    el('excel').onclick=function(){ confirmModal({title:'Importar desde Excel',text:'Subí el Excel de la empresa y el sistema actualiza precios y stock por código automáticamente. La importación masiva se habilita con el backend (Supabase Storage).',extra:'<label class="btn btn-ghost" style="width:100%"><span>'+ic('upload')+'</span>Elegir archivo .xlsx<input type="file" accept=".xlsx,.xls,.csv" hidden></label>',okLabel:'Cerrar',onOk:function(){}}); };
    var q=el('cat-q'); if(q) q.oninput=function(){ var v=q.value.toLowerCase().trim(); el('cat-body').querySelectorAll('tr').forEach(function(tr){ tr.style.display=(!v||tr.textContent.toLowerCase().indexOf(v)>=0)?'':'none'; }); };
  }

  /* ════════════════ CONSULTAS ════════════════ */
  var conFilter='todos';
  function renderConsultas(){
    var cons=MCAdmin.consultas();
    var counts={todos:cons.length,nueva:0,proceso:0,cerrada:0};
    cons.forEach(function(c){counts[c.estado]++;});
    function chip(k,l){ return '<button class="chip'+(conFilter===k?' on':'')+'" data-f="'+k+'">'+l+'<b>'+(counts[k]||0)+'</b></button>'; }
    var list=cons.filter(function(c){return conFilter==='todos'||c.estado===conFilter;});
    list.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});

    var stMap={nueva:['st-pend','Nueva'],proceso:['st-ok','En proceso'],cerrada:['st-susp','Cerrada']};
    var cards=list.length?list.map(function(c){
      var prods=(c.productos||[]).map(function(code){ var p=MC_CATALOG&&MC_CATALOG.byCode(code); return '<span class="spec" style="background:var(--owh);color:var(--txt2)">'+esc(p?p.name:code)+'</span>'; }).join('');
      var s=stMap[c.estado];
      var waMsg='¡Hola '+c.nombre+'! Te respondo tu consulta a Metcar.';
      return '<div class="cbox"><div class="cbox-b">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px"><div><div class="t-strong" style="font-size:15px">'+esc(c.nombre)+'</div><div class="t-mut">'+esc(c.email)+(c.tel?' · '+esc(c.tel):'')+' · '+esc(timeAgo(c.createdAt))+'</div></div><span class="tag-st '+s[0]+'"><span class="d"></span>'+s[1]+'</span></div>'+
        '<p style="font-family:var(--fb);font-size:13.5px;line-height:1.6;color:var(--txt2);margin-bottom:'+(prods?'12px':'14px')+'">'+esc(c.mensaje)+'</p>'+
        (prods?'<div style="margin-bottom:14px"><div class="t-mut" style="margin-bottom:5px">Productos de interés:</div>'+prods+'</div>':'')+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
          '<a class="btn btn-wa btn-sm" href="'+waLink(c.tel,waMsg)+'" target="_blank"><span>'+ic('wa')+'</span>Responder</a>'+
          (c.estado!=='proceso'&&c.estado!=='cerrada'?'<button class="btn btn-ghost btn-sm" data-proc="'+esc(c.id)+'">Marcar en proceso</button>':'')+
          (c.estado!=='cerrada'?'<button class="btn btn-ghost btn-sm" data-close-c="'+esc(c.id)+'">Cerrar consulta</button>':'<button class="btn btn-ghost btn-sm" data-reopen="'+esc(c.id)+'">Reabrir</button>')+
        '</div></div></div>';
    }).join(''):'<div class="empty"><div class="empty-ic">'+ic('chat').replace('width="16" height="16"','width="26" height="26"')+'</div><div class="empty-h">Sin consultas</div><p class="empty-t">Las consultas del formulario de contacto aparecen acá.</p></div>';

    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Operación</div><h1 class="vh-title">Consultas</h1></div>'+
      '<div class="toolbar"><div class="chips">'+chip('todos','Todas')+chip('nueva','Nuevas')+chip('proceso','En proceso')+chip('cerrada','Cerradas')+'</div></div>'+
      '<div style="display:flex;flex-direction:column;gap:14px">'+cards+'</div>';

    el('view').querySelectorAll('[data-f]').forEach(function(c){ c.onclick=function(){ conFilter=c.dataset.f; renderConsultas(); }; });
    el('view').querySelectorAll('[data-proc]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateConsulta(b.dataset.proc,{estado:'proceso'}); toast('Marcada en proceso'); refresh(); renderConsultas(); }; });
    el('view').querySelectorAll('[data-close-c]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateConsulta(b.dataset.closeC,{estado:'cerrada'}); toast('Consulta cerrada'); refresh(); renderConsultas(); }; });
    el('view').querySelectorAll('[data-reopen]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateConsulta(b.dataset.reopen,{estado:'nueva'}); refresh(); renderConsultas(); }; });
  }

  /* ════════════════ RESEÑAS ════════════════ */
  var resFilter='pendiente';
  function renderResenas(){
    var res=MCAdmin.resenas();
    var counts={todos:res.length,pendiente:0,aprobada:0,rechazada:0};
    res.forEach(function(r){counts[r.estado]++;});
    function chip(k,l){ return '<button class="chip'+(resFilter===k?' on':'')+'" data-f="'+k+'">'+l+'<b>'+(counts[k]||0)+'</b></button>'; }
    var list=res.filter(function(r){return resFilter==='todos'||r.estado===resFilter;});
    list.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});
    var stMap={pendiente:['st-pend','Pendiente'],aprobada:['st-ok','Publicada'],rechazada:['st-rej','Rechazada']};

    var cards=list.length?list.map(function(r){
      var s=stMap[r.estado];
      return '<div class="cbox"><div class="cbox-b">'+
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px"><div><div class="t-strong" style="font-size:15px">'+esc(r.cliente)+(r.anon?' <span class="t-mut">(anónimo)</span>':'')+'</div><div style="display:flex;align-items:center;gap:10px;margin-top:4px">'+stars(r.rating)+'<span class="t-mut">'+esc(timeAgo(r.createdAt))+(r.pedido?' · '+esc(r.pedido):'')+'</span></div></div><span class="tag-st '+s[0]+'"><span class="d"></span>'+s[1]+'</span></div>'+
        '<p style="font-family:var(--fb);font-size:14px;line-height:1.6;color:var(--txt2);font-style:italic;margin-bottom:14px">"'+esc(r.texto)+'"</p>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
          (r.estado!=='aprobada'?'<button class="btn btn-grn btn-sm" data-appr="'+esc(r.id)+'"><span>'+ic('check')+'</span>'+(r.estado==='rechazada'?'Publicar':'Aprobar y publicar')+'</button>':'<button class="btn btn-ghost btn-sm" data-unpub="'+esc(r.id)+'"><span>'+ic('eye')+'</span>Despublicar</button>')+
          (r.estado!=='rechazada'?'<button class="btn btn-ghost btn-sm" data-rej="'+esc(r.id)+'"><span>'+ic('x')+'</span>Rechazar</button>':'')+
        '</div></div></div>';
    }).join(''):'<div class="empty"><div class="empty-ic">'+ic('star').replace('width="16" height="16"','width="26" height="26"')+'</div><div class="empty-h">Sin reseñas en este filtro</div></div>';

    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Gestión</div><h1 class="vh-title">Reseñas</h1></div>'+
      '<div class="toolbar"><div class="chips">'+chip('pendiente','Pendientes')+chip('aprobada','Publicadas')+chip('rechazada','Rechazadas')+chip('todos','Todas')+'</div></div>'+
      '<div style="display:flex;flex-direction:column;gap:14px">'+cards+'</div>';

    el('view').querySelectorAll('[data-f]').forEach(function(c){ c.onclick=function(){ resFilter=c.dataset.f; renderResenas(); }; });
    el('view').querySelectorAll('[data-appr]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateResena(b.dataset.appr,{estado:'aprobada'}); toast('Reseña publicada'); refresh(); renderResenas(); }; });
    el('view').querySelectorAll('[data-rej]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateResena(b.dataset.rej,{estado:'rechazada'}); toast('Reseña rechazada'); refresh(); renderResenas(); }; });
    el('view').querySelectorAll('[data-unpub]').forEach(function(b){ b.onclick=function(){ MCAdmin.updateResena(b.dataset.unpub,{estado:'pendiente'}); toast('Reseña despublicada'); refresh(); renderResenas(); }; });
  }

  /* ════════════════ CONFIGURACIÓN ════════════════ */
  function renderConfig(){
    var cfg=MCAdmin.config();
    function tg(group,key,label,desc){ var on=cfg[group]&&cfg[group][key]; return '<div class="tg"><div><div class="tg-tx">'+label+'</div><div class="tg-d">'+desc+'</div></div><button class="sw'+(on?' on':'')+'" data-tg="'+group+'.'+key+'" role="switch" aria-checked="'+(on?'true':'false')+'" aria-label="'+label+'"></button></div>'; }
    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Sistema</div><h1 class="vh-title">Configuración</h1></div>'+
      '<div class="dt-grid"><div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('pin')+' Datos de la empresa</div><div class="cbox-b">'+
          '<div class="frow"><div class="field"><label>Nombre</label><input id="cf-nombre" value="'+esc(cfg.empresa.nombre)+'"></div><div class="field"><label>Email</label><input id="cf-email" value="'+esc(cfg.empresa.email)+'"></div></div>'+
          '<div class="frow"><div class="field"><label>Teléfono fijo</label><input id="cf-tel" value="'+esc(cfg.empresa.tel)+'"></div><div class="field"><label>Celular / WhatsApp</label><input id="cf-cel" value="'+esc(cfg.empresa.cel)+'"></div></div>'+
          '<div class="field full"><label>Dirección</label><input id="cf-dir" value="'+esc(cfg.empresa.dir)+'"></div>'+
          '<div class="field full"><label>Horario de atención</label><input id="cf-hor" value="'+esc(cfg.empresa.horario)+'"></div>'+
          '<button class="btn btn-dark btn-sm" data-savecfg="empresa">Guardar datos</button>'+
        '</div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('dollar')+' Datos bancarios <span class="t-mut">se muestran al cliente al cotizar</span></div><div class="cbox-b">'+
          '<div class="field full"><label>Titular</label><input id="bk-tit" value="'+esc(cfg.banco.titular)+'"></div>'+
          '<div class="frow"><div class="field"><label>Banco</label><input id="bk-banco" value="'+esc(cfg.banco.banco)+'"></div><div class="field"><label>RUT</label><input id="bk-rut" value="'+esc(cfg.banco.rut)+'"></div></div>'+
          '<div class="field full"><label>Cuenta en pesos</label><input id="bk-cta" value="'+esc(cfg.banco.cuenta)+'"></div>'+
          '<div class="field full"><label>Cuenta en dólares</label><input id="bk-ctausd" value="'+esc(cfg.banco.cuentaUSD)+'"></div>'+
          '<button class="btn btn-dark btn-sm" data-savecfg="banco">Guardar datos de pago</button>'+
        '</div></div>'+
      '</div><div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('bell')+' Notificaciones por email</div><div class="cbox-b" style="padding-top:4px;padding-bottom:4px">'+
          tg('notif','pedidoNuevo','Pedido nuevo','Aviso cuando llega un pedido a cotizar')+
          tg('notif','registroCliente','Cliente nuevo','Aviso cuando alguien se registra')+
          tg('notif','comprobante','Comprobante subido','Aviso cuando un cliente sube su pago')+
          tg('notif','cambioEstado','Cambios de estado','El cliente recibe email en cada paso')+
          tg('notif','resenaNueva','Reseña nueva','Aviso cuando hay una reseña para moderar')+
        '</div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('star')+' Reseñas</div><div class="cbox-b" style="padding-top:4px;padding-bottom:4px">'+
          tg('resenas','moderacion','Moderación previa','Las reseñas se revisan antes de publicarse')+
          tg('resenas','soloCompletados','Solo con pedido completado','Limita quién puede opinar')+
          tg('resenas','mostrarSeccion','Mostrar sección pública','Ocultá las reseñas del sitio entero')+
        '</div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('sliders')+' Formulario de registro</div><div class="cbox-b" style="padding-top:4px;padding-bottom:4px">'+
          tg('registro','telObligatorio','Teléfono obligatorio','')+
          tg('registro','dirObligatoria','Dirección obligatoria','')+
          tg('registro','tipoCuenta','Pedir tipo (particular/empresa)','')+
        '</div></div>'+
        '<div class="cbox"><div class="cbox-h">'+ic('user')+' Roles y permisos</div><div class="cbox-b">'+
          '<div style="display:flex;flex-direction:column;gap:8px">'+
            roleLine('Admin (Peteto / Patricia)','Acceso total')+
            roleLine('Técnico (Maxi)','Solo pedidos en preparación, sin precios')+
            roleLine('Cliente','Su panel, pedidos y perfil')+
          '</div><p class="t-mut" style="margin-top:12px">La edición fina de permisos por rol se habilita con el backend.</p>'+
        '</div></div>'+
      '</div></div>';

    el('view').querySelectorAll('[data-tg]').forEach(function(b){ b.onclick=function(){ var on=!b.classList.contains('on'); b.classList.toggle('on',on); b.setAttribute('aria-checked',on?'true':'false'); var pa=b.dataset.tg.split('.'); var c=MCAdmin.config(); (c[pa[0]]=c[pa[0]]||{})[pa[1]]=on; MCAdmin.saveConfig(c); toast('Preferencia guardada'); updateBadges(); }; });
    el('view').querySelectorAll('[data-savecfg]').forEach(function(b){ b.onclick=function(){
      var c=MCAdmin.config();
      if(b.dataset.savecfg==='empresa'){ c.empresa={nombre:el('cf-nombre').value,email:el('cf-email').value,tel:el('cf-tel').value,cel:el('cf-cel').value,dir:el('cf-dir').value,horario:el('cf-hor').value}; }
      else{ c.banco={titular:el('bk-tit').value,banco:el('bk-banco').value,rut:el('bk-rut').value,cuenta:el('bk-cta').value,cuentaUSD:el('bk-ctausd').value}; }
      MCAdmin.saveConfig(c); toast('Cambios guardados');
    }; });
  }
  function roleLine(t,d){ return '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;background:var(--owh);border-radius:2px"><div><div class="t-strong" style="font-size:13px">'+t+'</div><div class="t-mut">'+d+'</div></div><span class="aq-go">'+ic('edit')+'</span></div>'; }

  /* ════════════════ TALLER (MAXI) ════════════════ */
  function renderTaller(){
    var orders=MCAdmin.orders();
    var prep=orders.filter(function(o){return o.estadoIdx===4;});
    var done=orders.filter(function(o){return o.estadoIdx>=5;}).slice(0,6);

    var cards=prep.length?prep.map(function(o){
      var u=MCAdmin.userByEmail(o.email)||{};
      var items=(o.items||[]).map(function(it){
        var detail=it.configured&&it.detail?('<div style="margin-top:6px;padding-left:11px;border-left:2px solid var(--red);display:flex;flex-direction:column;gap:2px">'+it.detail.map(function(d){return '<span style="font-family:var(--ft);font-weight:600;font-size:12.5px;color:var(--txt2)">'+esc(d)+'</span>';}).join('')+'</div>'):'';
        return '<div class="oi" style="padding:12px 0"><div class="oi-th">'+icon(it.cat)+'</div><div class="oi-m"><div class="oi-n">'+esc(it.name)+'</div><div class="oi-mt">'+esc((it.specs||[]).join(' · '))+(it.configured?' · a medida':'')+'</div>'+detail+'</div><div class="oi-q">×'+it.qty+'</div></div>';
      }).join('');
      return '<div class="cbox"><div class="cbox-h"><span>'+ic('box')+' '+esc(o.ref)+'</span><span class="t-mut">'+esc(timeAgo(o.createdAt))+'</span></div>'+
        '<div style="display:flex;align-items:center;gap:9px;padding:10px 20px;border-bottom:1px solid var(--bdr2);background:var(--owh)"><div class="sb-av" style="width:26px;height:26px;font-size:11px">'+esc(initials(u.nombre)||'·')+'</div><div class="t-strong" style="font-size:13.5px">'+esc(u.nombre||'Cliente')+'</div>'+((u.dir&&u.dir.depto)?'<span class="t-mut" style="margin-left:auto;display:inline-flex;align-items:center;gap:5px">'+ic('pin')+esc(u.dir.depto)+'</span>':'')+'</div>'+
        '<div class="cbox-b" style="padding-top:10px">'+items+
        (o.nota?'<div class="notebox" style="margin-top:12px">'+ic('chat')+'<p><b>Nota:</b> '+esc(o.nota)+'</p></div>':'')+
        '<button class="btn btn-grn" data-armado="'+esc(o.ref)+'" data-email="'+esc(o.email)+'" style="width:100%;margin-top:14px"><span>'+ic('check')+'</span>Marcar pedido armado</button>'+
      '</div></div>';
    }).join(''):'<div class="empty"><div class="empty-ic">'+ic('check').replace('width="16" height="16"','width="26" height="26"')+'</div><div class="empty-h">Nada para armar</div><p class="empty-t">Cuando Patricia confirme un pago, el pedido aparece acá con todo lo que hay que cortar y prensar.</p></div>';

    var doneList=done.length?done.map(function(o){ var st=MCAdmin.stateOf(o.estadoIdx); return '<div class="mini-row"><div class="mini-dot" style="background:var(--green)"></div><div><div class="mini-tx"><b>'+esc(o.ref)+'</b> — '+esc(st.full)+'</div><div class="mini-tm">'+(o.items||[]).length+' líneas · '+esc(timeAgo(o.createdAt))+'</div></div></div>'; }).join(''):'<div class="mini-row"><div class="mini-tx" style="color:var(--txt3)">Sin pedidos armados recientes.</div></div>';

    el('view').innerHTML=
      '<div class="vhead"><div class="vh-eyebrow">Taller</div><h1 class="vh-title">Pedidos para armar</h1></div>'+
      '<div class="dt-grid"><div style="display:flex;flex-direction:column;gap:14px">'+cards+'</div>'+
      '<div><div class="cbox"><div class="cbox-h">'+ic('check')+' Armados recientemente</div><div class="mini">'+doneList+'</div></div></div></div>';

    el('view').querySelectorAll('[data-armado]').forEach(function(b){ b.onclick=function(){ MCAdmin.advanceOrder(b.dataset.email,b.dataset.armado,5); MCAdmin.log(b.dataset.armado,'Maxi marcó el pedido como armado'); toast('Pedido marcado armado'); refresh(); renderTaller(); }; });
  }

  /* ════════════════ BÚSQUEDA GLOBAL ════════════════ */
  function buildSearch(){
    var input=el('gsearch'), box=el('sresults');
    function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
    function run(){
      var v=norm(input.value.trim()); if(!v){ box.classList.remove('show'); return; }
      var out='';
      var ords=MCAdmin.orders().filter(function(o){ var u=MCAdmin.userByEmail(o.email); return norm(o.ref).indexOf(v)>=0||norm(u&&u.nombre).indexOf(v)>=0; }).slice(0,4);
      if(ords.length){ out+='<div class="sr-cat">Pedidos</div>'+ords.map(function(o){ var u=MCAdmin.userByEmail(o.email); return '<div class="sr-item" data-go="pedido/'+esc(o.ref)+'"><span class="nm">'+esc(o.ref)+'</span><span class="mt">'+esc((u&&u.nombre)||o.email)+'</span></div>'; }).join(''); }
      var cls=MCAdmin.users().filter(function(u){ return norm(u.nombre).indexOf(v)>=0||norm(u.email).indexOf(v)>=0; }).slice(0,4);
      if(cls.length){ out+='<div class="sr-cat">Clientes</div>'+cls.map(function(u){ return '<div class="sr-item" data-go="cliente/'+esc(u.email)+'"><span class="nm">'+esc(u.nombre)+'</span><span class="mt">'+esc(u.email)+'</span></div>'; }).join(''); }
      var prods=MCAdmin.catalog().filter(function(p){ return norm(p.name).indexOf(v)>=0||norm(p.code).indexOf(v)>=0; }).slice(0,4);
      if(prods.length){ out+='<div class="sr-cat">Catálogo</div>'+prods.map(function(p){ return '<div class="sr-item" data-go="catalogo"><span class="nm">'+esc(p.name)+'</span><span class="mt">'+esc(p.code)+'</span></div>'; }).join(''); }
      box.innerHTML=out||'<div class="sr-item"><span class="mt">Sin resultados para "'+esc(input.value)+'"</span></div>';
      box.classList.add('show');
      box.querySelectorAll('[data-go]').forEach(function(it){ it.onclick=function(){ go(it.dataset.go); box.classList.remove('show'); input.value=''; }; });
    }
    input.addEventListener('input',run);
    input.addEventListener('focus',function(){ if(input.value.trim())run(); });
    document.addEventListener('click',function(e){ if(!e.target.closest('.search')) box.classList.remove('show'); });
    document.addEventListener('keydown',function(e){ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); input.focus(); } if(e.key==='Escape'){ box.classList.remove('show'); input.blur(); } });
  }

  /* ════════════════ BOOT ════════════════ */
  function bindBack(){ var b=el('view').querySelector('[data-back]'); if(b) b.onclick=function(){ history.back(); }; }
  function refresh(){ updateBadges(); }

  function boot(){
    document.querySelectorAll('.sb-link').forEach(function(b){ b.addEventListener('click',function(){ go(b.dataset.route); closeSidebar(); }); });
    // sidebar mobile
    var sb=el('sb'), scrim=el('sb-scrim');
    function openSidebar(){ sb.classList.add('open'); scrim.style.display='block'; }
    function closeSidebar(){ sb.classList.remove('open'); scrim.style.display='none'; }
    window.closeSidebar=closeSidebar;
    el('sb-toggle').addEventListener('click',openSidebar);
    scrim.addEventListener('click',closeSidebar);

    buildSearch();
    document.addEventListener('keydown',function(e){ if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key.toLowerCase()==='z'&&priceUndo){ if(priceUndo()) e.preventDefault(); } });
    // Filas de tablas clicables: accesibles por teclado (Tab + Enter)
    var _view=el('view');
    try{ new MutationObserver(function(){ _view.querySelectorAll('tr.clk:not([tabindex])').forEach(function(r){ r.tabIndex=0; r.setAttribute('role','button'); }); }).observe(_view,{childList:true,subtree:true}); }catch(e){}
    _view.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ var tr=e.target.closest&&e.target.closest('tr.clk'); if(tr){ e.preventDefault(); tr.click(); } } });
    updateBadges();
    MCAdmin.onChange(updateBadges);
    window.addEventListener('hashchange',route);
    if(!location.hash) location.hash='#/dashboard';
    route();
  }
})();
