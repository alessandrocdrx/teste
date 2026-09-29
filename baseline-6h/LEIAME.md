# Base do projeto (versão de 29/09/2026, ~08h)

Cópia da versão publicada do artefato `274cb293` (id de versão `1790669486-76b9`, 5.809.613 bytes).
A partir daqui o projeto recomeça; `src/` e `public/tour/` (exemplo antigo) ficam de lado.

| Arquivo | O que é |
|---|---|
| `mercado-360.html` | Cópia exata do artefato publicado (funciona aberto no navegador) |
| `tour/` | 465 JSON extraídos: `tour.json`, 83 cenas, 381 módulos (259 box, 114 banca, 8 porta) |
| `assets/fotos/` | 5 fotos reais |
| `assets/plantas/` | 8 imagens de planta por pavimento (desenhos próprios, esquemáticos) |
| `app.bundle.min.js`, `app.css` | Código do app **minificado** extraído do HTML |

Limite conhecido: o código-fonte legível do app (minimapa com andares, painel Comerciantes, editor) não está aqui.
Só existe minificado. Trabalhos novos devem partir de `tour/` + `assets/` e reconstruir a interface a partir do bundle.
