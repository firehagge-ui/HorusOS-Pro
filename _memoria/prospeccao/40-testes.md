# Testes de prospecção: as abordagens e o placar (aberto em 08/10/2026)

> Pedido do Marcelo (08/10): testar e validar tipos diferentes de prospecção, de forma organizada,
> **sem assumir antes qual é a melhor**, medindo contatos, respostas, reuniões marcadas e clientes.
> Nasceu da análise de todas as conversas até 08/10 (as linhas de 08/10 em `aprendizados.md`).

## As regras do Marcelo (08/10/2026)

- **Por enquanto, tudo por WhatsApp.** Ligação só se o Marcelo quiser ligar; aí ela entra no placar
  como `ligacao`, fora da comparação principal. O roteiro está em `30-ligacao.md`.
- **A prévia não é etapa obrigatória.** O caminho padrão é: conversa → reunião marcada → só então o
  site, que a casa monta em 24 horas. Não se gasta tempo de produção antes de validar o interesse.
- **A prévia enviada por mensagem é uma abordagem a testar**, ao lado da padrão, pra descobrir se ela
  gera mais respostas e reuniões.

## As abordagens

| Etiqueta no Hounder | O que é | Estado |
|---|---|---|
| `abordagem:dois-passos` | Abertura curta que confirma quem decide → corpo (fato, "pra evitar que", "eu posso montar", pedido) → reunião. **Regra nova:** o corpo é aprovado junto com a abertura e sai em até 1 hora depois da primeira resposta humana. | rodando |
| `abordagem:previa` | Prévia leve do site montada antes (1 a 2 horas, a partir de template, `noindex`, em `clientes/_prototipos/<nome>/`) e mostrada na mensagem → reunião. | rodando |
| `abordagem:simples` | Uma mensagem só, a do Antônio de 28/09 (`exemplos.md`). | entra com a próxima lista do Spark |
| `abordagem:dois-passos-antigo` | Referência: os 9 leads abordados de 24/09 a 06/10, antes da regra da 1 hora. Não recebe lead novo. | fechada |
| `abordagem:ligacao` | Referência: Paralela Film (ligação fria do Antônio, 30/09). | fora da comparação |
| `abordagem:esboco-24h` | O roteiro das transcrições de cold call por texto (09/10): esboço começado antes, "fica pronto em 24h, se não gostar não paga", licença pra mostrar. Débora Reis e Spaço Saúde, por decisão do Marcelo, fora do sorteio. | rodando |

Lead que veio por relação (indicação, turma, sócio) não entra no teste: o canal é outro.

## Como os leads entram

Pares de leads parecidos (mesmo nicho ou mesma etapa); dentro de cada par, **sorteio** decide quem vai
pra qual abordagem. Assim ninguém escolhe a dedo o lead "mais fácil" pra abordagem preferida.

**Sorteio de 08/10** (semente `777b7616`):

| Par | Prévia | Dois passos |
|---|---|---|
| Arquitetura | Gabriel Arcanjo | Débora Reis |
| Qualificados restantes | New Place | Spaço Saúde |

⚠️ **Mudou em 09/10:** a Débora Reis e a Spaço Saúde saíram de "dois passos" e foram pra `esboco-24h`, por decisão
do Marcelo (roteiro das transcrições). "Dois passos" ficou sem lead até a próxima lista do Spark; o par de cada
sorteio novo precisa repor o braço.

Clínica Michele Oliveira fica fora até se saber se o "Abordado" de 07/10 foi uma mensagem real.

## O placar

`node ferramentas/hound-dog/scripts/placar.mjs` lê o Hounder e mostra, por abordagem:

- **Contatos:** lead com mensagem enviada (Disparos, WhatsApp ou atividade registrada).
- **Respostas:** resposta de gente depois do primeiro envio. Robô do WhatsApp Business e assistente
  virtual não contam (`AUTO_RESPOSTA_SQL` em `app/js/revisor.js`).
- **Reuniões marcadas:** R1 ou R2 na agenda, ou o lead passou por "Reunião marcada".
- **Clientes:** o lead chegou a "Ganho".

⚠️ A resposta à abertura engana: 8 dos 9 leads antigos responderam ao "oi" e nenhum marcou reunião. A
medida que decide é **reunião marcada**. Resposta só mostra se a abertura é lida.

## As regras que valem pra todas as abordagens

- **Todo contato vira registro no Hounder** no mesmo dia. Mensagem mandada pelo celular é reconhecida
  pelo Farejador. Ligação ou mensagem fora dele vira `hd_registrar_atividade`.
- **No máximo duas versões por mensagem.** Na terceira reescrita o problema é a tese, não o texto.
- **Sinal de compra recebe passo concreto:** horário fechado ("amanhã às 10h ou às 16h?"), nunca "pode ser?".
- **Corpo não vai pela recepção.** Se quem responde é a recepção, a regra das duas saídas de
  `20-escrita.md` §6 continua valendo, e o placar anota que não se falou com quem decide.
- **Pelo menos 10 contatos por abordagem antes de qualquer veredito.** Antes disso é leitura de caso.

## O ritual da sexta (15 minutos)

1. `node ferramentas/hound-dog/scripts/placar.mjs` e `node ferramentas/hound-dog/scripts/aprender.mjs 7`.
2. Uma linha em `aprendizados.md` pra cada padrão que apareceu duas vezes.
3. Os leads novos da semana entram em pares e passam pelo sorteio.

## O que falta

- Leads: duas abordagens com 10 contatos cada pedem uns 20 leads novos. Pedir lista nova ao Spark, com
  a triagem de 5 minutos.
- A mensagem simples de 28/09: `[FALTA: o Antônio confere no celular quem respondeu]`. Se houver o dado,
  esses leads entram como referência `abordagem:simples-28-09`.
- O resultado da R1 da Paralela Film (era 05/10): `[FALTA]`.
- **Decisão pendente do Marcelo (09/10, tarefa no Hounder):** as três propostas da pesquisa de evidência
  (`fontes/pesquisa-whatsapp-2026-10-09.md`, Parte 7). P1: abertura chamando quem decide pelo nome, contra a
  abertura atual. P2: trocar o braço `previa` por "prévia com licença" (o corpo pede pra montar o rascunho e só
  se monta pra quem disser sim). P3: faixa de preço aprovada por serviço pra responder "quanto custa?" no
  WhatsApp, emendando dois horários. O que for aprovado entra aqui antes do ritual da sexta.
  **P3 aprovada em 09/10:** "quanto custa?" de site recebe a faixa da Fase 1 do `comercial.md` (R$ 1.200 a
  R$ 2.000, depende de quantas páginas) e dois horários. Também aprovado: o corpo termina em "Posso te
  mostrar?" e os horários só vêm depois do sim, com a opção de ir pessoalmente. P1 e P2 seguem em aberto.
