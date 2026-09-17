// =============================================================================
// Farejador — o que o Claude recebe em cada tipo de trabalho.
// A doutrina da casa vem de arquivo versionado (CLAUDE.md, _memoria, network),
// que o Claude enxerga porque roda dentro do repositório.
// =============================================================================

export const REGRAS_CASA = `Você é o copiloto comercial da Hórus, agência de marketing com IA em Salvador/BA, operando dentro do Hound Dog (o CRM da casa).
Fale português do Brasil, direto e prático, como parceiro de operação. Sem jargão de agência, sem encher linguiça.

Doutrina que vale sempre:
- Personalização vence volume. Nada de disparo em massa, nada de insistir antes de o lead responder.
- O gancho tem que ser VERDADEIRO (site fora do ar, não aparecer no Google, algo real do negócio). Pretexto inventado queima a credibilidade.
- O dono não compra site: compra parar de perder cliente pro concorrente. Fale da dor de faturamento.
- Preço só se apresenta ao vivo, na reunião. Por mensagem o objetivo é AGENDAR. Projeto acima de R$ 2.000 não fecha por WhatsApp.
- Oferta em fases: Fase 1 site + Google Meu Negócio (R$ 1.200 a 2.000), Fase 2 recompra/CRM (R$ 3.000 a 4.000 + R$ 250 a 350/mês), Fase 3 tráfego (R$ 700 a 1.500/mês).
- "Achou caro" é valor percebido baixo: reinstala valor e custo da inação, nunca corta preço. Desconto só com contrapartida.
- Objeção é sinal, não é não. Pergunta devolve a bola: o cliente se convence sozinho.
- Cliente de setor regulado (CFO odonto, CFP psicologia, CFM, OAB): compliance TRAVA. Sem promessa de resultado, sem superlativo, sem antes/depois, sem depoimento onde o conselho proíbe.
- Integridade: nunca invente número, formação, depoimento ou contato. O que falta vira [FALTA: ...]. Nunca presuma dígito de telefone.
- Números de benchmark do network são referência, não meta e nunca promessa ao cliente.`;

export const REGRAS_CRM = `Você tem as ferramentas do Hound Dog (mcp__hound-dog__*). Use-as de verdade:
- hd_resumo para entender a situação antes de responder "o que fazer hoje".
- hd_buscar_empresas / hd_empresa para puxar ficha.
- hd_salvar_empresa, hd_mover_estagio, hd_registrar_atividade, hd_agendar, hd_salvar_negocio, hd_registrar_financeiro quando o Marcelo pedir para criar/atualizar/mover/agendar.
Faça a alteração e depois conte o que fez, em uma linha. Não peça confirmação para registrar algo que ele acabou de dizer; peça só quando faltar dado essencial (nome, data).`;

const fmt = (v) => (v == null || v === '' ? '—' : v);

export function fichaResumida(e) {
  if (!e) return '';
  return [
    `Empresa: ${e.nome} (id ${e.id})`,
    `Nicho/cidade: ${fmt(e.categoria)} · ${[e.bairro, e.cidade].filter(Boolean).join(', ') || '—'}`,
    `Estágio: ${e.estagio} · relação: ${e.relacao} · score ${e.score}/100 · temperatura ${fmt(e.temperatura)}`,
    `Decisor: ${fmt(e.decisor)}${e.decisor_obs ? ` (${e.decisor_obs})` : ''}`,
    `Contato: WhatsApp ${fmt(e.whatsapp)} · Instagram ${e.instagram ? `@${e.instagram}` : '—'}${e.instagram_seguidores ? ` (${e.instagram_seguidores} seg.)` : ''} · site ${fmt(e.site)} [${e.site_status}]`,
    `Google: ${e.google_nota != null ? `${e.google_nota}★ com ${fmt(e.google_avaliacoes)} avaliações` : '—'} · perfil: ${fmt(e.gmb_status)} · anúncio: ${e.roda_anuncio == null ? '—' : e.roda_anuncio ? 'sim' : 'não'}`,
    e.regulado ? `⚠️ SETOR REGULADO (${fmt(e.conselho)}): compliance trava a peça e a mensagem.` : '',
    `Gancho: ${fmt(e.gancho)}`,
    `Dor: ${fmt(e.dor)}`,
    `Próxima ação: ${fmt(e.proxima_acao)}${e.proxima_acao_em ? ` (até ${new Date(e.proxima_acao_em).toLocaleString('pt-BR', { timeZone: 'America/Bahia' })})` : ''}`,
    e.valor_estimado ? `Valor estimado: R$ ${e.valor_estimado}` : '',
    e.pasta_repo ? `Pasta no repositório: ${e.pasta_repo} (leia se precisar de detalhe)` : '',
    e.resumo ? `Resumo: ${e.resumo}` : '',
  ].filter(Boolean).join('\n');
}

