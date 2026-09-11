"use client";

/**
 * kit-agendamento — serviço → data e hora → contato → confirmado.
 *
 * O que NÃO está aqui dentro, de propósito:
 *   - cor, fonte, raio, curva  → `agendamento.css`, só variáveis
 *   - horário de funcionamento → `regras.ts`, passado por prop
 *   - texto da interface       → prop `textos`
 *   - campos do formulário     → prop `campos`
 *   - o envio                  → prop `onConfirmar`
 *
 * Ou seja: para um cliente novo você troca configuração, não código.
 */

import { useMemo, useState } from "react";
import Calendario from "../kit-calendario/Calendario";
import { deISO, type ISODate } from "../kit-calendario/useCalendario";
import { formatarHora, type Servico } from "./regras";
import { useAgendamento, type Contato, type Marcacao } from "./useAgendamento";
import "./agendamento.css";

export type Campo = {
  nome: string;
  rotulo: string;
  tipo?: "text" | "email" | "tel" | "textarea";
  obrigatorio?: boolean;
  /** Devolva a mensagem de erro, ou `null` se estiver válido. */
  validar?: (valor: string) => string | null;
  autoComplete?: string;
  placeholder?: string;
};

/** Todo texto visível. Nada de string solta dentro do componente. */
export type Textos = {
  passos: { servico: string; quando: string; dados: string };
  tituloServico: string;
  tituloQuando: string;
  tituloDados: string;
  tituloPronto: string;
  horarios: string;
  semData: string;
  semHorario: string;
  carregando: string;
  voltar: string;
  avancar: string;
  confirmar: string;
  enviando: string;
  novo: string;
  resumoServico: string;
  resumoData: string;
  resumoHora: string;
  obrigatorio: string;
  duracao: (min: number) => string;
};

export const TEXTOS_PT: Textos = {
  passos: { servico: "Serviço", quando: "Data e hora", dados: "Seus dados" },
  tituloServico: "O que você precisa?",
  tituloQuando: "Quando fica bom?",
  tituloDados: "Só falta o contato",
  tituloPronto: "Agendamento confirmado",
  horarios: "Horários disponíveis",
  semData: "Escolha uma data para ver os horários.",
  semHorario: "Não há horário livre neste dia. Tente outra data.",
  carregando: "Buscando horários…",
  voltar: "Voltar",
  avancar: "Continuar",
  confirmar: "Confirmar agendamento",
  enviando: "Enviando…",
  novo: "Fazer outro agendamento",
  resumoServico: "Serviço",
  resumoData: "Data",
  resumoHora: "Horário",
  obrigatorio: "Campo obrigatório",
  duracao: (min) => (min >= 60 ? `${Math.round((min / 60) * 10) / 10}h` : `${min}min`),
};

export type AgendamentoProps = {
  servicos: Servico[];
  carregarHorarios: (data: ISODate, s: Servico) => Promise<string[]> | string[];
  onConfirmar: (m: Marcacao) => Promise<void> | void;

  /** Bloqueia dias sem vaga. Monte com `diaAtende` de `regras.ts`. */
  diaDisponivel?: (iso: ISODate) => boolean;
  minData?: ISODate | null;
  maxData?: ISODate | null;

  campos?: Campo[];
  textos?: Partial<Textos>;
  locale?: string;
  inicioSemana?: 0 | 1;
  servicoInicial?: string;

  className?: string;
  style?: React.CSSProperties;
};

export const CAMPOS_PADRAO: Campo[] = [
  { nome: "nome", rotulo: "Nome completo", obrigatorio: true, autoComplete: "name" },
  {
    nome: "telefone",
    rotulo: "WhatsApp",
    tipo: "tel",
    obrigatorio: true,
    autoComplete: "tel",
    // dígitos, não formato: quem digita "(11) 9 9999-9999" não pode ser barrado
    validar: (v) =>
      v.replace(/\D/g, "").length < 10 ? "Telefone incompleto" : null,
  },
  { nome: "email", rotulo: "E-mail", tipo: "email", autoComplete: "email" },
  { nome: "observacoes", rotulo: "Alguma observação?", tipo: "textarea" },
];

