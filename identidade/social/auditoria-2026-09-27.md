# Auditoria do Instagram da Horus (@horusagencia.br)

> 27/09/2026. Feita pelo agente social (etapa 2 de `ferramentas/social/ARQUITETURA.md`).
> Fontes: API oficial da Meta (perfil, cota, métricas de 7 dias) e uma visita ao perfil pelo
> Playwright **como visitante, sem login** (a sessão salva em `dados/instagram-session` expirou).
> Nada foi alterado na conta. **Aprovado pelo Marcelo em 27/09/2026 ("aprovo tudo"): nas variantes,
> as recomendadas (nome A, bio 2, categoria Web designer). Endereço segue fora (sem endereço de atendimento).**

---

## 1. Retrato

| Item | Hoje | Fonte |
|---|---|---|
| Conta | @horusagencia.br, tipo Empresa, pública | API |
| Nome | "Hórus Agência \| Marketing" | API |
| Bio | "🚀 Mais clientes através do digital / 🎯 Tráfego • Google • Automação / 👇 Fale com a Hórus" | API |
| Link | **nenhum** (campo `website` vazio) | API |
| Foto | o olho da marca (arco azul, pupila dourada) sobre círculo escuro | print como visitante |
| Posts | **0** | API |
| Destaques | **nenhum** | print como visitante |
| Seguidores / seguindo | 5 / 52 | API |
| Alcance, visualizações, interações (7 dias) | 0 | API |
| Botão de contato e categoria | **não verificado** (a visita sem login não mostra) | conferir no app |
| Quem são os 52 seguidos | **não verificado** | conferir no app |

---

## 2. O papel do perfil hoje

A Horus capta cliente pela **esteira de prospecção** do Hounder: a mensagem chega no WhatsApp do
dono falando do Google dele. Quem recebe mensagem de um desconhecido **abre o perfil antes de
responder**. É ali que ele decide se a Horus existe de verdade.

Então o perfil tem um teste de 10 segundos, na ordem:

1. **Quem é?** Uma agência de verdade, de Salvador.
2. **Faz o quê?** A mesma coisa que a mensagem ofereceu (site e Google), não outra.
3. **Dá pra confiar?** Tem trabalho mostrado e um jeito de trabalhar claro.
4. **Como falo?** Um toque até o WhatsApp.

**Hoje o perfil reprova nos quatro.** Pior: perfil de agência de marketing com **zero posts** lê
como empresa fantasma, e é mais fácil ignorar uma mensagem quando o perfil está vazio.

> ⚠️ **Recomendação comercial:** o Disparos tem 7 mensagens esperando aprovação. O ideal é
> que o perfil tenha pelo menos os **3 posts fixados + bio + link** antes do primeiro envio da
> esteira. Não é pra travar a prospecção: é uma semana de trabalho que protege cada envio.

---

## 3. Diagnóstico por elemento

| Elemento | Problema | Por que importa |
|---|---|---|
| Nome | Acento em "Hórus" (a marca tirou em 22/09). "Marketing" é a palavra mais disputada do Instagram e não diz o que a Horus entrega | O campo **nome** entra na busca do Instagram. É o único lugar da bio que funciona como palavra-chave |
| Bio, linha 1 | "Mais clientes através do digital" promete resultado genérico (a casa não promete) e serve para qualquer agência do Brasil | Não passa no teste "eu chegaria aqui com qualquer agência?" |
| Bio, linha 2 | "Tráfego • Google • Automação" não é a oferta de entrada. A esteira vende **site + Google Meu Negócio** (fase 1); tráfego é fase 3 | O lead ouviu "Google" na mensagem e vê "Tráfego" no perfil. Desencontro custa confiança |
| Bio, emojis | 🚀 🎯 👇 é o kit padrão de bio de agência | Sinal de template (brandbook 3.3, antipadrões da casa) |
| Link | Não existe | O "Fale com a Hórus 👇" aponta para o nada. O teste 4 reprova |
| Foto | Símbolo da marca, legível no círculo. **Está boa** | Manter. Só conferir se é o arquivo oficial (a pupila está como decisão aberta no brandbook 4.3) |
| Posts | Zero | Sem prova nenhuma, e o Google indexa post de conta profissional desde 10/07/2025: cada legenda boa é uma página a mais no Google |
| Destaques | Nenhum | Destaque é a "página fixa" do perfil: como trabalhamos, projetos, contato |

