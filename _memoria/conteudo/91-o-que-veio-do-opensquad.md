# O que veio do opensquad, e o que não veio

> Análise feita em 03/08/2026 a pedido do Marcelo.
> Repositório: github.com/renatoasse/opensquad, licença MIT, de Renato Asse
> (Comunidade Sem Codar). Registro escrito pra não reabrir a discussão daqui a
> três meses.

---

## O veredito em uma linha

**O framework não vale. O conhecimento dentro dele vale muito.**

O `opensquad` é um orquestrador multi-agente: você descreve um squad em linguagem
natural, ele monta agentes com papéis, um pipeline em YAML com checkpoints, e um
dashboard 2D em Phaser mostrando bonequinhos de pixel art trabalhando num
escritório virtual. Instalar isso aqui seria montar uma segunda camada de
orquestração em cima da que já existe — as skills do Claude Code fazem o mesmo
trabalho, sem YAML e sem CLI intermediário.

E ele não sabe nada do que trava a operação da Horus: não conhece CFO, não
conhece CFP, não conhece `marca.md`, `briefing.md` nem `integridade.md`. Um squad
dele produziria carrossel com antes/depois de paciente e depoimento sem piscar.

Mesma decisão que foi tomada com o `impeccable`: pegar a peça boa, recusar o
sistema.

---

## O que foi trazido

**1. Os sete formatos narrativos** → `00-formatos.md`
A maior lacuna daqui. A `/carrossel` sabia descrever layout (capa, solo, duo,
número, citação) e não sabia descrever narrativa. Layout é como o slide parece;
formato é por que ele existe e por que vem depois do anterior. Trazido com as
travas de compliance por cima, e com o formato Transformação marcado como
proibido no Giovanni e na Aion.

**2. Os pisos de legibilidade** → `10-legibilidade.md`
O achado mais concreto da comparação. A `/carrossel` mandava corpo de 20 a 24px e
eyebrow de 13 a 16px numa peça de 1080px. No celular isso vira 8px e 5px. Era o
mesmo defeito que o detector do impeccable pega no site (`tiny-text`,
`undersized-ui-text`) e que ninguém tinha ido conferir na peça social. Corrigido.

**3. Antipadrões de copy** → `90-antipadroes.md`
Havia catálogo de antipadrão pra site e nenhum pra carrossel. Os deles são bons e
específicos: capa que anuncia em vez de parar, afirmação sem fonte, copy que
serve pra qualquer marca, carrossel sem reflexão, CTA genérico.

**4. Rubrica com condição de veto** → `99-checklist.md`
A ideia de um portão que dá nota e reprova sozinho em certas condições, em vez de
uma lista de "confira se está bom". O critério "para o scroll" com peso maior e
veto próprio é a melhor sacada do repositório inteiro.

**5. Duas mecânicas de processo** → skill `/carrossel`
Propor **3 ângulos** antes de escrever, e propor **3 identidades visuais** antes
de desenhar. Força divergência antes de comprometer. E: renderizar o slide 1
sozinho, **olhar o PNG**, e só então renderizar o lote.

---

## O que foi recusado

**O framework inteiro** — squads, agentes, `pipeline.yaml`, CLI `npx opensquad`,
os templates pra nove IDEs. Duplicaria o que as skills já fazem.

**O dashboard "Escritório Virtual"** — Phaser, sprites, avatares piscando. É
teatro. Custa token e não melhora nenhuma peça.

**A skill `instagram-publisher`** — publica via Graph API mas passa as imagens
por um terceiro, o imgBB, pra conseguir URL pública. Nossa `/aprovar-post` já
publica no Instagram e no Facebook direto pela Graph API, sem hospedeiro externo
segurando imagem de cliente de saúde. A nossa é melhor.

**O "Sherlock"** — investigador que abre navegador com Playwright, pede login
manual em Instagram e LinkedIn e **guarda cookie de sessão em disco** pra
investigações futuras. Risco de conta e de termos de uso desproporcional ao ganho.
Pra estudar referência já existe a `/estudar-site`.

**Um HTML por slide** — eles geram `slide-01.html` até `slide-08.html`. Aqui é um
`carrossel.html` só, com os slides como `div`. O arquivo único mantém o sistema de
design coeso por construção e custa menos token. Fica como está.

**1080 × 1440 (3:4)** — eles renderizam nessa proporção. 4:5 (1080 × 1350)
continua sendo o recomendado pra feed e pra carrossel, e é o que ocupa mais tela.
Verificado em 03/08/2026. Sem mudança.

**As best practices de copywriting deles** — Eugene Schwartz, níveis de
consciência, "escada de intensidade de CTA". É direct response americano, o mesmo
problema das 7 mentes do `_conselho/`: empurra urgência, escassez e promessa, que
não passam em cliente regulado. Serve de referência, não de doutrina.

---

## Uma inconsistência interna deles, pra não copiar por engano

O `instagram-feed.md` exige **40 a 80 palavras por slide**. O `anti-patterns.md`
proíbe passar de **4 ou 5 linhas visíveis**. O `image-design.md` exige corpo de
**34px** mínimo. Os três não fecham juntos: com 34px numa largura útil de 940px,
80 palavras não cabem em 5 linhas.

Ficamos com os dois que se sustentam (piso de fonte e limite de linha) e deixamos
a contagem de palavras ser consequência: 20 a 45 por slide. Serve de lembrete de
que material de terceiro se copia por peça verificada, não em bloco.

---

## Duas decisões que ficaram pro Marcelo

**1. Contador de slide.** Eles proíbem "1/8" dentro da arte, porque o Instagram
já desenha os pontinhos e o contador é ruído redundante. A `/carrossel` daqui
mandava pôr em todos os slides, como elemento do estilo da casa. Concordo com
eles pro Instagram e discordo pro que vira PDF ou LinkedIn. Deixei **opcional,
desligado por padrão**, até o Marcelo bater o martelo.

**2. Identidade visual travada por cliente.** Eles têm um `template-designer` que
gera 3 variações, renderiza como PNG, o usuário escolhe uma, e ela vira arquivo
de referência que todo conteúdo futuro daquele squad reusa. Aqui, hoje, a
`/carrossel` redecide o estilo a cada peça — o que explica por que duas peças do
mesmo cliente saem parecidas mas não idênticas. A mecânica de escolher entrou na
skill; **falta decidir se o template aprovado vira arquivo fixo** em
`clientes/<nome>/carrossel-referencia.html`. Recomendo que sim, a partir do
primeiro cliente com carrossel recorrente.
