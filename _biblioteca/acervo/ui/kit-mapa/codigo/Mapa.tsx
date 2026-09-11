"use client";

/**
 * kit-mapa — localização sem chave de API e sem cor de terceiro.
 *
 * Duas decisões que definem a peça:
 *
 * 1. O provedor é uma FUNÇÃO, não um `if`. O padrão é OpenStreetMap porque
 *    não pede chave, não cobra e não precisa de banner de consentimento.
 *    Trocar para Google ou Mapbox é passar outra função — não é editar o
 *    componente.
 *
 * 2. A cor vem do CSS (`--kit-filtro`), não do provedor. Um mapa cru destoa
 *    de qualquer identidade; o filtro casa com a paleta sem custo de tiles.
 *
 * Nenhum texto, coordenada ou rótulo está fixo aqui dentro.
 */

import { useState } from "react";
import "./mapa.css";

export type Local = {
  lat: number;
  lng: number;
  /** Quanto maior, mais perto. 15–17 costuma ser o ponto de negócio local. */
  zoom?: number;
};

export type Acao = {
  rotulo: string;
  href: string;
  primaria?: boolean;
  /** Deixe `false` para links `tel:` — abrir discagem em aba nova não faz sentido. */
  novaAba?: boolean;
};

/** Recebe o local, devolve a URL do embed. É o ponto de troca de provedor. */
export type Provedor = (local: Required<Local>) => string;

/**
 * Padrão: OpenStreetMap. `bbox` é derivado do zoom — o embed do OSM não
 * aceita nível de zoom direto, só a caixa que ele deve enquadrar.
 */
export const osm: Provedor = ({ lat, lng, zoom }) => {
  const d = 0.01 / Math.pow(1.7, zoom - 14); // aproximação suficiente na prática
  const bbox = [lng - d * 2, lat - d, lng + d * 2, lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
};

/** Google embed sem chave. Aceita, mas põe cookie — avise no banner de consentimento. */
export const google: Provedor = ({ lat, lng, zoom }) =>
  `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

/** Rota até o ponto, no app que a pessoa já usa. */
export const rotaGoogle = (l: Local) =>
  `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`;
export const rotaWaze = (l: Local) =>
  `https://waze.com/ul?ll=${l.lat},${l.lng}&navigate=yes`;

export type MapaProps = {
  local: Local;
  /** Nome do lugar no cartão. Sem ele o cartão não aparece. */
  titulo?: string;
  /** Endereço. Quebras de linha são preservadas. */
  endereco?: string;
  acoes?: Acao[];
  provedor?: Provedor;

  /** Texto do véu antiscroll. Deve dizer o que o clique faz. */
  rotuloLiberar?: string;
  /** Descrição do iframe para leitor de tela. Obrigatória por acessibilidade. */
  descricao?: string;

  /**
   * `false` desliga a trava de scroll. Só faça isso se o mapa não estiver
   * no meio de uma página que rola.
   */
  travarScroll?: boolean;

  className?: string;
  /** Ajuste pontual: `{ "--kit-filtro": "invert(1) hue-rotate(180deg)" }`. */
  style?: React.CSSProperties;
};

export default function Mapa({
  local,
  titulo,
  endereco,
  acoes = [],
  provedor = osm,
  rotuloLiberar = "Clique para interagir",
  descricao,
  travarScroll = true,
  className = "",
  style,
}: MapaProps) {
  const [liberado, setLiberado] = useState(!travarScroll);
  const src = provedor({ zoom: 16, ...local });

  return (
    <div
      className={`kit-mapa ${className}`.trim()}
      style={style}
      data-liberado={liberado}
    >
      <iframe
        className="kit-mapa__quadro"
        src={src}
        title={descricao ?? titulo ?? "Mapa"}
        loading="lazy"
        // sem isso o Chrome manda o referrer completo do site para o provedor
        referrerPolicy="no-referrer-when-downgrade"
      />

      {!liberado && (
        <button
          type="button"
          className="kit-mapa__veu"
          onClick={() => setLiberado(true)}
          aria-label={rotuloLiberar}
        >
          <span>{rotuloLiberar}</span>
        </button>
      )}

      {(titulo || endereco || acoes.length > 0) && (
        <div className="kit-mapa__cartao">
          {titulo && <p className="kit-mapa__titulo">{titulo}</p>}
          {endereco && <address className="kit-mapa__endereco">{endereco}</address>}
          {acoes.length > 0 && (
            <div className="kit-mapa__acoes">
              {acoes.map((a) => {
                const externo = a.novaAba ?? !a.href.startsWith("tel:");
                return (
                  <a
                    key={a.href}
                    className="kit-mapa__acao"
                    data-primaria={!!a.primaria}
                    href={a.href}
                    {...(externo
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {a.rotulo}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
