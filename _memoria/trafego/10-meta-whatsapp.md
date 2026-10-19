# Meta Ads com destino WhatsApp (negócio local, verba pequena)

> Fonte: `_memoria/trafego/fontes/relatorio.md`, seções 1 e 2 (Central de Ajuda da Meta,
> engenharia da Meta, Jon Loomer, Foxwell, Pedro Sobral, Spark UGC, Larrossa). Conferido em 01/10/2026.
> ⚠️ A Meta muda a interface várias vezes por ano: conferir os nomes no Gerenciador antes de montar.

---

## 1. Onde

**Sempre no Gerenciador de Anúncios, nunca no impulsionar.** O impulsionar do Instagram até manda
pra conversa no WhatsApp, mas não tem os objetivos Leads e Vendas, e por isso **nunca chega à
otimização por lead via mensagem**. (Central de Ajuda.)

## 2. Estrutura de partida (R$ 30 a 50 por dia)

| Item | Configuração | Por quê |
|---|---|---|
| Conta | No nome/CNPJ do cliente, cartão do cliente; Hórus como parceira no Gerenciador de Negócios | Contrato da casa e do network |
| Campanha | Objetivo **Leads**, local da conversão **WhatsApp**, meta "maximizar conversas" | Padrão oficial; dentro da mesma campanha dá pra trocar depois pra "maximizar leads" |
| Conjunto | **Um só.** 18+, público Advantage+ só com localização, posicionamentos Advantage+. Gênero e idade máxima são só sugestão no Advantage+: o público mora no criativo | Consolidação (Meta, Loomer). Sobral usa 4 a 8 conjuntos e público manual só acima de R$ 1.000/mês (set/2026) |
| Raio | Pela origem real dos clientes (perguntar os bairros), não número fixo. Negócio de visita (barbearia, salão, lanchonete): partir de 1 a 2 km e, com frequência em 1,7 e custo subindo, avaliar abrir 1 km | A Meta não publica raio mínimo pro Brasil; raio pequeno encarece. Regra de bolso do Sobral (17/09/2026) |
| Anúncios | **3 a 6 conceitos diferentes**, cada um com 3 a 5 textos e títulos (formato flexível) | Diversidade real com verba curta |
| Mensagem do anúncio | Cumprimento + perguntas sugeridas que pedem o modelo do carro/serviço | Qualifica e diz de onde veio a conversa |
| Horário | Só veicular quando houver quem responda. **Programar horário exige orçamento total (vitalício) com programação**; o diário roda o dia todo | Sobral (02/10/2026). Conferir no Gerenciador ao montar |
| Pagamento | Cartão (pós-pago). No pré-pago (PIX/boleto), R$ 1.000 depositados viram ~R$ 878 de mídia | Comunicado da Meta |

**Fase de aprendizado (oficial):** o conjunto sai com ~50 resultados na semana seguinte à última
edição significativa. Com R$ 30/dia isso pede conversa a no máximo R$ 4,20; com R$ 50/dia, R$ 7,00.
Se não chegar, aparece "Aprendizado limitado", que **não é punição** (Meta). Jon Loomer (abr/2026):
50 por semana é regra de bolso, não requisito. As duas leituras dão na mesma estrutura: sinal
concentrado num lugar só.

**Divergência sobre quantidade de criativos:** Foxwell defende 10 a 15 tipos por campanha (escreve
pra e-commerce com verba alta); Loomer (2026) diz que estava errado e usa um anúncio flexível com
5 textos, 5 títulos e até 10 mídias; Sobral fica em 3 a 5. **Pra verba pequena: 3 a 6 conceitos.**

## 3. Do "conversa" pro "lead" (o passo que quase ninguém usa)

Funciona com o **app WhatsApp Business comum**, sem API (Central de Ajuda):

1. No app, em Ferramentas, ligar a permissão para a Meta receber informações de eventos.
2. Usar as **etiquetas padrão**: "Lead", "Novo cliente", "Acompanhamento" (lead); "Novo pedido",
   "Pagamento pendente", "Pago", "Pedido concluído" (compra). ⚠️ Nomes traduzidos da ajuda em
   inglês: **conferir os rótulos exatos no celular do cliente**. Etiqueta personalizada pode não contar.
3. Etiquetar **no mesmo dia** (vale até 7 dias depois do clique).
4. Com **10 leads ou compras etiquetados em 30 dias**, a Página fica elegível a "maximizar leads via
   mensagem". A Meta diz que custa **24% menos** por lead que otimizar por conversa (experimento
   dela, nov/2024, sem validação independente). Trocar a meta reinicia o aprendizado uma vez.

