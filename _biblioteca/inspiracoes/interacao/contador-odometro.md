# Inspiração: Contador animado (odômetro / number roller)

- **Tipo:** interacao
- **De onde:** HydraDB — https://hydradb.com/
- **Segmento de origem:** dev-tool / infraestrutura de dados para IA (SaaS B2D)
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/hydradb.md`

---

## O que é

Um número de destaque (métrica, %, contagem) que **sobe rolando dígito a dígito** até o valor
final quando entra na viewport. No HydraDB aparece na faixa de stats logo abaixo do hero
(recall %, tokens/stack, accuracy) — cada dígito é uma coluna vertical de 0–9 que desliza e
para no algarismo certo, como um odômetro de carro ou o painel de aeroporto. No scrape isso
vaza como a sequência `0123456789` repetida por casa decimal.

## Por que marca

O olho é atraído por movimento, e um número que se **monta na frente do leitor** parece uma
medição ao vivo, não um dado escrito. O efeito faz o valor "assentar": a mente acompanha a
contagem e registra o número final com mais peso do que se ele já estivesse parado. É barato,
não depende de imagem, e dá ar de instrumento/telemetria — casa com produto técnico, dashboard
e qualquer peça que queira dizer "isto foi medido". Funciona melhor com **um a quatro números**;
em bloco denso vira ruído (ver antipadrão de densidade no teardown do HydraDB).

## Como recriar

- **Técnica:** cada dígito é uma coluna com os algarismos 0–9 empilhados; anima-se o
  `translateY` da coluna até alinhar o dígito-alvo na janela visível (`overflow:hidden` no
  contêiner do dígito). Alternativa mais simples: interpolar o valor numérico via JS
  (`requestAnimationFrame`, easing de desaceleração) e reescrever o texto a cada frame — menos
  bonito no rolar, mas trivial. Disparar com `IntersectionObserver` quando o bloco entra na tela.
- **Biblioteca detectada:** site é **Framer** (componente nativo de contador). Fora do Framer,
  dá pra fazer em **CSS puro + JS vanilla**; com GSAP fica mais liso (tween de um objeto
  `{val:0}` + `onUpdate`). Não precisa de WebGL nem lib pesada.
- **Snippet:** ainda não vendorizado. Candidato a virar `_biblioteca/motion/snippets/` se
  reaparecer. Por ora, o caminho GSAP acima resolve.
- **Custo honesto:** leve. Cuidado com **layout shift**: reservar a largura final do número
  (usar `font-variant-numeric: tabular-nums` ou largura fixa) pra não empurrar o texto ao lado
  enquanto conta.

## Onde cabe

- **Permita-se Fitness (cliente #2):** número de **modalidades** (6+), de alunas ativas, de
  anos de estúdio — dado factual da operação subindo ao entrar na tela. Evitar promessa de
  resultado físico (regra da conta), mas contagem institucional é livre.
- **Icarus** (produto de IA da Horus): faixa de métricas do agente (tarefas resolvidas, tempo
  economizado) — mesmo gênero de landing técnica.
- **Site institucional da Horus** (`site/`): "X clientes atendidos", "Y peças entregues" —
  números **reais e verificáveis** da agência.
- **Dr. Giovanni (cliente #1), só dado institucional:** anos de atuação, nº de profissionais.
  Nunca métrica de desfecho clínico — compliance CFO trava (ver Cuidado).
- **Relatório de resultado** de cliente onde o dado é factual e já aconteceu (não projeção).

## Cuidado

- **`prefers-reduced-motion`:** obrigatório respeitar (`_memoria/design/60-motion.md`). Com a
  preferência ativa, mostrar o número final estático, sem rolagem.
- **Compliance (cliente regulado):** o mecanismo é neutro, mas **o número que ele exibe pode
  virar promessa**. Em odonto (Dr. Giovanni) e psicologia (Aion, Mayara), número animado de
  "resultado" ou "cura" é vedado — não animar métrica de desfecho clínico. Serve só pra dado
  institucional/factual (nº de anos, de profissionais, de atendimentos já realizados), nunca
  pra insinuar eficácia.
- **Só número real.** Contador chama atenção pro valor; por `_memoria/integridade.md`, se o
  dado não existe, não se inventa um bonito pra rolar. Dado que falta continua `[FALTA: ...]`.
- **Não usar em excesso.** O próprio HydraDB abusa (empilha stats + gráfico + tabela). Um bloco
  de contadores por página basta.
