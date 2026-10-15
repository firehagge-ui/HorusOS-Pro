# Protótipos

Site feito **antes** do cliente fechar, para mostrar na reunião de venda. Cada pasta aqui é
um lead, não um cliente: não entra na contagem de contas nem no roteiro de clientes do
`CLAUDE.md` da raiz. O estado comercial de cada um vive no Hound Dog.

## O ciclo de vida

1. **Protótipo** — montado com o material público do lead (Instagram, Google, portais), para
   a reunião. Privado: `noindex`, link só para o Marcelo mostrar.
2. **Vendeu** → a pasta sai daqui e vai para `clientes/<nome>/`, vira cliente numerado no
   `CLAUDE.md` da raiz, e o protótipo vira a base do site de verdade.
3. **Não vendeu** → vira **template** do segmento em `templates/`. Antes de mover:
   - **Tirar todas as fotos do lead.** A foto é dele (e dos fotógrafos que ele marcou), não
     nossa. Template vai com espaço de foto marcado, nunca com a foto de outro cliente.
   - Trocar nome, endereço, telefone, depoimentos e o texto que só vale para ele.
   - Manter a estrutura, os tokens, a assinatura e o que o estudo do segmento ensinou.

## O que cada pasta tem

`CLAUDE.md` (estado e regras), `briefing.md` (o que se sabe, com fonte), `marca.md` (a marca
dele, observada), `PLANO.md` (passe duplo), `fotos/` (material baixado + `FONTES.md`) e `site/`.

## Na fila

| Lead | Segmento | Aberto em | Estado |
|---|---|---|---|
| [Casa Verona](casa-verona/) | Espaço de eventos / mini wedding, Pituba | 23/09/2026 | **recusou em 24/09**; virou template em `templates/sites/espaco-eventos/` (sem fotos dela). Pasta com o material dela aguardando decisão do Marcelo (apagar ou guardar) |
| [Débora Reis](debora-reis/) | Arquitetura de interiores, Barra | 09/10/2026 | **encerrado em 15/10** (o Marcelo decidiu não trabalhar mais para ela; motivo registrado por ele). Ela viu as prévias em 14/10 e ofereceu permuta. Fica o aprendizado (`PROPOSITO-DAS-SECOES.md` e dez teardowns em `referencias/`). Em 15/10: esboço fora do ar (o projeto da Vercel fica), fotos apagadas (seguem no histórico do Git), todo o resto guardado; estrutura virou template em `templates/sites/arquitetura-interiores/` |
| [Spaço Saúde](spaco-saude/) | Odontologia, Graça (CFO) | 09/10/2026 | abertura em 14/10 e duas negativas da recepção (14/10 e 15/10: "não" também a outro meio de falar com a Dra.). Sobra ligar no fixo ou ir à clínica; o Marcelo está sem esperança. Esboço no ar, rodada 4 (https://esboco-spaco-saude.vercel.app), dentro da régua do CFO |
