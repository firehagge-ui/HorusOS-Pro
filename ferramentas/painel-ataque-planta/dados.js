/* ============================================================================
   Painel Ataque & Planta — dados de exemplo (seed)
   ----------------------------------------------------------------------------
   ⚠️ Tudo aqui é DADO DE EXEMPLO, fictício e claramente marcado. Não é lead
   real nem carteira real da Hórus. Serve para o painel ter o que mostrar na
   primeira abertura. Quando o Antônio usar de verdade, os leads entram pela
   ponte Spark (Gemini → Sheets → CSV) ou na mão, e substituem este seed.
   ============================================================================ */

// Estágios do funil, na ordem. "cliente" é a lane PLANTA (relacionamento/recompra);
// o resto é ATAQUE (originação).
window.ESTAGIOS = [
  { id: "lista",     nome: "Lista (frio)",     fase: "ataque", dica: "Estudado, ainda não abordado. 15–20 min de pesquisa antes do primeiro contato." },
  { id: "abordado",  nome: "Abordado",         fase: "ataque", dica: "Primeiro contato enviado. Aguardando resposta — nunca dispare o link antes de ele responder." },
  { id: "respondeu", nome: "Respondeu",        fase: "ataque", dica: "Porta aberta. Agora o copiloto libera a mensagem de dor + prévia e o convite pra R1." },
  { id: "r1",        nome: "R1 · Diagnóstico", fase: "ataque", dica: "Reunião de diagnóstico marcada/feita. ~10–20% dos abordados chegam aqui." },
  { id: "r2",        nome: "R2 · Fechamento",  fase: "ataque", dica: "Reunião de proposta. Benchmark de rede: ~1 em 3 fecha. Tirar o compromisso DENTRO da reunião." },
  { id: "cliente",   nome: "Cliente · Planta", fase: "planta", dica: "Fechou. Vira relacionamento: pós-venda, recompra, indicação. 50% de entrada antes de abrir o PC." },
];

// Metas da semana — calibradas pelos cards de _conhecimento/network/
// (taxas-de-conversao.md, abordagem-e-prospeccao.md). Referência, não promessa.
window.METAS = {
  empresasSemana: { alvo: 40, real: 34, label: "Empresas na mira",  faixa: "30–50/semana",  ajuda: "Escolher 30 a 50 empresas por semana (5–10/dia)." },
  abordagensHoje: { alvo: 5,  real: 3,  label: "Abordagens hoje",   faixa: "3–7/dia",        ajuda: "Abordagens de ALTA qualidade (prévia pronta ou ligação), não disparo frio." },
  taxaResposta:   { alvo: 35, real: 0,  label: "Taxa de resposta",  faixa: "meta 30–45%",   sufixo: "%", derivado: true, ajuda: "Modelo focado/personalizado. Volume frio fica em 1–5% e queima o chip." },
  taxaR1:         { alvo: 15, real: 0,  label: "Viraram R1",        faixa: "meta 10–20%",   sufixo: "%", derivado: true, ajuda: "% dos abordados que aceitaram a reunião de diagnóstico." },
  taxaR2:         { alvo: 33, real: 0,  label: "Fecham em R2",      faixa: "benchmark ~33%", sufixo: "%", derivado: true, ajuda: "1 venda a cada 3 reuniões de fechamento." },
  contratosMes:   { alvo: 4,  real: 2,  label: "Contratos no mês",  faixa: "~1/semana",      ajuda: "Modelo focado rende ~1 contrato/semana com 3–7 abordagens boas/dia." },
};

// Ganchos (ordem de força testada na rede)
window.GANCHOS = {
  "google-perda": { rotulo: "Google · perda de cliente", peso: "🏆 campeão", cor: "quente" },
  "site-fora":    { rotulo: "Site fora do ar",           peso: "limitado",   cor: "aviso"  },
  "presencial":   { rotulo: "Presencial / porta a porta", peso: "maior conversão", cor: "eletrico" },
  "indicacao":    { rotulo: "Indicação / relação",       peso: "quente",     cor: "eletrico" },
  "insta":        { rotulo: "Instagram / redes",         peso: "❌ baixa",   cor: "frio"   },
};