export function linhaDoTempo(atividades, limite = 15) {
  if (!atividades?.length) return 'Sem histórico registrado.';
  return atividades.slice(0, limite).map((a) => `- ${new Date(a.criado_em).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })} [${a.tipo}] ${a.titulo}${a.descricao ? `: ${a.descricao.slice(0, 220)}` : ''} (${a.autor})`).join('\n');
}

export function transcricaoWhats(msgs, limite = 30) {
  if (!msgs?.length) return 'Sem mensagens.';
  return msgs.slice(-limite).map((m) => `${m.direcao === 'in' ? 'LEAD' : 'HÓRUS'} (${new Date(m.momento).toLocaleString('pt-BR', { timeZone: 'America/Bahia', dateStyle: 'short', timeStyle: 'short' })}): ${m.texto || `[${m.tipo}]`}`).join('\n');
}

export function playbookTexto(playbook) {
  return playbook.map((o) => `• ${o.rotulo}\n  leitura: ${o.leitura || '—'}\n  resposta base: ${o.resposta}${o.evitar ? `\n  evitar: ${o.evitar}` : ''}`).join('\n');
}

/* ------------------------------ Análise de conversa ------------------------------ */
export function promptAnalise({ empresa, conversa, mensagens, playbook, suspeitas }) {
  return `Leia esta conversa de WhatsApp e devolva a análise comercial.

${empresa ? `FICHA DO LEAD\n${fichaResumida(empresa)}` : `Contato ainda não cadastrado no CRM. Nome no WhatsApp: ${conversa.nome || '—'} · telefone ${conversa.telefone}`}

CONVERSA (mais antiga primeiro)
${transcricaoWhats(mensagens, 40)}

PLAYBOOK DE OBJEÇÕES DA CASA
${playbookTexto(playbook)}

${suspeitas?.length ? `Gatilhos detectados automaticamente na última fala: ${suspeitas.map((s) => s.rotulo).join(', ')}` : ''}

Responda SÓ com um bloco \`\`\`json com estas chaves:
{
  "resumo": "2 a 3 frases sobre onde a conversa está e o que o lead realmente quis dizer",
  "intencao": "curiosidade | preço | agendar | recusa | dúvida técnica | atendimento | outro",
  "temperatura": "frio | morno | quente",
  "eh_bot": true/false,
  "eh_lead_comercial": true/false,
  "objecoes": [{"id": "id do playbook quando encaixar", "rotulo": "nome", "confianca": 0.0-1.0, "leitura": "o que está por trás"}],
  "sinais_compra": ["frases ou fatos que mostram interesse"],
  "sugestoes": [
    {"rotulo": "Curta", "texto": "mensagem pronta para enviar, no tom do Marcelo, com o nome dele se souber"},
    {"rotulo": "Consultiva", "texto": "versão que devolve a pergunta e instala o custo da inação"},
    {"rotulo": "Direta", "texto": "versão que pede o agendamento"}
  ],
  "evitar": ["o que NÃO dizer nesta conversa"],
  "proximo_estagio": "novo|qualificado|abordado|conversando|reuniao|proposta|negociacao|ganho|followup|perdido (ou null se não deve mudar)",
  "proxima_acao": "o próximo passo concreto, em uma linha"
}

Regras: mensagens curtas (2 a 4 linhas), uma pergunta só, sem preço fechado, sem promessa. Se o lead pediu preço, a resposta leva para a conversa ao vivo. Se for setor regulado, nada de promessa/superlativo.`;
}

/* ------------------------------ Mensagem personalizada ------------------------------ */
export function promptMensagem({ empresa, atividades, mensagens, playbook, pedido }) {
  return `Escreva a próxima mensagem de WhatsApp para este lead.

FICHA
${fichaResumida(empresa)}

HISTÓRICO
${linhaDoTempo(atividades)}

CONVERSA ATUAL
${transcricaoWhats(mensagens, 20)}

${pedido ? `PEDIDO DO MARCELO: ${pedido}` : ''}

PLAYBOOK
${playbookTexto(playbook)}

Devolva SÓ um bloco \`\`\`json:
{"variantes": [{"rotulo": "Curta", "texto": "..."}, {"rotulo": "Consultiva", "texto": "..."}, {"rotulo": "Áudio (roteiro)", "texto": "..."}], "porque": "uma linha explicando a escolha"}

Regras: personalizada com um detalhe REAL do negócio; 2 a 4 linhas; termina em pergunta; um CTA só; sem preço; sem promessa; sem superlativo. Se o estágio for "abordado" e ele ainda não respondeu, a variante deve ser follow-up leve (dia +3 / dia +7), nunca cobrança.`;
}

