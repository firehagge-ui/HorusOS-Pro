# `_conhecimento/network/` — o oráculo destilado

Cards de conhecimento extraídos dos **4 grupos de network** do Marcelo (comunidades de
freelancers e agências brasileiras que constroem sites, sistemas e automação com IA).

## Por que esta pasta existe

O NotebookLM do Marcelo é o oráculo **humano**: ele pergunta, lê a resposta, decide. Esta
pasta é o oráculo **do Horus OS**: eu leio arquivo direto (Read/Grep), fica versionado, e
vira doutrina que sobrevive entre conversas. Mesma matéria-prima, dois consumidores.

## Regras de uso

- 🔴 **Material privado de gente real.** Extrair o **princípio e o número**, nunca colar
  nome, @ ou frase literal de membro. Alguns grupos têm confidencialidade declarada.
- 🔴 **Nunca colar isso numa peça de cliente.** É régua interna de decisão, não conteúdo.
- 🔴 **Todo card tem selo de confiança.** Muito "ouro" de grupo é achismo ou benchmark
  importado sem calibração. Número de rede brasileira é mais confiável que número gringo
  traduzido, mas ainda assim é **referência, não meta**.
- Quando um card contradisser a doutrina da casa (`_memoria/`), **a doutrina da casa
  vence** e a contradição vira nota no card.

## Como um card entra aqui

Hoje, das duas formas:

1. **Q&A do NotebookLM** (foi assim que o primeiro card nasceu, 03/09/2026): o Marcelo
   pergunta lá, cola a resposta aqui, eu destilo.
2. **Pipeline de export `.txt`** ✅ **construído em 07/09/2026 — skill `/ingerir-network`:**
   você salva o export do WhatsApp em `dados/network/`, um script determinístico limpa e
   anonimiza (zero token), e um subagente por chunk destila em contexto isolado → só os
   cards voltam. O bruto **nunca** entra na conversa principal. É o caminho de lote (mensal);
   o Q&A do item 1 continua valendo para pergunta pontual.

## Cards

| Card | Assunto | Primeira gravação |
|---|---|---|
| `precificacao-sistemas-web.md` | Quanto cobrar por site, e-commerce, CRM, bot e manutenção; stack e travas legais | 03/09/2026 |
| `hospedagem-sistemas.md` | Onde/como a rede hospeda CRM: VPS (Hostinger/Contabo), Docker+Coolify multi-cliente, Vercel+Supabase, Frappe Cloud, SaaS de afiliado | 05/09/2026 |
| `cobranca-e-protecao-comercial.md` | Cliente que fecha verbal e some antes da entrada: por que trava, como destravar (voz, mini-call com o sócio, cartão) e como estruturar pagamento/contrato pra não tomar cano | 10/09/2026 |
