"use client";

/**
 * kit-calendario — seletor de data.
 *
 * Regra da peça: nada de aparência e nada de regra de negócio vive aqui
 * dentro. Cor, fonte e forma saem de `calendario.css` (só variáveis); o que
 * pode ou não ser escolhido vem por prop.
 *
 * Não usa biblioteca de data. `Intl` já resolve idioma e formato, e a
 * matemática está em `useCalendario.ts`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type Dia,
  type ISODate,
  deISO,
  gradeDoMes,
  nomeDoMes,
  nomesDaSemana,
  paraISO,
  rotuloCompleto,
  somarMeses,
} from "./useCalendario";
import "./calendario.css";

export type CalendarioProps = {
  /** Data escolhida hoje. Componente controlado: quem manda é quem usa. */
  valor?: ISODate | null;
  onChange?: (iso: ISODate) => void;

  /**
   * A regra de quais dias aceitam clique. Devolva `false` para bloquear.
   * É aqui que entram feriado, folga, agenda cheia — nada disso é fixo.
   * Se omitir, todo dia dentro da janela é clicável.
   */
  diaDisponivel?: (dia: Dia) => boolean;

  /** Dias que ganham o pontinho de "tem coisa aqui". Puramente visual. */
  diaMarcado?: (dia: Dia) => boolean;

  /** Idioma dos nomes de mês e dia. Não há texto em português no código. */
  locale?: string;
  /** 0 = domingo, 1 = segunda. Varia por país; por isso é prop. */
  inicioSemana?: 0 | 1;

  /** Limites de navegação. `min` padrão é hoje — passe `null` para liberar. */
  min?: ISODate | null;
  max?: ISODate | null;

  /** Formato do cabeçalho. Ex.: `{ month: "short", year: "2-digit" }`. */
  formatoTitulo?: Intl.DateTimeFormatOptions;
  /** `narrow` = "S", `short` = "seg.", `long` = "segunda-feira". */
  formatoSemana?: "narrow" | "short" | "long";

  /** Rótulos das setas — só existem para leitor de tela. */
  rotuloAnterior?: string;
  rotuloProximo?: string;

  className?: string;
  /** Sobrescreve variáveis sem tocar no CSS: `{ "--kit-acento": "#c8a" }`. */
  style?: React.CSSProperties;
};

