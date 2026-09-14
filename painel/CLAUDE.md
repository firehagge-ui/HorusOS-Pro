# Painel Hórus — contexto e doutrina do produto

> **O que é:** o painel que o **cliente da Hórus** usa. Reconstrução funcional do
> "Guia do Sistema" (material da Ana Scatolin, "por SABEC"), adaptado para a Hórus
> ("por HÓRUS") a pedido do Marcelo em 13/09/2026: *"será nosso agora, monte tudo
> idêntico e funcional"*. Primeiro caso de uso: **clínicas de odontologia**.
>
> Não é site de cliente nem peça de campanha: é **software** — o front-end visual
> do Horus OS entregue ao cliente final. Por isso mora na raiz, junto de `site/`, e
> não em `clientes/`.

## Decisões travadas

- **Dark premium, azul da marca.** O produto é escuro (`#0A0B0F`) com acento azul
  `#2563EB`, exatamente a identidade da Hórus. Foi essa a linguagem dos mockups do
  guia original (as telas do painel são dark; só as páginas do guia são claras).
- **Adapta à marca do cliente.** A tela **Marca** troca `--brand` ao vivo e o painel
  inteiro acompanha. A assinatura "por HÓRUS" fica no login e no rodapé da sidebar.
- **Sem build, sem libs.** HTML/CSS/JS clássico (scripts, não módulos), para rodar
  hospedado e localmente. Gráficos e ícones são SVG próprio. Estado em
  `localStorage`. Fácil de hospedar (Netlify), fácil de clonar por cliente.
- **Demo = clínica fictícia** ("Dra. Marina Alves · Guarapuava"). Dado de exemplo,
  claramente editável. Não usar nome de pessoa real no seed.

## Regras que atravessam (valem porque o cliente é odonto)

Este painel é usado por **profissional de saúde em setor regulado (CFO)**. O que a
IA *sugere* dentro dele, e os textos-semente, seguem as travas da casa
(`_memoria/integridade.md`, `_conselho/cargos/compliance.md`):

- **Sem promessa** de resultado, cura ou prazo. **Sem superlativo** ("o melhor",
  "referência").
- **Antes/depois só com autorização** assinada do paciente (a demo marca isso).
- Nada de número, formação ou depoimento inventado — dado que falta é placeholder.
- O modo mais seguro é o padrão: autonomia começa em **"sempre pergunta"**; nada
  publica sem o ok do cliente. Essa é a promessa central do produto, não um detalhe.

## Onde mexer

- Telas: `assets/js/views/<nome>.js` (uma por arquivo). Registro em
  `App.views['<id>']`. A ordem/menu está em `App.NAV` (`assets/js/app.js`).
- Dados e seed: `assets/js/store.js` → `seed()`.
- Tokens de design: `assets/css/base.css`. O acento é `--brand`/`--brand-2`.
- Detalhes de hospedagem e arquitetura: `painel/README.md`.

## Verificação

Antes de dizer "pronto", rodar o smoke test headless (Chromium já vem no ambiente):
carrega as 16 telas, confere console limpo, o fluxo aprovar/criar/re-tema/kanban e
que nada estoura a largura no celular. O aviso do CDN de fontes em ambiente isolado
não conta como erro (cai no fallback do sistema).
