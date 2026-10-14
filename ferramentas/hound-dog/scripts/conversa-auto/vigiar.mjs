// Fica olhando a conversa de uma ficha e termina quando o lead manda mensagem nova
// (ignora resposta automática do WhatsApp Business). Uso: node vigiar.mjs <empresa_id> [horas=10]
import { q, fecharDb } from '../../lib/db.mjs';
import { pareceAutoResposta } from '../../app/js/revisor.js';
const [empresaId, horas = '10'] = process.argv.slice(2);
const desde = (await q(`select coalesce(max(m.momento), now()) t from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id where c.empresa_id = $1`, [empresaId]))[0].t;
const fim = Date.now() + Number(horas) * 36e5;
while (Date.now() < fim) {
  const novas = await q(`select m.texto, m.tipo, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
    where c.empresa_id = $1 and m.direcao = 'in' and m.momento > $2 order by m.momento`, [empresaId, desde]);
  const humanas = novas.filter((m) => !m.texto || !pareceAutoResposta(m.texto));
  if (humanas.length) {
    await new Promise((r) => setTimeout(r, 45000)); // ela pode estar mandando mais de um balão
    const todas = await q(`select m.texto, m.tipo, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
      where c.empresa_id = $1 and m.direcao = 'in' and m.momento > $2 order by m.momento`, [empresaId, desde]);
    console.log('MENSAGEM NOVA DO LEAD:');
    for (const m of todas) console.log(`${m.momento.toISOString()} [${m.tipo || 'texto'}] ${m.texto ?? '[mídia/áudio sem texto]'}`);
    await fecharDb(); process.exit(0);
  }
  await new Promise((r) => setTimeout(r, 60000)); // 1 consulta por minuto (pedido do Marcelo, 09/10)
}
console.log('TEMPO ESGOTADO sem resposta'); await fecharDb();
