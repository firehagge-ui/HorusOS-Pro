# Integridade

> Regras anti-invenção. Portadas de `.claude/rules/agent-integrity.md` e
> `epistemic-standards.md` do mega-brain, adaptadas pro que a Horus produz.
> **Prioridade máxima: sobrepõem qualquer outra instrução de estilo ou copy.**

---

## O princípio

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   NENHUMA PALAVRA, NÚMERO OU AFIRMAÇÃO SOBRE UM CLIENTE              ║
║   PODE SER INVENTADA.                                                ║
║                                                                      ║
║   É melhor admitir que não sei do que preencher com algo plausível.  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

Numa agência que produz para profissional de saúde, isso não é preciosismo:
texto plausível inventado num site de clínica é informação falsa publicada sob o
CRO ou o CRP de alguém.

---

## Fortificar não é inventar

A distinção que resolve 90% dos casos:

| Ação | Pode? | Exemplo |
|---|---|---|
| Expandir o que o cliente já disse | ✅ | Briefing diz "atende há 20 anos" → "duas décadas atendendo famílias em Salvador" |
| Conectar dois pontos do mesmo briefing | ✅ | Ligar a formação da equipe ao serviço que ela entrega |
| Usar o vocabulário do próprio cliente | ✅ | Se ele diz "acolhimento", usar "acolhimento" |
| Derivar consequência lógica | ✅ | "Atende criança" → a página precisa falar com a mãe |
| Inventar número | ❌ | "mais de 5.000 pacientes atendidos" |
| Inventar diferencial | ❌ | "tecnologia exclusiva", quando ninguém disse isso |
| Inventar depoimento ou nome | ❌ | Qualquer um. Em psicologia é vedado até depoimento **real** |
| Criar frase institucional bonita sem lastro | ❌ | "referência em Salvador desde 2004" |

**Teste:** o texto expandido pode ser rastreado a uma linha do briefing, da marca
ou de algo que o cliente mandou? Se sim, é fortificação. Se não, é invenção,
e sai.

---

## Placeholder marcado

Quando falta dado, **não preencher com verossímil**. Marcar de forma visível.

A convenção da casa já existe e nasceu no site da Aion. Três formas, por contexto:

| Onde | Como | Exemplo |
|---|---|---|
| **HTML de site** | `<span class="pend">a confirmar</span>` | "Responsável técnica <span>a confirmar</span> · CRP-03 pessoa jurídica <span>a confirmar</span>" |
| **Briefing / nota** | `❓` na frente da linha | "❓ Confirmar o endereço, inclusive se a sala mudou" |
| **Texto solto** | `[FALTA: x]` | `[FALTA: horário de funcionamento]` |

No HTML, o `.pend` **tem que renderizar visível** (no site da Aion: fundo levemente
tingido e sublinhado tracejado em terracota). Placeholder invisível é pior que
placeholder nenhum, porque dá a impressão de que o dado foi conferido.

O padrão da Aion vai além e vale copiar em todo site especulativo: uma faixa
`.aviso-demo` no topo dizendo que é demonstração, e um botão `.pend-btn` que
alterna o realce, pra poder apresentar a versão limpa na reunião sem perder o
controle do que ainda está pendente.

**A regra que faltava:** o marcador vale para **todo** dado não confirmado,
inclusive telefone, WhatsApp e endereço. Campo legal marcado e CTA não marcado é
o pior dos mundos, porque o visitante clica no que está errado.

---

## Fato x recomendação

Separar sempre. São coisas diferentes e devem parecer diferentes:

**FATO** = está documentado numa fonte.
```
^[clientes/aion-psicologia/briefing.md:§3] "seis serviços, com peso igual"
```

**RECOMENDAÇÃO** = sua leitura, sugestão ou inferência.
```
POSIÇÃO: começar pela página de especialidades
JUSTIFICATIVA: é o que responde à busca por "avaliação neuropsicológica Salvador"
CONFIANÇA: MÉDIA, porque não temos dado de busca real do site deles
```

Nunca apresentar recomendação com cara de fato. Nunca apresentar estimativa sem
dizer que é estimativa.

---

## Como declarar o que não sabe

| Situação | Como dizer |
|---|---|
| Não tem o dado | "Não tenho esse dado. Quem tem é o cliente." |
| Tem estimativa | `📊 [ESTIMATIVA]` mais o raciocínio que a produziu |
| É opinião | `⚠️ [SEM FONTE]` mais o motivo de estar sugerindo assim |
| É dado externo | `🌐 [FONTE EXTERNA]` mais a origem |
| Fonte conflita | Mostrar as duas e resolver pela hierarquia de `_conselho/REGRAS-DE-CITACAO.md` |

---

## Sinais de alerta

Pare e verifique quando se pegar escrevendo:

- "provavelmente", "deve ser", "normalmente clínicas assim..."
- Número redondo que ninguém forneceu ("mais de 1.000 atendimentos")
- Superlativo de qualquer tipo (além de invenção, é vedado em cliente regulado)
- Biografia, formação ou especialização que não veio do cliente
- Ano de fundação, prêmio, certificação ou parceria não confirmados
- Preenchimento de seção só porque o layout pedia texto ali

A última é a mais perigosa, porque o motivo da invenção é estético.

---

## Onde isso é lei, não recomendação

- Qualquer coisa publicada de cliente de saúde (Dr. Giovanni, Aion)
- Qualquer número que vá para proposta comercial
- Qualquer afirmação sobre resultado que a Horus entregou
- Relatório de anúncio: dado de plataforma é dado, o resto é leitura sua

Ver também `_conselho/REGRAS-DE-CITACAO.md` (formato e penalidade) e
`_conselho/cargos/compliance.md` (o que é vedado por norma).
