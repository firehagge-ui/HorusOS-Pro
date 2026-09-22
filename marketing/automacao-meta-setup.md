# Guia de Configuração: Conexão e Publicação Automática no Instagram e Facebook

Este guia orienta o passo a passo para conectar sua conta do **Instagram** e sua **Página do Facebook** ao **Horus OS**, permitindo publicar posts e carrosséis automaticamente através da Meta Graph API oficial.

---

## 1. Pré-requisitos nas Redes

Antes de mexer no portal de desenvolvedores, garanta o vínculo no app:

1. **Conta Comercial no Instagram:**
   * No app do Instagram: vá em *Configurações e privacidade* > *Tipo e ferramentas da conta* > *Mudar para conta profissional* (selecione "Empresa" ou "Criador de conteúdo").
2. **Página no Facebook:**
   * É obrigatório ter uma Página no Facebook vinculada a essa conta de Instagram.
   * No Instagram: vá em *Editar perfil* > *Página* > conecte ou crie a Página do Facebook correspondente.

---

## 2. Criar Aplicativo no Meta for Developers

1. Acesse [developers.facebook.com](https://developers.facebook.com/) e faça login com a conta do Facebook administradora da Página.
2. Clique em **Meus Aplicativos** (canto superior direito) > **Criar Aplicativo**.
3. Selecione o caso de uso: **Outro** > **Avançar**.
4. Escolha o tipo de aplicativo: **Empresa** (Business).
5. Defina um nome (ex: `Horus Publicador`) e confirme a criação.

---

## 3. Adicionar o Produto "Instagram Graph API"

1. No painel do seu aplicativo recém-criado, procure por **Instagram Graph API** e clique em **Configurar**.
2. No menu lateral, acesse **Ferramentas** > **Explorador da Graph API** ([Graph API Explorer](https://developers.facebook.com/tools/explorer/)).

---

## 4. Gerar os IDs e o Token de Acesso

### Passo 4.1: Permissões necessárias no Graph API Explorer
No lado direito da tela do Graph API Explorer:
1. Em **Aplicativo do Meta**, selecione o app que você criou.
2. Em **Permissões** (*User or Page Permissions*), adicione:
   * `instagram_basic`
   * `instagram_content_publish`
   * `pages_show_list`
   * `pages_read_engagement`
   * `pages_manage_posts`
3. Clique no botão azul **Generate Access Token**. Faça o login e selecione a Página e a conta do Instagram desejadas.

### Passo 4.2: Descobrir o ID da Página (`META_PAGE_ID`) e do Instagram (`META_IG_USER_ID`)
No campo de busca da URL do Explorador, digite:
```http
GET me/accounts?fields=id,name,access_token,instagram_business_account{id,username}
```
Clique em **Enviar**. A resposta em JSON trará:
* O `id` da página do Facebook: esse é o seu **`META_PAGE_ID`**.
* O `id` dentro de `instagram_business_account`: esse é o seu **`META_IG_USER_ID`**.
* O `access_token` específico da página: esse token já pode ser usado, mas é recomendável gerar um token permanente (de longa duração).

### Passo 4.3: Gerar Token de Longa Duração (60 dias ou vitalício)
1. Acesse a ferramenta de [Depurador de Tokens de Acesso](https://developers.facebook.com/tools/debug/accesstoken/).
2. Cole o token gerado e clique em **Depurar**.
3. No final da tela, clique em **Estender token de acesso** para obter um token de longa duração (60 dias).
4. Guarde esse token: ele será o seu **`META_PAGE_ACCESS_TOKEN`**.

---

## 5. Configurar no Horus OS

1. Na raiz do projeto, crie o arquivo `.env` a partir do modelo `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Abra o `.env` e preencha:
   ```env
   META_PAGE_ACCESS_TOKEN=seu_token_estendido_aqui
   META_PAGE_ID=123456789012345
   META_IG_USER_ID=178414000000000
   SITE_URL=https://seusite.com.br
   ```

---

## 6. Como Publicar

Com as credenciais configuradas:
* Para criar o carrossel/post: execute `/carrossel` informando o tema.
* Para publicar no site e automaticamente no Instagram e Facebook: execute `/aprovar-post <slug>`.
* Ou execute o script manualmente:
  ```bash
  node --env-file=.env scripts/postar-instagram.js marketing/conteudo/<pasta-do-post>
  ```
