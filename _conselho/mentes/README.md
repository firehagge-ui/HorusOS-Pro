# Mentes

Doze especialistas destilados. Sete portados de `agents/minds/` do
[mega-brain](https://github.com/YuriRDev/mega-brain); o oitavo (Pedro Sobral) promovido
dos squads em 04/09/2026; quatro (Voss, Cialdini, Rackham, Fitzpatrick) entraram em
29/09/2026, a partir de skills de livro (wondelai/skills e founder-playbook, MIT). Cada
arquivo é a doutrina de uma pessoa ou escola: no que ela acredita, com que números ela
decide, que estruturas ela usa.

**Desde 29/09 cada cartão é o resumo; a doutrina completa está em `fontes/`** (a porta
original tinha deixado ~4% do material pra trás). Ver `fontes/README.md` e a pesquisa que
motivou a mudança em `PESQUISA-2026-09-29.md`.

Serve pra duas coisas:

1. **Dar lastro aos cargos do Conselho.** A regra de citação exige fonte. Sem as
   mentes, o Estrategista cita opinião; com elas, cita doutrina rastreável
2. **Consulta direta**, via `/consultar` e `/comparar`

---

## Quem está aqui

| Arquivo | Quem | Domínio | Peso pra Horus |
|---|---|---|---|
| [alex-hormozi.md](alex-hormozi.md) | Alex Hormozi | Oferta, aquisição (abordagem fria, iscas), sequência de ofertas, escala | Alto |
| [chris-voss.md](chris-voss.md) | Chris Voss | Negociação, objeção, lead que sumiu, conversa difícil | Alto |
| [robert-cialdini.md](robert-cialdini.md) | Robert Cialdini | Por que as pessoas dizem sim; revisar mensagem e proposta | Alto (com trava de compliance) |
| [neil-rackham.md](neil-rackham.md) | Neil Rackham (SPIN) | Perguntas da R1; o único método daqui nascido de pesquisa | Alto |
| [rob-fitzpatrick.md](rob-fitzpatrick.md) | Rob Fitzpatrick (Mom Test) | Pergunta sem viés, compromisso, validar nicho | Médio-alto |
| [cole-gordon.md](cole-gordon.md) | Cole Gordon | Venda high-ticket, discovery, objeção | Alto |
| [jeremy-miner.md](jeremy-miner.md) | Jeremy Miner | NEPQ: perguntas e tonalidade na call | Alto |
| [jeremy-haynes.md](jeremy-haynes.md) | Jeremy Haynes | Paid media, funil, show rate, follow-up | Alto |
| [g4-educacao.md](g4-educacao.md) | G4 Educação | Comercial e CX no Brasil | Médio-alto |
| [full-sales-system.md](full-sales-system.md) | Full Sales System | Calibração BR de estrutura comercial | Médio |
| [the-scalable-company.md](the-scalable-company.md) | The Scalable Company | Sistematizar e delegar | Médio (quando houver equipe) |
| [pedro-sobral.md](pedro-sobral.md) | Pedro Sobral | Tráfego pago BR (Meta Ads), campanha, criativo | Alto (único BR; aplicável direto) |

---

## Como citar

Dentro de um debate ou entrega:

```
^[mentes/alex-hormozi.md:Heurísticas] "LTV/CAC abaixo de 3x: ajustar preço ou baixar CAC"
```

Cada afirmação dentro dos arquivos carrega a origem no mega-brain
(`^[mega-brain:...]`), então a cadeia continua rastreável até a fonte original.
Isso não é preciosismo: é o que separa doutrina de invenção, e o Crítico
Metodológico penaliza o que não tem cadeia.

---

## Três avisos que valem mais que a doutrina

**1. É material americano de high ticket.** Ticket de US$15k lá não é R$75k aqui.
A própria doutrina diz isso: "não adianta copiar estrutura americana sem
calibração local" ^[mentes/full-sales-system.md:Filosofias]. Sempre que citar um
número de benchmark, declarar que é benchmark estrangeiro, não meta da Horus.

**2. Cliente local pequeno não é o contexto original.** Farm system de BDR, SDS e
closer pressupõe time de vendas. A Horus tem uma pessoa. O que se aproveita é o
**princípio**, não a estrutura de cargo. Quando a mente falar de time, o cargo de
Operações traduz pra realidade daqui ou descarta.

**3. Compliance vence a mente.** Várias táticas aqui (urgência, escassez, prova
social por depoimento, promessa de resultado) são **vedadas** para o Dr. Giovanni
(CFO) e para a Aion (CFP). Mente é conselho, compliance é lei. Ver
`_conselho/cargos/compliance.md`.

---

## Como usar

```
/consultar hormozi "como precificar a Máquina como oferta única?"
/comparar hormozi,cole "vender por projeto fechado ou mensalidade?"
```

No Conselho, os cargos puxam a mente relevante do domínio deles: Estrategista puxa
Hormozi e G4, Mídia puxa Haynes, e quem estiver discutindo venda puxa Cole Gordon
e Miner. Desde 29/09: objeção e negociação puxam Voss; pauta da R1 puxa SPIN
(Rackham) e Mom Test (Fitzpatrick); revisão de mensagem, proposta e página puxa
Cialdini (sempre com o Compliance ao lado).

**Fora do Conselho, no dia a dia** (é o que faz a mente ser usada):
- `/revisar-mensagem` confere a mensagem contra Cialdini (reciprocidade, prova social
  negativa, escassez falsa) e Voss (nada de "por quê?", pergunta orientada ao não)
- A investigação do Farejador monta a pauta da R1 em SPIN + Mom Test e o mapa de
  respostas com Voss e Cole Gordon (`ferramentas/hound-dog/farejador/prompts.mjs`)
