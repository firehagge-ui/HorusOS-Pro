# Hound Dog — o CRM e painel de controle da Hórus

> **O que é:** o painel oficial da operação. Prospecção (achar e pontuar clientes), pesquisa
> de mercado, esteira de negócios, carteira de clientes, agenda, WhatsApp com leitura de
> objeção e o Claude rodando por dentro. Substitui os protótipos `horus-crm` e
> `painel-ataque-planta` (removidos em 17/09/2026; ficam no histórico do Git).
>
> **Painel:** https://hound-dog-omega.vercel.app
> **Entra quem:** operador cadastrado (hoje: Marcelo e a conta de QA). Mais ninguém vê nada.

---

## As três peças

```
   VOCÊ (navegador, no PC ou no celular)
            │
            ▼
   PAINEL (Vercel)  ──────────►  BANCO (Supabase, São Paulo)
   HTML/CSS/JS puro              Postgres + login + tempo real
            ▲                            ▲
            │  tempo real                │ fila de trabalho (LISTEN/NOTIFY)
            └────────────────────  FAREJADOR (o seu PC)
                                   Claude Code (sua assinatura, sem API)
                                   WhatsApp (Baileys) · Instagram · lembretes
```

- **Painel**: só interface. Não guarda segredo nenhum: a chave que ele usa é publicável, e
  quem protege os dados é a RLS do banco (só operador logado lê ou escreve).
- **Banco**: Supabase `hound-dog` (região São Paulo). Empresas, esteira, negócios, dinheiro,
  agenda, listas de prospecção, conversas de WhatsApp, pesquisas, fila de tarefas.
- **Farejador**: programa Node que roda no seu PC. É ele que chama o **Claude Code da sua
  assinatura** (sem chave de API, sem custo por mensagem), segura a conexão do WhatsApp,
  coleta o Instagram, manda lembrete e resumo do dia. Sem ele o painel funciona, mas o que
  depende do Claude fica na fila.

## Como ligar o Farejador

```bash
cd ferramentas/hound-dog
npm install          # só na primeira vez
npm run farejador
```

Para ligar sozinho com o Windows (cria os atalhos na área de trabalho e na inicialização):

```powershell
powershell -ExecutionPolicy Bypass -File ferramentas\hound-dog\farejador\instalar-no-windows.ps1
```

O painel mostra, na barra lateral, se o Farejador está online. Registros em
`farejador/logs/`.

## O que cada tela faz

| Tela | Para quê |
|---|---|
| **Início** | O dia: quem pede atenção, agenda de hoje, melhores oportunidades, conversas quentes, pipeline |
| **Encontrar clientes** | Farejada do Claude (nicho + cidade → lista pontuada), planilha do Spark (arrasta CSV/XLSX ou cola o link publicado) e as listas salvas |
| **Mercado** | Pesquisa de nicho e de concorrência com nota de oportunidade, ranking de nichos |
| **Esteira** | O funil em kanban: Novo → Qualificado → Abordado → Conversando → Reunião → Proposta → Negociação → Ganho (+ Follow-up e Perdido) |
| **Conversas** | WhatsApp: objeção detectada, leitura do Claude e resposta pronta para usar |
| **Agenda** | Semana, mês e lista; follow-ups sugeridos pela cadência (dia +3, dia +7) |
| **Clientes** | A carteira: fases vendidas, entrega, recebido e a receber, travas de compliance |
| **Instagram** | Crescimento e engajamento do @ da agência |
| **Relatórios** | Dinheiro, funil de conversão, ritmo de abordagem vs meta, origem e nicho |
| **Claude** | Conversa com o Claude com o contexto da Hórus — e ele mexe no CRM por você |
| **Ajustes** | Farejador, WhatsApp, modelos do Claude, Instagram, playbook de objeções, régua de pontuação, metas, operadores, backup |

## A régua de pontuação (0 a 100)