window.CANAIS = {
  texto:      "Texto (WhatsApp)",
  audio:      "Áudio",
  ligacao:    "Ligação (cold call)",
  presencial: "Presencial",
};

window.LEADS_SEED = [
  { id: "l01", empresa: "Ótica Vista Clara", nicho: "Ótica", cidade: "Salvador/BA", origem: "Ponte Spark (Maps)", gancho: "google-perda", canal: "texto", chip: "aquecido", estagio: "lista", contato: "Sr. Aderbal", nota: "Google 4,6★, 38 avaliações. Sem site. Concorrente ranqueia na frente.", historico: [] },
  { id: "l02", empresa: "Barbearia Dom Rocha", nicho: "Barbearia", cidade: "Lauro de Freitas/BA", origem: "Ponte Spark (Maps)", gancho: "google-perda", canal: "audio", chip: "aquecido", estagio: "lista", contato: "Diego", nota: "Agenda cheia por indicação, mas some no Google. Sem agendamento online.", historico: [] },
  { id: "l03", empresa: "Studio Bella Nails", nicho: "Estética", cidade: "Salvador/BA", origem: "Presencial (Bon Odori)", gancho: "presencial", canal: "presencial", chip: "aquecido", estagio: "abordado", contato: "Bruna", nota: "Falei na feira, deixei cartão. Retomar com prévia sob o braço.", historico: [{ q: "abordado", quando: "há 1 dia", texto: "Contato presencial + cartão." }] },
  { id: "l04", empresa: "Hamburgueria do Zé", nicho: "Alimentação", cidade: "Salvador/BA", origem: "Ponte Spark (Maps)", gancho: "google-perda", canal: "texto", chip: "aquecido", estagio: "abordado", contato: "Zé", nota: "Modelo B (dois passos) enviado. Chip aquecido, aguardando resposta.", historico: [{ q: "abordado", quando: "há 2 dias", texto: "Modelo dois passos — saudação enviada." }] },
  { id: "l05", empresa: "Pet Shop Focinho Feliz", nicho: "Pet", cidade: "Camaçari/BA", origem: "Apify (Maps)", gancho: "site-fora", canal: "texto", chip: "novo", estagio: "abordado", contato: "Larissa", nota: "Site velho fora do ar (link quebrado). Chip NOVO — ritmo conservador.", historico: [{ q: "abordado", quando: "há 3 dias", texto: "Gancho site fora do ar." }] },
  { id: "l06", empresa: "Marmoraria Pedra Nobre", nicho: "Construção", cidade: "Simões Filho/BA", origem: "Casa dos Dados (CNPJ)", gancho: "google-perda", canal: "ligacao", chip: "aquecido", estagio: "respondeu", contato: "Cláudio", nota: "Respondeu ao áudio. Pediu pra ver o modelo. Liberar prévia + convite R1.", historico: [{ q: "abordado", quando: "há 4 dias", texto: "Áudio de 1 min sobre perda no Google." }, { q: "respondeu", quando: "há 1 dia", texto: "\"Manda esse modelo aí pra eu ver\"." }] },
  { id: "l07", empresa: "Doceria Amêndoa & Cia", nicho: "Alimentação", cidade: "Salvador/BA", origem: "Indicação", gancho: "indicacao", canal: "texto", chip: "aquecido", estagio: "respondeu", contato: "Tia Cléo", nota: "Veio por indicação da prima. Quente. Mandar prévia e propor call.", historico: [{ q: "abordado", quando: "há 3 dias", texto: "Indicação + elogio sincero." }, { q: "respondeu", quando: "há 6 h", texto: "\"A [prima] falou de vocês, quero ver sim\"." }] },
  { id: "l08", empresa: "Auto Elétrica Faísca", nicho: "Automotivo", cidade: "Salvador/BA", origem: "Ponte Spark (Maps)", gancho: "google-perda", canal: "ligacao", chip: "aquecido", estagio: "r1", contato: "Seu Val", nota: "R1 amanhã 15h. Estudar concorrência local de auto elétrica antes.", historico: [{ q: "abordado", quando: "há 6 dias", texto: "Ligação — dor de perder cliente no Maps." }, { q: "respondeu", quando: "há 4 dias", texto: "Topou conversar." }, { q: "r1", quando: "há 1 dia", texto: "R1 marcada: amanhã 15h." }] },
  { id: "l09", empresa: "Clínica Odonto Sorriso Real", nicho: "Odontologia", cidade: "Salvador/BA", origem: "Presencial", gancho: "presencial", canal: "presencial", chip: "aquecido", estagio: "r1", contato: "Dra. Marina", nota: "⚠️ Setor REGULADO (CFO). Compliance trava a peça — sem promessa/antes-depois. R1 feita, mandar proposta.", historico: [{ q: "abordado", quando: "há 8 dias", texto: "Visita presencial." }, { q: "respondeu", quando: "há 7 dias", texto: "Pediu proposta." }, { q: "r1", quando: "há 2 dias", texto: "R1 feita — diagnóstico ok." }] },
  { id: "l10", empresa: "Restaurante Sabor da Bahia", nicho: "Alimentação", cidade: "Salvador/BA", origem: "Ponte Spark (Maps)", gancho: "google-perda", canal: "audio", chip: "aquecido", estagio: "r2", contato: "Dona Rita", nota: "R2 sexta. Faixa R$2–3k. Tirar o SIM na reunião, não deixar pro grupo depois.", historico: [{ q: "abordado", quando: "há 10 dias", texto: "Modelo A — prévia com a marca dela." }, { q: "respondeu", quando: "há 8 dias", texto: "Adorou a prévia." }, { q: "r1", quando: "há 5 dias", texto: "Diagnóstico: perde delivery pro iFood." }, { q: "r2", quando: "há 1 dia", texto: "R2 marcada: sexta 10h." }] },
  { id: "l11", empresa: "Academia Corpo em Movimento", nicho: "Fitness", cidade: "Salvador/BA", origem: "Apify (Maps)", gancho: "google-perda", canal: "texto", chip: "aquecido", estagio: "r2", contato: "Rodrigo", nota: "Proposta faseada apresentada. Aguardando entrada de 50%.", historico: [{ q: "abordado", quando: "há 12 dias", texto: "Gancho Google + agendamento." }, { q: "respondeu", quando: "há 9 dias", texto: "Respondeu." }, { q: "r1", quando: "há 6 dias", texto: "R1 ok." }, { q: "r2", quando: "há 2 dias", texto: "Proposta na mesa." }] },
  { id: "l12", empresa: "Floricultura exemplo (Planta)", nicho: "Floricultura", cidade: "Salvador/BA", origem: "Relação", gancho: "indicacao", canal: "texto", chip: "aquecido", estagio: "cliente", contato: "Varo", nota: "FECHADO. Fase 1 (site+WhatsApp) entregue, entrada paga. Fase 2 (CRM) a apresentar. Recompra por datas.", historico: [{ q: "r2", quando: "há 15 dias", texto: "Fechou na reunião presencial." }, { q: "cliente", quando: "há 10 dias", texto: "50% de entrada. Fase 1 iniciada." }] },
  { id: "l13", empresa: "Café exemplo (Planta)", nicho: "Alimentação B2B/B2C", cidade: "Interior/BA", origem: "Relação", gancho: "indicacao", canal: "texto", chip: "aquecido", estagio: "cliente", contato: "Nelson", nota: "Site no ar. Próximo: CRM pago (trabalho pago, escopo próprio). Não deixar virar extensão do grátis.", historico: [{ q: "cliente", quando: "há 30 dias", texto: "Site aprovado e no ar." }] },
];
