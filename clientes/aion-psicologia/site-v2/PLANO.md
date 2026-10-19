# Site da Aion, versão 2 (15/10/2026): plano e passe duplo

> Pedido do Marcelo (15/10/2026): refazer o site com o que a casa sabe hoje, estudando o Awwwards e clínicas de
> psicologia, com **cada seção tendo um motivo e uma função**. O site sai **sem cobrança** (promessa do Antônio) no
> formato **landing page**; o que muda todo mês (blog, conteúdo, atualizações) é trabalho pago à parte.
> A versão 1 (dez páginas, julho) fica intacta em `../site/`. Ela vira o **upgrade pago** (página por serviço para o
> Google), não lixo.
>
> Estudo que embasa este plano: `../ESTUDO-2026-10.md`. Porquê de cada seção: `PROPOSITO-DAS-SECOES.md`.

## Objetivo, em uma frase

Quem pesquisa (no Google, no Instagram ou pelo link que recebeu) se reconhece numa situação, entende qual serviço da
Aion atende aquilo e como começa, e manda uma mensagem no WhatsApp já dizendo o assunto.

## Para quem (em ordem de peso)

1. A mãe ou o pai que recebeu um recado da escola e pesquisa à noite, no celular.
2. O adulto que desconfia de algo há anos (atenção, ansiedade, um peso antigo) e nunca procurou.
3. A família do adolescente que travou na escolha da profissão.
4. Quem indica (escola, pediatra, outro psicólogo) e precisa de um endereço para mandar. `[HIPÓTESE]`

## Passe 1: o plano

```
COR        creme   #FAF2EA  fundo principal (marca.md)
           areia   #F2E3D5  fundo alternado (marca.md)
           pêssego #F1C6A3  mancha de apoio, nunca texto (marca.md)
           terracota #D65F45 marca: título grande, traço do labirinto, preenchimento (marca.md)
           terracota-texto #9E3F2B  link e texto pequeno, 5,9:1 sobre creme (99-checklist §2.5)
           tinta   #3A2E28  texto (marca.md) · fundo da faixa final
TIPO       EB Garamond (títulos, decisão do Marcelo em 26/07) · Karla (texto e rótulos)
LAYOUT     1 cabeçalho com o logo real
           2 abertura: o que é + prova + WhatsApp | o labirinto se desenhando
           3 "Por onde começar": 4 trechos do caminho, 6 situações, cada uma vira o serviço e a mensagem pronta
           4 "Como começa": 3 passos + o que acontece numa avaliação neuropsicológica
           5 "Quem atende": a coordenadora em destaque, a equipe com CRP
           6 "Perguntas": 8, em duas colunas (título à esquerda, respostas à direita)
           7 "Onde fica": endereço, horário, mapa, contatos, faixa escura
           8 rodapé com CRP da PJ, responsável técnica e a faixa de crise
ASSINATURA o labirinto do logo é um caminho de fora até a pessoa no centro. Ele se desenha uma vez na
           abertura, e o mesmo traço vira a linha que costura os quatro trechos de "Por onde começar".
```

Wireframe da abertura e do caminho (1440):

```
[logo AION PSICOLOGIA]      Por onde começar  Como começa  Equipe  Perguntas  Onde fica   [Conversar no WhatsApp]
-------------------------------------------------------------------------------------------------------------
Psicoterapia, avaliação                                  (   espiral do logo se desenhando,   )
neuropsicológica e apoio                                 (   terracota sobre mancha pêssego   )
à família.                                               (                                     )
Há mais de 20 anos cuidando da saúde mental...
[Conversar no WhatsApp] [Por onde começar]
Coordenação Maria Tutti Cabussú, CRP 03/939 · Desde 2004 · Itaigara e online
-------------------------------------------------------------------------------------------------------------
Por onde começar
|  01 ENTENDER        "A escola chamou e falou em avaliação."            Avaliação Neuropsicológica  →
|  02 ACOMPANHAR      "O diagnóstico veio e ninguém disse o que fazer."  Intervenção Neuropsicológica →
|                     "Você convive há anos com algo que pesa..."        Atendimento Psicológico     →
|  03 APOIAR A FAMÍLIA "Em casa, nada do que vocês tentam funciona."     Orientação Familiar         →
|                     "Queria conversar com quem passa pelo mesmo."      Grupo de Apoio Parental     →
|  04 ESCOLHER        "Seu filho precisa escolher uma profissão e travou." Orientação Profissional  →
(a linha da esquerda é o traço do labirinto, desenhando conforme a rolagem)
```

