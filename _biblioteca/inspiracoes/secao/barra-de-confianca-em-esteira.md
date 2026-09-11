# Inspiração: barra de confiança em esteira, logo abaixo do hero

- **Tipo:** secao (faixa de transição entre hero e corpo)
- **De onde:** Belloni Motors — https://www.bellonimotors.com/
- **Segmento de origem:** loja de seminovos premium (SP)
- **Visto em:** 09/09/2026
- **Teardown irmão:** `referencias/performance-automotiva-cinco-sites.md`

---

## O que é

Logo abaixo do hero, uma **faixa fina que repete em esteira** os motivos de confiar, cada
um em três a quatro palavras: "Procedência verificada · Seu usado na troca · Financiamento
aprovado · Documentação completa · Test drive sem compromisso · Atendimento de quem
entende". Roda devagar, em loop, e cobre **muitos argumentos de confiança sem gastar uma
seção inteira** para cada um.

É a ponte entre "cheguei no hero" e "vou ler o site": antes de qualquer bloco longo, o
visitante recebe uma rajada curta de razões para ficar.

## Por que marca

1. **Resolve o problema do "muitos diferenciais, pouco espaço".** Um negócio tem 6–8
   motivos de confiança; transformar cada um em seção alonga demais a página. A esteira
   entrega todos em uma faixa, como índice do que vem, sem competir com o conteúdo.
2. **Movimento mínimo prende sem distrair.** A rolagem lenta e horizontal é ambiente, não
   espetáculo — dá vida à faixa e sugere "tem mais aqui do que cabe na tela", sem a
   firula de uma animação grande.
3. **Ritmo.** Entre o hero (grande) e o primeiro bloco (denso), a faixa é uma respiração
   de baixa densidade que reseta o olho — o mesmo papel de uma faixa de logos de cliente.

## Como recriar

- Uma faixa de altura pequena, itens separados por bullet, duplicados em sequência para o
  loop não ter emenda visível. `translateX` contínuo; pausa no `:hover` é um plus.
- **Versão sem movimento:** os mesmos itens numa linha centralizada que quebra em grade no
  mobile. Perde o "tem mais", mantém a função de índice de confiança. **Preferir esta
  quando a diretriz do projeto é "sem animação".**
- **Biblioteca detectada:** CSS puro (`@keyframes` + `translateX`) resolve; não precisa de
  GSAP. Snippet de esteira infinita: candidato a `_biblioteca/motion/snippets/`.
- **Custo honesto:** trivial. O único cuidado é `prefers-reduced-motion` parar a esteira.

## Onde cabe

- **Mullsanni (Lead #8):** "Dinamômetro próprio · Representante ACF · Escape sob medida ·
  Scanner de concessionária · Medido antes e depois · 5,0 no Google" — troca a atual faixa
  estática de marcas atendidas por uma barra de confiança que trabalha mais.
- **Amparo Flores:** "Retirada na loja · Entrega em Salvador combinada · Desde 1972 · Foto
  real do arranjo" — sem copiar o "entrega em 1h" dos intermediários (trava do cliente).
- **Qualquer cliente com muitos motivos curtos de confiar** (comércio, serviço) onde
  alongar em seções seria desperdício.

## Cuidado

- 🔴 **`prefers-reduced-motion` desliga a esteira** (`60-motion.md`). Sem isso, é
  armadilha de acessibilidade, não inspiração.
- ⚠️ **Diretriz "sem grandes animações":** a esteira é motion pequeno e ambiente, mas se o
  projeto pediu contenção total, usar a versão estática. Não empurrar movimento onde o
  cliente pediu sobriedade.
- 🔴 **Cada item é um fato, não um superlativo.** "Procedência verificada" é fato;
  "o melhor atendimento" é vedado em regulado e fraco em qualquer lugar. Sem promessa.
- Item copiado de intermediário/concorrente que o cliente não cumpre (prazo, garantia)
  é mentira em loop — só entra o que o cliente entrega de verdade.