const Seta = ({ direcao }: { direcao: "ant" | "prox" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path
      d={direcao === "ant" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Calendario({
  valor = null,
  onChange,
  diaDisponivel,
  diaMarcado,
  locale = "pt-BR",
  inicioSemana = 0,
  min,
  max = null,
  formatoTitulo = { month: "long", year: "numeric" },
  formatoSemana = "short",
  rotuloAnterior = "Mês anterior",
  rotuloProximo = "Próximo mês",
  className = "",
  style,
}: CalendarioProps) {
  const hojeISO = useMemo(() => paraISO(new Date()), []);
  const limiteMin = min === undefined ? hojeISO : min;

  const [mesVisivel, setMesVisivel] = useState<Date>(() =>
    valor ? somarMeses(deISO(valor), 0) : somarMeses(new Date(), 0)
  );
  // Só o dia focado fica tabbable — 42 paradas de Tab num calendário é hostil.
  const [foco, setFoco] = useState<ISODate>(valor ?? hojeISO);
  const gradeRef = useRef<HTMLDivElement>(null);
  const moveuPeloTeclado = useRef(false);

  // acompanha mudança vinda de fora
  useEffect(() => {
    if (!valor) return;
    setFoco(valor);
    setMesVisivel(somarMeses(deISO(valor), 0));
  }, [valor]);

  const semanas = useMemo(
    () => gradeDoMes(mesVisivel.getFullYear(), mesVisivel.getMonth(), inicioSemana),
    [mesVisivel, inicioSemana]
  );

  const cabecalho = useMemo(
    () => nomesDaSemana(locale, inicioSemana, formatoSemana),
    [locale, inicioSemana, formatoSemana]
  );

  const bloqueado = useCallback(
    (dia: Dia) => {
      if (limiteMin && dia.iso < limiteMin) return true;
      if (max && dia.iso > max) return true;
      return diaDisponivel ? !diaDisponivel(dia) : false;
    },
    [limiteMin, max, diaDisponivel]
  );

  // devolve o foco ao botão certo depois de navegar pelo teclado
  useEffect(() => {
    if (!moveuPeloTeclado.current) return;
    moveuPeloTeclado.current = false;
    gradeRef.current
      ?.querySelector<HTMLButtonElement>(`[data-iso="${foco}"]`)
      ?.focus();
  }, [foco, mesVisivel]);

  const irPara = (iso: ISODate) => {
    moveuPeloTeclado.current = true;
    setFoco(iso);
    const d = deISO(iso);
    if (
      d.getMonth() !== mesVisivel.getMonth() ||
      d.getFullYear() !== mesVisivel.getFullYear()
    ) {
      setMesVisivel(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  const deslocar = (dias: number) => {
    const d = deISO(foco);
    irPara(paraISO(new Date(d.getFullYear(), d.getMonth(), d.getDate() + dias)));
  };

  const aoTeclar = (e: React.KeyboardEvent) => {
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => deslocar(-1),
      ArrowRight: () => deslocar(1),
      ArrowUp: () => deslocar(-7),
      ArrowDown: () => deslocar(7),
      Home: () => deslocar(-((deISO(foco).getDay() - inicioSemana + 7) % 7)),
      End: () => deslocar(6 - ((deISO(foco).getDay() - inicioSemana + 7) % 7)),
      PageUp: () => irPara(paraISO(somarMeses(deISO(foco), -1))),
      PageDown: () => irPara(paraISO(somarMeses(deISO(foco), 1))),
    };
    const acao = mapa[e.key];
    if (!acao) return;
    e.preventDefault();
    acao();
  };

  // compara o primeiro dia do mês visível com o primeiro dia do mês do limite
  const primeiroDoMes = (iso: ISODate) => iso.slice(0, 7) + "-01";
  const podeVoltar =
    !limiteMin || paraISO(mesVisivel) > primeiroDoMes(limiteMin);
  const podeAvancar = !max || paraISO(somarMeses(mesVisivel, 1)) <= max;

  return (
    <div className={`kit-cal ${className}`.trim()} style={style}>
      <div className="kit-cal__topo">
        <h2 className="kit-cal__mes" aria-live="polite">
          {nomeDoMes(mesVisivel, locale, formatoTitulo)}
        </h2>
        <div className="kit-cal__nav">
          <button
            type="button"
            className="kit-cal__seta"
            onClick={() => setMesVisivel(somarMeses(mesVisivel, -1))}
            disabled={!podeVoltar}
            aria-label={rotuloAnterior}
          >
            <Seta direcao="ant" />
          </button>
          <button
            type="button"
            className="kit-cal__seta"
            onClick={() => setMesVisivel(somarMeses(mesVisivel, 1))}
            disabled={!podeAvancar}
            aria-label={rotuloProximo}
          >
            <Seta direcao="prox" />
          </button>
        </div>
      </div>

      {/* `group` e não `grid`: um role="grid" válido exige filhos role="row",
          o que quebraria o layout de uma coluna só de CSS Grid. Cada dia já
          se anuncia por extenso no aria-label, então nada se perde. */}
      <div
        className="kit-cal__grade"
        role="group"
        aria-label={nomeDoMes(mesVisivel, locale, formatoTitulo)}
        ref={gradeRef}
        onKeyDown={aoTeclar}
      >
        {cabecalho.map((nome, i) => (
          <div key={i} className="kit-cal__semana" aria-hidden="true">
            {nome}
          </div>
        ))}

        {semanas.flat().map((dia) => {
          const off = bloqueado(dia);
          const escolhido = valor === dia.iso;
          return (
            <button
              key={dia.iso}
              type="button"
              className="kit-cal__dia"
              data-iso={dia.iso}
              data-fora={!dia.doMes}
              data-hoje={dia.hoje}
              data-marcado={!!diaMarcado?.(dia)}
              disabled={off}
              aria-pressed={escolhido}
              aria-label={rotuloCompleto(dia.data, locale)}
              tabIndex={dia.iso === foco ? 0 : -1}
              onClick={() => {
                setFoco(dia.iso);
                onChange?.(dia.iso);
              }}
            >
              {dia.numero}
            </button>
          );
        })}
      </div>
    </div>
  );
}
