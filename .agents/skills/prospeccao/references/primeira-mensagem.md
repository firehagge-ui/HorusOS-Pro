# Modo A: a primeira mensagem (abertura e corpo)

> Veio da antiga `/revisar-mensagem` (29/09/2026), aglutinada na `/prospeccao` em 03/11/2026. Serve pra escrever do
> zero ou revisar um rascunho (meu, do Marcelo ou do Farejador). Base: `blader/humanizer` com a nota da
> `hardikpandya/stop-slop` (`_memoria/prospeccao/91-o-que-veio-do-benchmark.md`), presas à pesquisa de 09/10.

## O que já está decidido

- **Dois passos.** Passo 1: o nome de quem decide e quem você é ("Bom dia, Michele! Tudo bem? Aqui é o Marcelo, da
  Horus."). Passo 2, o corpo: sai em até 1 hora depois da resposta humana.
- **O corpo:** fato que ele confere → o que ele perde → "eu posso montar pra você" com os substantivos do negócio
  dele → "Posso te mostrar como ficaria?". Uma mensagem, até 60 palavras. Direto ao ponto vence o longo (a versão de
  37 palavras do Marcelo ganhou da minha de 57, Michele, 03/11).
- **Recepção de clínica:** só pede o horário de quem decide, sem oferta e sem nome da agência.
- **Sem sinal verificável, não escreva.** Diga ao Marcelo que falta sinal.

## O processo

1. **Pesquisa:** as 14 regras de `_memoria/prospeccao/15-o-que-deu-certo.md`. Corrija o que quebra antes do resto.
2. **Revisor mecânico** (veto se corrige; aviso pede segundo olhar):
   ```
   node -e "import('./ferramentas/hound-dog/app/js/revisor.js').then(m=>console.log(JSON.stringify(m.revisar(process.argv[1],{passo:2,empresa:'NOME'}),null,1)))" "TEXTO"
   ```
3. **Integridade** (Parte 2 de `99-checklist.md`): toda frase de fato tem fonte e foi conferida. Frase sem fonte vira
   "pra evitar que" ou sai. Revisar nunca acrescenta fato. Dado que falta vira `[FALTA: ...]`.
4. **Os quatro testes:** troca de nome, remoção, oferta nas palavras dele, resposta mais fácil.
5. **Fala humana:** `references/fala-humana.md`.
6. **Duas lentes rápidas** (`_conselho/mentes/`):
   - **Cialdini:** o achado é o presente que vem antes do pedido? Tem prova social negativa, escassez ou urgência falsa?
   - **Voss:** tem "por quê?"? Troque por "o que" ou "como".
7. **Nota de 0 a 50** (direta, ritmo, confiança, gente, enxuta). Abaixo de 35, reescreva. Rode o revisor na final.

## Gravar no Hounder

Primeiro contato vai por `hd_preparar_disparo`, com a tabela de verificação (frase, fonte, como conferiu) e o
telefone confirmado, sem presumir dígito. Versão nova substitui a mesma variante do mesmo passo. Diga qual versão ela
substitui. Agendar só com ordem do Marcelo.
