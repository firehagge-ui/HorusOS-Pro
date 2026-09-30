# Card — O serviço de CRM + WhatsApp (sistema, hospedagem, preço, trâmite)

> **Fonte:** oráculo do network (NotebookLM, 4 grupos), 29/09/2026, pergunta do Marcelo sobre o serviço
> inteiro. ⚠️ O oráculo **não viu os arquivos da casa** (Pronto, recorrência, Conselho, Icarus): respondeu
> só com a comunidade. Preço da Meta **conferido** em duas fontes independentes no mesmo dia.
> **Confiança:** ALTA pra hospedagem, faixa de preço e contrato (bate com `recorrencia-e-pos-venda.md`,
> `hospedagem-sistemas.md` e `ferramentas/pronto.md`) · MÉDIA pra custo de BSP (preço de fornecedor, muda) ·
> BAIXA pra margem (a conta dele inclui IA que a nossa oferta não usa e ignora hora de trabalho).
> Referência de mercado, não meta nem promessa. Nada daqui vai pra peça de cliente.

## O que o oráculo trouxe e serve

- **CRM:** o caminho da comunidade é base open-source adaptada (Next.js + Supabase, frappe/crm) em vez de
  Kommo (instável, suporte ruim) ou CRM de prateleira (engessado). **O Pronto já é isso** (Next.js +
  Supabase, MIT, no ar desde 09/09): agenda, ficha de cliente e mensagens pela API oficial da Meta
  (confirmação, lembrete 24h e 1h, agradecimento com link pra remarcar, reativação de 30 dias, aniversário).
- **O que falta construir no Pronto**, nos termos do oráculo:
  - **Lista de espera** (Bioclin): fila por procedimento e data, status "aguardando vaga / encaixado /
    desistiu", gatilho que avisa a próxima da fila quando um horário é cancelado.
  - **Retorno de orçamento** (Talina): etapas "orçamento enviado → aguardando → retorno 1 → ganho/perdido",
    contador de dias sem resposta, botão pra recepção assumir a conversa.
- **Hospedagem:** VPS com **Coolify** pra carteira inteira (uma "Vercel própria"), não Vercel. Converge com
  `ferramentas/pronto.md` (VPS de R$ 30 a 70 por mês, Coolify grátis). Vercel Hobby é não comercial.
- **WhatsApp no número do cliente: Coexistence.** API oficial da Meta por um provedor (BSP) **sem o cliente
  perder o app do WhatsApp Business no celular**. Preços citados: 360dialog ~€ 50/mês, Stevo ~R$ 59 por
  instância (preço de fornecedor, conferir antes de orçar).
- **Faixa de preço da comunidade:** implantação R$ 2.500 a 5.000; mensalidade R$ 300 a 800. Bate com o card
  de recorrência (R$ 2.500 a 5.000 e R$ 250 a 800).
- **Contrato:** permanência mínima de 6 a 12 meses com multa, implantação paga no ato.
- **Saída do cliente:** o número e os dados são do cliente; exporta tudo (CSV/SQL), revoga as chaves,
  desliga o container.
- **LGPD e segurança:** banco no Brasil, trocar todas as chaves e senhas padrão antes de dado real,
  isolamento por cliente no banco (RLS), nada de cartão no CRM, consentimento na primeira interação.
- **Travas dele que batem com as nossas:** nada de chip descartável no número do cliente, só canal oficial,
  e rodar os primeiros dias assistido antes de automatizar.

## Conferido pela casa (29/09/2026)

**Preço da Meta no Brasil, por mensagem entregue** (tabela oficial vigente desde 1º/07/2026, lida em dois
levantamentos independentes: dragapp.com e blueticks.co; a página da Meta confirma o modelo por mensagem e a
tabela em BRL):

| Categoria | US$ por mensagem | Onde a nossa oferta cai |
|---|---|---|
| Utilidade | 0,0068 | Confirmação, lembrete 24h e 1h, "abriu um horário" pra quem pediu lista de espera |
| Marketing | 0,0625 (cerca de 9 vezes mais) | Reativação ("faz 45 dias, vamos agendar?"), aniversário, provavelmente o retorno de orçamento |
| Atendimento (resposta dentro da janela) | grátis até 30/09/2026; **a partir de 1º/10/2026, mesmo valor de utilidade** | A clínica respondendo o paciente |

