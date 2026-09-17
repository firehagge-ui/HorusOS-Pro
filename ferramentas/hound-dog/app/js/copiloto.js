/* =============================================================================
   HOUND DOG — copiloto instantâneo (sem esperar o Claude)
   Detecta objeção pelos gatilhos do playbook e sugere a próxima mensagem pelo
   estágio, com os templates do Horus-Comercial. O Claude refina por cima.
   ============================================================================= */
import { estado } from './sb.js';
import { semAcento } from './score.js';

const norm = (s) => semAcento(String(s || '')).toLowerCase();

/** Objeções presentes num texto (ordenadas pela força do gatilho). */
export function detectarObjecoes(texto) {
  const t = norm(texto);
  if (!t.trim()) return [];
  const achadas = [];
  for (const o of estado.playbook) {
    const hits = (o.gatilhos || []).filter((g) => t.includes(norm(g)));
    if (hits.length) achadas.push({ ...o, hits, forca: hits.reduce((a, h) => a + h.length, 0) });
  }
  return achadas.sort((a, b) => b.forca - a.forca);
}

/** Heurística de resposta automática (o selo "Bot" das referências). */
export function pareceBot(texto) {
  const t = norm(texto);
  return /seja bem[- ]vind|mensagem automatica|resposta automatica|nosso horario de atendimento|em breve retornaremos|digite (1|um|a opcao)|escolha uma das opcoes|agradecemos (o|seu) contato.*(breve|retorn)|assistente virtual|atendimento automatico/.test(t);
}

/** Leitura rápida de temperatura pela última fala do lead. */
export function temperaturaRapida(texto) {
  const t = norm(texto);
  if (/quanto (custa|fica)|como funciona|pode (sim|ser)|bora|vamos (fazer|marcar)|quero|topo|fechado|me (manda|mostra)|qual horario|amanha|hoje|interess/.test(t)) return 'quente';
  if (/nao tenho interesse|nao quero|nao preciso|pare|remove|sai da lista|nao me mande/.test(t)) return 'frio';
  return 'morno';
}

function primeiroNome(e) {
  const d = String(e?.decisor || '').replace(/\(.*?\)|\[.*?\]/g, '').trim();
  if (d && !/falta/i.test(d)) return d.split(/\s+/)[0];
  return '';
}