---

## 4. Plano de mudanças (para aprovar)

Marque o que aprova. Onde há variantes, escolha uma ou peça outra.

### 4.1 Nome (máximo 30 caracteres, conferido)

- [x] **A.** `Horus | Site e Google Salvador` (30). Recomendado: as palavras que o dono digita na busca
- [ ] **B.** `Horus Agência | Salvador` (24). Mais institucional, menos busca

### 4.2 Bio (máximo 150 caracteres; as três têm entre 125 e 127, conferido)

- [ ] **1. Direta, com o diferencial da casa**
  ```
  Site e Google para negócio local em Salvador.
  Você aprova antes de ir ao ar e fica dono de tudo.
  Fale com a gente no WhatsApp 👇
  ```
- [x] **2. A tese da esteira** (recomendada: é a mesma ideia da mensagem que o lead recebeu, "o problema é do Google, não do dono")
  ```
  Seu negócio é bom. O Google precisa saber disso.
  Site e Google Meu Negócio em Salvador, um bloco por vez.
  Chama no WhatsApp 👇
  ```
- [ ] **3. Máquina completa**
  ```
  Montamos a presença digital do seu negócio: site, Google e atendimento.
  Salvador · você aprova e fica dono de tudo.
  WhatsApp 👇
  ```

Nenhuma promete resultado, nenhuma usa número. O único emoji aponta o link.

### 4.3 Link (até 5)

- [x] **Link 1, WhatsApp com mensagem pronta:**
  `https://wa.me/5571999127514?text=Oi!%20Vim%20pelo%20Instagram%20da%20Horus.`
  O número é o do site e do `empresa.md`. O texto pronto faz toda conversa vinda do Instagram
  chegar marcada. É assim que o Hounder vai saber que o lead veio daqui: **é a nossa métrica de
  conversão**, já que a Meta tirou "cliques no site" da API.
- [x] **Link 2, site:** `https://horusagencia.com.br`

### 4.4 Botões e categoria (conferir no app, 2 minutos)

- [x] Categoria: "Agência de marketing" ou "Web designer". Recomendo **Web designer**, que casa com a oferta de entrada
- [x] Botão de contato **WhatsApp** ligado ao número acima (Editar perfil → Opções de contato)
- [ ] Endereço: só se houver endereço de atendimento. Hoje o brandbook marca `[FALTA: cidade/endereço]`. Sem endereço, basta "Salvador" na bio

### 4.5 Os 3 posts fixados (a primeira linha da grade)

Cada um responde a uma pergunta do teste de 10 segundos:

| # | Pergunta que responde | Post | Formato |
|---|---|---|---|
| 1 | Quem é e faz o quê | "O que a Horus faz, e pra quem": site, Google, atendimento, para negócio local de Salvador | Carrossel curto |
| 2 | Dá pra confiar | "Como a gente trabalha": um bloco por vez, você aprova antes de ir ao ar, preço fechado antes, você é dono de tudo. É a régua da casa virando argumento (brandbook 1.3) | Carrossel |
| 3 | Por que eu precisaria | "Por que o Google esconde negócio bom": o que está na ficha, na categoria e nas avaliações. Educativo, sem citar ninguém | Carrossel |

Esses três são produzidos na etapa 3, com a doutrina de `_memoria/conteudo/` e passando pela fila.

### 4.6 Destaques (depois dos primeiros stories)

- [x] **Como trabalhamos** (as fases, o que o cliente aprova, o que é dele)
- [x] **Projetos**: os dois conceituais da casa (Amêndoa Preta e Soleira), sempre como "projeto nosso", nunca como cliente. O site do Grão da Serra está no ar, mas **só entra com autorização do Nelson** `[FALTA: autorização do cliente para mostrar]`
- [x] **Google** (dicas curtas do Google Meu Negócio: é o mesmo assunto da mensagem da esteira)
- [x] **Fale com a gente**

Capas: o símbolo ou um ícone de traço simples sobre o fundo da marca, sem foto de banco.
Destaque é feito de story, e a API publica story; já **criar o destaque e trocar a capa** só pelo
app ou pelo Playwright.

### 4.7 Duas decisões de formato para o conteúdo

