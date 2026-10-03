// Trilha do story de serviços: acendedor + batidão de funk a 120 BPM. -> out/trilha.wav
const fs = require('fs');
const SR = 44100, DUR = 20.3, N = Math.floor(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 4242; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
const add = (i, l, r = l) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const lerp = (a, b, k) => a + (b - a) * k;

function tone(t0, dur, f0, f1, amp, dec, type = 'sin', pan = .5) {
  const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < dur * SR; i++) { const t = i / SR, f = f1 ? lerp(f0, f1, t / dur) : f0; ph += f / SR; ph -= Math.floor(ph);
    const w = type === 'sin' ? Math.sin(ph * 6.2832) : type === 'sq' ? (ph < .5 ? 1 : -1) * .5 : (ph * 2 - 1) * .6;
    const v = w * Math.exp(-t * dec) * amp * Math.min(1, i / 60); add(s + i, v * (1.2 - pan), v * (.2 + pan)); }
}
function noise(t0, dur, amp, dec, hp = .9, bright = 1) {
  const s = Math.floor(t0 * SR); let prev = 0, lp = 0;
  for (let i = 0; i < dur * SR; i++) { const n = rnd(), h = n - prev * hp; prev = n; lp += bright * (h - lp); const e = Math.exp(-i / SR * dec) * amp; add(s + i, lp * e, (lp * .8 + rnd() * .2) * e); }
}
function k808(t0, note, amp = 1, len = .45) {
  const s = Math.floor(t0 * SR), f = hz(note); let ph = 0;
  for (let i = 0; i < len * SR; i++) { const t = i / SR; ph += (f + 160 * Math.exp(-t * 35)) / SR;
    const v = Math.tanh(Math.sin(ph * 6.2832) * 2.2) * Math.exp(-t * 4) * Math.min(1, (len * SR - i) / 300) * amp * .75; add(s + i, v); }
}
function clap(t0, amp = .5) { [0, .012, .024].forEach(o => noise(t0 + o, .05, amp * .6, 70, .7, .6)); noise(t0 + .035, .3, amp, 18, .7, .5); }
function tamb(t0, amp = .35, f = 190) { tone(t0, .18, f * 1.6, f, amp, 22); noise(t0, .04, amp * .4, 90, .5, .4); }
const hat = (t0, amp = .08) => noise(t0, .06, amp, 60, .98);
function crash(t0, amp = .35) { noise(t0, 2, amp, 2.8, .99); }
function riser(t0, t1, amp = .3) { const s = Math.floor(t0 * SR), len = Math.floor((t1 - t0) * SR); let lp = 0; for (let i = 0; i < len; i++) { const k = i / len, a = 1 - Math.exp(-6.2832 * (300 + 8000 * k * k) / SR); lp += a * (rnd() - lp); add(s + i, lp * k * k * amp, lp * k * k * amp * .9); } }
function whoosh(t0, amp = .3, len = .35) { const s = Math.floor(t0 * SR), n = len * SR; let lp = 0; for (let i = 0; i < n; i++) { const k = i / n, a = 1 - Math.exp(-6.2832 * (6000 * (1 - k) + 300) / SR); lp += a * (rnd() - lp); add(s + i, lp * Math.sin(Math.PI * k) * amp, lp * Math.sin(Math.PI * k) * amp * .7); } }
function impact(t0, amp = 1) { k808(t0, 28, 1.3 * amp, 1.4); crash(t0, .4 * amp); noise(t0, .6, .5 * amp, 7, .2, .25); }
const ding = (t0, amp = .16) => { tone(t0, .6, 1318.5, 0, amp, 6); tone(t0 + .09, .9, 1760, 0, amp, 5); };
const buzz = (t0, amp = .12) => { tone(t0, .35, 140, 110, amp, 4, 'sq'); };
const pop = (t0, f = 700, amp = .12) => tone(t0, .12, f, f * 1.8, amp, 25);
const tick = (t0, amp = .12) => { noise(t0, .02, amp, 200, .95); tone(t0, .03, 2500, 0, amp * .5, 120); };


