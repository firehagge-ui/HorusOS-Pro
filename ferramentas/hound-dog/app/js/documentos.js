/* =============================================================================
   HOUNDER — Proposta em PDF e prévia do site, a partir da ficha (10/11/2026)
   O Farejador gera (tarefas gerar_proposta e gerar_previa). Nada é enviado ao lead:
   o Marcelo baixa o PDF ou copia o link e decide se manda.
   ============================================================================= */
import { sb, criarJob, farejadorOnline } from './sb.js';
import { $, esc, toast, erroAmigavel, botaoCarregando, modal, relativo, copiar } from './ui.js';
import { icone } from './icones.js';

/** Lead que respondeu: mensagem recebida no WhatsApp ou "Respondeu" marcado no Disparos. */
export async function leadRespondeu(empresaId) {
  const { data: convs } = await sb.from('whatsapp_conversas').select('id').eq('empresa_id', empresaId);
  if (convs?.length) {
    const { count } = await sb.from('whatsapp_mensagens').select('id', { count: 'exact', head: true }).in('conversa_id', convs.map((c) => c.id)).eq('direcao', 'in').neq('tipo', 'indecifrada');
    if (count) return true;
  }
  const { count } = await sb.from('disparos').select('id', { count: 'exact', head: true }).eq('empresa_id', empresaId).eq('respondeu', true);
  return Boolean(count);
}

async function documentos(empresaId, tipo) {
  const { data } = await sb.from('atividades').select('criado_em,dados').eq('empresa_id', empresaId).eq('dados->>tipo_doc', tipo).order('criado_em', { ascending: false }).limit(5);
  return data || [];
}
function listaDocs(docs, rotulo) {
  if (!docs.length) return '';
  return `<div class="rotulo mb-8">${esc(rotulo)}</div><div class="col gap-6 mb-16">${docs.map((d) => `<div class="row wrap gap-6"><a class="btn sm" href="${esc(d.dados.url)}" target="_blank" rel="noopener">${icone('arquivo')}Abrir</a><button class="btn sm fantasma" data-copiar-link="${esc(d.dados.url)}">${icone('copiar')}Copiar link</button><span class="dim" style="font-size:12.5px">${esc(relativo(d.criado_em))}</span></div>`).join('')}</div>`;
}
function ligarCopiar(el) {
  el.querySelectorAll('[data-copiar-link]').forEach((b) => (b.onclick = () => copiar(b.dataset.copiarLink, 'Link copiado')));
}
const avisoFarejador = () => (farejadorOnline() ? '' : `<div class="aviso laranja mb-12">${icone('alerta')}<div><b>Farejador offline.</b> O pedido fica na fila e sai quando ele ligar no seu PC.</div></div>`);

export async function abrirPrevia(e) {
  const [respondeu, docs] = await Promise.all([leadRespondeu(e.id), documentos(e.id, 'previa')]);
  const m = modal({
    titulo: 'Prévia do site', subtitulo: `Site de demonstração com os dados públicos ${e.nome ? `de ${e.nome}` : ''}. Sai em uns 3 minutos.`, icone: 'globo', pe: '',
    corpo: `${listaDocs(docs, 'Prévias já geradas')}
      ${respondeu
        ? `${avisoFarejador()}<p class="dim mb-12" style="font-size:13.5px">O Claude escreve o texto só com o que está na ficha e nos comentários do Google. A prévia vai para um link sem indexação. Nada é enviado ao lead.</p><button class="btn prim" data-gerar>${icone('globo')}Gerar prévia</button>`
        : `<div class="aviso laranja">${icone('alerta')}<div><b>Este lead ainda não respondeu.</b> A prévia sai só para quem respondeu: prévia sem pedido afasta o lead (regra de 08/10).</div></div>`}`,
  });
  ligarCopiar(m.el);
  const b = $('[data-gerar]', m.el);
  if (b) b.onclick = async () => {
    botaoCarregando(b, true, 'Pedindo…');
    try {
      await criarJob('gerar_previa', { empresa_id: e.id }, { empresa_id: e.id }, 4);
      toast('Prévia na fila. Aviso quando ficar pronta.', 'info');
      m.fechar();
    } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(b, false); }
  };
}

const linhas = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean);

