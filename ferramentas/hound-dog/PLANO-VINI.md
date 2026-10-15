# Conta do Vini no Hounder — plano e decisões pendentes

> Pedido do Marcelo (11/10/2026): criar conta para o sócio Vini, com o WhatsApp dele conectado, as
> mesmas funções do Marcelo, vendo os clientes atribuídos ao Marcelo ou a ele. O Vini não tem Claude
> (ideia: API gratuita do Gemini) e trabalha no iPad, não no computador.
> Status: **aguardando as decisões D1 a D4** antes de construir.

## O que já funciona hoje, sem construir nada

- **Login:** Ajustes → Operadores → "Adicionar operador" (só o dono vê o botão). O Farejador cria a conta
  e grava a senha temporária em `.segredos/acessos.txt`. Pelo terminal: `node scripts/criar-operador.mjs
  --email <email do Vini> --nome "Vini" --papel operador`. Falta só o e-mail dele.
- **iPad:** o painel é site comum (HTML/JS, sem instalação). Abre no Safari e dá pra "Adicionar à Tela de
  Início". Tudo que é tela funciona igual ao PC.
- **IA sem Claude próprio:** os botões do painel (Investigar, Triagem, Falar sobre este lead, Mesa) não
  rodam no aparelho de quem clica. Viram um pedido na fila (`jobs`) e quem executa é o **Farejador no PC
  do Marcelo**, com o Claude do Marcelo. Ou seja: o Vini clica no iPad e o trabalho roda no PC.

## O que o iPad NÃO faz

O Farejador é um programa Node (WhatsApp, Claude, lembretes, envio da fila) e não roda no iPad. O Vini
não precisa rodá-lo: um Farejador só (no PC do Marcelo, ou num servidor) atende os dois.

## O que precisa ser construído

### 1. Atribuição e visibilidade (banco + painel)
- Hoje **todo operador vê tudo** (RLS `eh_operador()` em todas as tabelas). `empresas.responsavel` existe,
  mas é texto livre e não filtra nada.
- Construir: `empresas.responsavel_id` (operador), seletor "Responsável" na ficha e no cartão, filtro
  "Meus / do Marcelo / todos" na Esteira, Início, Mesa e Disparos, e a regra de RLS conforme a **D1**.
- Se a regra de visibilidade for no banco (RLS), ela precisa valer também nas tabelas filhas (negócios,
  financeiro, atividades, agenda, conversas, disparos, agentes, jobs). É a parte mais delicada: errar a
  RLS ou esconde dado do Marcelo ou vaza o que não devia.

### 2. Segundo WhatsApp (Farejador)
- Hoje o Farejador segura **uma** sessão (`farejador/.wa-auth/`) e as conversas são chaveadas só pelo
  número do contato (`whatsapp_conversas.jid` é único). Não existe "de qual WhatsApp veio".
- Construir: várias sessões no mesmo Farejador (uma pasta de sessão por operador), coluna `conta` nas
  conversas, mensagens e disparos, e o envio saindo pelo número do responsável do lead.
- Conexão do Vini: pelo **código de pareamento** (ele digita no WhatsApp do celular dele, em Aparelhos
  conectados). Não precisa estar perto do PC. O WhatsApp principal dele precisa estar num celular; o iPad
  é só aparelho conectado.
- Valem as travas de hoje para o número dele: só conversa de cliente entra no CRM (conversa pessoal não
  é gravada), nada de disparo em massa, 10 por dia, janela de envio, resposta a lead é do humano.
- Limite honesto: o WhatsApp do Vini passa a depender do **PC do Marcelo ligado** (ver D2).

### 3. Quem assina a mensagem
- Os pedidos ao Claude dizem "HÓRUS = Marcelo", "no tom do Marcelo", e os agentes falam como Marcelo
  (`prompts.mjs`, `PLANO-AGENTES.md`). Lead do Vini precisa sair como Vini. Construir: o nome do
  responsável entra no pedido, e o Vini precisa de exemplos de escrita dele em `_memoria/prospeccao/`.

### 4. Motor de IA (ver D3)

## Sobre a API gratuita do Gemini (leitura do Claude, 11/10/2026)

- **Não é necessária** para o Vini usar a IA (ver "O que já funciona hoje").
- **Risco no plano gratuito:** pelos termos da API do Gemini que conheço, no nível gratuito o Google pode
  usar o que é enviado para melhorar os produtos, com revisão humana. O que vai no pedido é dado de lead e
  cliente, conversa de WhatsApp e clínica regulada (CFO). Isso choca com a `integridade.md` e com a LGPD.
  Conferir os termos vigentes antes de qualquer decisão; o plano pago não tem essa cláusula.
- **Custo de construção:** o Farejador foi escrito em volta do `claude -p` (ferramentas MCP do CRM,
  leitura do repositório, busca na web, saída em JSON validado). Um segundo motor é reescrever esse
  miolo, e a qualidade das tarefas que mais pesam (investigação, mensagem com a doutrina) cai.
- **Ponto de atenção do outro lado:** com os dois usando o Claude do Marcelo, o limite da assinatura é
  dividido (em 05/10 um loop já comeu o limite). E a assinatura é individual: se o uso dos dois virar
  rotina pesada, o caminho limpo é o Farejador aceitar uma chave de API da Anthropic (pago por uso).

## Decisões pendentes (Marcelo)

- **D1 — O que o Vini vê.** (a) tudo que é do Marcelo ou dele, e o Marcelo vê tudo; (b) cada um vê só o
  seu, o Marcelo vê tudo; (c) os dois veem tudo e o "responsável" só filtra a tela. Também: lead sem
  responsável e lead do Antônio, quem vê?
- **D2 — Onde roda o WhatsApp do Vini.** (a) no Farejador do PC do Marcelo (custo zero, depende do PC
  ligado); (b) mover o Farejador para um servidor sempre ligado (custo mensal, os dois números ficam no
  ar sempre).
- **D3 — Motor de IA do Vini.** (a) o mesmo Claude do Marcelo pela fila (recomendado, nada a construir);
  (b) chave de API da Anthropic para os dois; (c) Gemini, de preferência no plano pago.
- **D4 — O Vini é "operador" ou "dono"?** Dono pode criar e remover operadores.

## Ordem sugerida, depois das decisões

1. Conta do Vini (minutos) e ele já entra no iPad vendo o CRM.
2. Atribuição + filtros de tela.
3. Segundo WhatsApp + assinatura da mensagem pelo responsável.
4. RLS por responsável (se a D1 pedir separação de verdade), com o `scripts/testar-acesso.mjs` estendido
   para logar como cada um e conferir o que cada um enxerga.
