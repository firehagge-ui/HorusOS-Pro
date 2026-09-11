# Pronto — CRM open-source (teste / POC interno)

> Nota fina versionada. O código rodável fica em `ferramentas/pronto-app/`
> (gitignorado — 2 MB de terceiro, com `.env` de chaves). Aqui fica só a decisão,
> o como-rodar e o que aprendemos. Segue o padrão do impeccable e do cannonball.

## O que é e por que está aqui

`SGrappelli/pronto` — gestão para negócio de serviço e loja: **POS + CRM + Inventário
+ Agenda + Notificações**, Next.js 16 + Supabase (Postgres), licença MIT limpa.

Trazido em **04/09/2026** como **teste interno** a pedido do Marcelo: montar um CRM de
verdade rodando, ver como fica, e aprender para os próximos clientes. **Não é entrega
hospedada** para cliente ainda — quando virar oferta paga, a decisão de subir passa pelo
`/conselho` (financeiro + operações), porque **hospedar = virar suporte técnico com
mensalidade** (ver o card de memória `project_software-hospedavel`).

Caso escolhido para popular o teste: **Amparo Flores** (é a Fase 2 dela — CRM com estoque
e funil de recompra por data). Produtos e preços são **reais** (briefing §2.1); os
**clientes são de demonstração** (fictícios, marcados com a tag `demo`), porque não temos
base real e inventar cliente violaria a `integridade.md`.

## Como rodar (sem Docker — só Node)

O `docker-compose` do repo é opcional; as migrations rodam por `node scripts/migrate.js`.
Requisito único: um **Supabase Cloud grátis**.

1. **Supabase:** criar projeto em supabase.com. Em *Authentication → Providers → Email*,
   **desmarcar "Confirm email"**. Em *Storage*, criar um bucket público `inventory`.
2. **`.env`** (em `pronto-app/.env`, já criado no teste): preencher as 4 vars do Supabase
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` — conexão **direta**, porta 5432).
   Os secrets (`CRON_SECRET`, `INTERNAL_API_SECRET`) já foram gerados.
3. **Migrations:** `node scripts/migrate.js` (de dentro de `pronto-app/`).
4. **Subir:** `npm run dev` → http://localhost:3000
5. **Onboarding:** registrar conta (auto-login no modo selfhosted) e criar o business.
6. **Seed Amparo:** `node seed-amparo/seed-amparo.mjs` — ajusta o business (BRL,
   America/Bahia, módulos POS+CRM+Inventário), insere os 23 produtos reais e os 12
   clientes de demonstração. Idempotente (pode rodar de novo).

## Encaixe na Amparo (o que o teste mostra)

- **CRM de datas/recompra** (o eixo 2, o mais valioso): client cards com aniversário,
  tags, histórico de visita, LTV, reativação de quem sumiu há +30 dias. É exatamente o
  funil de recompra da Fase 2.
- **Inventário:** baixa ao vender + alerta de estoque mínimo. ✅ Bate com a trava do
  cliente ("estoque de flor não é estoque de mercado": sem validade/XML/pesagem).
- **POS/Checkout:** venda de balcão com produtos no carrinho.
- **Tags de eixo:** `corporativo` (B2B da Graça), `luto`, `vip`, `recompra`, `casamento`.

## Travas respeitadas no teste (regras do cliente)

- **Notificações desligadas.** Nada de bot/WhatsApp API no número do cliente (risco de ban).
- **Sem módulo de agendamento** (floricultura não é agenda de horário).
- **Sem custo/margem inventado** (`cost_price` fica NULL — não temos o custo real).
- **Clientes fictícios marcados** como `demo` e com nota `[DEMO — dado fictício]`.

## Limites e pendências

- ⚠️ Precisa de **Supabase** (não há SQLite/local sem Docker). Some a dependência externa.
- Analytics avançado e programa de pontos são **cloud-only** (não vêm no self-hosted).
- Se virar produto pago: definir **quem hospeda o Supabase** e o app (custo fixo +
  suporte), e precificar como mensalidade. Isso é decisão de `/conselho`, não deste teste.

## ✅ Rodou de ponta a ponta em 08/09/2026

Supabase real conectado (projeto `srtpesojgcfjcdhsmyeq`), **32 migrations aplicadas**,
conta + business criados por `seed-amparo/setup-conta.mjs` (login `teste.amparo@example.com`),
seed populado (23 produtos reais + 12 clientes demo), **marca aplicada** (`brand_color`
`#5B3A87` roxo + `notification_language` `pt`), e o **`next build` de produção passou limpo
(exit 0)** — prova de que roda na Vercel. `next start` local serviu em `localhost:3000`.
⚠️ As chaves usadas no teste foram coladas num chat: **rotacionar antes de produção real**.

