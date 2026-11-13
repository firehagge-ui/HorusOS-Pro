# Débora Reis Arquitetura: esboço (lead, interiores, Barra/Salvador)

> 🟢 **12/11/2026: rodada 1 no domínio, SEM o formulário** (Netlify, deploy 6af5d8f3, aprovação do Marcelo). Entraram o
> 5,0 no Google, o fecho do Como trabalho e o contato novo. O botão da capa virou "Começar meu projeto". No computador
> saíram as setas e a pausa dos Projetos (`estudio.css`, fim). O formulário fica só no esboço até a Débora opinar: ela
> recebe o rascunho v1 de 12/11 (formulário, faixas, meta de 22 avaliações e corretores) e a tarefa é a 63bec6e0. Para
> ligar no domínio, use `FORMULARIO_NO_AR = true` em `publicar-dominio.cjs`. Sem ele, o contato volta ao texto antigo.
> Mais tarde, no mesmo dia (deploy 6af5da8f): o título da home, a descrição da busca e a capa passaram a dizer
> "arquiteta de interiores em Salvador". Facebook e LinkedIn dela entraram no rodapé de todas as páginas, ao lado do
> Instagram, e no `sameAs`. O rodapé das páginas de projeto se edita no `gerar-projetos.cjs`.

> 🟡 **12/11/2026: Google conferido e Instagram a começar.** Site no índice (3 das 8 páginas na busca), mas nem o nome
> dela leva ao site (6º, atrás de Facebook, LinkedIn, @arquideborareis e Wix). Ajustes e páginas novas em
> `seo/estrategia-google-2026-11.md` §7 (tarefa 4ad48289, esperar a sessão de conversão publicar). Instagram: rascunho v1
> no Hounder (referências + semana grátis + R$ 350), decisão 2 ou 7 posts em `instagram/PLANO.md` (tarefa e20d97b2).
>
> 🟢 **11/11/2026, noite: rodada 1 de conversão montada e publicada SÓ no esboço** (https://esboco-debora-reis.vercel.app).
> O domínio continua igual. Detalhe na seção 9 da `AUDITORIA-CONVERSAO-2026-11.md`. Backup: `versoes/antes-conversao-11-11/`.
> - **Formulário "Começar meu projeto"** (`assets/comecar.js` + `comecar.css`) em todas as páginas. Todo botão de WhatsApp
>   genérico abre a janela: imóvel, bairro, o que procura, momento e quando, mais o investimento opcional. A mensagem
>   chega montada e diz a página de origem. O telefone do rodapé e a revista abrem direto. `?comecar=1` abre a janela.
> - **"★ 5,0 no Google"** na capa e no contato, com link para a ficha. Em 11/11 eram **13 avaliações** (4 em 10/11).
>   Conferir a nota todo dia 10 (tarefa 8460960a).
> - **Fecho do Como trabalho:** "Você começa a obra com os custos previstos na mão." + botão. Questionário com "Em que
>   momento você está?". Saiu "Nomes dos projetos: site da Débora.".
> - **Não aplicado:** o Instagram continua no topo e no contato, porque foi pedido dela em 04/11.
> - **Decide o Marcelo** (tarefa e0134436): domínio, contador de visitas e rótulo do botão da capa. Ela valida as faixas
>   de investimento.
> - **Publicar o esboço de novo:** copiar `site/` para uma pasta `esboco-debora-reis` com a `.vercel` (projeto
>   `prj_91ZqsMM1gqNKRmG41ANz7iW8E2iA`) e rodar `npx -y vercel@60.0.0 deploy --prod --yes`.
>
> 📌 **ESTADO EM 11/11/2026: site no ar, Google arrumado, conversão do site a decidir.**
> - **Google (10/11):** ela aprovou o acesso de gestor. A ficha foi arrumada e o Google aprovou a categoria Arquiteto +
>   Designer de interiores, a descrição, o site no domínio e o chat no WhatsApp. Ficaram em revisão os serviços, os
>   atributos e a 3ª categoria. Estratégia em `seo/estrategia-google-2026-11.md`, com medição todo dia 10 (repete no Hounder).
> - **Conversão (10/11):** auditoria em `AUDITORIA-CONVERSAO-2026-11.md`. A rodada 1 não depende dela e espera o Marcelo
>   aprovar e escolher o contador de visitas (tarefa e0134436, prazo 12/11). Montar no esboço da Vercel e só depois no domínio.
> - **Mensagens enviadas em 11/11 (contado pelo Marcelo):** o "terminei o seu Google", o link de avaliação e a resposta ao
>   áudio dela. No áudio, ela temia que as avaliações expusessem os melhores clientes a concorrentes mais baratos. A
>   resposta: quem avaliou já comprou, e a avaliação não mostra o Instagram. Ofereceu também preparar as respostas das
>   avaliações para ela aprovar (tarefa e9cf43a8). Ela viu o Google e não comentou. Uns 5 clientes já avaliaram. Regra
>   nova no `instagram/PLANO.md`: nunca marcar nem identificar o cliente nos posts.
> - **Esperando dela:** as histórias, fotos e plantas dos projetos (pedido de 09/11; lembrete leve em 18/11, tarefa f677eab4).
> - **🎯 PRÓXIMO CHAT (pedido do Marcelo, 11/11):**
>   1. Trabalhar o site de alta conversão (rodada 1 da auditoria). Começar pela seção 7 da `AUDITORIA-CONVERSAO-2026-11.md`.
>   2. Destravar o contrato (CAU, dia do Pix, endereço, e-mail do Marcelo, vídeo do Antônio). Ele segura a primeira
>      mensalidade da Horus. Confirmar com o Marcelo se o pedido do CAU e do Pix já saiu (não aparece na sincronização).
>   3. Publicar o painel com as tarefas na Agenda, se o Marcelo der o ok (tarefa a94a07f3).
> - **Perguntas abertas a ela:** se Itaigara e Alto do Parque são foto ou 3D (a capa usa o Alto do Parque), o Wix antigo e
>   o site do amigo, o Instagram @arquideborareis, o número do CAU e os 5 melhores e 5 piores clientes.
> - Contrato e Instagram continuam como no bloco de 07/11 abaixo.
>
> 📎 **Histórico: ESTADO EM 07/11/2026, 12h20: fechou de boca, site NO AR em https://deborareisarquitetura.com.br.**
> - **Site:** a zona salva às 11h18 publicou perto das 12h; o certificado HTTPS saiu minutos depois do pedido na Netlify
>   (`api provisionSiteTLSCertificate`). http e www redirecionam para o https. 4 páginas e 60 arquivos em 200, e
>   `revisao.cjs https://deborareisarquitetura.com.br --producao` (rodar da raiz, onde está o Playwright) com 0 problema.
>   Falta: Search Console (o Marcelo baixa o arquivo HTML de verificação com a conta dele, eu publico e envio o sitemap) e
>   o acesso de gestor à ficha do Google para pôr o site no campo Website (tarefa no Hounder, prazo 10/11).
>   Mensagem "site no ar" v2 com o agradecimento do Pix: rascunho no Hounder (07/11, 12h20).
> - **Contrato** (`_gestao/contratos/debora-reis-2026-11.md`): falta o endereço residencial dela (o da Rua Aracaju é coworking),
>   o número do CAU, o e-mail do Marcelo, o dia do Pix do Instagram, o Antônio confirmar se o vídeo conta entre os 8 e o PDF
>   para o Gov.br.
> - **Instagram:** outra sessão começou em 07/11 o plano em `instagram/PLANO.md` (3 capas e 1 carrossel modelo antes da pauta;
>   decisões pendentes do Marcelo lá e no Hounder).
> - **Mensagens pendentes do Marcelo:** o "site no ar" junto com o agradecimento pelo Pix e o comprovante (v2), e depois o
>   pedido do endereço residencial.
> - **Portfólio (07/11):** os quatro cartões além do Rio Vermelho contam pouco (Alto do Parque só tem o nome). Recomendado:
>   nada de página só com fotos; pedir a ela, depois da resposta ao "site no ar", a história de cada projeto, inclusive o
>   Rio Vermelho (quem mora, o que pediram, o que mudou, quanto tempo levou; pode ser áudio), e os originais do Roberto, que
>   substituem as sete fotos aumentadas por IA de 30/10 (`fotos/FONTES.md`). Rascunho v2 no Hounder (07/11).
> - **Rio Vermelho refeito como percurso (07/11, segunda revisão do Marcelo):** abertura com a foto do corredor dominando e
>   o texto por cima, ficha discreta (Localização, Intervenções, Fotografia, Tipo), conceito curto, galeria (faixa do piso e
>   dois detalhes), três aspectos com imagem e o fecho com o aparador e "Cada casa tem a sua própria história". A foto com
>   os números saiu (repetia a abertura). Recortes `rv2-*` tirados de `rio-vermelho-g.jpg`. Contraste do texto sobre a foto
>   medido nos pixels: no mínimo 5,6:1. Backup da versão da manhã em `versoes/antes-rv-07-11/`.
> - **Celular, rodada da tarde (07/11, referência do Marcelo):**
>   - **topo:** nome com "Arquitetura de interiores" e o Instagram, sem links e sem "Conversar" (ele quer testar sem menu);
>   - **capa:** rótulo "Arquiteta em Salvador" com fio, e "Entrar em contato" no lugar de "Conversar com a Débora" (também
>     no computador), com "Ver projetos" em botão de contorno;
>   - **carrossel:** só com o dedo, os fios no alto e "Ver projeto" com "Ver todos os projetos" logo abaixo;
>   - **ícone do WhatsApp:** o padrão do Simple Icons, porque o desenhado à mão ficava torto;
>   - **rodapé:** cada link na linha de um dado de contato;
>   - **rolagem:** fluida com o Lenis em todas as páginas (`assets/fluido.js`).
>   Backup em `versoes/antes-mobile-07-11/`. **Publicado no domínio em 07/11 à noite com o ok do Marcelo** (deploy
>   6aef82df na Netlify): 8 páginas no celular e no computador, 274 respostas sem falha, revisão de produção 0, sitemap com 8.
> - **Home no celular (07/11):** sem "Contato" no topo; a capa fica parada e a seção 1 sobe por cima (CSS, `.capa-palco`);
>   o "Como trabalho" fica preso e as etapas andam para a esquerda com a rolagem (`.crono-trilho`, script no fim do
>   `estudio.js`; só com tela de 560 px de altura ou mais e sem "reduzir movimento"). Modelo: Tarq no celular.
> - **Rio Vermelho no modelo da Tarq (07/11, terceira rodada):** o Marcelo mandou três páginas de projeto da Tarq (PH Makaira,
>   Casa Decor, Casa NJ). A página virou: foto parada com o nome grande e a faixa de lugar e tipo; a visão geral passa por
>   cima e escurece a foto; MATERIAIS, galeria, CONCEITO e ILUMINAÇÃO com parágrafo curto e justificado; sem legenda à mão.
>   Recortes `rvt-*` (de `vermelho.jpg` e `rio-vermelho-g.jpg`). Contraste do texto sobre a foto: no mínimo 5,2:1.
> - **Home no celular, terceira rodada:** a capa sobe a 35% e escurece até a metade (como a Tarq); "A arquiteta" e o nome
>   antes da foto; gatos sem as seis perguntas, título "A casa também é dos bichanos"; o guia do cliente saiu do site (ela
>   já tem um guia; pergunta pronta no Hounder).
> - **Cinco páginas de projeto (07/11, quarta rodada):** `gerar-projetos.cjs` gera `projeto-rio-vermelho`, `-paralela`,
>   `-graca`, `-alto-do-parque` e `-itaigara` a partir dos dados de cada projeto (texto só das legendas dela ou do que a
>   foto mostra). **Editar o texto ou as fotos no gerador, nunca no HTML.** O Rio Vermelho voltou a ter o painel bordado,
>   a pedra e o aparador inteiro (10 imagens). Nenhuma foto passa de 1,3 vez o tamanho real. Gatos: "Pet friendly" e
>   volta ao rótulo "Pra quem mora" e ao título "O projeto é feito para quem mora. E para os bichanos." (07/11 à noite, pedido do Marcelo; "A casa também é dos bichanos" e "Pet friendly" saíram; "Casa com bicho" é o que ele não gostou). `publicar-dominio.cjs` e `revisao.cjs` já listam as oito páginas.
> - **Perguntar à Débora:** as imagens do Itaigara são foto do quarto pronto ou render? Quem fotografou?
> - **Tudo isso está no esboço da Vercel e espera o ok do Marcelo para ir ao domínio.**
> - **09/11, sequência de mensagens agrupada (v3, textos no Hounder):** ela gostou do site. O Marcelo pediu juntar os pedidos em poucas mensagens, para ela responder no tempo dela. Agradecimento; site (projetos, histórias, imagens, guia); contrato e Google; avaliações no dia seguinte à aprovação; Instagram. Só se separa o que depende de um passo anterior.
> - **08/11:** retrato novo em `assets/fotos/debora.jpg` e, no computador, seção dos gatos com o desenho maior, título e fotos menores (backup em `versoes/antes-gatos-08-11/`). Sitemap com status Success no Search Console (lido em 07/11, 4 páginas; o arquivo atual tem 8).
> - **Search Console:** arquivo de verificação em `producao-extra/` (o `publicar-dominio.cjs` copia tudo de lá). O Marcelo
>   enviou o `sitemap.xml` em 07/11; "Couldn't fetch" é o normal de propriedade nova. Conferir de novo em 10/11.
> - **Netlify:** o selo "Powered by Netlify" (`built_with_badge_enabled`) foi desligado em 07/11.
>
> *Histórico: ESTADO EM 05/11/2026: reunião feita em 04/11, 19h, com o Antônio. Ela aceitou.*
> - **Combinado (relato do Marcelo):**
>   - 10% sobre cliente que vier pelo site;
>   - Instagram com 8 posts por mês, uma semana grátis, depois R$ 350 por mês (o Antônio confirmou em 06/11);
>   - domínio de R$ 40, pago pelo Marcelo e devolvido por ela por Pix, **no CPF dela**;
>   - acesso de gestor à ficha do Google.
> - **Ajustes pedidos no site:**
>   - nome maior;
>   - gatos com o mesmo fundo do resto;
>   - capa com `alto-parque.jpg` (a confirmar se é foto ou 3D);
>   - Instagram visível na home;
>   - menu: perguntar o que ela quer.
> - **Plano:** `estrategia-aquisicao-2026-11.md` (posicionamento, funil, Instagram, Google, preço, indicadores, contrato e
>   90 dias). Tarefas no Hounder: domínio e publicação, ajustes do site, contrato, acervo e clientes antigos.
> - **O que ela quer:** cliente de Salvador que valorize arquitetura; menos curiosos e menos conversa longa que não fecha.
>   Trabalha sozinha; as fotos são do Roberto, amigo que não cobra.
> - Hounder: a permissão automática bloqueou a mudança de estágio para "negociação" e a próxima ação na ficha. As
>   tarefas foram gravadas.
> - **05/11, tarde:**
>   - site publicado com os quatro ajustes (nome, gatos com fundo claro, capa `alto-parque.jpg`, Instagram no topo e no
>     contato), conferido no ar com 0 problema (backup em `versoes/antes-ajustes-05-11/`);
>   - contrato em `contrato-2026-11-rascunho.md`;
>   - questionário fora da prioridade, com a pergunta a ela;
>   - domínio sem ligação: ela escolhe o nome, e o titular é ela.
> - **06/11:**
>   - ela escolheu deborareisarquitetura.com.br e propôs os 10% sobre o valor total, pagos no início;
>   - o Instagram: ela falou em 300; o Antônio confirmou 8 posts por R$ 350 (o resumo de 05/11 dizia 5 posts). Contrato 4.1 já diz 8;
>   - o botão "Menu" saiu (pedido do Marcelo). Os links Projetos, Como trabalho, A arquiteta e Contato ficam à vista no
>     topo da home e de Projetos: à esquerda do nome no computador, numa linha embaixo do nome no tablet e no celular;
>   - corrigido junto: o topo de Projetos ficava creme sobre creme no computador;
>   - backup em `versoes/antes-menu-06-11/`. Revisão completa local e no ar, com 0 problema.
>   - celular refeito pelos dois prints do Marcelo (só até 760 px, o computador não mudou):
>     - seção 1: os três números numa linha, a foto grande mais baixa e sem a legenda "Uma casa com livros tem alma",
>       a foto pequena deitada ao lado do texto e "Ver o projeto" em vermelho, sem os fios do fundo;
>     - seção dos gatos: o desenho da estante, com a animação de sempre, saiu do meio do texto e foi para o vão entre
>       as duas fotos. O gato vermelho que eu tinha posto ali foi rejeitado pelo Marcelo ("mantenha a animação anterior").
>       É o mesmo SVG: no celular, `.faixa-centro` vira `display:contents` e a ordem do flex põe o desenho entre as fotos;
>     - o ícone do Instagram aparece no topo do celular também, como no computador;
>     - o print trazia "o tipo e o tamanho do imóvel" no quadro do quiz. O quiz não pergunta o tipo, então o texto
>       continua "a metragem";
>     - backup em `versoes/antes-celular-secoes-06-11/`. Revisão completa local e no ar, com 0 problema.
>   - 15h42: ela mandou o nome completo e o CPF. Os dois ficam só no contrato em `_gestao/` (fora do Git). Falta o
>     e-mail: ela perguntou se precisa ser Gmail (não precisa, vale o que ela mais usa) e o número do CAU;
>   - ela perguntou se deborareis.com.br existe. Existe e tem dona: outra Débora Reis, contadora (registro de
>     14/09/2026, vence em 14/09/2027, site no ar). deborareisarquitetura.com.br continua livre (consulta RDAP de 06/11).
>   - o Marcelo pensou em registrar no nome dele e passar depois. Recomendei manter no CPF dela: a troca de titular
>     do Registro.br pede formulário assinado pelo gov.br (prata ou ouro), cópia de documento e a conta dela no
>     Registro.br do mesmo jeito. Rascunho v2 pede e-mail e endereço com CEP (o contrato também usa o endereço).
>   - ela aprovou deborareisarquitetura.com.br ("está ótimo") e mandou e-mail e endereço com CEP (CEP conferido
>     nos Correios). Os dados estão só no contrato em `_gestao/`. 18h54: ela avisou que o endereço é de um
>     coworking e prefere o do prédio dela. Endereço residencial pedido.
>   - 19h18: ela mesma registrou deborareisarquitetura.com.br no CPF dela (RDAP: titular dela, ativo, DNS do
>     Registro.br). A cobrança sai depois, no painel. Ela ofereceu a senha. Plano: o Marcelo paga, põe o ID dele como
>     contato técnico (o contato técnico altera o DNS sem a senha dela) e ela troca a senha depois.
>   - Fim do dia: a conta foi criada com ela, o domínio foi pago (pedido 48216089) e ela devolveu os R$ 40 por Pix.
> - **07/11: versão de produção.** `publicar-dominio.cjs <saída>` gera o site do domínio a partir de `site/`:
>   - abre ao Google (sem noindex; canonical, og:url, url no ld+json, robots.txt, sitemap.xml);
>   - tira a sala de ideias, o guia do cliente (simulação, nada confirmado por ela), o selo "Prévia" e os links para eles;
>   - no modo revista, só aparece o que ela contou (os "Demonstração" somem; o Alto do Parque fica só com o nome);
>   - tira os comentários internos do HTML e do CSS. `site/` continua sendo o esboço na Vercel, com tudo.
>   - `revisao.cjs <pasta> --producao` confere só as quatro páginas públicas: 0 problema em 07/11.
>   - Hospedagem: Netlify (a Vercel grátis não permite uso comercial). DNS no Registro.br: A @ 75.2.60.5 e CNAME www.
>   - **No ar em 07/11:** https://debora-reis-arquitetura.netlify.app (site `fb8df0b2-acbc-4579-87c6-21b621dbcdcd`,
>     conta firehagge; o nome sem hífen é do site antigo do amigo dela). Domínio e www ligados. A conta da Netlify protege
>     todo site novo com login da equipe: neste foi tirado (`sso_login:false`). 41 arquivos em 200, revisão no ar com 0
>     problema. Publicar de novo: gerar com `publicar-dominio.cjs` na mesma pasta de saída e rodar
>     `npx -y netlify-cli@17.38.1 deploy --prod --dir <saída> --site fb8df0b2-acbc-4579-87c6-21b621dbcdcd`.
>     A pasta de saída de 07/11 ficou no rascunho temporário da sessão. Se ela sumir, gerar de novo e rodar
>     `npx -y netlify-cli@17.38.1 link --id fb8df0b2-acbc-4579-87c6-21b621dbcdcd` dentro dela antes do deploy.
>   - **DNS (07/11):** o Claude não entra no Registro.br (senha e código de acesso são do Marcelo). O Marcelo fez pelo
>     celular, guiado tela a tela: Configurar endereçamento › modo avançado › duas entradas › Salvar. Depois de ligar o
>     modo avançado, o modo básico fica travado por uma hora, e a primeira publicação demora. Conferir direto no servidor
>     dela: `nslookup -type=A deborareisarquitetura.com.br a.auto.dns.br`. Em 07/11, a versão da zona já tinha subido,
>     mas as entradas ainda não apareciam.
>
> *Histórico, 04/11, antes da reunião:*
> - **Percentual (decisão do Marcelo, 04/11, 15h10):** entra no contrato como pagamento variável pelo serviço de
>   marketing, só na conversa, nunca por mensagem. Eu tinha recomendado tirar pela regra 5.2.2 do Código de Ética do CAU;
>   ele entende que serviço de agência é custo da operação dela, não pagamento por indicação.
> - **O que se oferece:** o site no ar no domínio dela e a base do Google, sem custo, com teto de 8 horas. Ela retribui
>   com a avaliação, o portfólio e indicações de colegas. O Google em dia (R$ 390 por 3 meses, depois R$ 490) começa
>   quando ela fechar o próximo projeto. Anúncio só depois do laboratório de tráfego da Horus.
> - **Na conversa, ele diz a verdade:** "anúncio eu ainda não fiz com cliente". Roteiro em `conversa-2026-11-04.md`.
>   O combinado vai por escrito (modelo A de `templates/contrato-padrao.md`, assinado pelo Gov.br).

