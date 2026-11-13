// Hook UserPromptSubmit: quando o Marcelo fala de mensagem pra lead ou cliente, lembra a porta da mensagem.
// Origem: 03/11/2026, Clínica Michele. Ele teve que pedir duas vezes o alinhamento com a pesquisa de 09/10.
// Não bloqueia nada: só injeta contexto. Qualquer erro sai em silêncio (exit 0).
let entrada = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { entrada += c; });
process.stdin.on('end', () => {
  try {
    const { prompt = '' } = JSON.parse(entrada || '{}');
    const gatilho = /\b(mensagem|mensagens|abordagem|abordar|responder|respondeu|resposta|lead|follow-?up|whats(app)?|rascunho|disparo|o que eu (mando|respondo)|mandar pr[ao]|escrever pr[ao]|cold|prospec)/i;
    if (!gatilho.test(prompt)) return;
    const contexto = [
      'PORTA DA MENSAGEM (regra do Marcelo, 03/11/2026): se esta resposta tiver qualquer mensagem pra lead ou cliente,',
      'passe pela skill /prospeccao ANTES de mostrar. Leia primeiro _memoria/prospeccao/15-o-que-deu-certo.md',
      '(a pesquisa de 09/10, que vem acima da doutrina antiga), depois a fala humana (90-cara-de-ia, voz-marcelo,',
      '"Como escrever" das preferencias). Rode o revisor. Devolva a mensagem com o quadro "a pesquisa diz (caso) -> a',
      'mensagem faz", sem esperar ele pedir. Direto ao ponto vence o longo.',
    ].join(' ');
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: contexto } }));
  } catch { /* silencioso */ }
});
