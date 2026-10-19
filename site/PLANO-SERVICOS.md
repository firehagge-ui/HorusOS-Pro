# Páginas por serviço: plano (16/10/2026)

> Base: ofertas aprovadas pelo Marcelo em 16/10 (`_gestao/ofertas-de-entrada.md`), estudo de agências
> (`referencias/agencias-paginas-de-servico-2026-10.md`) e a pesquisa de busca local
> (`_memoria/trafego/fontes/notas/google_local_2026.md`: palavra-chave no title e no H1 da página, uma página por
> serviço, NAP igual ao perfil). Primeira página: **criação de sites**. Depois: Presença Google e Tráfego.

## ✅ Resolvido em 16/10: a home do repositório foi restaurada para a versão do ar (commit 8d1b942)

## Histórico: o alerta antes da restauração

O `site/index.html` e o `site/assets/site.css` do repositório **regrediram** no commit `caa0524` (08/10): voltaram
a uma versão anterior à que está no ar. O que está no ar é igual a `site/_publish/` e ao commit `8d1b942`. Rodar
`node site/build-deploy.mjs` hoje publicaria a home velha. Por isso esta página **não depende do `site.css`**: tem
folha própria (`assets/servico.css`) e copia cabeçalho e rodapé da versão no ar. Restaurar a home é decisão do
Marcelo (comando no relatório da sessão).

## Passe 1: o plano que sai por reflexo

```
COR      fundo escuro igual à home, azul elétrico, cards de vidro
TIPO     DM Sans, título 300
LAYOUT   hero com título grande, 3 colunas de benefício com ícone, planos, FAQ, CTA
ASSINATURA  um efeito de luz atrás do título
```

**A pergunta: eu chegaria nisso em qualquer agência?** Sim. Três colunas com ícone e brilho atrás do título é a
página de serviço de toda agência de IA, e o fundo escuro do começo ao fim repete a home em vez de servir à leitura.

## Passe 2: o plano revisado

**A tese:** quem procura "criação de sites em Salvador" tem um medo antes do preço: pagar e não gostar, ou pagar e
ficar refém (do sobrinho, da agência que sumiu com a senha). A página vende o freio: **você vê antes de pagar e
fica dono de tudo**. Isso é compromisso real da casa (os cinco compromissos da home).

```
COR      papel   #f5f6f8  fundo da página (claro: é página de leitura, modelo Instrument)
         tinta   #0b0d12  texto e títulos
         apoio   #565d6b  texto secundário (7,0:1 sobre o papel)
         azul    #0062d6  link, botão e acento de texto (5,6:1 com branco; o #0077ff da marca dá 4,1 e
                          fica só em detalhe grande, nunca em texto pequeno)
         noite   #000206  a faixa dos projetos e a chamada final (a mesma noite da home: a página fecha "em casa")
TIPO     DM Sans (a da casa: a marca vence o antipadrão de fonte; registrado). Título 600 aqui, porque fundo
         claro com título 300 some. Escala: 15, 17, 20, 26, 36, 56.
LAYOUT
 1. Hero claro: trilha, H1 com a palavra-chave ("Criação de sites em Salvador"), uma frase, UM botão, prova
    imediata em linha (esboço em 24 h · preço fechado · você fica dono).
 2. Faixa escura: os projetos em aparelhos (prints reais). Cliente é cliente; conceito diz "projeto conceitual".
 3. Para quem é: coluna única, segunda pessoa, situações reais de negócio local.
 4. ASSINATURA, a régua "R$ 0 até aqui": as etapas em linha, e a marca de quando se paga cai DEPOIS do esboço.
 5. Os três planos, o do meio marcado (Essencial, Site + Google, Presença completa), com o que entra.
 6. O que fica com você: site, domínio, perfil do Google, acessos.
 7. Perguntas (8), acordeão nativo.
 8. Chamada final escura + rodapé da home.

  ┌──────── claro ────────┐ ┌──── noite ────┐ ┌──────── claro ─────────────┐ ┌─ noite ─┐
  │ trilha                │ │ [notebook]    │ │ para quem é   régua R$ 0   │ │ chamada │
  │ H1 2 linhas  [botão]  │ │ [aparelhos]   │ │ planos 3 (meio marcado)    │ │ rodapé  │
  │ prova em linha        │ │               │ │ fica com você · perguntas  │ │         │
  └───────────────────────┘ └───────────────┘ └────────────────────────────┘ └─────────┘
```

**O que mudou do passe 1:** saiu o brilho atrás do título (antipadrão `dark-glow`) e as três colunas com ícone;
entrou a régua, que é o compromisso da casa desenhado, e a página ficou clara para ler, com o escuro só onde é
marca (projetos e fechamento). Sem movimento: nada aqui precisa de animação para ser entendido.

## Integridade

- Prazo, preço e escopo: só o que está aprovado em `ofertas-de-entrada.md`.
- Sem depoimento (não temos autorizado), sem número de resultado, sem "primeira página do Google".
- Projeto conceitual com a palavra "conceitual" na legenda.
- WhatsApp (71) 99912-7514, o mesmo do perfil do Google e do schema.
