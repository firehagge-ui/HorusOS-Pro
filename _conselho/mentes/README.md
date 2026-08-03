# Mentes

Sete especialistas destilados, portados de `agents/minds/` do
[mega-brain](https://github.com/YuriRDev/mega-brain). Cada arquivo é a doutrina de
uma pessoa ou escola: no que ela acredita, com que números ela decide, que
estruturas ela usa.

Serve pra duas coisas:

1. **Dar lastro aos cargos do Conselho.** A regra de citação exige fonte. Sem as
   mentes, o Estrategista cita opinião; com elas, cita doutrina rastreável
2. **Consulta direta**, via `/consultar` e `/comparar`

---

## Quem está aqui

| Arquivo | Quem | Domínio | Peso pra Horus |
|---|---|---|---|
| [alex-hormozi.md](alex-hormozi.md) | Alex Hormozi | Oferta, pricing, sistema, escala | Alto |
| [cole-gordon.md](cole-gordon.md) | Cole Gordon | Venda high-ticket, discovery, objeção | Alto |
| [jeremy-miner.md](jeremy-miner.md) | Jeremy Miner | NEPQ: perguntas e tonalidade na call | Alto |
| [jeremy-haynes.md](jeremy-haynes.md) | Jeremy Haynes | Paid media, funil, show rate, follow-up | Alto |
| [g4-educacao.md](g4-educacao.md) | G4 Educação | Comercial e CX no Brasil | Médio-alto |
| [full-sales-system.md](full-sales-system.md) | Full Sales System | Calibração BR de estrutura comercial | Médio |
| [the-scalable-company.md](the-scalable-company.md) | The Scalable Company | Sistematizar e delegar | Médio (quando houver equipe) |

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
e Miner.
