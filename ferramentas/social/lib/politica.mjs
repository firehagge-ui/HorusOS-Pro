// =============================================================================
// Política de autonomia: decide, ANTES de qualquer ação, se o agente faz sozinho
// (auto), prepara e espera aprovação (fila) ou não faz (proibido).
// Função pura, sem rede e sem banco: quem chama traz o histórico.
// Tabela e porquê em ARQUITETURA.md, seção 4.4.
// =============================================================================

export const NIVEIS = ['proibido', 'fila', 'auto'];

/** Ações que nunca acontecem, em nenhuma fase, para nenhuma marca. */
export const PROIBIDAS = new Set([
  'excluir_post', 'dm_iniciar', 'seguir_em_massa', 'curtir_em_massa', 'falar_preco', 'negociar',
]);

/** Ações que tornam algo visível ao público (marca regulada nunca passa de fila nelas). */
export const PUBLICAS = new Set([
  'publicar_feed', 'publicar_carrossel', 'publicar_reel', 'publicar_story', 'responder_comentario',
  'responder_dm', 'editar_bio', 'editar_nome', 'editar_foto', 'editar_destaque', 'editar_legenda',
]);

/** Padrão da casa por fase. "graduado" = auto depois de N aprovações seguidas sem edição. */
export const TABELA_PADRAO = {
  ler:                   ['auto', 'auto', 'auto'],
  publicar_feed:         ['fila', 'graduado', 'auto'],
  publicar_carrossel:    ['fila', 'graduado', 'auto'],
  publicar_reel:         ['fila', 'graduado', 'auto'],
  publicar_story:        ['fila', 'auto', 'auto'],
  responder_comentario:  ['fila', 'auto', 'auto'],   // só risco baixo chega aqui; o resto vira responder_dm/lead
  ocultar_comentario:    ['fila', 'auto', 'auto'],
  responder_dm:          ['fila', 'fila', 'fila'],
  editar_bio:            ['fila', 'fila', 'fila'],
  editar_nome:           ['fila', 'fila', 'fila'],
  editar_foto:           ['fila', 'fila', 'fila'],
  editar_destaque:       ['fila', 'fila', 'fila'],
  editar_legenda:        ['fila', 'fila', 'auto'],
};

const menor = (a, b) => (NIVEIS.indexOf(a) <= NIVEIS.indexOf(b) ? a : b);

/**
 * @param {object} p
 * @param {object} p.politica   { fase: 1|2|3, regulado, graduacao: { aprovacoes_sem_edicao }, limites: { acao: max_por_dia }, tabela?: sobrescreve TABELA_PADRAO }
 * @param {string} p.acao
 * @param {string} [p.formato]  ex.: 'carrossel-lista'. A graduação conta por formato
 * @param {object} [p.historico] { sequenciaSemEdicao: { [formato]: n }, feitasHoje: { [acao]: n } }
 * @param {string} [p.risco]    'baixo' | 'medio' | 'alto' (para interações; só baixo pode ser auto)
 * @returns {{ nivel: 'auto'|'fila'|'proibido', motivo: string }}
 */
export function decidir({ politica = {}, acao, formato, historico = {}, risco } = {}) {
  if (!acao) return { nivel: 'proibido', motivo: 'Ação sem nome.' };
  if (PROIBIDAS.has(acao)) return { nivel: 'proibido', motivo: `"${acao}" é proibida em qualquer fase.` };

  const tabela = { ...TABELA_PADRAO, ...(politica.tabela || {}) };
  const linha = tabela[acao];
  if (!linha) return { nivel: 'proibido', motivo: `"${acao}" não está na política. Ação desconhecida não roda.` };

  const fase = [1, 2, 3].includes(politica.fase) ? politica.fase : 1;
  let nivel = linha[fase - 1];
  let motivo = `Fase ${fase}: ${acao} = ${nivel}.`;

  if (nivel === 'graduado') {
    const precisa = politica.graduacao?.aprovacoes_sem_edicao ?? 8;
    const tem = formato ? (historico.sequenciaSemEdicao?.[formato] ?? 0) : 0;
    if (formato && tem >= precisa) { nivel = 'auto'; motivo = `Formato "${formato}" graduado: ${tem} aprovações seguidas sem edição.`; }
    else { nivel = 'fila'; motivo = `Formato "${formato || '?'}" ainda não graduou (${tem} de ${precisa} aprovações sem edição).`; }
  }

  if (risco && risco !== 'baixo' && nivel === 'auto') {
    nivel = 'fila'; motivo = `Risco ${risco}: só risco baixo roda sozinho.`;
  }

  if (politica.regulado && PUBLICAS.has(acao)) {
    const antes = nivel;
    nivel = menor(nivel, 'fila');
    if (antes !== nivel) motivo = 'Marca regulada: nada público sai sem aprovação.';
  }

  const limite = politica.limites?.[acao];
  const feitas = historico.feitasHoje?.[acao] ?? 0;
  if (nivel === 'auto' && limite != null && feitas >= limite) {
    nivel = 'fila'; motivo = `Limite diário de "${acao}" atingido (${feitas} de ${limite}).`;
  }

  return { nivel, motivo };
}
