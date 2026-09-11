# kit-agendamento

Serviço → data e hora → contato → confirmado.

Precisa junto: **[kit-calendario](../kit-calendario/)**.

```
Agendamento.tsx     a apresentação (troque à vontade — é uma das possíveis)
useAgendamento.ts   o estado, sem marcação nenhuma
regras.ts           o expediente e a geração de horários
agendamento.css     só variáveis
```

---

## O princípio: nada fixo

Cada coisa que muda de cliente para cliente tem um lugar próprio. Você nunca
edita `Agendamento.tsx` para atender uma clínica diferente.

| O que muda | Onde se muda |
|---|---|
| paleta, fonte, raio, curva | variáveis no topo de `agendamento.css` |
| expediente, almoço, feriado | objeto `Regras` que você passa |
| serviços, duração, preço | array `servicos` |
| campos do formulário | prop `campos` |
| **todo texto da tela** | prop `textos` |
| idioma, formato de hora | prop `locale` |
| primeiro dia da semana | prop `inicioSemana` |
| o que acontece ao confirmar | prop `onConfirmar` |

---

## Montagem mínima

```tsx
"use client";
import Agendamento from "@/components/kit-agendamento/Agendamento";
import { gerarHorarios, diaAtende, limiteDaJanela, type Regras, type Servico }
  from "@/components/kit-agendamento/regras";

// ------- TROQUE: os serviços do cliente -------
const SERVICOS: Servico[] = [
  { id: "aval",     nome: "Avaliação",          duracao: 30, preco: "Gratuita" },
  { id: "limpeza",  nome: "Limpeza e profilaxia", duracao: 60, preco: "R$ 280" },
  { id: "clarea",   nome: "Clareamento",         duracao: 90, preco: "a partir de R$ 900",
    descricao: "Sessão em consultório com moldeira personalizada.",
    dias: [2, 4] },   // só terça e quinta
];

// ------- TROQUE: o expediente -------
const REGRAS: Regras = {
  expediente: {
    1: [["09:00", "12:00"], ["13:30", "18:00"]],  // segunda
    2: [["09:00", "12:00"], ["13:30", "18:00"]],
    3: [["09:00", "12:00"], ["13:30", "18:00"]],
    4: [["09:00", "12:00"], ["13:30", "18:00"]],
    5: [["09:00", "12:00"], ["13:30", "17:00"]],
    6: [["09:00", "13:00"]],                       // sábado
    // domingo ausente = fechado
  },
  passo: 30,          // de quanto em quanto um horário pode começar
  antecedencia: 120,  // não oferece nada para daqui a menos de 2h
  janelaDias: 60,
  bloqueios: ["2026-12-24", "2026-12-25", "2026-12-31"],
};

export default function Secao() {
  return (
    <Agendamento
      servicos={SERVICOS}
      carregarHorarios={(data, s) => gerarHorarios(data, s, REGRAS)}
      diaDisponivel={(iso) => SERVICOS.some((s) => diaAtende(iso, s, REGRAS))}
      maxData={limiteDaJanela(REGRAS)}
      onConfirmar={async (m) => {
        await fetch("/api/agendar", { method: "POST", body: JSON.stringify(m) });
      }}
    />
  );
}
```

---

## Ligando na paleta do site

Duas formas. A primeira é a preferida — o componente já lê os nomes de token
mais comuns, então muitas vezes **não é preciso fazer nada**:

```css
:root {
  --color-fg: #14110f;
  --color-bg: #fdfcfa;
  --color-accent: #7a5c3e;
  --color-accent-fg: #fff;
  --radius: 0.5rem;
  --font-sans: var(--font-inter);
}
```

Se os tokens do site têm outros nomes, faça a ponte no seletor da seção:

```css
.secao-agendamento {
  --kit-acento:    var(--marca-primaria);
  --kit-acento-fg: var(--marca-primaria-texto);
  --kit-raio:      var(--borda-arredondada);
  --kit-fonte-titulo: var(--font-display);
}
```

Ajuste pontual sem tocar em CSS:

```tsx
<Agendamento style={{ "--kit-acento": "#c9a227" } as React.CSSProperties} … />
```

Tailwind v4: os `@theme` viram variáveis CSS, então `--color-accent` já casa
direto. Não há utilitário nenhum no componente — ele não briga com o preflight.

---

## Trocando os textos

```tsx
<Agendamento
  textos={{
    tituloQuando: "Qual o melhor dia?",
    confirmar: "Quero este horário",
    semHorario: "Esse dia lotou. Escolha outro que a gente te encaixa.",
  }}
  {…}
/>
```

Site em outro idioma: passe `locale="en-US"` e o objeto `textos` inteiro. Mês,
dia da semana e formato de hora (12h/24h) se ajustam sozinhos pelo `Intl`.

---

## Campos do formulário

```tsx
campos={[
  { nome: "nome", rotulo: "Nome", obrigatorio: true, autoComplete: "name" },
  { nome: "convenio", rotulo: "Convênio",
    validar: (v) => (v.length < 3 ? "Nome do convênio muito curto" : null) },
]}
```

O padrão (`CAMPOS_PADRAO`) é nome, WhatsApp, e-mail e observações.

---

## Agenda de verdade

Troque `gerarHorarios` por um fetch. A assinatura já é assíncrona:

```tsx
carregarHorarios={async (data, servico) => {
  const r = await fetch(`/api/horarios?data=${data}&servico=${servico.id}`);
  return r.json();
}}
```

Se a agenda vem de um sistema que devolve o que está **ocupado**, o cálculo
continua local:

```tsx
carregarHorarios={async (data, servico) => {
  const ocupados = await buscarOcupados(data);   // [{ inicio: "14:00", duracao: 60 }]
  return gerarHorarios(data, servico, REGRAS, ocupados);
}}
```

---

## Armadilhas

**`toISOString()` erra o dia.** É por isso que `paraISO` existe. Em UTC-3, toda
data criada entre meia-noite e 3h volta como o dia anterior — a pessoa marca dia
10 e cai no dia 9. Todo o código usa componentes locais.

**Sobreposição não é comparação de início.** Um procedimento de 60min às 14:00
conflita com um às 14:30. `gerarHorarios` compara intervalos, não instantes.
Quem só compara o começo entrega agenda dobrada.

**Resposta fora de ordem.** Clicar dia 10 e logo depois dia 11 pode pintar os
horários do 10 sob o rótulo do 11. `useAgendamento` numera as requisições e
descarta as atrasadas.

**Trocar de serviço invalida o horário.** A duração mudou, então o que estava
livre pode não estar mais. O hook limpa a hora sozinho.

**Antecedência não é opcional.** Sem `antecedencia`, o site oferece um horário
para daqui a dez minutos e alguém da recepção liga desmarcando.

**Alvo de toque.** `--kit-alvo` é 44px porque é o mínimo confortável no celular,
onde a maior parte desses agendamentos acontece. Reduzir derruba conversão.

---

## O que ele não faz

Não guarda nada, não autentica, não cobra, não cancela, não remarca, não manda
lembrete. Ele entrega a marcação para o seu `onConfirmar`. Para múltiplos
profissionais com agendas separadas, modele cada um como serviço ou coloque a
escolha antes deste fluxo.
