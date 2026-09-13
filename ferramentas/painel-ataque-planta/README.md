# Painel Ataque & Planta — CRM comercial do Antônio (originação)

> **O que é:** o painel/dashboard do funil de **originação** do Antônio — a boca de
> funil da dupla (Antônio = originação · Marcelo = produção). Protótipo standalone
> de interface, roda abrindo o `index.html` no navegador. Criado em 13/09/2026.
>
> **Por que "Ataque & Planta":** é o painel referenciado como
> `_gestao/painel-ataque-planta.md` (interno, fora do Git). **Ataque** = prospecção
> ativa (Lista → Abordado → Respondeu → R1 → R2); **Planta** = o que já fechou e
> vira relacionamento/recompra. O copiloto "só sugere a próxima mensagem depois do
> lead responder" — a regra do card `abordagem-e-prospeccao.md`.

## Como rodar

Abrir `ferramentas/painel-ataque-planta/index.html` no navegador (duplo clique, ou
`python3 -m http.server` na pasta e acessar `localhost:8000`). Sem build, sem
dependência de servidor. DM Sans carrega do Google Fonts.

Os dados começam com um **seed de exemplo** (`dados.js`, tudo fictício e marcado) e
persistem no `localStorage` **daquele navegador** — não sobe pra lugar nenhum, não é
compartilhado. Arrastar card entre colunas move o lead; clicar abre a ficha + o
copiloto.

## O que ele encoda (doutrina da casa, não invenção)

Toda régua do painel vem de arquivo versionado — se a doutrina mudar, o painel
acompanha:

| Peça do painel | Fonte |
|---|---|
| Estágios do funil (Ataque/Planta) | `_conhecimento/network/operacao-agencia-e-sociedade.md` §1 |
| Metas (30–50 empresas/sem, 3–7 abordagens/dia, R1 10–20%, R2 ~33%, ~1 contrato/sem) | `_conhecimento/network/taxas-de-conversao.md` |
| Ganchos (Google+perda 🏆, site fora, presencial, indicação, Insta ❌) e os 3 modelos de mensagem | `_conhecimento/network/abordagem-e-prospeccao.md` |
| Copiloto que segura o link até o lead responder; aquecer chip novo | idem §2B, §4 |
| Origem dos leads (ponte Spark, Apify, Maps, CNPJ) | `abordagem-e-prospeccao.md` §5 + `ferramentas/ponte-spark/` |
| Travas do rodapé (não disparar em massa, fechar na reunião, 50% de entrada) | `_memoria/comercial.md`, cards de network |
| Identidade visual (VOID + amarelo #F4C430 + electric, DM Sans, olho de Hórus) | `identidade/design-guide.md`, `site/assets/site.css` |

⚠️ **Número de rede é benchmark, não meta nem promessa** — o painel mostra as faixas
como referência pra dimensionar esforço, não como cobrança. Medir o real do Antônio
e comparar.

## Travas respeitadas

- **Nada de dado real de cliente inventado** (`_memoria/integridade.md`): o seed é
  fictício e marcado; a carteira real não foi copiada pra cá.
- **Não é peça de cliente.** O conhecimento de network é privado — princípio, nunca
  frase colada, e nunca vai pra fora.
- **Compliance do cliente aparece como flag** no card/ficha (ex.: odonto = CFO), mas
  quem trava a entrega é o compliance do cliente, não o painel.

## De protótipo a produto (caminho, sem retrabalho)

Este protótipo é a **camada de interface/decisão**. Quando virar sistema vivo:

1. **Motor de dados** → o `dados.js` (localStorage) é trocado por Supabase/Postgres.
   O encaixe já mapeado é o **Pronto** (`ferramentas/crm-hospedavel/`, Next.js/TS/
   Supabase, MIT), a base clonável/white-label da casa.
2. **Entrada de leads** → a ponte Spark (Gemini → Sheets → CSV → Firecrawl) alimenta
   a coluna "Lista", auditada pelo `mcp-prospeccao`.
3. **Copiloto** → hoje é template determinístico; no Icarus vira o cérebro que redige
   a próxima mensagem (Haiku 4.5), sempre com o humano aprovando antes de enviar.
4. ⚠️ **Subir sistema hospedado = suporte pra sempre** → precifica como mensalidade e
   passa por `/conselho` (financeiro + operações). Ver `ferramentas/crm-hospedavel/`
   e a memória `project_software-hospedavel`.

## Arquivos

```
painel-ataque-planta/
├── index.html   estrutura (topbar, KPIs, board, drawer, travas)
├── app.css      identidade Hórus (DNA n8n)
├── app.js       funil, drag-and-drop, ficha, copiloto, KPIs derivados
├── dados.js     seed de exemplo (fictício) + metas + ganchos + estágios
└── README.md    este arquivo
```
