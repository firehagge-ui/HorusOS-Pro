/* ============================================================================
   HÓRUS CRM — views (render + eventos). H.views.<nome>(container)
   ============================================================================ */
window.H = window.H || {}; H.views = {};
(function(){
  var S = H.store, ic = H.icon, esc = H.esc, el = H.el;

  /* ---------------- Copiloto: próxima mensagem por estágio ---------------- */
  H.copiloto = function(l){
    var nome=(l.contato&&false)||( (l.nome||'').split(' ')[0] ), cat=(l.cat||'').toLowerCase(),
        cidade=(l.cidade||'').split('/')[0], reg=l.regulado, respondeu=(l.conversa||[]).some(function(m){return m.de==='them';});
    var base={liberado:respondeu};
    if(l.objecao){ var o=S.get('objecoes')[l.objecao]; if(o) return {liberado:true, status:'Objeção detectada: '+o.rotulo+'. Responder com calma, sem baixar preço no susto.', modelo:'Quebra de objeção', msg:o.sug}; }
    switch(l.estagio){
      case 'novo': return {liberado:false, status:'Ainda não abordado. Estude 15–20 min o negócio antes do 1º contato.', modelo:'Modelo B (dois passos)', msg:'Oi '+nome+', tudo bem?\n\n(só a saudação primeiro — não mande link ainda)'};
      case 'abordado': return {liberado:false, status:'Abordado. AGUARDE a resposta — mandar de novo antes é insistência, queima o lead e o número.', modelo:'Modelo B em curso', msg:'Procurei por '+cat+' em '+cidade+' e vi que vocês não aparecem fácil no Google — o cliente acaba indo pro concorrente. Resolver isso é prioridade pra vocês agora?'};
      case 'conversando': return {liberado:true, status:'Porta aberta ✓ Agora: dor + prévia da empresa dele + convite pra conversa.', modelo:'Modelo A (prévia pronta)', msg:'Que bom que respondeu 🙌 Reparei que quando procurei por '+cat+' em '+cidade+', '+l.nome+' não aparecia fácil no Google — e é aí que o cliente vai pro concorrente.\n\nMontei um modelo exclusivo pra vocês. Posso te mostrar numa conversa de 15 min essa semana?'+(reg?'\n\n⚠️ Setor regulado: sem promessa/antes-depois.':'')};
      case 'interessado': return {liberado:true, status:'Interessado ✓ Marque a reunião de diagnóstico (R1). Leve a prévia sob o braço.', modelo:'Convite R1', msg:'Combinado, '+nome+'! Te mostro onde '+l.nome+' está perdendo cliente hoje e como a gente vira isso. Melhor amanhã de manhã ou à tarde?'};
      case 'proposta': return {liberado:true, status:'Proposta na mesa. Tire o SIM na conversa, não deixe pro grupo depois. 50% de entrada.', modelo:'Fechamento', msg:'Fechado então: começamos pela Fase 1, metade de entrada pra reservar a produção e a outra na entrega. Te mando o Pix e já travamos a data — pode ser?'};
      case 'fechado': return {liberado:true, status:'Cliente 🌱 Foco em entrega, recompra e indicação.', modelo:'Pós-venda', msg:'Passando pra ver como está indo 🙌 Se conhecer alguém que precise, sua indicação vale ouro pra gente.'};
      case 'perdido': return {liberado:true, status:'Perdido/frio. Reaquecer só quando ele sinalizar — sem pressão.', modelo:'Follow-up frio', msg:'Tudo certo, '+nome+'! Fico à disposição. Quando quiser resolver aquilo do Google, é só chamar.'};
      default: return {liberado:false, status:'—', modelo:'', msg:''};
    }
  };

  H.moveLead = function(id, novo){
    var moved=null;
    S.set(function(st){ var l=st.leads.find(function(x){return x.id===id;}); if(l&&l.estagio!==novo){ l.estagio=novo; (l.hist=l.hist||[]).push({q:novo,quando:'agora',txt:'Movido para '+novo+'.'}); moved=l; } });
    if(moved) H.toast(moved.nome+' → '+novo);
  };

  /* =====================================================================
     INÍCIO / DASHBOARD
     ===================================================================== */
  H.views.inicio = function(c){
    var d=S.get('dash');
    c.className='view'; c.innerHTML =
    '<div class="dash-hero rise">'+
      '<canvas id="heroCanvas"></canvas>'+
      '<div class="hero-in">'+
        '<div class="kicker">Painel do operador</div>'+
        '<h1>Bom te ver, <em>Antônio</em>.<br>A máquina está rodando.</h1>'+
        '<p>Encontre clientes do nicho, dispare no ritmo certo e não perca quem responde. Tudo em um lugar, do lead frio ao contrato fechado.</p>'+
        '<div class="cta">'+
          '<button class="btn primary lg" data-go="encontrar">'+ic('search')+'Encontrar clientes</button>'+
          '<button class="btn lg" data-go="operacoes">'+ic('send')+'Nova operação</button>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="dash-grid stagger">'+
      stepCard('01', 'search', 'Leads prontos', '<div class="big">'+d.leadsProntos.n+'</div><div style="color:var(--osso-2);font-size:13.5px;margin-top:2px">'+esc(d.leadsProntos.nicho)+' • '+esc(d.leadsProntos.cidade)+'</div>', [['check','Prontos para importar']], '')+
      stepCard('02', 'send', 'Deixe rodando', '<div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--osso-2);font-weight:600">Campanha ativa</div><div style="display:flex;align-items:baseline;gap:8px"><div class="progress ember" style="flex:1"><i style="width:'+d.campanha.pct+'%"></i></div><b style="font-size:22px;color:var(--branco)">'+d.campanha.pct+'%</b></div><div style="font-size:12.5px;color:var(--osso-2)">'+d.campanha.enviados+' / '+d.campanha.total+' enviados</div>', [], '<span class="dot on"></span> Em andamento')+
      stepCard('03', 'shield', 'Mais controle', '', d.controle.map(function(x){return ['check',x];}), '<span class="dot on"></span> Ritmo de envio ativo')+
      stepCard('04', 'flame', 'Não perca quem responde', '<ul style="margin-top:2px"><li>'+ic('flame')+'<b style="color:var(--branco);margin-right:4px">'+d.respostas.novas+'</b> novas respostas</li><li>'+ic('flame')+'<b style="color:var(--branco);margin-right:4px">'+d.respostas.interessados+'</b> interessados</li><li>'+ic('star')+'<b style="color:var(--branco);margin-right:4px">'+d.respostas.negociacao+'</b> em negociação</li></ul>', [], '<span class="dot on"></span> CRM atualizado')+
      stepCard('05', 'calendar', 'Programe e siga seu dia', '<div style="font-size:20px;font-weight:800;color:var(--ember-1)">'+esc(d.agendamento.quando)+'</div><div style="font-size:13.5px;color:var(--osso-2)">'+d.agendamento.leads+' leads</div>', [['check','Agendada']], '')+
      stepCard('06', 'trend', 'Pronto para escalar', '<div style="font-size:15px;color:var(--osso);line-height:1.6">Mais reuniões,<br>mais vendas,<br>mais resultados.</div>', [], '')+
    '</div>';
    H.$$('[data-go]',c).forEach(function(b){ b.onclick=function(){ location.hash='#/'+b.dataset.go; }; });
    H.startHeroCanvas && H.startHeroCanvas();
  };
  function stepCard(num, icon, title, body, list, foot){
    return '<div class="step-card"><div class="num">'+num+'</div>'+
      '<div class="st"><div class="ic">'+ic(icon)+'</div><h3>'+esc(title)+'</h3></div>'+
      body+
      (list&&list.length?'<ul>'+list.map(function(x){return '<li>'+ic(x[0])+esc(x[1])+'</li>';}).join('')+'</ul>':'')+
      (foot?'<div class="foot">'+foot+'</div>':'')+'</div>';
  }
  // Mascote "homem laranja de terno" REMOVIDO a pedido do usuário (13/09/2026).
  // Não readicionar. O hero fica só com o canvas de conexões como assinatura.

  /* =====================================================================
     ENCONTRAR CLIENTES (Apify)
     ===================================================================== */
  H.views.encontrar = function(c){
    c.className='view';
    c.innerHTML =
      head('Encontrar clientes','Busque negócios do seu nicho e monte sua lista.','')+
      '<div class="finder-conn rise"><div class="ic">'+ic('search')+'</div>'+
        '<div style="flex:1"><b style="color:var(--branco)">Encontrar clientes</b><div style="font-size:13px;color:var(--osso-2)">Buscar empresas utilizando sua conta da Apify.</div>'+
        '<div style="margin-top:8px;font-size:13px"><span class="tag green">'+ic('check')+' Token da Apify configurado</span> <span style="color:var(--osso-3);margin-left:8px">Custo estimado: <b style="color:var(--osso)">US$ 0.0015</b> / lead</span></div></div></div>'+
      '<div class="card rise"><div class="wz-head" style="margin-bottom:14px"><div class="ic">'+ic('target')+'</div><div><small>Configure sua busca</small><h2 style="font-size:18px">Escolha como encontrar seus próximos clientes</h2></div></div>'+
        '<div class="finder-form">'+
          '<div class="field"><label>Nicho</label><input class="input" id="f-nicho" placeholder="Ex.: Clínica de estética"></div>'+
          '<div class="field"><label>Cidade</label><input class="input" id="f-cidade" placeholder="Ex.: São Paulo, SP"></div>'+
          '<div class="field"><label>Quantidade</label><div class="qty"><button id="f-minus">'+ic('minus')+'</button><input id="f-qtd" value="100"><button id="f-plus">'+ic('plus')+'</button></div></div>'+
          '<div class="field"><label>Nome da operação (opcional)</label><input class="input" id="f-op" placeholder="Ex.: Dentistas Salvador"></div>'+
        '</div>'+
        '<button class="btn primary lg" id="f-run" style="margin-top:4px">'+ic('search')+'Encontrar clientes</button>'+
      '</div>'+
      '<div class="finder-stats stagger">'+
        '<div class="card"><div class="n" id="fs-buscas">0</div><div class="l">Buscas hoje</div></div>'+
        '<div class="card"><div class="n" id="fs-leads">0</div><div class="l">Leads encontrados hoje</div></div>'+
        '<div class="card"><div class="n" id="fs-custo">US$ 0.00</div><div class="l">Custo estimado hoje</div></div>'+
      '</div>'+
      '<h3 style="margin:22px 0 12px;font-size:16px">Resultados da busca</h3>'+
      '<div id="f-res"><div class="empty">'+ic('search')+'<b>Nenhuma busca ainda</b><span>Configure o nicho e a cidade e clique em Encontrar clientes.</span></div></div>';

    var qtd=H.$('#f-qtd',c);
    H.$('#f-minus',c).onclick=function(){ qtd.value=Math.max(20,(+qtd.value||20)-20); };
    H.$('#f-plus',c).onclick=function(){ qtd.value=Math.min(5000,(+qtd.value||20)+20); };
    H.$('#f-run',c).onclick=function(){ runBusca(c); };
  };
  function runBusca(c){
    var nicho=H.$('#f-nicho',c).value.trim()||'Clínica de estética', cidade=H.$('#f-cidade',c).value.trim()||'Salvador, BA', qtd=Math.min(24,+H.$('#f-qtd',c).value||20);
    var res=H.$('#f-res',c); res.innerHTML='<div class="empty"><div class="typing"><i></i><i></i><i></i></div><span>Buscando "'+esc(nicho)+'" em '+esc(cidade)+'…</span></div>';
    var nomes=['Clínica','Studio','Espaço','Instituto','Centro','Casa'], sobren=['Bella','Aurora','Vitalis','Prime','Essenza','Lumiar','Zenit','Nova','Viva','Serena'];
    setTimeout(function(){
      var arr=[]; for(var i=0;i<qtd;i++){ var sc=[47,55,59,70,72,80][Math.floor(Math.random()*6)];
        arr.push({nome:nomes[i%nomes.length]+' '+sobren[(i*3)%sobren.length]+(i>9?' '+(i+1):''), cat:nicho, cidade:cidade, score:sc, semSite:Math.random()>.4}); }
      res.innerHTML=arr.map(function(r){ var cl=r.score>=72?'alta':r.score>=55?'media':'baixa';
        return '<div class="res-row"><div class="sc" style="background:var(--'+cl+');color:#1a0d05">'+r.score+'</div>'+
          '<div class="info"><b>'+esc(r.nome)+'</b><span>'+esc(r.cat)+' · '+esc(r.cidade)+(r.semSite?' · <span style="color:var(--ember-1)">sem site</span>':'')+'</span></div>'+
          '<button class="btn sm import" data-nome="'+esc(r.nome)+'" data-cat="'+esc(r.cat)+'" data-cidade="'+esc(r.cidade)+'" data-score="'+r.score+'">'+ic('plus')+'Importar</button></div>';
      }).join('');
      H.$('#fs-buscas',c).textContent=1; H.$('#fs-leads',c).textContent=qtd; H.$('#fs-custo',c).textContent='US$ '+(qtd*0.0015).toFixed(3);
      H.$$('.import',c).forEach(function(b){ b.onclick=function(){ importarLead(b.dataset); b.disabled=true; b.innerHTML=ic('check')+'Importado'; }; });
    }, 900);
  }
  function importarLead(d){
    var id='k'+Date.now()+Math.floor(Math.random()*99);
    S.set(function(st){ st.leads.unshift({id:id,nome:d.nome,handle:'',cat:d.cat,cidade:d.cidade,site:'sem',score:+d.score,prio:(+d.score>=72?'alta':'media'),liberaEm:'já',whatsapp:'',endereco:d.cidade,situacaoSite:'A verificar',contatos:0,obs:'Importado da busca.',ig:{seguidores:'—',bio:''},gancho:'google-perda',canal:'texto',estagio:'novo',conversa:[],hist:[]}); });
    H.toast(d.nome+' importado para Novo');
  }

  /* =====================================================================
     OPERAÇÕES (wizard 5 passos)
     ===================================================================== */
  var wzStep=0; var wzSteps=[['whatsapp','WhatsApp','Conectar conta'],['users','Leads','Para quem vamos enviar?'],['send','Mensagem','O que vamos enviar?'],['clock','Agendamento','Quando enviar?'],['edit','Revisar','Confirmar e iniciar']];
  H.views.operacoes = function(c){
    c.className='view';
    c.innerHTML = head('Criar operação','Configure sua operação em poucos passos.','')+
      '<div class="stepper" id="stepper"></div><div id="wz-body"></div>'+
      '<div style="display:flex;justify-content:space-between;margin-top:18px">'+
        '<button class="btn" id="wz-prev">'+ic('arrowLeft')+'Voltar</button>'+
        '<button class="btn primary" id="wz-next">Continuar'+ic('arrowRight')+'</button></div>';
    renderStepper(c); renderWzBody(c);
    H.$('#wz-prev',c).onclick=function(){ if(wzStep>0){wzStep--; renderStepper(c); renderWzBody(c);} };
    H.$('#wz-next',c).onclick=function(){ if(wzStep<4){wzStep++; renderStepper(c); renderWzBody(c);} else { H.toast('Operação iniciada 🚀 — modo demonstração'); location.hash='#/negocios'; } };
  };
  function renderStepper(c){
    var box=H.$('#stepper',c); box.innerHTML=wzSteps.map(function(s,i){
      var cls=i===wzStep?'active':(i<wzStep?'done':'');
      return '<div class="st '+cls+'" data-i="'+i+'"><div class="no">'+(i<wzStep?ic('check'):ic(s[0]))+'</div>'+
        '<div class="tx"><small>Etapa '+(i+1)+'</small><b>'+s[1]+'</b><span>'+s[2]+'</span></div></div>'+(i<4?'<div class="line"></div>':'');
    }).join('');
    H.$$('.st',box).forEach(function(s){ s.onclick=function(){ wzStep=+s.dataset.i; renderStepper(c); renderWzBody(c); }; });
  }
  function renderWzBody(c){
    var b=H.$('#wz-body',c), op=S.get('operacao');
    if(wzStep===0){ var n=op.numeros[0];
      b.innerHTML='<div class="wz rise"><div class="wz-head"><div class="ic">'+ic('whatsapp')+'</div><div><small>Etapa 1</small><h2>Conectar WhatsApp</h2></div></div>'+
        '<p class="desc">O número que vai disparar as mensagens. É o primeiro passo porque sem ele não existe operação.</p>'+
        '<div class="conn-card" style="border-color:rgba(37,211,102,.3)"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
          '<div class="ic" style="width:44px;height:44px;border-radius:12px;background:var(--verde-soft);color:var(--verde);display:grid;place-items:center">'+ic('whatsapp')+'</div>'+
          '<div style="flex:1;min-width:160px"><div style="display:flex;align-items:center;gap:8px"><b style="color:var(--branco)">'+esc(n.nome)+'</b><span class="tag green"><span class="dot on"></span>Conectado</span><span class="tag warn">Atenção</span></div>'+
          '<div style="font-size:12.5px;color:var(--osso-2);margin-top:3px">'+n.enviadasHoje+' de '+n.limite+' enviadas hoje</div>'+
          '<div class="progress ember" style="max-width:320px;margin-top:6px"><i style="width:'+(n.enviadasHoje/n.limite*100)+'%"></i></div></div>'+
          '<div style="display:flex;gap:8px"><button class="btn sm">'+ic('cog')+'Ajustar</button><button class="btn sm">Desconectar</button><button class="btn sm danger">Remover</button></div></div>'+
          '<div style="margin-top:12px"><label class="fl">Envia para</label><select class="input" style="max-width:340px"><option>Divide a fila com os outros números</option><option>Só este número</option></select></div>'+
        '</div>'+
        '<button class="btn" style="margin-top:14px">'+ic('plus')+'Adicionar número</button>'+
        '<div class="conn-card ok" style="margin-top:16px;display:flex;align-items:center;gap:12px"><div style="width:40px;height:40px;border-radius:50%;background:var(--verde-soft);color:var(--verde);display:grid;place-items:center">'+ic('check')+'</div><div style="flex:1"><b style="color:var(--branco)">WhatsApp conectado</b><div style="font-size:13px;color:var(--osso-2)">'+esc(n.nome)+' está pronto para disparar. Você já pode continuar.</div></div><button class="btn sm">Conectar outro número</button></div>'+
      '</div>';
    } else if(wzStep===1){
      var leads=S.get('leads').filter(function(l){return l.estagio==='novo';});
      b.innerHTML='<div class="wz rise"><div class="wz-head"><div class="ic">'+ic('users')+'</div><div><small>Etapa 2</small><h2>Para quem vamos enviar?</h2></div></div>'+
      '<p class="desc">Selecione a lista de leads que entra nesta operação. Hoje '+leads.length+' leads em "Novo".</p>'+
      '<div class="card" style="background:var(--void-2)"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><b style="color:var(--branco)">'+leads.length+' leads selecionáveis</b><span class="tag ember">Piloto: '+op.leadsSelecionados+' leads</span></div>'+
        leads.slice(0,8).map(function(l){return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--fio)"><span class="dot '+l.prio+'"></span><b style="color:var(--osso);font-size:14px;flex:1">'+esc(l.nome)+'</b><span style="font-size:12px;color:var(--osso-3)">'+esc(l.cidade)+'</span></div>';}).join('')+
        (leads.length>8?'<div style="text-align:center;color:var(--osso-3);font-size:12.5px;padding-top:10px">+ '+(leads.length-8)+' outros</div>':'')+
      '</div></div>';
    } else if(wzStep===2){
      b.innerHTML='<div class="wz rise"><div class="wz-head"><div class="ic">'+ic('send')+'</div><div><small>Etapa 3</small><h2>O que vamos enviar?</h2></div></div>'+
      '<p class="desc">A primeira mensagem. Regra de ouro: fale do LEAD, não da agência. Nada de link antes de ele responder.</p>'+
      '<div class="field"><label>Modelo</label><div class="seg" id="msg-seg"><button class="on">Dois passos</button><button>Prévia pronta</button><button>Cliente oculto</button></div></div>'+
      '<div class="field"><label>Mensagem 1 (saudação)</label><input class="input" value="Oi {nome}, tudo bem?"></div>'+
      '<div class="field"><label>Mensagem 2 (após responder)</label><textarea class="input">Procurei por {nicho} em {cidade} e vi que vocês não aparecem fácil no Google — o cliente acaba indo pro concorrente. Resolver isso é prioridade pra vocês agora?</textarea></div>'+
      '<div style="font-size:12.5px;color:var(--osso-3)">Variáveis: <code style="color:var(--ember-1)">{nome}</code> <code style="color:var(--ember-1)">{nicho}</code> <code style="color:var(--ember-1)">{cidade}</code></div>'+
      '</div>';
      H.$$('#msg-seg button',b).forEach(function(bt){ bt.onclick=function(){ H.$$('#msg-seg button',b).forEach(function(x){x.classList.remove('on');}); bt.classList.add('on'); }; });
    } else if(wzStep===3){
      b.innerHTML='<div class="wz rise"><div class="wz-head"><div class="ic">'+ic('clock')+'</div><div><small>Etapa 4</small><h2>Quando vamos enviar?</h2></div></div>'+
      '<p class="desc">O ritmo e a janela de horário em que o motor pode enviar.</p>'+
      '<label class="fl">Ritmo de envio</label><div class="rhythm" id="rhythm">'+
        S.get('ritmos').map(function(r){ var on=op.ritmo===r.id?'on':'';
          return '<div class="opt '+on+'" data-r="'+r.id+'"><div class="rt"><div class="rd"></div><b>'+r.nome+'</b></div><p>'+esc(r.desc)+'</p><div class="meta">'+esc(r.meta)+'</div></div>';
        }).join('')+'</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px;max-width:420px"><div class="field"><label>De</label><input class="input" type="time" value="'+op.horaDe+'"></div><div class="field"><label>Até</label><input class="input" type="time" value="'+op.horaAte+'"></div></div>'+
      '<label class="fl">Dias</label><div class="chip-row" id="dias">'+['SEG','TER','QUA','QUI','SEX','SÁB','DOM'].map(function(dd){var on=op.dias.indexOf(dd)>=0?'on':'';return '<button class="chip '+on+'" data-d="'+dd+'">'+dd+'</button>';}).join('')+'</div>'+
      '<div style="font-size:12.5px;color:var(--osso-3);margin-top:10px">O motor trabalha com dois modos: <b style="color:var(--osso-2)">só dias úteis</b> ou <b style="color:var(--osso-2)">todos os dias</b>. Os dias úteis vão sempre juntos.</div>'+
      '</div>';
      H.$$('.opt',b).forEach(function(o){ o.onclick=function(){ H.$$('.opt',b).forEach(function(x){x.classList.remove('on');}); o.classList.add('on'); S.set(function(st){st.operacao.ritmo=o.dataset.r;}); }; });
      H.$$('#dias .chip',b).forEach(function(ch){ ch.onclick=function(){ ch.classList.toggle('on'); }; });
    } else {
      var r=S.get('ritmos').find(function(x){return x.id===op.ritmo;});
      b.innerHTML='<div class="wz rise"><div class="wz-head"><div class="ic">'+ic('edit')+'</div><div><small>Etapa 5</small><h2>Revisar e iniciar</h2></div></div>'+
      '<p class="desc">Confirme os detalhes antes de dar o play.</p>'+
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:14px">'+
        revItem('whatsapp','WhatsApp',op.numeros[0].nome+' · conectado')+
        revItem('users','Leads',op.leadsSelecionados+' leads (piloto)')+
        revItem('clock','Ritmo',r.nome+' · '+r.meta)+
        revItem('calendar','Janela',op.horaDe+'–'+op.horaAte+' · '+op.dias.join(', '))+
      '</div>'+
      '<div class="cop-hold" style="margin-top:16px">'+ic('shield')+'<div>Trava da casa: personalização &gt; volume, chip aquece devagar, e o copiloto só sugere a próxima mensagem depois do lead responder. Mandar de novo antes é insistência — queima o lead e o número.</div></div>'+
      '</div>';
    }
  }
  function revItem(icon,l,v){ return '<div class="card" style="background:var(--void-2)"><div style="display:flex;align-items:center;gap:9px;color:var(--osso-2);font-size:12.5px">'+ic(icon)+esc(l)+'</div><div style="color:var(--branco);font-weight:600;margin-top:6px">'+esc(v)+'</div></div>'; }

  /* =====================================================================
     NEGÓCIOS / PIPELINE (kanban pannable)
     ===================================================================== */
  var zoom=1;
  H.views.negocios = function(c){
    c.className='view'; c.style.display='flex'; c.style.flexDirection='column';
    var leads=S.get('leads');
    var valFechado=leads.filter(function(l){return l.estagio==='fechado';}).reduce(function(a,l){return a+(l.valor||0);},0);
    var emAberto=leads.filter(function(l){return ['abordado','conversando','interessado','proposta'].indexOf(l.estagio)>=0;}).length;
    c.innerHTML =
      head('Negócios','Seu funil comercial, do lead frio ao fechamento.','<button class="btn" id="imp">'+ic('upload')+'Importar interessados</button><button class="btn primary" id="novo">'+ic('plus')+'Novo negócio</button>')+
      '<div class="kpis" style="margin-bottom:16px">'+
        kpi('money','Valor em negócios',H.brl(valFechado||emAberto*1500),leads.length+' leads','accent')+
        kpi('trend','Em aberto',emAberto,'em andamento','violet')+
        kpi('trophy','Ganhos no mês',H.brl(valFechado),leads.filter(function(l){return l.estagio==='fechado';}).length+' fechados','green')+
        kpi('alert','Precisam de atenção',leads.filter(function(l){return l.objecao;}).length,'com objeção','warn')+
      '</div>'+
      '<div class="board-tools"><input class="input" id="pipe-q" placeholder="Buscar por nome, categoria ou cidade…" style="flex:1;max-width:420px">'+
        '<div style="flex:1"></div>'+
        '<button class="btn-icon btn" id="zout">'+ic('minus')+'</button><span id="zlbl" style="color:var(--osso-2);font-size:13px;min-width:44px;text-align:center">100%</span><button class="btn-icon btn" id="zin">'+ic('plus')+'</button></div>'+
      '<div class="board-wrap" id="bwrap"><div class="board" id="board"></div></div>';
    drawBoard(c);
    H.$('#novo',c).onclick=function(){ novoNegocio(); };
    H.$('#imp',c).onclick=function(){ location.hash='#/encontrar'; };
    H.$('#pipe-q',c).oninput=function(e){ drawBoard(c, e.target.value.toLowerCase()); };
    H.$('#zin',c).onclick=function(){ zoom=Math.min(1.2,zoom+0.1); applyZoom(c); };
    H.$('#zout',c).onclick=function(){ zoom=Math.max(0.5,zoom-0.1); applyZoom(c); };
    enablePan(H.$('#bwrap',c));
    applyZoom(c);
  };
  function applyZoom(c){ var bd=H.$('#board',c); if(!bd)return; bd.style.transform='scale('+zoom+')'; bd.style.transformOrigin='top left'; var l=H.$('#zlbl',c); if(l)l.textContent=Math.round(zoom*100)+'%'; }
  function drawBoard(c, q){
    var board=H.$('#board',c), leads=S.get('leads'), estagios=S.get('estagios');
    board.innerHTML=estagios.map(function(e){
      var arr=leads.filter(function(l){ return l.estagio===e.id && (!q || (l.nome+' '+l.cat+' '+l.cidade).toLowerCase().indexOf(q)>=0); });
      return '<div class="kcol" data-est="'+e.id+'"><div class="kcol-h"><span class="dot" style="background:'+e.cor+'"></span><b>'+esc(e.nome)+'</b><span class="count">'+arr.length+'</span></div>'+
        '<div class="kcol-b" data-drop="'+e.id+'">'+arr.map(dcard).join('')+'</div>'+
        '<div class="kadd" data-add="'+e.id+'">'+ic('plus')+' Adicionar</div></div>';
    }).join('');
    H.$$('.dcard',board).forEach(wireCard);
    H.$$('.kcol-b',board).forEach(function(body){ var col=body.closest('.kcol');
      body.addEventListener('dragover',function(ev){ ev.preventDefault(); col.classList.add('over'); });
      body.addEventListener('dragleave',function(){ col.classList.remove('over'); });
      body.addEventListener('drop',function(ev){ ev.preventDefault(); col.classList.remove('over'); var id=ev.dataTransfer.getData('text/plain'); H.moveLead(id, body.dataset.drop); drawBoard(c,q); });
    });
    H.$$('.kadd',board).forEach(function(a){ a.onclick=function(){ novoNegocio(a.dataset.add); }; });
  }
  function dcard(l){
    var cl=l.prio||'baixa';
    return '<article class="dcard '+cl+'" draggable="true" data-id="'+l.id+'"><div class="dt"><b>'+esc(l.nome)+'</b><span class="sc" style="color:var(--'+cl+')">'+l.score+'</span></div>'+
      '<div class="cat">'+esc(l.cat)+(l.site==='sem'?' · <span class="tag red" style="padding:0 5px">Sem site</span>':l.site==='ruim'?' · <span class="tag warn" style="padding:0 5px">Site ruim</span>':'')+'</div>'+
      '<div class="dmeta">'+(l.regulado?'<span class="tag red">⚠️ regulado</span>':'')+(l.objecao?'<span class="tag warn">objeção</span>':'')+(l.liberaEm&&l.liberaEm!=='já'?'<span class="tag steel">'+ic('clock')+'libera em '+esc(l.liberaEm)+'</span>':'')+'</div>'+
      '<div class="addr">'+ic('map')+esc(l.cidade)+'</div></article>';
  }
  function wireCard(el){
    el.onclick=function(){ H.leadModal(el.dataset.id); };
    el.addEventListener('dragstart',function(e){ el.classList.add('dragging'); e.dataTransfer.setData('text/plain',el.dataset.id); });
    el.addEventListener('dragend',function(){ el.classList.remove('dragging'); });
  }
  function enablePan(wrap){
    var down=false,sx,sy,sl,st;
    wrap.addEventListener('mousedown',function(e){ if(e.target.closest('.dcard')||e.button===0&&e.target.closest('.dcard'))return; if(e.button!==0&&e.button!==2)return; if(e.target.closest('.dcard'))return; down=true; sx=e.clientX;sy=e.clientY;sl=wrap.scrollLeft;st=wrap.scrollTop; wrap.style.cursor='grabbing'; });
    window.addEventListener('mousemove',function(e){ if(!down)return; wrap.scrollLeft=sl-(e.clientX-sx); wrap.scrollTop=st-(e.clientY-sy); });
    window.addEventListener('mouseup',function(){ down=false; wrap.style.cursor=''; });
    wrap.addEventListener('contextmenu',function(e){e.preventDefault();});
  }
  function novoNegocio(estagio){
    var m=H.modal('<div class="lm-head"><button class="close" data-close>'+ic('x')+'</button><h2 style="font-family:var(--ff)">Novo negócio</h2></div>'+
      '<div class="lm-body"><div class="field"><label>Nome / empresa</label><input class="input" id="nn-nome" placeholder="Ex.: Clínica Sorriso"></div>'+
      '<div class="field"><label>Categoria</label><input class="input" id="nn-cat" placeholder="Ex.: Odontologia"></div>'+
      '<div class="field"><label>Cidade</label><input class="input" id="nn-cid" placeholder="Ex.: Salvador/BA"></div>'+
      '<button class="btn primary" id="nn-save">'+ic('check')+'Criar</button></div>');
    H.$('#nn-save',m.mount).onclick=function(){ var nome=H.$('#nn-nome',m.mount).value.trim(); if(!nome){H.toast('Dá um nome ao negócio',false);return;}
      S.set(function(st){ st.leads.unshift({id:'k'+Date.now(),nome:nome,handle:'',cat:H.$('#nn-cat',m.mount).value||'—',cidade:H.$('#nn-cid',m.mount).value||'—',site:'sem',score:60,prio:'media',liberaEm:'já',whatsapp:'',endereco:'',situacaoSite:'',contatos:0,obs:'',ig:{seguidores:'—',bio:''},gancho:'google-perda',canal:'texto',estagio:estagio||'novo',conversa:[],hist:[]}); });
      m.close(); H.toast(nome+' criado'); if(location.hash==='#/negocios') H.route(); };
  }

  /* =====================================================================
     LEAD MODAL (ficha + copiloto)
     ===================================================================== */
  H.leadModal = function(id){
    var l=S.get('leads').find(function(x){return x.id===id;}); if(!l)return;
    var cop=H.copiloto(l);
    var conv=(l.conversa||[]).map(function(m){ return '<div class="bub '+(m.de==='me'?'me':'them')+'">'+esc(m.txt)+'<div class="t">'+esc(m.t||'')+'</div></div>'; }).join('')||'<div style="color:var(--osso-3);font-size:13px;text-align:center;padding:10px">Sem conversa ainda.</div>';
    var hist=(l.hist||[]).slice().reverse().map(function(h){ return '<li><div class="hq">'+esc(h.quando)+' · '+esc(h.q)+'</div><div class="ht">'+esc(h.txt)+'</div></li>'; }).join('')||'<li><div class="ht">Sem histórico.</div></li>';
    var copBox = cop.liberado
      ? '<div class="cop-go"><div class="cop-msg">'+esc(cop.msg)+'</div><button class="btn primary sm" id="cop-copy" style="margin-top:10px">'+ic('send')+'Copiar sugestão</button><div style="font-size:11px;color:var(--osso-3);margin-top:8px">'+esc(cop.status)+' · '+esc(cop.modelo)+'</div></div>'
      : '<div class="cop-hold">'+ic('clock')+'<div><b style="color:#cfe0f7">Aguardando resposta</b><br>'+esc(cop.status)+'</div></div>';
    var estagios=S.get('estagios');
    var m=H.modal('<div class="lm-head"><button class="close" data-close>'+ic('x')+'</button>'+
      '<h2>'+esc(l.nome)+'</h2><div class="at">@'+esc(l.handle||l.nome.toLowerCase().replace(/\s+/g,''))+'</div>'+
      '<div class="htags"><span class="tag">'+esc(l.cat)+'</span>'+(l.site==='sem'?'<span class="tag red">Sem site</span>':l.site==='ruim'?'<span class="tag warn">Site ruim</span>':'')+
        '<span class="tag ember">'+ic('trend')+l.score+'/100 · '+(l.prio==='alta'?'Alta prioridade':l.prio==='media'?'Média':'Baixa')+'</span>'+
        (l.liberaEm&&l.liberaEm!=='já'?'<span class="tag steel">'+ic('clock')+'libera em '+esc(l.liberaEm)+'</span>':'')+
        (l.regulado?'<span class="tag red">⚠️ Compliance</span>':'')+'</div>'+
      '<div class="lm-score"><i style="width:'+l.score+'%"></i></div>'+
      '<div class="hbtns"><a class="btn green" href="'+(l.whatsapp?'https://wa.me/'+l.whatsapp:'#')+'" target="_blank" rel="noopener">'+ic('whatsapp')+'WhatsApp</a>'+
        '<button class="btn">'+ic('instagram')+'Instagram</button><button class="btn">'+ic('phone')+'Registrar contato</button>'+
        '<select class="input" id="lm-est" style="width:auto;padding:8px 12px">'+estagios.map(function(e){return '<option value="'+e.id+'"'+(e.id===l.estagio?' selected':'')+'>'+e.nome+'</option>';}).join('')+'</select></div>'+
      '</div>'+
      '<div class="lm-body">'+
        '<div class="ig-card"><div class="ring"><div>'+esc((l.nome[0]||'C'))+'</div></div><div style="flex:1"><b>@'+esc(l.handle||'')+'</b> '+ic('arrowRight')+'<div style="font-size:13px;color:var(--osso-2);margin-top:2px"><span class="fw">'+esc(l.ig&&l.ig.seguidores||'—')+'</span> seguidores</div><div style="font-size:12.5px;color:var(--osso-3)">'+esc(l.ig&&l.ig.bio||'')+'</div></div></div>'+
        '<div class="info-grid">'+
          info('whatsapp','WhatsApp',l.whatsapp||'—')+info('map','Endereço',l.endereco||'—')+
          info('globe','Situação do site',l.situacaoSite||'—')+info('phone','Contatos feitos',String(l.contatos||0))+
        '</div>'+
        (l.obs?'<div class="field"><label class="fl">Observação</label><div class="cop-msg" style="background:var(--void-2);border:1px solid var(--fio);border-radius:10px;padding:11px 12px;font-size:13px;color:var(--osso)">'+esc(l.obs)+'</div></div>':'')+
        '<div class="cop-box"><div class="cop-h"><svg class="persona" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#201526"/><path d="M8 20 C14 12, 26 12, 32 20 C26 28, 14 28, 8 20Z" stroke="#ff7a2e" stroke-width="2" fill="none"/><circle cx="20" cy="20" r="4" fill="#ff7a2e"/></svg><b>Copiloto</b><span class="tag ember">'+esc(l.cat.split(' ').pop())+'</span></div>'+
          '<div class="conv">'+conv+'</div>'+copBox+'</div>'+
        '<div class="hist2"><h4>'+ic('clock')+'Histórico</h4><ol>'+hist+'</ol></div>'+
      '</div>');
    H.$('#lm-est',m.mount).onchange=function(e){ H.moveLead(l.id, e.target.value); if(location.hash==='#/negocios')H.route(); };
    var cp=H.$('#cop-copy',m.mount); if(cp)cp.onclick=function(){ if(navigator.clipboard)navigator.clipboard.writeText(cop.msg); H.toast('Sugestão copiada'); };
  };
  function info(icon,l,v){ return '<div><div class="fl">'+ic(icon)+esc(l)+'</div><div class="fv">'+esc(v)+'</div></div>'; }

  /* =====================================================================
     RESPOSTAS (inbox copiloto — estilo Encode)
     ===================================================================== */
  var inboxSel=null;
  H.views.respostas = function(c){
    c.className='view'; c.style.display='flex'; c.style.flexDirection='column';
    var comResp=S.get('leads').filter(function(l){ return (l.conversa||[]).some(function(m){return m.de==='them';}); });
    if(!inboxSel||!comResp.find(function(l){return l.id===inboxSel;})) inboxSel=comResp[0]&&comResp[0].id;
    c.innerHTML=head('Respostas','Quem respondeu, com sugestão de resposta do copiloto. '+comResp.length+' conversas ativas.','')+
      '<div class="inbox">'+
        '<div class="conv-list"><div class="conv-search"><input class="input" id="ib-q" placeholder="buscar lead…"></div><div class="conv-items" id="ib-items"></div></div>'+
        '<div class="conv-main" id="ib-main"></div>'+
      '</div>';
    drawInbox(c);
    H.$('#ib-q',c).oninput=function(e){ drawInbox(c, e.target.value.toLowerCase()); };
  };
  function drawInbox(c,q){
    var comResp=S.get('leads').filter(function(l){ return (l.conversa||[]).some(function(m){return m.de==='them';}) && (!q||l.nome.toLowerCase().indexOf(q)>=0); });
    var items=H.$('#ib-items',c);
    items.innerHTML=comResp.map(function(l){ var last=(l.conversa||[]).slice(-1)[0];
      return '<div class="conv-item '+(l.id===inboxSel?'on':'')+'" data-id="'+l.id+'"><div class="ci-top"><span class="dot '+l.prio+'"></span><b>'+esc(l.nome)+'</b>'+(l.objecao?'<span class="tag warn" style="padding:0 6px">'+esc((S.get('objecoes')[l.objecao]||{}).rotulo||'')+'</span>':'')+'</div><div class="ci-cat">'+esc(l.cat)+' · '+esc(l.cidade)+'</div><div style="font-size:12px;color:var(--osso-3);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(last?last.txt:'')+'</div></div>';
    }).join('')||'<div class="empty" style="padding:30px">'+ic('inbox')+'<span>Ninguém respondeu ainda.</span></div>';
    H.$$('.conv-item',items).forEach(function(it){ it.onclick=function(){ inboxSel=it.dataset.id; drawInbox(c,q); }; });
    drawConv(c);
  }
  function drawConv(c){
    var main=H.$('#ib-main',c), l=S.get('leads').find(function(x){return x.id===inboxSel;});
    if(!l){ main.innerHTML='<div class="empty">'+ic('inbox')+'<span>Selecione uma conversa</span></div>'; return; }
    var cop=H.copiloto(l), objs=S.get('objecoes');
    var thread=(l.conversa||[]).map(function(m){ return '<div class="bub '+(m.de==='me'?'me':'them')+'">'+esc(m.txt)+'<div class="t">'+esc(m.t||'')+'</div></div>'; }).join('');
    var alert = l.objecao ? '<div class="obj-alert"><div class="ot">'+ic('alert')+' OBJEÇÃO: '+esc((objs[l.objecao]||{}).rotulo||'').toUpperCase()+'</div></div>' : '';
    var sug = cop.liberado ? '<div class="sug"><div class="st">'+ic('sparkles')+'SUGESTÃO DE RESPOSTA</div><div class="sm">'+esc(cop.msg)+'</div></div>' :
      '<div class="cop-hold" style="margin:0">'+ic('clock')+'<div>'+esc(cop.status)+'</div></div>';
    main.innerHTML='<div class="conv-head"><button class="btn-icon btn" id="lm-open">'+ic('eye')+'</button><div style="flex:1"><b>'+esc(l.nome)+'</b> <span class="tag steel" style="margin-left:6px">'+esc(l.estagio)+'</span><div class="sub">'+esc(l.cat)+' · '+esc(l.cidade)+'</div></div><a class="btn sm green" href="'+(l.whatsapp?'https://wa.me/'+l.whatsapp:'#')+'" target="_blank" rel="noopener">'+ic('whatsapp')+'Abrir</a></div>'+
      '<div class="conv-thread">'+thread+alert+sug+'</div>'+
      '<div class="conv-foot"><div class="obj-chips">'+Object.keys(objs).map(function(k){return '<button class="chip" data-obj="'+k+'">'+esc(objs[k].rotulo)+'</button>';}).join('')+'</div>'+
        '<div class="conv-input"><input class="input" id="ib-reply" placeholder="digite uma resposta pra simular…"><button class="btn primary" id="ib-send">'+ic('send')+'</button></div></div>';
    H.$('#lm-open',c).onclick=function(){ H.leadModal(l.id); };
    H.$$('.chip[data-obj]',c).forEach(function(ch){ ch.onclick=function(){ S.set(function(st){var t=st.leads.find(function(x){return x.id===l.id;}); t.objecao=ch.dataset.obj; (t.conversa=t.conversa||[]).push({de:'them',txt:objs[ch.dataset.obj].rotulo+'?',t:'agora'});}); drawInbox(c); H.toast('Objeção simulada: '+objs[ch.dataset.obj].rotulo); }; });
    var send=function(){ var v=H.$('#ib-reply',c).value.trim(); if(!v)return; S.set(function(st){var t=st.leads.find(function(x){return x.id===l.id;}); (t.conversa=t.conversa||[]).push({de:'me',txt:v,t:'agora'}); t.objecao=null;}); drawInbox(c); };
    H.$('#ib-send',c).onclick=send; H.$('#ib-reply',c).onkeydown=function(e){ if(e.key==='Enter')send(); };
  }

  /* =====================================================================
     RELATÓRIOS (dinheiro da operação)
     ===================================================================== */
  H.views.relatorios = function(c){
    c.className='view'; var f=S.get('financeiro');
    var maxBar=Math.max.apply(null,f.fechadoPorMes.map(function(x){return x[1];}))||1;
    c.innerHTML=head('<span class="serif">O dinheiro da operação</span>','Do lead ao contrato: quanto entrou, quanto falta, quanto se repete.','<button class="btn">'+ic('csv')+'CSV</button><button class="btn">'+ic('download')+'Print</button>')+
      '<div class="kpis stagger">'+
        kpi('money','Fechado',H.brl(f.fechado),f.fechadoClientes+' cliente(s)','green')+
        kpi('check','Recebido',H.brl(f.recebido),'','accent')+
        kpi('clock','A receber',H.brl(f.aReceber),'','warn')+
        kpi('trend','Recorrente',H.brl(f.recorrente),'por mês','violet')+
        kpi('briefcase','Em produção',f.emProducao,'projetos','accent')+
        kpi('zap','Pipeline provável',H.brl(f.pipelineProvavel),'em aberto','violet')+
      '</div>'+
      '<div class="fin-2">'+
        '<div class="card"><h3 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--osso-2)">Fechado por mês</h3>'+
          '<div class="bars">'+f.fechadoPorMes.map(function(x){ return '<div class="b"><i style="height:'+(x[1]/maxBar*100)+'%"></i><span>'+esc(x[0])+'</span></div>'; }).join('')+'</div></div>'+
        '<div class="card"><h3 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--osso-2)">Projetos por etapa</h3>'+
          '<ul class="by-stage" style="list-style:none;margin:10px 0 0;padding:0">'+f.projetosPorEtapa.map(function(p){return '<li><span class="dot" style="background:'+p[2]+'"></span>'+esc(p[0])+'<span class="n">'+p[1]+'</span></li>';}).join('')+'</ul>'+
          '<div style="margin-top:16px;border-top:1px solid var(--fio);padding-top:14px"><div class="fl">Ticket médio</div><div style="font-size:26px;font-weight:800;color:var(--branco)">'+H.brl(f.ticketMedio)+'</div></div></div>'+
      '</div>';
  };

  /* =====================================================================
     CLIENTES ATUAIS
     ===================================================================== */
  H.views.clientes = function(c){
    c.className='view'; var cl=S.get('clientes');
    c.innerHTML=head('Clientes atuais','A carteira que estamos tocando agora — status, fase e as travas de cada um.','')+
      '<div class="cli-grid stagger">'+cl.map(function(x){
        return '<div class="cli-card" data-id="'+x.id+'"><div class="ct"><div class="logo" style="background:linear-gradient(135deg,'+x.cor+',#0b0910)">'+esc(x.logo)+'</div>'+
          '<div style="flex:1"><h3>'+esc(x.nome)+'</h3><span class="seg">'+esc(x.seg)+'</span><span class="phase tag '+x.faseTag+'">'+esc(x.fase)+'</span></div></div>'+
          '<p>'+esc(x.desc)+'</p>'+
          '<div class="cflags">'+x.flags.map(function(fl){return '<span class="tag '+fl[0]+'">'+esc(fl[1])+'</span>';}).join('')+'</div>'+
          '<div style="font-size:11.5px;color:var(--osso-3);margin-top:12px">Máquina: '+esc(x.maquina)+'</div>'+
          '<div class="cbar">'+[1,2,3,4].map(function(i){return '<i class="'+(i<=x.prog?'on':'')+'"></i>';}).join('')+'</div></div>';
      }).join('')+'</div>';
    H.$$('.cli-card',c).forEach(function(card){ card.onclick=function(){ clienteModal(card.dataset.id); }; });
  };
  function clienteModal(id){
    var x=S.get('clientes').find(function(c){return c.id===id;}); if(!x)return;
    H.modal('<div class="lm-head"><button class="close" data-close>'+ic('x')+'</button><h2>'+esc(x.nome)+'</h2><div class="at">'+esc(x.seg)+'</div><div class="htags"><span class="tag '+x.faseTag+'">'+esc(x.fase)+'</span>'+x.flags.map(function(fl){return '<span class="tag '+fl[0]+'">'+esc(fl[1])+'</span>';}).join('')+'</div></div>'+
      '<div class="lm-body"><p style="color:var(--osso);font-size:14.5px;line-height:1.6">'+esc(x.desc)+'</p>'+
      '<div class="field" style="margin-top:14px"><label class="fl">Máquina de crescimento</label><div class="cop-msg" style="background:var(--void-2);border:1px solid var(--fio);border-radius:10px;padding:12px">'+esc(x.maquina)+'</div></div>'+
      '<div class="cop-hold" style="margin-top:8px">'+ic('shield')+'<div>Fonte: <code>_memoria/empresa.md</code>. Cliente de setor regulado: o compliance dele <b>trava</b> a entrega. Nada de número/depoimento inventado (integridade.md).</div></div>'+
      '<button class="btn primary" style="margin-top:14px" data-chat="'+esc(x.nome)+'">'+ic('sparkles')+'Perguntar ao Claude sobre este cliente</button></div>');
    var b=H.$('[data-chat]',H.$('#modal')); if(b)b.onclick=function(){ H.$('#scrim').click(); location.hash='#/claude'; setTimeout(function(){ H.chatPrefill&&H.chatPrefill('Me dá um resumo do cliente '+b.dataset.chat+' e o próximo passo prático.'); },300); };
  }

  /* ---------------- helpers compartilhados ---------------- */
  function head(title,sub,actions){ return '<div class="head"><div class="ht"><h1'+(title.indexOf('serif')>=0?'':'')+'>'+title+'</h1><p>'+esc(sub)+'</p></div><div class="actions">'+(actions||'')+'</div></div>'; }
  function kpi(icon,l,v,s,cls){ return '<div class="kpi '+(cls||'')+'"><div class="ic">'+ic(icon)+'</div><div class="kl">'+esc(l)+'</div><div class="kv">'+v+'</div>'+(s?'<div class="ks">'+esc(s)+'</div>':'')+'</div>'; }
  H._head=head; H._kpi=kpi;
})();