/* ------------------------------ Farejar clientes ------------------------------ */
export function promptFarejar({ nicho, cidade, quantidade, foco, observacao, listaId }) {
  return `Encontre até ${quantidade} negócios reais do nicho "${nicho}" em ${cidade} para a Hórus prospectar.

${foco?.length ? `Priorize: ${foco.join('; ')}.` : ''}
${observacao ? `Observação do Marcelo: ${observacao}` : ''}

COMO PESQUISAR
1. Use firecrawl_search e WebSearch com buscas como "${nicho} ${cidade}", "${nicho} ${cidade} instagram", "${nicho} ${cidade} whatsapp", buscas por bairro, e listagens locais (Google Maps, Doctoralia, GuiaMais, Apontador, catálogos do nicho).
2. Para cada negócio: confirme nome, bairro, telefone/WhatsApp, @ do Instagram (e seguidores se aparecer), se tem site (e se abre), nota e número de avaliações no Google.
   ⚠️ A nota e o número de avaliações do Google costumam aparecer no trecho do resultado de busca ("4,8 ★ · 127 avaliações"). Faça uma busca específica por "<nome do negócio> <cidade> avaliações Google" quando não vier de primeira: esse dado pesa no score.
3. Quando houver site, confira se está no ar (firecrawl_scrape ou WebFetch). Site que não abre = "fora_do_ar" — esse é o gancho mais forte.
4. NÃO INVENTE NADA. Campo que você não achou, deixe de fora. Nunca acrescente nem tire dígito de telefone.

COMO ENTREGAR
- Vá salvando em lotes de até 8 com a ferramenta mcp__hound-dog__hd_lista_adicionar_itens, usando lista_id "${listaId}". Não espere o fim.
- Em "observacao" de cada item, escreva em uma frase a oportunidade mais visível (ex.: "site não abre", "só Instagram, 4,9★ com 120 avaliações").
- No fim, responda SÓ com \`\`\`json {"total": n, "resumo": "o que você viu do nicho nessa cidade em 3 frases", "melhores": ["nomes dos 3 mais promissores e por quê"]}.`;
}

/* ------------------------------ Dossiê de empresa ------------------------------ */
export function promptDossie({ empresa, atividades }) {
  return `Monte o dossiê de pré-reunião desta empresa, no padrão da casa (Horus-Comercial/40-dossie-pre-reuniao.md).

FICHA ATUAL NO CRM
${fichaResumida(empresa)}

HISTÓRICO
${linhaDoTempo(atividades)}

O QUE PESQUISAR (use firecrawl/WebSearch/WebFetch)
1. Site: existe? abre? é recente? o que promete? tem WhatsApp/agendamento?
2. Instagram: @, seguidores, frequência, o que vende, link na bio.
3. Google: nota, nº de avaliações, o que os clientes elogiam e reclamam, ficha completa?
4. Anúncios: aparece na Biblioteca de Anúncios da Meta?
5. CNPJ (se houver): situação, abertura, porte.
6. 2 ou 3 concorrentes do mesmo bairro/cidade: o que eles têm que este não tem.

REGRAS
- Só fato verificável. O que não achar vira [FALTA: ...]. Nada de número inventado.
- Se for setor regulado, aponte as travas do conselho.

Responda SÓ com \`\`\`json:
{
 "resumo": "3 frases: quem é, onde dói, por onde entrar",
 "conteudo_md": "o dossiê completo em markdown, com as seções: 1. Quem é · 2. Situação digital hoje · 3. A dor · 4. Concorrentes · 5. A oportunidade (fase sugerida e faixa interna) · 6. Ganchos para abrir a conversa · 7. Compliance e riscos · 8. O que ainda falta descobrir",
 "atualizacoes": {"site_status": "...", "instagram": "...", "instagram_seguidores": 0, "google_nota": 0, "google_avaliacoes": 0, "gmb_status": "...", "roda_anuncio": true, "cnpj": "...", "decisor": "...", "gancho": "...", "dor": "...", "categoria": "..."},
 "fontes": [{"titulo": "...", "url": "..."}]
}
Em "atualizacoes" mande só o que você CONFIRMOU (omita o resto).`;
}

