// =============================================================================
// Revisor mecânico das mensagens de prospecção (29/09/2026).
// Compartilhado entre o painel (Disparos, ao vivo enquanto o Marcelo edita) e o
// Node (Farejador e MCP, na hora em que o rascunho nasce). Mexeu aqui, vale nos dois.
//
// Separa o que é regra fixa (código decide) do que é julgamento (Claude e o
// Marcelo decidem). Ideia tirada do 30x-outreach; as regras são as da casa:
// _conhecimento/network/abordagem-e-prospeccao.md §8 a §12 e
// _memoria/prospeccao/90-cara-de-ia.md. Veto = não deveria sair assim.
// Aviso = olhar de novo; pode estar certo no caso.
// =============================================================================

const sem = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const palavras = (s) => (String(s || '').match(/[\p{L}\p{N}]+/gu) || []);

// Saudação não conta como pergunta: "Oi, tudo bem? Falo com a Dra.?" tem uma pergunta de verdade
const SAUDACAO = /\b(tudo bem|tudo certo|tudo bom|como vai|beleza)\s*\?|,\s*(tá|ta|né|ne|ok)\s*\?/gi; // "..., tá?" é muleta de fala, não pergunta

const REGRAS = [
  // --- vetos ---
  { id: 'travessao', nivel: 'veto', re: /[—–]| - /, dica: 'Travessão ou hífen solto como pausa. Troque por ponto ou vírgula.' },
  { id: 'emoji', nivel: 'veto', re: /\p{Extended_Pictographic}/u, dica: 'Emoji no contato frio. Tire.' },
  { id: 'parentese', nivel: 'veto', re: /[()]/, dica: 'Parêntese. Vira frase própria ou sai.' },
  { id: 'placeholder', nivel: 'veto', re: /\[[^\]]*\]|\{\{|FALTA/, dica: 'Sobrou marcador ([...], {{...}} ou FALTA). Preencha com o dado real ou tire a frase.' },
  { id: 'preco', nivel: 'veto', re: /r\$\s?\d|\b\d+\s?(reais|mil)\b|\b(preco|precos|orcamento a partir|desconto|promocao|parcel|investimento de)\b/, sem: true, dica: 'Preço por mensagem. Preço só ao vivo, na reunião.' },
  { id: 'promessa', nivel: 'veto', re: /\b(garant\w*|mais clientes|vender mais|dobrar|triplicar|aumentar (as |suas )?vendas|colocar (voces |vcs )?no topo|primeiro lugar|primeira pagina|resultado certo|lotar a agenda|agenda cheia)\b/, sem: true, dica: 'Promessa de resultado. Diga o mecanismo (o que a coisa faz), nunca o resultado.' },

  // --- avisos ---
  { id: 'posicao-busca', nivel: 'aviso', re: /\b(nao aparece\w*|aparece\w* (la )?(pra|para) baixo|empurra\w* (voces|vcs))\b.{0,40}\b(google|busca|pesquis\w*)\b|\b(google|busca|pesquis\w*)\b.{0,40}\b(nao aparece\w*|aparece\w* (la )?(pra|para) baixo|empurra\w* (voces|vcs))\b|\b(primeiro resultado|some\w* no google|escondid\w* no google)\b/, sem: true, dica: 'Posição na busca só com a busca feita pelo Marcelo no dia, com print (Regra 3).' },
  { id: 'previa-inexistente', nivel: 'aviso', re: /\b(montei|fiz|criei|preparei|deixei pronta?)\b.{0,25}\b(previa|modelo|site|pagina|versao)\b/, sem: true, dica: '"Montei uma prévia" só se ela já estiver no ar.' },
  { id: 'generalizacao', nivel: 'aviso', re: /\b(geralmente|normalmente|costuma\w*|muita gente|a maioria|todo mundo|sempre acontece)\b/, sem: true, dica: 'Generalização. Se for sobre a operação DO LEAD ("vocês perdem cliente"), vira "pra evitar que..." (Regra 4). Se for sobre como o cliente do mercado se comporta ("quem pede orçamento costuma pedir em vários espaços"), pode ficar.' },
  { id: 'imagino', nivel: 'aviso', re: /\b(imagino|acredito que|provavelmente|talvez voces)\b/, sem: true, dica: 'Suposição. O jeito do Marcelo resolve com "pra evitar que [problema]".' },
  { id: 'dois-pontos', nivel: 'aviso', re: /[^\d\s]:\s/, dica: 'Dois-pontos de efeito ("é assim:", "eu faço isso:"). Frase direta.' },
  { id: 'nao-x-e-y', nivel: 'aviso', re: /\bnao (e|eh|so|apenas|somente) [^.?!]{1,40}(, e |\. e |mas (sim|tambem))|\bnao so\b[^.?!]{1,60}\bmas\b/, sem: true, dica: '"Não é X, é Y" ou "não só X, mas Y". Diga o Y direto.' },
  { id: 'jargao', nivel: 'aviso', re: /\b(call|funil|autoridade|engajamento|alavanc\w*|potencializ\w*|otimiz\w*|estrategi\w*|solucao|solucoes|transform\w*|presenca digital|impulsion\w*|diferencial|fazer a diferenca|jornada|conversao|leads?|trafego|performance|branding|posicionamento)\b/, sem: true, dica: 'Jargão de agência. Dono de negócio local não fala assim: troque pela palavra comum.' },
  { id: 'enfeite', nivel: 'aviso', re: /\b(incrive(l|is)|sensaciona(l|is)|belissim\w*|maravilhos\w*|impecave(l|is)|fantastic\w*|excelente trabalho|trabalho lindo|parabens pelo)\b/, sem: true, dica: 'Elogio enfeitado. Elogio que vale é um fato específico que você viu.' },
  { id: 'vigia', nivel: 'aviso', re: /\b(no (seu |teu )?(reel|reels|story|stories|destaque|post)|nos (seus )?(stories|destaques|posts))\b/, sem: true, dica: 'Citar o formato ("vi no reel") soa como quem vigiou o perfil. "Vi você falando de X" basta.' },
  // "A gente monta X pra clínicas aqui de Salvador" sugere clientes que a casa não tem (Bioclin, 29/09)
  { id: 'prova-social-vaga', nivel: 'aviso', re: /\b(pra|para) (clinicas|consultorios|espacos|oficinas|restaurantes|lojas|negocios|empresas|estudios|saloes)( de [\p{L}]+)? (aqui|daqui|em [\p{L}]+|de [\p{L}]+|da regiao|da bahia)\b|\b(varios|muitos|diversos) clientes\b|\bja atendemos\b|\bnossos clientes\b/u, sem: true, dica: 'Sugere clientes que a casa não tem ("pra clínicas aqui de Salvador", "nossos clientes"). Prova social só se for verdade: diga o que você faz ("eu monto atendimento no WhatsApp").' },
  { id: 'agencia', nivel: 'aviso', re: /\b(nossa agencia|minha agencia|somos uma agencia|nos da horus|a horus e|a gente e uma)\b/, sem: true, dica: 'Falando de nós. A mensagem é sobre o negócio dele.' },
  { id: 'frase-feita', nivel: 'aviso', re: /\b(achei melhor avisar|voces sabiam|voce sabia|nao quero te vender|super acessivel|em sinal de respeito|sem compromisso nenhum|fica a dica|no mundo de hoje|cada vez mais)\b/, sem: true, dica: 'Frase feita que a casa já vetou (cold-message-processo, §10).' },
];

/** Divide em frases (ponto, interrogação, exclamação). */
function frases(texto) {
  return String(texto || '').split(/(?<=[.?!])\s+/).map((f) => f.trim()).filter(Boolean);
}

/**
 * Revisa uma mensagem. `ctx`: { passo, empresa (nome), lote: [textos de OUTROS leads] }.
 * Devolve { itens: [{regra, nivel, trecho, dica}], vetos, avisos, palavras }.
 */
export function revisar(texto, ctx = {}) {
  const t = String(texto || '').trim();
  const itens = [];
  const add = (regra, nivel, trecho, dica) => itens.push({ regra, nivel, trecho: trecho ? String(trecho).slice(0, 80) : '', dica });
  const tSem = sem(t);

  for (const r of REGRAS) {
    const alvo = r.sem ? tSem : t;
    const m = alvo.match(r.re);
    if (m) add(r.id, r.nivel, r.sem ? t.substr(Math.max(0, m.index), m[0].length + 20) : m[0], r.dica);
  }

  // Tamanho: passo 1 é abertura curta; o corpo cabe em ~60 palavras (§ "CURTA" do prompt de investigação)
  const n = palavras(t).length;
  const passo = Number(ctx.passo || 1);
  // Passo 1: a variação simples aprovada pelo Marcelo (29/09) tem ~45 palavras
  const [avisoPal, vetoPal] = passo === 1 ? [50, 70] : [60, 90];
  if (n > vetoPal) add('longa', 'veto', `${n} palavras`, `Longa demais pro WhatsApp frio (limite ${vetoPal}). Corte até uma ideia por frase.`);
  else if (n > avisoPal) add('longa', 'aviso', `${n} palavras`, `Passou de ${avisoPal} palavras. Veja o que dá pra cortar.`);

  for (const f of frases(t)) {
    const np = palavras(f).length;
    // A frase-modelo do Marcelo (29/09, "Pra evitar que... eu posso montar...") tem 30 palavras
    if (np > 32) add('frase-longa', 'aviso', f, `Frase com ${np} palavras. Quebre em duas.`);
  }

  // Uma pergunta só (a saudação não conta) e o corpo termina em pergunta
  const semSaud = t.replace(SAUDACAO, '');
  const perguntas = (semSaud.match(/\?/g) || []).length;
  if (perguntas > 1) add('perguntas', 'aviso', `${perguntas} perguntas`, 'Mais de uma pergunta. Uma só por mensagem.');
  // O follow-up padrão da casa fecha com a saída fácil, sem pergunta, de propósito (20-escrita.md §10)
  if (passo >= 2 && ctx.tipo !== 'followup' && !/\?\s*$/.test(t)) add('sem-pergunta', 'aviso', t.slice(-40), 'O corpo termina sem pergunta. Feche pedindo licença ("quer que eu te mostre?").');

  // Lista de três: "X, Y e Z" com itens curtos e paralelos. Item que começa com preposição,
  // artigo ou advérbio ("ligado ao Google e ao WhatsApp", "e depois somem") é continuação, não lista.
  const LIGA = /^(ao|aos|a|as|à|às|o|os|no|na|nos|nas|com|pra|pro|para|de|do|da|dos|das|em|depois|nao|não|ja|já|so|só|mas|ligad\w*)\b/i;
  const reTres = /(?:^|[\s,])([\p{L}]+(?: [\p{L}]+){0,2}), ([\p{L}]+(?: [\p{L}]+){0,2}),? e ([\p{L}]+(?: [\p{L}]+){0,2})/gu;
  for (const m of t.matchAll(reTres)) {
    if (LIGA.test(m[2]) || LIGA.test(m[3])) continue;
    add('lista-de-tres', 'aviso', m[0].trim(), 'Lista de três é tique de IA. Fica com a coisa mais forte, ou duas (se for fato que o dono confere, como a lista dos botões quebrados, pode ficar).');
    break;
  }

  // Nome do lead repetido soa mala direta
  if (ctx.empresa) {
    const nome = sem(String(ctx.empresa).split(/[-–—|·]/)[0]).trim();
    const chave = nome.split(/\s+/).filter((p) => p.length > 3 && !['clinica', 'espaco', 'studio', 'estudio', 'oficina', 'odontologia', 'estetica', 'casa', 'centro', 'auto', 'loja', 'salao', 'eventos'].includes(p))[0];
    if (chave) {
      const vezes = (tSem.match(new RegExp(`\\b${chave}\\b`, 'g')) || []).length;
      if (vezes > 1) add('nome-repetido', 'aviso', `${chave} ×${vezes}`, 'Nome do negócio repetido. Uma vez basta.');
    }
  }

  // Começar com "Eu" é falar de si antes de falar dele
  if (/^eu\b/i.test(t)) add('abre-com-eu', 'aviso', t.slice(0, 30), 'Abre falando de você. Comece pelo que você viu no negócio dele.');

  // Repetição no lote: mesmo começo, mesmo fim ou mesmo esqueleto de outro lead
  // O follow-up padrão é o mesmo pra todo lead de propósito: não entra na checagem de esqueleto repetido (30/09)
  if (ctx.tipo !== 'followup') for (const r of compararComLote(t, ctx.lote || [])) add(r.regra, 'aviso', r.trecho, r.dica);

  return { itens, vetos: itens.filter((i) => i.nivel === 'veto').length, avisos: itens.filter((i) => i.nivel === 'aviso').length, palavras: n };
}

/* ------------------------------ Repetição no lote ------------------------------ */
// Cada investigação é um Claude novo e não sabe o que os outros escreveram; sem
// esta checagem, dez leads saem com o mesmo esqueleto e o dono de um negócio
// que conversa com o vizinho percebe (achado do signal-prospecting-kit, 29/09).

// Troca números e nomes próprios por marcador, pra comparar o esqueleto e não o recheio
function esqueleto(s) {
  return sem(String(s || '').replace(/\d+([.,]\d+)?/g, ' 9 ').replace(/(?<=\s)[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\p{L}]+/gu, ' X '))
    .replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}
function trigramas(ws) { const s = new Set(); for (let i = 0; i + 2 < ws.length; i++) s.add(ws.slice(i, i + 3).join(' ')); return s; }
function jaccard(a, b) { if (!a.size || !b.size) return 0; let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); }

