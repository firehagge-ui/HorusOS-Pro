# Como pegar a chave da Meta (Instagram)

> Caminho "API do Instagram com login do Instagram", conferido na documentação da Meta em
> 27/09/2026. Não precisa de Página do Facebook. Leva uns 15 minutos. Você faz os passos 1 a 5;
> daí em diante é comigo.
>
> O guia antigo, `marketing/automacao-meta-setup.md`, usa o outro caminho (login do Facebook,
> com Página vinculada). Ele continua valendo para a `/aprovar-post`, mas o agente social usa este.

## Antes de começar

- A conta do Instagram precisa ser **profissional** (Empresa ou Criador) e **pública**.
  No app: Configurações e privacidade → Tipo de conta e ferramentas → Mudar para conta profissional.
- Saber **qual é o @ oficial** da Horus (o repositório tem três, ver `ARQUITETURA.md` seção 6).
  O token tem que sair dessa conta.

## Passos

1. **Criar o app.** Entre em <https://developers.facebook.com/apps> com o seu Facebook e clique
   em **Criar app** (canto superior direito).
   - **Detalhes do app:** nome `Horus Social`, e-mail de contato o seu.
   - **Casos de uso:** marque **só** "Gerenciar mensagens e conteúdo no Instagram" (fica no filtro
     "Business Messaging"; apesar do nome, é a API inteira: posts, stories, comentários, DM e
     métricas). Não marque Messenger nem WhatsApp. Avançar.
     (Tela conferida pelo Marcelo em 27/09/2026. O fluxo antigo pedia "Outro" → "Empresa".)
   - **Empresa:** se pedir portfólio empresarial, escolha não conectar agora.
   - **Requisitos** e **Visão geral:** seguir e criar o app.

2. **Abrir a configuração do Instagram.** No painel do app, abra o caso de uso do Instagram
   (**Personalizar caso de uso** / **Configuração da API com login do Instagram**).
   Se aparecer a escolha entre "login do Instagram" e "login do Facebook", fique com **login do Instagram**.

3. **Colocar a conta da Horus.** Na seção **Gerar tokens de acesso**, clique em **Adicionar conta**
   e entre com o Instagram oficial da Horus.
   - Se a Meta pedir para aceitar um convite de testador: no app do Instagram, vá em
     Configurações → Apps e sites → Convites de testador, e aceite.

4. **Gerar o token.** Ainda em **Gerar tokens de acesso**, clique em **Gerar token** ao lado da
   conta. Autorize todas as permissões que ele pedir:
   `instagram_business_basic`, `instagram_business_content_publish`,
   `instagram_business_manage_comments`, `instagram_business_manage_insights`,
   `instagram_business_manage_messages`.
   Copie o token que aparecer (começa com `IG`, é bem longo).

5. **Guardar o token sem expor.** Abra o Bloco de Notas, cole só o token e salve como:
   `E:\Users\hagge\Downloads\HorusOS\ferramentas\social\.segredos\token.txt`
   (crie a pasta `.segredos` se não existir; ela fica fora do Git).
   **Não cole o token aqui no chat.** Conversa fica registrada; o arquivo não.

6. **Me avise.** Eu rodo `salvar-token`, que confere o token na Meta, grava em
   `.segredos/horus.json`, apaga o `token.txt` e mostra de qual @ ele é.

## O que já sabemos sobre esse token

- Vale **60 dias** e pode ser renovado a qualquer momento depois de 24 horas. O motor renova
  sozinho quando faltar menos de 10 dias (comando `renovar-token` enquanto a rotina não existe).
- Com o app em modo de desenvolvimento, ele funciona para a conta que você adicionou no passo 3,
  que é a própria Horus. A **revisão do app pela Meta** só é necessária para usar em conta de
  terceiros (clientes) e para receber webhooks em produção. Fica para a etapa 7.
- Se um dia você trocar a senha do Instagram ou remover o app das configurações da conta, o
  token morre. O motor detecta (erro de autenticação), para de escrever e avisa.

## O que a API NÃO faz (e por isso o Playwright continua no projeto)

Editar bio, nome e foto; criar ou editar destaques e capas; editar legenda de post publicado;
música licenciada em Reels; iniciar DM com quem não escreveu primeiro (esse também é proibido
pela nossa política).