> 🔥 **03/11/2026, noite: ela respondeu às duas mensagens v8 (19h40 e 20h18).**
> - **O que ela disse:**
>   - 20h41: quer conversar em 04/11 e perguntou se manter o site no ar tem custo e se fica ligado ao Google;
>   - 20h44: perguntou se a Horus faz captação de clientes, paga com "um bom percentual sobre cada projeto fechado".
>     É a segunda vez que ela oferece; a primeira foi em 15/10.
> - **Resposta v9 (na ficha):** "Claro, Débora! Pra ficar no ar, o custo é só o domínio no seu nome, uns R$ 40 por ano. E
>   sim, ele fica ligado ao seu perfil no Google. Captação faz parte sim, e amanhã te mostro como funcionaria. Fica bom
>   às 10h ou às 16h?"
> - **Conselho** (`_conselho/logs/2026-11-03-debora-reis-captacao-por-percentual.md`, confiança de 66%): sim à captação,
>   como piloto escrito de 90 dias. A verba é dela e o percentual vale por parcela recebida. O rastreio e o teto de horas
>   ficam combinados, com regra de saída, contrato e confirmação do CAU.
> - **Mudança de recomendação:** em 19/10 a recomendação era recusar o percentual (`reuniao-2026-10-19.md`, decisão 4).
>   As duas objeções daquela vez eram a medição e o CAU, e o piloto responde às duas. Os números ficam na tarefa do
>   Hounder.
> - **Hospedagem:** o plano grátis da Vercel não permite uso comercial. Ao ir para o domínio dela, o site passa para a
>   Netlify ou a Cloudflare Pages, que são grátis e permitem.
> - **Correção da mesma noite, depois das perguntas do Marcelo:**
>   - **anúncio fora do começo**, como já dizia `estrategia-visibilidade.md` §6, de 23/10;
>   - **captação, nesta ordem:** Google grátis, site, avaliações, indicações, a proposta em 3 opções e, no mês 3 ou 4, o
>     anúncio;
>   - **"sem custo":** a Horus paga o primeiro ano do domínio. Fica pendente o ok do Marcelo.
>   - O Marcelo nunca fez tráfego e tem medo de errar. O processo e as travas estão explicados na conversa e resumidos
>     no log.
> - **Ela, mais tarde:** "Como posso retribuir ao seu maravilhoso trabalho, se inicialmente nao posso pagar por ele?"
>   O rascunho v10 está na ficha. A avaliação nunca é condição para o site.

