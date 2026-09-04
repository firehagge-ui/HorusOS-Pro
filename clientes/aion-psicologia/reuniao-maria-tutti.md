# Kit de reunião — apresentação do site à Maria Tutti

> Montado em 27/08/2026. A reunião é **só com a Maria Tutti** (CRP 03/939),
> sócia-gerente, ou seja, com quem assina ^[clientes/aion-psicologia/CLAUDE.md:Dados
> confirmados 28/07/2026]. O site é **especulativo**: foi construído antes do "sim"
> para ser a peça de venda. O objetivo da reunião é o "sim" e destravar os dados que
> só a clínica tem.
>
> Regra que atravessa tudo: **não inventar nada**. Onde falta dado, é pergunta para
> ela, não texto plausível (`_memoria/integridade.md`). E **compliance CFP trava**:
> sem promessa, sem depoimento, sem superlativo.

---

## Parte A — Como conduzir (roteiro de tela)

O site tem dez páginas; não mostrar todas. Mostrar a home inteira, uma página de
serviço e o rodapé (onde mora a prova de conformidade). Ordem sugerida:

1. **Home, de cima a baixo.** Deixar ela ler o hero ("no Itaigara desde 2004") e a
   seção "Quando procurar". Perguntar: *"você se reconhece em como a clínica está
   descrita aqui?"* — é a validação de marca mais importante, e ela é dona da marca.
2. **Uma página de serviço** (ex.: avaliação neuropsicológica). Mostrar que cada
   serviço tem página própria, com "quando é procurado", "como funciona" e "quem
   conduz". É o que nenhum concorrente do panfleto tem.
3. **A seção "Quem atende" e o rodapé.** Aqui está a **demonstração de valor sem
   vender**: o site traz o **CRP de cada profissional e da pessoa jurídica**; o
   panfleto de 22 anos e o Instagram **não trazem CRP nenhum**
   ^[clientes/aion-psicologia/CLAUDE.md:panfleto de 22 anos] ^[briefing.md:§8]. Isso é
   o que a Resolução CFP 011/2018 exige, e é o padrão da casa. ⚠️ Apresentar como
   **cuidado que a gente já faz**, nunca como crítica ao material dela.
4. **Fechar mostrando o que falta** (Parte B abaixo), enquadrado como *"o site já
   está de pé; o que falta é seu, e é rápido"*.

⚠️ Antes de mostrar, ligar o modo limpo (botão "Ocultar pendências") para os realces
dourados não lerem como defeito ^[clientes/aion-psicologia/CLAUDE.md:Campo sem dado].

---

## Parte B — O que confirmar (a pauta real)

### B1. Decisões de conteúdo (só ela resolve)

- 🔴 **Quais são os 6 serviços, afinal?** O panfleto lista **Avaliações
  Psicológicas** e **Educação Sócio Emocional** (que o site não tem) e **omite**
  Intervenção Neuropsicológica, Orientação Familiar e Grupo de Apoio Parental (que o
  site tem) ^[clientes/aion-psicologia/CLAUDE.md:panfleto de 22 anos] ^[briefing.md:§3].
  **Esta é a pergunta de conteúdo nº 1.** Não mexer nas 6 páginas antes da resposta.
- **Quais dos 6 serviços funcionam online?** A avaliação neuropsicológica costuma
  exigir parte presencial ^[clientes/aion-psicologia/CLAUDE.md:atende presencial e online].
- **As 11 perguntas das páginas de serviço**, todas marcadas `.pend`
  ^[clientes/aion-psicologia/CLAUDE.md:as 6 páginas]:
  - aceita laudo feito em outro serviço para iniciar a intervenção?
  - o grupo de apoio é aberto a familiares que não acompanham na clínica?
  - a orientação profissional atende reorientação de carreira de quem já está na
    faculdade?
  - como a orientação familiar se organiza quando há dois responsáveis?
  - frequência e critério de encerramento da intervenção?
  - periodicidade e tamanho das turmas do grupo?
  - (as demais estão marcadas `.pend` nas páginas)

### B2. Dados que destravam a publicação

Sem estes, o site sobe só com Deployment Protection (senha), nunca aberto
^[clientes/aion-psicologia/CLAUDE.md:Vercel]:

- **Telefone fixo ativo.** (71) 3351-6630 aparece no panfleto de 2026, mas é indício,
  não confirmação ^[clientes/aion-psicologia/CLAUDE.md:Telefone].
- **CRP da pessoa jurídica** (a clínica, além dos CRPs individuais que já temos).
- **Responsável técnica** (nome + CRP) — hoje o rodapé diz "a confirmar".
- **Os 2 profissionais que faltam** (nome, CRP, formação, e foto no mesmo fundo).
- **Destino do formulário** — para onde vão as mensagens. É dado de contato em saúde,
  então é LGPD; não ligar em serviço de terceiro sem falar com ela
  ^[clientes/aion-psicologia/CLAUDE.md:formulário].
- **Revisão da política de privacidade** — é minuta; a controladora é a Aion, não a
  Horus, então quem responde pela clínica revisa antes de publicar.
- **Acesso ao painel da Locaweb** (domínio `aionpsicologia.com`, dela e já
  divulgado). ⚠️ Se o e-mail da clínica estiver no mesmo plano, apontar o DNS sem
  preservar os MX **derruba o e-mail dela** ^[clientes/aion-psicologia/CLAUDE.md:Domínio].

### B3. Validações de marca (ela é a dona da marca)

- **Tipografia.** Os títulos usam EB Garamond; o `marca.md` (tirado dos cards do
  Instagram) pedia sans geométrica. Foi decisão do Marcelo, com a ressalva de que é
  mudança de marca e **ela valida** ^[clientes/aion-psicologia/CLAUDE.md:Tipografia].
  Se recusar, a volta segura é Outfit, não Poppins.
- **Fotos da equipe.** As três atuais são de sessões diferentes (fundos distintos),
  hoje niveladas por CSS. A correção de verdade são **três fotos no mesmo fundo** —
  pedir ^[clientes/aion-psicologia/CLAUDE.md:Retratos].

### B4. O gate de compliance (não negociável)

- Enquanto não houver o "sim" **e** o CRP da PJ **e** a responsável técnica
  preenchidos, o site sobe com **Deployment Protection ligada**. `noindex` bloqueia
  busca, não bloqueia acesso, e a página carrega nome, foto, CRP e endereço de três
  psicólogos ^[clientes/aion-psicologia/CLAUDE.md:Vercel]. Quem responde ao CFP é a
  clínica, não a Horus.

---

## O que NÃO levar para a reunião

- Nenhuma promessa de resultado, agenda cheia ou prazo. O site é informativo.
- Não repetir o superlativo herdado do MundoPsicologos ("os melhores profissionais
  da área") — é vedado pelo CFP ^[clientes/aion-psicologia/CLAUDE.md:Cuidado com o
  texto herdado].
- A ausência de CRP no material dela é **demonstração de valor do nosso trabalho**,
  nunca crítica ao material dela.