Vem de `Horus-Comercial/30-checklist-qualificacao.md` e é editável em Ajustes:
sem site ou fora do ar **+30** · movimento real (Instagram/avaliações) **+20** · contato
direto com o dono **+15** · Google fraco **+15** · nicho que a casa já atende **+10** ·
timing quente **+10** · na praça (dá pra ir presencial) **+5** · já investe em anúncio **+5**.
**70+** é alta prioridade. Sinal desconhecido **não** pontua — não se presume dor que não foi vista.

## WhatsApp

Conexão pelo WhatsApp Web (Baileys), no número comercial. O Hound Dog **lê** as conversas,
liga cada número à ficha e pede a leitura do Claude quando um lead responde. **Envio é sempre
aprovado por você**, uma mensagem por vez, com ritmo humano e limite por hora. Não existe
disparo em massa nem resposta automática — é a doutrina da casa e é o que protege o número.

Para conectar: Conversas → *Conectar WhatsApp* → leia o QR no celular (ou use o código de
pareamento). A sessão fica só no seu PC, em `farejador/.wa-auth/`.

## O Claude por dentro

- Roda pelo **Claude Code da sua assinatura** (`claude -p`), dentro do repositório da Hórus:
  enxerga `CLAUDE.md`, `_memoria/`, `_conhecimento/network/`, as pastas de cliente.
- Tem as ferramentas do CRM pelo MCP `hound-dog` (`mcp/server.mjs`): criar lead, mover
  estágio, registrar atividade, agendar, salvar negócio e dinheiro, adicionar leads a uma
  lista, salvar pesquisa, ler o playbook e as conversas.
- **Qualquer sessão do Claude Code no HorusOS** também tem essas ferramentas (o servidor
  está no `.mcp.json`), então o CRM se mantém atualizado enquanto você trabalha no repo.
- Travas: no painel ele não escreve em arquivo do repositório (só lê) e não roda comando.

## Arquivos

```
ferramentas/hound-dog/
├── app/                 painel publicado na Vercel (HTML/CSS/JS, sem build)
│   ├── js/telas/        uma tela por arquivo
│   ├── js/score.js      régua de pontuação e leitura de planilha (usada no painel e no Node)
│   └── api/             funções: checar site, ler planilha publicada
├── farejador/           o programa do seu PC (fila, Claude, WhatsApp, Instagram, lembretes)
├── mcp/server.mjs       ferramentas do CRM para o Claude
├── lib/                 banco, CRM (regras compartilhadas), operadores
├── scripts/             migrar, semear dados reais, criar operador, testar acesso
├── supabase/            o esquema do banco em SQL (idempotente)
└── .segredos/           senha do banco, acessos (NUNCA versionado)
```

## Comandos

```bash
npm run migrar                 # aplica o esquema (supabase/*.sql)
npm run semear                 # recarrega a carteira real a partir das pastas de cliente
npm run farejador              # liga o Farejador
node scripts/criar-operador.mjs --email x@y --nome "Nome" --papel operador
node scripts/testar-acesso.mjs # confere login e RLS
cd app && npx vercel deploy --prod --yes   # publica o painel
```

## Limites honestos

- **Instagram**: desde 2025 exige login para leitura de fora. Caminhos: API oficial (conta
  profissional + token, em Ajustes), registro manual, ou pedir ao Claude com o navegador
  aberto. A coleta automática só volta com a API oficial.
- **Vercel Hobby** é oficialmente não-comercial. Para uso comercial contínuo: Pro (US$ 20/mês)
  ou mover para Netlify/Cloudflare Pages (o painel é estático, a migração é simples).
- **WhatsApp por Baileys** não é a API oficial: serve para o número comercial da Hórus com
  ritmo humano. Base grande ou cliente regulado pede a API oficial da Meta.
- O Farejador só trabalha com o **PC ligado**. O que você pedir enquanto ele estiver offline
  fica na fila e roda quando ele voltar.