export default function Agendamento({
  servicos,
  carregarHorarios,
  onConfirmar,
  diaDisponivel,
  minData,
  maxData,
  campos = CAMPOS_PADRAO,
  textos: textosParciais,
  locale = "pt-BR",
  inicioSemana = 0,
  servicoInicial,
  className = "",
  style,
}: AgendamentoProps) {
  const t = { ...TEXTOS_PT, ...textosParciais } as Textos;
  const a = useAgendamento({ servicos, carregarHorarios, onConfirmar, servicoInicial });
  const [tocado, setTocado] = useState<Record<string, boolean>>({});

  const erros = useMemo(() => {
    const e: Record<string, string> = {};
    for (const c of campos) {
      const v = (a.contato[c.nome] ?? "").trim();
      if (c.obrigatorio && !v) e[c.nome] = t.obrigatorio;
      else if (v && c.validar) {
        const msg = c.validar(v);
        if (msg) e[c.nome] = msg;
      }
    }
    return e;
  }, [campos, a.contato, t.obrigatorio]);

  const sequencia = (
    a.temPassoServico ? (["servico", "quando", "dados"] as const) : (["quando", "dados"] as const)
  ).map((p) => ({ id: p, rotulo: t.passos[p] }));

  const indiceAtual = sequencia.findIndex((s) => s.id === a.passo);

  const dataLonga = a.data
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(deISO(a.data))
    : "";

  /* ---------- confirmado ---------- */
  if (a.passo === "pronto") {
    return (
      <div className={`kit-ag ${className}`.trim()} style={style}>
        <div className="kit-ag__fim" role="status">
          <h2 className="kit-ag__titulo">{t.tituloPronto}</h2>
          <dl className="kit-ag__resumo">
            <div>
              <dt>{t.resumoServico}</dt>
              <dd>{a.servico?.nome}</dd>
            </div>
            <div>
              <dt>{t.resumoData}</dt>
              <dd>{dataLonga}</dd>
            </div>
            <div>
              <dt>{t.resumoHora}</dt>
              <dd>{a.hora && formatarHora(a.hora, locale)}</dd>
            </div>
          </dl>
          <button type="button" className="kit-ag__btn" onClick={a.reiniciar}>
            {t.novo}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`kit-ag ${className}`.trim()} style={style}>
      <ol className="kit-ag__trilha">
        {sequencia.map((s, i) => (
          <li
            key={s.id}
            className="kit-ag__passo"
            data-estado={i === indiceAtual ? "atual" : i < indiceAtual ? "feito" : "futuro"}
          >
            {i < indiceAtual ? (
              <button type="button" onClick={() => a.setPasso(s.id)}>
                {s.rotulo}
              </button>
            ) : (
              <span aria-current={i === indiceAtual ? "step" : undefined}>{s.rotulo}</span>
            )}
          </li>
        ))}
      </ol>

      {/* ---------- serviço ---------- */}
      {a.passo === "servico" && (
        <section>
          <h2 className="kit-ag__titulo">{t.tituloServico}</h2>
          <div className="kit-ag__lista">
            {servicos.map((s) => (
              <button
                key={s.id}
                type="button"
                className="kit-ag__opcao"
                aria-pressed={a.servico?.id === s.id}
                onClick={() => a.escolherServico(s)}
              >
                <span className="kit-ag__opcao-nome">{s.nome}</span>
                <span className="kit-ag__opcao-meta">
                  <span>{t.duracao(s.duracao)}</span>
                  {s.preco && <span>{s.preco}</span>}
                </span>
                {s.descricao && <span className="kit-ag__opcao-desc">{s.descricao}</span>}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ---------- data e hora ---------- */}
      {a.passo === "quando" && (
        <section>
          <h2 className="kit-ag__titulo">{t.tituloQuando}</h2>
          <div className="kit-ag__quando">
            <Calendario
              valor={a.data}
              onChange={a.escolherData}
              locale={locale}
              inicioSemana={inicioSemana}
              min={minData}
              max={maxData}
              diaDisponivel={diaDisponivel ? (d) => diaDisponivel(d.iso) : undefined}
              diaMarcado={diaDisponivel ? (d) => diaDisponivel(d.iso) : undefined}
            />
            <div>
              <h3 className="kit-ag__titulo" style={{ fontSize: "var(--kit-tam-corpo)" }}>
                {t.horarios}
              </h3>
              {!a.data ? (
                <p className="kit-ag__vazio">{t.semData}</p>
              ) : a.carregando ? (
                <p className="kit-ag__vazio">{t.carregando}</p>
              ) : a.horarios.length === 0 ? (
                <p className="kit-ag__vazio">{t.semHorario}</p>
              ) : (
                <div className="kit-ag__horarios" role="group" aria-label={t.horarios}>
                  {a.horarios.map((h) => (
                    <button
                      key={h}
                      type="button"
                      className="kit-ag__hora"
                      aria-pressed={a.hora === h}
                      onClick={() => a.setHora(h)}
                    >
                      {formatarHora(h, locale)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="kit-ag__rodape" style={{ marginBlockStart: "1.5rem" }}>
            {a.temPassoServico ? (
              <button type="button" className="kit-ag__btn" onClick={() => a.setPasso("servico")}>
                {t.voltar}
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="kit-ag__btn"
              data-primaria="true"
              disabled={!a.data || !a.hora}
              onClick={() => a.setPasso("dados")}
            >
              {t.avancar}
            </button>
          </div>
        </section>
      )}

      {/* ---------- contato ---------- */}
      {a.passo === "dados" && (
        <section>
          <h2 className="kit-ag__titulo">{t.tituloDados}</h2>

          <dl className="kit-ag__resumo" style={{ marginBlockEnd: "1.25rem" }}>
            <div>
              <dt>{t.resumoServico}</dt>
              <dd>{a.servico?.nome}</dd>
            </div>
            <div>
              <dt>{t.resumoData}</dt>
              <dd>{dataLonga}</dd>
            </div>
            <div>
              <dt>{t.resumoHora}</dt>
              <dd>{a.hora && formatarHora(a.hora, locale)}</dd>
            </div>
          </dl>

          <form
            className="kit-ag__campos"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              setTocado(Object.fromEntries(campos.map((c) => [c.nome, true])));
              if (Object.keys(erros).length === 0) a.confirmar();
            }}
          >
            {campos.map((c) => {
              const erro = tocado[c.nome] ? erros[c.nome] : undefined;
              const Tag = c.tipo === "textarea" ? "textarea" : "input";
              return (
                <div key={c.nome} className="kit-ag__campo">
                  <label className="kit-ag__rotulo" htmlFor={`kit-ag-${c.nome}`}>
                    {c.rotulo}
                    {c.obrigatorio && <span aria-hidden="true"> *</span>}
                  </label>
                  <Tag
                    id={`kit-ag-${c.nome}`}
                    className="kit-ag__input"
                    {...(c.tipo !== "textarea" ? { type: c.tipo ?? "text" } : {})}
                    value={a.contato[c.nome] ?? ""}
                    placeholder={c.placeholder}
                    autoComplete={c.autoComplete}
                    aria-invalid={!!erro}
                    aria-describedby={erro ? `kit-ag-${c.nome}-erro` : undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                      a.setContato((v: Contato) => ({ ...v, [c.nome]: e.target.value }))
                    }
                    onBlur={() => setTocado((v) => ({ ...v, [c.nome]: true }))}
                  />
                  {erro && (
                    <span className="kit-ag__erro" id={`kit-ag-${c.nome}-erro`} role="alert">
                      {erro}
                    </span>
                  )}
                </div>
              );
            })}

            {a.erro && (
              <span className="kit-ag__erro" role="alert">
                {a.erro}
              </span>
            )}

            <div className="kit-ag__rodape">
              <button type="button" className="kit-ag__btn" onClick={() => a.setPasso("quando")}>
                {t.voltar}
              </button>
              <button
                type="submit"
                className="kit-ag__btn"
                data-primaria="true"
                disabled={a.enviando}
              >
                {a.enviando ? t.enviando : t.confirmar}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