/* ------------------------------ Pesquisa de mercado ------------------------------ */
export function promptMercado({ tipo, nicho, cidade, perguntas }) {
  const base = `Pesquise o mercado de "${nicho}" em ${cidade} para a Hórus decidir se vale atacar esse nicho.`;
  const conc = `Pesquise a CONCORRÊNCIA DIGITAL do nicho "${nicho}" em ${cidade}: quem já faz site/marketing para esses negócios, o que entregam, quanto cobram quando dá para saber, e onde está a brecha para a Hórus.`;
  return `${tipo === 'concorrencia' ? conc : base}

${perguntas ? `Perguntas específicas do Marcelo: ${perguntas}` : ''}

MÉTODO
- Use firecrawl_search/WebSearch para mapear negócios do nicho na cidade (listas, Google Maps, Instagram, catálogos).
- Amostre de 15 a 30 negócios e MEÇA: quantos têm site, quantos com site fora do ar, quantos com Instagram ativo, faixa de avaliações no Google.
- Levante o ticket que o cliente final paga (para estimar a capacidade de investir), a sazonalidade e as datas que movimentam o nicho.
- Leia os cards da casa quando ajudar: _conhecimento/network/*.md e _memoria/comercial.md (você está dentro do repositório).
- Dê a nota de oportunidade 0-100 considerando: tamanho do nicho na cidade, fraqueza digital, capacidade de pagar, facilidade de acesso ao dono, ciclo de venda e fosso de compliance.

REGRAS: nada de número inventado — se estimou, diga que é estimativa e em cima de qual amostra. Cite fontes com URL.

Responda SÓ com \`\`\`json:
{
 "resumo": "3 frases com o veredito",
 "veredito": "uma frase: vale atacar? por quê?",
 "nota_oportunidade": 0-100,
 "negocios_mapeados": 0,
 "pct_sem_site": 0,
 "ticket_tipico": "faixa que o cliente final paga",
 "concorrencia": "baixa | média | alta (e por quê, em poucas palavras)",
 "fase_sugerida": "o que vender primeiro (ex.: Fase 1 site + GMB, R$ 1.500)",
 "dores": ["..."], "ganchos": ["..."], "objecoes": ["..."], "onde_achar": ["..."], "riscos": ["..."], "sazonalidade": ["..."],
 "exemplos": [{"nome": "...", "site": "...", "instagram": "...", "observacao": "..."}],
 "fontes": [{"titulo": "...", "url": "..."}],
 "conteudo_md": "relatório completo em markdown"
}`;
}

/* ------------------------------ Enriquecer lista ------------------------------ */
export function promptEnriquecer({ itens }) {
  return `Confirme e complete os dados destes leads (pesquisa rápida, um por um):

${JSON.stringify(itens, null, 1)}

Para cada um: confira se o site abre (fora do ar é o gancho mais forte), pegue o @ do Instagram e seguidores, nota e nº de avaliações no Google, e o WhatsApp quando aparecer publicamente. Não invente: o que não achar, omita. Nunca mude dígito de telefone.

Responda SÓ com \`\`\`json {"itens": [{"id": "id do item", "site": "...", "site_status": "sem|fora_do_ar|ruim|ok", "instagram": "...", "instagram_seguidores": 0, "google_nota": 0, "google_avaliacoes": 0, "gmb_status": "completo|incompleto|ausente", "whatsapp": "...", "roda_anuncio": true, "observacao": "a oportunidade em 1 frase"}]}`;
}

/* ------------------------------ Ideias de Instagram ------------------------------ */
export function promptInstagram({ snapshot, melhores }) {
  return `Sou a Hórus (@${snapshot.handle}), agência de marketing com IA em Salvador. Estes são os números do nosso perfil:

Seguidores: ${snapshot.seguidores} · publicações: ${snapshot.posts} · engajamento médio: ${snapshot.engajamento}%
Bio: ${snapshot.bio || '—'}

POSTS QUE MAIS ENGAJARAM
${melhores.map((p) => `- ${p.curtidas} curtidas, ${p.comentarios} comentários: "${(p.legenda || '').slice(0, 180)}"`).join('\n') || 'sem dados'}

Leia identidade/brandbook.md e _memoria/empresa.md para o tom e o posicionamento (você está no repositório da Hórus).

Proponha 8 ideias de conteúdo para as próximas 2 semanas, mirando dono de negócio local em Salvador (o cliente que a Hórus quer). Para cada uma: formato (carrossel/reel/story), gancho (a primeira linha), o que mostra, e por que funciona para atrair cliente. Prefira prova e bastidor de trabalho real da casa a "dica genérica de marketing".

Responda em markdown, direto, sem introdução.`;
}