**API de Conversões para mensagens** (com `ctwa_clid`, eventos LeadSubmitted, QualifiedLead,
Purchase): só pra quem atende pela API oficial. Exagero pra loja no app; vira parte do serviço no dia
em que a Hórus entregar CRM + WhatsApp sobre a API.

## 4. Ligação, raio, política

- **Anúncio de ligação** existe (otimiza pra ligação de 60 s), mas abrir um segundo evento divide o
  sinal. Só como teste se o cliente fecha mais por telefone.
- **Política:** película e estética não são categoria especial. Antes e depois de carro **pode** (a
  restrição oficial é de saúde, cosmético e emagrecimento). O anúncio de WhatsApp também segue a
  Política Comercial do WhatsApp.
- **Exclusão de posicionamento:** já saiu de Engajamento, Leads, Vendas e App (Social Media Today,
  12/10/2026). Ficam a exclusão na conta e a regra de valor (lance reduzido em no máximo 90%). Com verba
  pequena e posicionamentos Advantage+, nada muda na montagem.
- **Divergência registrada:** o Sobral monta mensagem com objetivo **Engajamento manual** e usa o turbinar
  para ganhar seguidores (set e out/2026). A casa fica com **Leads + WhatsApp**, que é o caminho para
  "maximizar leads via mensagem" (otimiza pelo degrau de baixo).

## 5. Rotina: cadência, corte e escala

| O quê | Quando | Fonte |
|---|---|---|
| Nada se mexe | Primeiras 48 h | Spark UGC |
| Olhar (problema operacional) | Todo dia | Síntese |
| Trocar anúncio | No máximo a cada 4 a 5 dias | Sobral |
| Mexer em público | A cada 7 dias | Sobral |
| Julgar a campanha | Blocos de 7 e 14 dias (aprendizado leva 7 a 14) | Sobral, Foxwell |
| Julgar um criativo por custo | Depois de gastar 2 a 3 vezes o custo-alvo nele | Spark UGC (proporção de e-commerce) |
| Cortar cedo por atenção | Retenção do gancho < 20% depois de ~2.000 impressões | Spark UGC |
| Julgar taxa de fechamento | Depois de 20 a 30 conversas | Aritmética (sem fonte com método) |
| Conceito novo | 1 a 2 por semana ou por quinzena; na prática da casa, **um conceito novo a cada ~15 dias** | Foxwell; Sobral (17/09/2026) |
| Frequência | Só é sinal **junto** com custo subindo (semanal > 2,5 a 3 = cansaço de criativo). Em raio minúsculo, 1,7 é gatilho para revisar o raio | Larrossa, Foxwell; Sobral |

- **Corte:** anúncio que gastou 2 a 3 vezes o custo máximo por orçamento qualificado sem gerar
  nenhum é candidato a sair. Decidir pelo degrau de baixo (orçamento, venda), não pela conversa.
- **Escala:** a regra de subir 10 a 20% por vez ainda é ensinada (Julio Carvalho, 2026), Loomer
  abandonou. Em R$ 40/dia, 20% é ruído. **A pergunta que decide é se o WhatsApp do cliente aguenta
  mais conversas sem piorar o tempo de resposta.** A Meta diz que o que atrapalha é salto grande.
- **Teste A/B com verba pequena:** "praticamente sem sentido" (Loomer). Conceitos no mesmo conjunto.
- **Remarketing:** Loomer acha "praticamente morto" com Advantage+. O Sobral separa o quente (engajados
  em 365 dias, 50% do vídeo, visita ao perfil em 30 dias) com 27% de uma verba de R$ 1.000 (17/09/2026).
  O "WAR" que este manual atribuía a ele **não é definido em nenhum texto dele**: era leitura nossa. Com
  verba pequena e um conjunto aberto no raio certo, os engajados já estão dentro. Lista de clientes
  < 1.000 serve mais pra **exclusão**. **Plano de escala** (cliente acima de R$ 1.000/mês com volume de
  engajados): partir da divisão do Sobral 40% frio geolocalizado / 27% remarketing / 16% vídeo / 16%
  engajamento.
- **Sazonalidade (película):** procura por "insulfilm" no Brasil tem pico em dez/jan, vale em mai/jun
  (variação de ~17%). Mais verba de dezembro a março e em julho; o vale serve pra testar criativo.
