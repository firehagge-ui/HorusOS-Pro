# Scraper local

Tela original do MazyOS Scraper, com motor próprio em Playwright e o Chrome instalado.
O programa dele é bloqueado pelo Controle Inteligente de Aplicativos do Windows.

Ligue na raiz do HorusOS com `npm run scraper` e abra http://localhost:8080.
A skill `prospecta-maps` usa este servidor sem mudança.

- `web/static/` veio de `mazzeoia/mazyos-scraper`, fork do `gosom/google-maps-scraper` (licença MIT).
- `dados/` guarda telefone de terceiros e fica fora do Git.
- O motor mora em `motor.mjs` e é o mesmo do botão Buscar do Hounder. Com o agente antigo do Chrome (o mesmo do programa original) o Google entrega número de avaliações e comentários.
- O programa original (`mazyos-scraper.exe`) passou a abrir no Windows em 10/11/2026. Os dois servem; este fica porque o Hounder usa o mesmo motor.
- Rode no máximo uma busca grande por dia. Volume alto faz o Google bloquear.
