# Higgsfield — gerar a mídia que o cliente não tem

Os outros MCPs do cannonball devolvem **código ou ficha**. Este devolve **pixel**:
imagem e vídeo gerados sob medida. É a única fonte que fecha o buraco mais comum de
projeto real — o hero escolhido pede vídeo, e o cliente tem três fotos de celular.

E é o único que **gasta dinheiro do usuário a cada chamada**. Isso muda como se usa.

---

## A regra que vem antes de todas

**Confirme antes de gerar.** Diga o que vai gerar, quanto custa e quanto demora, e
espere o sim. Nunca gere para "dar uma olhada" — não existe preview grátis aqui.

```
get_cost: true        # preflight, uma vez por projeto
```

Ordem de grandeza: **~54 créditos por clipe 1080p**, e um site inteiro sai por
**US$ 1–2**. Se a conta estiver baixa, diga antes de tentar.

---

## O caminho, em três chamadas

### 1. O keyframe — `generate_image`

```
generate_image(model="nano_banana_pro", aspect_ratio="16:9", prompt="<o hero>")
```

`nano_banana_pro` é o de melhor qualidade e nitidez. O prompt descreve o **assunto do
hero** — produto, pessoa, espaço, prato, veículo ou forma abstrata — com iluminação
forte, fundo intencional e "ultra sharp, photorealistic, 8k, editorial".

Guarde o **id do job**: ele vira o primeiro frame do vídeo.

Para retrato de pessoa, prefira **render abstrato na cor da marca**: some o problema
de semelhança e de direito de imagem, e num hero de marca costuma ficar melhor.

### 2. Espere de verdade — `job_display`

```
job_display(id=<id>)     # até status: "completed"
```

Vídeo 1080p leva **3 a 8 minutos**. Não fique fazendo poll apertado; espere no
background entre as verificações.

### 3. O clipe — `generate_video`

```
generate_video(
  model="seedance_2_0", resolution="1080p", aspect_ratio="16:9", duration=6,
  medias=[{role:"start_image", value:"<id do keyframe>"}],
  declined_preset_id="24bae836-2c4a-48e0-89b6-49fcc0b21612"
)
```

Se ele sugerir **outro** preset, repita passando o id daquele preset em
`declined_preset_id`.

Gere clipes em **paralelo** — duas chamadas na mesma mensagem — quando precisar de
mais de um. Depois `job_display` em cada.

Quando `completed`, baixe `results.rawUrl` com `curl`.

---

## Movimento: peça o que o hero vai fazer, não "algo bonito"

| Movimento | Prompt que funciona |
|---|---|
| **turntable** | "smooth seamless full 360-degree rotation, one complete revolution, stays centered" |
| **fly-through** | "slow continuous forward camera flight through the [espaço], smooth dolly, deep parallax" |
| **reveal / explode** | "the [componentes] burst or assemble outward and float in slow motion" |
| **abstrato** | "elegant slow-morphing liquid-metal / glass / particle form drifting and rotating" |

**Movimento contínuo, sempre.** Clipe com corte duro é inutilizável em hero de scroll
cinemático: ao rolar para trás o corte pisca. E num vídeo de fundo em loop, o corte
denuncia a emenda.

---

## Quando reprovar — e vai reprovar

`nsfw` ou `failed` → **o crédito volta**. Não é perda, é retrabalho.

A moderação reprova por engano coisa abstrata: "pílulas flutuando", "figura se
dissolvendo". Duas saídas:

1. **Reescreva no contexto do produto** — o mesmo movimento descrito como objeto
   concreto passa.
2. **Troque para `grok_video_v15`** com `resolution:"720p"` — é mais tolerante.

Turntable e explosão de produto passam em 1080p sem problema.

> **Nunca diga que um clipe renderizou se ele não renderizou.** Conte a tentativa que
> falhou e o que você mudou. O usuário está pagando por cada uma.

---

## Depois de gerar: ingira

Uma imagem de hero boa para clínica serve para a próxima clínica. Gastar crédito duas
vezes na mesma coisa é o desperdício mais fácil de evitar aqui:

```bash
python scripts/ingerir.py <arquivo> --id hero-<setor>-<caráter> \
  --titulo "..." --setor <setor> --estrutura hero \
  --quando-usar "..." --nao-usar-quando "..."
python scripts/indexar.py
```

Registre no `nao_usar_quando` o que a moderação reprovou e o que passou — é armadilha
que custa crédito, e é exatamente o tipo de coisa que o acervo existe para guardar.

---

## O que ele não resolve

- **Não é banco de imagem.** Para foto genérica de apoio, um banco é mais barato e
  mais rápido. Higgsfield é para o hero, onde a imagem tem que ser daquela marca.
- **Não faz o corte final.** Vídeo gerado vira mídia do site pelo `ffmpeg`: sequência
  de frames para scroll cinemático, ou `.mp4` comprimido com `poster` para vídeo de
  fundo. Ver o passo 2.2 da `kit-montar`.
- **Não substitui material do cliente.** Se o cliente tem foto boa, use a dele: é a
  marca dele, e sai de graça.
