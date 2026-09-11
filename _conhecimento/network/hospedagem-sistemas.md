# Onde e como a rede hospeda CRM e sistema web

> Card do oráculo (NotebookLM, 4 grupos). Extraído em 05/09/2026, na esteira do teste do
> Pronto (ver `ferramentas/pronto.md`). **Selo de confiança: média-alta.** É prática real
> de rede brasileira que vive disso, então vale como régua; mas "aguenta fluxo maior" e as
> comissões citadas são referência, não garantia. Nomes de serviço são públicos; nenhum
> nome de pessoa ou frase de membro foi colado (regra da pasta).

## O princípio que atravessa tudo

**Hospedagem compartilhada simples não roda CRM.** Sistema com banco de dados ativo e
integrações precisa de servidor de verdade (VPS) ou de uma stack serverless (Vercel +
Supabase). Isso confirma a doutrina da casa: colocar sistema no ar **não é publicar um
site** — é operar infraestrutura, e por isso vira mensalidade e suporte (ver o card de
memória `project_software-hospedavel` e o `precificacao-sistemas-web.md`).

## Os quatro caminhos (do mais "na mão" ao mais "terceirizado")

### 1. VPS dedicada — para sistema robusto
Servidor virtual privado, o mais citado da rede.
- **Hostinger** é a favorita; os planos lembrados são **KVM 2** e **KVM 4** (o KVM 4 para
  fluxo maior de dados/requisições).
- Alternativas: **Contabo** (apontada como melhor custo-benefício em hardware),
  **Hetzner**, DigitalOcean, Vultr, Railway, Render.
- **Oracle Cloud** tem free tier generoso (VM de até ~12 GB RAM), mas a liberação da conta
  exige paciência. Bom para laboratório, arriscado para produção de cliente.

### 2. Docker + Coolify — para atender vários clientes barato ⭐ (o pulo do gato)
Não se contrata uma VPS por cliente (inviável). Empacota cada sistema em **container
Docker** e roda **3–4 CRMs de clientes isolados numa VPS só**, derrubando o custo por
cliente. O **Coolify** é o orquestrador queridinho: funciona como uma "Vercel própria"
instalada na VPS, organizando apps, bancos e painéis por projeto de forma visual.
→ **Este é o caminho de escala da Hórus** se o CRM (Pronto ou outro) virar produto: uma
VPS + Coolify hospeda a carteira inteira, com custo fixo diluído entre os clientes.

### 3. Vercel + Supabase — para CRM sob medida e começo grátis ⭐ (o do nosso teste)
Para CRM próprio em Next.js: **Vercel/Netlify/Cloudflare Pages** hospedam o painel de
graça, e o **Supabase** é o Postgres + autenticação + permissões, com free tier de ~500 MB
de banco. Dá para pôr no ar **sem custo inicial de infra**.
→ **É exatamente a stack do Pronto** (Next.js + Supabase). Para **um** cliente, é o caminho
mais rápido e barato de sair do teste para o ar. Some o teto do free tier: 500 MB e limites
de projeto pausado por inatividade — para vários clientes, ou some para o caminho 2, ou
paga o tier do Supabase por cliente.

### 4. Open-source hospedado por terceiro, ou SaaS de afiliado — infra zero
- **Frappe Cloud:** a própria Frappe hospeda o Frappe CRM por valor baixo — evita
  configurar servidor do zero. Bom se o cliente exigir Frappe.
- **SaaS pronto (Kommo, GoHighLevel):** algumas agências **não cuidam de infra nenhuma** —
  só configuram/indicam um sistema de mercado e faturam **comissão recorrente (citada até
  ~50%)**. "Libertador", nas palavras da rede. Troca margem e controle por zero dor de
  cabeça técnica.

## Como isso decide a Fase 2 da Amparo (e os próximos)

| Cenário | Caminho indicado |
|---|---|
| Testar / 1 cliente, começo grátis | **3 — Vercel + Supabase** (é o que o Pronto já usa) |
| Carteira de vários clientes, custo diluído | **2 — VPS + Coolify + Docker** |
| Cliente quer Frappe e zero setup | **4 — Frappe Cloud** |
| Não quer operar NADA, aceita margem menor | **4 — Kommo/GoHighLevel por comissão** |

⚠️ **A escolha entre "operar infra própria" (2/3) e "terceirizar" (4) é decisão de
`/conselho`** (financeiro + operações): operar dá margem e controle mas cria um 0800
técnico permanente; terceirizar liberta a operação mas entrega o cliente e corta a margem.
Não é decisão de gosto, é de modelo de negócio.

Relacionado: `precificacao-sistemas-web.md`, `ferramentas/pronto.md`,
`_memoria/` → `project_software-hospedavel`.
