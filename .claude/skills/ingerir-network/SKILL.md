---
name: ingerir-network
description: >
  Transforma export(s) .txt de grupo de WhatsApp de network num ou mais cards de
  conhecimento destilados em _conhecimento/network/, sem nunca deixar o texto bruto
  entrar na conversa principal (trava de token via script + subagentes isolados).
  Use quando o Marcelo disser "/ingerir-network", "ingerir os grupos", "processa esse
  export do WhatsApp", "atualiza o oráculo com esse .txt", ou mandar um arquivo de
  conversa de grupo pra virar conhecimento. É a via automatizável do oráculo (o Q&A
  manual do NotebookLM continua valendo pra pergunta pontual).
---

# /ingerir-network — do export de WhatsApp ao card destilado

Pega o despejo bruto dos grupos de network e devolve **conhecimento** em
`_conhecimento/network/`: cards temáticos com princípio, número e selo de confiança,
que eu leio depois por Grep e viram doutrina da casa.

O oráculo tem dois consumidores com a **mesma matéria-prima** (o export `.txt`): o
**humano** (o Marcelo pergunta no NotebookLM) e o **do Horus OS** (esta pasta, que eu
leio direto). Esta skill alimenta o segundo. Não depende do NotebookLM nem de API do
Google — nenhuma existe para conta pessoal (ver a memória `project_notebooklm-network-oraculo`).

## 🔴 A regra que não se quebra: o bruto NUNCA entra na conversa principal

Um export de grupo tem +1.000 mensagens/dia. Jogar isso no chat estoura o orçamento de
token e enche o contexto de ruído social. Por isso o bruto só é tocado por:
1. um **script determinístico** (sem LLM, zero token), que limpa e fatia; e
2. **subagentes em contexto isolado**, um por chunk, que leem e devolvem só as pepitas.

A conversa principal (eu) só vê: o `stats.json` (kilobytes) e as **pepitas destiladas**.
Nunca faço `Read` no `.txt` cru nem nos chunks. Se eu me pegar prestes a ler o bruto,
parei e usei um subagente.

## Antes de começar

- Material privado de gente real. **Extrair o princípio e o número, nunca colar nome, @
  ou frase literal.** Alguns grupos têm confidencialidade declarada. O script já
  anonimiza autores (M01, M02…) e telefones; os subagentes reforçam.
- **Nada disso vai para peça de cliente.** É régua interna de decisão.
- Cadência é **lote** (mensal), não diário. Um export por grupo por rodada.

## Passo 0 — Receber o material

Peça ao Marcelo para **salvar** o(s) export(s) `.txt` numa pasta (não colar no chat — é
o que estamos evitando). Sugestão: `dados/network/` (a drop zone já é gitignorada). No
WhatsApp: abrir o grupo → **Exportar conversa → Sem mídia** → salvar o `.txt`.
Confirme o caminho antes de rodar.

## Passo 1 — Limpar e fatiar (script, sem token)

Rode, da raiz do repo (aponte para o arquivo OU a pasta com vários `.txt`):

```
node .claude/skills/ingerir-network/scripts/limpar.mjs dados/network --chunk-kb 140
```

O script detecta o formato (iOS/Android, PT/EN), remove sistema/mídia/apagada/ruído
social, anonimiza, e escreve em `dados/network/.ingest/`: `stats.json` +
`chunk-001.txt … chunk-NNN.txt`. **Leia só o `stats.json`** e reporte ao Marcelo:
mensagens mantidas, % de sinal, período, nº de chunks. Se `mantidas` vier baixíssimo
(<5%) ou `formato: desconhecido`, o parser não pegou o formato do telefone dele —
peça 15 linhas de exemplo do `.txt` (só o começo) para calibrar o regex antes de seguir.

## Passo 2 — Destilar (1 subagente por chunk, em paralelo, isolado)

Para cada `chunk-NNN.txt`, lance um subagente (`Task`/Agent, tipo `general-purpose`).
Lance-os **na mesma mensagem** para rodarem em paralelo. Prompt de cada um:

