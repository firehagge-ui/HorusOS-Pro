/**
 * As regras do negócio, isoladas do componente.
 *
 * Este arquivo é o que MUDA por cliente. Horário de funcionamento, duração de
 * procedimento, antecedência mínima, almoço, feriado — nada disso é igual em
 * duas clínicas, e nada disso deveria exigir mexer no fluxo de agendamento.
 *
 * O componente não conhece nenhuma dessas regras: ele só chama
 * `carregarHorarios(data)` e desenha o que vier.
 */

import { type ISODate, deISO, paraISO } from "../kit-calendario/useCalendario";

/** Faixa "HH:MM" a "HH:MM" no relógio local. */
export type Faixa = [string, string];

export type Servico = {
  id: string;
  nome: string;
  /** Em minutos. É o que define de quantos em quantos os horários aparecem. */
  duracao: number;
  /** Livre: "R$ 250", "a partir de R$ 250", "sob consulta", ou nada. */
  preco?: string;
  descricao?: string;
  /**
   * Restringe a dias específicos da semana (0=dom). Útil quando o
   * especialista só atende terça e quinta. Vazio = todos os dias abertos.
   */
  dias?: number[];
};

export type Regras = {
  /**
   * Expediente por dia da semana (0 = domingo). Várias faixas por dia cobrem
   * o intervalo de almoço sem precisar de um campo "almoço".
   *   { 1: [["09:00","12:00"], ["13:30","18:00"]] }
   * Dia ausente = fechado.
   */
  expediente: Record<number, Faixa[]>;

  /**
   * De quantos em quantos minutos um horário pode começar. Costuma ser 15 ou
   * 30. Independe da duração do serviço: com passo 15 e serviço de 60, os
   * inícios possíveis são 9:00, 9:15, 9:30…
   */
  passo?: number;

  /**
   * Antecedência mínima em minutos. Sem isso o site oferece um horário para
   * daqui a dez minutos e alguém precisa ligar desmarcando.
   */
  antecedencia?: number;

  /** Até quantos dias à frente dá para marcar. */
  janelaDias?: number;

  /** Fechamentos avulsos: feriado, recesso, congresso. */
  bloqueios?: ISODate[];

  /** Fuso do estabelecimento, para o caso de o cliente marcar de outro lugar. */
  fuso?: string;
};

const PADRAO: Required<Pick<Regras, "passo" | "antecedencia" | "janelaDias">> = {
  passo: 30,
  antecedencia: 120,
  janelaDias: 60,
};

const emMinutos = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const paraHHMM = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/**
 * Gera os horários livres de um dia.
 *
 * `ocupados` são os inícios já tomados ("14:00"). Um horário é descartado se
 * o atendimento passaria por cima de um ocupado — não basta comparar o
 * começo. Sem isso, um serviço de 60min às 14:00 convive com outro às 14:30.
 */
export function gerarHorarios(
  data: ISODate,
  servico: Pick<Servico, "duracao" | "dias">,
  regras: Regras,
  ocupados: { inicio: string; duracao: number }[] = []
): string[] {
  const cfg = { ...PADRAO, ...regras };
  const d = deISO(data);
  const diaSemana = d.getDay();

  if (cfg.bloqueios?.includes(data)) return [];
  if (servico.dias?.length && !servico.dias.includes(diaSemana)) return [];

  const faixas = cfg.expediente[diaSemana];
  if (!faixas?.length) return [];

  const agora = new Date();
  const hoje = paraISO(agora);
  const minimo =
    data === hoje
      ? agora.getHours() * 60 + agora.getMinutes() + cfg.antecedencia
      : data < hoje
        ? Infinity // dia passado: nada disponível
        : -Infinity;

  const conflita = (inicio: number): boolean =>
    ocupados.some((o) => {
      const oi = emMinutos(o.inicio);
      return inicio < oi + o.duracao && oi < inicio + servico.duracao;
    });

  const livres: string[] = [];
  for (const [abre, fecha] of faixas) {
    const ini = emMinutos(abre);
    const fim = emMinutos(fecha);
    // `+ duracao <= fim` garante que o atendimento termina dentro do expediente
    for (let t = ini; t + servico.duracao <= fim; t += cfg.passo) {
      if (t < minimo) continue;
      if (conflita(t)) continue;
      livres.push(paraHHMM(t));
    }
  }
  return livres;
}

/** Último dia que a janela permite, para passar como `max` ao calendário. */
export function limiteDaJanela(regras: Regras): ISODate {
  const dias = regras.janelaDias ?? PADRAO.janelaDias;
  const d = new Date();
  return paraISO(new Date(d.getFullYear(), d.getMonth(), d.getDate() + dias));
}

/** O dia abre para algum atendimento? Alimenta o `diaDisponivel` do calendário. */
export function diaAtende(
  data: ISODate,
  servico: Pick<Servico, "duracao" | "dias">,
  regras: Regras
): boolean {
  return gerarHorarios(data, servico, regras).length > 0;
}

/** Formata o horário no idioma e no relógio (12h/24h) do locale. */
export function formatarHora(hhmm: string, locale: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(2024, 0, 1, h, m));
}
