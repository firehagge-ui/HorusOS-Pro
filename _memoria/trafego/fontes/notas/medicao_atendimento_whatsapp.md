# Medição e conversão de leads de tráfego pago quando a venda fecha no WhatsApp ou no balcão (negócio local, Brasil, 2025-2026)

Aplicação de referência: loja de insulfilm automotivo em Salvador, atendimento no WhatsApp Business (app no celular), verba pequena, dono e irmão tocando a operação. Pesquisa feita em 01/10/2026. Onde a fonte é fornecedor ou blog que repete número sem origem, isso está marcado.

## 1. Atribuição para clique-para-WhatsApp e lead local: do simples ao avançado

### Takeaway
O app WhatsApp Business não devolve nenhum evento para a Meta e anúncio de clique-para-WhatsApp não aceita UTM. Por isso a escada é: pergunta de origem + código na mensagem + etiqueta + planilha (custo zero) → ferramenta que lê a conversa e devolve a venda ao Meta/Google (Tintim, a partir de R$197/mês) → API oficial (Cloud API via BSP, hoje possível no mesmo número por Coexistência) com `ctwa_clid` + API de Conversões para Mensagens Comerciais mandando Purchase/LeadSubmitted/QualifiedLead, o que destrava a otimização para compra. Venda de balcão volta pela API de Conversões comum com `action_source=physical_store` (a API Offline antiga morreu em maio de 2025).

### Cited Findings
**Limites do app e do pixel**
- No WhatsApp Business comum o dado não chega ao CRM nem volta para a Meta: o app "não consegue enviar eventos de conversão" ("No WhatsApp Business comum, o dado não chega ao seu CRM"). Só a infraestrutura de webhook da WABA (API) faz isso. Artigo de 03/04/2026 — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- Em anúncio de clique-para-WhatsApp "não existe URL editável para inserir parâmetros UTM"; o pixel registra só clique/impressão; o algoritmo "não sabe distinguir conversa de cliente de conversa de curioso" (03/04/2026) — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- Métodos manuais citados pelo mesmo artigo: "uma pergunta padrão no início de toda conversa" (como nos achou?), etiquetas do WhatsApp Business por origem de campanha e atribuição em planilha (03/04/2026) — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)