> ✅ **03/11/2026: revisão no celular (pedido do Marcelo), publicada e conferida no ar.**
> - **Testado:**
>   - prints de 390 px de todas as páginas;
>   - toque no menu, nas perguntas, no carrossel, no questionário até o WhatsApp e no modo revista;
>   - a revisão completa em 7 larguras, com 0 problema;
>   - o detector com 23 achados, os mesmos de antes.
> - **Corrigido:**
>   1. O guia dizia "ajudo na compra de móveis, tapetes e cortinas" e, nas perguntas, que a compra não está incluída.
>      A frase das compras saiu, porque ela não faz compra. O PDF foi gerado de novo, com a cópia no Downloads.
>   2. "[ Projetos ]" sumia sobre o teto claro da Paralela: ganhou sombra, cor clara e o topo da foto mais escuro no
>      celular.
>   3. O botão flutuante do WhatsApp cobria o "Ver todos os projetos": agora some enquanto os controles do carrossel
>      estão na tela.
>   4. O crédito das fotos no Rio Vermelho estava à esquerda; ficou centralizado como nas outras páginas.
> - **Backup:** `versoes/antes-revisao-celular-03-11/`.

> 🔁 **03/11/2026: a reunião nunca aconteceu, e a conversa parou em 30/10 com ela.** Em 30/10 ela contou que não fecha
> projetos ("É sempre pelo valor...", "Um foi pelo prazo"). Caso que ela citou: casa de praia na Praia do Forte, R$ 18.500,
> 5 visitas incluídas, abaixo do preço normal dela, cliente antigo. Ela já trabalhava no projeto antes de fechar.
> - **Mensagem v4** (na ficha do Hounder): "Débora, fiquei pensando no que você me contou da casa da Praia do Forte.
>   Tenho ideias pra isso. Na mesma conversa a gente coloca o seu site no ar. [dia 1] ou [dia 2]?"
> - **Conselho:** `_conselho/logs/2026-11-03-debora-reis-projetos-travam-no-valor.md`.
> - **NotebookLM:** card `apresentacao-de-preco-e-objecao.md`, retorno de 03/11.
> - **Pauta:**
>   1. Diagnóstico dos 3 últimos que não fecharam.
>   2. Site no ar.
>   3. As ideias para ela fechar mais, como o que a gente aprendeu, nunca consultoria de preço:
>      - contrato e entrada antes da primeira linha;
>      - proposta ao vivo, com as palavras do cliente e o compromisso antes do número;
>      - três opções de escopo, a menor com só o estudo preliminar, que também responde ao prazo;
>      - parcelar por etapa em vez de baixar o preço;
>      - o custo do erro na obra.
>   4. Filtro de orçamento no questionário: pergunta o que o cliente pensa investir, sem dizer o valor dela, por causa do CAU.
> - **Demo a montar quando ela marcar:** um modelo de proposta em 3 opções, na identidade dela, marcado como Demonstração.
> - **Plano B:**
>   - sem resposta até quinta 05/11, mandar uma linha;
>   - sem reunião até 17/11, colocar o site no ar por mensagem.

> 🎯 **O PLANO COM ELA (16/10/2026, recomendação; decisão do Marcelo).** Ela não é caixa: não tem dinheiro, e percentual
> sem verba de anúncio é lento. Ela é **prova e porta** para o Marco 1 (26/12: 3 cases, 5 avaliações reais). Tirar, nesta
> ordem: (1) o site dela no ar, no domínio dela, primeiro site de cliente real da Horus; (2) avaliação no Google da Horus,
> depoimento e autorização de portfólio (ela fica sabendo da agência na conversa franca); (3) 2 ou 3 indicações com nome
> (corretores e fornecedores dela); (4) a vitrine do nicho: com o site dela no ar, o template de arquitetura se vende a
> outras arquitetas pela Fase 1. Investimento máximo: ~3 h. O resto só com acordo escrito ou plano pago. Nota no Hounder.
>
> ⚠️ **30/10, madrugada: o Marcelo vai remarcar** (não confirmou na semana). Rascunho com o link do site na ficha do Hounder,
> para sair antes das 11h com dois horários da semana seguinte. O roteiro continua valendo.
>
> 📅 **Reunião: sexta 30/10/2026, a partir das 11h, por vídeo** `[FALTA: horário fechado; rascunho "sexta às 11h fica bom?"
> na ficha, nota de 21/10]`. Ela remarcou duas vezes, sempre com motivo e carinho: 19/10 → quarta 28/10 15h (semana
> puxada) → sexta 30/10 (vai apresentar uma proposta na quinta). Roteiro em `reuniao-2026-10-19.md`. Domínios livres no
> Registro.br em 21/10: deborareisarquitetura.com.br, deborareis.arq.br, deborareisarquiteta.com.br.