- [x] **Proporção 3:4 (1080 × 1440) no feed da Horus.** Desde 2025 o Instagram aceita 3:4 e a
  **grade do perfil é 3:4**. Com o 4:5 (1080 × 1350) de hoje, a miniatura da grade corta a capa
  do carrossel. A casa escolheu 4:5 em 03/08, e na época a conclusão estava certa. Proponho
  mudar para a Horus e **testar** antes de virar regra para os clientes.
- [x] **Legenda escrita também para o Google.** Primeira frase com o que a pessoa digitaria na
  busca ("site para clínica em Salvador", "Google Meu Negócio da oficina"), e texto alternativo
  preenchido. Stories e destaques não são indexados; post e Reel são.

### 4.8 Os 52 seguidos

Conferir no app se há perfil pessoal ou aleatório. Se houver, deixar de seguir **à mão, aos
poucos**. Deixar de seguir em massa, por automação, é justamente o tipo de ação que a política
proíbe (`seguir_em_massa`).

---

## 5. Quem executa

**Recomendação honesta: nome, bio, link, categoria e botão, você faz no app em 5 minutos.** É
uma ação única e o risco é zero. Automatizar pelo Playwright uma edição que acontece uma vez é
mais lento e mais arriscado que o polegar. O Playwright de edição de perfil passa a valer quando
houver repetição (cliente novo, bio sazonal, capas de destaque em lote). Se mesmo assim quiser
que eu faça, é preciso logar a sessão de novo: `node scripts/instagram-bot.js login`.

| Mudança | Executor | Quando |
|---|---|---|
| Nome, bio, link, categoria, botão | Marcelo no app (ou Playwright, se preferir) | Assim que aprovar |
| 3 posts fixados | Agente cria → fila → Marcelo aprova → API publica → fixar no app | Etapa 3 |
| Stories para os destaques | Agente cria → fila → API publica | Etapa 3 |
| Criar destaques e capas | App ou Playwright | Depois dos stories |

---

## 6. Como saber se funcionou

- **Principal:** conversas no WhatsApp com "Vim pelo Instagram" (contadas no Hounder).
- **Da esteira:** lead que responde a mensagem e cita o perfil, ou que responde depois de uma
  visita ao perfil. Anotar no Hounder quando acontecer.
- **Diagnóstico** (API, por post): alcance, visitas ao perfil, novos seguidores, salvamentos,
  compartilhamentos. Com a conta nesse tamanho, **nenhuma conclusão sai de um post só**.

---

Referências conferidas em 27/09/2026: grade e proporção 3:4
([Linearity](https://www.linearity.io/blog/instagram-size-guide/),
[InstantDM](https://socialbyidm.com/instagram-grid-sizes-dimensions-2026-the-new-vertical-grid/));
indexação no Google desde 10/07/2025 ([PPC Land](https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/),
[Birdeye](https://birdeye.com/blog/instagram-search-indexing-update/)).

---

## 7. Execução (28/09/2026, pelo Chrome do Marcelo)

Aplicados pelo Claude: **bio** (a recomendada, "Seu negócio é bom...") e **categoria** ("Web designer",
antes "Produto/serviço"), com "Perfil salvo" confirmado e a bio persistindo depois de recarregar.

**Bloqueio descoberto (desktop web do Instagram, 28/09/2026):** o campo Site/link vem **travado** no
computador ("Somente é possível editar os links no celular. Acesse o app do Instagram e edite seu
perfil para alterar os sites na sua bio."). O campo de nome do perfil também não apareceu na tela de
edição do computador. Os dois dependem do app no celular.

Botão de contato: a tela só oferece Ligação/SMS com um telefone de atendimento, ou conectar
**WhatsApp Business** via API (fluxo maior, com verificação, feito para abrir conversa a partir de
anúncio, não um link comum). Não é o link simples de wa.me do plano original. Não mexi aqui: decisão
do Marcelo, feita por ele.

**Pendente, só no celular:**
1. Nome: "Horus | Site e Google Salvador" (Editar perfil → Nome)
2. Link do WhatsApp: `wa.me/5571999127514?text=Oi!%20Vim%20pelo%20Instagram%20da%20Horus.`
3. Link do site: `https://horusagencia.com.br`
4. Botão de contato (WhatsApp): decidir entre o telefone simples (Ligação) ou conectar WhatsApp
   Business, e configurar pelo app se optar pela segunda via.
