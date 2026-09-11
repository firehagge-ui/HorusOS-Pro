# Amparo Flores — Floricultura (Graça, Salvador/BA)

> Cliente criado em 27/08/2026 (skill `/novo-projeto`). Pasta dedicada: as regras
> aqui sobrescrevem as da raiz quando forem específicas deste cliente.
> Herda tom de voz, integridade e doutrina de design/conteúdo de `_memoria/` da raiz.

## Sobre

Floricultura tradicional de rua, **mais de 50 anos** ("desde 1972" no Instagram; a
LTDA foi formalizada em 1988). Ponto excelente no Largo da Graça, bairro de renda
alta de Salvador. O produto é bom e a reputação é boa (Google 4,1★, 41 avaliações);
o gargalo é o **caminho até o pedido**, não a flor.

## Tipo

✅ **CLIENTE FECHADO em 03/09/2026** (reunião presencial na loja: Marcelo + sócio + Varo).
Deixou de ser prospecção. O site especulativo cumpriu o papel de peça de venda e foi
aprovado por ele. **Decisão conjunta: o Varo decide junto com a irmã**, não é decisor único.

## Objetivo

Entregar a **Fase 1** (site com o pedido caindo no WhatsApp, R$ 1.200 = R$ 600 + R$ 600,
já acertado com ele), e só depois apresentar a **Fase 2** presencialmente, com valor
próprio. O que move o ponteiro agora não é mais "convencer", é **entregar sem escorregar
no escopo**.

### Onde paramos (10/09/2026) — reengajado, aguardando ele marcar o início

O "sim" da reunião de 03/09 seguiu **verbal**; a entrada (R$ 600) ainda **não caiu**, então
ainda não é cash collected ^[_conselho/logs/2026-09-10-amparo-flores-insistir-ou-cortar.md].
De 05 a 09/09 o Varo sumiu (4-5 dias sem resposta), inclusive a duas cobranças de Pix no
grupo. O `/conselho` de 10/09 recomendou sair do grupo e reabrir por mensagem privada, sem
cobrar dinheiro — feito às 11:03 de 10/09 (mensagem calma, sem pressão, oferecendo repensar
ou ajustar prazo). **Ele respondeu no mesmo dia (13:35): "Vamos fazer sim, eu te falo quando
devemos começar."** Confirma a leitura do Advogado do Diabo: o silêncio era decisor duplo
(Varo + irmã) se alinhando, não recusa.

**Estado atual: reengajado, sem pressionar.** Ele assumiu avisar quando começar — deixar o
ritmo com ele, sem cobrar entrada nem prazo agora. Se ele não voltar a falar em alguns dias,
toque leve, sem cobrança de Pix. Quando ele sinalizar início, retomar o pedido da entrada
(oferecer cartão parcelado se hesitar no valor à vista).

## Entregas previstas

**Fase 1 (em produção, valor já acertado):**
- Site loja com pedido montado no site que vira mensagem pronta no WhatsApp ✅ construído
- Página sóbria de coroa/luto ✅ construída
- Domínio próprio `.com.br` (~R$ 40/ano, **registrar no nome do cliente**)

**Fase 2 (a propor presencialmente, valor NÃO comunicado):**
- Checkout com pagamento no site (InfinitePay)
- Painel/CRM com estoque e status de pedido
- Funil de recompra por data
- Agente de atendimento **por botões** (decisão travada: não é IA)
- Cálculo de frete

**Fases posteriores:** conteúdo, tráfego nas datas, assinatura B2B da Graça.

## Onde salvar o que

- `briefing.md` — dossiê completo do cliente (fonte de verdade dos fatos)
- `marca.md` — identidade visual do site
- `site/` — o site (catálogo + luto + contato)
- O roteiro de reunião e o log do Conselho vivem no checkout principal
  (`reuniao-27-08-2026.md` e `_conselho/logs/2026-08-27-amparo-flores-oferta.md`)

## Contexto que herda da raiz

Tom de voz, marca da agência e contexto do negócio vêm de `_memoria/` e `identidade/`.
**Antes de qualquer HTML**, ler `_memoria/design/` (00-anatomia, 90-antipadroes,
99-checklist, 50-copy, 60-motion) e `_memoria/integridade.md`. Não duplicar aqui.

## Específico deste cliente (regras que travam)

- 🔴 **Foto real, nunca banco de imagem.** As flores dele são o produto. Flor genérica
  de stock é o que grita "template pronto" num site de floricultura. Enquanto não
  houver acervo real, usar **placeholder marcado**, nunca stock plausível.
- 🔴 **Não é setor regulado por conselho, mas valem as regras de alimento/comércio:**
  sem promessa de resultado, sem superlativo ("a melhor", "nº 1"), sem "entrega em 1
  hora" copiado dos intermediários se a operação dele não sustenta.
- 🔴 **Página de luto é sóbria:** sem promoção, sem emoji, sem "aproveite". Preço
  visível e telefone/WhatsApp grande — nessa hora ninguém quer conversar.
- 🔴 **LGPD:** qualquer formulário/cadastro (ex.: CRM de datas) exige consentimento
  explícito.
- Dados que só o cliente tem (cemitérios atendidos, acervo em alta, nome da irmã)
  entram como `[FALTA: ...]`, nunca inventados. **Nunca presumir dígito de telefone**:
  foi assim que o número errado entrou no site inteiro e ficou lá por uma semana.
- 🔴 **WhatsApp de pedidos: (71) 9118-8740** → `wa.me/557191188740`, com 8 dígitos.
  Se aparecer `99118-8740` em qualquer lugar, é o erro antigo e está errado.

### Travas técnicas da Fase 2 (definidas em 03/09/2026)

- 🔴 **Trava legal de MEI:** a Hórus **não pode** integrar emissão fiscal (SEFAZ)
  automatizada para terceiro. O escopo fica em **controle logístico e interno**, nunca
  fiscal. Se ele pedir nota fiscal automática, orientar a usar sistema de mercado.
- 🔴 **Nada de bot rodando dentro do número dele** via API não oficial (Evolution, Waha,
  UAZAPI): o risco de banimento do WhatsApp principal de um negócio de 50 anos é
  inaceitável. O caminho é a **lógica invertida** (o pedido nasce no site e vira link
  `wa.me` pré-formatado), que é o que o site já faz, com custo e risco zero.
- 🔴 **Estoque de flor não é estoque de mercado.** Nada de controle de validade por XML,
  alerta de 60 dias ou pesagem: isso é doutrina de alimento e não se aplica. Aqui é baixa
  simples ao vender + alerta de estoque mínimo + status do pedido (novo/em produção/entregue).
- 🔴 **O agente é de botões, não IA.** Menu guiado. Não prometer conversa fluida.
- 🔴 **Plataforma pronta, não sistema custom** (decisão do Marcelo, 03/09).
- 🔴 **Valor da Fase 2 não vai por WhatsApp.** Projeto acima de R$ 2.000 se apresenta
  presencialmente. Referência de mercado em `_conhecimento/network/`.
