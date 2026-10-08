# Números de referência (e quanto vale cada um)

> Fonte: `_memoria/trafego/fontes/relatorio.md`, seção 5, e o card do network
> `_conhecimento/network/trafego-pago-cobranca-e-primeiro-cliente.md`. Câmbio: US$ 1 = R$ 5,1809
> (PTAX 30/09/2026). Todo número de painel está **antes** do imposto da Meta.
> 🔴 **Nenhum número daqui vai pra proposta como previsão.** Serve pra montar cenário e pra saber se a
> conta tem chance de fechar.

---

## 1. A verdade incômoda

**Não existe fonte pública confiável de custo por conversa de clique pro WhatsApp no Brasil**, nem de
taxa de fechamento por WhatsApp em serviço automotivo. Duas fontes dizem isso com todas as letras (CL3,
Kanal). O primeiro mês de cada cliente mede o número real, e ele entra aqui.

## 2. O que existe

| Métrica | Valor | Base | Confiança |
|---|---|---|---|
| CPM Meta Brasil (mediana) | US$ 3,46 (~R$ 18) na média de 12 meses; **US$ 5,96 a 7,45 (~R$ 31 a 39) em mai a jul/2026** | Superads, +US$ 3 bi, todos os setores | Boa pro leilão geral. Usar o de 2026 |
| CPC Meta Brasil | ~US$ 0,20 (~R$ 1,04) | Superads | Boa (clique total) |
| CTR Meta Brasil | 1,70% (0,58% a 3,0% conforme o mês) | Superads | Boa, muito volátil |
| CPM serviço local Brasil | R$ 10 a 22; custo por lead R$ 12 a 40 | Compilação de agência (CL3), 2026 | Fraca |
| Custo por conversa WhatsApp | R$ 3 a 40 conforme o setor | Fornecedor, sem método | Muito fraca |
| Custo por conversa, serviço local (network da casa) | R$ 20 a 40; 15 a 25 conversas/mês com R$ 600 a 650 | Relatos de membros, maioria clínica/estética | Baixa a média |
| Conversa que vira cliente (network) | 5 a 10% | Relatos de membros | Baixa (mesmo número dado pra prospecção fria) |
| Venda por WhatsApp no varejo | 9% (até 40% conforme o segmento) | +400 empresas, dados de 2021 | Média, antiga |
| Google, reparo automotivo (EUA) | CTR 5,56%, CPC US$ 4,35, conversão 15,51%, CPL US$ 29,96 | WordStream, 13.474 campanhas, 2025-26 | Boa só pra proporção |
| Google, automotivo geral (EUA) | Conversão 9,21%, CPL US$ 33,12 | LocalIQ, 1.983 campanhas | Boa só pra proporção |
| Fechamento na ligação, serviços residenciais (EUA) | 45% (busca paga 48%) | Invoca, 70 mi de chamadas, 2026 | Boa, mas é telefone |
| Lead → agendamento em loja de película (EUA) | 25% → 52% com resposta rápida | Caso de agência, sem cliente nomeado | Anedota |

## 3. Como derivar o custo por conversa (enquanto não há dado próprio)

**Custo por conversa = CPM ÷ (1.000 × CTR no link × fração de cliques que vira conversa)**

- CPM R$ 30, CTR 1,2%, metade dos cliques vira conversa → **R$ 5**.
- CPM R$ 40, CTR 0,8%, 35% vira conversa → **R$ 14,30**.
- CTR no link e "clique vira conversa" são **suposições**.

## 4. Cenários de referência (R$ 1.200 de mídia no painel, ~R$ 1.366 no cartão)

| | Pessimista | Base | Otimista |
|---|---|---|---|
| Custo por conversa | R$ 20 | R$ 10 | R$ 6 |
| Conversas no mês | 60 | 120 | 200 |
| Conversa que vira venda | 5% | 10% | 15% |
| Vendas no mês | 3 | 12 | 30 |
| Custo de aquisição por venda (com imposto) | ~R$ 455 | ~R$ 114 | ~R$ 46 |

De 3 a 30 vendas com a mesma verba: **não fixar meta antes de 4 semanas de dado real.** O otimista
provavelmente esbarra na capacidade da loja.

## 5. Imposto da Meta (desde 01/01/2026)

O comunicado oficial fala em "aproximadamente 12,15%" (PIS/Cofins 9,25% + ISS 2,9%), mas os exemplos do
próprio comunicado dão **fator 1,138** (R$ 1.000 de mídia = R$ 1.138,30 na fatura) e, no pré-pago,
R$ 1.000 depositados = R$ 878,50 de mídia. **Usar 1,138 na proposta.** O Gerenciador mostra só a mídia.

| Verba combinada | Se for mídia no painel, o cartão paga | Se for o total pago via PIX, o painel entrega |
|---|---|---|
| R$ 900 | ~R$ 1.024 | ~R$ 791 |
| R$ 1.200 | ~R$ 1.366 | ~R$ 1.054 |
| R$ 1.500 | ~R$ 1.707 | ~R$ 1.318 |

A Meta pode gastar até 75% acima do diário num dia, respeitando a média da semana.
