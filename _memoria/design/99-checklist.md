# Checklist de site — Horus

> Criado em 26/07/2026, a partir do estudo de três sites de psicologia que o
> Marcelo mandou como referência (Giuli Ragno, Valéria Movio, Pataquini) e da
> auditoria do site da Aion. Objetivo: acertar de primeira, sem depender de
> rodada de correção.
>
> **Rodar este checklist ANTES de escrever a primeira linha de HTML**, e de novo
> antes de entregar.

---

## 1. Estrutura mínima de uma one-page de serviço

Ordem que funciona, na sequência em que a pessoa decide:

1. **Hero** — promessa curta + prova imediata (anos de casa, registro profissional, especialidade) + CTA
2. **Para quem é / Quando procurar** — situações escritas em primeira pessoa, onde a pessoa se reconhece
3. **O que fazemos** — os serviços, cada um com **pelo menos uma linha** de descrição
4. **Como começa** — três passos numerados, tirando o medo do primeiro contato
5. **Quem atende** — foto, nome, registro profissional, formação
6. **Onde/como é** — espaço, ambiente
7. **FAQ** — as perguntas que a pessoa tem vergonha de fazer, incluindo preço e formato
8. **Onde ficamos + CTA final** — mapa, dados, botão

O bloco 2 é o que mais converte e o mais esquecido. O bloco 4 é o antídoto da
ansiedade de quem nunca contratou o serviço.

## 2. Tipografia

- **Serifa nos títulos** é o que separa site caro de site de template em
  serviço profissional (saúde, direito, consultoria). Os dois sites bons usavam
  serifa; o ruim usava sans em tudo.
- **Poppins, Montserrat e DM Sans em título = cara de site feito por IA.** Só usar
  se a marca do cliente já for aquilo, e nesse caso avisar o cliente da limitação.
- Corpo com no mínimo 17px. Público acima de 50 anos lendo no celular é regra em
  saúde, não exceção. **E o piso vale principalmente no celular:** o reflexo de
  botar `body{font-size:16px}` dentro do media query de mobile derruba o corpo
  justamente no aparelho em que esse público lê. No mobile encolhe espaçamento,
  não texto. *(Caso da Aion, 28/07/2026: tinha 16,5px abaixo de 768px.)*
- **Um sistema de tipos tem 6 a 9 tamanhos, não 28.** Valores separados por 1 a 3
  centésimos de rem (`.92`, `.93`, `.94`, `.95`) são a mesma coisa com nomes
  diferentes: ninguém vê a diferença, e o próximo que mexer inventa mais um. Definir
  a escala antes e só usar o que está nela. *(A Aion tinha 28 e ficou com 9.)*
- Máximo de três famílias na página, contando a do logotipo.
- **Nada funcional abaixo de 11px.** Link, botão, item de menu, rótulo, célula de
  tabela, linha de rodapé. Só letra miúda jurídica não interativa desce a 10px.

## 2.5. Contraste da paleta terrosa (medido, e já corrigido uma vez)

A paleta creme + terracota funciona no olho e **reprovava na régua**. Caso
fechado da Aion, 28/07/2026: o detector achou 35 falhas de contraste, e a correção
que resolveu está descrita abaixo. Vale como receita, não como defeito pendente.

**O que reprovava:**

| Combinação | Contraste | Veredito |
|---|---|---|
| terracota `#D65F45` sobre creme `#FAF2EA` | 3,4:1 | reprova em corpo (exige 4,5:1) |
| marrom `#7a675c` sobre areia `#F2E3D5` | 4,3:1 | reprova por pouco |
| terracota escura `#B84B33` sobre areia `#F2E3D5` | 4,1:1 | reprova |
| terracota `#D65F45` sobre tinta `#2e2420` | 4,0:1 | reprova |

**O que resolveu, sem trocar a identidade:** manter a terracota como cor de marca e
**criar um degrau escuro só para texto pequeno e link**. Hoje o site tem
`--terracota-hov:#9E3F2B`, que dá **5,9:1** sobre o creme, e a terracota original
ficou em título grande e preenchimento. O detector saiu de 35 falhas para zero
sem a paleta perder o rosto.

A regra que fica:

- **Terracota é cor de título grande e de preenchimento**, não de texto corrido
  nem de link no meio do parágrafo. Acima de 24px o piso cai pra 3:1 e ela passa.
- **Link e texto pequeno pedem o degrau escuro** da mesma cor, mirando 4,5:1
  contra o fundo em que ele realmente está. Uma paleta terrosa de verdade tem
  três degraus: marca, escuro para texto, e hover.
- **O fundo importa:** a mesma terracota tem contraste diferente sobre `#FAF2EA` e
  sobre `#F2E3D5`. Medir contra o fundo real da seção, não contra o fundo da página.
- ⚠️ **Nem toda cor da paleta do cliente serve de fundo de seção, e isso pega quem
  já mediu contraste.** No Grão da Serra (30/07/2026) o contraste foi calculado
  contra o fundo da página `#3D2115`, onde tudo passava, e o `#764D36` da paleta
  oficial foi usado como fundo das seções alternadas. Sobre ele, creme dá 4,44:1 e
  dourado 3,63:1: **15 reprovações no detector**, num CSS escrito depois de ler
  esta própria regra. A saída foi criar um **degrau intermediário** (`#54321F`,
  creme 6,92:1) e rebaixar o tom original a **borda apenas**. Paleta de muitos tons
  análogos quase nunca tem um fundo de seção utilizável pronto: ou se cria o degrau,
  ou o alternado de fundo sai do projeto.
- Público de saúde tem leitor acima de 50 anos. Aqui o 4,5:1 não é burocracia.
- **Texto que a norma obriga a mostrar** (CRP, CRO, responsável técnico) não recebe
  `opacity` decorativa. Ver a entrada correspondente em `90-antipadroes.md`.

