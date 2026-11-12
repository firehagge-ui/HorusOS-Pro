/* =============================================================================
   HOUNDER — Encontrar clientes
   Uma página só, no design do MazyOS Scraper: busca, mapa, "Suas buscas" e a lista aberta.
   ============================================================================= */
import { palco } from './encontrar-mapa.js';

export default function encontrar(v, { args, params }) {
  return palco(v, { listaId: args[0] === 'lista' ? args[1] : null, params });
}
