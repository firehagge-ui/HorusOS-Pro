# Card — Precificação e stack de site, loja, CRM e bot

> **Fonte:** 4 grupos de network do Marcelo, via Q&A do NotebookLM · **primeira gravação:**
> 03/09/2026 · **primeiro uso:** proposta da Amparo Flores (cliente #6).
> **Confiança geral: ALTA para faixas de preço** (são contratos reais fechados por membros
> brasileiros, não benchmark importado) · **MÉDIA para a stack** (viés claro da comunidade
> por construir na unha; ver a ressalva no fim).
> ⚠️ Referência de mercado, **não meta e não promessa**. Nada aqui vai para peça de cliente.

---

## 1. Setup: quanto se cobra pra montar

| O que é | Faixa praticada |
|---|---|
| Loja em plataforma pronta (Nuvemshop, Shopify, WooCommerce), tema + estrutura | **R$ 3.500 a 8.000**, conforme customização visual e volume de produtos a cadastrar |
| Loja em plataforma, projeto de entrada / portfólio | **R$ 1.500** (relato de setup Nuvemshop + Google Meu Negócio + Instagram) |
| Site + CRM + estoque próprio | **R$ 4.000** de implantação |
| Site + CRM + agente | **R$ 5.000** |
| Bot de WhatsApp por fluxo (só a automação) | **R$ 1.500** (simples) a **R$ 3.000** (com integração de agenda/sistema) |
| Combo landing + chatbot + CRM + social | **R$ 4.500** |

**Régua rápida:** projeto de "site + loja + painel/CRM + automação" fica entre
**R$ 4.000 e 10.000**. Abaixo de R$ 4.000, ou o escopo é menor do que se está dizendo, ou
alguém vai trabalhar de graça.

## 2. Recorrência: o que vira mensalidade

| Nível de serviço | Mensalidade |
|---|---|
| Manutenção de entrada (quem está começando) | **R$ 147 a 249/mês** |
| Hospedagem + suporte básico (média de mercado) | **R$ 300 a 400/mês** (custo do servidor + ~50% de margem + a taxa de monitoramento) |
| Licença de uso de sistema com banco próprio (CRM/estoque) | **R$ 250 a 350/mês** |
| Bot ativo com infra e processamento | **R$ 299 a 397/mês** |
| E-commerce com gestão ativa (cadastro de produto, ajuste de layout, relatório) | **R$ 897 a 1.500/mês** |
| Combo com tráfego pago e conteúdo | **R$ 700 a 1.500+/mês** |
| **Se o cliente recusa mensalidade** | **R$ 300/ano**, só pra cobrir domínio e suporte pontual |

**Nota de custo da plataforma:** a assinatura da plataforma (Nuvemshop e afins, ~R$ 100 a
300/mês) é paga pelo cliente **direto para a plataforma**, e isso precisa estar explícito na
proposta pra não parecer que está embutido no seu serviço.

## 3. Como se estrutura o pagamento

- **50% de entrada + 50% na entrega** é o padrão mais citado.
- **Milestones por fase** para projeto maior (ex.: fase 1 visual, fase 2 banco e integração).
- **100% antecipado parcelado no cartão**: o cliente parcela, o profissional saca à vista.
  Preferido por quem já se queimou com cliente que some no meio.
- ⚠️ **Projeto acima de R$ 2.000 não fecha por WhatsApp.** Precisa de call ou presencial,
  porque o cliente precisa ver o valor no detalhe pra não achar caro.

## 4. As três regras de ouro (as mais repetidas)

1. 🔴 **Nunca misturar manutenção/infra com serviço de agência sem contrato explícito de
   escopo.** Sem isso o cliente passa a pedir funcionalidade nova de graça e você vira
   "CLT informal" dele. Esta é a que mais se repetiu nos grupos.
2. 🔴 **Nunca cobrar valor único alto sem atrelar recorrência de suporte.** Projeto avulso
   deixa o sistema órfão e você atendendo de graça pra sempre.
3. 🔴 **Domínio sempre no nome/CNPJ do cliente.** Evita briga de propriedade depois. Truque
   de fechamento usado por vários: embutir os R$ 40 no preço e dar o primeiro ano como
   "bônus".

## 5. Stack e custos reais de infra

| Camada | Escolha | Custo |
|---|---|---|
| Domínio `.com.br` | **registro.br** | **~R$ 40/ano** |
| DNS e proteção | Cloudflare | R$ 0 |
| Frontend / painel | **Vercel**, Netlify ou Cloudflare Pages | R$ 0 (⚠️ o free da Vercel é oficialmente não comercial; Cloudflare Pages e Netlify permitem uso comercial) |
| Banco de dados | **Supabase** (Postgres, realtime) | R$ 0 até 500MB |
| VPS (só se houver n8n/API de WhatsApp) | Hostinger KVM | **R$ 30 a 70/mês** |
| Checkout | **InfinitePay** (sem mensalidade, Pix grátis, débito de 0,75%, crédito à vista de 2,12%) · alternativas: Mercado Pago (Pix 0,99%, D+1), Asaas (bom pra assinatura recorrente), Stripe, AbacatePay | R$ 0/mês, só % por venda |

## 6. Padrões técnicos que valem adotar

- ✅ **"Lógica invertida" (o pulo do gato para pequeno comércio):** o pedido nasce no
  **site**, o carrinho é montado ali, e o botão final gera um link `wa.me` com a mensagem
  pré-formatada. O WhatsApp serve só pra confirmação humana. **Custo de API: zero. Risco de
  banimento: zero.** É exatamente o que o site da Amparo Flores já faz.
- ⚠️ **Bot rodando dentro do número do cliente** via API não oficial (Evolution, Waha,
  UAZAPI) é barato mas tem **risco real de banimento do número**. Para negócio estabelecido
  cujo WhatsApp é o canal de venda, o risco não compensa. A API oficial da Meta é segura mas
  cobra por conversação (R$ 0,03 a 0,35), o que pode inviabilizar volume alto.
- ⚠️ **Não construir CRM do zero.** Consenso forte: é "o maior B.O.". Usar base open-source
  (Frappe CRM, Twenty) ou integrar com o que o cliente já usa.
- 🔴 **Nunca armazenar dado de cartão** no próprio banco. LGPD e complexidade. O gateway
  processa.

## 7. 🔴 Trava legal: MEI não pode emitir fiscal para terceiro

Como **MEI**, não se pode criar sistema de **emissão fiscal integrado ao SEFAZ** para
terceiro. Se o cliente pedir automação de nota fiscal nas vendas dele, o caminho é manter o
escopo em **controle logístico e interno** e orientá-lo a usar sistema de mercado para a
parte fiscal. Isso é compliance **da Hórus**, não do cliente.

## 8. Ressalvas da casa (onde o card NÃO vale)

- **Viés de stack:** os grupos são de gente que constrói na unha, então a recomendação
  default deles é sempre custom (Supabase + Vercel + n8n). Para uma agência de **uma
  pessoa**, plataforma pronta costuma ser mais sustentável, porque a manutenção do motor
  é de outro. Ler o card com esse desconto ^[cargos/operacoes.md] "a agência é pequena".
- **Estoque de perecível ≠ estoque de flor.** Os grupos resolveram estoque para
  supermercado, adega e distribuidora, com controle de validade por XML de nota, alerta de
  60 dias e pesagem física. **Nada disso se aplica a floricultura**: flor não tem lote com
  validade, arranjo é montado sob demanda, e nem sempre há XML. Para floricultura: baixa
  simples ao vender + alerta de estoque mínimo + status do pedido.
- Números de review de concorrente que saem de IA de busca **não são fonte**. Verificar com
  Firecrawl antes de citar a cliente ^[feedback_prospeccao-firecrawl-ads].
