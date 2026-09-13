# Card — Operação de agência enxuta e sociedade

> **Fonte:** 4 grupos de network do Marcelo, via Q&A do NotebookLM · **primeira gravação:**
> 12/09/2026.
> **Confiança: ALTA** (relato consistente e repetido entre membros sobre o que funciona e o
> que quebra). ⚠️ Referência, **não meta e não promessa**. Nada aqui vai para peça de cliente.
> Cross-ref: `_gestao/operacao-da-dupla.md` (aplicação à dupla Marcelo/Antônio),
> `_memoria/comercial.md`, `precificacao-sistemas-web.md`.

---

## 1. A divisão que mais funciona: originação × produção

Em dupla, a divisão de maior sucesso é **autonomia total por frente**, pra ninguém sentir que
virou chefe do outro:

- **Sócio comercial (originação):** prospecção, qualificação, reunião de diagnóstico (R1) e
  fechamento (R2), relacionamento. Dono da decisão de **como abordar e negociar**.
- **Sócio técnico (produção):** arquitetura, especificação, guiar os agentes de IA que geram
  código e infra. Palavra final sobre **viabilidade técnica e prazo**.

Um é "gerente geral do comercial", o outro "gerente geral do produto". Sem hierarquia de chefe
e subordinado. (É exatamente a divisão Antônio = originação / Marcelo = produção.)

## 2. IA como "chão de fábrica" (o que delegar)

- Geração de código (front, back, banco, integração).
- Ativos visuais e copy (brandkit, páginas, arte, vídeo demo).
- Transcrição e ata de reunião (gravação → briefing e plano automáticos).
- QA e revisão (subagentes que auditam CSS, caçam bug antes da entrega).
- Primeira linha de atendimento (SDR): qualificação e agendamento no WhatsApp.

## 3. O que fica 100% no humano (não se delega)

- Relacionamento, negociação e defesa de preço na reunião ao vivo.
- Arquitetura e decisão estratégica (escopo, spec, guardrails pra IA não alucinar).
- QA final visual e de regra de negócio (o humano é o revisor que aprova a publicação).
- Handoff: quando o agente de IA trava ou o cliente está pronto pra fechar, passa pro humano.
- Segurança e LGPD (isolamento de dados, chaves, senhas).

## 4. Como não virar gargalo operacional

- **Base clonável / white-label:** um CRM ou hub padrão que se clona e configura por cliente
  em 15 a 30 min (só troca API e identidade). (É a lógica do Pronto na casa.)
- **Desenvolvimento orientado a especificação (SDD):** planejar o sistema em arquivos `.md`
  antes de mandar executar, pra a IA não gastar token adivinhando.
- **Paralelismo com git worktrees:** múltiplas branches isoladas, um agente corrige bug numa
  janela enquanto você guia outro em outra.

## 5. Sociedade: o que deu certo × o que quebrou

**Deu certo:**
- Unir tecnologia com **canal de venda / carteira pronta** (o dev se junta a quem tem trânsito
  no nicho; divisão de ganhos, muitas vezes 50/50).
- IA como chão de fábrica, mantendo a estrutura enxuta e a margem alta.
- Parcerias familiares e de **confiança de longa data** (inclusive com parceiro próximo).

**Quebrou:**
- 🔴 **Produto forte sem comercial:** dev que passou anos fazendo sistema excelente e estagnou
  por não ter quem vendesse. (Vale pro Marcelo: produção sozinha não escala sem a boca de
  funil do Antônio.)
- 🔴 **Trabalhar "de boca" sem sinal de entrada:** projeto feito na amizade, sem contrato e sem
  50% de entrada, acaba em prejuízo (o cliente acha caro no fim e some).
- 🔴 **Aceitar escopo gigante sem braço:** vender projeto grande demais pra estrutura de 2
  pessoas gera estresse e falha na entrega.

## 6. Os maiores erros ao escalar (e o que fariam diferente)

- **Delegar/contratar antes de dominar o operacional.** Sem ter rodado o serviço na mão por
  ~1 mês, o dono não sabe avaliar entrega nem margem. → Rodar na raça primeiro, depois desenhar
  a vaga.
- **Contratar (SDR, dev) sem processo documentado.** Gera desgaste. → Documentar e padronizar
  tudo antes; usar IA como chão de fábrica em vez de inchar o time humano.
- **Aceitar projeto gigante (R$ 40k a 100k) e virar "CLT do cliente".** → Focar em projeto
  menor de alto valor (R$ 2,5k a 10k) e implementação rápida, com estrutura pronta/open-source
  e custo de servidor repassado ao cliente.
- **Escalar trocando tempo por dinheiro.** → Vender solução/produto pronto ("funcionário
  digital"), não hora de serviço.

## Nota da casa (encaixe)

- Confirma a doutrina de **oferta em fases** e projetos de ticket R$ 1,2k a ~10k (não escopo
  gigante), e a regra de **50% de entrada antes de abrir o PC** (`cobranca-e-protecao-comercial.md`).
- A aplicação concreta à dupla (papéis, teste de 90 dias, como trabalhar junto) fica em
  `_gestao/operacao-da-dupla.md`, que é interno e fora do Git.
