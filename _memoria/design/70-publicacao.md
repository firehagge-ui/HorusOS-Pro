# Publicação de site (colocar no ar)

> Criado em 11/08/2026, na primeira publicação de um site da Horus (Café Grão da
> Serra, Netlify). O `99-checklist.md` cobre "antes de entregar"; este cobre o passo
> seguinte, "colocar no ar". Ler antes de publicar qualquer site de cliente.

O detector limpo e o site aprovado **não** são o mesmo que "no ar". Publicar tem
passos próprios, e pular um deixa o site trancado, sem preview de link, ou expondo
rascunho. A ordem abaixo é a que funcionou.

## Antes de gerar o deploy

1. **Tirar o modo demonstração** do HTML, se existir:
   - Remover `<meta name="robots" content="noindex, nofollow">` (senão o Google
     nunca indexa). Só remover quando for publicação pública de verdade.
   - Remover a barra "Demonstração", o botão "Ver versão limpa" e **o JS que os
     controla** (senão `getElementById` devolve `null` e quebra o console).
   - Tirar as marcações de pendência (`.pend`) **só do que foi confirmado**. Dado
     ainda não confirmado não vira site público sem marcação — isso é `integridade.md`,
     não muda na publicação.
2. **Limpar a pasta que vai ao ar.** Nela fica só o que é entrega: `index.html`,
   `404.html`, `robots.txt`, `netlify.toml`, `sitemap.xml`, `assets/`. Versões de
   exploração, `ARQUITETURA.md`, CSS de rascunho e afins vão para fora (`site-fontes/`
   ou a raiz do cliente). O que estiver na pasta é servido, mesmo sem link.
3. **Arquivos de deploy** (uma vez por site):
   - `netlify.toml` — `publish="."`, sem build; cache `immutable` de 1 ano para
     `/assets/*`, HTML sempre revalidado, headers de segurança
     (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
   - `404.html` — página de erro na identidade do cliente (não a padrão do Netlify).
   - `robots.txt` — `Allow: /` mais a linha `Sitemap:` (depois que tiver a URL).

## Publicar no Netlify

- **Rápido:** arrastar a pasta do site em **app.netlify.com/drop**. O `netlify.toml`
  na raiz do que for arrastado é lido.
- **Contínuo (Git):** conectar o repo, **base directory** = a pasta do site,
  **publish** = `.`, **build command** vazio.
- **Renomear o site** em Site settings (o nome aleatório vira `cliente.netlify.app`).

### Se a URL não abrir, os dois erros de estreia

- **401 (não autorizado)** = proteção por senha ligada. Desligar em
  Site configuration → Access & security → Visitor access.
- **404 em tudo, inclusive nos assets** = nenhum deploy foi **publicado em produção**.
  Na aba Deploys, abrir o último e clicar em **Publish deploy**. (A URL com hash na
  frente é o snapshot de um deploy; a URL sem hash é a de produção.)
- Conferir por HTTP antes de cantar vitória: home `200`, um asset `200`, uma rota
  inexistente servindo o `404.html`.

## Depois que a URL existir

1. **`og:image`, `og:url`, `canonical` e `twitter:image` absolutos** com o domínio
   real. Sem isso, o link compartilhado no WhatsApp/Instagram abre como retângulo
   cinza, e é o primeiro contato de metade das pessoas.
2. **`sitemap.xml`** com a URL real e a linha `Sitemap:` no `robots.txt`.
3. Atualizar também o **JSON-LD** (`url`, `image`) com o domínio.
4. ⚠️ **Esses ajustes só valem num NOVO deploy** — republicar depois de fazê-los.
5. **Divulgar o link** onde ele trabalha: Google Meu Negócio, bio do Instagram,
   WhatsApp Business. Site publicado e não divulgado não traz ninguém.

## Registrar

A URL de produção é fato durável: gravar no `CLAUDE.md` do cliente (topo) e no
`_memoria/estrategia.md`. Marcar o status do site de "em produção" para "no ar" com a
data.