export function compararComLote(texto, lote) {
  const out = [];
  // Abertura curta de passo 1 é igual de propósito ("Oi, tudo bem? Falo com você ou com a recepção?")
  const ws = esqueleto(texto); if (ws.length < 20) return out;
  const tri = trigramas(ws);
  const ini = ws.slice(0, 5).join(' ');
  let maior = 0; let par = '';
  let mesmoIni = 0;
  for (const outro of lote) {
    const wo = esqueleto(outro); if (wo.length < 20) continue;
    const j = jaccard(tri, trigramas(wo)); if (j > maior) { maior = j; par = outro; }
    if (wo.slice(0, 5).join(' ') === ini) mesmoIni++;
  }
  if (maior >= 0.35) out.push({ regra: 'esqueleto-repetido', trecho: String(par).slice(0, 80), dica: `Mesmo esqueleto de mensagem de outro lead (${Math.round(maior * 100)}% igual). Troque o nome e continua valendo: a tese está rasa.` });
  if (mesmoIni >= 2) out.push({ regra: 'abertura-repetida', trecho: ws.slice(0, 5).join(' '), dica: `A mesma abertura já está em ${mesmoIni} mensagens do lote. Varie.` });
  // Fecho repetido não é defeito: o Marcelo prefere "quer que eu te explique?" em todas (teste cego de 29/09).
  // O que não pode se repetir é o corpo, e isso o esqueleto e a abertura já pegam.
  return out;
}

