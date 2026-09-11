# CRM e software hospedável — consulta (04/09/2026)

Três projetos open-source avaliados para **hospedar para cliente quando precisar**.
Aqui NÃO fica o código (são centenas de MB que ninguém lê, só roda): fica a **decisão**,
o encaixe e como subir. Padrão da casa igual ao `mcp-prospeccao/`: pasta fina, sem clonar
os MB pro git.

> ⚠️ **Hospedar = virar suporte técnico do cliente pra sempre.** Site é entrega (publica e
> para); CRM/chat é sistema vivo (uptime, patch de segurança, backup, integração que
> quebra → 0800 da Horus). **Precifica como mensalidade, nunca vira brinde do site.**
> Decisão de subir vai pro `/conselho` (financeiro + operações). Ver memória
> `project_software-hospedavel`.

## Os três

### Chatwoot — caixa de entrada omnichannel (o "WhatsApp organizado")
- Repo: https://github.com/chatwoot/chatwoot · ⭐36k · Ruby/Rails · ~291 MB
- **Licença:** núcleo MIT; a pasta `enterprise/` é proprietária — **não encostar nela**.
- **Encaixe:** WhatsApp + Instagram + e-mail + chat num lugar só. Serve todo cliente; é o
  "WhatsApp organizado" do plano da Amparo.
- Subir: `git clone https://github.com/chatwoot/chatwoot.git` e usar o
  `docker-compose.production.yaml` do repo. Precisa Postgres + Redis.

### Frappe CRM — CRM maduro
- Repo: https://github.com/frappe/crm · ⭐3,4k · Frappe/Vue/MariaDB · ~113 MB
- **Licença:** ⚠️ **AGPL-3.0** — cláusula de rede: se modificar E oferecer como serviço,
  é obrigado a disponibilizar o código. Hospedar instância sem modificar costuma estar ok;
  virar produto da Horus exige olhar com cuidado.
- **Encaixe:** CRM completo, integra WhatsApp (via app frappe_whatsapp). Operação mais
  pesada (bench, MariaDB).
- Subir: `wget https://frappe.io/easy-install.py && python3 easy-install.py deploy` OU o
  `docker-compose.yml` em `frappe/crm/develop/docker/`.

### Pronto — gestão para negócio de serviço (o mais encaixado na carteira)
- Repo: https://github.com/SGrappelli/pronto · ⭐48 · Next.js/TS/Supabase · ~5,7 MB
- **Licença:** MIT limpo.
- 🟢 **POC ATIVO desde 04/09/2026** — já foi clonado e rodado (seed da Amparo). Detalhe de
  como rodar, o que aprendemos e as travas respeitadas em **[`ferramentas/pronto.md`](../pronto.md)**.
  O código roda em `ferramentas/pronto-app/` (gitignorado).
- **Encaixe (o melhor dos três pra nós):**
  - **Grão da Serra** → o CRM que ele já pediu e é trabalho pago
  - **Amparo Flores** → PDV + estoque + **lembrete de aniversário/datas** = o "CRM de datas"
  - **Permita-se Fitness** → agendamento multi-modalidade
  - Agendamento com anti-dupla-marcação, ficha de cliente, PDV offline (PWA), estoque com
    código de barras, notificação por WhatsApp/Telegram/e-mail (confirmação, lembrete 24h/1h,
    aniversário, reativação).
- **Risco:** 48 estrelas, projeto novo — se o autor sumir, manutenção sobra pra Horus.
  Em compensação, stack (TS/Next) é a mais fácil de manter aqui.
- Subir: `git clone https://github.com/SGrappelli/pronto.git` e `docker compose up` (traz
  Supabase/Postgres). Cloud oficial: trypronto.app.

## Qual usar quando
- Cliente quer **atendimento centralizado** (WhatsApp/IG/email) → Chatwoot.
- Cliente quer **CRM + PDV + agendamento** e stack leve → Pronto (primeira escolha).
- Cliente quer **CRM robusto** e aceita operação pesada → Frappe (cuidar da AGPL).
