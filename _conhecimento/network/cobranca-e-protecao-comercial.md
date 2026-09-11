# Card — Cobrança, fechamento e proteção contra cliente-fantasma

> **Fonte:** 4 grupos de network do Marcelo, via Q&A do NotebookLM · **primeira gravação:**
> 10/09/2026 · **origem:** situação real da Amparo Flores (#6), que fechou verbal na reunião,
> viu o site (ao vivo + vídeo no grupo) e sumiu antes de pagar a entrada.
> **Confiança: ALTA** para as práticas de cobrança e estrutura de pagamento (prática real de
> agências e devs brasileiros) · **MÉDIA e calibrar** para a camada de contrato/multa/retenção
> (mais adversarial que a postura da casa; ver a ressalva no fim).
> ⚠️ Referência de mercado, **não meta e não promessa**. Nada aqui vai para peça de cliente.

---

## 1. As duas falhas de processo que criam o cliente-fantasma

1. **Vender pra quem não decide sozinho.** Se um sócio não estava na reunião, o dono sai
   empolgado mas **não consegue retransmitir o valor** pra quem faltou. A objeção (financeira
   ou não) nasce nos bastidores, com alguém que você nunca falou, e o "sim" verbal trava.
   **Prevenção:** qualificar o decisor **antes** da reunião ("você é a única pessoa que decide
   ou tem mais alguém que deveria estar presente?").
2. **Dar o onboarding antes do pagamento.** Criar o grupo de WhatsApp antes da entrada cair
   **mata a urgência**: o cliente sente que o projeto "já começou" e a pressa de pagar some.

## 2. Como destravar quando já travou

- **Parar de mandar mensagem no grupo.** No texto o cliente ignora e procrastina sem custo, e
  cobrança sem resposta vira constrangimento que ele passa a evitar.
- **Ligar (voz).** Na ligação ele é obrigado a dar uma resposta e você ouve a objeção real.
- **Ir na raiz (o sócio ausente):** propor uma call curta de 10 a 15 min com o dono **e** o
  sócio, enquadrada sem pressão. Ex.: *"como sua irmã também é sócia e decide, sei que é difícil
  você repassar tudo sem ela ter visto a apresentação; vamos 15 min os três pra eu tirar as
  dúvidas dela e alinhar o início?"*
- **Trocar a condição se a trava for caixa:** link de **cartão parcelado** (cliente paga por
  mês, você saca antecipado) no lugar do Pix de uma vez. Facilitador, não desconto.
- **Limite de insistência:** após **1 a 2 tentativas diretas** sem resposta, parar e seguir
  ("amor ao próximo cliente"). Não adiantar nenhum trabalho antes da entrada cair.

## 3. Como estruturar pagamento pra reduzir o cliente-fantasma

1. **"Só abre o PC com dinheiro na conta"** (50% entrada / 50% entrega): desenvolvimento **e o
   grupo** só começam depois da entrada compensar (Pix) ou do parcelado ser aprovado. Sem
   pagamento, o projeto não existe na sua fila. Casa com Hormozi: **cash collected > contrato
   assinado**.
2. **Milestones por fase** (projeto de ~R$ 4.000 a 10.000): sinal (inicia design/layout) →
   parcela do meio (aprovação da interface / início de banco e integrações) → parcela final
   (antes de publicar e entregar os acessos).
3. **Retenção de acessos e ambiente:** durante o dev, projeto na **sua** conta (Netlify,
   Vercel, servidor). Senhas de admin, código-fonte e migração pro domínio definitivo **só após
   100% quitado**. Se o cliente some ou atrasa a parcela final, fica inativo no seu ambiente
   até regularizar.
4. **Contrato digital assinado antes do sinal** (**Gov.br** grátis, com validade jurídica, ou
   ZapSign), com cláusulas de: **prazo de 5 a 7 dias** pra entrada após a apresentação;
   **pausa por inércia** (mais de 7 dias úteis sem responder ou sem mandar material → projeto
   pausado, com **taxa de reativação** pra voltar à fila); **retenção do sinal** em caso de
   desistência unilateral do cliente.

## 4. Ressalva da casa (onde calibrar)

- 🔴 **A camada de contrato/multa/retenção é boa para projeto médio-grande e cliente distante.**
  Para negócio tradicional pequeno (o senhor de floricultura de 50 anos), contrato de cinco
  páginas com multa **"trava, não fecha"** ^[_conselho/logs/2026-09-03-amparo-flores-fechamento-reuniao.md
  Operações]. Para esse perfil: **aceite leve de 1 parágrafo + entrada**; a camada de contrato
  formal entra na **Fase 2** (projeto maior, ticket que sustenta a formalidade).
- **Retenção de domínio no seu ambiente ≠ domínio no seu nome.** O domínio se registra **no
  nome/CNPJ do cliente** (regra da casa, `precificacao-sistemas-web.md` §4.3); o que fica retido
  até a quitação é a **publicação no domínio final e os acessos de admin**, não a titularidade.
- A parte de **voz, mini-call e parcelamento** já é doutrina da casa (`_memoria/comercial.md`):
  o card **confirma**, não substitui. Onde o card for além (contrato Gov.br, cláusula de pausa,
  milestones), é candidato a virar doutrina se o Marcelo adotar.

---

**Cross-ref:** `precificacao-sistemas-web.md` §3 (estrutura de pagamento) · `_memoria/comercial.md`
(fechamento e "o compromisso se tira na reunião").
