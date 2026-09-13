# Índice de referências — automotivo / oficina de performance

> **O que é:** ponto de partida de referências do gênero **oficina de performance /
> remap / detailing / concessionária**, levantado em 07/09/2026 com Firecrawl.
> **Nasceu do lead Mullsanni Performance**, mas serve a casa inteira e leads futuros
> do segmento (não tunelar num cliente só).
> ⚠️ **Índice + teardowns.** As URLs da seção 1 são candidatas verificadas por busca,
> ainda não estudadas. As da seção 0 **já viraram teardown de verdade**. Referência é
> material de estudo, não olhada rápida.

---

## 0. Teardowns já feitos (o par que fecha o gênero concessionária)

| Teardown | O que ensina |
|---|---|
| [`belloni-motors-seminovos.md`](belloni-motors-seminovos.md) | **Beleza + emoção** de loja pequena BR movida a WhatsApp. Card de carro → `wa.me` pré-preenchido (lógica invertida, igual Amparo), estoque headless no Supabase, bloco humano do fundador, dark premium `#0a0a0b`. **É a referência primária do modelo.** |
| [`stampede-auto-usados.md`](stampede-auto-usados.md) | **A máquina** de loja grande: SEO programático (uma página por busca, cidade no título), selo regulatório como prova, financiamento como isca. Feio, mas ensina a engenharia. |

**A leitura combinada:** beleza da Belloni + arquitetura de SEO da Stampede = o modelo de
concessionária/oficina da casa. Nota importante: **Belloni é concessionária (estoque),
Mullsanni é oficina (serviço)** — o que transfere é o card→WhatsApp, o fundador e o dark
premium, não a vitrine de preços.

**Terceiro teardown, o do gênero-irmão de oficina/preparadora:**
[`performance-automotiva-cinco-sites.md`](performance-automotiva-cinco-sites.md) (09/09/2026)
estuda 5 concorrentes diretos de remap/preparação (não concessionária) e mais 3 marcas
internacionais de referência (Brabus, Hennessey, Litchfield). É o que orientou a
reconstrução de `clientes/mullsanni-performance/site/` (rodada 3): número de dyno em
escala de herói, parede de equipamento como prova, fundador em 1ª pessoa. A Belloni
aparece nos dois teardowns, com foco diferente — aqui como loja/e-commerce, lá como
padrão de execução visual dark/founder-led a copiar para oficina de serviço.

**Quarto teardown, o do eixo autoridade + captura (não é oficina, é e-commerce de marca):**
[`high-torque-store-aditivos.md`](high-torque-store-aditivos.md) (11/09/2026) estuda a
**High Torque Store** — loja de aditivos movida a creator técnico (ADG, maior canal de
mecânica do Brasil). O e-commerce em si não transfere pra oficina, mas três coisas sim: a
**seção de autoridade de creator** (o rosto técnico como prova máxima, que é o ativo dos
sócios da Mullsanni), o **comparador "qual usar?"** em cards de cor (vira "qual serviço é
o seu?") e a **lógica de recompra** (cashback 5% + assinatura, a versão B2C do funil de
recompra/CRM da Fase 2). Trouxe também a **roleta "Gire e Ganhe"** (pedido do Marcelo,
"muito igual a essa") — ficha e SVG reconstruído em
[`_biblioteca/inspiracoes/interacao/roleta-captura-lead.md`](../_biblioteca/inspiracoes/interacao/roleta-captura-lead.md).
⚠️ A roleta é widget de terceiro (LeadUP); a ficha traz o caminho custom pronto e a
ressalva de posicionamento (desconto girando roleta briga com ticket alto de serviço).

---

## 1. Galerias de inspiração (a fonte contínua)

Não existe MCP dedicado que navegue essas galerias por nós. **O Firecrawl (já conectado)
faz esse papel** — busca e scrape de qualquer uma delas. Os pontos de entrada do gênero:

| Galeria | Onde entrar pro gênero | Nota |
|---|---|---|
| **Awwwards** | `awwwards.com/websites/automotive/` | ⚠️ A categoria "automotive" puxa muito **fabricante/B2B** (NEXUS, SBD, VOSS, Fisker), que é o gênero errado pra oficina. Curar, não copiar o clima corporativo. |
| **Land-book** | `land-book.com` → filtro Landing Page | Bom pra landing de serviço, que é o nosso caso. |
| **Godly** | `godly.website` | Curadoria pesada de motion/premium. |
| **Dribbble** | `dribbble.com/search/car-service-landing` | Conceito, não site no ar. Bom pra hero e layout. |
| **Behance** | busca "car detailing website landing page" | Projetos completos, útil pra fluxo. |
| **Landingi (lista comentada)** | `landingi.com/blog/automotive-landing-page-examples` | Exemplos com análise (A+ Auto Detailing, Express Car Wash). Útil pra copy e CTA. |

## 1.1. Sites bonitos de verdade do gênero (a caçada de estética premium)

Levantados em 07/09/2026. São o padrão de acabamento a mirar (curar: fabricante ≠ oficina).

