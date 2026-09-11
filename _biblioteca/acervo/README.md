# Acervo — peças de site reutilizáveis da Horus

Máquina de reuso trazida do cannonball em 04/09/2026. Aqui ficam **peças rodáveis**
que a Horus já construiu e valida, pra buscar e reaproveitar **antes** de gerar do zero.
Não confundir com `referencias/` (teardown de página) nem com `inspiracoes/` (padrão de
componente): aqui é **código pronto**, com ficha e armadilhas.

> As 3 peças que estão aqui hoje (`kit-agendamento`, `kit-calendario`, `kit-mapa`) são o
> **exemplo que veio do cannonball**, mantidas como modelo de ficha bem escrita. O acervo
> de verdade enche com o que a gente já fez: o carrinho da Amparo, páginas da Aion, etc.

## Anatomia de uma peça

```
acervo/<familia>/<nome>/
├── item.json         ← a FICHA (metadados de busca)
├── armadilhas.json   ← os bugs que já pegaram nessa peça, com origem e gravidade
├── codigo/           ← o código de verdade
└── README.md         ← como usar
```

### `item.json` — a ficha

Campos que a gente perde entre um cliente e outro e aqui ficam registrados:
`quando_usar`, **`nao_usar_quando`**, `qualidade` (rascunho/produção), `setor`, `stack`,
`precisa_componentes`, `deps`, `marca`, `assets_pereciveis`, `tags`. O campo `_busca`
achata tudo num blob de texto pra busca funcionar sem banco.

### `armadilhas.json` — o registro técnico (o ouro)

É a versão **técnica** da nossa regra "correção que morre no chat volta como erro no
próximo site". Cada entrada:

```json
{ "texto": "descrição do bug e como evitar", "origem": "cliente-onde-pegou", "grau": "critica|alta|media" }
```

Exemplo real (do kit-agendamento): *"Sobreposição de horário não é comparação de início:
procedimento de 60min às 14:00 conflita com um às 14:30. Comparar só o começo entrega
agenda dobrada — compare intervalos."* — grau **crítica**, origem `barbearia-oasis`.

**Toda vez que um bug custar tempo num projeto, ele vira linha de armadilha na peça.**
É assim que o acervo fica melhor a cada volta.

## O motor

O motor (scripts de ingerir/buscar/montar) está em `_biblioteca/cannonball/`
(gitignorado, ver `_biblioteca/cannonball.md`). Ele lê ESTE diretório. Pra apontar o
cannonball pra cá em vez do `~/.cannonball` padrão, usar o passo "vincular" do README dele.
