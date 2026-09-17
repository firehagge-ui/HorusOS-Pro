// Detecção instantânea de objeção pelos gatilhos do playbook (mesma régua do painel).
import { semAcento } from '../app/js/score.js';

export function detectarObjecoesTexto(texto, playbook) {
  const t = semAcento(texto).toLowerCase();
  if (!t.trim()) return [];
  return playbook
    .map((o) => {
      const hits = (o.gatilhos || []).filter((g) => t.includes(semAcento(g).toLowerCase()));
      return hits.length ? { id: o.id, rotulo: o.rotulo, hits, forca: hits.reduce((a, h) => a + h.length, 0) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.forca - a.forca);
}
