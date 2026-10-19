# Medição e atendimento: onde o resultado é decidido

> Fonte: `_memoria/trafego/fontes/relatorio.md`, seções 5 e 6 (Central de Ajuda da Meta, Meta for
> Developers, Opinion Box 2025, HBR 2011, Velocify, EightX, Tintim, gui.marketing).

---

## 1. Funil de três degraus

1. **Conversa iniciada** (o que o Gerenciador conta: quem escreveu pela 1ª vez ou depois de 7 dias,
   inclusive curioso).
2. **Orçamento qualificado** (mandou o modelo/serviço e recebeu preço).
3. **Venda feita** (no WhatsApp ou no balcão, com origem no anúncio).

Anúncio de clique pro WhatsApp **não aceita UTM** e o pixel só vê clique e impressão. Medir é tarefa
nossa.

## 2. Escada de medição (do caderno à API)

| Degrau | O quê | Custo |
|---|---|---|
| **Grátis (sempre)** | Link `wa.me` com texto pronto e um código por canal (ex.: "[G1]" na ficha do Google, "[IG1]" na bio); **mensagem pronta diferente por anúncio**; etiqueta de origem e de etapa em toda conversa (as **padrão** da Meta, ver `10-meta-whatsapp.md` §3); pergunta fixa "como nos achou?" no WhatsApp e no balcão; **planilha** (data, origem, modelo, serviço, valor orçado, status, valor fechado) | Zero |
| **Ferramenta simples** | **Tintim**: liga no app por QR code ou na API, atribui cada conversa a campanha/conjunto/anúncio, detecta venda e devolve ao Meta e ao Google | R$ 197 a 297/mês (preço conferido no site). Com verba de R$ 900, é 22% da mídia: só compensa com verba maior. ⚠️ Conexão por QR code não é a API oficial: conferir risco de bloqueio do número |
| **Avançado** | **Coexistência** (mesmo número no app e na API oficial, desde mai/2025) + `ctwa_clid` guardado + API de Conversões pra mensagens; venda de balcão casada pelo telefone vai pela API de Conversões comum (a de conversões offline foi desligada em 14/05/2025) | É o desenho do serviço de CRM + WhatsApp da Hórus (ainda não entregue a ninguém) |

**Preço do WhatsApp (out/2026):** quem atende pelo **app** não paga mensagem e não é afetado. Na API:
cobrança por mensagem desde 01/07/2025; desde 01/10/2026 a resposta de atendimento também é cobrada
depois de 1.000 grátis/mês por número. Janela grátis aberta por anúncio: as páginas da Meta dizem "até
7 dias" e 72 h; **planejar com 72 h**. Acompanhamento depois da janela custa modelo pago na API e nada
no app.

## 3. As contas que decidem (fazer antes de propor)

- **Margem de contribuição** = preço − material − taxa de cartão − mão de obra direta (antes de custo
  fixo e mídia). Usar margem bruta subestima o equilíbrio.
- **ROAS de equilíbrio** = 1 ÷ margem de contribuição (%).
- **CPA máximo** = margem de contribuição por venda.
- **Custo máximo por conversa** = CPA máximo × taxa de conversa que vira venda.
- Exemplo **hipotético** do relatório: ticket R$ 600, material e taxa R$ 240, margem R$ 360 (60%) →
  ROAS de equilíbrio 1,67; CPA máximo R$ 360; com 1 venda a cada 8 conversas, a conversa pode custar
  até R$ 45.
- Serviço de baixa recompra (película): contar só a margem da primeira venda; indicação entra depois,
  medida com etiqueta própria.
- **Regra de parada (combinar por escrito antes de começar):** no dia 30, se o custo de mídia por
  venda passar do CPA máximo, a verba pausa e fica só o que é grátis até ajustar oferta e criativo.

## 4. Resposta e acompanhamento

- **Velocidade:** o efeito é sólido, a magnitude não. HBR 2011 (2.241 empresas): contato em até 1 h
  teve ~7x mais chance de qualificar. O "100x em 5 minutos" é de um estudo de 2007 com seis empresas.
  **Não citar multiplicador em proposta.** Os "63% esperam resposta em 5 min" e "40% desistem em 10
  min" que circulam não têm pesquisa original: não usar.