| Referência | Por que olhar | Onde |
|---|---|---|
| **Awwwards — categoria Luxury (SOTD recentes)** | Rodéo studio, BL/S®, Vide Infra: acabamento e motion de nível premium que dá pra adaptar pro clima "carro no escuro". | `awwwards.com/websites/luxury/` |
| **Porsche / Polestar / Range Rover** | Aula de dark editorial, tipografia e storytelling de produto. Roubar o *clima*, não o orçamento de fabricante. | via `azurodigital.com/automotive-website-examples` |
| **Carvana** | Fotografia 360° do carro + preço transparente. Referência de *ficha de veículo* se o modelo de concessionária crescer. | carvana.com |
| **MotorDesk — Veloce / Veritas** | Templates de concessionária premium/esportiva (preto e branco, autoridade). Bom pra ver estrutura de loja de especialista. | `motordesk.com/.../template` |
| **SavvyDealer — 24 exemplos, 8 estilos** | Sites de concessionária reais e funcionais (navegação, inventário, calculadora). Bom banco pra comparar estilo. | `savvydealer.com/dealer-website-examples` |
| **Colorlib / MyCodelessWebsite** | Listas comentadas de 18–35 sites de concessionária, com o que cada um faz bem. Ponto de partida rápido. | `colorlib.com/wp/car-dealer-websites` |

## 2. Sites gênero-gêmeo (os mais úteis pra Mullsanni)

Estes são o alvo real: agências/sites que fazem **exatamente** site de oficina de
remap/tuning. Ensinam mais que Awwwards premiado porque carregam a expectativa do público.

| Referência | Por que estudar | URL |
|---|---|---|
| **Remapping Website Design** | Agência UK que só faz site de remap. Estrutura de "case studies + guias" pronta pro nicho. | `remappingwebsite.com/remapping-website-design` |
| **ByteFLASH — Remapping Websites** | Foco em **"enquiry flow" específico de remap** (marca/modelo/ano/motor). É o nosso formulário de qualificação, já pensado pro nicho. | `byteflash.dev/remapping-websites.php` |
| **JTK Remapping (case EverBlue)** | Case de 0 → **200-300 leads/mês** num tuning shop. Estudar a jornada de conversão, não só o visual. | `everbluedigital.com/case-study/jtk-remapping/` |
| **Awwwards "Classics Garage" — Car Selector** | Configurador/seletor de carro em three.js. Referência **se** um dia formos fazer seletor por modelo. Guardar, não obrigatório. | `awwwards.com/inspiration/car-selector-classics-garage` |
| **Awwwards — Strictly Studio (automotive)** | Um dos poucos "automotive" premiados com clima de performance, não corporativo. | via `awwwards.com/websites/automotive/` |

## 3. O que eu estudaria primeiro (shortlist pra `/estudar-site`)

Pra montar o modelo reutilizável de oficina/concessionária, na ordem:

1. **ByteFLASH + Remapping Website Design** — pegam o *fluxo de captação* do nicho (o que
   perguntar antes do WhatsApp). É o coração da conversão pra remap.
2. **1 detailing landing premium** (via Landingi/Dribbble) — pega o *clima visual*
   (dark + alto contraste + carro polido em destaque) que vende serviço premium de carro.
3. **1 Awwwards automotive não-corporativo** (Strictly Studio) — pega o *acabamento e motion*.

Cada um vira teardown em `referencias/` e o padrão consolidado vira linha em
`_memoria/design/00-anatomia.md` (o que se repete) ou `90-antipadroes.md` (o que evitar).

## 3b. Já temos site meio-pronto na casa? (checado 07/09)

**Não há template de carro/concessionária/oficina pronto** em nenhuma skill. Verificado:
- **impeccable** — é motor de design (agentes, hooks, detector), não tem site-modelo de gênero.
- **acervo (`_biblioteca/acervo/ui/`)** — só 3 peças: `kit-agendamento`, `kit-calendario`, `kit-mapa`.
  Reaproveitáveis no build (agendar test drive/serviço = `kit-agendamento`; localização = `kit-mapa`),
  mas não são um site.
- **O que temos de mais próximo já construído:** o **e-commerce da Amparo Flores**
  (`clientes/amparo-flores/site/`), que já faz card → carrinho → `wa.me`. A estrutura de vitrine +
  conversão por WhatsApp é a mesma; trocar flor por carro/serviço é adaptação, não obra nova.

**Conclusão:** o "template de oficina/concessionária" a gente **constrói agora** (a partir do
Belloni + Amparo), e no mesmo movimento vira a peça reutilizável do segmento via `kit-ingerir`.

## 4. Padrões do gênero que já dá pra antecipar (a confirmar no teardown)

- **Dark mode + acento vibrante** é quase regra em performance (o carro brilha no escuro).
- **Prova = número de dyno real**, não promessa. Casos ("ficou com 340cv") no lugar de
  "ganhe até X cv".
- **Formulário que qualifica o carro** (marca/modelo/ano/motor/objetivo) antes do contato.
- **Credencial de representação** (no caso ACF/Nova Racing) como selo de autoridade.
- Awwwards "automotive" ≠ nosso gênero: lá é fabricante, aqui é oficina. Curar com filtro.