## Passe 2: o ataque ("eu chegaria aqui em qualquer clínica de psicologia?")

| Do plano | Genérico? | O que mudou e por quê |
|---|---|---|
| Creme + serifa + terracota | **Sim**, é o visual nº 1 de IA (90-antipadroes §Cor) | A paleta fica, porque é a marca dela (marca.md vence). O que tira do genérico é a **assinatura**: o labirinto real dela virando o caminho da página. Nenhuma concorrente tem esse desenho. |
| Abertura "foto de sala + título bonito" (v1: "Entender é o primeiro cuidado") | **Sim**, aforismo nosso (antipadrão de 09/10) e foto de sala feita por IA | Título concreto, dizendo o que a clínica faz; a frase de apoio é a da bio dela ("Há mais de 20 anos cuidando de sua saúde mental"). A foto gerada sai: lugar de clínica só com foto real (regra de 14/10, Spaço Saúde). |
| Situações + grade 3x2 de serviços com ícone | **Sim**, duas seções dizendo a mesma coisa, e grade de ícone pequeno é antipadrão | Viram **uma** seção: cada situação leva direto ao serviço e a uma mensagem pronta de WhatsApp sobre aquele serviço. Agrupada nos quatro trechos da jornada (briefing §6) sem hierarquia: os seis têm o mesmo tratamento visual (decisão de peso igual, 23/07). |
| "Como começa" com 3 passos | Parcial: todo site tem | Ganha o que o segmento esconde (00-anatomia, "informação que o segmento esconde"): o que acontece numa avaliação, etapa por etapa, e o que a família recebe no fim. Números que não temos ficam marcados. |
| Equipe em arcos, três iguais | Parcial | A coordenadora ganha destaque com o currículo público dela (UFBA, coordenação de especialização, livros): é o ativo de autoridade que nenhuma vizinha tem. Os outros dois com o mesmo peso entre si. |
| Seção "A clínica" com fotos de IA | **Sim** | Sai. Volta quando houver foto real das salas (pedido da reunião, e item do plano de conteúdo). |
| Formulário sem servidor | Atrito e risco de LGPD | Sai. WhatsApp com mensagem pronta por serviço + e-mail. |

## O que se tirou da referência (e o que não)

- **Maxima Therapy** (Awwwards, Site of the Day 7,73): o site é organizado pela **fase em que a pessoa está**, com
  título enorme por fase. Daqui veio a estrutura de "Por onde começar" em quatro trechos. Não veio: a ilustração
  infantil colorida (não é a marca da Aion, e ela atende adulto).
- **Twofold Therapy** (Awwwards, menção honrosa 7,10): serviços numerados em linhas finas, nome no meio e descrição curta
  à direita; e a primeira consulta descrita com calma. Daqui veio o desenho das linhas e o texto de "Como começa".
- **Q Psychology** (Awwwards, menção honrosa 7,30, mesma anatomia da Aion: equipe, vários serviços): serifa leve e
  grande, lista de serviços com seta, linha de crise no rodapé. Daqui veio a escala da tipografia e o rodapé.
- **Spazio Integrar** (concorrente real, Rua Rubens Guelli, Itaigara): mostra o que a vizinha já faz (3 passos, FAQ,
  equipe com registro, WhatsApp). A régua é passar dela; ver `../ESTUDO-2026-10.md` §4.

## Travas

- CFP 011/2018: CRP de cada profissional e da PJ, sem depoimento, sem promessa, sem superlativo, sem preço como chamariz.
- Integridade: dado que falta vira `.pend` visível (some no modo de apresentação).
- Motion (60-motion.md, cliente regulado): só a assinatura (traço do labirinto) e entrada suave. Com "reduzir movimento",
  tudo aparece desenhado e parado.
- Publicação: Vercel, `noindex`, e protegido enquanto não houver o "sim" + CRP da PJ + responsável técnica.