## Deploy na Vercel (validação grátis) — o caminho escolhido pelo Marcelo (08/09)

O código está gitignorado, então o caminho é o **Vercel CLI com deploy direto da pasta**
(não precisa de repo Git):

1. `npm i -g vercel`
2. `vercel login` (abre navegador — ação do Marcelo) **ou** exportar `VERCEL_TOKEN` (o
   Claude deploia com o token, igual às chaves do Supabase).
3. De dentro de `ferramentas/pronto-app/`: `vercel` (cria o projeto) → depois `vercel --prod`.
4. **Env vars na Vercel** (dashboard ou `vercel env add`): as mesmas do `.env` —
   `NEXT_PUBLIC_DEPLOYMENT_MODE=selfhosted`, as 4 do Supabase, `CRON_SECRET`,
   `INTERNAL_API_SECRET`, e `NEXT_PUBLIC_SITE_URL`/`NEXT_PUBLIC_APP_URL` = a URL que a
   Vercel gerar (ex.: `https://amparo-crm.vercel.app`). Lista pronta em
   `pronto-app/seed-amparo/env-vercel.txt` (gitignorado).
5. **Ajuste no Supabase (senão o login quebra):** Dashboard → Authentication → URL
   Configuration → **Site URL** e **Redirect URLs** = a URL da Vercel.
6. `vercel.json` já commitado na pasta fixa a região **`gru1`** (São Paulo, latência BR).

⚠️ **Cláusula honesta (sem surpresa):** o free da Vercel (Hobby) é **oficialmente
não-comercial** (ver `_conhecimento/network/precificacao-sistemas-web.md`). Para o cliente
**validar** (temporário), serve. Para **produção comercial** de verdade: Vercel **Pro**
(US$ 20/mês) ou **Netlify / Cloudflare Pages** (permitem uso comercial no free). Decidir no
`/conselho` junto do modelo de cobrança.

## Docker e Coolify — custo (respondido em 08/09)

- **Docker: não pagamos.** O **Docker Engine** (o que roda numa VPS Linux) é open-source,
  grátis pra qualquer um. O **Docker Desktop** (versão gráfica Windows/Mac) é grátis pra
  uso pessoal e **empresa pequena** (< 250 funcionários **e** < US$ 10M/ano) — a Hórus se
  encaixa. Na VPS a gente usaria o Engine, que é grátis sem ressalva.
- **Coolify: grátis (self-hosted).** É open-source; instala na própria VPS sem licença. Só
  o **Coolify Cloud** (managed, eles hospedam) é pago (~US$ 5/mês) — não é o que usaríamos.
- **O único custo real do caminho VPS+Coolify é a VPS** (Hostinger KVM / Contabo / Hetzner,
  ~R$ 30–70/mês), e ela hospeda a **carteira inteira** em containers isolados, não um por
  cliente. Ver `_conhecimento/network/hospedagem-sistemas.md`.

## ✅ NO AR desde 09/09/2026 — CRM público, login validado

Deploy de produção completo, feito pelo Claude com um Vercel Token do Marcelo (o
`vercel login` interativo travou; o `--temporary` sem login também falhou nesta versão
do CLI — o caminho que funcionou foi `vercel deploy --prod --token <VERCEL_TOKEN>`).

- **URL DE ENTREGA (estável, não muda a cada deploy):** `https://pronto-app-gamma.vercel.app`
  (é o alias de produção. A URL com hash `pronto-<hash>-haggecelo-...` é do deploy específico
  e muda a cada `vercel --prod` — não entregar essa.)
- **Projeto Vercel:** `pronto-app` (conta `haggecelo-yahoocoms-projects`), `prj_tSPmH7nZRrAAdHX8P4k8Kf6Rxfnc`
- ⚠️ **Supabase Auth Config aponta pra URL antiga (com hash):** trocar Site URL + Redirect
  URLs pra `https://pronto-app-gamma.vercel.app` no dashboard do Supabase. Login por senha
  funciona mesmo sem isso, mas a URL estável deve estar lá pra robustez.
