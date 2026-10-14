// Placar das abordagens de prospecção (08/10/2026).
// Cada lead do teste leva a etiqueta "abordagem:<id>" (ver _memoria/prospeccao/40-testes.md).
// Mostra, por abordagem: contatos feitos, respostas de gente, reuniões marcadas e clientes.
// Só lê o banco. Uso: node scripts/placar.mjs
import { q, fecharDb } from '../lib/db.mjs';
import { AUTO_RESPOSTA_SQL } from '../app/js/revisor.js';

const AVANCOU = {
  resposta: ['conversando', 'reuniao', 'proposta', 'negociacao', 'ganho'],
  reuniao: ['reuniao', 'proposta', 'negociacao', 'ganho'],
};
const NOME_ESTAGIO = { conversando: 'Conversando', reuniao: 'Reunião marcada', proposta: 'Proposta', negociacao: 'Negociação', ganho: 'Ganho' };
const titulos = (lista) => lista.map((e) => `Movido para ${NOME_ESTAGIO[e]}`);
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '–');
const linha = (s) => String(s || '').replace(/\s+/g, ' ').trim();

const leads = await q(`
  select e.id, e.nome, e.estagio, a.abordagem,
    exists (select 1 from disparos d where d.empresa_id = e.id and d.status = 'enviado')
      or exists (select 1 from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id where c.empresa_id = e.id and m.direcao = 'out')
      or exists (select 1 from atividades t where t.empresa_id = e.id and t.tipo in ('mensagem','whatsapp','ligacao','visita'))
      or e.estagio not in ('novo','qualificado') as contato,
    (select string_agg(m.texto, ' / ' order by m.momento) from (
       select coalesce(m.texto, '[não abriu: veja no celular]') texto, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
       where c.empresa_id = e.id and m.direcao = 'in' and (m.texto is not null or m.tipo = 'indecifrada')
         and translate(lower(coalesce(m.texto, '')), 'áàâãéêíóôõúç', 'aaaaeeiooouc') !~ $1
         and m.momento > (select min(o.momento) from whatsapp_mensagens o where o.conversa_id = c.id and o.direcao = 'out')
       order by m.momento limit 2) m) as resposta_texto,
    e.estagio = any($2) or exists (select 1 from atividades t where t.empresa_id = e.id and t.titulo = any($3)) as respondeu_estagio,
    e.estagio = any($4) or exists (select 1 from atividades t where t.empresa_id = e.id and t.titulo = any($5))
      or exists (select 1 from agenda g where g.empresa_id = e.id and g.tipo in ('r1','r2') and g.status <> 'cancelado') as reuniao,
    exists (select 1 from agenda g where g.empresa_id = e.id and g.tipo in ('r1','r2') and g.status = 'feito') as reuniao_feita,
    e.estagio = 'ganho' or exists (select 1 from atividades t where t.empresa_id = e.id and t.titulo = 'Movido para Ganho') as cliente
  from empresas e
  cross join lateral (select substring(t from 11) abordagem from unnest(e.tags) t where t like 'abordagem:%') a
  order by a.abordagem, e.nome`,
  [AUTO_RESPOSTA_SQL, AVANCOU.resposta, titulos(AVANCOU.resposta), AVANCOU.reuniao, titulos(AVANCOU.reuniao)]);

const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
console.log(`# Placar das abordagens · ${hoje}\n`);
if (!leads.length) { console.log('Nenhum lead com etiqueta "abordagem:<id>" ainda.'); await fecharDb(); process.exit(0); }

const grupos = {};
for (const l of leads) {
  const g = (grupos[l.abordagem] ||= { leads: 0, contatos: 0, respostas: 0, reunioes: 0, feitas: 0, clientes: 0, itens: [] });
  const respondeu = !!l.resposta_texto || l.respondeu_estagio;
  g.leads++; if (l.contato) g.contatos++; if (respondeu) g.respostas++; if (l.reuniao) g.reunioes++;
  if (l.reuniao_feita) g.feitas++; if (l.cliente) g.clientes++;
  const marca = l.cliente ? 'cliente' : l.reuniao ? 'reunião' : respondeu ? 'respondeu' : l.contato ? 'sem resposta' : 'ainda não contatado';
  g.itens.push(`- **${l.nome}** (${l.estagio}) · ${marca}${l.resposta_texto ? ` · "${linha(l.resposta_texto).slice(0, 120)}"` : ''}`);
}

console.log('| Abordagem | Leads | Contatos | Respostas | Reuniões marcadas | Reuniões feitas | Clientes |');
console.log('|---|---|---|---|---|---|---|');
for (const [nome, g] of Object.entries(grupos)) {
  console.log(`| ${nome} | ${g.leads} | ${g.contatos} | ${g.respostas} (${pct(g.respostas, g.contatos)}) | ${g.reunioes} (${pct(g.reunioes, g.contatos)}) | ${g.feitas} | ${g.clientes} (${pct(g.clientes, g.contatos)}) |`);
}
console.log('\nPorcentagens sobre os contatos feitos. Abaixo de 10 contatos por abordagem é leitura de caso, não veredito.\n');
for (const [nome, g] of Object.entries(grupos)) console.log(`## ${nome}\n${g.itens.join('\n')}\n`);
await fecharDb();
