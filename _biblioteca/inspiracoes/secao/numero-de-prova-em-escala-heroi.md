# Inspiração: o número de prova em escala de herói, de-riscado ao lado

- **Tipo:** secao (serve também como tratamento de hero)
- **De onde:** Hennessey Performance — https://www.hennesseyperformance.com/
- **Segmento de origem:** preparadora automotiva de alto desempenho (EUA)
- **Visto em:** 09/09/2026
- **Teardown irmão:** `referencias/performance-automotiva-cinco-sites.md` (lote de performance)

---

## O que é

Cada build da Hennessey é apresentado com **o número gigante como protagonista**, não a
foto nem o texto: "**800 HP** / HORSEPOWER", "**1.200 LB-FT** / TORQUE", em tipo enorme.
E logo ao lado, no mesmo cartão, o **antídoto de risco**: "**3 YEAR / 36,000 MILE**
LIMITED WARRANTY". O número é o desejo; a garantia é a permissão para desejar sem medo.

Não é "mais potência". É *o* número, medido, com uma unidade, grande o bastante para ser
a primeira coisa que o olho lê — e uma âncora de segurança encostada nele para o número
não soar irresponsável.

## Por que marca

1. **O número é a emoção; o adjetivo não é.** "Alta performance" é ruído de categoria.
   "800 HP" é um fato que o corpo sente. Dar escala tipográfica ao dado (e não à frase
   motivacional) é o que separa marca de performance de oficina que *fala* de performance.
2. **A garantia ao lado desarma a objeção antes dela nascer.** Potência grande dispara
   um medo automático ("vai estourar o motor / perder confiabilidade"). Colar a garantia
   no mesmo bloco responde o medo no mesmo segundo em que ele surge — desejo e segurança
   no mesmo golpe de olho.
3. **Escala cria hierarquia sem animação.** Onde não se quer (ou não se pode) animar, o
   contraste de tamanho entre o número (enorme) e o rótulo (miúdo, mono) faz sozinho o
   trabalho de dramatizar. A emoção vem da tipografia, não do movimento.

## Como recriar

- O número em display pesado, escala de herói (o maior tipo da tela); a **unidade e o
  rótulo** miúdos, em mono ou caixa-alta espaçada, logo abaixo/ao lado.
- No **mesmo cartão**, um segundo dado que reduz o risco: garantia, "medido no
  dinamômetro", "sem comprometer a confiabilidade", data da medição. É o par
  desejo + permissão.
- **Biblioteca detectada:** CSS puro basta. Grid do cartão: número dominante, rótulo
  secundário, âncora de risco num rodapé do cartão com régua fina.
- **Custo honesto:** zero de JS. O risco é de *conteúdo*, não de técnica: o número tem
  que ser real e medido (ver Cuidado).

## Onde cabe

- **Mullsanni (Lead #8) — encaixe mais forte:** os casos de dyno reais (`+56 whp`,
  `248 whp`) merecem escala de herói, não bar-chart de 14px. O de-risco é a própria
  doutrina da casa: "número medido no nosso dinamômetro, resultado varia por carro". O
  par vira: número grande + "medido no Servitec, antes e depois".
- **Grão da Serra / alimento:** um número real de processo ("48h de secagem", "torra em
  lote de X kg") em escala, de-riscado por "cada lote é provado antes de sair". Sem
  alegação de saúde.
- **Icarus / SaaS da Horus:** um benchmark datado em escala (à la HydraDB), de-riscado
  por "human in the loop" ou pela metodologia.
- **Própria Horus:** métrica de case não-redonda em tipo grande, de-riscada por como foi
  medida.

## Cuidado

- 🔴 **Só com número real e medido.** `integridade.md`: nada de arredondar nem inventar
  para "encher" a escala. Em escala de herói, um número inflado é mentira em corpo 120px.
  A Mullsanni inclusive se autocorrige em público sobre Stage 1 × 2 — o de-risco tem que
  ser honesto.
- 🔴 **Sem promessa.** O número é do carro X que já passou, não do carro de quem lê. A
  frase de variação ("cada motor responde diferente") é obrigatória perto do número.
- **Compliance regulado (saúde) proíbe:** nada de número de resultado clínico em escala,
  nada de antes/depois de paciente. Ali o padrão só serve para dado neutro (anos de casa,
  nº de profissionais), nunca para resultado prometido.
