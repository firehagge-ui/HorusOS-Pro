# Card — Agente de atendimento no WhatsApp pra clínica (humanização, agenda, migração, preço, teste, pós-entrega, retorno de orçamento)

> **Fonte:** oráculo do network (NotebookLM, 4 grupos), 03/10/2026, perguntas 22 a 29 de
> `_gestao/perguntas-oraculo.md`, feitas pro Icarus na Leal Oral Clinic.
> **Confiança:** ALTA pra humanização, teste e pós-entrega (relatos convergentes e batem com o que a casa já
> pensava) · ALTA pra faixa de preço de consultório solo · MÉDIA pra integração com sistema de odonto (a
> Clinicorp não foi citada pelo nome) · 🔴 dois pontos a casa **não adota** (marcados abaixo).
> Referência de mercado, não meta nem promessa. Nada daqui vai pra peça de cliente.

## 1. O que denuncia o robô

- Resposta no mesmo segundo, sem ritmo.
- Textão de uma vez.
- Frase corporativa, saudação pronta, excesso de emoji, acentuação errada ou exagerada, **travessão**.
- Mensagem que surge sem o "digitando..." antes.
- Áudio mandado como arquivo pra baixar, em vez de mensagem de voz com o player.

## 2. O que mais humanizou

- **"Digitando..." antes de cada envio** e **pausa variável** (2 a 5 s, ou calculada pelo tamanho), nunca fixa.
- **Mensagens picadas:** 2 ou 3 curtas em sequência (saudação, pausa, pergunta), limite de tamanho no prompt.
- **Áudio:** espelhar o paciente (texto com texto, áudio com áudio), mensagem de voz nativa, e avisar antes
  quando a explicação vai em áudio. Voz sintética citada (ElevenLabs) e transcrição (Whisper).
- **Exemplos reais da recepção** no prompt ou como base de consulta: a IA copia o tom e o vocabulário da equipe.
- **Instruções negativas:** proibir travessão, saudação pronta e jargão.
- **Pausa automática** quando o paciente sai do escopo ou quando a recepcionista digita pelo celular ou pelo
  WhatsApp Web (24 h ou até resolver).

## 3. Agenda: como integram e o que quebra

- Muitos sistemas de odonto têm API fechada ou sem aviso em tempo real; o mais comum é uma **agenda espelho**
  (Google Agenda, Kommo, Supabase). A Clinicorp não apareceu pelo nome.
- A IA oferece **poucas opções de horário por vez**, grava e avisa a recepção.
- **Overbooking:** se a checagem de horário depende da interpretação do modelo, ele inventa vaga. **A checagem
  de choque e a gravação são código no servidor**, antes de confirmar pro paciente.
- Encaixe de urgência, remarcação de última hora e pergunta de preparo: **passar pra recepção na hora**.
- WhatsApp não oficial cai no meio da marcação e deixa o paciente no vácuo.

## 4. Migrar quem já tem robô

- **Coexistence** (API oficial com o app do WhatsApp Business continuando no celular). Dá certo com número que
  está em outro BSP.
- Precisa de **acesso de administrador à conta empresarial da Meta (BM) do cliente** e de um BSP que suporte
  Coexistence (360dialog, Stevo citados); troca as credenciais do BSP antigo pelas nossas.
- Cuidados: pausa da IA quando a equipe responde pelo app; verificação da empresa na Meta pode demorar; combinar
  antes que a API oficial cobra por mensagem.

## 5. Preço pra consultório de um dentista só

| Item | Faixa |
|---|---|
| Implantação | **R$ 1.500 a 3.000** (escopo enxuto: R$ 1.500 a 2.500) |
| Mensalidade | **R$ 400 a 800**, o mais aceito **R$ 500 a 600** |

- A mensalidade cobre suporte, manutenção, ajuste do prompt com as conversas reais e acompanhamento.
- **O cliente paga os custos variáveis:** mensagens da Meta no cartão dele (na BM ou no BSP), e o pessoal coloca
  a chave da IA, o servidor e o banco **em nome do cliente**. Cláusula clara no contrato: a mensalidade é gestão,
  não consumo.

## 6. Teste antes de soltar e tempo até ficar bom

- **Ligar aos poucos:** por ~30 dias, mais ou menos 4 de cada 10 conversas vão pra IA; o resto segue humano.
- A recepção acompanha ao vivo e assume quando a IA hesita (Coexistence + pausa automática).
- **Cliente oculto e teste de estresse** antes de paciente real: áudio confuso, procedimento que não existe,
  tentativa de burla; às vezes uma segunda IA fazendo o papel do paciente difícil.
- Testes iniciais em **número secundário**, antes de ligar na agenda real.
- **Tempo:** 1 a 3 dias de montagem técnica; **15 a 30 dias de ajuste** até ficar seguro (dúvidas que não
  estavam na base, vícios de linguagem de IA, a recepção aprender a hora de entrar).

## 7. A IA diz que é IA?

- A maioria monta como "a secretária da clínica" e **não se apresenta como robô** na abertura: anunciar o robô
  faz o paciente responder seco e pedir humano antes de tentar.
- **Se o paciente perguntar direto, não mentir:** "Sou a assistente virtual da equipe do Dr. Fulano, pra agilizar
  seu agendamento. Se preferir falar com a recepção, te passo agora."
- ⚠️ O prompt citado na comunidade ("nunca se refira a si mesma como robô, IA ou assistente virtual") **a casa não
  usa como está**: a regra da Hórus é não anunciar e **nunca negar**. Bate com a própria conclusão do oráculo.

## 8. As dores depois da entrega (e a saída)

| Dor | Saída |
|---|---|
| Marcar em horário ocupado, cancelar sem atualizar | Checagem e gravação por código; homologação de cada regra; começar simples e passar o caso complexo pronto pra recepção |
| IA virando tabela de preço | Prompt proíbe valor de tratamento; insistência vira convite pra avaliação |
| Recepção e IA respondendo juntas | Pausa automática no paciente irritado ou quando a recepção digita; **treinamento da equipe dentro da implantação** |
| Número caindo ou bloqueado | API oficial com Coexistence |

## 9. Retorno de orçamento

- Gatilho: a recepção muda o status pra "orçamento enviado" e começa a contagem.
- **Cadência:** D+1 ou D+2 (ficou alguma dúvida?) → D+5 a D+7 (agenda do doutor, formas de pagamento) →
  **no máximo 2 ou 3 tentativas**. Mensagem de 2 a 3 linhas, sem reenviar PDF.
- Na API oficial, follow-up comercial fora da janela de 24 h é **Marketing** (a categoria mais cara).
- 🔴 **O "jeitinho" da comunidade a casa não faz:** cadastrar modelo neutro como Utilidade pra pagar menos é
  classificar errado de propósito; a Meta reclassifica ou bloqueia, e é contra `_memoria/integridade.md`. Modelo
  de retorno de orçamento entra como Marketing, com o custo no orçamento do cliente.

## Nota da casa (o que muda no Icarus e na Leal)

- Aplicado em `Icarus/PLANO-V2.md` (§4, §5, §6, §8) e no dossiê da Leal (`clientes/leal-oral-clinic/preparacao-r1.md`).
- **A IA do cliente responde sozinha** (regra de 03/10/2026). O "ligar aos poucos" daqui é a forma de chegar lá,
  não aprovação mensagem por mensagem.
- O preço revisto da Leal (R$ 1.500 + R$ 690/mês) cai dentro da faixa da comunidade.
- Cross-ref: `servico-crm-whatsapp.md`, `precificacao-sistemas-web.md`, `_gestao/catalogo/clinicas.md`.
