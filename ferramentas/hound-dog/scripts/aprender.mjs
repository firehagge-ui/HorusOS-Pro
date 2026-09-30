// Relatório de aprendizado da prospecção (29/09/2026).
// Junta o que o Marcelo ensinou sem dizer: o que ele mudou nos textos do Claude (texto_original x texto,
// migração 010), qual abordagem ele escolheu quando havia A/B/C, e quem respondeu a quê.
// A saída é markdown pra ler e destilar em _memoria/prospeccao/aprendizados.md. Não escreve no banco.
// Uso: node scripts/aprender.mjs [dias=30]
import { q, fecharDb } from '../lib/db.mjs';
import { revisar, AUTO_RESPOSTA_SQL } from '../app/js/revisor.js';

const dias = Number(process.argv[2] || 30);
const linha = (s) => String(s || '').replace(/\s+/g, ' ').trim();

const todos = await q(`select d.*, e.nome empresa, e.categoria, e.estagio from disparos d join empresas e on e.id = d.empresa_id
  where d.criado_em > now() - ($1 || ' days')::interval order by e.nome, d.passo, d.variante`, [dias]);

// Resposta: marcada à mão ou mensagem do lead depois do envio, sem contar resposta automática do WhatsApp Business
const respostas = new Map();
for (const r of await q(`select d.id, (select min(m.momento) from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
  where c.empresa_id = d.empresa_id and m.direcao = 'in' and m.momento > d.enviado_em and translate(lower(coalesce(m.texto, '')), 'áàâãéêíóôõúç', 'aaaaeeiooouc') !~ $2) primeira,
  (select string_agg(m.texto, ' / ' order by m.momento) from (select m.texto, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
    where c.empresa_id = d.empresa_id and m.direcao = 'in' and m.momento > d.enviado_em and translate(lower(coalesce(m.texto, '')), 'áàâãéêíóôõúç', 'aaaaeeiooouc') !~ $2 order by m.momento limit 3) m) textos
  from disparos d where d.status = 'enviado' and d.enviado_em > now() - ($1 || ' days')::interval`, [dias, AUTO_RESPOSTA_SQL])) respostas.set(r.id, r);

console.log(`# Aprendizado da prospecção · últimos ${dias} dias · ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })}\n`);

// 1. Edições do Marcelo
const editados = todos.filter((d) => d.texto_original && linha(d.texto_original) !== linha(d.texto));
console.log(`## 1. O que o Marcelo mudou nos textos do Claude (${editados.length})\n`);
for (const d of editados) {
  const antes = revisar(d.texto_original, { passo: d.passo, empresa: d.empresa });
  const depois = revisar(d.texto, { passo: d.passo, empresa: d.empresa });
  console.log(`**${d.empresa}** · passo ${d.passo}${d.variante} (${d.angulo || 'sem ângulo'}) · ${antes.palavras} → ${depois.palavras} palavras`);
  console.log(`- Claude: ${linha(d.texto_original)}`);
  console.log(`- Marcelo: ${linha(d.texto)}`);
  const sumiram = antes.itens.filter((i) => !depois.itens.some((j) => j.regra === i.regra)).map((i) => i.regra);
  if (sumiram.length) console.log(`- O revisor acusava e a edição resolveu: ${sumiram.join(', ')}`);
  console.log('');
}
if (!editados.length) console.log('Nenhuma edição guardada ainda (o banco só guarda o original desde 29/09).\n');

// 2. Escolhas entre abordagens
const escolhas = todos.filter((d) => ['aprovado', 'agendado', 'enviado'].includes(d.status) && todos.some((o) => o.empresa_id === d.empresa_id && o.passo === d.passo && o.id !== d.id && /^Descartada: você aprovou/.test(o.erro || '')));
console.log(`## 2. Qual abordagem o Marcelo escolheu (${escolhas.length})\n`);
for (const d of escolhas) {
  const outras = todos.filter((o) => o.empresa_id === d.empresa_id && o.passo === d.passo && o.id !== d.id && /^Descartada/.test(o.erro || ''));
  console.log(`- **${d.empresa}** passo ${d.passo}: escolheu **${d.variante} · ${d.angulo || '?'}**, deixou ${outras.map((o) => `${o.variante} · ${o.angulo || '?'}`).join(' e ')}`);
}
if (!escolhas.length) console.log('Nenhuma escolha registrada ainda.');
console.log('');

// 3. Envios e respostas, por ângulo e por formato
const enviados = todos.filter((d) => d.status === 'enviado');
console.log(`## 3. Envios e respostas (${enviados.length} enviados)\n`);
const grupos = {};
for (const d of enviados) {
  const r = respostas.get(d.id); const resp = d.respondeu || !!r?.primeira;
  const k = `passo ${d.passo} · ${d.formato} · ${d.angulo || 'sem ângulo'}`;
  grupos[k] = grupos[k] || { n: 0, resp: 0 }; grupos[k].n++; if (resp) grupos[k].resp++;
  const hora = new Date(d.enviado_em).toLocaleString('pt-BR', { timeZone: 'America/Bahia', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  console.log(`- **${d.empresa}** (${d.categoria || '?'}) · ${hora} · ${resp ? `respondeu: "${linha(r?.textos).slice(0, 160)}"` : 'sem resposta'}`);
  console.log(`  > ${linha(d.texto)}`);
}
console.log('\n| Grupo | Enviados | Responderam |\n|---|---|---|');
for (const [k, v] of Object.entries(grupos)) console.log(`| ${k} | ${v.n} | ${v.resp} |`);
console.log(`\n⚠️ Com menos de 20 envios por grupo, isto é leitura de caso, não estatística. Não travar vencedor antes disso.`);

// 4. Avisos do revisor que mais aparecem nos rascunhos (onde o Claude mais erra)
const cont = {};
for (const d of todos.filter((x) => Array.isArray(x.revisao))) for (const i of d.revisao) cont[i.regra] = (cont[i.regra] || 0) + 1;
const top = Object.entries(cont).sort((a, b) => b[1] - a[1]);
console.log(`\n## 4. O que o revisor mais acusou nos rascunhos\n`);
console.log(top.length ? top.map(([r, n]) => `- ${r}: ${n}`).join('\n') : 'Sem rascunhos revisados ainda (a coluna revisao existe desde 29/09).');

await fecharDb();
