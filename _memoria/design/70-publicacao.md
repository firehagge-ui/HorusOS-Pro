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

## Armadilhas que já custaram (site da Horus, 24 e 25/09/2026)

- **Arrastar a pasta ignora o `netlify.toml` que está fora dela.** Quando a pasta que
  vai ao ar é gerada por build (ex.: `site/_publish`), cabeçalhos e redirecionamentos
  vão em `_headers` e `_redirects` **dentro** dela, que valem por arrasto e por Git.
  Depois de todo deploy, conferir no ar com `curl -I` (o cabeçalho está lá?) e uma rota
  de redirecionamento. No site da Horus, a segurança e o `/sobre` estavam desligados no
  ar sem ninguém perceber.
- **Regra de segurança (CSP) se testa com o cabeçalho aplicado.** O servidor local não
  manda CSP, então tudo funciona na máquina e quebra no ar. Servir a pasta localmente com
  o mesmo cabeçalho e abrir no navegador antes de subir. Efeito 3D/WebGL que usa worker ou
  WebAssembly (ex.: gaussian-splats-3d) precisa de `worker-src blob:`,
  `connect-src blob:` e `'wasm-unsafe-eval'`; sem isso o hero sobe vazio.
- **Arquivo de origem não sobe.** PNG original ao lado do WebP que o HTML usa, vídeo de
  rodada antiga, fundo que saiu: tudo isso é servido se estiver na pasta. Varrer o que
  nenhum HTML/CSS/JS referencia antes de subir (no site da Horus: 33 MB viraram 12 MB).
- **Ícone na busca do Google:** tem que ser **quadrado e múltiplo de 48px** (48, 96,
  192), com `favicon.ico` na raiz. Símbolo retangular (96x80) ou PNG de 32px fazem o
  Google mostrar o globo genérico no resultado.

## Domínio próprio (Registro.br + Netlify)

1. Netlify → **Domain management** → **Add a domain** (`cliente.com.br`). O `www` entra
   junto e redireciona para o principal.
2. Registro.br → o domínio → **DNS** → **Configurar zona DNS** (aceitar o modo avançado):
   - **A**, nome vazio, valor `75.2.60.5` (balanceador da Netlify)
   - **CNAME**, nome `www`, valor `<site>.netlify.app`
3. Esperar de 30 min a algumas horas → **Verify DNS configuration** na Netlify. O https
   (Let's Encrypt) sai sozinho em seguida.
4. Trocar no código **todo** endereço antigo (`canonical`, `og:url`, `og:image`, sitemap,
   robots, JSON-LD) e subir de novo.
5. **Search Console:** propriedade do tipo **Domínio**, verificada por registro **TXT** no
   mesmo painel DNS do Registro.br; depois enviar `sitemap.xml` e pedir indexação da home.

## Perfil da Empresa no Google (armadilhas, perfil da Horus, 26/09/2026)

- **Área de atendimento só com as cidades atendidas de verdade.** "Brasil" ou o estado inteiro
  dilui o ranqueamento local; o Google orienta região de até ~2 h de deslocamento.
- **Nome sem palavra-chave.** O nome real da empresa ("Horus Agência"), não "Hórus Marketing
  Digital". Palavra-chave no nome arrisca suspensão; a categoria faz esse trabalho. Troca de
  nome passa por revisão (até 7 dias).
- **Atributo só se for verdade.** "Empresa de empreendedoras" = liderada por mulheres;
  agendamento on-line, idiomas: marcar só o que existe. Informação falsa arrisca suspensão.
- **Link de chat com o mesmo número do telefone do perfil.** Número diferente faz o Google
  reprovar o link.
- **Serviços personalizados além da lista padrão**, e tirar da lista padrão o que o cliente
  não faz (a lista vem com telemarketing, afiliados etc.).
- **Marcação estruturada do site (JSON-LD) batendo com o perfil**: nome, telefone, cidades,
  horário. Mudou num, muda no outro.
- **Avaliação é o fator que mais pesa no mapa.** Pedir às primeiras pessoas atendidas de verdade
  logo que o perfil for verificado (nunca avaliação plantada, ver `integridade.md`).

## Registrar

A URL de produção é fato durável: gravar no `CLAUDE.md` do cliente (topo) e no
`_memoria/estrategia.md`. Marcar o status do site de "em produção" para "no ar" com a
data.
