# Ponte Spark → Horus (Gemini → Claude)

Aliança de trabalho entre três peças: **Gemini Spark** faz o volume (varrer,
listar, coletar), o **Google Sheets** é o carteiro (dado estruturado numa
planilha pública), e o **Horus (Claude)** faz o julgamento (auditar, qualificar,
produzir). O Spark faz o barato; o Claude só entra no caro. Isso economiza token
de verdade, porque a parte pesada (achar) não é do Claude.

Criada em 08/09/2026.

---

## O fluxo (como funciona)

```
Gemini Spark  →  Google Sheets  →  Publicar na web (CSV)  →  Horus lê a URL  →  audita/produz
   (volume)       (o carteiro)        (link público)          (Firecrawl)        (julgamento)
```

1. O **Spark** roda a tarefa dele e escreve o resultado num **Google Sheets**
   (uma aba por tipo de trabalho: prospecção, temas de conteúdo, avaliações...).
2. No Sheets: **Arquivo → Compartilhar → Publicar na web → formato CSV**. Isso
   gera uma URL pública e estável (não é o botão "qualquer pessoa com o link",
   que passa pelo visualizador logado e **não** é lido de forma confiável).
3. A URL do CSV é registrada em [`fontes.md`](fontes.md) — uma vez só; a planilha
   continua a mesma, o dado é que muda.
4. O **Horus** lê a URL com o Firecrawl (`firecrawl_scrape`), sob demanda ou numa
   rotina agendada, e faz o trabalho de julgamento sobre o dado.

**Não depende do PC do Marcelo ligado:** o link é público, o Horus busca quando
precisa.

## Por que CSV publicado, e não o Drive

- **CSV publicado** funciona hoje, sem autorizar nada, e entrega dado limpo em
  colunas. É o padrão da ponte.
- **Conector do Google Drive** é a rota mais limpa pra arquivos privados (lê pelo
  nome, sem publicar), mas exige o Marcelo autorizar nas configurações de
  conectores do claude.ai. Fica como **upgrade futuro** — quando ligado, dá pra
  ler planilha privada sem o passo de publicar. Não trava a ponte.

## Regras (herdadas da doutrina da casa)

- **Compliance vence.** Nada que o Spark traga entra em peça de cliente sem passar
  pelas travas de sempre (integridade, compliance do cliente regulado).
- **Integridade.** Dado que o Spark não trouxer vira `[FALTA: ...]`, nunca texto
  plausível inventado pra fechar.
- **Material de terceiro.** Se a planilha tiver conteúdo privado (grupo de
  network, base de contatos), vale a regra do oráculo: extrair princípio, nunca
  colar frase ou nome, e nunca usar em peça de cliente.
- **Token.** Ler a planilha custa algum token (o Claude processa o conteúdo), mas
  é fração do que seria fazer o trabalho inteiro. Manter o Spark no volume e o
  Claude no julgamento é o que preserva a economia.

## Ideias de uso (o que a ponte destrava)

Qualquer coisa que o Gemini produza como dado estruturado e caia numa planilha
pública, o Horus passa a ler. Candidatos, do mais pronto pro mais especulativo:

1. **Prospecção auditada** (a principal). Spark lista leads → Horus roda o
   `mcp-prospeccao` (site vivo? CNPJ? roda anúncio?) → qualifica → rascunha a
   abordagem com gancho verdadeiro. Já tem meio caminho andado.
2. **Radar de concorrentes.** Spark lista concorrentes de um nicho → Horus roda
   `/estudar-site` em lote → teardowns pra `referencias/`.
3. **Reputação em lote.** Spark coleta avaliações novas de vários clientes →
   Horus rascunha as respostas (skill `/responder-avaliacoes`) pro Marcelo aprovar.
4. **Fila de conteúdo.** Planilha de temas de carrossel por cliente → Horus puxa
   o próximo e produz.
5. **CRM leve de leads.** Status de cada lead (frio/morno/quente, follow-up) numa
   planilha → Horus lê pra saber quem cutucar e quando.
6. **Intake de briefing.** Spark faz a pesquisa inicial de um lead novo → base do
   `briefing.md` do cliente.

Começar pela #1 (prospecção), que é a de maior retorno e a que já tem ferramenta.
