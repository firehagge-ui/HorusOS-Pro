# Inspiração: caça-palavras como prova de amplitude

- **Tipo:** secao (também poderia morar em interacao)
- **De onde:** Cofounder — https://cofounder.co/
- **Segmento de origem:** SaaS horizontal / plataforma de agentes de IA pra fundador
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/cofounder.md`

---

## O que é

A seção "Build across industries" resolve o pior bloco de todo produto
horizontal — provar que serve pra muita coisa sem virar uma parede genérica de
casos de uso. Em vez de listar os nichos numa grade, ela os **esconde num
caça-palavras**: uma malha de letras onde estão cravados AI PLATFORM, VOICE
AGENT, YOUTUBE CHANNEL, VIBE CODING IDE, CONTENT WRITER, GROWTH AGENCY, SUPPORT
AGENT etc., com as palavras destacadas na grade.

## Por que marca

Lista de doze itens o olho pula; caça-palavras o olho **lê**, porque achar cada
palavra é uma micro-tarefa que prende a atenção por segundos. O mecanismo é
transformar leitura passiva (rolar por bullets) em busca ativa (procurar a
palavra), e a busca ativa faz o leitor efetivamente registrar cada caso de uso —
que é o objetivo do bloco. De quebra, comunica a personalidade lúdica da marca
sem uma linha de copy. É a solução mais elegante que vi pro problema de "amplitude
sem soar genérico".

## Como recriar

- Grade CSS de monospace (cada letra numa célula quadrada), palavras-alvo
  posicionadas na horizontal/vertical e o resto preenchido com letras aleatórias.
  As células das palavras ganham uma borda/destaque (contorno arredondado no
  original).
- Versão estática: só o destaque visual, sem interação — já entrega o efeito.
- Versão interativa: hover/tap num grupo destacado mostra um tooltip com o nicho.
  Cuidado de custo aqui (ver abaixo).
- **Biblioteca detectada:** CSS puro provável (Tailwind no site). Nada de WebGL.
- **Snippet:** não vendorizado ainda. Se virar recorrente, cabe um gerador em
  `_biblioteca/motion/snippets/`.
- **Custo honesto:** a versão estática é barata e segura. A interativa exige
  hit-area bem-feita e teclado/foco pra não excluir quem não usa mouse — se
  travar ou ficar ilegível no mobile de 390px, frustra mais do que encanta.

## Onde cabe

Resolve o bloco de **amplitude** — provar que uma marca cobre muita coisa sem virar
parede de bullets. Encaixe do roster:

- **Site da própria Horus — encaixe mais forte:** o range da casa (os ~33 estilos de
  design, ou os serviços: site, carrossel, tráfego, SEO, bot) escondido numa grade.
  "Escolha o que a Horus faz" combina com a linguagem de agência-com-IA.
- **Permita-se Fitness (cliente #2):** as **modalidades** (hidro, pilates, zumba, boxe,
  dança, ballet kids, nutricionista) cravadas na malha — amplitude que é o próprio
  argumento do estúdio multi-modalidade.
- **Aion Psicologia (cliente #3):** os seis serviços distintos, se a densidade a 390px
  permitir e o tom ficar sóbrio (CFP).
- **Icarus:** os tipos de tarefa que o agente cobre.

**Adaptação obrigatória:** só entra se as palavras forem verdadeiras (nada de encher a
grade com serviço que a marca não entrega — barra `integridade.md`), e a legibilidade a
390px manda: se não couber, vira lista honesta.

## Cuidado

`prefers-reduced-motion` se houver qualquer animação de destaque. Legibilidade
mobile é o gargalo real — grade de letras encolhe rápido demais. E a regra de
integridade acima: gamificar amplitude não autoriza inflar a lista. Hex e fonte
do original marcados como **aparentes** onde não vieram do `branding` (a grade usa
o monospace `departureMono`, esse veio do scrape).
