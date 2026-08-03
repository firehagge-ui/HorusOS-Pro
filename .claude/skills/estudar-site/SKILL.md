---
name: estudar-site
description: Estuda um site de referência e gera um teardown estruturado em referencias/. Use quando o Marcelo mandar uma URL para analisar, pedir para estudar concorrentes de um cliente, ou disser "estuda esse site", "faz o teardown de", "/estudar-site <url>". Também use por conta própria antes de começar um site novo, para estudar 3 a 5 concorrentes do segmento do cliente.
---

# Estudar site

Transforma uma URL num teardown que fica no repositório e vira contexto nas
próximas vezes. Navegar não ensina; teardown ensina. O objetivo é que a decisão
de design pare de sair do viés médio do modelo e passe a sair de referência real.

## Quando usar

- O Marcelo mandou uma URL para analisar
- **Antes de começar qualquer site novo**, com 3 a 5 concorrentes do segmento do
  cliente. Concorrente do nicho ensina mais que galeria premiada
- Quando aparecer um site excelente fora do segmento, para não ficar só
  reproduzindo a média do nicho

## Como fazer

### 1. Coletar

Duas passadas com o Firecrawl, porque uma só não dá o que precisa:

```
firecrawl_scrape url=<url> formats=["branding"]
firecrawl_scrape url=<url> formats=["markdown"] onlyMainContent=true
```

O `branding` devolve fontes, hex da paleta, raio de canto, sombra de botão e
tecnologia. O `markdown` devolve a estrutura de seções e o texto, que é onde
está o aprendizado de copy.

Se precisar ver o layout, renderizar com o Edge headless em modo `--headless=old`
(o `new` é instável nesta máquina) e salvar o print junto do teardown:

```
msedge.exe --headless=old --disable-gpu --no-sandbox --hide-scrollbars
  --user-data-dir=<pasta temporária nova a cada execução>
  --window-size=1440,3000 --screenshot=<destino> --virtual-time-budget=9000 <url>
```

⚠️ Duas armadilhas conhecidas: usar um `--user-data-dir` novo a cada chamada,
senão a segunda falha por profile travado; e o viewport mínimo é ~477px, então
**não dá para verificar mobile por print** aqui.

### 2. Escrever o teardown

Um arquivo em `referencias/<nome-curto>.md`, seguindo o gabarito em
`referencias/_gabarito.md`. Regras do texto:

- **Descrever a decisão, não elogiar.** "Serifa nos títulos" não ensina nada.
  "Serifa alta de contraste nos títulos com sans neutra no corpo, o que dá ar de
  publicação e sustenta o argumento de autoridade da psicóloga" ensina.
- **Anotar a ordem das seções**, que é o que mais se reaproveita.
- **Anotar o que é ruim também.** Contraexemplo vale tanto quanto exemplo.
- Copiar trechos de copy que funcionam, com o motivo.

### 3. Fechar o ciclo

Se o teardown revelou um padrão novo ou um antipadrão novo, **registrar em
`_memoria/design/`** na mesma hora. Teardown que não vira regra é só um arquivo
parado.

Depois, uma linha em `referencias/README.md` com o site, o segmento e a lição
principal, para dar para varrer a biblioteca sem abrir tudo.

## O que olhar, na ordem

1. **Estrutura.** Que seções, em que ordem, e qual o trabalho de cada uma.
   Comparar com `_memoria/design/00-anatomia.md` e anotar as diferenças.
2. **Hero.** Promessa, prova, CTA. A prova aparece acima da dobra?
3. **O bloco "para quem é".** Existe? Como é escrito? Segunda pessoa?
4. **Tipografia.** Que famílias, que escala, que contraste entre título e corpo.
5. **Cor.** Quantos acentos de verdade. Onde o acento aparece e onde não aparece.
6. **Composição.** Quantas famílias de layout diferentes na mesma página.
7. **Imagem.** Real ou banco? Retrato ou ambiente? Como está cortada?
8. **Copy.** Registro, tamanho de frase, o que promete e o que evita prometer.
9. **Conversão.** Quantos CTAs, com que rótulo, onde estão.
10. **O que o site evita.** Às vezes a decisão mais forte é uma ausência.

## O que não fazer

- Não copiar layout inteiro para o cliente. Teardown é para entender a decisão,
  não para clonar. O que se reaproveita é a **estrutura e o raciocínio**, nunca a
  aparência.
- Não elogiar sem explicar o mecanismo.
- Não estudar só site premiado. Site premiado otimiza para júri de design; site
  de concorrente otimiza para o cliente comprar.
