# Inspiração: roleta "Gire e Ganhe" (captura de lead gamificada)

- **Tipo:** interacao
- **De onde:** High Torque Store — https://www.hightorquestore.com.br (widget servido de
  `https://leadup.loboimpact.com.br/w/high-torque-store`)
- **Segmento de origem:** e-commerce automotivo (aditivos)
- **Visto em:** 11/09/2026
- **Teardown irmão:** `referencias/high-torque-store-aditivos.md`

---

## O que é

Modal de **captura de lead gamificada**: metade esquerda é uma roleta em forma de **timão
de navio** (leme) com 4 fatias de prêmio alternando vermelho e preto; metade direita é um
formulário curto (nome, e-mail, telefone) com botão verde "GIRAR ROLETA". O visitante
preenche pra girar, gira pra ganhar um cupom/brinde, e nesse movimento entrega o contato.
Dispara no scroll/tempo e deixa um **botão-aba vertical** grudado na lateral direita
("Gire e Ganhe!") que reabre o modal.

⚠️ **Não é código do site.** É o SaaS **LeadUP** (da Lobo Impact), carregado num `<iframe>`.
O site só injeta o script. Fazer "igual" tem dois caminhos — ver "Como recriar".

## Por que marca

- **Troca de valor explícita:** "gire e ganhe" transforma o formulário chato num jogo com
  recompensa imediata. A pessoa não "assina newsletter", ela **ganha um prêmio** — a
  fricção de entregar o telefone cai muito.
- **O leme não é enfeite, é marca.** O formato de timão de navio some com o clichê da
  roleta de pizza genérica e ainda conversa com o universo automotivo/mecânico (peça,
  metal, engrenagem). É a decisão que faz o widget não parecer template.
- **Cor que separa ação de contexto:** roda vermelho/preto (a marca), botão **verde** —
  o único verde da tela, então o olho vai direto pro "GIRAR".
- **Prêmio que sempre "cai bem":** as fatias são todas ganho (BRINDE, R$10 OFF, R$15 OFF,
  5% OFF) — não existe "não ganhou". A gamificação é de fachada; o objetivo real é o lead.

## Como recriar

Dois caminhos:

1. **Contratar o LeadUP** (loboimpact.com.br) — plug-and-play, painel pra configurar
   prêmios/probabilidade/gatilho, mas é mensalidade de terceiro e o lead nasce na base
   deles. Bom pra validar rápido.
2. **Construir custom** — 100% viável e é o caminho da casa (dono do lead, sem mensalidade,
   integra direto no `wa.me`/CRM). O SVG abaixo foi **extraído e reconstruído fiel ao
   original**; é só colar e animar.

- **Biblioteca detectada:** SVG puro (viewBox `0 0 200 200`), sem canvas, sem lib externa.
  Fonte **Inter** 800 nos rótulos. O giro é um `transform: rotate()` animado — CSS puro
  (`transition`/`@keyframes`) ou GSAP pra easing de desaceleração mais gostoso.
- **Custo honesto:** leve (é vetor). O trabalho não é desenhar, é a **lógica**: sortear a
  fatia, parar o ponteiro nela, validar o form, disparar o lead (WhatsApp/CRM/e-mail) e
  não deixar girar de novo sem preencher. Fatia deve cair sempre em prêmio.

### SVG da roda (timão), reconstruído — colar e usar

