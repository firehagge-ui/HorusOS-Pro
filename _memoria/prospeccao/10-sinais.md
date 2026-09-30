# Biblioteca de sinais do negócio local

> 29/09/2026. Um **sinal** é um fato público que o dono confere em segundos e que aponta pra uma
> falha que a Hórus resolve. Formato tirado dos "signal playbooks" do coldoutboundskills (um sinal
> vira uma frase) e do método "Gatilho → Leitura → Pedido" do alirezarezvani/coreyhaines, traduzido
> pro negócio de bairro em Salvador e preso ao catálogo real (`_memoria/empresa.md`, 7 serviços).

## Como usar

1. **O sinal é fato; a leitura é hipótese.** "O botão de site do Google abre o Instagram" é fato
   (fonte, data, dono confere). "Por isso quem vem do Google desiste" é leitura: entra com o jeito
   do Marcelo, **"pra evitar que [o problema]"**, nunca como afirmação (Regra 4).
2. **Um sinal por mensagem.** O mais forte abre; os outros ficam pro passo 2, pras variantes ou pra
   R1. Vários sinais numa frase só lê como relatório de auditoria.
3. **O serviço sai da coluna "resolve com"**, nunca de fora do catálogo. Ideia que a casa não
   entrega é ideia que o Marcelo não sustenta na ligação (disciplina de "slot": ideia livre deu 2 de
   5 mensagens usáveis no teste do coldoutboundskills; ideia presa ao que o vendedor faz deu 21 de 23).
4. **Força:** 🟢 o dono vê o problema na hora e ele é dele (link quebrado, fala dele mesmo);
   🟡 fato verdadeiro, mas o dono pode não ver como problema; ⚪ sinal fraco, só serve com outro.
5. **Em branco vale mais que errado.** Se nenhum sinal sustenta uma frase verdadeira, a mensagem é a
   variação simples, e o briefing diz `personalizacao: fraca`. Não se estica sinal fraco.

## Os sinais

| # | Sinal (fato) | Onde conferir | Leitura provável (entra com "pra evitar que") | Resolve com | Força |
|---|---|---|---|---|---|
| S1 | **Fala do próprio dono** sobre um problema: resposta a avaliação, legenda, bio, story fixado ("paciente que confirma e não vem", "estamos sem agenda") | Maps → avaliações por "mais recentes" e as respostas; Instagram, legendas e destaques | O dono já sabe que dói. Oferta direta pra essa dor (Regra 5, caso 1). Citar a fala dele é o fato mais forte que existe | Depende da dor: Bot+CRM (confirmação, lista de espera), agendamento | 🟢 |
| S2 | **Link quebrado no caminho do cliente**: botão da bio que dá "link expirado", wa.me errado, site do Google que não abre, domínio antigo apontado por Doctoralia ou Facebook | Abrir cada link da bio e da ficha; anotar qual quebra e qual funciona | Pra evitar que quem quer marcar pare ali | Site / página com os botões certos | 🟢 |
| S3 | **Anúncio ativo levando pro WhatsApp** | Biblioteca de Anúncios da Meta (firecrawl, `waitFor`), nome exato da página e data de início | Pra evitar que quem chama, pergunta o valor e some fique sem retorno | Bot+CRM (retorno automático no momento certo) | 🟢 se o anúncio é novo · 🟡 se é antigo |
| S4 | **Botão "site" da ficha leva pro Instagram, WhatsApp ou Linktree** | Maps, campo de site | Pra evitar que quem chega pelo Google, que quer entender antes de chamar, não ache os serviços | Site com uma página por serviço, ligado à ficha | 🟡 (é o sinal mais comum do lote: cuidado com o esqueleto repetido) |
| S5 | **Ficha sem site nenhum** | Maps | Idem S4. A abertura boa é a pergunta de duas saídas (§12: "é porque vocês concentram tudo no Instagram, ou ainda não deu tempo?") | Site + visibilidade local | 🟡 |
| S6 | **Pacote, combo ou plano de sessões** à venda | Instagram, destaques de preço, site | Pra evitar que a cliente pare no meio do pacote | Bot+CRM (lembrete da próxima sessão, aviso pra quem sumiu) | 🟡 |
| S7 | **Avaliações recentes falando de demora pra responder, de não conseguir marcar, de telefone que ninguém atende** (e o dono não contestou) | Maps, "mais recentes", ler a resposta do dono antes (Regra 2) | Pra evitar que o próximo desista antes de ser atendido | Bot+CRM, agendamento | 🟢 se for recente e sem contestação |
| S8 | **Vaga aberta** de recepção, atendimento, social media | Instagram, LinkedIn, Indeed, grupos | Momento: estão montando a operação agora. Não afirmar sobrecarga, perguntar a prioridade | Bot+CRM (recepção), conteúdo (social media) | 🟡, forte como "por que agora" |
| S9 | **Inauguração, nova unidade, mudança de endereço, reforma** | Instagram, Google (ficha nova, endereço), imprensa local | Momento: ficha e site precisam acompanhar. A data é fato | Visibilidade local + site | 🟢 como "por que agora" |
| S10 | **Muitas avaliações sem resposta do dono** | Maps | Leitura delicada (ele pode não ligar). Só como complemento, nunca abre a conversa | Visibilidade local (fotos e avaliações) | ⚪ |
| S11 | **Agenda de terceiros no lugar de site** (Doctoralia, Booksy, Trinks) | Links da bio e da ficha | O cliente fica numa vitrine que também mostra o concorrente. Hipótese, entra com "se" | Site + agendamento próprio | 🟡 |
| S12 | **Categoria genérica no Google** (oficina de marca como "Mecânica") | Maps | 🔴 **Só com a busca do Marcelo no dia, com print** (Regra 3). Sem isso, o sinal não existe | Visibilidade local | ⚪ sem print · 🟢 com print |
| S13 | **Loja no Instagram com pedido por DM** (preço "no direct", catálogo em destaque) | Instagram | Pra evitar que o pedido se perca na DM | Loja virtual ou catálogo com pedido no WhatsApp | 🟡 |