**Mensagem pré-preenchida e código por canal**
- Link de clique para conversa: `https://wa.me/<número>?text=<texto codificado em URL>`; o número vai em formato internacional, só dígitos, sem +, espaço ou zero; espaços viram `%20` — [businesschat.io](https://help.businesschat.io/en/articles/6517838-how-to-build-a-whatsapp-click-to-chat-url-wa-me); [u2l.ai, guia wa.me 2026](https://u2l.ai/blog/whatsapp-click-to-chat-link)

**Etiquetas do WhatsApp Business**
- Etiquetas são marcadores coloridos em conversas e contatos e servem para separar por etapa do funil (lead novo, qualificação, proposta, fechado), tipo de produto ou urgência — [Agendor](https://www.agendor.com.br/blog/etiqueta-whatsapp-business/); [SocialHub, guia de etiquetas 2026](https://www.socialhub.pro/blog/etiquetas-whatsapp-business-2026/)

**ctwa_clid e API de Conversões para Mensagens Comerciais (doc da Meta, consultada em 01/10/2026; a página não mostra data)**
- A API de Conversões para Mensagens Comerciais aceita 14 eventos: Purchase, LeadSubmitted, InitiateCheckout, AddToCart, ViewContent, OrderCreated, OrderShipped, OrderDelivered, OrderCanceled, OrderReturned, CartAbandoned, QualifiedLead, RatingProvided, ReviewProvided — [Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging)
- Para WhatsApp os campos obrigatórios são `whatsapp_business_account_id`, `ctwa_clid`, `action_source: "business_messaging"`, `messaging_channel: "whatsapp"` e `dataset_id`, com token que tenha a permissão `whatsapp_business_manage_events` — [Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging)
- Requisito: estar integrado à WhatsApp Business Platform (Cloud API, a recomendada, ou On-Premises). O `ctwa_clid` "is obtained from the referral object under Messages webhook" e precisa ser guardado junto com a conversa — [Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging)
- A API "enables access to purchase optimization for ads that click to Messenger and ads that click to WhatsApp only" (Instagram ainda não) — [Meta for Developers](https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging)
- O objeto `referral` do webhook traz source_id, headline, body e ctwa_clid. Existe também o BSUID (Business Scoped User ID), que identifica o usuário quando o telefone não é exposto (usernames) (03/04/2026) — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)

**Efeito de otimizar para fundo de funil (dado da própria Meta)**
- Campanhas de clique-para-WhatsApp otimizadas para compras por mensagem tiveram custo por compra 10% menor que as otimizadas para conversas (estudo global, 2º semestre de 2024). As otimizadas para leads tiveram custo por lead 24% menor (experimento com 116 mil campanhas, 4 a 10/11/2024). A página fica na biblioteca de recursos do *app* WhatsApp Business, mas não explica como o sinal chega sem API — [WhatsApp Business, recursos](https://whatsappbusiness.com/pt-br/resources/resource-library/down-funnel-optimizations-whatsapp/?lang=pt_BR)

**Venda de balcão e conversão offline**
- A Offline Conversions API foi descontinuada em 14/05/2025 (a última versão suportada foi a Graph API v16.0). Evento offline agora vai pela API de Conversões padrão com `action_source` = `physical_store` (loja) ou `system_generated` (CRM/backend) — [CustomerLabs, guia 2026](https://www.customerlabs.com/blog/facebook-offline-conversions-api-the-complete-guide/); [Jon Loomer](https://www.jonloomer.com/qvt/offline-conversions-api-deprecation-delayed/)

**O que as ferramentas brasileiras fazem**
- Tintim: liga Meta Ads e WhatsApp, rastreia de forma automática campanha, conjunto e anúncio de origem de cada conversa, "lê suas conversas e identifica quando acontece uma venda" e o valor. Conecta o WhatsApp Business ou pessoal por QR code, ou a API oficial; integra com Huggy, RD Conversas, Blip, Kommo e outros; manda dado de cliente para o Meta Ads e gera relatório para importar no Google Ads ("O clique que virou venda no WhatsApp agora volta pro Google Ads") — [tintim.app](https://tintim.app/)
- BSPs com preço de entrada no Brasil, conforme levantamento de 03/04/2026: Umbler Talk R$69/mês (anual), implantação opcional de R$3.000; Aspa Chat R$359; Zenvia a partir de R$40; Blip a partir de R$650 (foco enterprise). A conversa recebida por CTWA é grátis na Meta; o custo real é a assinatura do BSP — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)

### Inferences
- **Escada recomendada para a loja de insulfilm** (síntese minha a partir das fontes acima):
  1. *Grátis, já:* um link `wa.me` com texto pré-preenchido diferente por canal (ex.: "Oi, vim pelo Google [G1]", "vim pelo Instagram [IG1]") na bio, no Perfil da Empresa no Google e no site. Toda conversa nova recebe uma etiqueta de origem e outra de etapa (Novo, Orçou, Agendou, Fechou, Perdido). A pergunta "como nos achou?" fica fixa na resposta rápida. Uma planilha simples registra cada conversa: data, origem, veículo/serviço, valor orçado, status, valor fechado, data do fechamento, venda no balcão sim/não.
  2. *R$197 a R$297/mês:* Tintim por QR code no próprio app, que atribui anúncio a anúncio e devolve a venda ao Meta. Só compensa quando a verba de mídia justificar (ver seção 5).
  3. *Avançado:* Coexistência (app + Cloud API no mesmo número, via BSP), `ctwa_clid` guardado, Purchase/QualifiedLead mandados pela API de Conversões para Mensagens Comerciais e campanha otimizada para compra. A venda de balcão de quem veio do anúncio (casada por telefone) vai como `physical_store` pela CAPI comum.
- O código na mensagem pré-preenchida resolve bem link orgânico, Google e site. No anúncio CTWA, a origem já fica gravada no `referral` quando há API. Sem API, o código digitado no texto inicial do anúncio é a única "UTM" possível (ver Gaps: não confirmei nesta pesquisa se o texto pré-preenchido do CTWA é editável por anúncio no Gerenciador atual).
- A conexão por QR code (tipo WhatsApp Web) não é a API oficial. Antes de recomendar, vale conferir os termos e o risco de bloqueio do número; a API oficial com Coexistência elimina esse risco (hipótese, não verificada).

### Gaps
- Não achei documentação oficial da Meta explicando **como** a otimização para compra/lead funciona para quem usa só o *app* WhatsApp Business (a página de recursos promete o recurso, a doc da CAPI exige Cloud API).
- Não confirmei se o app WhatsApp Business mostra nativamente qual anúncio originou cada conversa, nem se o texto pré-preenchido do CTWA é configurável por anúncio no Gerenciador em 2026.
- Não há dado público sobre o que agências pequenas no Brasil "realmente fazem" (pesquisa ou survey); o que existe é conteúdo de fornecedor.
- Não levantei funcionalidades e preço de Leadster (chatbot de site) nem de Blip em detalhe.

## 2. App WhatsApp Business x Plataforma (API), Coexistência e preços (jul/2025 a out/2026)

### Takeaway
Para uma loja de dois sócios, o **app continua grátis e não é afetado** pelas mudanças de preço. A API passou a cobrar por mensagem em 01/07/2025. A partir de **01/10/2026** a resposta livre de atendimento (service) também passa a ser cobrada, com **1.000 mensagens grátis por número por mês**, e o template de utilidade dentro da janela de 24h deixa de ser grátis. A janela de **72h grátis** aberta por anúncio de clique-para-WhatsApp **continua grátis**. Com a Coexistência (desde maio/2025), dá para ficar no app e ligar a API no mesmo número só para medir.

### Cited Findings
**Modelo por mensagem (desde 01/07/2025)**
- A cobrança passou de por conversa para por mensagem em 01/07/2025: "You are only charged when a template message is delivered". Marketing sempre cobra; utilidade só fora da janela de atendimento; autenticação por faixa de volume — [Meta, pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- As conversas de serviço estavam grátis para todas as empresas desde 01/11/2024 — [Meta, pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- Janela de atendimento (CSW): 24h abertas quando o usuário manda mensagem, com mensagem livre e template de utilidade grátis lá dentro — [Meta, pricing](https://developers.facebook.com/docs/whatsapp/pricing)
- Janela de entrada grátis (FEP): aberta quando o usuário chega por anúncio de clique-para-WhatsApp ou botão de CTA da Página do Facebook, "FEP windows remain open for 72 hours. While open, you can send any type of message to the user at no charge." Vale para quem usa o app de Android/iOS — [Meta, pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)
- Faturamento em reais: desde 01/07/2026, empresas elegíveis com Sold-To Brasil podem criar WABA em BRL, faturada pela Facebook Brasil; o prazo de migração vai até 30/06/2027 — [Meta, pricing](https://developers.facebook.com/docs/whatsapp/pricing)

**Mudança de 01/10/2026**
- A Meta "will charge for service messages, which have not been charged since November 2024" e "will charge on a per-message basis for utility messages sent in response to users within an open 24-hour customer service window" — [Meta, atualizações de preço](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- O que segue grátis: "Messages sent within the 72-hour free entry point window, from Click to WhatsApp Ads or Facebook call-to-action buttons, remain free for message delivery" — [Meta, atualizações de preço](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- Franquia: "Service messages will become chargeable after a monthly allowance of 1,000 delivered messages per business phone number"; a franquia não acumula e o texto cita a doc da Meta (28/09/2026) — [Techweez](https://techweez.com/2026/09/28/whatsapp-business-pricing-october-2026/); a Zenvia (BSP brasileiro) confirma as 1.000 primeiras grátis por mês — [Zenvia](https://zenvia.com/en/new-whatsapp-business-pricing-rules-for-2026/). **Conflito:** na leitura da página da Meta feita nesta pesquisa não apareceu a menção à franquia de 1.000 (pode estar em outra seção).
- Preço por mensagem de serviço no Brasil: US$0,0068 segundo o resumo de busca de vários artigos de set/2026 (EngageLab, Courier, Mixdesk). A página da Meta usa "0.68 cents per message" como exemplo. A Zenvia citava cerca de R$0,04 com valor final a publicar até 01/09/2026. A reação (emoji) segue grátis e fora da franquia — [EngageLab](https://www.engagelab.com/blog/whatsapp-pricing-2026-service-message-cost); [Courier](https://www.courier.com/blog/whatsapp-pricing-changes-october-2026); [Zenvia](https://zenvia.com/en/new-whatsapp-business-pricing-rules-for-2026/)
- O app grátis "Remains free of per-message charges. Costs remain unchanged." — [Zenvia](https://zenvia.com/en/new-whatsapp-business-pricing-rules-for-2026/)
- Agente de IA da Meta (Meta Business Agent): cobrado desde 01/08/2026 a US$2,00 por 1 milhão de tokens; cada mensagem é cobrada como agente ou como serviço, nunca como os dois — [Meta, atualizações de preço](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)

**Coexistência**
- Um mesmo número fica ativo no app WhatsApp Business e na Cloud API ao mesmo tempo, com espelhamento em tempo real por webhook. Lançada pela Meta em maio/2025, segundo os artigos. Sincroniza contatos e o histórico de conversas dos últimos 6 meses. Grupos não sincronizam. Mensagem temporária, lista de transmissão e visualização única podem não funcionar — [Whautomate](https://whautomate.com/whatsapp-coexistence); [YCloud](https://www.ycloud.com/blog/whatsapp-business-app-coexistence-meta-update); [LeadSquared](https://www.leadsquared.com/learn/marketing/whatsapp-coexistence/) (conteúdo de fornecedor; não conferi a doc da Meta sobre Coexistência)
- Na Coexistência o mesmo contato pode aparecer no CRM ora com telefone, ora com BSUID: risco de duplicata — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)

### Inferences
- Para a loja de insulfilm, a mudança de 01/10/2026 quase não pesa: o volume de uma loja pequena tende a ficar abaixo de 1.000 mensagens de serviço por mês, e as conversas de CTWA ficam grátis por 72h. Se migrar para API, o custo real é a assinatura do BSP ou da ferramenta, não a Meta. É estimativa, com o volume real da loja a medir: [FALTA: volume mensal de mensagens enviadas].
- O follow-up de orçamento parado **depois de 72h** (CTWA) ou **24h** (orgânico) exige template pago na API (marketing). No app não existe essa regra, e esse é um argumento para manter o atendimento no app e usar a API (Coexistência) só para medir.
- A mudança de out/2026 pesa mais em quem usa chatbot verborrágico na API, porque cada mensagem livre conta.

### Gaps
- Não consegui ler a tabela oficial de preços em BRL da Meta (a página não entregou a tabela) para confirmar o valor exato de marketing, utilidade e serviço no Brasil.
- Não confirmei na doc oficial da Meta a data de lançamento, as restrições da Coexistência e se os números com Coexistência entram na franquia de 1.000.

## 3. Evidência de velocidade de resposta (speed to lead), global e Brasil/WhatsApp

### Takeaway
A base científica é antiga (2007 e 2011), feita nos EUA, por telefone e formulário web. Ela mostra com consistência que a chance de **contatar e qualificar** cai muito nos primeiros minutos ou na primeira hora. Não achei estudo rigoroso de 2023 a 2026 nem estudo brasileiro com metodologia aberta medindo efeito do tempo de resposta no WhatsApp sobre venda. No Brasil, o que existe com amostra declarada é comportamento (82% falam com empresas no WhatsApp, 59% não gostam de resposta automática). Os números de "x% desistem se não responder em 10 min" circulam sem fonte primária.

### Cited Findings
**Estudos clássicos**
- HBR 2011, "The Short Life of Online Sales Leads" (Oldroyd, McElheran, Elkington): auditoria de 2.241 empresas dos EUA com leads de teste. 37% responderam em até 1h, 16% entre 1h e 24h, 24% em mais de 24h e 23% nunca responderam; tempo médio de 42h entre as que responderam. Quem tentou contato em até 1h teve quase 7 vezes mais chance de qualificar o lead do que quem tentou uma hora depois, e mais de 60 vezes do que quem esperou 24h ou mais (compilação; a página da HBR é paywall) — [AInora, compilação de estudos 2026](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026); [HBR, mar/2011](https://hbr.org/2011/03/the-short-life-of-online-sales-leads)
- Lead Response Management Study (MIT Sloan/InsideSales, Oldroyd, 2007): 6 empresas, mais de 15 mil leads e mais de 100 mil ligações (dados de 2004 a 2007). "The odds of contacting a lead if called in 5 minutes versus 30 minutes drop 100 times. The odds of qualifying a lead ... drop 21 times." Ressalvas: era pré-smartphone, poucas empresas e não mede fechamento — [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)
- Velocify (cerca de 2013, ~3,5 milhões de leads, dado de plataforma de fornecedor): ligar em até 1 minuto aumentou a conversão em 391%. A amostra pende para crédito imobiliário, seguro e educação — [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)
- Drift 2017 (cliente oculto em 433 empresas B2B): só 7% responderam em 5 minutos e 55% não responderam em 5 dias úteis — [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)
- A compilação não encontrou estudo publicado entre 2023 e 2026 que valide ou atualize esses números. Ela alerta que o "100x/21x" é do MIT/InsideSales 2007, não da Harvard, e que as magnitudes valem para cada base de dados, não são universais — [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)
- Circula um estudo de 2025 com mais de 1.300 escritórios de advocacia dos EUA (só 25% responderam formulário em menos de 5 min e cerca de 25% nunca responderam), mas apareceu só em resumo de busca de sites de fornecedor, sem a origem primária identificada — [GreetNow](https://greetnow.com/blog/lead-response-time-statistics) (confiança baixa)

**Brasil e WhatsApp: comportamento com amostra declarada**
- Pesquisa WhatsApp no Brasil, Opinion Box (jun/2025, 1.126 usuários, margem de 2,9 p.p.): 82% já se comunicam com marcas pelo app; 75% para tirar dúvida e pedir informação; 67% para suporte técnico; 60% já compraram produto ou serviço pelo WhatsApp; 59% não gostam de respostas automáticas; 51% aceitam propaganda se deram o número voluntariamente; 18% bloqueiam contato de empresa que mandou mensagem não solicitada antes de ler — [Opinion Box](https://blog.opinionbox.com/pesquisa-whatsapp-no-brasil/)
- Panorama Mobile Time/Opinion Box 2026: 97% abrem o app todos os dias ou quase; 61% várias vezes ao dia; 34% deixam o app aberto o tempo todo (citado por agregadores; o relatório original fica em pesquisas.mobiletime.com.br) — [Unred, estatísticas 2026](https://unred.com.br/blog/estatisticas-whatsapp-brasil); [Mobile Time, download](https://pesquisas.mobiletime.com.br/download/12420/)
- "62% dos consumidores brasileiros já desistiram de uma compra após uma experiência negativa" no WhatsApp, atribuído à Opinion Box 2025. A matéria (05/05/2026) não traz amostra nem método e cita como causas a demora na resposta, a falta de continuidade e a ausência de follow-up — [eMóbile](https://emobile.com.br/site/varejo/62-dos-consumidores-ja-desistiram-de-comprar-no-whatsapp/)

**Brasil: números sem fonte primária encontrada (usar com cautela)**
- "63% dos brasileiros esperam resposta de empresa no WhatsApp em até 5 minutos" e "40% desistem da compra se não houver resposta em 10 minutos", atribuídos a Mobile Time/Opinion Box por vários blogs de fornecedor. Não achei o relatório primário com essas perguntas — [Unred](https://unred.com.br/blog/tempo-de-resposta-whatsapp-brasil); [Maxbot](https://www.maxbot.com.br/blog/tempo-de-resposta-whatsapp)
- Morada.ai (fornecedor de IA para incorporadoras): tempo médio de 5h08 até o primeiro contato com lead imobiliário e 47% dos leads nunca atendidos. Não divulga amostra, período nem método — [Morada.ai](https://morada.ai/blog/tempo-de-resposta-ao-lead-imobiliario/); a ressalva sobre a metodologia aparece em [Mylar Pro](https://www.mylarpro.com.br/blog/tempo-de-resposta-ao-lead-imobiliario)

### Inferences
- O sentido do efeito (responder rápido aumenta contato e qualificação) é robusto entre estudos. A magnitude (21x, 391%) não se transfere para WhatsApp no Brasil e não deve virar promessa a cliente.
- No WhatsApp a conversa é assíncrona e o cliente de insulfilm costuma pedir orçamento de várias lojas ao mesmo tempo (hipótese plausível, não medida). A regra prática defensável é responder com algo útil (preço/faixa + pergunta do modelo do carro) em minutos no horário comercial e ter a mensagem de ausência configurada fora dele.
- Como 59% não gostam de resposta automática (Opinion Box 2025), a saudação automática serve para segurar o lead, não para substituir o humano.

### Gaps
- Nenhum estudo brasileiro com metodologia aberta mede tempo de resposta no WhatsApp contra taxa de fechamento.
- Não localizei a pergunta original da Mobile Time/Opinion Box sobre expectativa de tempo de resposta (o relatório é baixado por cadastro).
- Não há dado de segmento automotivo/estética automotiva.

## 4. Follow-up de orçamento que esfria; uso de áudio e ligação no Brasil

### Takeaway
A melhor evidência quantitativa de cadência é de ligação telefônica nos EUA (Velocify, cerca de 2013): até 6 tentativas capturam 93% dos leads convertidos, e metade dos leads nunca recebe uma segunda tentativa. Para WhatsApp no Brasil não há estudo de cadência. O que há: brasileiro usa muito áudio (envia 4x mais que qualquer país, segundo Zuckerberg), mas a maioria ainda prefere texto como formato principal. Mensagem não solicitada gera bloqueio em 18%.

### Cited Findings
- Velocify, "Ultimate Contact Strategy" (2013, ~3,5 milhões de registros): 93% dos leads convertidos foram alcançados até a 6ª ligação; curva acumulada de 48% após 1 tentativa, 70% após 2 e 81% após 3; cadência ótima de 6 ligações + 5 e-mails; só 13% dos leads receberam algo próximo disso (5 a 7 tentativas); leads que levam 7 ou mais ligações para atender são 45% menos propensos a converter (resumo de busca) — [Velocify via PR Newswire](https://www.prnewswire.com/news-releases/velocify-study-reveals-sales-crm-users-fall-short-in-online-lead-response-270891471.html); [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026) (dado de fornecedor, verticais de crédito, seguro e educação)
- "50% dos leads inbound nunca são contatados uma segunda vez", atribuído à Velocify (resumo de busca) — [Conciergr](https://conciergr.com/blog/follow-up-statistics-sales) (confiança média)
- O brasileiro envia 4 vezes mais mensagens de voz no WhatsApp que qualquer outra população (fala de Mark Zuckerberg) — [CNN Brasil](https://www.cnnbrasil.com.br/tecnologia/brasileiros-sao-os-que-mais-enviam-audios-e-figurinhas-no-whatsapp-diz-mark-zuckerberg/)
- Exame + MindMiners: 56% gostam ou gostam muito de enviar áudio e 57% de receber; mesmo assim, mais de 80% apontam o texto como meio preferencial, 11% o áudio e 3% chamadas — [Exame](https://exame.com/marketing/desculpa-mandar-audio-pesquisa-mostra-como-o-brasileiro-usa-o-whatsapp/)
- Opinion Box 2025: no WhatsApp, 88% usam texto, 80% áudio, 72% chamada de voz e 63% chamada de vídeo; 18% bloqueiam empresa que mandou mensagem não solicitada; 51% aceitam propaganda se deram o número — [Opinion Box](https://blog.opinionbox.com/pesquisa-whatsapp-no-brasil/)
- Na API, o follow-up depois que a janela fecha exige template pago. Pela regra de out/2026 o template de utilidade dentro da janela também passa a ser cobrado — [Meta, atualizações de preço](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- A estatística "80% das vendas exigem 5 follow-ups" circula sem origem primária comprovada; há artigos dedicados a rastrear sua origem — [Stylograph](https://www.stylograph.ai/blog/sales-follow-up-statistics-persistence-gap) (não li o artigo inteiro; não usar o número)

### Inferences
- Cadência defensável para orçamento de insulfilm que ficou sem resposta (adaptação, não estudo): no dia 0, orçamento por escrito + áudio curto opcional; no dia 1, um toque com informação nova (ex.: garantia, agenda livre); entre o dia 3 e o 4, um último toque com saída fácil ("se já resolveu, sem problema"); depois disso, a conversa vai para a etiqueta "Perdido" com o motivo. É o mesmo desenho do follow-up programado do Hounder, que deixa um toque pronto no 4º dia. Três ou quatro toques ficam abaixo das 6 ligações da Velocify porque mensagem insistente gera bloqueio (18%).
- Áudio: bom para explicar diferença de película e criar confiança, mas sempre acompanhado do preço por escrito, já que a maioria prefere texto e o preço precisa ser buscável no chat.
- Ligação: só com permissão ("posso te ligar 2 min?"). Não achei dado brasileiro sobre o efeito da ligação na conversão.

### Gaps
- Não há estudo de cadência de follow-up no WhatsApp (Brasil ou global) com metodologia aberta.
- Não há dado sobre o efeito de áudio x texto na taxa de fechamento.

## 5. Métricas e fórmulas (custo por conversa, CPL qualificado, taxa de fechamento, CAC, ROAS, ROAS de equilíbrio, LTV) e regra de parada

### Takeaway
"Conversa iniciada" da Meta não é lead nem venda: conta quem começou a conversar depois de 7 ou mais dias de inatividade, atribuído ao anúncio. O funil precisa ser medido em três degraus (conversa → lead qualificado/orçamento → venda) e a decisão de manter ou cortar sai do **ROAS de equilíbrio = 1 ÷ margem de contribuição** (não da margem bruta), ou do **CPA máximo = margem de contribuição por venda**.

### Cited Findings
- "Conversas por mensagem iniciadas" conta quantas vezes pessoas começaram a conversar com a empresa depois de pelo menos 7 dias de inatividade, atribuído aos anúncios. A mesma pessoa voltando dentro de 7 dias não conta de novo — [DashThis, métricas Meta](https://help.dashthis.com/meta-ads-metrics-and-dimensions); [ReportGarden](https://support.reportgarden.com/en/articles/5238643-facebook-ads-metrics-and-their-definitions) (definição repetida por terceiros; não li a página de ajuda da Meta)
- ROAS de equilíbrio = 1 ÷ margem de contribuição. Margem de contribuição = receita − custo do produto, frete, taxas de pagamento, devoluções e descontos, antes do custo fixo e antes da mídia. Exemplo: com margem de 40%, o equilíbrio é ROAS 2,5 (ROAS 2,5 empata, não lucra). Usar margem bruta no lugar da margem de contribuição subestima o ponto de equilíbrio — [EightX](https://eightx.co/blog/what-is-roas-defined); [Marketingo](https://marketingo.com/blog/break-even-roas/)
- Para medir ROI de CTWA é preciso cruzar Gerenciador de Anúncios (impressões, cliques, CPC, conversas iniciadas), plataforma de atendimento (tempo de resposta etc.) e vendas — [Zenvia, guia CTWA 2026](https://zenvia.com/blog/como-usar-anuncios-click-to-whatsapp-no-seu-negocio/)

### Inferences
Fórmulas (definições padrão, montadas para o caso):
- **Custo por conversa** = investimento ÷ conversas iniciadas (número do Gerenciador).
- **Custo por lead qualificado (CPLq)** = investimento ÷ conversas que viraram orçamento real (mandou modelo do carro + serviço e recebeu preço). Contado na planilha ou etiqueta, não no Gerenciador.
- **Taxa de qualificação** = leads qualificados ÷ conversas. **Taxa de fechamento** = vendas ÷ leads qualificados. Somar venda de WhatsApp e de balcão quando a origem for o anúncio.
- **CAC (só mídia)** = investimento ÷ clientes novos vindos de anúncio. **CAC cheio** = (mídia + ferramentas, ex. Tintim + horas de atendimento se quiser) ÷ clientes novos.
- **ROAS** = receita atribuída ÷ investimento. **Margem de contribuição por serviço** = preço − película/material − taxa de cartão − comissão/mão de obra direta, se houver.
- **CPA máximo** = margem de contribuição por venda. **Custo máximo por conversa** = CPA máximo × (vendas ÷ conversas).
- **LTV** em serviço de baixa recompra como insulfilm: usar só a margem da primeira venda. Indicação e outro carro da família entram só depois de medidos (etiqueta "indicação de cliente"); não somar no LTV antes disso.
- Exemplo **ilustrativo com números hipotéticos, não da loja**: ticket R$600, material + taxa R$240, margem de contribuição R$360 (60%). ROAS de equilíbrio = 1 ÷ 0,6 = 1,67. CPA máximo = R$360. Com 1 venda a cada 8 conversas, o custo máximo por conversa fica em R$45. Os números reais da loja ficam [FALTA: ticket médio por tipo de película], [FALTA: custo do material por carro], [FALTA: taxa de fechamento atual].
- **Regra de parada** (prática, não achei fonte com metodologia): (a) por anúncio ou conjunto, pausar quando o gasto passar de 2 a 3 vezes o CPA máximo sem nenhuma venda nem orçamento qualificado; (b) no mês, se o custo por conversa ficar acima do custo máximo por conversa por 2 semanas seguidas, mexer em criativo, oferta ou público antes de aumentar a verba; (c) não julgar abaixo de cerca de 20 a 30 conversas por conjunto, porque com amostra pequena a taxa de fechamento é ruído.

### Gaps
- Não achei a página oficial da Meta com a definição atual da métrica nem a janela de atribuição padrão de CTWA em 2026.
- Não há fonte com metodologia para "regra de parada" em negócio local; a regra acima é derivada da aritmética do CPA.
- Não há benchmark público confiável de custo por conversa ou taxa de fechamento para estética automotiva em Salvador.

## 6. Erros comuns de medição

### Takeaway
Os erros que mais distorcem a conta de um negócio local com venda no WhatsApp ou no balcão são: tratar conversa como lead, não registrar a venda de balcão, calcular equilíbrio com margem bruta e confiar em estatística de fornecedor como regra.

### Cited Findings
- Conversa iniciada conta qualquer pessoa que chegou depois de 7 dias de inatividade, inclusive curioso; o algoritmo "não sabe distinguir conversa de cliente de conversa de curioso" se não receber sinal de venda — [DashThis](https://help.dashthis.com/meta-ads-metrics-and-dimensions); [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- CTWA não tem UTM e o pixel só vê clique/impressão — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- Margem bruta no lugar de margem de contribuição subestima o ROAS de equilíbrio — [EightX](https://eightx.co/blog/what-is-roas-defined)
- Integração antiga de conversão offline (Offline Conversions API, Zapier/Segment antigos) parou em maio/2025 — [CustomerLabs](https://www.customerlabs.com/blog/facebook-offline-conversions-api-the-complete-guide/)
- Contato duplicado (telefone x BSUID) com Coexistência — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- Estatística de velocidade de resposta atribuída à instituição errada (100x/21x é MIT/InsideSales 2007, não Harvard) e magnitude tratada como universal — [AInora](https://ainora.lt/blog/lead-response-time-statistics-every-study-2026)

### Inferences
- Erros típicos a vigiar na loja (síntese): (1) não perguntar a origem de quem aparece no balcão, o que faz o ROAS sair subestimado; (2) contar orçamento como venda; (3) misturar cliente antigo voltando com cliente novo de anúncio (o CAC sai otimista); (4) julgar campanha em menos de uma semana ou com poucas conversas; (5) deixar etiqueta desatualizada, porque a planilha só vale se for preenchida no dia; (6) atribuir ao anúncio a venda de quem já era indicação.

### Gaps
- Não achei estudo sistemático de erros de medição em pequeno negócio brasileiro; a lista acima vem de fontes técnicas e de dedução.

## 7. Ferramentas viáveis para uma loja muito pequena (e custo)

### Takeaway
Comece pelo grátis (app + etiquetas + planilha + `wa.me` com código). O primeiro degrau pago que fecha o ciclo com o Meta sem trocar de app é o Tintim (R$197 a R$297/mês). Kommo e Umbler são CRMs com caixa de entrada (de R$70 a R$150 por usuário). RD Station Conversas (a partir de R$989/mês) e Blip são grandes demais para dois atendentes.

### Cited Findings
- **Tintim:** Inicial R$197/mês (1 número, conversas ilimitadas, classificação de leads); Escala R$297/mês (+ webhook e integração Meta/Google Ads); Agências sob consulta; usuários ilimitados; teste de 7 dias do Escala. Conecta o app por QR code ou a API oficial — [tintim.app](https://tintim.app/). Outro plano, Profissional, a R$997/mês, aparece só no resumo de busca — [busca](https://tintim.app/)
- **Kommo:** Base US$25, Advanced US$35, Pro US$45 por usuário/mês, mínimo de 6 meses; Salesbot/agente de IA a partir do Advanced; teste de 14 dias. A página traz data de 2022, mas o conteúdo foi atualizado — [Kommo](https://www.kommo.com/blog/kommo-pricing/). Terceiros brasileiros citam, em set/2026, R$103 / R$154 / R$232 por usuário/mês no semestral e R$86 / R$129 / R$193 no anual — [Calculadora Kommo](https://www.calculadorakommo.com.br/); [Comunidade Kommo Brasil](https://comunidadekommobrasil.com/kommo-planos) (**conflito de valores; conferir no checkout**)
- **Umbler Talk:** só API oficial; Essencial R$99,90 por atendente/mês com mínimo de 2 atendentes (2 números, CRM visual, chatbot, agentes de IA); Impulso R$149,90 por atendente com mínimo de 3 — [SocialHub, comparativo](https://www.socialhub.pro/blog/umbler-talk-preco-plano-comparativo-socialhub/); [Umbler, reajuste](https://blog.umbler.com/br/utalk-reajuste-de-precos/). Outro levantamento cita R$69/mês (anual) e implantação opcional de R$3.000 — [gui.marketing](https://gui.marketing/blog/whatsapp-tracking-conversoes/) (**conflito**)
- **RD Station Conversas:** Basic R$989/mês (até 500 clientes atendidos), Pro R$2.699/mês (até 3.000); cobra por cliente único atendido no mês; API oficial com carteira de créditos à parte — [EpicFlow, comparativo](https://epicflow.com.br/blog/epicflow-vs-rd-station-conversas/); [RD Station](https://www.rdstation.com/produtos/conversas/)
- **Zenvia** a partir de R$40/mês; **Aspa Chat** R$359; **Blip** a partir de R$650 (enterprise) — [gui.marketing, 03/04/2026](https://gui.marketing/blog/whatsapp-tracking-conversoes/)
- Pela Meta, a conversa recebida de CTWA é grátis por 72h, mesmo depois de 01/10/2026 — [Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)

### Inferences
- Para a loja de insulfilm: **fase 1 (R$0)** app + etiquetas + planilha Google + links `wa.me` com código + pergunta de origem no balcão. **Fase 2** Tintim Inicial ou Escala quando a verba de mídia for alta o bastante para R$197 a R$297 caberem na margem (ex.: se a ferramenta ultrapassar ~15% a 20% do gasto de mídia, ainda não vale; limiar meu, não de fonte). **Fase 3** Coexistência + BSP + CAPI para Mensagens Comerciais quando houver volume para otimizar campanha por compra.
- Kommo e Umbler fazem sentido se o problema for organização do atendimento (dois irmãos, um número, várias conversas), não só medição. Para medir, a planilha resolve no começo.
- Ponte com a Hórus: o serviço "CRM + WhatsApp" que a agência ainda não entregou pode nascer exatamente nesse degrau (Coexistência + painel + evento de compra de volta ao Meta). Antes, decidir no Conselho se hospedar isso é serviço gerenciado pago.

### Gaps
- Não verifiquei nas páginas oficiais os preços da Umbler, da Zenvia e do Blip (vieram de comparativos e resumos de busca).
- Não pesquisei Leadster (chatbot de site; serve mais para landing page do que para CTWA).
- Não confirmei se o Tintim por QR code devolve evento de compra ao Meta usando `ctwa_clid` (exige API) ou casando por telefone/dados do cliente.