```html
<!-- Roda: gira o grupo .htx-wheel-seg via rotate; o ponteiro (gota no topo) fica fixo -->
<svg viewBox="0 0 200 200" width="260" height="260" aria-hidden="true">
  <defs>
    <radialGradient id="gRed" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#ff3232"/><stop offset="70%" stop-color="#ff0000"/><stop offset="100%" stop-color="#c30000"/>
    </radialGradient>
    <radialGradient id="gBlk" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#4c4c4c"/><stop offset="70%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <filter id="frameSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/></filter>
    <clipPath id="ctrClip"><circle cx="100" cy="100" r="18"/></clipPath>
  </defs>

  <!-- FATIAS (este grupo é o que gira) -->
  <g class="htx-wheel-seg">
    <path d="M 100 100 L 100 30 A 70 70 0 0 1 170 100 Z" fill="url(#gRed)" stroke="rgba(255,255,255,.15)" stroke-width=".5"/>
    <path d="M 100 100 L 170 100 A 70 70 0 0 1 100 170 Z" fill="url(#gBlk)" stroke="rgba(255,255,255,.15)" stroke-width=".5"/>
    <path d="M 100 100 L 100 170 A 70 70 0 0 1 30 100 Z"  fill="url(#gRed)" stroke="rgba(255,255,255,.15)" stroke-width=".5"/>
    <path d="M 100 100 L 30 100 A 70 70 0 0 1 100 30 Z"   fill="url(#gBlk)" stroke="rgba(255,255,255,.15)" stroke-width=".5"/>
    <!-- rótulos: preencher com os prêmios do cliente -->
    <text x="129.7" y="70.3"  text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="8" font-weight="800" font-family="Inter" transform="rotate(45,129.7,70.3)">BRINDE</text>
    <text x="129.7" y="129.7" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="8" font-weight="800" font-family="Inter" transform="rotate(135,129.7,129.7)">R$10 OFF</text>
    <text x="70.3"  y="129.7" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="8" font-weight="800" font-family="Inter" transform="rotate(225,70.3,129.7)">R$15 OFF</text>
    <text x="70.3"  y="70.3"  text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="8" font-weight="800" font-family="Inter" transform="rotate(315,70.3,70.3)">5% OFF</text>
  </g>

  <!-- MOLDURA DE TIMÃO (fixa): aro + 8 pinos a cada 45° + ponteiro-gota no topo -->
  <g filter="url(#frameSh)">
    <circle cx="100" cy="100" r="72" fill="none" stroke="#fff" stroke-width="5"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round">
      <line x1="100"   y1="28"    x2="100"   y2="8"/>
      <line x1="150.9" y1="49.1"  x2="165.1" y2="34.9"/>
      <line x1="172"   y1="100"   x2="192"   y2="100"/>
      <line x1="150.9" y1="150.9" x2="165.1" y2="165.1"/>
      <line x1="100"   y1="172"   x2="100"   y2="192"/>
      <line x1="49.1"  y1="150.9" x2="34.9"  y2="165.1"/>
      <line x1="28"    y1="100"   x2="8"     y2="100"/>
      <line x1="49.1"  y1="49.1"  x2="34.9"  y2="34.9"/>
    </g>
    <g fill="#fff">
      <circle cx="100" cy="8" r="5"/><circle cx="165.1" cy="34.9" r="5"/><circle cx="192" cy="100" r="5"/>
      <circle cx="165.1" cy="165.1" r="5"/><circle cx="100" cy="192" r="5"/><circle cx="34.9" cy="165.1" r="5"/>
      <circle cx="8" cy="100" r="5"/><circle cx="34.9" cy="34.9" r="5"/>
    </g>
    <!-- ponteiro em gota, apontando pra dentro no topo -->
    <path d="M100,32 C100,32 91,18 91,12 C91,7.03 95.03,3 100,3 C104.97,3 109,7.03 109,12 C109,18 100,32 100,32 Z" fill="#fff"/>
  </g>

  <!-- CUBO central com logo -->
  <circle cx="100" cy="100" r="22" fill="#fff" stroke="rgba(0,0,0,.1)"/>
  <image href="LOGO_DO_CLIENTE.png" x="84" y="84" width="32" height="32" clip-path="url(#ctrClip)" preserveAspectRatio="xMidYMid slice"/>
</svg>
```

Giro (CSS): `.htx-wheel-seg{transform-origin:100px 100px;transition:transform 4.5s cubic-bezier(.17,.67,.12,.99)}` e no clique, `rotate(360*voltas + anguloDoPremio)`.

### O resto do widget (card à direita)

- Título **"Gire e Ganhe!"** (bold) + subtítulo "Preencha seus dados para participar".
- 3 inputs: nome / e-mail / telefone, cantos arredondados, fundo branco.
- Botão **"GIRAR ROLETA"**, `background:#00C853`, texto branco, `border-radius:12px`,
  Inter 600.
- Microcopy sob o botão: "Ao participar, você concorda com nossa política de privacidade".
- Fundo do modal escuro (`#1a1a1a`), card claro.

## Onde cabe

- **Mullsanni Performance** (lead #8) — pedido direto do Marcelo (11/09), "muito igual a
  essa". Serve como **isca de captura** no site de oficina, integrada ao WhatsApp deles.
  Substituir o timão/leme por um elemento do universo remap se quiser (marcador de RPM,
  ponteiro de dyno) — o mecanismo é o mesmo, a metáfora vira a da marca.
- Qualquer cliente B2C de impulso onde faça sentido trocar prêmio por contato (floricultura
  Amparo, por exemplo, num "gire e ganhe" de frete/mimo).

## Cuidado

- ⚠️ **Posicionamento x ticket.** Na High Torque casa bem (produto de R$88, impulso). Na
  **Mullsanni o ticket é R$1.500-8.000 e a venda é por autoridade** — roleta de desconto
  pode baratear a marca e brigar com o clima premium/dark-founder que o teardown de
  performance manda seguir. Se entrar, que seja **discreta** (aba lateral, não pop-up
  agressivo) e com prêmio coerente com serviço (ex.: "diagnóstico/leitura de ECU cortesia",
  não "R$15 OFF"). Levar a decisão de **usar ou não** pro Marcelo antes de plantar no site.
- `prefers-reduced-motion`: quem pediu menos movimento não deve ver a roda girar sozinha —
  entregar o prêmio sem a animação longa.
- **LGPD:** o formulário coleta nome/e-mail/telefone. Precisa de consentimento explícito e
  link real de política de privacidade (a High Torque tem o microcopy, mas confirme o
  opt-in de verdade). Nada de telefone em query string (regra de privacidade da casa).
- **Dono do lead:** se usar o LeadUP, o contato nasce na plataforma deles — combinar
  export/integração. O caminho custom já resolve isso na origem.
- Cores/medidas aqui são **medidas** (extraídas do DOM), não aparentes — pode confiar.