export async function abrirProposta(e) {
  const docs = await documentos(e.id, 'proposta');
  const m = modal({
    titulo: 'Proposta em PDF', subtitulo: `Para ${e.nome}. Preço, prazo e escopo saem daqui, do jeito que você escrever.`, icone: 'arquivo', largo: true, pe: '',
    corpo: `${listaDocs(docs, 'Propostas já geradas')}${avisoFarejador()}
      <form data-form class="col gap-12">
        <div class="campo"><label>O que você vende *</label><input class="inp" name="oferta" required placeholder="Ex.: Site no ar com pedido no WhatsApp"></div>
        <div class="grade-2">
          <div class="campo"><label>Preço *</label><input class="inp" name="preco" required placeholder="Ex.: R$ 1.200"></div>
          <div class="campo"><label>Prazo *</label><input class="inp" name="prazo" required value="7 dias depois do pagamento e do material"></div>
        </div>
        <div class="campo"><label>O que entra * <span class="dim">(uma por linha: título: explicação)</span></label><textarea class="txt" name="inclui" rows="3" placeholder="Site de uma página: com botão para o seu WhatsApp."></textarea></div>
        <div class="grade-2">
          <div class="campo"><label>O que não entra * <span class="dim">(uma por linha)</span></label><textarea class="txt" name="naoInclui" rows="2">Verba de anúncio</textarea></div>
          <div class="campo"><label>Limites * <span class="dim">(uma por linha)</span></label><textarea class="txt" name="limites" rows="2">O resultado depende de região e concorrência: não garanto número de clientes</textarea></div>
        </div>
        <div class="campo"><label>Pagamento * <span class="dim">(uma por linha: forma | valor | detalhe)</span></label><textarea class="txt" name="pagamento" rows="2" placeholder="À vista | R$ 1.200 | No Pix"></textarea></div>
        <div class="campo"><label>O que você viu no negócio dele <span class="dim">(1 ou 2 frases)</span></label><textarea class="txt" name="contexto" rows="2">${esc(e.dor || e.gancho || '')}</textarea></div>
        <div class="campo"><label>O que ele te contou <span class="dim">(só o que ele disse de verdade)</span></label><textarea class="txt" name="conversa" rows="2"></textarea></div>
        <div class="grade-2">
          <div class="campo"><label>Validade (dias)</label><input class="inp" name="validadeDias" type="number" min="1" max="60" value="7"></div>
          <div class="campo"><label>Artigo do nome</label><select class="sel" name="artigo"><option value="a">a (a barbearia)</option><option value="o">o (o estúdio)</option></select></div>
        </div>
        <p class="dim" style="font-size:12.5px">A nota, as avaliações e o site da ficha entram sozinhos. A prévia entra se já existir. O PDF fica no Hounder e em Downloads\\Propostas.</p>
        <div class="row"><button class="btn prim" type="submit">${icone('arquivo')}Gerar o PDF</button></div>
      </form>`,
  });
  ligarCopiar(m.el);
  const form = $('[data-form]', m.el);
  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const f = Object.fromEntries(new FormData(form));
    const entrada = {
      empresa_id: e.id, oferta: f.oferta.trim(), preco: f.preco.trim(), prazo: f.prazo.trim(), validadeDias: Number(f.validadeDias) || 7, artigo: f.artigo,
      inclui: linhas(f.inclui).map((l) => { const [t, ...r] = l.split(':'); return [t.trim(), r.join(':').trim()]; }),
      naoInclui: linhas(f.naoInclui), limites: linhas(f.limites),
      pagamento: linhas(f.pagamento).map((l) => l.split('|').map((x) => x.trim())).map((p) => [p[0] || 'À vista', p[1] || '', p[2] || '']),
      contexto: f.contexto.trim(), conversa: f.conversa.trim(),
    };
    const falta = [!entrada.oferta && 'o que você vende', !entrada.preco && 'o preço', !entrada.prazo && 'o prazo', !entrada.inclui.length && 'o que entra',
      !entrada.naoInclui.length && 'o que não entra', !entrada.limites.length && 'os limites', !entrada.pagamento.some((p) => p[1]) && 'a forma de pagamento com valor'].filter(Boolean);
    if (falta.length) { toast(`Falta ${falta.join(', ')}`, 'erro'); return; }
    if (/[—–]/.test(JSON.stringify(entrada))) { toast('Tire o travessão do texto', 'erro'); return; }
    const b = $('button[type=submit]', form);
    botaoCarregando(b, true, 'Pedindo…');
    try {
      await criarJob('gerar_proposta', entrada, { empresa_id: e.id }, 3);
      toast('Proposta na fila. Aviso quando o PDF ficar pronto.', 'info');
      m.fechar();
    } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(b, false); }
  };
}