/** Próxima mensagem sugerida pelo estágio (doutrina: não insistir antes da resposta). */
export function proximaMensagem(emp, ultimaFala = '') {
  const nome = primeiroNome(emp);
  const oi = nome ? `Oi, ${nome}!` : 'Oi, tudo bem?';
  const cat = (emp?.categoria || 'o seu serviço').toLowerCase();
  const cidade = String(emp?.cidade || 'sua cidade').split('/')[0];
  const reg = emp?.regulado;
  const aviso = reg ? `\n\n⚠️ Setor regulado (${emp.conselho || 'conselho'}): sem promessa de resultado, sem antes/depois, sem depoimento.` : '';

  const obj = ultimaFala ? detectarObjecoes(ultimaFala)[0] : null;
  if (obj) {
    return { liberado: true, modelo: `Quebra de objeção: ${obj.rotulo}`, status: obj.leitura, texto: obj.resposta + aviso, objecao: obj };
  }

  switch (emp?.estagio) {
    case 'novo':
    case 'qualificado': {
      let txt;
      if (emp.site_status === 'fora_do_ar') txt = `${oi} Aqui é da Hórus.\nFui procurar ${emp.nome} e o site de vocês está fora do ar${emp.site ? ` (${emp.site.replace(/^https?:\/\//, '')} não abre)` : ''}. Isso costuma derrubar quem procura vocês pelo Google. Faz sentido eu te mostrar rapidinho o que dá pra fazer?`;
      else if (emp.site_status === 'sem') txt = `${oi} Aqui é da Hórus.\nVi ${emp.nome}${emp.instagram ? ' no Instagram' : ''} e reparei que vocês ainda não têm um site próprio. Já pensaram em ter um, pra aparecer no Google quando alguém procura por ${cat} em ${cidade}?`;
      else txt = `${oi} Aqui é da Hórus.\nAcompanhei ${emp.nome} e fiquei pensando: quando alguém procura por ${cat} em ${cidade} no Google, o que aparece de vocês? É essa parte que a gente resolve. Posso te explicar em 5 minutos?`;
      return { liberado: true, modelo: 'Primeira abordagem (personalizada, termina em pergunta)', status: 'Estude o negócio antes (15 a 20 min). Um detalhe real, uma pergunta, um CTA só.', texto: txt + aviso };
    }
    case 'abordado':
      return { liberado: false, modelo: 'Aguardando resposta', status: 'Abordado. Não mande de novo antes de ele responder: insistência queima o lead e o número. Cadência de follow-up: dia +3 e dia +7, depois para.', texto: `${oi} Passando pra ver se você chegou a ver minha mensagem. Sem pressa, só não queria que se perdesse aqui no meio da correria. 🙂` };
    case 'conversando':
      return { liberado: true, modelo: 'Agendar, não vender', status: 'Porta aberta. O objetivo agora é marcar a conversa (projeto acima de R$ 2.000 não fecha por WhatsApp).', texto: `Que bom${nome ? `, ${nome}` : ''}! O melhor é a gente conversar 20 minutinhos: eu te mostro o que dá pra fazer no caso de ${emp.nome} especificamente. Prefere amanhã de manhã ou à tarde? Pode ser presencial ou por chamada.${aviso}` };
    case 'reuniao':
      return { liberado: true, modelo: 'Confirmação da reunião', status: 'Leve o dossiê e a prévia. Qualifique o decisor ANTES: quem mais decide deve estar presente.', texto: `${oi} Confirmando nossa conversa. Uma pergunta rápida pra eu já chegar preparado: além de você, tem mais alguém que participa dessa decisão e deveria estar com a gente?` };
    case 'proposta':
      return { liberado: true, modelo: 'Pós-apresentação', status: 'Valor se fala olhando pro cliente. Se esfriou depois da reunião, ligue: texto não destrava.', texto: `${oi} Ficou alguma dúvida sobre o que te mostrei? Se ajudar, te ligo 5 minutinhos pra alinharmos o início.` };
    case 'negociacao':
      return { liberado: true, modelo: 'Destravar a entrada (sem pressão)', status: 'Sim verbal sem entrada não é dinheiro. Ligar > mandar mensagem. Se a trava for caixa: cartão parcelado, nunca desconto.', texto: `${oi} Tudo certo por aí? Quando você quiser começar, é só me avisar que já reservo a produção. Se ficar melhor pra vocês, dá pra fazer a entrada no cartão parcelado.` };
    case 'ganho':
      return { liberado: true, modelo: 'Pós-venda e indicação', status: 'Cliente. Foco em entregar bem, colher validação e abrir a próxima fase.', texto: `${oi} Passando pra saber como está sendo por aí 🙌 Se conhecer alguém que precise de algo parecido, sua indicação vale muito pra gente.` };
    case 'followup':
      return { liberado: true, modelo: 'Reativação com gancho novo', status: 'Frio. Só reative com um motivo novo e verdadeiro, sem cobrar resposta.', texto: `${oi} Lembrei de vocês porque [gancho novo e verdadeiro: um trabalho parecido, uma data comercial, algo que mudou no Google]. Faz sentido retomarmos aquela ideia?` };
    case 'perdido':
      return { liberado: false, modelo: 'Porta aberta', status: 'Perdido ou não-fit. Respeitar. Só volta se ele procurar ou se surgir gancho realmente novo.', texto: `Tudo certo${nome ? `, ${nome}` : ''}! Fico à disposição se algo mudar.` };
    default:
      return { liberado: false, modelo: '', status: '', texto: '' };
  }
}

/** Probabilidade de referência por estágio (pipeline ponderado; não é promessa). */
export const PROB_ESTAGIO = { novo: 2, qualificado: 5, abordado: 10, conversando: 20, reuniao: 35, proposta: 50, negociacao: 75, ganho: 100, followup: 5, perdido: 0 };
