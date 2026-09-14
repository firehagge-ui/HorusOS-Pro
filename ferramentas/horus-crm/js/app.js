/* ============================================================================
   HÓRUS CRM — app: router, sidebar, boot, hero canvas, chat com o Claude
   ============================================================================ */
(function(){
  var S = H.store, ic = H.icon, esc = H.esc;

  /* ---------------- Boot ---------------- */
  S.init(H.SEED);
  // default de modelo alinhado à skill claude-api (opus-5)
  S.set(function(st){ if(!st.chat) st.chat={apiKey:'',model:'claude-opus-5',mensagens:[]}; if(st.chat.model==='claude-sonnet-4-5') st.chat.model='claude-opus-5'; });

  var NAV = [
    {g:''},
    {id:'inicio', ic:'home', nome:'Início'},
    {id:'encontrar', ic:'search', nome:'Encontrar clientes'},
    {id:'operacoes', ic:'send', nome:'Operações'},
    {id:'respostas', ic:'inbox', nome:'Respostas', badgeFn:function(){ return S.get('leads').filter(function(l){return (l.conversa||[]).some(function(m){return m.de==='them';});}).length; }},
    {id:'negocios', ic:'briefcase', nome:'Negócios'},
    {id:'relatorios', ic:'chart', nome:'Relatórios'},
    {g:'Operação'},
    {id:'clientes', ic:'users', nome:'Clientes atuais', badgeFn:function(){ return S.get('clientes').length; }, badgeG:true},
    {id:'claude', ic:'sparkles', nome:'Falar com o Claude'},
    {g:'Comunidade'},
    {id:'forum', ic:'book', nome:'Fórum', disabled:true},
    {id:'hall', ic:'trophy', nome:'Hall de Operadores', disabled:true}
  ];

  function renderSidebar(){
    var nav = NAV.map(function(n){
      if(n.g!==undefined) return n.g?'<div class="nav-group">'+esc(n.g)+'</div>':'';
      var badge='';
      if(n.badgeFn){ var v=n.badgeFn(); if(v) badge='<span class="badge'+(n.badgeG?' g':'')+'">'+v+'</span>'; }
      return '<a href="#/'+n.id+'" data-id="'+n.id+'"'+(n.disabled?' style="opacity:.5;pointer-events:none"':'')+'>'+ic(n.ic)+'<span>'+esc(n.nome)+'</span>'+badge+'</a>';
    }).join('');
    return '<div class="brand"><div class="mark">'+eyeMark()+'</div><div class="bt"><b>HÓRUS</b><span>Operador</span></div></div>'+
      '<div class="side-scroll"><nav class="nav">'+nav+'</nav></div>'+
      '<div class="side-user"><div class="av">A</div><div class="u"><b>Antônio</b><span>Originação · acesso interno</span></div><button class="cog" title="Config" id="cfg">'+ic('cog')+'</button></div>';
  }
  function eyeMark(){ return '<svg viewBox="0 0 40 24" fill="none"><path d="M2 12 C10 3, 30 3, 38 12 C30 21, 10 21, 2 12Z" stroke="#2a1004" stroke-width="2.2"/><circle cx="20" cy="12" r="4.5" fill="#2a1004"/></svg>'; }

  /* ---------------- Router ---------------- */
  var map={inicio:'inicio',encontrar:'encontrar',operacoes:'operacoes',respostas:'respostas',negocios:'negocios',relatorios:'relatorios',clientes:'clientes',claude:'claude'};
  H.route = function(){
    var id=(location.hash.replace('#/','')||'inicio');
    if(!map[id]) id='inicio';
    var c=H.$('#view'); c.style.display=''; c.style.flexDirection='';
    (H.views[map[id]]||H.views.inicio)(c);
    H.$$('.nav a').forEach(function(a){ a.classList.toggle('active', a.dataset.id===id); });
    var side=H.$('#side'); if(side)side.classList.remove('open');
  };

  /* ---------------- Hero canvas (assinatura de movimento: 1 por tela) ---------------- */
  H.startHeroCanvas = function(){
    var cv=H.$('#heroCanvas'); if(!cv)return; var ctx=cv.getContext('2d'); var W,Hh,parts,raf;
    function size(){ var r=cv.parentElement.getBoundingClientRect(); W=cv.width=r.width*devicePixelRatio; Hh=cv.height=r.height*devicePixelRatio; }
    function seed(){ parts=[]; for(var i=0;i<46;i++) parts.push({x:Math.random()*W,y:Math.random()*Hh,r:(Math.random()*2+.6)*devicePixelRatio,vx:(Math.random()-.5)*.18*devicePixelRatio,vy:(Math.random()-.5)*.18*devicePixelRatio,a:Math.random()*.5+.1}); }
    function tick(){ ctx.clearRect(0,0,W,Hh);
      for(var i=0;i<parts.length;i++){ var p=parts[i]; p.x+=p.vx;p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>Hh)p.vy*=-1;
        for(var j=i+1;j<parts.length;j++){ var q=parts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy); if(d<120*devicePixelRatio){ ctx.strokeStyle='rgba(255,120,50,'+(0.10*(1-d/(120*devicePixelRatio)))+')'; ctx.lineWidth=devicePixelRatio; ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke(); } }
        ctx.fillStyle='rgba(255,140,70,'+p.a+')'; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }
      raf=requestAnimationFrame(tick); }
    if(H._heroRaf)cancelAnimationFrame(H._heroRaf); size(); seed(); tick(); H._heroRaf=raf;
    window.addEventListener('resize', function(){ if(H.$('#heroCanvas')===cv){ size(); seed(); } });
  };

  /* ---------------- Chat com o Claude ---------------- */
  H.views.claude = function(c){
    c.className='view pad0'; c.style.display='flex'; c.style.flexDirection='column'; c.style.height='100%';
    var chat=S.get('chat');
    var keyBar = chat.apiKey ? '' :
      '<div class="chat-key">'+ic('alert')+'<span>Modo demonstração — sem chave, as respostas são simuladas. Cole sua chave da Anthropic pra conversar de verdade (fica só neste navegador).</span><button class="btn sm primary" id="setkey">Adicionar chave</button></div>';
    c.innerHTML='<div style="padding:18px 24px 0"><div class="head" style="margin-bottom:14px"><div class="ht"><h1>Falar com o Claude</h1><p>Seu copiloto de estratégia — pergunta sobre lead, objeção, precificação, próximo passo.</p></div>'+
        '<div class="actions"><select class="input" id="model" style="width:auto">'+
          ['claude-opus-5','claude-sonnet-5','claude-haiku-4-5'].map(function(m){return '<option value="'+m+'"'+(m===chat.model?' selected':'')+'>'+m+'</option>';}).join('')+'</select>'+
          '<button class="btn" id="clearchat">'+ic('trash')+'Limpar</button></div></div></div>'+
      '<div class="chat" style="margin:0 24px 24px">'+keyBar+
        '<div class="chat-thread" id="thread"></div>'+
        '<div class="chat-suggest" id="suggest"></div>'+
        '<div class="chat-foot"><textarea class="input" id="ci" placeholder="Pergunta pro Claude… (Enter envia, Shift+Enter quebra linha)"></textarea><button class="btn primary" id="cs">'+ic('send')+'Enviar</button></div>'+
      '</div>';
    drawThread(c);
    var sug=['Me dá 3 empresas do funil pra priorizar hoje e por quê','Como responder a objeção de preço da Manauara Estética?','Qual o próximo passo com a Amparo Flores?','Escreve a abordagem pra uma clínica de estética sem site'];
    H.$('#suggest',c).innerHTML=sug.map(function(s){return '<button class="chip" data-s="'+esc(s)+'">'+esc(s)+'</button>';}).join('');
    H.$$('#suggest .chip',c).forEach(function(b){ b.onclick=function(){ H.$('#ci',c).value=b.dataset.s; send(c); }; });
    H.$('#cs',c).onclick=function(){ send(c); };
    H.$('#ci',c).onkeydown=function(e){ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(c); } };
    H.$('#model',c).onchange=function(e){ S.set(function(st){st.chat.model=e.target.value;}); H.toast('Modelo: '+e.target.value); };
    H.$('#clearchat',c).onclick=function(){ S.set(function(st){st.chat.mensagens=[];}); drawThread(c); };
    var sk=H.$('#setkey',c); if(sk)sk.onclick=askKey;
  };
  H.chatPrefill = function(txt){ var c=H.$('#view'); var ta=H.$('#ci',c); if(ta){ ta.value=txt; send(c); } };
  function drawThread(c){
    var t=H.$('#thread',c), msgs=S.get('chat').mensagens;
    if(!msgs.length){ t.innerHTML='<div class="empty" style="margin:auto">'+ic('sparkles')+'<b>Fala comigo, Antônio.</b><span>Sou seu copiloto. Puxo contexto da carteira e do funil pra te ajudar a decidir e a escrever.</span></div>'; return; }
    t.innerHTML=msgs.map(function(m){ return '<div class="msg '+(m.role==='user'?'user':'claude')+'"><div class="mav">'+(m.role==='user'?'A':eyeSmall())+'</div><div class="mbody">'+esc(m.content)+'</div></div>'; }).join('');
    t.scrollTop=t.scrollHeight;
  }
  function eyeSmall(){ return '<svg viewBox="0 0 40 24" width="16" fill="none"><path d="M2 12 C10 3, 30 3, 38 12 C30 21, 10 21, 2 12Z" stroke="#2a1004" stroke-width="3"/><circle cx="20" cy="12" r="4.5" fill="#2a1004"/></svg>'; }

  function send(c){
    var ta=H.$('#ci',c), txt=ta.value.trim(); if(!txt)return; ta.value='';
    S.set(function(st){ st.chat.mensagens.push({role:'user',content:txt}); });
    drawThread(c);
    var t=H.$('#thread',c);
    var typing=H.el('<div class="msg claude"><div class="mav">'+eyeSmall()+'</div><div class="mbody"><span class="typing"><i></i><i></i><i></i></span></div></div>');
    t.appendChild(typing); t.scrollTop=t.scrollHeight;
    var chat=S.get('chat');
    if(!chat.apiKey){ setTimeout(function(){ typing.remove(); demoReply(c,txt); }, 700); return; }
    callClaude(chat, function(err,reply){
      typing.remove();
      if(err){ S.set(function(st){st.chat.mensagens.push({role:'assistant',content:'⚠️ Erro ao falar com a API: '+err+'\n\n(Confira a chave em Config. Sem chave válida, uso o modo demonstração.)'});}); }
      else { S.set(function(st){st.chat.mensagens.push({role:'assistant',content:reply});}); }
      drawThread(c);
    });
  }
  function demoReply(c,txt){
    var r='[modo demonstração] Boa pergunta. Com uma chave da Anthropic conectada, eu respondo isto de verdade, puxando o contexto da carteira e do funil.\n\nPor ora, um caminho rápido: foque nos leads de score ≥72 sem site (maior dor de faturamento), personalize a abordagem pelo Google ("vocês somem quando procuram por vocês na cidade"), e não mande link antes de o lead responder. Quer que eu detalhe algum lead específico?';
    if(/pre[çc]o/i.test(txt)) r='[modo demonstração] Objeção de preço: não baixe no susto. Devolva com valor — "cada projeto é sob medida; pra te passar um número certo preciso entender rapidinho seu caso, topa 5 min?". O preço se defende na conversa ao vivo, não no texto.';
    S.set(function(st){st.chat.mensagens.push({role:'assistant',content:r});});
    drawThread(c);
  }
  function callClaude(chat, cb){
    var sys='Você é o copiloto comercial da agência Hórus, falando com o Antônio (sócio de originação). Responda em português do Brasil, direto e prático, no tom de um parceiro de operação — sem jargão de agência. Doutrina da casa: personalização > volume; nunca disparar em massa; não queimar o chip; o gancho campeão é "o cliente te procura no Google e não te acha"; fale da dor de faturamento do lead, não de "design"; feche na reunião, com 50% de entrada; em cliente de setor regulado (saúde/odonto/psicologia) o compliance TRAVA a entrega (sem promessa, sem antes/depois, sem depoimento); nada de número ou fato inventado sobre cliente. Seja conciso.';
    var msgs=chat.mensagens.filter(function(m){return m.role==='user'||m.role==='assistant';}).map(function(m){return {role:m.role,content:m.content};});
    fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'content-type':'application/json','x-api-key':chat.apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:chat.model||'claude-opus-5',max_tokens:1500,system:sys,messages:msgs})
    }).then(function(r){ return r.json().then(function(j){ return {ok:r.ok,j:j}; }); })
      .then(function(res){ if(!res.ok){ cb((res.j&&res.j.error&&res.j.error.message)||('HTTP '+ (res.j&&res.j.type||'erro'))); return; }
        var txt=(res.j.content||[]).filter(function(b){return b.type==='text';}).map(function(b){return b.text;}).join('\n').trim();
        cb(null, txt||'(sem resposta)'); })
      .catch(function(e){ cb(String(e&&e.message||e)); });
  }
  function askKey(){
    var chat=S.get('chat');
    var m=H.modal('<div class="lm-head"><button class="close" data-close>'+ic('x')+'</button><h2 style="font-family:var(--ff)">Conectar o Claude</h2><div class="at">A chave fica só neste navegador (localStorage). Nunca sai daqui.</div></div>'+
      '<div class="lm-body"><div class="field"><label>Chave da API Anthropic</label><input class="input" id="ak" type="password" placeholder="sk-ant-..." value="'+esc(chat.apiKey||'')+'"></div>'+
      '<div class="field"><label>Modelo</label><select class="input" id="am">'+['claude-opus-5','claude-sonnet-5','claude-haiku-4-5'].map(function(x){return '<option'+(x===chat.model?' selected':'')+'>'+x+'</option>';}).join('')+'</select></div>'+
      '<div class="cop-hold" style="margin:0 0 14px">'+ic('shield')+'<div>Onde pegar: console.anthropic.com → API Keys. O app chama a API direto do navegador (header de acesso direto). Custo roda na sua conta.</div></div>'+
      '<button class="btn primary" id="ak-save">'+ic('check')+'Salvar e conectar</button></div>');
    H.$('#ak-save',m.mount).onclick=function(){ var k=H.$('#ak',m.mount).value.trim(), md=H.$('#am',m.mount).value;
      S.set(function(st){ st.chat.apiKey=k; st.chat.model=md; }); m.close(); H.toast(k?'Claude conectado':'Chave removida — modo demo'); H.route(); };
  }

  /* ---------------- Config (reset) ---------------- */
  function openCfg(){
    H.modal('<div class="lm-head"><button class="close" data-close>'+ic('x')+'</button><h2 style="font-family:var(--ff)">Configurações</h2></div>'+
      '<div class="lm-body"><p style="color:var(--osso-2)">Dados salvos no navegador (localStorage). Reset volta ao seed de exemplo.</p>'+
      '<button class="btn" id="reset-demo" style="margin-top:8px">'+ic('trash')+'Resetar para o seed</button></div>');
    H.$('#reset-demo',H.$('#modal')).onclick=function(){ S.reset(H.SEED); H.$('#scrim').click(); H.toast('Resetado'); boot(); };
  }

  /* ---------------- Mount ---------------- */
  function boot(){
    var app=H.el('<div class="app"><aside class="side" id="side"></aside><main class="main"><button class="btn side-toggle btn-icon" id="stog" style="position:absolute;top:12px;left:12px;z-index:60">'+ic('menu')+'</button><div class="view" id="view"></div></main></div>');
    document.body.innerHTML=''; document.body.appendChild(app);
    document.body.appendChild(H.el('<div class="scrim" id="scrim" hidden></div>'));
    document.body.appendChild(H.el('<div class="modal" id="modal" hidden></div>'));
    H.$('#side').innerHTML=renderSidebar();
    H.$('#cfg').onclick=openCfg;
    var stog=H.$('#stog'); if(stog)stog.onclick=function(){ H.$('#side').classList.toggle('open'); };
    S.sub(function(){ H.$('#side').innerHTML=renderSidebar(); H.$('#cfg').onclick=openCfg; H.$$('.nav a').forEach(function(a){ a.classList.toggle('active', a.dataset.id===(location.hash.replace('#/','')||'inicio')); }); });
    H.route();
  }
  window.addEventListener('hashchange', H.route);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
