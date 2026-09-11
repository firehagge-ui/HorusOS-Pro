/**
 * Lógica de calendário — sem JSX, sem CSS, sem idioma fixo.
 *
 * Separado da apresentação de propósito: a matemática de data é onde essas
 * peças quebram, e ela não deveria ser reescrita a cada projeto.
 *
 * NADA de nomes de mês ou de dia da semana escritos à mão aqui. Eles saem do
 * Intl a partir do `locale` que você passar — trocar o idioma do site não
 * exige tocar neste arquivo.
 */

/** Data em horário LOCAL no formato "AAAA-MM-DD". É a chave usada em tudo. */
export type ISODate = string;

export type Dia = {
  data: Date;
  iso: ISODate;
  numero: number;
  doMes: boolean;
  hoje: boolean;
  passado: boolean;
  fimDeSemana: boolean;
};

/**
 * ARMADILHA que justifica esta função existir:
 * `d.toISOString().slice(0,10)` converte para UTC. Em UTC-3, toda data entre
 * 00h e 03h volta como o dia ANTERIOR — o cliente marca dia 10 e cai no dia 9.
 * Aqui lemos os componentes locais, então o dia é o que a pessoa viu na tela.
 */
export function paraISO(d: Date): ISODate {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/**
 * O par da de cima. `new Date("2026-08-10")` é interpretado como UTC pelo
 * padrão da linguagem; `new Date(2026, 7, 10)` é local. A diferença é um dia.
 */
export function deISO(iso: ISODate): Date {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function mesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function somarMeses(d: Date, n: number): Date {
  // dia 1 evita o clássico: 31 de janeiro + 1 mês virar 3 de março.
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/**
 * Monta a grade do mês. Sempre semanas inteiras, com os dias vizinhos
 * preenchendo as pontas.
 *
 * @param inicioSemana 0 = domingo (padrão pt-BR e en-US), 1 = segunda (Europa).
 *                     Não fixe: passe a partir da configuração do site.
 */
export function gradeDoMes(
  ano: number,
  mes: number,
  inicioSemana = 0
): Dia[][] {
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

  const primeiro = new Date(ano, mes, 1);
  const deslocamento = (primeiro.getDay() - inicioSemana + 7) % 7;
  const inicio = new Date(ano, mes, 1 - deslocamento);

  const ultimo = new Date(ano, mes + 1, 0).getDate();
  const total = Math.ceil((deslocamento + ultimo) / 7) * 7;

  const semanas: Dia[][] = [];
  for (let i = 0; i < total; i++) {
    const data = new Date(
      inicio.getFullYear(),
      inicio.getMonth(),
      inicio.getDate() + i
    );
    const diaSemana = data.getDay();
    const dia: Dia = {
      data,
      iso: paraISO(data),
      numero: data.getDate(),
      doMes: data.getMonth() === mes && data.getFullYear() === ano,
      hoje: mesmoDia(data, hoje),
      passado: data < hoje,
      fimDeSemana: diaSemana === 0 || diaSemana === 6,
    };
    if (i % 7 === 0) semanas.push([]);
    semanas[semanas.length - 1].push(dia);
  }
  return semanas;
}

/** Iniciais dos dias da semana no idioma do site. Nunca escreva à mão. */
export function nomesDaSemana(
  locale: string,
  inicioSemana = 0,
  formato: "narrow" | "short" | "long" = "short"
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: formato });
  // 2024-01-07 foi um domingo — âncora conhecida para varrer a semana.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(2024, 0, 7 + ((i + inicioSemana) % 7)))
  );
}

export function nomeDoMes(
  data: Date,
  locale: string,
  opcoes: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
): string {
  return new Intl.DateTimeFormat(locale, opcoes).format(data);
}

/** Rótulo acessível de uma data, para o `aria-label` do botão do dia. */
export function rotuloCompleto(data: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(data);
}
