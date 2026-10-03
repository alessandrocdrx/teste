# Reels: Google Play Developer 🚀

Reels vertical (1080x1920, 30fps, 16s) com trilha sintetizada a 120 BPM, para comemorar a conta de dev na Google Play.

- os vídeos finais (`out/*.mp4`) não ficam no git: gere com o `render.js` ou pegue no Google Drive
- `index.html`: a animação (abra no navegador pra ver ao vivo, ou use `?t=6.2` pra ver um frame só)
- `audio.js`: gera a trilha (`out/trilha.wav`)
- `render.js`: renderiza tudo de novo: `node render.js @seu_usuario` (o @ aparece no final)

O comprovante foi recriado sem o final do cartão nem o ID da transação.

## Reels 2: geoTotal (quiz + chamada de testadores)

Reels de 26s (`geototal/out/reels_geototal.mp4`, story com `--story`), com batidão de funk. A galera joga um quiz de capitais, descobre que é o seu app e é chamada pra comentar "EU" e virar uma das 12 pessoas que testam o app.
Pra renderizar de novo: `node geototal/render.js @seu_usuario`.
