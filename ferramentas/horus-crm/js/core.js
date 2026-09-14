/* ============================================================================
   HÓRUS CRM — core: ícones, helpers de UI e store (localStorage)
   Scripts clássicos (namespace global H) — ES modules quebram em file://.
   ============================================================================ */
window.H = window.H || {};

/* ---------------- Ícones (feather-style, stroke currentColor) ---------------- */
(function(){
  var P = {
    home:'M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
    send:'M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z',
    reply:'M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v2',
    briefcase:'M4 8h16v12H4zM9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3',
    chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
    whatsapp:'M20 12a8 8 0 0 1-11.8 7L4 20l1-4.2A8 8 0 1 1 20 12Z',
    users:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8',
    book:'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 3v18',
    trophy:'M6 4h12v4a6 6 0 1 1-12 0zM6 6H3v1a3 3 0 0 0 3 3M18 6h3v1a3 3 0 0 1-3 3M9 18h6M10 18v-3M14 18v-3',
    cog:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.4 2h-4L10 4a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L4 9a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.4h4l.4-2.4a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1Z',
    check:'M20 6 9 17l-5-5',
    checkCircle:'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3',
    plus:'M12 5v14M5 12h14',
    minus:'M5 12h14',
    x:'M18 6 6 18M6 6l12 12',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
    calendar:'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14H4zM4 9h16M8 2v4M16 2v4',
    edit:'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    trash:'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
    map:'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z',
    instagram:'M4 4h16v16H4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM17.5 6.5h.01',
    bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    flame:'M12 22a7 7 0 0 0 7-7c0-3-2-5-3-7-1.5 1-2 2.5-2 2.5S11 6 9 4C7.5 6 5 9 5 15a7 7 0 0 0 7 7Z',
    star:'M12 2l3 6.5 7 .8-5 4.8 1.3 7L12 17.8 5.7 21l1.3-7-5-4.8 7-.8z',
    zap:'M13 2 3 14h7l-1 8 10-12h-7l1-8z',
    money:'M4 6h16v12H4zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 8v8M22 8v8',
    trend:'M22 7 13.5 15.5l-4-4L2 19M16 7h6v6',
    alert:'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    sparkles:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9zM5 15l.7 1.6L7 17l-1.3.4L5 19l-.7-1.6L3 17l1.3-.4z',
    filter:'M4 5h16l-6 8v6l-4-2v-4z',
    download:'M12 3v12M7 10l5 5 5-5M4 21h16',
    upload:'M12 21V9M7 14l5-5 5 5M4 3h16',
    csv:'M6 2h9l5 5v15H6zM14 2v6h6M8 13h8M8 17h5',
    menu:'M3 6h18M3 12h18M3 18h18',
    arrowRight:'M5 12h14M13 5l7 7-7 7',
    arrowLeft:'M19 12H5M11 19l-7-7 7-7',
    pause:'M6 4h4v16H6zM14 4h4v16h-4z',
    play:'M6 4l14 8-14 8z',
    shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
    eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    inbox:'M4 13h4l2 3h4l2-3h4M4 13 6 4h12l2 9v7H4z',
    globe:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
    target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    lightning:'M13 2 3 14h7l-1 8 10-12h-7l1-8z'
  };
  H.icon = function(n, cls){
    var d = P[n]; if(!d) return '';
    return '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.9" '+
      'stroke-linecap="round" stroke-linejoin="round" style="flex:none;vertical-align:-.14em"'+(cls?' class="'+cls+'"':'')+' aria-hidden="true"><path d="'+d+'"/></svg>';
  };
})();

/* ---------------- Helpers de UI ---------------- */
H.esc = function(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
H.brl = function(n){ return 'R$ '+Number(n||0).toLocaleString('pt-BR'); };
H.el = function(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; };
H.$ = function(s,r){ return (r||document).querySelector(s); };
H.$$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

var toastEl, toastT;
H.toast = function(msg, ic){
  if(!toastEl){ toastEl=H.el('<div class="toast"></div>'); document.body.appendChild(toastEl); }
  toastEl.innerHTML = (ic!==false?'<span class="ic">'+H.icon('checkCircle')+'</span>':'')+H.esc(msg);
  toastEl.classList.add('show'); clearTimeout(toastT);
  toastT = setTimeout(function(){ toastEl.classList.remove('show'); }, 2400);
};

H.modal = function(html){
  var scrim = H.$('#scrim'), mount = H.$('#modal');
  mount.innerHTML = html; mount.hidden=false; scrim.hidden=false;
  requestAnimationFrame(function(){ scrim.classList.add('show'); mount.classList.add('show'); });
  function close(){ scrim.classList.remove('show'); mount.classList.remove('show');
    setTimeout(function(){ mount.hidden=true; scrim.hidden=true; mount.innerHTML=''; },220); }
  scrim.onclick = close;
  H.$$('[data-close]', mount).forEach(function(b){ b.onclick=close; });
  return { close: close, mount: mount };
};

/* ---------------- Store (estado + localStorage) ---------------- */
(function(){
  var KEY='horus_crm_v1';
  var state=null, subs=[];
  function load(){
    try{ var raw=localStorage.getItem(KEY); if(raw) return JSON.parse(raw); }catch(e){}
    return null;
  }
  H.store = {
    init:function(seed){
      state = load() || JSON.parse(JSON.stringify(seed));
      // migração leve: garante campos novos do seed que não existiam
      Object.keys(seed).forEach(function(k){ if(state[k]==null) state[k]=JSON.parse(JSON.stringify(seed[k])); });
      return state;
    },
    get:function(k){ return k? state[k] : state; },
    set:function(fn){ fn(state); this.save(); this.emit(); },
    save:function(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} },
    reset:function(seed){ state=JSON.parse(JSON.stringify(seed)); this.save(); this.emit(); },
    sub:function(fn){ subs.push(fn); },
    emit:function(){ subs.forEach(function(f){ f(state); }); }
  };
})();