// acendedor (tic tic tic) + fwoom da chama amarela
[0, .1, .2].forEach(t => { noise(t, .015, .5, 300, .97); tone(t, .02, 3200, 0, .15, 150); });
(function fwoom(t0) { const s = Math.floor(t0 * SR), n = 1.0 * SR; let lp = 0; for (let i = 0; i < n; i++) { const k = i / n, fc = 150 + 1800 * Math.min(1, k * 6) * Math.exp(-k * 2), a = 1 - Math.exp(-6.2832 * fc / SR); lp += a * (rnd() - lp); const e = Math.min(1, k * 25) * Math.exp(-k * 3.5) * .9; add(s + i, lp * e, lp * e * .9); } })(.3);
k808(.3, 28, 1, .9); k808(.55, 28, .7, .3); k808(.8, 31, .9, .5); crash(.8, .2);

// ---- batidão: leve de 1 a 5.75, completo de 6 a 19.5 ----
const ROOTS = [33, 33, 36, 31];
for (let bar = 0; bar < 10; bar++) {
  const b0 = bar * 2, root = ROOTS[bar % 4];
  for (let st = 0; st < 16; st++) {
    const t = b0 + st * .125; if (t < 1 || t >= 19.5 || (t >= 5.75 && t < 6)) continue;
    const full = t >= 6;
    if (full ? [0, 3, 8, 11].includes(st) : [0, 8].includes(st)) k808(t, st === 11 ? root + 3 : root, full ? 1 : .6, st === 3 || st === 11 ? .35 : .45);
    if ([4, 12].includes(st) && (full || t >= 2.5)) clap(t, full ? .5 : .3);
    if (full && [6, 7, 10, 14].includes(st)) tamb(t, .28, st === 14 ? 240 : 190);
    hat(t, st % 2 ? .05 : .025);
  }
}
for (let t = 6; t < 19; t += 2) { tone(t + .75, .25, 1975, 0, .06, 12); tone(t + 1.75, .25, 1760, 0, .06, 12); }

// dores: cada pergunta com um "erro"
[2.5, 3.0, 3.5, 4.0].forEach((t, i) => { k808(t, 28, .7, .25); tone(t + .03, .2, 200 - i * 10, 140, .08, 7, 'sq'); });
// antes x depois: cortina + ding
whoosh(4.7, .45, .8); ding(5.4, .18);
riser(4.9, 5.75, .3);
// drop com a marca
impact(6.0, 1.2); ding(6.3, .12);
// serviços: corte em cada foto
[7.5, 9.0, 10.5, 12.0].forEach(t => { whoosh(t - .15, .32, .3); noise(t, .25, .3, 14, .5, .4); });
// grade de fotos
for (let i = 0; i < 4; i++) pop(13.5 + i * .125, 600 + i * 150, .1);
// por que a Ramalho
impact(14.5, .5); [14.5, 15.0, 15.5, 16.0].forEach((t, i) => ding(t + .05, .1 + i * .01));
// CTA: impacto + telefone tocando
impact(16.5, 1); pop(16.9, 800, .14);
for (const r0 of [17.2, 18.2]) for (let j = 0; j < 8; j++) { tone(r0 + j * .05, .045, 1400, 0, .06, 30); tone(r0 + j * .05 + .025, .045, 1750, 0, .05, 30); }
k808(19.5, 33, .8, .9);

// master
let peak = 0;
for (let i = 0; i < N; i++) { const t = i / SR, f = t > 19.5 ? Math.max(0, 1 - (t - 19.5) / .6) : 1; L[i] = Math.tanh(L[i] * 1.2) * f; R[i] = Math.tanh(R[i] * 1.2) * f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = .93 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
fs.mkdirSync(__dirname + '/out', { recursive: true }); fs.writeFileSync(__dirname + '/out/trilha.wav', buf); console.log('trilha.wav ok');