> ✅ **30/10, noite: revisão final, pronto para mostrar.** A foto da Paralela foi trocada pela versão nova (1542 px).
> Conferido no ar: 6 páginas em 7 larguras (360 a 1905 px), sem erro de console, sem falha de carga, sem imagem quebrada e
> sem rolagem lateral. Os links de WhatsApp estão no número dela. Nenhum link interno quebrado e nenhum [FALTA] visível.
> Questionário e modo revista testados no celular. Miniaturas e texto do "site" na sala de ideias atualizados (as antigas
> em `versoes/previas-antes-30-10/`). Script de revisão reutilizável: `revisao.cjs` (pasta, ou URL do site no ar).
> O Marcelo mandou a mensagem de remarcar sem o link; o rascunho do link está na ficha.
>
> ✅ **30/10, noite, 4ª rodada:** o Rio Vermelho entrou como 5º projeto do carrossel ("Piso, cores, marcenaria e luz novos,
> pensados para as moradoras.", da legenda dela; "Ver projeto" abre a página dele). Sete fotos trocadas pelas versões
> melhoradas que o Marcelo trouxe (detalhe e ressalva em `fotos/FONTES.md`; as antigas em `versoes/fotos-antes-30-10/`).
> Corrigida a rolagem lateral de 21 px do "Próximo apartamento" no celular, na página do Rio Vermelho.
>
> ✅ **30/10, noite, 3ª rodada (revisão colada pelo Marcelo):** a pergunta do valor sem "Demonstração", com o texto dele
> (imóvel, ambientes e etapas; proposta com escopo, honorários e condições); contato pede "o tipo e o tamanho do imóvel e
> quais ambientes"; detalhamento com os entregáveis do guia (marcenaria, bancadas, iluminação, acabamentos, quantitativos e
> custos); Alto do Parque e Itaigara ganharam uma frase no carrossel, tirada do que as fotos mostram ("crescer" da sugestão
> saiu: é intenção que ela não disse). **A validar com ela:** as duas frases, os entregáveis do detalhamento e se as fotos
> do Alto do Parque e do Itaigara são fotografia ou imagem 3D (as duas parecem render). Páginas individuais seguem esperando
> as histórias dela.
>
> ✅ **30/10, noite, 2ª rodada:** o parágrafo termina em "faz a casa ter a cara de quem mora ali"; a legenda da foto
> pequena virou "A mistura de livros e peças feitas à mão dá personalidade ao espaço." (vem da legenda dela, post
> Dc9zKCIRswM). Título mantido em três linhas: a quebra sugerida deixava "vezes." sozinha e separava "duas vezes".
>
> ✅ **30/10, noite: textos da seção 1 decididos pela revisão que o Marcelo colou** (encerra os 4 caminhos de
> `esbocos-secao1/TEXTOS.md`): "Depois de tantos anos projetando casas, sempre me perguntam:" em letra normal / "Você não
> enjoa?" / o título; o parágrafo "Cada casa começa pelas pessoas que vivem nela. Seus livros, suas memórias, seus objetos,
> seus bichos e tudo aquilo que faz um espaço ser seu." (sem o "verdadeiramente" da sugestão); indicadores +20 anos de
> experiência / Salvador e região metropolitana / Interiores, projetos residenciais.
>
> ✅ **30/10, noite (Marcelo):** saiu "Apartamento Graça" da legenda; título em três linhas; foto pequena mais perto da grande;
> legenda da foto grande com a frase dela no post DdDBvl2MiR1, "Uma casa com livros tem alma."; "Salvador" e "Casas" na letra
> do título, alinhados ao +20, com "e região metropolitana" de volta.
>
> ✅ **30/10, fim da tarde: seção 1 no modelo Söl Haus que o Marcelo trouxe** (todo o texto numa coluna à esquerda; à direita
> a estante dos livros grande e a cerâmica pequena, com "Apartamento Graça" em terracota e "Ver o projeto" no vão; +20 grande
> em terracota). A opção B ficou em `versoes/secao1-opcao-b-30-10/`. O nicho azul saiu da home (continua em Projetos).
>
> ✅ **30/10, tarde:** título da capa sempre em duas linhas no computador ("Interiores com identidade." inteiro, como o modelo do
> Marcelo); números da seção 1 em três colunas iguais ("Salvador e região"), o que acabou com a rolagem lateral de 1100 a
> 1280 px; entre 1081 e 1279 px a seção 1 empilha.
>
> ✅ **30/10, meio-dia (pedidos do Marcelo):** gatos mais baixos no computador (de ~1160 para ~1020 px em 1440); subtítulo da
> capa na largura normal da letra, 21 px; seção 1 presa às 6 linhas do fundo (frase em 4 colunas, texto a partir da 5ª,
> alinhado à base do título), sem o risco vermelho, e "Arquitetura com história e identidade" virou "Casas e apartamentos".
>
> ✅ **30/10, manhã: o Marcelo tirou a foto larga entre "Como trabalho" e os gatos e a linha do tempo da arquiteta**, que
> virou a frase "formada pela UFBA em 2004, com escritório na Barra, em Salvador".
>
> ✅ **30/10/2026 (tarde): revisão em 6 pontos que o Marcelo colou, publicada** (backup em `versoes/antes-revisao-30-10/`).
> - **Projetos:** cada projeto tem uma composição própria (o corredor grande, a Paralela com o título ao lado, o mosaico da
>   Graça, a poltrona na largura toda, o quarto mais à direita). Na página continua só o título. Toda foto abre o **modo
>   revista** (`assets/revista.js`): tela cheia, legenda discreta, setas, teclado e arrasto, e o botão "Quero um projeto
>   assim", que leva o nome do projeto para o WhatsApp. Cada projeto começa por um cartão com a fala dela e três linhas:
>   quem mora, o desafio e a solução. O que ela ainda não contou aparece com a etiqueta "Demonstração" e "Aqui entra..."
>   (pedido do Marcelo; o marcador `[FALTA]` fica no `data-falta`). Nenhum texto foi inventado.
> - **Páginas individuais:** não foram criadas para os outros quatro projetos. A Débora disse em 23/10 que "o cliente tem
>   preguiça de ficar clicando", e sem a história de cada um a página só repetiria as fotos. Quando ela contar as histórias,
>   dá para montar páginas como a do Rio Vermelho.
> - **Home:** uma foto de ponta a ponta entre "Como trabalho" e os gatos (alto-parque.jpg, com parallax leve).
>   - Gatos: a foto da estante ficou maior, o desenho fica no chão, junto da base das fotos, e o questionário ganhou um bloco
>     com botão.
>   - A arquiteta: fundo um tom abaixo e a trajetória (2004, UFBA → hoje). A foto não cresceu: o Marcelo pediu menor em 29/10.
>   - Celular: botão "Conversar" (WhatsApp) fixo, que aparece depois da capa e some no contato.
> - **Questionário testado no celular:** as 6 perguntas, o pular, o resultado e a mensagem com o número certo. Ganharam área
>   de toque o "Voltar" (de 40 px para 44 px) e a bolinha da metragem.
> - **Falta perguntar à Débora:** a história de cada projeto (quem mora, o desafio, a solução); a Paralela, o Alto do Parque
>   e o Itaigara não têm nenhuma. Também falta saber se as fotos do Alto do Parque são fotografia ou imagem 3D: a da
>   poltrona parece render.
>
> ✅ **30/10/2026: seção 1 na opção B, no ar** (escolha do Marcelo; backup em `versoes/antes-secao1-b-30-10/`). A frase
> fica em cima, com o texto, o link e os números ao lado, e três fotos iguais embaixo (livros, cerâmica, nicho azul, todas
> do Ap. Graça). Vai sem as legendas à mão do esboço, pelo antipadrão de 29/10. O ícone do Instagram no rodapé foi
> recentralizado. Conferido em 1440, 1024 e 390: sem erro e sem rolagem lateral. Detector com os mesmos avisos de antes.
> **Pendente: o texto da seção.** São 4 caminhos em `esbocos-secao1/TEXTOS.md`, todos tirados das legendas dela; a
> recomendação é o 1 (tarefa no Hounder).
>
> ✅ **29/10/2026: ajustes do Marcelo + a revisão de 5 pontos que ele mandou, publicados** (backup em
> `versoes/antes-ajustes-29-10/`). Capa sem a faixa de baixo, sem "Projeto e decoração" e sem "Na foto"; "Ver projetos"
> na altura do botão; o texto diz quem, o quê e onde ("Débora Reis, arquiteta em Salvador. Projetos de interiores para
> casas e apartamentos..."). Carrossel passa sozinho a cada 7 s, com pausa (para fora da tela e com o teclado). Gatos:
> título "O projeto é feito para quem mora. E para os bichanos." e texto sobre o projeto incluir os bichos, sem legendas
> à mão. Arquiteta: retrato menor, sem a linha vermelha. **Traços decorativos fora do site todo** (o do capa, o dos
> gatos, o da arquiteta). Home com dados de busca local (`ld+json`, sem o `url` até o domínio sair); links pequenos
> aumentados no celular. **Seção 1:** só encurtada; três esboços do ChatGPT (via `codex exec`) em `esbocos-secao1/`
> esperam a escolha do Marcelo (recomendação B; tarefa no Hounder). Verificado: 1440, 1024 e 390, local e no ar, sem
> erro e sem rolagem lateral; troca automática e pausa testadas; questionário até a mensagem do WhatsApp no celular.

> ✅ **28/10/2026, noite: home refeita a partir dos 5 mockups do Marcelo, publicada** (backup em
> `versoes/antes-mockups-28-10/`). Os mockups (feitos no ChatGPT) valem como estrutura; fotos e dados são os dela.
> - **Nomes reais dos projetos (site atual dela, deborareisarquitetura.netlify.app, lido em 28/10):** o "Colorir" é o
>   **Apartamento Paralela**; estante dos livros, estante dos CDs (a antiga capa), cerâmica e nicho azul são do
>   **Apartamento Graça** (não do Rio Vermelho, como o indício de 15/10 sugeria); o aparador é do Rio Vermelho. Entraram
>   **Alto do Parque** (4 fotos) e **Quarto infantil no Itaigara** (3 fotos), do site dela. **O Aconchego saiu**: nenhuma
>   fonte diz de qual apartamento é `[FALTA: perguntar a ela]`. Green Ville (1 foto) ficou de fora.
> - **Capa:** foto de ponta a ponta (o corredor do Rio Vermelho, arquivo de 1268 px do site dela), texto à esquerda, dois
>   botões, "Na foto: Apartamento Rio Vermelho" e uma faixa de quatro itens **sem os ícones** do mockup. Sem o "01 a 04".
> - **Seção 1:** texto e três números (+20 anos; Salvador e região metropolitana; arquitetura com história e identidade,
>   sem repetir a faixa da capa) | a estante alta | dois detalhes que trocam pelas setas e as palavras à mão.
> - **Carrossel:** foto cobrindo o card inteiro, sem as anotações à mão, botão "Ver projeto"; Paralela, Graça, Alto do
>   Parque, Itaigara. **Projetos:** só o título, sem frase à mão e sem citação; os detalhes viraram o Ap. Graça.
> - **Como trabalho:** número, nome, desenho, prazo e texto depois de um fio; saíram o "você aprova" e o parágrafo de
>   baixo. Mantido "medição em até 5" (o print diz "até 5"; na proposta, os 5 dias valem só para a medição).
> - **Gatos e arquiteta** no layout dos prints 4 e 5. "Débora Reis / Arquitetura" no topo da home e de Projetos.
> - **Verificado:** home e Projetos em 1440, 1024, 768, 390 e 360, local e no ar: sem erro, sem imagem quebrada, sem
>   rolagem lateral; carrossel avança nas três larguras; detector com 4 avisos a mais, todos conferidos (texto sobre a
>   foto lido como sobre o creme; fios divisórios lidos como caixa).

> ✅ **28/10/2026: seção 2 e Como trabalho refeitas pelo jeito das referências, publicadas** (pedido do Marcelo: "não só
> comparar, assimilar e aplicar"). Estudo seção por seção em `referencias/arquitetura-awwwards-2026-10.md` ("Como montam
> cada seção"). Backup de antes em `versoes/antes-referencias-28-10/`.
> - **Seção 2 (a abertura):** a frase dela à esquerda e grande; a estante dos livros grande; "Cada projeto parte de quem
>   mora ali" + "Conheça a arquiteta"; a cerâmica e o nicho azul menores (no tablet, só a cerâmica). Fotos retas, legenda
>   à mão levando ao detalhe em `projetos.html`. Modelo: Simone Katherine, Tarq, Stanzza.
> - **Como trabalho:** a régua com os prazos fica; cada etapa ganhou um desenho de linha que se traça ao rolar (planta com
>   cotas, planta com a mesa redonda, perspectiva com o nicho em arco, marcenaria com cotas). As figuras dela (círculo,
>   arco, quadro) voltam como desenho, uma por etapa. Modelo: Tarq (imagem por etapa) e Stanzza (axonometria em linha).
> - **Verificado:** home rolada em 1440, 1024, 768, 390 e 360, local e no ar: fotos visíveis, desenhos traçados, sem erro,
>   sem imagem quebrada, sem rolagem lateral; detector com os mesmos avisos de 25/10.

> ✅ **25/10/2026: ajustes do Marcelo e revisita das referências, publicados** (mesmo link; a versão de antes de 23/10 está
> em https://esboco-debora-reis-antes.vercel.app para comparar; backup da de 23/10 em `versoes/antes-ajustes-25-10/`).
> - **Logo dourada fora** (pedido do Marcelo, "por enquanto"): topo e rodapé voltam a ser só o nome, o ícone da aba volta
>   ao antigo, a capa do guia e o PDF sem a logo. Os arquivos da logo continuam em `site/assets/`.
> - **Capa** de 1180 para 1320 px de largura. **Carrossel:** a foto de ~42% para ~64% da largura, perto do centro, com as
>   três notas à mão aparecendo no computador (antes só uma); o Colorir cresce pouco (arquivo de 628 px) e o texto encosta
>   na foto.
> - **Molduras geométricas fora de `projetos.html`:** na revisita, nenhum dos ~20 escritórios estudados emoldura foto em
>   forma geométrica (`referencias/arquitetura-awwwards-2026-10.md`, "Revisita de 25/10"). Os detalhes ficam do tamanho
>   dos apartamentos, foto reta.
> - **Enxuto:** saíram duas repetições ("Reforma de apartamentos" na capa e na seção 2; "apresento orçamentos de empresas
>   de obra" no Como trabalho e na pergunta da obra). **"Ajudo nas compras" saiu** do Como trabalho e do guia: está na
>   proposta do loft como complementar, mas no áudio ela diz que não gosta de ficar "comprando material" (só para amigo).
>   `[confirmar com ela]`.
> - **Verificado:** 6 páginas em 1440 e 390, home em 1024, 768 e 360 (menu, perguntas, carrossel nas três larguras), sem
>   erro, sem imagem quebrada, sem rolagem lateral; detector com os mesmos avisos da base; PDF com 7 páginas dentro da
>   folha; no ar, páginas e PDF 200 e PDF idêntico ao local.
> - **Para chegar no nível da Stanzza, falta dado dela:** prazo de um projeto entregue e metragem na ficha de cada
>   apartamento; uma foto de cada etapa (medição, prancha, amostra, obra).

> ✅ **23/10/2026: os pedidos do áudio dela de 22/10 aplicados e publicados** (https://esboco-debora-reis.vercel.app).
> Ela achou o site "muito lindo" e pediu: os prazos dela (mandou o cronograma de uma proposta de loft), site mais enxuto
> ("o cliente tem preguiça de ficar clicando", "sem coisa repetida"), as figuras geométricas "uma em cada página ou fora",
> e mandou a logo nova (monograma DR dourado). Obra: "nem sempre eu faço"; só visita de arquiteta, nunca gestão nem compra
> de material; obra grande ela indica alguém. Enxoval (roupa de cama, louça) foi exceção daquela cliente: não entra.
> - **Uma sessão paralela ("Débora Analise") fez uma versão às 12h40; o Marcelo a descartou ("fez um monte de coisa errada,
>   faça do seu jeito e reaplique por cima").** Guardada em `versoes/sessao-descartada-23-10/`; a base foi o commit
>   `b0c6098` (igual a `versoes/antes-enxugar-23-10/`).
> - **Como trabalho:** saíram os cartões presos na rolagem; entrou uma régua de 4 etapas com os prazos dela (briefing e
>   medição até 5 d.u., estudo preliminar até 24, anteprojeto até 30, detalhamento até 30) e "você aprova" nas divisas em
>   que a proposta dela pede aprovação (depois do estudo e do anteprojeto). Os complementares numa frase. Obra não é etapa.
> - **Figuras:** saíram da home (seção 2 ficou só com "Você não enjoa?"); cada moldura foi para um detalhe em
>   `projetos.html`, uma por vez e grande: arco nos Livros, quadro no Artesanato, círculo no Frio e quente.
> - **Enxuto:** as páginas `projeto-colorir`, `-aconchego`, `-livros`, `-artesanato` e `-azul-e-madeira` só repetiam foto e
>   legenda; saíram (em `versoes/paginas-removidas-23-10/`) e um trecho contínuo da legenda dela foi para `projetos.html`
>   (a legenda inteira só no Colorir, no Aconchego e no Frio e quente; nunca frases emendadas). Só o Rio
>   Vermelho abre página própria. Perguntas de 6 para 4 (três respostas agora são dela: obra, mudanças, o que recebe); a
>   linha "Fotos: Roberto" repetida em cada ficha saiu (o crédito fica no rodapé); o contato ficou com um botão. Home de
>   10.026 px para 7.453 px no computador.
> - **Logo:** monograma no cabeçalho de todas as páginas (no celular, só o monograma), assinatura completa no rodapé,
>   ícone da aba. Arquivos transparentes na cor dela (#C79560) feitos da imagem que ela mandou: `assets/logo-dr.png`,
>   `logo-debora-reis.png`, `favicon-dr.png`. Capa: "projeto, obra e decoração" virou "projeto e decoração".
> - **Guia:** a página das etapas com os prazos e as regras dela, "Quando faz sentido, também" no lugar de "Por que
>   respeitar cada etapa", perguntas da obra e das mudanças com as palavras dela; PDF refeito (7 páginas, todas dentro da
>   folha) e cópia em `Downloads/Guia do cliente - Débora Reis.pdf`. O questionário cita as etapas novas.
> - **Verificado:** 6 páginas em 1440 e 390 sem erro, sem imagem quebrada e sem rolagem lateral; nenhum link interno
>   quebrado; 18 links de WhatsApp, todos no número dela; detector com os mesmos avisos da base, nenhum novo; publicado e
>   conferido no ar (páginas e PDF 200, as cinco antigas 404).
> - **Ainda falta:** as miniaturas da sala de ideias mostram a home antiga; forma de cobrança `[FALTA]`; a pergunta dela
>   sobre Google e Reels vai para a reunião (`reuniao-2026-10-19.md`, "A pergunta que ela trouxe").
> - **Auditoria do mesmo dia (pedido do Marcelo), contra a proposta e o áudio. Erros meus achados e corrigidos:**
>   (1) o "até 5 dias úteis" estava no "Briefing e medição" inteiro, mas na proposta vale só para o levantamento físico:
>   virou "medição em até 5 dias úteis"; (2) o orçamento dos acabamentos finos estava dentro dos 30 dias do detalhamento,
>   mas na proposta é o passo 8, sem prazo: virou "Depois, ..."; (3) a frase do Artesanato emendava dois trechos
>   distantes da legenda entre aspas: trocada por um trecho contínuo; (4) "apresento orçamentos" soava como incluído:
>   virou "Se você quiser" (é serviço complementar na proposta); (5) faltava "paginação de revestimentos (se precisar)"
>   na lista do que o cliente recebe; (6) o PDF do guia não tinha a logo: entrou na capa; (7) no tablet em pé (761 a
>   900 px) a frase ao lado da foto em Projetos ficava numa coluna de ~120 px: passou para baixo da foto.
>   Verificado: 6 páginas em 1440, 1024, 768, 390 e 360, menu, perguntas e carrossel funcionando, nenhum link quebrado,
>   detector igual à base, PDF com 7 páginas dentro da folha, publicado e conferido no ar (PDF no ar idêntico ao local).
> - **Depende da Débora:** forma de cobrança; se o "Por metro quadrado / Por ambiente" do guia vale (é nosso, marcado
>   Simulação); CAU; fotos originais do Roberto (as do Instagram têm 1080 px); e se quer a cor dela (dourado) no site
>   além da logo.

> 🟡 **HISTÓRICO, 15/10/2026, 17h58: ela voltou, conversando.** Por áudio, preferiu o nosso site ao do amigo
> ("infinitamente melhor"), vai ler as ideias em 16/10 e propôs parceria: o Marcelo capta e ela paga um percentual do
> projeto que entrar (sem dinheiro agora). Sugeriu o site do amigo para corretores e o nosso no Google. Rascunho de
> resposta e recomendação para a ligação na ficha do Hounder (nota de 15/10). Base da recomendação: a promessa de 14/10
> ("se o site lhe vir a ser útil é todo seu e de graça") se cumpre; o grátis termina em site no domínio dela + ficha do
> Google; captação contínua só pela parceria escrita. O plano de 22/10 (Perdido, esboço fora do ar) está suspenso.
> **20h43:** mais carinho ("ameiiii", "salva o meu número") e "vc é profissional de marketing? da área de criação?". Ela
> ainda não respondeu ao "Fica melhor uma ligação?" das 20h04. Combinado: sem pedir agenda de novo hoje; resposta curta
> dizendo quem ele é (agência pequena com um sócio, criação com ele). Se ela não voltar até 16/10 às 18h, uma linha só.
>
> **15/10, noite (pedido do Marcelo): sala de ideias clara pra ela entender sem explicação, e sem o nome Hórus.**
> - `ideias.html` reorganizada pelo caminho do cliente, com um mapa no topo dos cinco momentos: 01 o site, 02 um apartamento por
>   dentro, 03 o questionário, 04 o guia, 05 a avaliação no Google. Cada ideia diz "O que é", "Como o cliente usa" e "O que
>   muda pra você". Saíram a nota "montei antes de ver o seu site novo" e o botão "Esconder marcações" desta página.
> - **Nome Hórus fora de tudo:** o selo "Prévia feita pela Hórus" virou "Prévia feita para a Débora" (9 páginas), o selo do guia
>   virou "Demonstração", a assinatura ficou só "Marcelo", e as 4 miniaturas foram refeitas (mostravam o selo antigo).
> - ~~Achado e consertado: o "Baixar em PDF" do guia dava 404 no ar.~~ **Corrigido em 16/10:** não era defeito. A outra
>   sessão estava no meio da revisão do guia (seção "20h" abaixo): trocou o botão de imprimir por um link para o PDF e gerou
>   o arquivo às 20h13, por cima do que esta sessão tinha gerado às 20h09. O PDF no ar é o dela.
> - **Simulação também na sala de ideias (16/10, "pode aplicar tudo"):** a legenda e as duas etiquetas da `ideias.html`
>   viraram "Simulação", como no guia. Publicado e conferido no ar. As páginas do site seguem com "Demonstração".
> - **Nome da agência fora (16/10):** vale só para a Débora, por decisão do Marcelo.
>
> **Follow-up (16/10):** ela disse no áudio que leria as ideias hoje e chamaria. Se não falar até as **18h de hoje (sexta)**,
> sai uma linha só (rascunho na ficha do Hounder, nota de 16/10). Respondeu com dúvida → ligação com dois horários na
> segunda. Sem resposta no fim de semana → nada até terça 21/10, quando o Marcelo decide o próximo passo.
> - Backup em `versoes/antes-ideias-claras/`. Publicado e conferido no ar: 11 páginas, 0 problemas no `conferencia-no-ar.cjs`,
>   0 ocorrências do nome em páginas, scripts e estilos, PDF respondendo 200.
>
> *Antes, 15/10, 14h13: ENTREGUE, porta aberta.* O Marcelo mandou os dois links
> (https://esboco-debora-reis.vercel.app/ e `/ideias.html`) com o texto dele: "sem compromisso", "quis cumprir o que
> tinha te falado" e "se precisar de algo relacionado a marketing pode chamar". Não há pedido pendente. Se ela
> responder, quem responde é ele. Sem resposta até 22/10, o caso vai para Perdido (com a promessa cumprida), o esboço sai
> do ar e as fotos saem da pasta. Antes disso, nada se apaga (regra "decisão no calor", `CLAUDE.md` da raiz).
> O que se aprendeu com o caso está em `_memoria/prospeccao/aprendizados.md` (09 a 15/10).
>
> *Histórico, 15/10 de manhã: o "encerrada" da madrugada foi forte demais. Ela nunca tinha visto o trabalho, e o caso
> foi reaberto para um último envio, com as fotos restauradas do Git (`14395e0`) e a sala de ideias reescrita como
> complemento ao site novo dela (https://deborareisarquitetura.netlify.app, feito por um amigo).*

> ⚠️ **LEAD, não cliente.** Esboço privado (`noindex`) pra mostrar na conversa. Estado comercial no
> Hounder (ficha `95fc7889-3564-4d15-beca-dc9a042dcf13`). Não vendeu: apagar as fotos dela e
> reaproveitar só a estrutura (`../README.md`).

## 15/10/2026, 20h: guia do cliente revisado (pedido do Marcelo), publicado às 20h15

- **Arquivos:** `site/guia.html` + regras do guia em `site/assets/demo.css`. PDF pronto em
  `site/guia-do-cliente-debora-reis.pdf` (o botão "Baixar em PDF" agora baixa esse arquivo em vez de abrir a impressão) e
  cópia em `Downloads/Guia do cliente - Débora Reis.pdf`. Backup: `versoes/guia-antes-revisao-15-10/`.
- **Mudou guia.html? Gere o PDF de novo** (Playwright, `emulateMedia print` + `page.pdf({preferCSSPageSize:true,
  printBackground:true})`) e confira que nenhuma página passa da folha: a 3 é a mais cheia.
- **Fonte nova:** o site atual dela (deborareisarquitetura.netlify.app, lido em 15/10) deu a primeira conversa sem
  compromisso (presencial ou vídeo), Salvador e região metropolitana, resposta em até 2 dias úteis, projeto e
  acompanhamento de obra como serviços separados, "nada segue sem o seu aval" e quantitativos e custos por apresentação.
- **Saiu:** a forma de pagamento inventada e as "visitas semanais". **Entrou:** subtítulo da capa, o que cada etapa entrega,
  nota de prazo estimado, "o que a proposta traz", honorários x custos da obra, "você não precisa ter nada pronto", três
  perguntas novas, WhatsApp/Instagram clicáveis e QR com mensagem própria ("Li o seu guia do cliente"), lido e conferido.
- **Texto do PDF maior que o da tela** (corpo 21px na folha de 794px) porque o PDF abre num celular pela metade do tamanho.
- **A confirmar com a Débora:** lista na nota do Hounder de 15/10, 20h (prazos, m² e ambiente, etapas avulsas, visitas,
  texto da Decoração, endereço, CAU, link do questionário).
- **SIMULAÇÃO (Marcelo, 15/10, 20h13: "deixe claro que o documento é uma SIMULAÇÃO"):** aviso fixo na capa ("Simulação. Este
  guia é um exemplo, montado a partir do Instagram e do site da Débora..."), etiqueta "Simulação" nas 7 páginas (não some com
  "Esconder marcações", que saiu desta página) e "(simulação)" no título. Neste guia vence a regra de 14/10 de usar só
  "Demonstração". A legenda da sala de ideias ainda fala em "Demonstração" (arquivo da outra sessão, não mexido).
- **Publicado em 15/10, 20h15** (https://esboco-debora-reis.vercel.app/guia.html e o PDF), depois que a outra sessão fechou a
  sala de ideias. Conferido no ar: guia, ideias e home em 390 e 1440, sem erro, sem imagem quebrada, sem rolagem lateral;
  PDF no ar igual ao local; QR lido e igual ao link do número.

## ⛔ Encerrado em 15/10/2026, de madrugada (HISTÓRICO: reaberto no mesmo dia, ver o estado atual no topo)

O Marcelo decidiu que a Hórus não vai mais trabalhar para a Débora (o motivo foi
registrado pelo Marcelo fora deste repositório; aqui ele não aparece). Feito em 15/10, com o ok do Marcelo:
- **fora do ar:** o endereço mostra uma página neutra ("Esta página não está mais no ar") e as 18 publicações antigas
  foram apagadas. O projeto `esboco-debora-reis` continua na Vercel, como o Marcelo pediu, para reaproveitar;
- **fotos apagadas desta pasta:** 67 imagens, entre `fotos/`, `site/` e `versoes/`. Continuam no histórico do Git;
- **template:** `templates/sites/arquitetura-interiores/`, sem nada dela (fotos viraram marcadores). Fica o aprendizado: `PROPOSITO-DAS-SECOES.md` e os teardowns em `referencias/`.
**O Marcelo quer guardar tudo o que foi construído (15/10):** o código do site e as versões (`site/`, `versoes/`), os
documentos desta pasta, o template e o projeto na Vercel ficam. Só as fotos dela saíram, e elas continuam no histórico do
Git (último commit com elas: `14395e0`).
A conversa automática do 09/10 (seção "Estado anterior") está encerrada junto.

## Regra de escrita deste projeto (Marcelo, 14/10/2026)

Todo material que a Débora vê é escrito como se o Marcelo tivesse preparado. O guia fica na voz dela, em primeira
pessoa. Não entra nota de bastidor ("texto de simulação", "na versão final..."). O que não é definitivo leva só a
etiqueta **"Demonstração"**. O texto passa pela régua de `_memoria/prospeccao/90-cara-de-ia.md`.

## 15/10/2026, noite: versão nova a partir do `PROPOSITO-DAS-SECOES.md` (pedido do Marcelo)

- **Backup antes de mexer:** `versoes/antes-proposito-15-10/`, uma cópia completa e funcional do site.
- **Aplicado o que não depende de dado da Débora**, as mudanças marcadas "antes da chamada" no documento:
  - **Capa:**
    - a foto emoldurada pelo papel, com teto de 1180 px, porque o arquivo de 1080 px amolecia de ponta a ponta;
    - o serviço na linha de apoio, a formação como prova e um botão;
    - saiu o "desde 2004" junto de Salvador (também na descrição e na prévia do link) e a legenda solta "O retrato da
      alma brasileira".
  - **Seção 2:**
    - virou "como ela pensa", com a pergunta dela ("Você não enjoa?") e a resposta literal do post;
    - o serviço é a leitura principal;
    - as fotos viraram índice clicável dos detalhes e do aparador, sem repetir as de Projetos;
    - a faixa "Detalhes que contam" saiu da home.
  - **Carrossel:**
    - sem troca sozinha e sem zoom lento;
    - no computador, a foto emoldurada no escuro, com o texto ao lado;
    - o Colorir com um recorte sem a TV (`sala-vermelha-sem-tv.jpg`);
    - as notas com as palavras da legenda dela.
  - **Como trabalho:** o retrato foi para "A arquiteta"; a coluna presa virou "Como começa"; a etapa 01 (texto nosso)
    leva "Demonstração"; o texto do link do guia foi corrigido.
  - **A arquiteta:** retrato, nome e formação juntos; a frase dela em letra de leitura; o cartão com um botão só.
    "Escritório de uma pessoa só" saiu até ela autorizar.
  - **Perguntas:** as que travam a decisão. Duas respostas são dela; quatro repetem o guia, com "Demonstração".
  - **Contato:** o título diz a ação. O WhatsApp abre com mensagem pronta em todas as páginas.
  - **Páginas internas:** "Conversar" no topo; o mesmo caminho de contato da home; o selo de prévia no lugar de
    "Esconder marcações".
  - **Rio Vermelho:** cada fato contado uma vez; "A luz e os objetos" num capítulo só; os recortes no tamanho do arquivo;
    a página diz que a paleta saiu das fotos.
  - **Rodapé, questionário e cortes:**
    - o rodapé ficou sem a nota de bastidor e sem o "Diário no Instagram", com os links que faltavam;
    - o questionário ficou sem as porcentagens e sem o "Salvador" atribuído às fotos;
    - saiu o "do chão ao teto";
    - saíram as bordas pretas das fotos.
- **Ficou de fora (de propósito):**
  - a animação do rodapé, que o Marcelo pediu para manter;
  - os objetos de parede da seção 2;
  - o que depende da Débora: CAU, prazos reais, bairros, de qual apartamento é cada foto, faixa de investimento, o
    bloco "é pra mim?".
- **Decisões que eram do Marcelo, tomadas pela recomendação do documento:**
  - WhatsApp como botão principal (Fase 1);
  - Colorir e Aconchego mantidos no carrossel (o Colorir recortado) até ela responder.
- **Verificado em 15/10:**
  - Playwright em 1440 e 390, nas 11 páginas: sem erro, sem imagem quebrada, sem rolagem lateral;
  - carrossel: setas, arrasto, e fica parado depois de 9 s sem ninguém mexer;
  - todos os links de WhatsApp com mensagem.
- **Detector:** sai 2, com os mesmos avisos do commit anterior (texto claro sobre foto lido como sobre o papel, e o
  fundo creme). As duas falhas de entrelinha sumiram e o "Demonstração" de 10 px foi para 11 px.

## 15/10/2026: projetos reorganizados pelo que as fotos provam (pedido do Marcelo)

- **O que as fotos e legendas provam:**
  - **Rio Vermelho:** o corredor e o aparador vermelho são do mesmo apartamento (o aparador aparece no fundo da foto do
    corredor).
  - **Aconchego é outro apartamento:** piso de madeira escura, enquanto no Rio Vermelho o piso foi trocado por um claro.
  - **"Colorir"** (post C4RJy_Dp10S, a sala com a mesa vermelha e vista) é outro apartamento, mais antigo.
  - **Livros, Artesanato e Frio e quente:** não dá pra provar de qual apartamento são. Há indícios de que Livros e a
    estante dos CDs sejam do Rio Vermelho (mesma marcenaria branca, "as proprietárias" no plural, como "as moradoras"),
    mas indício não é prova. `[FALTA: a Débora confirmar na chamada]`.
- **Organização (caminho C do `PLANO.md`):**
  - o carrossel da home passa só pelos **3 apartamentos**, cada um na composição que a foto pede: Rio Vermelho em tela
    cheia, Colorir deitado com o texto à direita, Aconchego em pé num painel sobre o vinho;
  - logo abaixo, a faixa **"Detalhes que contam"** (Livros, Artesanato, Frio e quente);
  - `projetos.html` segue a mesma divisão, com 3 apartamentos e os detalhes à parte;
  - página nova: `projeto-colorir.html`.
- **Rio Vermelho em capítulos:** o que mudou, as cores (paleta tirada das fotos), a luz e os objetos (recortes
  `rv-*.jpg`, só das duas fotos deste apartamento). No fim, "Próximo apartamento". Se a Débora confirmar que os detalhes
  são dele, entram como capítulos.
- **Rodapé:** número, e-mail completo e o ícone do Instagram, nessa ordem; o botão do WhatsApp saiu.
- **Versão anterior:** `versoes/antes-organizacao-projetos/`.
- **Verificado em 15/10:**
  - Playwright em 1440 e 390, nas 8 páginas: sem erro, sem imagem quebrada, sem rolagem lateral;
  - carrossel: setas, arrasto, arrasto curto que volta, `?p=2` e `?p=3`;
  - foto e link de cada apartamento conferidos.
- **Detector:** sai 2, igual ao commit anterior (o "limpo" de 14/10 não se reproduz).
- **Publicado em 15/10** no mesmo projeto (https://esboco-debora-reis.vercel.app). Conferido no ar: as 8 páginas
  respondem 200, as fontes carregam e o carrossel passa no desktop e no celular, sem erro.

## Depois da rodada 6 (14/10/2026, noite): guia, números da foto, páginas de projeto

- **Guia do cliente (o PDF):**
  - na voz da Débora do começo ao fim e com 7 páginas;
  - "Por que leva esse tempo" foi para a página das etapas;
  - a pergunta "Quem contrata a obra?" foi reordenada;
  - a etiqueta "Demonstração" fica só nas páginas de prazos, de valores e de respostas;
  - cada página preenche a folha A4;
  - a versão anterior está em `versoes/guia-antes-14-10/`.
- **Números da foto do Rio Vermelho:** a caixa abre ao lado do número (no celular, logo embaixo da foto, com seta).
- **Uma página por projeto:** `projeto-livros`, `-artesanato`, `-azul-e-madeira` e `-aconchego`, com a legenda completa
  dela, a ficha e "Outros projetos" com "Ver todos os projetos". O Rio Vermelho ganhou o aparador e a marcenaria em
  detalhe. O topo das páginas internas foi corrigido (o link estava grudado no nome).

- **Seção 1, legendas (14/10):** o Marcelo mandou os textos do Instagram, eu os coloquei em caixas ao clicar na foto,
  e ele achou texto demais. **Desfeito**: voltou ao que era (só o nome à mão embaixo de cada foto). A versão com as
  caixas está em `versoes/antes-legendas-secao1/` só pelo nome da pasta (o conteúdo ali é o de antes das caixas).
  Os textos completos dele estão neste histórico, se voltarem a pedir.
- **Rodapé (14/10):** botões Instagram, WhatsApp e e-mail em todas as páginas. É o que está confirmado dela. Facebook,
  LinkedIn e outras: `[FALTA: a Débora dizer quais redes usa e os links]`. O ícone do Facebook do site antigo dela
  levava à página do Wix, não à dela.

## Rodada 6 (14/10/2026, noite): no ar

- **Correção de escopo:** a "seção 1" era "Nunca a mesma casa", não a capa. Capa e cabeçalho voltaram aos da rodada 4. A
  seção 1 mantém a estrutura e ganhou objetos de parede (nicho, quadro, bastidor) com etiqueta à mão. Em "Como trabalho",
  saíram o texto ao lado do título e a legenda da foto da Débora.
- **Projetos em tela cheia** com passagem da direita para a esquerda (arrasto, setas, nomes, sozinho a cada 7 s com pausa)
  e a página nova `projetos.html` ("Ver todos os projetos"). Detalhe e porquê em `PLANO.md`, rodada 6. Rodada 5 em
  `versoes/rodada-5/`.
- **~~Decisão pendente~~ decidida em 15/10:** caminho C aplicado (ver a seção de 15/10). Era a organização do portfólio, com os caminhos A, B e C em `PLANO.md`. A
  recomendação era C, dois níveis (apartamentos em tela cheia; detalhes dentro de cada projeto e numa faixa própria).
- **Verificado em 14/10:**
  - detector limpo (0) *(não reproduzido em 15/10: a mesma versão deu saída 2; provável que tenha rodado fora da raiz)*;
  - Playwright em 1440, 1024 e 390 (e 360 nos projetos): clique, arrasto, arrasto curto que volta, passagem automática,
    pausa, `?p=3`, faixa de fotos da página nova;
  - sem erro e sem rolagem lateral; subpáginas sem erro; publicado e conferido no ar.

## Rodada 5 (14/10/2026): ajustes pedidos pelo Marcelo, substituída pela rodada 6

- Capa virou **prancha** (foto em retrato, carimbo com dado real, seta à mão); projetos viraram **carrossel** começando
  pelo Rio Vermelho (página dupla com o aparador vermelho, que é do mesmo apartamento, conferido na foto); bichanos com
  fotos grandes e gato redesenhado; rodapé redesenhado como vista de parede com cota "sob medida". Plano em `PLANO.md`,
  cada elemento em `JUSTIFICATIVA.md`, rodada 4 guardada em `versoes/rodada-4/`.
- Sala de ideias sem a apresentação ("Débora, separei..."): o Marcelo manda isso por texto.
- **Verificado em 14/10:** detector limpo (0) *(não reproduzido em 15/10: a mesma versão deu saída 2; provável que tenha rodado fora da raiz)*; Playwright em 1440, 1024 e 390 com as animações, carrossel passado de
  ponta a ponta por clique e por arrasto, sem erro e sem rolagem lateral; subpáginas sem erro; publicado e conferido
  no ar (URLs 200, fontes carregando).
- `[FALTA: confirmar com a Débora se Livros, Artesanato, Azul e madeira e Aconchego são apartamentos diferentes]`.
- **Follow-up (14/10):** saiu às 15h52 e ela respondeu com a permuta (seção abaixo).
- **Quiz "Conte a sua casa" (14/10, pedido do Marcelo):** "pré-briefing" virou "O que a Débora vai receber" (também
  na sala de ideias); a prévia da mensagem virou balão verde à direita, como no WhatsApp, com o jeito da casa em
  lista e os rótulos em negrito (`*rótulo*`, que o WhatsApp mostra em negrito); o botão de mandar ficou à vista
  (barra fixa no resultado e botão embaixo do celular). As barras de porcentagem são desenho nosso: o Havenly não
  mostra porcentagem e a tela de resultado do Bobby Berk não foi vista (o quiz não carrega no navegador automático).

## 14/10/2026: ela respondeu às prévias com a permuta

A mensagem das prévias saiu às 15h52. Às 16h26 ela respondeu que está "realmente quebrada esse ano", que não acha justo
receber ajuda sem pagar ou fazer permuta, e às 16h27 ofereceu trocar pelos serviços dela. **Decisão pendente do
Marcelo (tarefa no Hounder), antes da chamada:** (a) R$ 800 em 2x ou 4x; (b) parte em dinheiro e parte em
contrapartida (portfólio, depoimento, 3 indicações de fornecedores e clientes dela); (c) permuta total, só se a Hórus
usar o serviço dela. Nada se promete por mensagem: a condição se fecha na chamada.

**Conselho de 14/10 (`_conselho/logs/2026-10-14-debora-reis-permuta-e-plano.md`, confiança 68%):** grátis sai (ela
recusou). Plano A = (b): R$ 800 em 4 de R$ 200, a primeira antes de publicar, com contrapartida escrita (portfólio,
depoimento depois de 30 dias no ar, 2 ou 3 fornecedores dela apresentados, 1 h dela revisando guia e quiz). Plano B:
R$ 200 agora e R$ 600 quando ela fechar o próximo projeto, com data limite `[FALTA: Marcelo define]`. Plano C (permuta)
só se o Marcelo tiver uso real. Onda 1 = site + formulário + domínio + ficha ligada + kit de indicação; guia e quiz
ficam pra Fase 2. Pendente do Marcelo antes da chamada: prazo do plano B e se há uso pra permuta.

**Ideias pra caixa zero (14/10, depois do Conselho; nada aprovado, o Marcelo escolhe):** (1) montar com ela uma oferta
pequena que gere caixa rápido pra ela (ex.: consultoria de um ambiente), vendida pelo formulário, e o site se paga com
as primeiras vendas; preço só a quem pede (regra do CAU); (2) cartão de crédito parcelado em até 10x com a Hórus
recebendo antecipado `[conferir taxa da maquininha]`; (3) "paga quando o primeiro projeto entrar" pelo site, com data
limite; (4) indicação que vira cliente abate parcela; (5) o serviço dela revendido a clientes da Hórus com ponto físico
(hipótese, ninguém pediu); (6) o guia do cliente como produto pra outros arquitetos, com ela de coautora (hipótese);
(7) bate-papo dela + Marcelo pra arquitetos sobre mostrar valor online. Patrocínio de fornecedor no site dela: não
(reserva técnica é infração ética no CAU `[conferir]`).

**Decisão do Marcelo (14/10, noite): o site sai sem cobrança.** A troca é dita com clareza (portfólio antes de
publicar, depoimento depois de uns 30 dias no ar, indicação na entrega). Domínio no nome dela, pago por ela. Manutenção
(projeto novo, textos) = valor fixo mensal `[FALTA: Marcelo define antes da conversa]`. Guia, quiz e as outras
ferramentas = trabalho à parte, mais pra frente. A conversa de 15 min é pra explicar e colocar no ar, não pra vender.
Sequência: (1) hoje, aviso curto de que o link vai amanhã; (2) 15/10 cedo, aviso de que muita coisa é demonstração +
"o site eu faço sem custo, o resto seria trabalho à parte" + link; (3) gostou → "me diz tudo que quiser mudar" + 15 min
com dois horários; (4) na conversa, como funciona, domínio, manutenção e quiz; (5) na entrega, indicação e os serviços.

## Rodada 4 (13/10/2026, noite): redesign com a Stanzza como referência obrigatória

- A home foi refeita no sistema da Stanzza (diagnóstico e plano em `PLANO.md`, rodada 4; cada elemento em
  `JUSTIFICATIVA.md`). Fontes: Boska (Fontshare) + Archivo + La Belle Aurore. A assinatura é a anotação à mão sobre as
  fotos. Sem dado inventado na home; a área e a linha do tempo inventadas saíram também do Rio Vermelho.
- **Pendência real:** as fotos são do Instagram (1080px). Em tela cheia ficam suaves. Pedir à Débora os originais do
  fotógrafo Roberto Moreira Rego antes de publicar de verdade.
- Verificado: detector limpo; Playwright 1440 e 390 com as animações, sem erro e sem rolagem lateral; comparação lado a
  lado com a Stanzza; fontes carregando no site publicado.

## Estado (13/10/2026, rodada 3: a sala de ideias)

- **O link que vai pra ela: https://esboco-debora-reis.vercel.app/ideias.html** (privado, `noindex`). A sala junta
  quatro demos: o site refeito na lógica dos premiados do Awwwards (`referencias/arquitetura-awwwards-2026-10.md`),
  o questionário **Conte a sua casa** (`conte-sua-casa.html`, estrutura do Havenly com os apartamentos dela), o
  **Rio Vermelho por dentro** (`projeto-rio-vermelho.html`, pontos na foto com a legenda dela), o **guia do
  cliente** (`guia.html`), mais o kit de indicação. Plano em `PLANO.md` (rodada 3); por que cada ideia em
  `VALOR-PERCEBIDO.md`. Estratégia da casa: `_memoria/comercial.md`, "Mostrar antes de vender".
- **Simulação marcada:** prazos, área, respostas de perguntas e textos na voz dela que ela não escreveu levam a
  marca "simulação" (botão "Esconder simulações" no selo). Nada de depoimento, número ou foto inventada.
- **Fontes trocadas:** Zodiak + Switzer (Fontshare, pela API deles: licença ITF FFL gratuita pra uso comercial;
  hospedar os arquivos no site é ambíguo na licença, então continuam pela API). Cormorant saiu por ser
  fonte-reflexo (`_memoria/design/90-antipadroes.md`).
- **Preço (Marcelo, 13/10):** no máximo R$ 800, em duas vezes (4 de R$ 200 se o caixa pesar: sugestão, ainda não
  aprovada), entrada antes de publicar, domínio no nome dela.
- **A mensagem (13/10), só depois das demos no ar (estão):** "Oi, Débora! Fiquei com aquilo que você falou na
  cabeça, dos clientes que chegam sem noção do valor do trabalho. Pensei em umas ideias pro seu escritório e montei
  umas prévias pra você ver, olhar não custa nada rs. Posso te mandar o link?" Sim: o link da sala +
  "Se quiser, te mostro cada uma em 10 min por vídeo, hoje 17h30 ou amanhã 10h?". Silêncio até sexta 16/10:
  geladeira de 60 dias.
- **Verificado em 13/10:** detector da impeccable limpo *(não reproduzido em 15/10)*; Playwright em 1440 e 390 nas cinco páginas, questionário
  respondido até o fim, sem erro de console nem rolagem lateral; as cinco URLs publicadas respondendo 200.

## Estado anterior (09/10/2026)

- **10/10, a próxima mensagem:** ela disse "Estou na rua agora...depois continuamos ta?" (09/10, 20h20) e o Marcelo
  respondeu "Claro, Débora! Fica tranquila, depois a gente continua." Se ela não voltar sozinha, sai na **terça 13/10,
  10h30** (rascunho no Disparos): "Oi, Débora! Fiquei pensando no que você falou, do cliente que dá valor à coisa e não
  ao serviço. No esboço que comecei do seu site tem uma parte só pra isso, mostrando o que tem por trás de cada
  projeto. Quer que eu te mostre?" Sim: os três balões, com "amanhã ou quinta?" no lugar de "amanhã ou terça?".
  Silêncio até sexta 16/10: geladeira de 60 dias. O vigia só roda com uma sessão do Claude aberta. Plano da semana em
  `_memoria/prospeccao/semana-2026-10-13.md`.

- **RELIGADA em 09/10, noite, com regra estreita (pedido do Marcelo):** se ela disser sim a "Quer que eu te mostre
  como ficaria?", o Claude manda sozinho os três balões aprovados (frase do esboço + link + "em aberto de propósito…
  10 minutinhos por ligação, amanhã ou terça?") e avisa o Marcelo no celular. Qualquer outra resposta: não manda nada,
  avisa o Marcelo com uma sugestão. Risco conhecido: o Farejador não vem recebendo as mensagens dela.
- **CANCELADA em 09/10, 16h: o Marcelo assumiu a conversa.** Ela respondeu (site próprio sem ligação ao Google, caixa zerado, irmã de marketing); as mensagens dela não chegaram ao Hounder (provável LID sem mapeamento).
- ~~Conversa conduzida pelo Claude, a pedido do Marcelo~~ ("quero que fale com ela de forma
  automatizada", 09/10). Exceção à regra "resposta de lead é do humano", só pra este lead. Envio pela
  fila do Farejador: `ferramentas/hound-dog/scripts/conversa-auto/enviar.mjs`; o vigia
  (`vigiar.mjs`) acorda o Claude quando ela escreve.
- **Objetivo do Marcelo:** marcar a conversa pra mostrar o esboço, "custe o que custar", sem ser
  bonzinho, falando como ele (mensagem imperfeita, de celular, nunca texto redondo).
- **No ar (privado, fora do Google):** https://esboco-debora-reis.vercel.app (Vercel, projeto esboco-debora-reis; publicar de novo: copiar `site/` pra uma pasta chamada esboco-debora-reis e rodar `npx -y vercel@60.0.0 deploy --prod --yes`). Rodada 2 (09/10, 20h): plano em `PLANO.md`, assinatura "a estante", referências do Awwwards.
- **Esboço:** começou em 09/10 às 14h30, a partir da Soleira do portfólio (`site/`), com as 12 fotos
  mais recentes do Instagram dela (`fotos/`, fontes em `fotos/FONTES.md`). Prometido: pronto em 24 h.

## O roteiro da conversa

Já saíram (09/10): "Oi, Débora! Tudo bem?" e, pelo celular do Marcelo, o fato da ficha sem portfólio +
"Você já tem um site próprio ou hoje concentra seus projetos no Instagram?".

**Próxima, quando ela responder** (texto do Marcelo, em dois balões):
1. "Então, e se eu te dissesse que já comecei a esboçar como poderia ficar o seu site?"
2. "Eu desenvolvo sites pra profissionais aqui da região e tive uma ideia de como apresentar seus
   projetos. Ele pode ficar pronto em 24 horas. Posso te mostrar rapidinho, se você não gostar tudo
   bem, você não paga nada"

**O jeito (Marcelo, 09/10): como nas transcrições de cold call.** Mensagem curta, direta, uma ou duas
frases. Toda resposta termina no pedido com dois horários fechados. Nada de explicar o site por
texto: o esboço se mostra na chamada. Marcar logo, de preferência hoje ou amanhã.

**As respostas prontas** (ajustar os horários ao momento; padrão "hoje 17h30 ou amanhã 10h" antes das
16h, "amanhã 10h ou 11h" depois):
- Topou / "como assim?" → "Montei uma página com os seus projetos, o do Rio Vermelho, os livros, até a
  estante dos gatos. Te mostro em 10 min, por vídeo ou passo aí no escritório. Hoje 17h30 ou amanhã 10h?"
- Quanto custa (**Marcelo, 13/10: no máximo R$ 800**, o site já está feito; substitui a faixa da Fase 1) →
  "Pra você fica R$ 800, dá pra fazer em duas vezes. É o valor que tô fazendo pros primeiros casos. Te mostro
  em 10 min, amanhã 10h ou quinta 10h?" Entrada antes de publicar; domínio no nome dela.
- Manda o link → "Mando sim, mas mostrando eu te explico cada parte rapidinho. Hoje 17h30 ou amanhã 10h?"
- Agora não → "Tranquilo! Qual fica melhor, terça ou quarta?"
- Não tenho interesse (1ª) → "Entendo. São só 10 min pra vc ver, se não gostar fica por isso mesmo. Bora?"
- Não (2ª) → "Beleza, Débora. Obrigado pelo retorno!" e para.
- Já tenho site / alguém faz → "Ah massa, já tá no ar? No Google não aparece. Vale ver o esboço mesmo
  assim, 10 min. Hoje 17h30 ou amanhã 10h?"
- Quem é você → "Sou o Marcelo, da Hórus, faço site pra profissional aqui de Salvador. Peguei seu número
  na sua ficha do Google."
- Confirmou → "Fechado! [dia], [hora], [te chamo por vídeo aqui / passo aí no escritório]." Agenda e estágio no Hounder
  na hora.

**Depois, o mapa (o porquê de cada resposta):**
- **Topou ver** → horário fechado na hora, duas opções, chamada de vídeo de 10 min. Confirmou → agenda
  no Hounder, estágio "Reunião marcada", aviso pro Marcelo.
- **Quanto custa** → o valor dito com clareza (pesquisa de 09/10: fugir do preço irrita e matou o Talina):
  R$ 800 em duas vezes (decisão de 13/10), e o pedido de horário logo depois.
- **Manda por aqui / manda o link** → "mostrando eu te explico cada parte, é rapidinho" + horário.
  Insistiu de novo → manda o link do esboço (só se estiver no ar) e pede os 10 min pra comentar.
- **Agora não / tô ocupada** → não solta: pede o dia que fica melhor, com duas opções.
- **Não tenho interesse / não preciso** → uma insistência, com o risco zero ("só 10 min, se não gostar
  fica por isso"). Segundo não → agradece e para. Insistir além disso queima a Hórus.
- **Já tenho site / alguém fazendo** → curiosidade ("já tá no ar? pergunto pq no Google não aparece"),
  e a oferta de ver o esboço mesmo assim.
- **Quem é você / de onde tirou meu número** → "sou o Marcelo, da Hórus, faço site pra profissional
  aqui de Salvador. peguei seu número na sua ficha do Google" (é verdade: é o número da ficha).

**Para e chama o Marcelo:** áudio, pergunta se é robô ou se é ele mesmo, contrato, assunto pessoal,
qualquer coisa fora do mapa. Nunca negar que a mensagem foi escrita com ajuda; nesse caso quem
responde é ele.

**Travas que não mudam:** nada inventado (nem cliente, nem número, nem prazo além das 24 h que o
Marcelo prometeu), nada de urgência falsa, preço por mensagem só os R$ 800 em duas vezes (13/10), envio só entre 8h e 20h.

## Gravado no Hounder (15/10/2026)

O que estava pendente das sessões na nuvem de 14 e 15/10 foi gravado na ficha `95fc7889-3564-4d15-beca-dc9a042dcf13`
(nota "14 e 15/10: o que ficou só na pasta"). As três tarefas dela foram canceladas. A ficha foi para Perdido de
madrugada e voltou para **Follow-up** no mesmo dia, para o último envio, com prazo em 22/10.

## 15/10/2026, noite: o último envio (pedido do Marcelo: "vamos mandar pra ela e dar um fim nisso")

- **Mensagem (rascunho, o Marcelo envia):** "Débora, o site ficou lindo! Te devia aquelas ideias que eu tinha montado. O
  site você já resolveu, mas tem duas coisas ali que dá pra usar junto com ele: um questionário pro cliente contar a casa
  dele antes da primeira conversa, e um guia explicando como funciona o seu trabalho. Quer que eu te mande o link?"
- **Sim:** o link https://esboco-debora-reis.vercel.app/ideias.html e, depois que ela olhar, "se quiser, te mostro em 10
  min por vídeo", com dois horários. Preço não se fala por mensagem (ela está sem caixa; condição só na conversa).
- **Não ou silêncio até 22/10:** fecha de vez, esboço sai do ar e as fotos saem da pasta de novo.
- **O site novo dela (lido em 15/10):** sem questionário e sem guia; contato por formulário e WhatsApp. Nomeia projetos
  que o nosso não tem (Paralela, Alto do Parque, Green Ville, Graça, Itaigara). Nunca criticar o trabalho do amigo.
- **Verificado em 15/10, no ar:** 5 páginas principais em 390 e 1440, sem imagem quebrada, sem erro de console, sem
  rolagem lateral; sala de ideias conferida por print.
- **Ajustes do Marcelo (15/10, noite):** na sala de ideias as imagens não abrem mais nada (só os botões levam às
  páginas, pra ela não se perder); "Os clientes que você já tem" ganhou a frase dizendo que a parte é pra quem já reformou
  com ela deixar avaliação no Google, e o cartão explica o QR. O backup `versoes/antes-proposito-15-10/` foi publicado
  junto, em https://esboco-debora-reis.vercel.app/versao-anterior/, só pro Marcelo comparar (tirar antes de ela
  receber o link, se ele não quiser que ela ache). Conferido no ar em 390 e 1440, sem erro e sem imagem quebrada.
- **Ajustes do Marcelo na home (15/10, noite), a partir da comparação com o backup:**
  - seção 1 com 6 fotos (voltaram "os objetos que contam alguma coisa", sem link porque não se sabe o apartamento, e "a
    mesa vermelha", que leva ao Colorir); o aparador não passa mais por cima do texto: posições refeitas e sobreposição
    medida em 1024, 1100, 1180, 1280, 1440 e 1680, em toda a rolagem, sem nenhum encontro;
  - capa do celular no modelo que o Marcelo trouxe (feito no ChatGPT; só a estrutura, a foto é a dela): foto de ponta a
    ponta sob o cabeçalho, texto à esquerda, "Conheça meus projetos" e "Fale com a Débora"; o computador ficou igual;
  - saíram o "Como começa" (Como trabalho) e a caixa preta (A arquiteta); o contato voltou aos dois botões lado a lado,
    sem o "Prefere contar antes?";
  - celular: as duas fotos dos gatos juntas, depois do botão; retrato da Débora na largura toda; rodapé com os links à
    direita.
  - versão de antes destes ajustes: `versoes/antes-ajustes-mobile-15-10/`. Detector: 7 avisos, nenhum novo (a anterior
    tinha 9).
- **Mais dois ajustes do Marcelo (15/10, noite):**
  - seção 1: o "Você não enjoa?" (post `DZ0TJl3Rkch`) aparecia sem a moldura e não se entendia quem perguntava. Ganhou
    a linha "A pergunta que sempre me fazem" e o título virou "Não. Nunca projetei a mesma casa duas vezes.", que é a
    resposta dela no post; o bloco subiu 2% e a sobreposição foi medida de novo (1024 a 1680, nenhum encontro);
  - "Como trabalho" no modelo do "About us" da Stanzza (stanzza.design/awards): título "Do estudo à decoração, em quatro
    etapas.", quatro cartões grandes que acendem um de cada vez com a foto, com a seção presa no computador de tela
    alta (sem prender em tela baixa, sem nada preso no celular, onde ficam empilhados e acesos); a descrição de cada etapa
    fica embaixo do cartão, sempre visível; o link do guia virou botão. As fotos dos cartões são detalhes dos projetos
    dela (livros, corredor do Rio Vermelho, ripas, aparador), não fotos da etapa. Os prazos continuam `[FALTA]`.
  - versão de antes: `versoes/antes-como-trabalho-15-10/`. Detector na home: os mesmos 7 avisos (os 4 de texto branco
    no cartão foram corrigidos com fundo escuro por baixo da foto). Conferido no ar em 390, 900, 1280x720, 1366x640 e
    1440, sem erro, sem imagem quebrada e sem rolagem lateral.
- **Pronto para mostrar (15/10, noite, conferência final):**
  - seção 1 decidida com o Marcelo: "Mais de duas décadas depois, sempre me perguntam" / "Você não enjoa?" / "Não. Nunca
    projetei a mesma casa duas vezes." (o tempo explica por que alguém perguntaria se ela enjoa; palavras do post dela);
  - miniaturas da sala de ideias refeitas a partir das páginas atuais (site, Rio Vermelho, guia); a do site ainda
    mostrava "desde 2004", que tinha saído;
  - `/versao-anterior/` fora do ar (404); o backup segue só na pasta `versoes/`;
  - conferido no ar: 11 páginas em 360, 390, 768 e 1440, sem erro de console, sem imagem quebrada, sem rolagem lateral;
    nenhum link interno quebrado nem âncora sem alvo; os 32 links de WhatsApp com (71) 99977-5453 (bate com o Hounder);
    questionário percorrido até o resultado e a mensagem pronta; sobreposição da seção 1 medida em 1024 a 1680;
    detector com os mesmos avisos da versão anterior, nenhum novo;
  - rascunho v2 da mensagem gravado no Hounder (sem o elogio ao site, que o Marcelo já fez em 15/10, 00h59).
- **Enviado (15/10, 14h13), com o texto do Marcelo, não com o v2:** os dois links direto, sem perguntar antes, e uma
  despedida ("Torço para que você atraia clientes que valorizem seu processo e seu trabalho"). A escolha dele estava
  certa: a licença já tinha vindo com o "amanhã te mando o link". Virou regra em `_memoria/prospeccao/aprendizados.md`
  ("promessa feita é licença dada").