/**
 * Quão parecidos são dois textos (0 a 1), por trincas de palavras. Serve pra reconhecer que a mensagem
 * que o Marcelo mandou pelo celular é uma das preparadas no Disparos, mesmo com palavra trocada.
 */
export function similaridade(a, b) {
  const ws = (s) => sem(s).replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  return jaccard(trigramas(ws(a)), trigramas(ws(b)));
}

/* ------------------------------ Resposta automática ------------------------------ */
// "Respondeu" não vale quando quem respondeu foi o robô do WhatsApp Business (29/09: LevSaúde e
// Land Car mandaram saudação automática segundos depois do passo 1). Usado na trava do passo 2
// (painel e Farejador) e no scripts/aprender.mjs. A mesma lista, em sintaxe de regex do Postgres,
// sai de AUTO_RESPOSTA_SQL.
const AUTO = ['agradece(mos)? (o |a )?(seu |sua )?(contato|mensagem)', 'nao estamos disponiveis', 'no momento nao (estamos|podemos)',
  'seja (muito )?bem[- ]?vind', 'retornaremos', 'responderemos (assim que|em breve)', 'em breve (retornamos|responderemos|entraremos)',
  'horario de atendimento', 'funcionamos de', 'mensagem automatica', 'como posso te chamar', 'fora do horario'];
export const AUTO_RESPOSTA_SQL = AUTO.join('|');
const AUTO_RE = new RegExp(AUTO.join('|'));
export function pareceAutoResposta(texto) { return AUTO_RE.test(sem(texto)); }

/** Texto curto pro prompt do Claude: as regras que o código vai cobrar. */
export function regrasParaPrompt() {
  return REGRAS.map((r) => `- [${r.nivel}] ${r.dica}`).join('\n')
    + '\n- [veto] Passo 1 com mais de 70 palavras, corpo com mais de 90. [aviso] passo 1 acima de 50, corpo acima de 60, frase acima de 32 palavras.'
    + '\n- [aviso] Mais de uma pergunta (a saudação "tudo bem?" não conta). Corpo que não termina em pergunta. Lista de três ("X, Y e Z"). Nome do negócio repetido. Abrir com "Eu".'
    + '\n- [aviso] Mesmo esqueleto ou mesma abertura das mensagens de OUTROS leads que vão junto no lote. O fecho "quer que eu te explique?" pode repetir.';
}
