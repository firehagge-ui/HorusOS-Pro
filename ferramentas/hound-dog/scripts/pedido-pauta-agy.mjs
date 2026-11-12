// Monta o pedido da pauta da semana IGUAL ao que o 📣 Mídia recebe, pra o Agy fazer a mesma tarefa e as duas pautas
// serem comparadas lado a lado (teste do Agy, ferramentas/agy/teste-2-plano.md). Não chama Claude nem Agy.
//   node ferramentas/hound-dog/scripts/pedido-pauta-agy.mjs 2026-11-02
// Saída em ferramentas/agy/teste-2/: pedido-pauta.txt e schema-pauta.json.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_REPO } from '../lib/env.mjs';
import { pedidoPauta, radarPerfis, ESQ_PAUTA, RADAR_PADRAO } from '../farejador/midia.mjs';
import { fecharDb } from '../lib/db.mjs';

const semana = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(semana || '')) { console.log('Uso: pedido-pauta-agy.mjs AAAA-MM-DD (a segunda da semana)'); process.exit(1); }
const pastaRadar = path.join(RAIZ_REPO, 'marketing', 'conteudo', 'midia', 'pautas', `${semana}-radar`);
const arqRadar = path.join(pastaRadar, 'radar.json');
let radar;
if (fs.existsSync(arqRadar)) radar = JSON.parse(fs.readFileSync(arqRadar, 'utf8'));
else {
  // Pauta feita antes de 29/10 não guardou o radar: lê os perfis de novo (os números podem mudar um pouco)
  fs.mkdirSync(pastaRadar, { recursive: true });
  radar = await radarPerfis(RADAR_PADRAO, pastaRadar, (m) => console.log(m), () => false);
  fs.writeFileSync(arqRadar, JSON.stringify(radar, null, 2));
}
const saida = path.join(RAIZ_REPO, 'ferramentas', 'agy', 'teste-2');
fs.mkdirSync(saida, { recursive: true });
fs.writeFileSync(path.join(saida, 'pedido-pauta.txt'), await pedidoPauta(semana, radar));
fs.writeFileSync(path.join(saida, 'schema-pauta.json'), JSON.stringify(ESQ_PAUTA, null, 2));
console.log(`Pedido e schema em ${path.relative(RAIZ_REPO, saida)} (radar de ${radar.length} perfis).`);
await fecharDb();
process.exit(0);