- **Login de teste:** `teste.amparo@example.com` / `AmparoTeste2026!` — **validado pelo Marcelo em 09/09**
- Region `gru1` (vercel.json), mas o build correu em `iad1` (Vercel decide onde builda; o
  runtime que importa pra latência é o da region declarada)

**Duas travas que precisaram de ajuste manual do Marcelo (não davam pra automatizar):**
1. **Deployment Protection (Vercel Authentication)** vinha ligada por padrão em todo
   projeto novo → bloqueava qualquer um sem login Vercel, inclusive o cliente. Desligada
   pelo Marcelo em *Project Settings → Deployment Protection*. ⚠️ **Deixa o CRM público
   pra quem tiver o link** — aceitável com dado fictício; religar antes de dado real.
2. **Supabase Auth URL Configuration** (Site URL + Redirect URLs) precisou apontar pra
   URL da Vercel, senão o `/auth/callback` quebra o login. A `service_role key` **não**
   alcança essa config (é Management API/dashboard, não API de banco) — ajuste manual do
   Marcelo, não automatizável com as chaves que temos.

⚠️ **Pendência de segurança em aberto:** as chaves do Supabase (anon, service_role,
DATABASE_URL) e o Vercel Token foram coladas em chat desde 08/09. Antes de qualquer
dado real de cliente entrar: **rotacionar as chaves do Supabase** e **revogar o token**
usado no deploy (`vercel.com/account/tokens`) — ele já cumpriu o papel.

## Checklist de entrega — "100% pra usar" (pedido do Marcelo, 09/09/2026)

⚠️ **Enquadramento comercial:** isto é a **Fase 2 da Amparo**, cujo valor NÃO foi
comunicado ao Varo e deve ser apresentado presencialmente. Deixar 100% pronto é peça de
**fechamento** (mostrar funcionando fecha na reunião — ver `_memoria/comercial.md`), não
autorização pra liberar acesso antes do "sim". Dar a régua de graça repete o padrão de perda.

**✅ Feito pela Hórus (não precisa do Marcelo):**
- App no ar, público, login validado.
- **Painel em português por padrão** (i18n/request.ts default `pt` + auto-detecção do
  navegador). Modificação do fork, reaplicar se re-clonar.
- **Menu e painel respeitam `enabled_modules`** — o repo original mostrava TODOS os itens
  fixos (Agendamentos aparecia mesmo desabilitado). Corrigido no fork: `sidebar.tsx` +
  `app/(dashboard)/layout.tsx` (passa `enabledModules`) e `dashboard/page.tsx` (flag
  `showBookings` esconde o card e o painel de agendamento). Com `['pos','crm','inventory']`
  a Amparo mostra só Painel + PDV + Clientes + Estoque. Reaplicar se re-clonar.
- Marca: `brand_color` roxo `#5B3A87`, moeda BRL, fuso America/Bahia, módulos POS+CRM+Inventário.
- Produtos reais (23) carregados; catálogo pronto.
- `seed-amparo/limpar-demo.mjs`: remove os 12 clientes fictícios num comando, na hora de
  entregar de verdade (mantém os produtos). Rodar quando o Varo for começar a usar.

**🔴 Depende do Marcelo (não automatizável / decisão dele):**
1. **Segurança:** rotacionar chaves do Supabase + revogar o Vercel Token (acima).
2. **Comercial:** fechar o valor da Fase 2 presencialmente ANTES de liberar acesso.
3. **Logo da Amparo em alta** (não temos; o painel mostra só o nome hoje).
4. **Custos reais dos produtos** (`cost_price` está NULL — sem custo, não há relatório de
   margem; o Varo informa se quiser essa parte).
5. **Domínio próprio** (opcional): hoje é URL `.vercel.app`. Um `crm.amparoflores.com.br`
   se aponta na Vercel (Settings → Domains) — mas free da Vercel é não-comercial, então
   domínio próprio + uso comercial pede o plano Pro ou migrar pra Netlify/Cloudflare.
6. **Limpar os dados demo** (`limpar-demo.mjs`) no momento de entregar — decisão de quando.