## 3. Peso e desempenho

- **Nenhuma imagem entra em PNG.** Converter tudo para WebP e redimensionar para
  o tamanho real de exibição (2x no máximo, para telas retina).
  `ffmpeg -i in.png -vf "scale=LARGURA:-1:flags=lanczos" -c:v libwebp -quality 82 out.webp`
- Meta de peso da home: **abaixo de 1 MB** somando tudo.
- Imagem gerada por IA sai em 2k ou 4k e pesa megabytes. Converter **sempre**,
  antes de referenciar no HTML.
- `loading="lazy"` e `decoding="async"` em tudo que está abaixo da dobra.
- `width` e `height` em toda `<img>`, para não pular o layout ao carregar.

## 4. Antes de dizer que está pronto

- [ ] **Detector rodado e zerado ou justificado:**
      `npx --yes impeccable@3.5.0 detect "clientes/<nome>/site"`
      (saída `0` = limpo, `2` = achou coisa. Regra de acessibilidade se corrige,
      não se dispensa. Detalhe em `.claude/skills/verificar/SKILL.md`)
      **A justificativa vai por escrito no `CLAUDE.md` do cliente**, não no chat:
      achado justificado só em conversa volta como achado na próxima sessão.
      ⚠️ **Quirk conhecido do `tight-leading`:** ele lê `line-height` sem unidade
      como se fosse `rem`. Um `line-height:1.4` vira 22,4px, e ele divide isso pelo
      font-size real do elemento. Com corpo em 17,5px isso dá 1,28 e "reprova" um
      1,4 que está correto. Sintoma: várias ocorrências de exatamente 1,28x sem
      apontar elemento. Conferir a conta antes de mexer no design.
      *Descoberto na Aion, 28/07/2026, depois de subir o corpo de 16,5 para 17,5px.*
      ⚠️ **Segundo quirk, `cramped-padding` com `clamp()`:** ele não resolve
      `clamp()` em `padding` e trata o valor como zero. Uma faixa com
      `padding:clamp(76px,9vw,116px) 0` é acusada de "children flush against bg"
      tendo 116px de folga. O sintoma que confirma: numa seção com
      `padding:44px 0 clamp(...)` ele acusa **só a base**, nunca o topo literal.
      A saída é trocar por valor literal + media query, que é o padrão que o resto
      do CSS já usa, e **não** dispensar a regra: `cramped-padding` legítimo é
      defeito real e dos mais fáceis de ver.
      *Descoberto na Aion, 01/08/2026, nas faixas de cor das páginas de serviço.*
- [ ] Favicon (32px e 180px)
- [ ] Imagem de compartilhamento 1200x630 + tags `og:` (senão o link no WhatsApp vira retângulo cinza)
- [ ] `schema.org` LocalBusiness com endereço, telefone, e-mail e redes
- [ ] Política de privacidade linkada no rodapé, se existir qualquer formulário
- [ ] `noindex` retirado no dia da publicação, e não antes
- [ ] Uma checagem em 390px de largura, não só no desktop
- [ ] Peso da página conferido

### Como olhar em 390px de verdade (armadilha)

O Chrome tem **piso de ~500px** para `--window-size`. Pedir `--window-size=390,844`
no headless devolve um render de **500px cortado em 390**, e a imagem mente: o menu
do celular aparece "sumido" e o texto aparece "estourando", porque o que está fora
dos 390 é só a parte cortada. Isso já custou uma caçada a um bug que não existia.

O jeito certo é emular a largura com um iframe, que tem viewport próprio:

```html
<!-- moldura.html, aberto numa janela de 500 ou mais -->
<style>html,body{margin:0}iframe{border:0;width:390px;height:844px}</style>
<iframe src="file:///caminho/site/index.html"></iframe>
```

```bash
chrome --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=500,844 --virtual-time-budget=8000 \
  --screenshot=out.png "file:///caminho/moldura.html"
```

Depois recortar os 390px da esquerda. Duas coisas mais:

- **`--force-device-scale-factor=1` sempre.** Sem isso o Chrome escala o render e
  toda medida tirada do print sai errada.
- **Para ver seção de baixo**, usar fragmento no `src` do iframe
  (`index.html#equipe`). Fragmento funciona dentro do iframe; na janela direta o
  `scroll-behavior:smooth` não completa a rolagem antes do print e a foto sai
  branca (elementos `.rev` ainda em `opacity:0`).

## 5. Regras de conteúdo em cliente de saúde

- Registro profissional visível para cada pessoa citada **e** para a pessoa jurídica
- Sem depoimento, sem antes/depois, sem promessa de resultado, sem superlativo,
  sem preço como chamariz, sem autoteste ou quiz de diagnóstico
- "Para quem é" descreve **situações**, nunca sintomas em formato de teste
- Dado que não temos vira placeholder marcado, nunca texto plausível inventado
- Clínica de saúde mental leva faixa de crise (CVV 188, emergência 192)

## 6. Como apresentar

- Ter um jeito de **esconder as marcações de pendência** na hora de mostrar para o
  cliente. Quinze marcações laranja na tela fazem o trabalho parecer inacabado,
  mesmo quando o que falta é informação que só o cliente tem.

---

## Referências estudadas

- `https://giuliragnopsi.vercel.app/` — a melhor das três. Serifa, terracota sobre
  creme, "para quem é" em primeira pessoa, três passos, FAQ de nove perguntas
- `https://www.psivaleriamovio.com.br/` — Marcellus + Poppins, paleta terrosa,
  confirma o caminho cromático
- `https://pataquinipsicologia.com/` — contraexemplo. WordPress com Elementor,
  roxo, sans em tudo, sombra em botão. É o visual a evitar
