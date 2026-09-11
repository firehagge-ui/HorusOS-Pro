# Teardown: Belloni Motors

- **URL:** https://www.bellonimotors.com/
- **Segmento:** seminovos premium / concessionária independente multimarcas (São Paulo/SP)
- **Estudado em:** 07/09/2026
- **Nota:** 8/10 (pro nosso uso; é o gênero-gêmeo brasileiro quase exato do que vamos construir)
- **Contexto:** o Marcelo mandou como referência pro modelo de concessionária/oficina. É uma
  loja pequena (20 carros), brasileira, movida a WhatsApp. Vale mais que qualquer Awwwards de
  fabricante porque é o nosso porte e o nosso público real.

---

## Estrutura, na ordem

1. **Nav fixa** (Início, Nossos carros, Diferenciais, O Fundador, Contato) + botão WhatsApp destacado
2. **Hero** — foto da fachada ao entardecer em tela cheia, kicker "Seminovos premium",
   headline "Seu próximo carro, com a procedência que você merece", subcopy que já lista as
   ofertas (avaliação do usado, financiamento aprovado), dois CTAs (Ver veículos + WhatsApp)
3. **Marquee de diferenciais em loop** — Procedência verificada · Seu usado na troca ·
   Financiamento aprovado · Documentação completa · Test drive sem compromisso · Atendimento de quem entende
4. **Estoque em destaque** — grade de cards (foto, ano, km, preço), cada um com CTA "Ver detalhes"
   que **gera link `wa.me` pré-preenchido por carro** + botão "Ver todos (20 veículos)"
5. **"Por que a Belloni"** — headline "Comprar carro não precisa ser uma aposta" + 3 diferenciais
   (Curadoria de verdade, Transparência total, Pós-venda que existe)
6. **O Fundador** — foto do Marcos Belloni, citação em 1ª pessoa, escudo/assinatura da marca
7. **Galeria do showroom** — 3 fotos internas ("Entre no showroom e escolha o seu")
8. **CTA final** — "Vamos achar o seu carro?" + WhatsApp + Instagram
9. **Footer completo** — endereço com link pro mapa, telefone/WhatsApp, horário, redes, avaliações Google

Comparado com `_memoria/design/00-anatomia.md`: segue a anatomia clássica, mas o
elemento-assinatura é o **card de carro que fala direto no WhatsApp** e o bloco humano do fundador.

---

## O que copiar

### Card de produto que gera `wa.me` pré-preenchido, um por item

- **Como é feito:** cada card de carro tem um link `wa.me/55...?text=Olá! Tenho interesse no
  [MODELO]. Vi no site da Belloni Motors.` O clique abre o WhatsApp já com o carro escrito.
- **Por que funciona:** é a **lógica invertida** da casa (a mesma do site da Amparo Flores). O
  pedido nasce no site, o WhatsApp só confirma. Custo de API zero, risco de ban zero, e o lead
  chega qualificado ("já sei qual carro ele quer"). Para a Mullsanni, isso vira o formulário de
  qualificação de remap (marca/modelo/ano/motor) gerando o mesmo link.

### Inventário headless (estoque fora do código)

- **Como é feito:** as fotos dos carros vêm de um Supabase Storage
  (`...supabase.co/storage/v1/object/public/car-images/`), não do próprio domínio. O estoque é
  dado, não HTML.
- **Por que funciona:** o dono atualiza carro/preço/foto sem tocar no site. É o que separa um
  site que morre em uma semana de um que o cliente mantém. Pro nosso modelo de concessionária,
  é a diferença entre entregar um catálogo estático e um estoque vivo.

### "O Fundador" com rosto, nome e promessa em 1ª pessoa

- **Como é feito:** foto do dono + citação: *"Comecei a Belloni com uma ideia simples: vender
  carro do jeito que eu gostaria de comprar. Sem enrolação, sem letra miúda, olhando no olho."*
- **Por que funciona:** a objeção nº 1 de seminovo é medo de golpe/procedência. Rosto + nome na
  porta + promessa pessoal ataca isso de frente. Confiança em compra cara se compra com cara humana,
  não com selo. Transfere direto pra Mullsanni (Jordan, "o cara que começou tudo").

### Marquee que responde as objeções antes da pergunta

- **Como é feito:** faixa em loop com os 6 diferenciais que são exatamente as 6 dúvidas de quem
  compra usado (procedência, troca, financiamento, documentação, test drive, atendimento).
- **Por que funciona:** derruba objeção no primeiro scroll, sem o visitante ter que perguntar.

### Copy que fala a desconfiança da categoria

- "Comprar carro não precisa ser uma aposta." / "sem letra miúda, olhando no olho." Nomeia o medo
  do público (ser passado pra trás) e se posiciona contra ele. Copy de categoria, não genérica.

---

## Tipografia e cor

- **Fundo:** `#0a0a0b` (quase preto, declarado no `theme-color`). Dark premium: o carro e a
  fachada iluminada brilham no escuro. É a paleta certa pra performance/automotivo.
- Título x corpo com bom contraste de peso; acento aparente único (a confirmar no CSS se formos
  reaproveitar a paleta exata).
- **Regra que confirma nossa doutrina:** dark + 1 acento vibrante é quase padrão do gênero automotivo.

---

## O que não copiar

- **É concessionária (estoque), a Mullsanni é oficina (serviço).** A *grade de estoque* não se
  transplanta pra oficina: carro tem preço fixo público, remap não (varia por combustível/hardware).
  O que transfere é o **card→WhatsApp** e o **bloco do fundador**, não a vitrine de preços.
- Não copiar preço público de serviço. Em oficina, preço vira `[FALTA]`/orçamento, não etiqueta.

---

## Aplicado onde

- Modelo de **concessionária** (a construir) — referência primária de estrutura e estética.
- O padrão **card→`wa.me` pré-preenchido** já vive no site da Amparo Flores; aqui é a prova de que
  o mesmo motor serve carro. Vai pro modelo da Mullsanni como formulário de qualificação.