A categoria é definida na aprovação do modelo de mensagem pela Meta, e modelo classificado errado (marketing
disfarçado de utilidade) é reclassificado. Na prática, uma clínica com 300 lembretes e 100 reativações por mês
gasta algo como US$ 2 + US$ 6 em mensagens: não é o custo que pesa, é a hora de trabalho.

## Segunda rodada do oráculo (29/09), conferida na internet

- **Coexistence exige Parceiro de Soluções (BSP) ou Tech Provider.** ✅ Confirmado na documentação da Meta
  (Embedded Signup, "Onboard WhatsApp Business app users": requisito "You must already be a Solution
  Partner or Tech Provider", app do WhatsApp Business 2.24.17 ou maior, webhook funcionando). ⚠️ O oráculo
  disse que virar Tech Provider é "burocrático e demorado"; a Meta informa **revisão do app em ~24 h em
  média**. O custo real de ser Tech Provider é técnico (cadastro embutido, webhook, manutenção), não o prazo.
  Pro primeiro cliente, **BSP** (360dialog, Stevo) é o caminho mais curto; Tech Provider é decisão pra
  quando houver carteira.
- **Aprovação de modelo de mensagem: até 24 h.** ✅ Documentação da Meta ("Template review"). Relatos:
  o primeiro modelo leva mais (~18 h), os seguintes 10 a 15 min.
- **Verificação da empresa: o oráculo disse 20 a 30 dias.** ❌ Exagerado. Pela Meta, a verificação feita
  por parceiro leva em média 5 minutos (pode levar horas); relatos de verificação direta vão de menos de
  1 h a ~10 dias. Contar **até 2 semanas** no cronograma, não um mês.
- **LGPD:** clínica controladora, Hórus operadora, contrato de prestação com anexo de tratamento de dados
  (DPA), assinatura por Gov.br ou ZapSign, e **minimização**: não guardar dado clínico no CRM se o fluxo
  não precisa (lembrete precisa de nome, telefone e horário, não do procedimento). Coerente com o Conselho
  de 28/09 e com a lei (dado de saúde é sensível, art. 11 da LGPD). `[FALTA: modelo de contrato e DPA]`

## O que ainda falta decidir

1. **Se o Pronto funciona com Coexistence via BSP.** O Pronto pede as credenciais da API oficial por
   negócio; com BSP, a integração passa pela API do provedor. `[FALTA: testar]`
4. **Margem de verdade:** a conta dele (74% a 80%) soma IA que a nossa oferta não usa e **não conta as horas**
   de implantação e suporte. Refazer com horas (LTGP do Hormozi: lucro bruto por cliente, não receita).
5. **A demo:** o roteiro dele é de site + formulário + funil de implante (serve pra Cavalcante e Harmony),
   não pras ofertas de WhatsApp (lista de espera, retorno de orçamento, lembrete). A demo de 3 telas
   (celular do paciente, o que acontece quando alguém some, a agenda da dona) continua sendo a nossa.
6. **Compliance:** o roteiro dele diz "mostre que a clínica perde vendas de implante". Em odonto (CFO) isso
   é insinuação de resultado; na reunião, o fato é mostrado e o número sai da boca do dono.

## Nota da casa

- Nenhum serviço de CRM + WhatsApp foi entregue ainda. A oferta em mensagem continua de pé, mas **a demo e
  a troca das chaves do Pronto vêm antes da primeira R1**.
- Retorno de orçamento e lista de espera entram primeiro como **processo manual com modelos prontos** que o
  cliente executa, e viram automação depois do primeiro cliente (Conselho de 28/09).
- Cross-ref: `recorrencia-e-pos-venda.md`, `hospedagem-sistemas.md`, `precificacao-sistemas-web.md`,
  `ferramentas/pronto.md`, `_conselho/logs/2026-09-28-bioclin-equipe-de-marketing-e-outras-dores.md`.
