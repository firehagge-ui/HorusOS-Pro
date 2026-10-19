# Card: contrato de site e de mensalidade (CPF, desistência, ajustes, garantia, fidelidade)

> **Fonte:** grupos de network do Marcelo, via Q&A do NotebookLM (perguntas 36 a 40 de `_gestao/perguntas-oraculo.md`)
> · **primeira gravação:** 16/10/2026 · **origem:** fechamento do contrato padrão da casa (`templates/contrato-padrao.md`).
> **Confiança: ALTA** para prática de mercado (50/50, rodadas, garantia, aviso de 30 dias) · **MÉDIA** para a parte
> jurídica (CDC, validade de multa, MEI): é o que a rede diz, não parecer de advogado. Conferir antes de usar.
> ⚠️ Referência de mercado, **não meta e não promessa**. Nada aqui vai para peça de cliente.
> Complementa `cobranca-e-protecao-comercial.md` (cliente-fantasma) e `precificacao-sistemas-web.md` (preço e 50/50).

---

## 1. Contrato no CPF antes do CNPJ
- Vale. Contrato entre pessoa física (quem presta) e empresa (cliente) é normal; assinatura digital pelo Gov.br,
  ZapSign ou Autentique dá validade.
- Cobrança no CPF por link (InfinitePay, Asaas): Pix, cartão parcelado.
- **Cliente que exige nota antes de a empresa existir:** a rede abre MEI no mesmo dia, ou avisa com transparência que
  a nota sai quando o registro concluir.
- 🔴 **Leitura da casa:** a Horus tem **dois sócios**, e MEI não aceita sócio; a rede também diz que web design e
  programação não têm CNAE de MEI (quem usa MEI usa CNAE correlato, o que é gambiarra). O caminho da Horus é ME no
  Simples, com o Fator R para cair no Anexo III (a rede cita 6% de partida). Tudo isso é pergunta para o contador,
  não decisão por card. Nunca prometer nota que não existe.

## 2. Desistência no meio do site
- Consenso: **a entrada não volta** depois de o trabalho começar; ela é reserva de agenda e paga a fase inicial.
- Desistiu com o projeto adiantado: cobra-se **por etapa concluída**. Divisão citada: briefing e estrutura 20%, layout
  30%, desenvolvimento 30%, publicação 20%.
- **Arrependimento de 7 dias (art. 49 do CDC)** em contratação a distância: a rede põe no contrato que, autorizado o
  início imediato, as horas já feitas se descontam do que for devolvido.
- **Cliente empresa (2ª rodada, 16/10):** em regra o art. 49 **não vale** entre empresas. Site, CRM e marketing são
  insumo do negócio, e vale o Código Civil. Exceção: o STJ (teoria finalista mitigada) pode tratar a microempresa como
  consumidora quando ela é **vulnerável** (técnica, econômica ou jurídica). A rede põe no contrato uma cláusula
  dizendo que a relação é empresarial. Cliente **pessoa física**: o art. 49 vale inteiro. Leitura da casa: muito
  cliente da Horus é pequeno e leigo, então a cláusula ajuda mas não blinda; a proteção real é rescisão por etapa,
  aprovação registrada e o aceite assinado no CNPJ sempre que existir.
- 🔴 **Nunca expor o cliente** ("site suspenso por calote" dá processo por danos morais). Em atraso: suspender a
  publicação no próprio ambiente, registrar tudo por escrito, frieza profissional.
- Caso relatado de quem entregou 100% sem contrato e o cliente pediu reembolso: o contrato existe para esse dia.

## 3. Rodadas de ajuste e mudança depois de aprovar
- Padrão: **1 a 2 rodadas por etapa**, cada uma com uma **lista única** de ajustes, e prazo de 5 dias úteis para o
  cliente responder; silêncio vale aprovação (aceite tácito).
- Aprovou, **congelou**. Mudança depois vira aditivo (*change request*): orçamento e prazo antes de executar, dito com
  cortesia e com a data da aprovação na mão.
- Preço de ajuste avulso citado: R$ 30 a 50 por alteração simples; R$ 150 a 200 em site antigo; página nova R$ 200 a
  500+; hora técnica R$ 80 a 100. A maioria prefere empurrar isso para o plano mensal, com cota (ex.: até 4 pequenas
  alterações por mês).

## 4. Garantia depois da entrega
- **15 a 30 dias** de garantia técnica a partir da publicação, só para defeito do que estava no escopo.
- A briga some quando a regra está escrita: **erro** é o que estava no escopo e não funciona; **pedido novo** é
  página, função, troca de algo já aprovado ou mudança na regra do negócio do cliente.
- Ambiente de teste (homologação) antes de publicar ajuda a congelar o aprovado. Na casa, o esboço na Vercel já faz
  esse papel.
- Depois da garantia: mensalidade (R$ 147 a 300/mês na rede, com cota de ajustes) ou orçamento avulso.

## 5. Fidelidade na mensalidade
- Janelas usadas: **3 meses** (tráfego, onboarding de CRM: 30 dias não otimizam nada), **6 meses** (site + CRM +
  tráfego ou redes, R$ 1.000 a 1.500/mês citados), **12 meses** (pacotes maiores, R$ 2.000 a 2.500/mês citados).
- **Aviso de 30 dias** é regra geral.
- **Multa de fidelidade só se sustenta com benefício real ao cliente** (ex.: implantação diluída ou com desconto).
  Multa sem contrapartida tende a ser abusiva.
- Como não parecer amarra: (a) **implantação diluída** (o cliente não paga a implantação cheia à vista e, em troca,
  fica o período); (b) contrato-mestre + anexo de escopo, com a cota do mês escrita; (c) explicar a curva (mês 1
  monta, mês 2 ajusta, mês 3 colhe); (d) com objeção forte, começar mês a mês e provar valor em 30 a 60 dias.

## 6. O que a casa adotou (16/10/2026)
Entrou no contrato padrão: lista única por rodada (3.3), erro × pedido novo (5.4), implantação diluída como cláusula
opcional (6.6, sem ela não há multa), etapas com percentual na rescisão (13.2), aviso de arrependimento (13.5, a
confirmar com advogado), nunca expor o cliente (13.6). **Ficou como estava:** 2 rodadas, 30 dias de garantia, mínimo
de 3 meses sem multa, CPF do Marcelo até o CNPJ.
