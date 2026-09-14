/* ============================================================================
   HÓRUS CRM — seed de dados
   ⚠️ Leads de PROSPECÇÃO são fictícios e marcados (integridade.md).
   Os CLIENTES ATUAIS usam fatos já versionados em _memoria/empresa.md (alto nível).
   ============================================================================ */
window.H = window.H || {};
(function(){

  function conv(arr){ return arr.map(function(m){ return {de:m[0], txt:m[1], t:m[2]}; }); }

  // Leads de prospecção (funil). estagio: novo|abordado|conversando|interessado|proposta|fechado|perdido
  var leads = [
    {id:'k01', nome:'Clínica Faccia Mirassol', handle:'clinicafacciamirassol', cat:'Clínica de Estética', cidade:'Mirassol/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'2d', whatsapp:'5517991020910', endereco:'Rua 15 de Novembro, nº 20-08, Centro, Mirassol/SP',
     situacaoSite:'Apenas Instagram, sem site próprio', contatos:1, obs:'2.474 seguidores, contato só por telefone/WhatsApp na bio, sem site próprio.',
     ig:{seguidores:'2.474', bio:'contato só por telefone/WhatsApp na bio sem site próprio.'}, gancho:'site-fora', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi, tudo bem? Me chamo Arthur!','22/08 14:24']]),
     hist:[{q:'abordado',quando:'há 1 dia',txt:'Primeiro contato enviado.'}]},
    {id:'k02', nome:'Dra. Gabriela Rotta Odontologia', handle:'gabrielarotta.odonto', cat:'Clínica Odontológica', cidade:'Catanduva/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'já', whatsapp:'5517998812200', endereco:'Rua Belo Horizonte, 1072, Catanduva/SP',
     situacaoSite:'Sem site, agenda pelo Instagram', contatos:2, obs:'Odonto premium, ótimas avaliações no Google. Respondeu, quer ver o modelo.',
     ig:{seguidores:'5.130', bio:'Odontologia estética · Catanduva'}, gancho:'google-perda', canal:'audio', estagio:'conversando',
     conversa:conv([['me','Opa doutora! Procurei por odonto em Catanduva e vi que a sra. não aparece fácil no Google.','ontem'],['them','oi! como assim não apareço?','ontem'],['me','Quem busca "dentista Catanduva" agenda com quem aparece primeiro. Montei um modelo pra sra. Posso mostrar?','ontem']]),
     hist:[{q:'abordado',quando:'há 3 dias',txt:'Áudio de 1 min.'},{q:'conversando',quando:'ontem',txt:'Respondeu, curiosa.'}]},
    {id:'k03', nome:'Confeitaria Urbana | Conceição e Brooklin', handle:'confeitariaurbana', cat:'Confeitaria', cidade:'São Paulo/SP',
     site:'sem', score:72, prio:'alta', liberaEm:'já', whatsapp:'5511994455660', endereco:'Rua Barão do Rio Branco, 210, Brooklin, SP',
     situacaoSite:'Sem site, pedidos por Instagram', contatos:2, obs:'Duas unidades. Interessada, pediu proposta.',
     ig:{seguidores:'8.900', bio:'Bolos e doces sob encomenda · 2 unidades'}, gancho:'google-perda', canal:'texto', estagio:'interessado',
     conversa:conv([['me','Montei um modelo de loja pra vocês com o pedido caindo no WhatsApp.','2 dias'],['them','amei! quanto fica?','1 dia']]),
     hist:[{q:'interessado',quando:'há 1 dia',txt:'Pediu proposta.'}]},
    {id:'k04', nome:'Nilima Estética e Depilação', handle:'nilimaestetica', cat:'Clínica de Estética', cidade:'Bady Bassitt/SP',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5517991110022', endereco:'Bady Bassitt/SP', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo do Apify. Ainda não abordado.', ig:{seguidores:'1.240', bio:'Estética & depilação'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k05', nome:'Clínica Estética Tainá Alves', handle:'tainaalves.estetica', cat:'Clínica de Estética', cidade:'Jardim Alpino/SP',
     site:'ruim', score:72, prio:'media', liberaEm:'já', whatsapp:'5517993334455', endereco:'R. Pojos de Caldas, 343 - Jardim Alpino/SP', situacaoSite:'Site antigo, lento',
     contatos:0, obs:'Lead novo. Site velho fora do padrão.', ig:{seguidores:'2.010', bio:'Harmonização facial'}, gancho:'site-fora', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k06', nome:'Lívia Salles Estética', handle:'liviasalles.estetica', cat:'Clínica de Estética', cidade:'Catanduva/SP',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5517990001122', endereco:'Catanduva/SP', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo do Apify.', ig:{seguidores:'980', bio:'Estética avançada'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k07', nome:'Rio Preto Odonto', handle:'riopretoodonto', cat:'Clínica Odontológica', cidade:'São José do Rio Preto/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'já', whatsapp:'5517992223344', endereco:'São José do Rio Preto/SP', situacaoSite:'Sem site',
     contatos:0, obs:'Alta prioridade — odonto, sem site.', ig:{seguidores:'3.400', bio:'Odontologia integrada'}, gancho:'google-perda', canal:'ligacao', estagio:'novo', conversa:[], hist:[]},
    {id:'k08', nome:'Visage Clinic Rio Preto', handle:'visageclinic', cat:'Clínica de Estética', cidade:'São José do Rio Preto/SP',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5517995556677', endereco:'São José do Rio Preto/SP', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo.', ig:{seguidores:'4.120', bio:'Estética & bem-estar'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k09', nome:'Urban Clinique', handle:'urbanclinique', cat:'Clínica de Estética', cidade:'Vila Redentora/SP',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5517994443322', endereco:'Rua Redentora, 2332, Vila Redentora, SP', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo.', ig:{seguidores:'1.780', bio:'Clínica estética urbana'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k10', nome:'Clínica Virgo', handle:'clinicavirgo', cat:'Clínica de Estética', cidade:'São José do Rio Preto/SP',
     site:'ruim', score:47, prio:'baixa', liberaEm:'já', whatsapp:'5517990009988', endereco:'São José do Rio Preto/SP', situacaoSite:'Site ruim',
     contatos:0, obs:'Score baixo — avaliar antes de abordar.', ig:{seguidores:'640', bio:'Estética'}, gancho:'site-fora', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k11', nome:'Siriani Odontologia', handle:'siriani.odonto', cat:'Clínica Odontológica', cidade:'Mirassol/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'2d', whatsapp:'5517993331100', endereco:'Rua Armando Salles de Oliveira, 2066, Mirassol/SP', situacaoSite:'Sem site',
     contatos:1, obs:'Abordado, aguardando resposta.', ig:{seguidores:'2.900', bio:'Odontologia · Mirassol'}, gancho:'google-perda', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi, tudo bem? Aqui é o Arthur.','há 2 dias']]), hist:[{q:'abordado',quando:'há 2 dias',txt:'Saudação enviada.'}]},
    {id:'k12', nome:'Dra. Camila Prado Odontologia', handle:'camilaprado.odonto', cat:'Clínica Odontológica', cidade:'Mirassol/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'2d', whatsapp:'5517992220099', endereco:'Mirassol/SP', situacaoSite:'Sem site',
     contatos:1, obs:'Abordado.', ig:{seguidores:'6.200', bio:'Odontologia estética'}, gancho:'google-perda', canal:'audio', estagio:'abordado',
     conversa:conv([['me','Boa tarde! Vi a clínica e queria te mostrar uma coisa rápida.','há 1 dia']]), hist:[{q:'abordado',quando:'há 1 dia',txt:'Contato enviado.'}]},
    {id:'k13', nome:'Misko Odontologia', handle:'misko.odonto', cat:'Clínica Odontológica', cidade:'Mirassol/SP',
     site:'sem', score:80, prio:'alta', liberaEm:'2d', whatsapp:'5517991119988', endereco:'Mirassol/SP', situacaoSite:'Sem site',
     contatos:1, obs:'Abordado.', ig:{seguidores:'3.100', bio:'Odontologia'}, gancho:'google-perda', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi! Tudo bem?','há 3 dias']]), hist:[{q:'abordado',quando:'há 3 dias',txt:'Saudação.'}]},
    {id:'k14', nome:'Clínica Michelle Ferreira - Estética Integrativa', handle:'michelleferreira.estetica', cat:'Clínica de estética', cidade:'Rio Preto/SP',
     site:'sem', score:55, prio:'media', liberaEm:'já', whatsapp:'5517993332211', endereco:'Rio Preto/SP', situacaoSite:'Sem site',
     contatos:1, obs:'Abordado.', ig:{seguidores:'1.450', bio:'Estética integrativa'}, gancho:'google-perda', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi Michelle! Vi seu trabalho, muito bom.','há 2 dias']]), hist:[{q:'abordado',quando:'há 2 dias',txt:'Elogio + gancho.'}]},
    {id:'k15', nome:'Clínica Renata Fontany', handle:'renatafontany', cat:'Harmonização facial', cidade:'Rio Preto/SP',
     site:'sem', score:59, prio:'media', liberaEm:'já', whatsapp:'5517990102030', endereco:'Rio Preto/SP', situacaoSite:'Não avaliado',
     contatos:1, obs:'Abordado, sem resposta ainda.', ig:{seguidores:'2.220', bio:'Harmonização facial'}, gancho:'google-perda', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi! Tudo bem?','há 1 dia']]), hist:[{q:'abordado',quando:'há 1 dia',txt:'Saudação.'}]},
    {id:'k16', nome:'NutroMed | Clínica de Emagrecimento', handle:'nutromed', cat:'Centro de saúde e beleza', cidade:'Barra/SP',
     site:'sem', score:70, prio:'alta', liberaEm:'já', whatsapp:'5517987165694', endereco:'Barra/SP', situacaoSite:'Sem site',
     contatos:2, obs:'Conversando. Objeção de preço veio à tona.', ig:{seguidores:'7.400', bio:'Emagrecimento e saúde'}, gancho:'google-perda', canal:'texto', estagio:'conversando',
     conversa:conv([['me','Montei um modelo pra clínica com agendamento no WhatsApp.','há 2 dias'],['them','quanto custa isso mesmo?','há 3 h']]),
     hist:[{q:'conversando',quando:'há 3 h',txt:'Perguntou preço.'}], objecao:'preco'},
    {id:'k17', nome:'Manauara Estética', handle:'manauaraestetica', cat:'Centro de saúde e beleza', cidade:'Salvador/BA',
     site:'sem', score:70, prio:'alta', liberaEm:'já', whatsapp:'5571987165694', endereco:'Centro de saúde e beleza, Salvador/BA', situacaoSite:'Sem site',
     contatos:3, obs:'Objeção de preço. Sugestão de resposta pronta no copiloto.', ig:{seguidores:'3.980', bio:'Estética · Salvador'}, gancho:'google-perda', canal:'texto', estagio:'conversando',
     conversa:conv([['me','Oi! Montei uma prévia pra vocês.','há 1 dia'],['them','quanto custa isso mesmo?','há 20 min']]),
     hist:[{q:'conversando',quando:'há 20 min',txt:'Objeção: preço.'}], objecao:'preco'},
    {id:'k18', nome:'Dra. Tassia Moreira | Estética Avançada', handle:'tassiamoreira', cat:'Centro de saúde e beleza', cidade:'STIEP/Salvador',
     site:'sem', score:59, prio:'media', liberaEm:'já', whatsapp:'5571993330011', endereco:'STIEP, Salvador/BA', situacaoSite:'Sem site',
     contatos:1, obs:'Abordado.', ig:{seguidores:'2.660', bio:'Estética avançada'}, gancho:'google-perda', canal:'texto', estagio:'abordado',
     conversa:conv([['me','Oi doutora! Tudo bem?','há 1 dia']]), hist:[{q:'abordado',quando:'há 1 dia',txt:'Saudação.'}]},
    {id:'k19', nome:'Clínica Bruna Souza Estética', handle:'brunasouza.estetica', cat:'Esteticista', cidade:'Itacaranha/Salvador',
     site:'sem', score:59, prio:'media', liberaEm:'já', whatsapp:'5571994445566', endereco:'Itacaranha, Salvador/BA', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo.', ig:{seguidores:'1.120', bio:'Esteticista'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]},
    {id:'k20', nome:'Odonto Excellence', handle:'odontoexcellence', cat:'Clínica Odontológica', cidade:'Salvador/BA',
     site:'sem', score:80, prio:'alta', liberaEm:'já', whatsapp:'5571990112233', endereco:'Pituba, Salvador/BA', situacaoSite:'Sem site',
     contatos:2, obs:'Interessado, agendou conversa.', ig:{seguidores:'9.200', bio:'Odontologia de excelência'}, gancho:'google-perda', canal:'ligacao', estagio:'interessado',
     conversa:conv([['me','Doutor, montei o modelo. Bora conversar 15 min?','há 2 dias'],['them','pode ser amanhã 15h','ontem']]),
     hist:[{q:'interessado',quando:'ontem',txt:'Marcou conversa: amanhã 15h.'}]},
    {id:'k21', nome:'Studio Bella Estética', handle:'studiobella', cat:'Clínica de Estética', cidade:'Salvador/BA',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5571993331144', endereco:'Salvador/BA', situacaoSite:'Sem site',
     contatos:3, obs:'Proposta enviada, negociando faseamento.', ig:{seguidores:'4.500', bio:'Studio de estética'}, gancho:'google-perda', canal:'texto', estagio:'proposta',
     conversa:conv([['me','Proposta: Fase 1 R$1.200 (site+WhatsApp).','há 2 dias'],['them','deixa eu ver com meu sócio','ontem']]),
     hist:[{q:'proposta',quando:'ontem',txt:'Proposta na mesa.'}]},
    {id:'k22', nome:'Clínica Sorriso Vivo', handle:'sorrisovivo', cat:'Clínica Odontológica', cidade:'Salvador/BA',
     site:'sem', score:80, prio:'alta', liberaEm:'já', whatsapp:'5571995550088', endereco:'Salvador/BA', situacaoSite:'Sem site', regulado:true,
     contatos:4, obs:'⚠️ Setor regulado (CFO). Fechou! Entrada paga. Compliance trava a peça.', ig:{seguidores:'6.700', bio:'Odontologia'}, gancho:'google-perda', canal:'presencial', estagio:'fechado',
     conversa:conv([['me','Fechado! Começamos pela Fase 1 com 50% de entrada.','há 5 dias'],['them','feito, mando o pix','há 5 dias']]),
     hist:[{q:'fechado',quando:'há 5 dias',txt:'Fechou. 50% de entrada. ⚠️ Compliance CFO.'}], valor:1200},
    {id:'k23', nome:'Espaço Zen Estética', handle:'espacozen', cat:'Clínica de Estética', cidade:'Salvador/BA',
     site:'ruim', score:55, prio:'baixa', liberaEm:'já', whatsapp:'5571990203040', endereco:'Salvador/BA', situacaoSite:'Site ruim',
     contatos:2, obs:'Sem interesse por ora — follow-up frio.', ig:{seguidores:'890', bio:'Estética & spa'}, gancho:'site-fora', canal:'texto', estagio:'perdido',
     conversa:conv([['me','Oi! Tenho uma ideia pra vocês.','há 6 dias'],['them','agora não, obrigada','há 4 dias']]),
     hist:[{q:'perdido',quando:'há 4 dias',txt:'Sem interesse agora.'}]},
    {id:'k24', nome:'Harmonia Odonto', handle:'harmoniaodonto', cat:'Clínica Odontológica', cidade:'Lauro de Freitas/BA',
     site:'sem', score:72, prio:'media', liberaEm:'já', whatsapp:'5571993338877', endereco:'Lauro de Freitas/BA', situacaoSite:'Sem site',
     contatos:0, obs:'Lead novo.', ig:{seguidores:'2.300', bio:'Odontologia'}, gancho:'google-perda', canal:'texto', estagio:'novo', conversa:[], hist:[]}
  ];

  // Estágios do pipeline (funil de prospecção — refs img 9 + doutrina Ataque&Planta)
  var estagios = [
    {id:'novo',        nome:'Novo',        cor:'#4b93e6'},
    {id:'abordado',    nome:'Abordado',    cor:'#a855f7'},
    {id:'conversando', nome:'Conversando', cor:'#F4C430'},
    {id:'interessado', nome:'Interessado',cor:'#ff8a3d'},
    {id:'proposta',    nome:'Proposta',    cor:'#22d3ee'},
    {id:'fechado',     nome:'Fechado',     cor:'#25d366'},
    {id:'perdido',     nome:'Perdido',     cor:'#ef4444'}
  ];

  // Clientes atuais (carteira real, alto nível — fatos de _memoria/empresa.md)
  var clientes = [
    {id:'c-amparo', nome:'Amparo Flores', seg:'Floricultura · Graça/Salvador', logo:'AF', cor:'#a855f7',
     fase:'Fechado · Fase 1', faseTag:'green', prog:2, desc:'Fechado em 03/09. Fase 1 (loja + pedido no WhatsApp, R$1.200) em entrega. Fase 2 (CRM + recompra por datas) a apresentar.',
     flags:[['ember','Recompra/datas'],['violet','B2B assinatura'],['warn','Foto real só']], maquina:'Coroa/urgência · CRM de datas · assinatura B2B'},
    {id:'c-grao', nome:'Café Grão da Serra', seg:'Café torrado · Brejões/BA', logo:'GS', cor:'#b45309',
     fase:'Cliente · Site no ar', faseTag:'green', prog:3, desc:'Site institucional no ar. Próximo: CRM pago (escopo próprio). "A gente não planta, a gente escolhe" — sem "nossa lavoura".',
     flags:[['green','B2B + B2C'],['warn','Sem "lavoura"']], maquina:'GMB → Site (no ar) → CRM (pago)'},
    {id:'c-aion', nome:'Aion Psicologia', seg:'Psicologia · Itaigara/Salvador', logo:'AP', cor:'#0ea5e9',
     fase:'Engavetada', faseTag:'steel', prog:2, desc:'Site de 10 páginas pronto (especulativo). Engavetada desde 01/09. Falta dado que só a cliente tem. ⚠️ Compliance CFP.',
     flags:[['red','Compliance CFP'],['steel','Engavetada']], maquina:'Site → link na bio → blog'},
    {id:'c-mayara', nome:'Mayara Barros', seg:'Psicologia/arte/filosofia', logo:'MB', cor:'#ec4899',
     fase:'Instagram', faseTag:'ember', prog:1, desc:'Foco Instagram. Direção "Galeria" travada. Post #1 renderizado. ⚠️ CFP. CRP 03/36219 ativo.',
     flags:[['red','Compliance CFP'],['violet','Não pagante']], maquina:'Instagram (foco)'},
    {id:'c-permita', nome:'Permita-se Fitness', seg:'Estúdio multi-modalidade · Salvador', logo:'PF', cor:'#22c55e',
     fase:'GMB (prioridade)', faseTag:'ember', prog:1, desc:'Presença digital zero. Máquina: Google Meu Negócio → Instagram → Site. Evitar promessa de resultado físico.',
     flags:[['warn','Sem promessa física']], maquina:'GMB → Instagram → Site'},
    {id:'c-washington', nome:'Washington / Delano', seg:'Mentoria (massoterapia) · Salvador', logo:'WD', cor:'#f97316',
     fase:'Follow-up frio', faseTag:'steel', prog:1, desc:'Proposta faseada enviada (Fase 1 R$1.200 · Fase 2 R$1.500). Não fechou por ora (família/adiar). Retomar quando sinalizar.',
     flags:[['warn','Reposicionar p/ terapêutico'],['steel','Follow-up frio']], maquina:'Site autoridade + GMB → venda mentoria'},
    {id:'c-mullsanni', nome:'Mullsanni Performance', seg:'Oficina performance · Lauro de Freitas', logo:'MP', cor:'#ef4444',
     fase:'Lead em avaliação', faseTag:'steel', prog:1, desc:'Lead do Bon Odori. Site fora do ar, zero tráfego pago. Prévia rodada 4 com fotos reais. Ticket alto (R$1.5k–8k).',
     flags:[['ember','Site + tráfego'],['warn','Sem "calc. de cavalos"']], maquina:'Site autoridade + GMB → recompra → tráfego'}
  ];

  // Financeiro (dinheiro da operação — refs img 8)
  var financeiro = {
    fechado:1200, fechadoClientes:1, recebido:600, aReceber:600, recorrente:0, emProducao:2, pipelineProvavel:8400,
    ticketMedio:1200,
    fechadoPorMes:[['Abr',0],['Mai',1200],['Jun',0],['Jul',1200],['Ago',2400],['Set',1200]],
    projetosPorEtapa:[['Briefing',1,'#4b93e6'],['Em produção',2,'#a855f7'],['Em revisão',0,'#f4c430'],['Entregue',3,'#25d366'],['Pausado',1,'#ef4444']]
  };

  // Dashboard (refs img 5)
  var dash = {
    leadsProntos:{n:247, nicho:'Dentistas', cidade:'Salvador'},
    campanha:{pct:78, enviados:192, total:247},
    respostas:{novas:18, interessados:7, negociacao:4},
    agendamento:{quando:'Amanhã · 09:00', leads:324},
    controle:['Delays configurados','Pausas automáticas','Horários comerciais','Aquecimento gradual']
  };

  // Operação (wizard) — refs img 1, 2
  var operacao = {
    numeros:[{id:'n1', nome:'01 Disparo', status:'conectado', enviadasHoje:1, limite:80, envia:'Divide a fila com os outros números'}],
    ritmo:'conservador', // conservador|recomendado|rapido
    horaDe:'09:00', horaAte:'20:00',
    dias:['SEG','TER','QUA','QUI','SEX'],
    leadsSelecionados:150, fila:150
  };

  var ritmos = [
    {id:'conservador', nome:'Conservador', desc:'Intervalos longos entre mensagens. Menos volume por hora, menor chance de o número chamar atenção.', meta:'90–180s entre mensagens'},
    {id:'recomendado', nome:'Recomendado', desc:'Equilibra velocidade e segurança com intervalos variáveis entre as mensagens.', meta:'45–90s entre mensagens'},
    {id:'rapido', nome:'Mais rápido', desc:'Intervalos curtos, mais mensagens por hora. Aumenta o risco de bloqueio, principalmente em número novo.', meta:'25–50s entre mensagens'}
  ];

  // Objeções (refs img 6) + sugestões do copiloto
  var objecoes = {
    preco:{rotulo:'Preço', sug:'Depende do que você precisa — cada projeto é sob medida, não tenho tabela fixa. Pra te passar um número certo, preciso entender rapidinho seu caso. Topa 5 minutos de conversa?'},
    jatem:{rotulo:'Já tem', sug:'Que bom que já tem! O que montei não substitui — mostra onde você ainda perde cliente pro concorrente no Google. Vale um olhar de 2 min?'},
    seminteresse:{rotulo:'Sem interesse', sug:'Tranquilo! Só deixo registrado: quem busca seu serviço no Google e não te acha, vai pro concorrente. Se um dia quiser resolver isso, é só chamar.'},
    maisinfo:{rotulo:'Mais info', sug:'Claro! Em resumo: um site que faz o cliente cair direto no seu WhatsApp, sem depender só do Instagram. Te mando um modelo com a sua marca?'},
    naoecomigo:{rotulo:'Não é comigo', sug:'Entendi! Com quem eu falo sobre isso? Prefiro tratar com quem decide pra não te tomar tempo à toa.'},
    semtempo:{rotulo:'Sem tempo', sug:'Total. Deixa eu facilitar: te mando um áudio de 1 min e você ouve quando puder. Pode ser?'},
    desconfianca:{rotulo:'Desconfiança', sug:'Justo desconfiar — tem muita gente ruim no mercado. Por isso já cheguei com um modelo pronto, sem você pagar nada pra ver. O trabalho fala por si.'}
  };

  H.SEED = { leads:leads, estagios:estagios, clientes:clientes, financeiro:financeiro, dash:dash, operacao:operacao, ritmos:ritmos, objecoes:objecoes,
    chat:{ apiKey:'', model:'claude-sonnet-4-5', mensagens:[] } };
})();
