# Card — Abordagem e prospecção de negócio local

> **Fonte:** 4 grupos de network do Marcelo, via Q&A do NotebookLM · **primeira gravação:**
> 12/09/2026.
> **Confiança: ALTA** para os ganchos e modelos de mensagem (prática testada de agências e
> devs brasileiros) · **MÉDIA e calibrar** para números de ferramenta (variam por conta/uso).
> ⚠️ Referência de mercado, **não meta e não promessa**. Nada aqui vai para peça de cliente.
> Cross-ref: `taxas-de-conversao.md`, `_memoria/comercial.md`, e o playbook `Horus-Comercial`.

---

## 1. O gancho que mais faz o lead responder

Ranking testado na rede (o que abre porta em negócio local):

- 🏆 **Google + perda de cliente na cidade** (campeão). O dono entende que quem pesquisa no
  Google quer comprar/agendar agora. "Vocês estão perdendo quem procura por [categoria] em
  [cidade] e não acha vocês" atinge a dor de faturamento imediato.
- ⚠️ **Site fora do ar** (limitado): funciona quando o link está quebrado, mas a maioria dos
  negócios pequenos nem tem site, então limita o volume.
- ❌ **Instagram / redes** (baixa conversão): "já tenho Instagram e pra mim basta". Ele não vê
  o Insta como intenção de compra e acha que você quer vender "design".

**Regra de ouro:** o dono não compra código nem "site bonito". Ele compra **parar de perder
venda pro concorrente** e **mais dinheiro no bolso**. Fale disso.

## 2. Os três modelos de mensagem que convertem

### A) "Sabor de projeto / MVP pronto" (o campeão)
Chegar com uma prévia visual já feita (com a marca do lead, apoio de IA) muda o jogo: ele vê
a própria empresa no ar e o desejo dispara. Estrutura:
1. **Elogio sincero + conexão:** "Opa [nome], tudo bem? Vi o perfil de vocês e achei ótimo o
   trabalho com [serviço]."
2. **Dor + entrega do modelo:** "Reparei que quando procurei por [categoria] em [cidade],
   vocês não aparecem no Google. Montei um modelo exclusivo pra [empresa]: [link]."
3. **CTA de curiosidade:** "Já deixei a estrutura pronta. Se quiser ver ou ajustar algo, te
   mostro."

### B) "Dois passos / curiosidade" (evita bloqueio de chip)
Gera resposta antes de mandar link. Quebra a saudação em duas mensagens curtas:
1. "Oi [nome], tudo bem?" → 2. "Boa tarde!" → (espera responder) → 3. pergunta de prioridade:
"Procurei por [categoria] na região, vi que vocês têm ótimas avaliações mas não têm site/
agendamento no WhatsApp, e o cliente acaba indo pro concorrente. Resolver isso é prioridade
pra vocês agora?" → 4. se sim: "Te explico em um áudio de 1 min, pode ser?"

### C) "Cliente oculto / tiro de sniper"
Entra primeiro como cliente interessado, elogia o atendimento, depois faz a ponte: "Atendimento
de vocês é excelente! Procurei no Google e tive dificuldade de achar vocês. Trabalho com
tecnologia e montei uma ideia que ajuda a converter mais. Com quem falo sobre isso?" Gera
contraste positivo, porque o dono só recebe gente criticando.

## 3. As regras de ouro da abordagem

- **Fale do LEAD, não de você.** Nunca abrir com "eu faço / minha agência / eu desenvolvo".
- **Nada de textão frio** apresentando a agência: soa spam, é ignorado e bloqueia o chip.
- **Foto de pessoa física** no WhatsApp Business (não a logo fria) aumenta muito a resposta.
- **Espelhamento:** primeiro contato por texto; se ele responde em áudio, responda em áudio
  (tom de voz gera proximidade).
- **Foque na dor certa:** demora pra responder no WhatsApp, agendamento perdido, concorrência
  no Google. Não fale de "likes" ou "marketing de conteúdo" pra comerciante pequeno.

## 4. Aquecimento de número (não queimar o chip)

Disparo frio em volume queima o número. Práticas da rede:
- **Chip novo aquece gradual:** poucos envios/dia no começo, subindo devagar (o "ritmo
  conservador" dos disparadores fica em ~90 a 180s entre mensagens; número novo é o de maior
  risco de bloqueio).
- **Janela de horário comercial** e pausas automáticas simulam comportamento humano.
- **Personalização > volume:** mensagem específica pro negócio da pessoa não parece spam.
- Base de clientes já conhecidos (pós-venda/recompra) usa **API oficial da Meta**, não chip
  pessoal (ver `recorrencia-e-pos-venda.md`).

## 5. Ferramentas pra montar lista de lead

| Ferramenta | Fonte | Custo (referência) |
|---|---|---|
| **Kaptar** | Google Maps (via API Google Places) | cota grátis do Google Cloud; ⚠️ cuidar do raio/requisições pra não estourar e gerar cobrança |
| **Apify** | Google Maps, Instagram, LinkedIn, TikTok | US$ 5 grátis ao criar conta; ~R$ 1,20 por 50 leads qualificados |
| **OneProspector** | OpenStreetMap (sem custo de API Google) | 7 dias grátis; joga leads num Kanban |
| **EnCode / Trinus** | scraping de Google Maps (painéis de membros) | interno |
| **Biblioteca de Anúncios da Meta** | quem já roda tráfego (alta consciência) | grátis |
| **Casa dos Dados** | telefone de sócio via CNPJ público | grátis/pago |

Combinação popular pra começar barato: **Kaptar/Google Maps** ou **Apify** (créditos iniciais).
Na Hórus, o alimentador é a **ponte Spark** (Gemini → Sheets → CSV → Firecrawl), auditada pelo
`mcp-prospeccao`.

## Nota da casa (calibração)

- A doutrina da casa continua: **não disparar em massa**, personalizar sempre, e o copiloto
  só sugere a próxima mensagem depois do lead responder (`_gestao/painel-ataque-planta.md`).
- Os modelos acima entram no playbook `Horus-Comercial/10-templates-mensagem.md` adaptados,
  sem a parte de MVP que dependa de produção pesada por lead (calibrar esforço).
