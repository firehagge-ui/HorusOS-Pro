# Inspiração: transição de época/versão no scroll ("instalar atualização")

- **Tipo:** transicao
- **De onde:** Robby Yeager — https://robbyyeager.com/
- **Segmento de origem:** portfólio de estrategista de marca / creative leader
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/robby-yeager.md`

---

## O que é

Só a **transição**, não o site. O visitante começa num mundo visual de uma época (um
desktop de 1996, chrome de Win95, fonte pixel) e, ao rolar/clicar um botão "Update to
2026", dispara uma **cutscene de migração** — modal "instalando atualização", barra de
progresso "Migrating 1996 → 2026", e um vórtice de viagem no tempo com medidores-paródia
("Speed MPH", "Power GIGAWATTS") — que **entrega o site num segundo mundo visual** (moderno,
2026). Há botão de volta ("Back to '96"). A transição não é enfeite: ela **dramatiza a
tese** "Creativity Is Timeless" (o mesmo craft, em duas eras).

## Por que marca

O olho para porque o site **muda de identidade inteira no meio do scroll** — cor, fonte,
layout e tom trocam juntos, sincronizados com uma narrativa. É um corte de cena, não um
fade. Gruda porque a mecânica **argumenta**: a "atualização de versão" é a prova visível de
que o autor domina o antigo e o novo. O mecanismo que faz funcionar não é o efeito, é a
**amarra conceito↔tese**: se você remove a transição, a mensagem central muda. Efeito que
passa nesse teste é assinatura; efeito que não passa é firula.

Dois detalhes que evitam o desastre típico do gênero: (1) o pitch aparece **antes** da
transição (na primeira janela), então o efeito não adia a mensagem; (2) há **porta de saída
nos dois sentidos** (botão de atualizar e botão de voltar), então ninguém fica preso no
brinquedo.

## Como recriar

- **Técnica:** duas "skins" completas (tokens de cor + fonte + layout) e uma sequência de
  transição entre elas amarrada ao scroll ou a um clique. A cutscene é um overlay em tela
  cheia com etapas (modal → progresso → vórtice) que roda uma vez e revela o segundo mundo.
- **Biblioteca detectada:** custom (o `branding` não acusou framework). Recriação vanilla
  pediria **GSAP + ScrollTrigger** para orquestrar a sequência e o pin, e possivelmente
  **WebGL/canvas** para o vórtice. Ver `_memoria/design/60-motion.md` e o arsenal em
  `_biblioteca/motion/`.
- **Snippet:** não vendorizado ainda. Se um dia entrar cliente que justifique, criar em
  `_biblioteca/motion/snippets/` e linkar aqui.
- **Custo honesto:** **alto e de uso único.** É build sob medida — duas UIs inteiras mais
  uma cutscene coreografada. Não vira template nem componente reaproveitável. O vórtice
  (WebGL/canvas + scroll-scrub) pesa e exige cuidado de performance. É a inspiração mais
  cara desta biblioteca; não entra por capricho.

## Onde cabe

**Estreito, e é honesto dizer isso.** Cabe quando **o produto é a própria criatividade ou
tecnologia** e a transição prova a tese. No roster, praticamente só dois lugares:

- **Site institucional da própria Horus:** onde "sabemos design" precisa ser demonstrado,
  não afirmado — a transição de época é o argumento vivo.
- **Icarus** (produto de IA da Horus): dramatiza a virada "de como se fazia antes → para o
  que o agente faz agora", se houver um contraste real de era a contar.

Fora disso, só um case pontual em que a marca tenha literalmente um "antes e depois de época"
verdadeiro. Uma versão **muito mais barata e segura** do mesmo raciocínio — trocar
paleta/tipografia entre duas seções para marcar uma virada de narrativa — cabe em mais
lugares que a cutscene completa. Nos clientes regulados (Giovanni, Aion, Mayara) é **veto**,
ver Cuidado.

## Cuidado

- **Raramente cabe em cliente de saúde ou serviço regulado.** Em Dr. Giovanni (CFO), Aion e
  Mayara (CFP) é **veto**: trivializa, briga com a sobriedade informativa exigida, e o
  excesso de movimento é o oposto do que quem escolhe um profissional de saúde precisa.
- **`prefers-reduced-motion` obrigatório**: a cutscene inteira precisa de um caminho
  alternativo (corte seco pro estado final) para quem desligou animação.
- **A skin de época não pode sabotar a leitura:** fonte pixel e chrome de baixo contraste só
  valem em elemento decorativo — **nunca** carregando texto de leitura corrido, ou quebra o
  detector do impeccable (`low-contrast`, `tiny-text`).
- **Teste da régua antes de propor:** o efeito prova a tese? o pitch aparece antes dele? tem
  porta de saída? o produto do cliente é criatividade? Se qualquer resposta for não, é
  firula que derruba conversão — não usar.
- Hex/fonte do teardown irmão são **medidos do estado 1996**; a paleta do mundo 2026 é
  **aparente**, não medida.
