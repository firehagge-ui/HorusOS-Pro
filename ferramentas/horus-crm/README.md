# Hórus CRM — o painel do operador (Antônio)

> **O que é:** o CRM/dashboard comercial completo do Antônio, construído a partir das
> 9 referências que o Marcelo mandou (Encode / Nexuss.dev) tratadas como
> **especificação** (regra do print numerado do CLAUDE.md), fundindo com o nosso
> **Painel Ataque & Planta** (`../painel-ataque-planta/`) como base de doutrina.
> Protótipo standalone: abre o `index.html`, roda sem build. Iniciado em 13/09/2026.

## Como rodar

Abrir `ferramentas/horus-crm/index.html` no navegador (duplo clique, ou
`python3 -m http.server` dentro da pasta → `localhost:8000`). Sem dependência de
servidor. Dados persistem no `localStorage` **daquele navegador** (não sobe pra
lugar nenhum). Config (engrenagem no rodapé da sidebar) reseta pro seed.

## As telas (o que veio de cada referência)

| Tela | Referência | O que faz |
|---|---|---|
| **Início** | infográfico do "homem laranja de terno" | dashboard com o mascote, campanha ativa, leads prontos, respostas, agendamento; canvas de conexões (1 assinatura de motion/tela) |
| **Encontrar clientes** | Apify finder | busca por nicho/cidade/quantidade, custo estimado, resultados com score, **importar pro funil** (funcional) |
| **Operações** | wizard 5 passos | WhatsApp → Leads → Mensagem → Agendamento → Revisar; conectar número, ritmo Conservador/Recomendado/Mais rápido, janela e dias |
| **Respostas** | inbox Encode | conversas de quem respondeu, detecção de objeção, **sugestão de resposta do copiloto**, chips de objeção, simulação |
| **Negócios** | pipeline Nexuss | kanban pannable (arrasta o quadro, zoom), 7 estágios, score, "sem site", drag-and-drop entre colunas, KPIs |
| **Relatórios** | "o dinheiro da operação" | fechado/recebido/a receber/recorrente/pipeline provável, gráfico por mês, projetos por etapa, ticket médio |
| **Clientes atuais** | *pedido do Marcelo* | a carteira real (Amparo, Grão da Serra, Aion, Mayara, Permita-se, Washington, Mullsanni) com fase, travas de compliance e máquina de cada um |
| **Falar com o Claude** | *pedido do Marcelo* | chat de estratégia; conecta na API da Anthropic com a chave do usuário (localStorage), com **modo demonstração** sem chave |
| **Lead (modal)** | ficha Nexuss | score, tags, card do Instagram, WhatsApp/registrar contato, copiloto com a trava "aguardando resposta", histórico |

## Falar com o Claude — como ativar

Sem chave, roda em **modo demonstração** (respostas simuladas, honesto). Pra valer:
sidebar → *Falar com o Claude* → **Adicionar chave** → cola a chave da Anthropic
(console.anthropic.com → API Keys). A chave fica **só no localStorage do navegador**,
nunca sai daqui. O app chama `POST /v1/messages` direto do navegador (header
`anthropic-dangerous-direct-browser-access`), modelo padrão `claude-opus-5`
(troca pra sonnet/haiku no seletor). O custo roda na conta da chave. O system prompt
já carrega a doutrina da casa (personalização > volume, não queimar chip, compliance
trava, nada inventado).

## Decisões registradas

- **Cor ember-forward:** as referências e o mascote são laranja. Este app **interno**
  segue ember (laranja) como primária + verde WhatsApp + violeta/electric de apoio,
  dentro da família VOID escura. A doutrina da casa (`identidade/design-guide.md`)
  mantém amarelo `#F4C430` no **site institucional**; aqui o print manda, e é interno.
- **Detector limpo (exit 0):** duas transições de layout foram corrigidas de verdade
  (perf); quatro achados de fidelidade à referência (stripe de score no kanban, glow
  do CTA laranja, dot de digitação, violeta funcional) estão **dispensados com motivo**
  em `.impeccable/config.json`, escopados a esta pasta.
- **Integridade:** leads de prospecção são **fictícios e marcados**. Os *clientes
  atuais* usam fatos de alto nível já versionados em `_memoria/empresa.md`. Nada
  inventado; setor regulado aparece como flag (o compliance do cliente é que trava).

## De protótipo a produto (sem retrabalho)

Camada de interface/decisão pronta. Backend real depois: **Pronto** (Next.js/TS/
Supabase, `../crm-hospedavel/`) troca o `localStorage`; a **ponte Spark** alimenta
"Encontrar clientes"; o disparo de WhatsApp e o copiloto entram via **Icarus** (agente
do Antônio). ⚠️ Subir hospedado = suporte pra sempre → mensalidade e `/conselho`.

## Arquivos

```
horus-crm/
├── index.html          carrega tudo
├── css/base.css        sistema visual (tokens, layout, componentes)
├── css/views.css       estilos por tela
├── js/core.js          ícones, helpers de UI, store (localStorage)
├── js/data.js          seed (leads fictícios, funil, clientes reais, finanças)
├── js/views.js         render de todas as telas + modal + copiloto
└── js/app.js           router, sidebar, boot, canvas do hero, chat com o Claude
```

## Registro do loop noturno (13/09/2026)

Construído durante a noite em `/loop`, commitando a cada avanço. Ver o histórico de
commits desta branch para a ordem das iterações.
