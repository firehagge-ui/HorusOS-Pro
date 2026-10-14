# Estudar um post ou reel de referência (engenharia reversa)

Quando o Marcelo manda um link de post ou perfil, ou quando a pauta precisa saber "o que está
funcionando no nicho". Base: `bradautomates/head-of-content` (`video-content-analyzer`,
`instagram-research`; MIT) e `coreyhaines31/marketingskills` `social/reverse-engineering.md`.
Eles usam Apify e a API do Gemini; aqui é tudo com o que já temos, sem chave nova.

## Pegar o material

- **Carrossel e foto:** `/embed/captioned/` no Playwright sem login (método em
  `reference_instagram-fotos-embed` da memória): baixa os slides e a legenda.
- **Reel:** o mesmo embed costuma entregar o `.mp4`. Se o perfil bloquear o embed, abrir no
  Chrome logado do Marcelo; **baixar arquivo pelo Chrome pede o ok dele antes** (nome, origem,
  tamanho). Nunca desligar verificação de certificado pra forçar download.
- **Áudio:** `ffmpeg -i reel.mp4 -vn audio.wav` e transcrever com o whisper local
  (`python -m whisper audio.wav --language pt --model small`).
- **Quadros:** `ffmpeg -i reel.mp4 -vf fps=1,scale=360:-1,tile=6x5 quadros.jpg` pra ver o
  ritmo dos cortes e o texto na tela.
- Guardar em `identidade/social/referencias/<data>/` (ou na pasta do cliente).

## O que anotar de cada peça (o roteiro do analisador)

- **Gancho:** técnica (quebra de padrão, pergunta, afirmação forte, história, choque visual,
  lacuna de curiosidade, fala direta, opinião contrária, dor reconhecível, prévia da
  transformação); as palavras exatas dos 3 primeiros segundos ou da capa; por que funciona; e
  **a fórmula replicável** ("Se você {ação}, você está {consequência}").
- **Estrutura:** formato (problema e solução, lista, história, tutorial, antes/depois, opinião,
  demonstração), as partes com o peso de cada uma, o ritmo, o que segura até o fim.
- **Entrega:** câmera na cara, narração, só texto; energia; texto na tela; edição.
- **CTA:** tipo (palavra-chave nos comentários, link na bio, seguir, salvar, enviar, DM), o texto
  exato, onde aparece.
- **Por que funciona**, em 2 ou 3 frases. **O que a gente leva** (a estrutura e o raciocínio)
  e **o que não leva** (a aparência, o nicho, número que não é nosso).

## Achar o que está bombando (outlier)

Num perfil, o post que foge da média: engajamento (curtidas + comentários, pelo embed ou pela
tela) acima da média do perfil mais duas vezes o desvio. Esses são os que se estudam; o resto é
ruído. Registrar o achado em `identidade/social/referencias/` e citar na pauta.
