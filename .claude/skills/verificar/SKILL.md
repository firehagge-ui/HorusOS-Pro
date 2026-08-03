---
name: verificar
description: Verificação obrigatória antes de declarar qualquer trabalho pronto, entregue ou funcionando. Roda o checklist real (arquivo existe, site abre, dado confere, compliance passou) e reporta com evidência. Use antes de dizer "está pronto", quando o Marcelo pedir "confere", "valida isso", "/verificar", ou antes de qualquer entrega ir pro cliente.
---

# Verificar

Portado de `verification-before-completion` (mega-brain).

> **Declarar trabalho completo sem verificar não é eficiência, é desonestidade.**

## A lei

```
NENHUMA DECLARAÇÃO DE "PRONTO" SEM EVIDÊNCIA FRESCA DE VERIFICAÇÃO
```

Se você não rodou a checagem **nesta mensagem**, não pode dizer que passou.

## O portão

Antes de declarar qualquer status ou expressar satisfação:

1. **Identificar:** que checagem prova essa afirmação?
2. **Executar:** rodar a checagem inteira, agora, não de memória
3. **Ler:** o resultado completo, não a primeira linha
4. **Confrontar:** o resultado confirma mesmo a afirmação?
   - Não → declarar o estado real, com a evidência
   - Sim → declarar, com a evidência
5. **Só então** afirmar

Pular passo é mentir, não é economizar tempo.

## O que cada afirmação exige aqui

| Afirmação | Prova exigida | Não serve |
|---|---|---|
| "O site está pronto" | Detector rodado (abaixo) + checklist de `_memoria/design/99-checklist.md` + varredura de antipadrões | "Ficou bom" |
| "Está no ar" | URL aberta e carregando, não só deploy disparado | "Fiz o push" |
| "Passa no compliance" | Varredura de `_conselho/cargos/compliance.md`, item por item | "Não tem nada demais" |
| "As imagens estão ok" | Peso conferido e formato WebP no tamanho de exibição | "Converti" |
| "Não tem dado inventado" | Cada número e afirmação com fonte, placeholder marcado onde falta | "Usei o briefing" |
| "O texto está aprovado" | Aprovação do Marcelo ou do cliente, registrada | "Ficou alinhado com a marca" |
| "O arquivo foi criado" | Arquivo lido de volta ou listado | "Salvei" |
| "O relatório está certo" | Número batendo com a plataforma de origem | "Puxei os dados" |

## Detector de design (obrigatório em qualquer entrega de site)

Antes de dizer que um site está pronto, rodar:

```
npx --yes impeccable@3.4.0 detect "clientes/<nome>/site"
```

É um programa, não uma leitura. Roda tenha o Claude lido `_memoria/design/` ou
não, e é por isso que ele existe: a memória de design depende de o modelo lembrar
de abrir o arquivo, o detector não depende de nada.

**Como ler o resultado:**

| Saída | Significa |
|---|---|
| código de saída `0` | nenhum antipadrão encontrado |
| código de saída `2` | achou antipadrão. **Não é erro do comando**, é o resultado |
| erro de rede / comando não encontrado | **não verificado**. Declarar como não verificado, nunca como ok |

Cada achado vem com arquivo, linha, regra e o porquê. Três destinos possíveis, e
só três:

1. **Corrigir.** O padrão em tudo que é acessibilidade (`low-contrast`,
   `undersized-ui-text`, `tiny-text`, `skipped-heading`) e em performance
   (`layout-transition`). Esses não se discutem.
2. **Dispensar com motivo registrado**, quando a regra briga com uma decisão
   deliberada e documentada:
   ```
   npx --yes impeccable@3.4.0 ignores add-value <regra> "*" --file "clientes/<nome>/**" --reason "<por que, e onde a decisão está escrita>"
   ```
   Dispensa sem `--reason` não é dispensa, é varrer pra debaixo do tapete.
3. **Escalar pro Marcelo**, quando não está claro se é erro ou escolha.

**O que o detector NÃO cobre**, e continua sendo trabalho do checklist e do olho:
peso de imagem e WebP, favicon e `og:image`, `schema.org`, compliance de CFO e
CFP, dado inventado, e a estrutura de seções do `00-anatomia.md`. O detector pega
mecânica, não pega mentira nem estratégia.

**Exceções ativas** ficam em `.impeccable/config.json`, versionado de propósito
pra que o motivo de cada uma fique visível. Ver com
`npx --yes impeccable@3.4.0 ignores list`.

## Sinais de que você está prestes a violar

- Usando "deve estar", "provavelmente", "acho que ficou"
- Comemorando antes de conferir ("Pronto!", "Perfeito!")
- Confiando em resultado de outra etapa sem olhar
- Verificando parte e concluindo pelo todo
- Pensando "só dessa vez", ou querendo encerrar por cansaço

## Como reportar

```
VERIFICADO:
✅ {item} — evidência: {o que foi conferido e o que apareceu}
✅ {item} — evidência: {...}
❌ {item} — estado real: {o que está errado}
⏭️ {item} — não verificável aqui: {por quê, e quem verifica}

CONCLUSÃO: {pronto / pronto com pendência / não pronto}
```

Item que **não dá** pra verificar (mobile por print, por exemplo, que o headless
daqui não alcança) é declarado como não verificado. Nunca é declarado como ok.

## Regra final

Pendência declarada é trabalho profissional. Pendência escondida atrás de "está
pronto" é o que faz o cliente descobrir sozinho, e aí não é mais erro técnico,
é confiança quebrada.