- **Brasil (Opinion Box, jun/2025, 1.126 pessoas):** 82% falam com empresa pelo WhatsApp, 60% já
  compraram por ele, **59% não gostam de resposta automática**, 18% bloqueiam quem manda mensagem sem
  ter sido chamado.
- **Expectativa (Opinion Box com CX Brain, mai/2025, amostra não publicada):** 52% aceitam esperar no
  máximo 1 minuto no WhatsApp; 64% já largaram um atendimento por IA para buscar outro canal. Proporção de
  fora (Workato, mar/2026, 114 empresas B2B dos EUA): quase ninguém responde em 5 minutos. Não existe
  estudo brasileiro com método ligando velocidade no WhatsApp a venda. O multiplicador continua proibido.
- **Regra:** responder com algo útil (faixa de preço + pergunta do modelo) em minutos no horário de
  atendimento; mensagem de ausência fora dele. Saudação automática segura, não substitui a pessoa.
- **Acompanhamento:** o único dado é de ligação (Velocify, ~3,5 milhões de registros): até a 6ª
  tentativa estavam 93% dos que compraram; só 13% dos leads recebiam isso. No WhatsApp, insistência
  gera bloqueio. **Adaptação da casa: 3 a 4 toques** (orçamento por escrito no dia 0; informação nova
  no dia 1; saída fácil entre o dia 3 e 4; depois etiqueta "Perdido" com o motivo). Igual ao
  follow-up programado do Hounder.
- **Áudio x texto:** o brasileiro manda 4x mais áudio que qualquer país, mas >80% preferem texto como
  meio principal. **Áudio explica, o preço vai sempre por escrito.**

## 5. Confirmação e falta (agendamento)

- **Evidência sólida, efeito modesto:** lembrete por SMS aumenta o comparecimento em ~14% relativos e empata
  com ligação, a custo menor (revisão Cochrane, 2013, saúde). Ensaios brasileiros se contradizem (Curitiba,
  78 crianças: falta de ~33% para ~10%; outro, 998 pacientes: sem efeito).
- **Melhor desenho prático:** **confirmação que pede resposta** (ao marcar, com saída fácil para cancelar, e
  um lembrete final), como o assistente de WhatsApp da Secretaria de Saúde do RJ (falta de 43% para 32%, sem
  grupo de comparação).
- **Salão, barbearia, estética:** não há percentual de falta com método no Brasil (15 a 30% é número de
  fornecedor). **Sinal/depósito:** nenhum estudo; a Booksy (fornecedor) fala em 20% menos cancelamentos.
  Decisão do cliente.

## 6. Corresponsabilidade no contrato e no relatório

Os contratos de tráfego do mercado não tratam do atendimento do lead (ex.: modelo da Trafius, abr/2026). A
Horus põe por escrito: **tempo máximo de primeira resposta no horário de atendimento, etiqueta de origem e
etapa no mesmo dia, e informe de venda** (semanal). O relatório mostra o **tempo de primeira resposta**
(amostra) ao lado do custo por conversa. Sem isso, o custo por cliente não é só da campanha.

## 7. IA de atendimento oficial (2026)

- **IA para Empresas no app WhatsApp Business:** chegou ao Brasil em 24/02/2026 (exige o app em português e
  ao menos um item no catálogo; serviço precisa virar item). **Meta Business Agent** (03/06/2026): atende
  WhatsApp, Messenger e Instagram, agenda e qualifica; grátis por enquanto, assinatura anunciada.
- **Na API:** o agente custa US$ 2 por milhão de tokens desde 01/07/2026, **inclusive dentro da janela grátis
  aberta pelo anúncio**.
- **Chatbot de IA de terceiros no WhatsApp:** proibido desde 15/01/2026, **com exceção para números +55**
  (após inquérito do Cade). Interessa ao Icarus; a exceção pode cair.
- **Atribuição:** desde 03/03/2026, conversão de site/loja por clique conta só **clique no link**. Queda de
  "conversões" numa página de agendamento pode não ser piora real.

Fonte das seções 5 a 7 e do item de expectativa: `fontes/reports/Sobral tráfego comercial e captação.md` (19/10/2026).