| S14 | **Mensagem automática do WhatsApp Business** na entrada (saudação ou ausência; às vezes já pede dados: "data do evento, tipo, convidados") | A resposta ao passo 1, em segundos (29/09: Talina e Bioclin) | Eles já acreditam em automação e cuidam da **chegada** do cliente. A saudação nativa é fixa: não volta em quem sumiu, não confirma, não preenche horário. A oferta vira **complemento do que eles já fizeram**, nunca "vocês não têm". **O robô não se cita no corpo** (não é a dor, soa como inspeção, planta a objeção); só se o lead trouxer | Bot+CRM na parte de **depois** da chegada (retorno de quem pediu orçamento, lista de espera, reconfirmação) | 🟡 |

**Onde não há sinal:** Instagram parado, poucos seguidores, "site feio" sem link quebrado. Isso é
opinião, não fato que o dono confere. Não abre conversa.

## Por que agora (o calendário do segmento)

Dado do coreyhaines (benchmarks.md): gancho de **"por que agora"** marcou 3,4 vezes mais reuniões
que gancho de problema, no e-mail B2B americano. No WhatsApp local ainda **não medimos**; entra como
teste. A data do calendário é fato conferível ("com o fim de ano chegando"); o efeito dela no negócio
dele é hipótese e entra com "pra evitar que".

| Segmento | Janela que movimenta | A partir de 29/09/2026, o próximo gancho |
|---|---|---|
| Estética corporal e facial | pré-verão (set a dez), Carnaval | verão e Carnaval 2027 (fevereiro) |
| Odontologia estética (lente, clareamento) | festas de fim de ano, formaturas, casamentos | fim de ano |
| Espaço de eventos, cerimonial, buffet | formaturas (nov a dez), confraternizações, casamento | fechamento das datas de dezembro |
| Oficina | revisão antes de viajar (fim de ano, São João na estrada) | viagem de fim de ano |
| Floricultura | Dia das Mães, Namorados (12/06), Finados (02/11), Natal | Finados e Natal |
| Academia, pilates, estúdio | janeiro, pré-Carnaval | janeiro |
| Confeitaria, restaurante | Páscoa, São João, Natal (encomenda) | encomendas de Natal |
| Escola, curso, idiomas | matrícula (nov a jan) | matrícula 2027 |
| Loja de roupa, presente | Dia das Crianças (12/10), Black Friday, Natal | Black Friday |

⚠️ Urgência só com data real (`cold-message-processo.md`, "O que não passa"). "Vagas limitadas",
"só essa semana" e desconto por pressa continuam vetados. Em cliente regulado, calendário não entra
como promessa ("fique pronta pro verão" é promessa de resultado estético).

## Quando o sinal é de outro serviço do catálogo

Nem todo lead é site (Regra 5). A tabela acima aponta pra **Bot+CRM** em S1, S3, S6 e S7, pra
**loja** em S13, e pra **visibilidade local** em S9, S10 e S12. A variante do site entra sempre
que S4 ou S5 existirem (regra do Marcelo, 28/09), mas **não é obrigatoriamente a A**: a A é a do
sinal mais forte.
