# BASALT — site de suplemento (peça de prática)

> ⚠️ **Marca fictícia, peça de portfólio/prática.** Não é cliente real. Nenhum
> número clínico é atribuído à marca como se fosse ensaio próprio: o que aparece
> sobre creatina é ciência de domínio público (creatina monohidratada é dos
> suplementos mais estudados, dose usual ~5 g/dia). Num cliente real, cada dado de
> pureza, lote e certificação viraria `[FALTA: ...]` até o cliente confirmar. As
> fotos (pote e macro do cristal) têm slot preparado e prompt pronto pro Marcelo
> gerar no ChatGPT — eu não invento imagem.

## Conceito

**Basalt** — rocha vulcânica, densa, a base. Suplementação **fundacional**: o
oposto do suplemento-fogos-de-artifício. Produto-herói: **creatina monohidratada
pura**, o suplemento mais baseado em evidência que existe (casa com "encenar a
prova"). Voz: sóbria, mineral, sem hype.

## Passe 1 — o plano

```
COR   --basalto  #17181A  fundo escuro / hero / seção-prova (o material)
      --pedra    #ECE6DC  fundo claro mineral quente (base clara)
      --cal      #F7F4EE  cartões / faixa clara sobre pedra
      --tinta    #14161A  texto principal sobre claro
      --grafite  #575C63  texto secundário sobre claro (mede 5.6:1 s/ pedra)
      --cobre    #B5623A  ACENTO único: metal oxidado, mineral, não-neon
      --cobre-cl #D98A5E  cobre clareado p/ texto/detalhe SOBRE basalto escuro
      --cobre-es #8A4520  degrau escuro p/ link e texto pequeno SOBRE claro (4.5:1+)

TIPO  Display  "Bricolage Grotesque"  — grotesk editorial-industrial, tem caráter,
               NÃO é Poppins/Montserrat/DM Sans/Fraunces (as proibidas)
      Corpo    "Hanken Grotesk"       — sans limpa de leitura, não gasta
      Dado     "Spline Sans Mono"     — SÓ em dose/número/medida (uso legítimo de
               mono: dado, não figurino "técnico")

LAYOUT (ordem = jornada de decisão do comprador, do teardown dos 3 sites)
  1. HERO (basalto)      wordmark · título forte · dose · slot foto do pote · 1 CTA
                         ── assinatura de motion: título por palavra + reveal ──
  2. Faixa credencial    mono, 3-4 rótulos duros (testado por 3º, grau farmacêutico,
     (cal)               sem aditivo). Sem contador subindo.
  3. Para quem é         coluna única, 2ª pessoa, situação concreta. NÃO grid de ícone.
     (pedra)
  4. ★ O MECANISMO ★     "5 gramas, dissecados" — a ASSINATURA. Seção pin+scrub:
     (basalto)           o macro do cristal se decompõe conforme rola, encenando
                         pureza (nada de enchimento). Objeto-prova, não infográfico
                         vetorial genérico. Inspiração: WRK Timepieces (acervo).
  5. Como tomar          3 passos numerados: quando, quanto, com o quê. Tira a dúvida.
     (cal)               (antídoto de ansiedade de quem nunca tomou)
  6. A linha             grid de 3, cada produto com 1 linha de descrição. repeat(3,1fr).
     (pedra)
  7. O que NÃO tem       o freio virado venda (espelha Ritual): rótulo aberto, sem
     (basalto)           corante, sem enchimento. Objeto = o rótulo do pote, não chips.
  8. FAQ                 acordeão <details> nativo, 8 perguntas chatas (funciona? é
     (pedra)             seguro? preciso ciclar? e o rim? retém líquido?).
  9. CTA final + rodapé  disclaimer (não é medicamento, não substitui alimentação,
     (basalto)           procure profissional). Sem selo/CNPJ inventado.

ASSINATURA  a seção 4 (o cristal que se decompõe no scroll). UMA ousadia. Todo o
            resto fica quieto: tipografia forte + contraste pedra/basalto + cobre.
```

## Passe 2 — ataque ao plano

**"Eu chegaria nesse plano pra qualquer marca de suplemento?"**

- Branco + sans neutra + números + infográfico de cápsula = **SIM, é o reflexo do
  nicho** (as 3 referências convergem nisso). → Por isso a base **não é branca**:
  é mineral basáltica (pedra quente + basalto escuro); o acento é **cobre-oxidado**
  (material), não o teal/azul-clínico do segmento nem neon de academia; o display é
  **Bricolage Grotesque** (caráter), não a sans invisível do nicho. Escolha, não reflexo.
- A seção-mecanismo existe em todo concorrente → mas a minha encena o **material real
  da marca** (cristal se decompondo, amarrado ao nome Basalt), não um vetor de cápsula.
  Passa nas 4 perguntas do conceito-assinatura (`60-motion.md`): prova a tese (tira o
  cristal, cai o argumento de pureza); o argumento vem antes ("5 g, nada além"); tem
  porta de saída (CTA no hero); produto é físico, material provando é honesto.
- Nome "Basalt" no nicho → ninguém usa pedra vulcânica (usam energia/ciência). Foge.

## Motion (teto: 1 assinatura)

- **Assinatura:** a seção 4, pin + scrub do cristal (a única ousadia grande).
- Scroll suave (Lenis) + entrada em cascata sutil (stagger) nas listas.
- Título do hero por palavra (SplitText).
- `prefers-reduced-motion` desliga tudo; conteúdo visível sem JS.

## Compliance de alimento (não é conselho regulado, mas vale)

Sem alegação de cura/funcional, sem superlativo, sem promessa de resultado. Afirmação
sobre creatina fica no que a ciência estabeleceu, em linguagem informativa. Disclaimer
no rodapé.