> Você é um destilador de conhecimento de network. Leia SÓ o arquivo
> `dados/network/.ingest/chunk-NNN.txt` (mensagens anonimizadas de um grupo de
> freelancers/agências que fazem site, sistema e automação com IA no Brasil).
> Extraia apenas o que é **conhecimento acionável de negócio**: preço praticado,
> stack/ferramenta e por quê, hospedagem/infra, tática de oferta/fechamento, trava
> legal, armadilha relatada, número de mercado. Ignore conversa social, dúvida sem
> resposta e link solto.
> Para cada pepita devolva UMA linha neste formato exato:
> `[TEMA] afirmação com o número | quantos membros distintos sustentaram (ex: 3) | confiança: alta|média-alta|média|baixa`
> TEMAS válidos: oferta-e-preco · crm-e-sistemas · sites-e-design · midia-e-trafego ·
> hospedagem-e-infra · ia-ferramentas · negocio-e-operacao.
> Regras: NUNCA copie nome, @ ou frase literal — reescreva como princípio. Nomes de
> ferramentas/serviços podem aparecer. Confiança alta só para prática confirmada por
> vários; um relato só = baixa. Devolva no MÁXIMO 15 linhas, as mais valiosas. Se o
> chunk não tiver nada acionável, responda só "SEM PEPITAS". Não escreva arquivo nenhum.

Cada subagente devolve poucas linhas. Junte todas as pepitas de todos os chunks.

## Passo 3 — Consolidar em cards

Com as pepitas na mão (são leves), agrupe por TEMA. Para cada tema:

1. Veja se já existe card em `_conhecimento/network/` que cobre o assunto (hoje:
   `precificacao-sistemas-web.md`, `hospedagem-sistemas.md` — liste a pasta para ver o
   estado atual). Se existir, **atualize** (Edit) fundindo a pepita nova; se contradisser
   o card, registre a divergência, não sobrescreva cegamente. Se não existir, **crie** um
   card novo a partir de `templates/card.md`.
2. **Dedup:** pepita que só repete o que o card já diz não vira linha nova; se reforça
   (mais membros sustentaram), suba a confiança e anote.
3. Preencha o selo de confiança do card e a seção "Ressalvas da casa" — onde a doutrina
   de `_memoria/` vence a pepita (ex.: viés da comunidade por construir tudo na unha; o
   caso do estoque de flor no `precificacao-sistemas-web.md`).
4. Atualize a tabela de cards no `_conhecimento/network/README.md`.

## Passo 4 — Fechar

- Apague o `dados/network/.ingest/` (o bruto/chunks já cumpriram o papel). Pergunte ao
  Marcelo se quer manter ou apagar o `.txt` original.
- Reporte: quais cards nasceram/mudaram, e 2–3 pepitas de maior valor prático agora.
- Se algo aqui mudou o contexto do negócio (ex.: número que recalibra precificação),
  ofereça atualizar a memória (`project_*`), seguindo o CLAUDE.md.

## Selo de confiança (o padrão da pasta)

- **ALTA** — contrato/prática real confirmada por vários membros brasileiros.
- **MÉDIA-ALTA** — prática comum relatada, com variação.
- **MÉDIA** — opinião recorrente com viés claro da comunidade.
- **BAIXA** — achismo, relato único, ou benchmark gringo não calibrado.

Número de rede brasileira > número gringo traduzido, mas **tudo é referência, não meta**.

## Notas

- Se o volume de pepitas for grande demais para consolidar de uma vez, delegue a
  escrita de cada card a um subagente por tema (passando só as pepitas daquele tema) —
  o bruto continua fora.
- O parser cobre iOS (`[data, hora] Nome:`) e Android (`data hora - Nome:`), PT e EN.
  Formato novo de telefone = ajustar os regex `RE_IOS`/`RE_ANDROID` em `scripts/limpar.mjs`.
