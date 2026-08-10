# Dez sites de agência de marketing com IA

> Consolidado de 05/08/2026, a partir de dez links que o Marcelo mandou como
> referência para o site da própria Hórus. Não é teardown individual: é o
> **denominador comum** dos dez, que é o que ele estava apontando.
>
> Método: print em 1440px de cada um mais scrape de texto dos que rendem
> estrutura (Vexuno, LucrOS, Synthai). Prxmo, Navbar e Menzzo são pesados de JS
> e vieram parciais.

| Site | Segmento | O que ensina |
|---|---|---|
| [agenciavexuno.com.br](https://agenciavexuno.com.br/) | Agência de IA, BR | Hero de foto em tela cheia, título centralizado com a terceira linha em rosa. Esteira de capacidades no rodapé do hero |
| [site-lucros.vercel.app](https://site-lucros.vercel.app/) | Agência de IA, BR | **A mais completa e a mais próxima do caso da Hórus.** Estrutura inteira abaixo |
| [gmxdigital.com](https://gmxdigital.com/) | Estúdio digital | Preto absoluto com campo de estrelas. Título em caixa alta, segunda linha em gradiente |
| [helloupdigital.com](https://www.helloupdigital.com/) | Agência, EUA | Cada case é um **planeta** navegável no fundo. Verde-limão como acento único |
| [ellis.digital](https://ellis.digital/) | Agência, UK | Hero tipográfico puro, sem CTA acima da dobra. Forma 3D iridescente embaixo |
| [prxmo.com.br](https://prxmo.com.br/) | Agência, BR | JS pesado, veio parcial |
| [navbardigital.com](https://navbardigital.com/) | Agência | Tela de carregamento com contador. Verde-limão sobre preto |
| [menzzo.com.br](https://www.menzzo.com.br/) | E-commerce de móveis | Fora do segmento, veio parcial |
| [remak.vercel.app](https://remak.vercel.app/) | Template SaaS | Muro de logos logo abaixo do hero. Preço com plano em card |
| [synthai.demos.tailgrids.com](https://synthai.demos.tailgrids.com/) | Template de IA | Passos 01/02/03 com ícone. Grade de integrações. FAQ em acordeão |

---

## O denominador comum

Nove ou dez dos dez fazem tudo isto:

1. **Fundo quase-preto**, entre `#000000` e `#0B0D12`. Nenhum é claro
2. **Um acento saturado só**, usado com força: rosa (Vexuno), dourado (LucrOS),
   verde-limão (Helloup, Navbar), gradiente frio (GMX)
3. **Título gigante**, 64px ou mais, tracking fechado, e **um pedaço dele na cor
   de acento**. Quase sempre a segunda linha inteira
4. **Rótulo miúdo em caixa alta com tracking largo** acima do título, com um
   ponto ou um fio na frente, muitas vezes dentro de uma pílula
5. **Botão em pílula**, primário preenchido com o acento, secundário só de fio
6. **Uma arte grande e cinematográfica** ao lado ou atrás do título: personagem
   3D (LucrOS), foto de pessoa (Vexuno), forma abstrata (Ellis), espaço (GMX)
7. **Trinca de números** logo abaixo do CTA
8. **Esteira horizontal** de capacidades ou de logos, uma por página
9. **Passos numerados** 01/02/03
10. **FAQ em acordeão** no fim, antes do contato

## A estrutura da LucrOS, que é a mais próxima do caso da Hórus

Ela se descreve como "agência de IA, sistema operacional do negócio", que é quase
literalmente a Hórus sobre o MazyOS. Ordem da home dela:

```
hero (rótulo, título, lead, 2 CTAs, 3 números, personagem 3D)
demonstração do sistema em 4 abas com mockup animado
"agência entrega serviço, a LucrOS instala um sistema"   ← comparação em 2 colunas
o que entrega (4 serviços)
escala com você (3 portes de cliente)
como funciona (01, 02, 03)
portfólio (cards com print real e link)
founder (história em primeira pessoa)
formulário em 3 passos que termina no WhatsApp
```

**O que vale copiar de método, não de texto:** a seção de comparação. Ela nomeia
o jeito comum do mercado e coloca o seu ao lado, sem citar concorrente. É o mesmo
recurso do comparativo "especial × tradicional" do teardown da Fazenda São
Gabriel, e serve para criar critério de compra.

**O que não dá para copiar:** a LucrOS mostra print de dois clientes reais com
link. A Hórus não tem autorização de portfólio de ninguém.

---

## O que a Hórus adotou, e o que recusou

Adotado no site da agência (`site/`), com o motivo:

| Item | Por quê |
|---|---|
| Fundo quase-preto | O `#0A0B0F` foi **medido** no PNG da marca, não estimado |
| Acento único | O azul `#2563EB` já era da marca |
| Título com pedaço no acento | Presente em nove dos dez |
| Rótulo em pílula acima do título | Presente em nove dos dez. **Exige exceção registrada no detector**, ver abaixo |
| Botão em pílula | O antipadrão da casa já autorizava pílula em botão e tag |
| Arte grande e cinematográfica | Forma 3D abstrata em azul e dourado, escolha do Marcelo |
| Trinca de números | Só que os três são **verificáveis no repositório** |
| Esteira horizontal | Uma por página, que é o teto da casa |
| Comparação em duas colunas | Melhor achado do estudo |
| Passos numerados e FAQ | Já estavam na anatomia da casa |

Recusado, com o motivo:

- **Gradiente em texto** (GMX). Some no celular, quebra no modo escuro e não
  copia direito. Continua proibido
- **Número de efeito** ("+5.000 atendimentos", "Trusted by 5000+"). A Hórus tem
  quatro clientes e escreve quatro
- **Depoimento** (Synthai, Remak). Nenhum cliente autorizou, e em psicologia é
  vedado mesmo autorizado
- **Case com nome e print** (LucrOS, Helloup). Mesma trava de autorização
- **Formulário** (LucrOS). Sem servidor, ele engolia a mensagem

## A exceção que este estudo criou

`kicker-above-heading` está dispensado **só em `site/**`**, com motivo escrito em
`.impeccable/config.json`. O detector do impeccable proíbe o rótulo acima do
título em qualquer lugar; a regra da casa é mais frouxa (teto de 1 a cada 3
seções) e aqui nem ela é cumprida, porque as nove seções têm rótulo.

**A dispensa não vale para site de cliente.** Briefing explícito vence regra
genérica, e o briefing explícito aqui é do Marcelo sobre a marca dele.
`all-caps-body` continua cobrada: rótulo acima de 30 caracteres reprova, e foi
por isso que o do hero encolheu de "Agência de marketing com IA · Salvador" para
"Agência com IA · Salvador".
