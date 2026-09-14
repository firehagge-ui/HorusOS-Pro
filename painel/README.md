# Painel Hórus — o sistema do cliente

> Réplica adaptada do **"Guia do Sistema"** (o material da Ana Scatolin / SABEC),
> reconstruída como **produto da Hórus**: o painel que o cliente da agência
> realmente usa. Primeiro caso de uso: **clínicas de odontologia**.

É a versão **funcional** do que o guia descreve. Uma operação de marketing com IA
que o dono da clínica opera sozinho — cria conteúdo, organiza, aprova e (quando
deixa) publica. Dark, premium, com a cara da Hórus e adaptável à marca de cada
cliente.

## O que tem aqui (as 16 telas do guia + mais)

**Todo dia**
1. **Início** — a "mesa do dia": decisões prontas com Aprovar / Rejeitar, foco do
   dia com contadores, atalhos rápidos e lista de tarefas.
2. **Conversar** — chat com a assistente. Ela reconhece o pedido e **cria de
   verdade** (o conteúdo aparece em "Pra revisar").
3. **Criar** — o cardápio de ações, com o bloco **Foco especial · Campanhas**.
4. **Conteúdos** — kanban de 5 etapas (Ideias → Em produção → Pra revisar →
   Agendado → No ar) com **arrastar-e-soltar** e visão de galeria.
5. **Atividade** — o diário do sistema, com horário.
6. **Relatório** — a semana do Instagram em gráficos e resumo em português.
7. **Agenda** — o mês inteiro, eventos por cor, sincronização com Google Agenda.

**Ajustes**
8. **Modelos** · 9. **Referências** · 10. **Landing page** (edição por conversa +
prévia ao vivo) · 11. **Arquivos** (explorador) · 12. **Meu negócio** (as 3 fichas)
· 13. **O que sei** (memória, corrige/silencia/apaga) · 14. **Marca** (cores,
fontes, logo — **re-tema o painel inteiro ao vivo**) · 15. **Configurações**
(conexões, autonomia, teto de gasto, saúde) · 16. **Custo de API**.

**A mais do guia:** login/splash, onboarding rápido, **paleta de comando (⌘K)**,
Guia do sistema vivo dentro do painel, e todos os estados salvos no navegador.

## Como rodar

Não tem build. É HTML + CSS + JS puro. Serve qualquer servidor estático:

```bash
cd painel
python3 -m http.server 8080
# abra http://localhost:8080
```

Deploy: apontar Netlify/Vercel para a pasta `painel/` (sem comando de build,
publish directory = a própria pasta). É o mesmo caminho do Grão da Serra.

> Abrir o `index.html` direto (file://) também funciona para uma olhada rápida,
> mas hospedar é o jeito certo (fontes e cache).

## Como é por dentro

```
painel/
  index.html            # shell + ordem dos scripts
  assets/css/
    base.css            # tokens (cores/fontes Hórus), reset, tipografia
    layout.css          # sidebar, topbar, shell, responsivo
    components.css       # botões, cards, kanban, modais, gráficos, calendário…
    views.css           # login, paleta de comando, chat e telas
  assets/js/
    icons.js            # ícones SVG próprios (uma família só)
    store.js            # estado + localStorage + seed da clínica-demo
    ui.js               # helpers de DOM, toast, modal e gráficos inline
    router.js           # roteador por hash (#/inicio, #/criar…)
    app.js              # monta o shell, login, onboarding, paleta ⌘K
    views/*.js          # uma tela por arquivo (16 + guia)
```

- **Sem dependências.** Zero libs de JS. Gráficos (sparkline, donut, barras) são
  SVG desenhado na mão. Ícones idem. Só as fontes vêm do Google Fonts.
- **Estado** mora em `localStorage` (`horus_painel_state_v1`). "Restaurar
  demonstração" (em Configurações) volta ao seed.

## White-label (adaptar a um cliente novo)

O painel já se adapta pela tela **Marca** e **Meu negócio** — o cliente muda cor,
logo e dados e o painel inteiro acompanha. Para pré-configurar um cliente no
código, edite o `seed()` em `assets/js/store.js` (nome, cidade, cor, serviços,
conteúdos de exemplo).

A cor de acento é a variável CSS `--brand` (e `--brand-2`), trocada ao vivo — todo
o resto do tema deriva dela.

## Verificado

Testado em Chromium headless: as 16 telas renderizam sem erro de console, o fluxo
aprovar/rejeitar, o chat que cria conteúdo, o re-tema da marca, o kanban e a
navegação mobile funcionam, e nenhuma tela estoura a largura no celular (390px).
O único aviso de rede em ambiente isolado é o CDN de fontes — no ar, carrega
normal e cai no fallback do sistema se faltar.

---

Feito pela **Hórus**. Para clínica de odontologia, valem as travas de sempre:
sem promessa de resultado, sem superlativo, e antes/depois só com autorização do
paciente (a demo já reflete isso). Ver `painel/CLAUDE.md`.
