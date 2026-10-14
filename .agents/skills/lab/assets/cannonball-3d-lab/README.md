# Cannonball 3D Lab

Laboratório local para estudar os modelos e cenas de `assets-3d` sem transformar o
corpus em acervo e sem modificar os arquivos originais.

## Executar

```bash
npm install
npm run dev
```

O catálogo é reconstruído automaticamente ao iniciar ou gerar o build. Os assets
continuam em `assets-3d`; o servidor apenas os expõe localmente ao viewer.

## Primeira versão

- catálogo pesquisável de GLB, glTF e OBJ;
- auditoria estática no catálogo, com extensões e dependências ausentes;
- abertura de GLB ou OBJ externo pelo seletor local;
- carregamento de Draco, Meshopt e KTX2;
- ambientes HDR e EXR;
- normalização para metros, aterramento e enquadramento automático;
- Beauty, Albedo, Wireframe, Normals e UV checker;
- grid, eixos e bounding box;
- perfis mobile, tablet e desktop com DPR/FPS limitados;
- métricas de geometria e `renderer.info`;
- reprodução do primeiro clip de animação;
- captura PNG da vista atual;
- colliders de diagnóstico Box, Sphere e Convex;
- baseline com deltas de geometria, draw calls, materiais, texturas e carga;
- exportação do estado e das métricas em JSON;
- Generation Studio para requests de prompt-to-3D e image-to-3D;
- bridge local que mantém credenciais fora do navegador;
- jobs gerados salvos separadamente em `outputs/generated`;
- renderização sob demanda quando a cena está parada;
- histórico de gerações no estúdio, reabrindo qualquer GLB já produzido.
- Scene Orchestrator para decompor prompts em estrutura, objetos, transformações,
  câmera, luzes, física e orçamento;
- pré-visualização métrica da cena com proxies antes de gastar créditos;
- geração em lote dos objetos confirmados e composição automática dos GLBs no layout.
- entrega web de objetos gerados e cenas multi-asset em `outputs/web`;
- manifesto com URLs relativas, câmera, iluminação, transformações, física e perfis;
- exemplos de loader para Three.js e React Three Fiber, sem alterar os GLBs fonte.

## Geração 3D econômica

O caminho principal não exige uma API paga:

1. o Claude Code autenticado localmente transforma o briefing em um plano de cena
   validado, sem expor ou copiar o OAuth;
2. proxies permitem revisar escala e composição sem gerar nada;
3. Stable Fast 3D reconstrói imagens em GLB na própria máquina;
4. o laboratório audita e monta os resultados.

Para preparar o backend local, primeiro leia o diagnóstico sem instalar nada:

```bash
npm run setup:sf3d
```

Depois de revisar a licença e reservar aproximadamente 15 GB, a instalação explícita é:

```bash
npm run setup:sf3d -- --install
```

Os pesos oficiais são protegidos por aceite de licença. Depois de aceitar em
`https://huggingface.co/stabilityai/stable-fast-3d`, execute:

```bash
npm run setup:sf3d:weights
```

O login é feito diretamente pelo cliente do Hugging Face e o token não passa pelo
laboratório.

Neste Mac de 16 GB, o padrão é CPU. MPS pode ser experimentado com `SF3D_DEVICE=mps`,
mas não é a configuração conservadora. A primeira geração pode pedir a aceitação da
licença e autenticação local no Hugging Face para baixar os pesos oficiais.

Meshy permanece como adaptador opcional e só aparece habilitada quando
`MESHY_API_KEY` é configurada. Nenhum job externo é disparado automaticamente. O botão
`Criar cena` usa primeiro um plano editável; assim a cena não vira uma única malha
monolítica impossível de ajustar.

## Entrega para sites

Abra um GLB gerado ou monte uma cena e use **Entregar site**. O laboratório cria uma
pasta nova e versionada por timestamp em `outputs/web`, com os modelos, `scene.json`,
`report.json` e exemplos de integração. Itens do corpus permanecem bloqueados para
essa operação.

A fonte continua preservada no pacote. A entrega pode criar uma variante High com
Meshopt, WebP 2K e geometria intacta, e uma Mobile com WebP 1K e simplificação
limitada por erro. Cada candidata é validada como glTF e permanece separada até a
comparação visual. KTX2 só é habilitado quando o encoder `toktx` estiver disponível.

O KTX-Software pode ser preparado localmente, sem escrever em `/usr/local`:

```bash
npm run setup:ktx -- --status
npm run setup:ktx -- --instalar --confirmar-download
```

Depois da entrega, **Comparar no lab** abre uma barra persistente para alternar
Fonte, High e Mobile no mesmo viewer. O laboratório mede cada variante e só libera
**Aprovar** depois que a fonte e a candidata tiverem sido abertas. A promoção
atualiza `scene.json` e `report.json` atomicamente, com variante e horário da decisão.

`npm run build`, `npx tsc --noEmit` e `npm run lint` são as verificações locais.
