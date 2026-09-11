"use client";

/**
 * O estado do fluxo, sem nenhuma marcação.
 *
 * Existe separado para quem quer o comportamento com um HTML próprio: importe
 * só este hook e desenhe do seu jeito. O `Agendamento.tsx` é uma
 * apresentação possível, não a única.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ISODate } from "../kit-calendario/useCalendario";
import type { Servico } from "./regras";

export type Passo = "servico" | "quando" | "dados" | "pronto";

export type Contato = Record<string, string>;

export type Marcacao = {
  servico: Servico;
  data: ISODate;
  hora: string;
  contato: Contato;
};

export type UseAgendamentoOpts = {
  servicos: Servico[];
  /**
   * De onde vêm os horários. Assíncrono de propósito: com uma agenda real
   * isso é um fetch. Para agenda estática, devolva `gerarHorarios(...)`.
   */
  carregarHorarios: (data: ISODate, servico: Servico) => Promise<string[]> | string[];
  /** O envio de verdade. Recebe a marcação completa. */
  onConfirmar: (m: Marcacao) => Promise<void> | void;
  /** Pula o passo de escolha quando só existe um serviço. */
  servicoInicial?: string;
};

export function useAgendamento({
  servicos,
  carregarHorarios,
  onConfirmar,
  servicoInicial,
}: UseAgendamentoOpts) {
  const inicial =
    servicos.find((s) => s.id === servicoInicial) ??
    (servicos.length === 1 ? servicos[0] : null);

  const [servico, setServico] = useState<Servico | null>(inicial);
  const [passo, setPasso] = useState<Passo>(inicial ? "quando" : "servico");
  const [data, setData] = useState<ISODate | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [contato, setContato] = useState<Contato>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /**
   * ARMADILHA: sem este contador, clicar dia 10 e logo depois dia 11 pode
   * pintar os horários do dia 10 por cima dos do dia 11 — a primeira
   * requisição às vezes responde depois da segunda. O resultado é uma agenda
   * que mostra horário de um dia sob o rótulo de outro.
   */
  const requisicao = useRef(0);

  useEffect(() => {
    if (!data || !servico) {
      setHorarios([]);
      return;
    }
    const id = ++requisicao.current;
    setCarregando(true);
    Promise.resolve(carregarHorarios(data, servico))
      .then((lista) => {
        if (id !== requisicao.current) return; // chegou tarde: descarta
        setHorarios(lista);
      })
      .catch(() => {
        if (id === requisicao.current) setHorarios([]);
      })
      .finally(() => {
        if (id === requisicao.current) setCarregando(false);
      });
  }, [data, servico, carregarHorarios]);

  const escolherServico = useCallback((s: Servico) => {
    setServico(s);
    // trocar de serviço invalida o horário: a duração mudou
    setHora(null);
    setPasso("quando");
  }, []);

  const escolherData = useCallback((iso: ISODate) => {
    setData(iso);
    setHora(null);
  }, []);

  const confirmar = useCallback(async () => {
    if (!servico || !data || !hora) return;
    setEnviando(true);
    setErro(null);
    try {
      await onConfirmar({ servico, data, hora, contato });
      setPasso("pronto");
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setEnviando(false);
    }
  }, [servico, data, hora, contato, onConfirmar]);

  const reiniciar = useCallback(() => {
    setServico(inicial);
    setPasso(inicial ? "quando" : "servico");
    setData(null);
    setHora(null);
    setContato({});
    setErro(null);
  }, [inicial]);

  return {
    passo,
    setPasso,
    servico,
    escolherServico,
    data,
    escolherData,
    hora,
    setHora,
    horarios,
    carregando,
    contato,
    setContato,
    enviando,
    erro,
    confirmar,
    reiniciar,
    /** Só existe passo de serviço se houver mais de um. */
    temPassoServico: !inicial,
  };
}
