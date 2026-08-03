# SOW: Designer / web

> **Tipo de executor:** Híbrido · **Autonomia:** 60%
> **Autoridade:** produz layout, site e peça dentro da marca do cliente. Humano
> aprova direção visual e qualquer coisa que vá ao ar.

---

## Configuração de IA

**Ferramentas:** HTML/CSS, Higgsfield (geração de imagem), ffmpeg (conversão para
WebP), Edge headless (print), skills de estilo do catálogo, Firecrawl (teardown
de concorrente).

**Tarefas atribuídas:**
- Estudar de 3 a 5 concorrentes do segmento antes de propor estrutura
- Propor anatomia de página seção por seção
- Produzir HTML/CSS mobile-first
- Gerar e otimizar imagem (converter para WebP no tamanho de exibição)
- Rodar checklist e varredura de antipadrões antes de entregar

**Leitura obrigatória antes da primeira linha de HTML:**
`_memoria/design/00-anatomia.md`, `90-antipadroes.md`, `99-checklist.md`,
`referencias/README.md`, e o `marca.md` do cliente.

**Gatilhos de escalação:**
- Direção visual nova (antes de produzir três páginas na direção errada)
- Conflito entre estilo escolhido e a marca do cliente (a marca vence, mas avisa)
- Falta de dado que obrigaria a inventar conteúdo → vira placeholder marcado
- Qualquer peça de cliente regulado, antes de publicar

---

## Job description (humano)

**Reporta a:** Marcelo · **Área:** Produção

**Responsabilidades**
1. Entregar site que não pareça feito por IA
2. Fazer a marca do cliente vencer o gosto pessoal e o estilo da vez
3. Manter peso de página sob controle: imagem de IA sai em 2k e pesa megabytes
4. Registrar em `_memoria/design/90-antipadroes.md` toda correção recebida,
   **com o porquê junto**

**KPIs**
- Rodadas de correção até aprovar (meta: cair a cada projeto)
- Itens do checklist falhando na entrega (meta: zero)
- Peso da página e tempo de carregamento no celular
- Antipadrão reincidente (meta: zero, porque reincidência significa que a
  correção não virou arquivo)

**Habilidades:** HTML/CSS, tipografia, hierarquia visual, copy de interface,
leitura de referência.

---

## Análise de executor

| Pergunta | Resposta |
|---|---|
| Resultado previsível? | Não |
| Função pura? | Não |
| Precisa julgamento de contexto? | Sim |
| Impacto de erro | MÉDIO (retrabalho) a ALTO (publicado errado em saúde) |
| Decisão estratégica? | Não, mas carrega a estratégia |
| IA assiste? | Sim, executa quase tudo |

**Resultado: Híbrido.** A IA produz; o humano decide direção e aprova o que vai ao ar.

---

## Doutrina de apoio

`_memoria/design/` é a fonte primária, acima de qualquer mente. Das mentes,
`the-scalable-company.md` sustenta a regra de documentar o que move o ponteiro
(por isso o antipadrão vira arquivo) e `jeremy-haynes.md` dá o argumento de
formato: conteúdo que a pessoa lê no próprio ritmo bate vídeo que exige play.
