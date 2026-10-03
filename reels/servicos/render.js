// Renderiza os frames com Chromium e junta vídeo + trilha com ffmpeg.
// Uso: node render.js "nome=Fulano%20Gás&zap=(11)%2099999-9999&cidade=Campinas"
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const FPS = 30, DUR = 20, qs = process.argv[2] || "";
const out = path.join(__dirname, 'out'), frames = path.join(out, 'frames');
(async () => {
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'index.html') + (qs ? '?' + qs : ''));
  await page.evaluate(() => window.ready);
  for (let f = 0; f < FPS * DUR; f++) {
    await page.evaluate(t => window.render(t), f / FPS);
    await page.screenshot({ path: path.join(frames, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 95 });
    if (f % 60 === 0) process.stdout.write(`frame ${f}\n`);
  }
  await browser.close();
  execSync('node ' + path.join(__dirname, 'audio.js'), { stdio: 'inherit' });
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${frames}/%05d.jpg -i ${out}/trilha.wav -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart ${out}/story_servicos.mp4`, { stdio: 'inherit' });
  console.log('pronto:', out + '/story_servicos.mp4');
})();
