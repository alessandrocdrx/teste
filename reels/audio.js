// Sintetiza a trilha (120 BPM, 16s) sincronizada com index.html -> out/trilha.wav
const fs = require('fs');
const SR = 44100, DUR = 16.3, N = Math.floor(SR * DUR), BEAT = 0.5;
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 12345; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
const add = (i, l, r = l) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r; } };
const hz = m => 440 * Math.pow(2, (m - 69) / 12);

function kick(t0, amp = 1) {
  const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < .5 * SR; i++) {
    const t = i / SR, f = 48 + 140 * Math.exp(-t * 32); ph += 2 * Math.PI * f / SR;
    const v = (Math.tanh(Math.sin(ph) * 1.6) * Math.exp(-t * 6.5) + (i < 150 ? rnd() * .4 * (1 - i / 150) : 0)) * amp * .8;
    add(s + i, v);
  }
}
function noiseHit(t0, amp, decay, hp = .0, len = .6, bright = 1) {
  const s = Math.floor(t0 * SR); let prev = 0, lp = 0;
  for (let i = 0; i < len * SR; i++) {
    const t = i / SR, n = rnd(); const h = n - prev * hp; prev = n; lp += bright * (h - lp);
    const e = Math.exp(-t * decay) * amp; add(s + i, lp * e, (lp * .8 + rnd() * .2) * e);
  }
}
const hat = (t0, amp = .12, open = false) => noiseHit(t0, amp, open ? 11 : 55, .98, open ? .35 : .08);
function snare(t0, amp = .5) {
  noiseHit(t0, amp * .9, 20, .6, .3, .7);
  const s = Math.floor(t0 * SR); for (let i = 0; i < .15 * SR; i++) { const t = i / SR; add(s + i, Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 28) * amp * .6); }
}
function clap(t0, amp = .45) { [0, .011, .022].forEach(o => noiseHit(t0 + o, amp * .6, 70, .7, .05, .6)); noiseHit(t0 + .03, amp, 16, .7, .35, .5); }
function crash(t0, amp = .35) { noiseHit(t0, amp, 2.6, .99, 2.2); }
function blip(t0, f, amp = .08, dec = 30) { const s = Math.floor(t0 * SR); for (let i = 0; i < .25 * SR; i++) { const t = i / SR; add(s + i, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * dec) * amp); } }
function bell(t0, amp = .15) { [[1760, 1], [2637, .5], [3520, .25]].forEach(([f, a]) => { const s = Math.floor(t0 * SR); for (let i = 0; i < 1.2 * SR; i++) { const t = i / SR; add(s + i, Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 4) * amp * a); } }); }

// supersaw com filtro passa-baixa e envelope
function saw(t0, dur, notes, amp, { cut = 2500, cutEnd = cut, att = .005, rel = .15, voices = 5, det = .18, sub = false } = {}) {
  const s = Math.floor(t0 * SR), len = Math.floor((dur + rel) * SR);
  notes.forEach(m => {
    for (let v = 0; v < voices; v++) {
      const f = hz(m + (v - (voices - 1) / 2) * det / ((voices - 1) / 2 || 1) * .5), pan = voices > 1 ? v / (voices - 1) : .5;
      let ph = Math.random(), lp = 0;
      for (let i = 0; i < len; i++) {
        const t = i / SR; ph += f / SR; ph -= Math.floor(ph);
        const fc = lerp(cut, cutEnd, Math.min(1, t / Math.max(dur, .01))), a = 1 - Math.exp(-2 * Math.PI * fc / SR);
        lp += a * ((ph * 2 - 1) - lp);
        const env = Math.min(1, t / att) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / rel));
        const x = lp * env * amp / Math.sqrt(voices * notes.length);
        add(s + i, x * (1 - pan * .8), x * (.2 + pan * .8));
      }
    }
    if (sub) { for (let i = 0; i < len; i++) { const t = i / SR; const env = Math.min(1, t / .005) * (t < dur ? 1 : Math.max(0, 1 - (t - dur) / rel)); add(s + i, Math.sin(2 * Math.PI * hz(m - 12) * t) * env * amp * .7); } }
  });
}
function lerp(a, b, k) { return a + (b - a) * k; }
function boom(t0, amp = .9) { const s = Math.floor(t0 * SR); let ph = 0; for (let i = 0; i < 2.2 * SR; i++) { const t = i / SR; ph += 2 * Math.PI * (32 + 50 * Math.exp(-t * 4)) / SR; add(s + i, Math.tanh(Math.sin(ph) * 2) * Math.exp(-t * 1.8) * amp * .6); } }
function riser(t0, t1, amp = .3) {
  const s = Math.floor(t0 * SR), len = Math.floor((t1 - t0) * SR); let lp = 0, ph = 0;
  for (let i = 0; i < len; i++) {
    const k = i / len, fc = 300 + 9000 * k * k, a = 1 - Math.exp(-2 * Math.PI * fc / SR); lp += a * (rnd() - lp);
    ph += 2 * Math.PI * (220 * Math.pow(8, k)) / SR;
    add(s + i, (lp * .8 + Math.sin(ph) * .25) * k * k * amp, (lp * .8 + Math.sin(ph * 1.01) * .25) * k * k * amp);
  }
}
function roll(t0, t1, amp = .4) { let t = t0; while (t < t1) { const k = (t - t0) / (t1 - t0); snare(t, amp * (.3 + .7 * k)); t += k < .5 ? .125 : k < .8 ? .0625 : .03125; } }
function whoosh(t0, t1, amp = .3) { const s = Math.floor(t0 * SR), len = Math.floor((t1 - t0) * SR); let lp = 0; for (let i = 0; i < len; i++) { const k = i / len, fc = 6000 * (1 - k) + 200, a = 1 - Math.exp(-2 * Math.PI * fc / SR); lp += a * (rnd() - lp); add(s + i, lp * Math.sin(Math.PI * k) * amp, lp * Math.sin(Math.PI * k) * amp * .7); } }

// ---------------- arranjo ----------------
// intro: drone tenso + teclado digitando
saw(0, 5.8, [33, 40], .18, { cut: 300, cutEnd: 900, att: 1.2, rel: .05, voices: 3, det: .12 });
saw(0, 3.4, [57, 60, 64], .06, { cut: 700, cutEnd: 1600, att: 1.5, rel: .3, voices: 3 });
const TL = [[.25, 24], [1.0, 29], [1.55, 29], [2.1, 25], [2.7, 21]];
TL.forEach(([st, n]) => { for (let k = 0; k < n; k++) noiseHit(st + k / 40, .07 + Math.random() * .03, 180, .95, .02); });
for (let t = 1.0; t < 3.4; t += .25) hat(t, .05);
blip(.25, 880, .05); [1.0 + 29 / 40, 1.55 + 29 / 40].forEach(t => blip(t, 1320, .07, 20));
// glitch + whoosh
for (let i = 0; i < 10; i++) blip(3.3 + i * .03, 200 + Math.random() * 1800, .08, 60);
whoosh(3.35, 3.95, .45);
// comprovante: contador de grana + ding
kick(4.0, .5); kick(4.5, .6); for (let t = 3.5; t < 5; t += .25) hat(t, .06);
for (let i = 0; i < 12; i++) blip(3.9 + i * .05, 600 + i * 80, .05, 50);
bell(4.5, .14);
// carimbo
kick(5.0, 1.2); snare(5.0, .7); noiseHit(5.0, .5, 9, .3, .5, .3); crash(5.0, .15);
roll(5.0, 5.875, .42); riser(5.0, 5.875, .35);
// DROP
const PROG = [[57, 60, 64], [53, 57, 60], [60, 64, 67], [55, 59, 62]]; // Am F C G
const ROOT = [33, 29, 36, 31];
const chordIdx = t => t >= 13 ? (t < 14 ? 1 : t < 15 ? 3 : 0) : Math.floor((t - 6) / 2) % 4;
function impact(t) { kick(t, 1.4); boom(t, 1); crash(t, .45); noiseHit(t, .6, 6, .2, .6, .25); }
impact(6.0); impact(13.0);
for (let t = 6.0; t < 15.01; t += BEAT) {
  if (t > 12.87 && t < 13) continue;
  if (t > 12.0 && t < 12.9) { kick(t, .9); continue; }
  kick(t, 1);
  const beatN = Math.round((t - 6) / BEAT);
  if (beatN % 2 === 1) clap(t, .5);
  hat(t + .25, .14, true);
  [0, .125, .375].forEach(o => hat(t + o, .06));
  const ci = chordIdx(t);
  saw(t + .25, .2, [ROOT[ci]], .5, { cut: 900, cutEnd: 250, rel: .05, voices: 2, det: .1, sub: true });
}
// pad
for (let b = 0; b < 4; b++) saw(6 + b * 2 - (b ? 0 : 0), 2, PROG[b % 4].map(m => m - 12), .09, { cut: 1200, att: .05, rel: .1, voices: 5 });
saw(10.5, 1.5, PROG[3].map(m => m - 12), .08, { cut: 1100, rel: .1 }); // completa até 12
// stabs nas palavras
[7.0, 7.5, 8.0, 8.5, 9.0, 10.5].forEach(t => saw(t, .22, PROG[chordIdx(t)].concat([PROG[chordIdx(t)][0] + 12]), .38, { cut: 6000, cutEnd: 1200, rel: .12, voices: 7, det: .25 }));
// checklist pops
[10.5, 11.0, 11.5, 12.0].forEach((t, i) => { blip(t, 660 + i * 110, .1, 25); if (i < 3) { blip(t + .15, 1320, .08, 18); blip(t + .22, 1760, .07, 18); } });
crash(10.5, .2);
roll(12.0, 12.875, .38); riser(12.0, 12.875, .32);
// final
saw(13.0, 1, PROG[1].concat([65]), .3, { cut: 5000, cutEnd: 2000, rel: .05, voices: 7, det: .3 });
saw(14.0, 1, PROG[3].concat([67]), .3, { cut: 5000, cutEnd: 2000, rel: .05, voices: 7, det: .3 });
saw(15.0, .9, PROG[0].concat([69, 71]), .34, { cut: 5000, cutEnd: 600, rel: .4, voices: 7, det: .3 });
[13, 14].forEach(t => saw(t, 1, [ROOT[chordIdx(t)]], .35, { cut: 500, rel: .05, voices: 2, sub: true }));
kick(15.0, 1.3); boom(15.0, .6); crash(15.0, .4);
for (let i = 0; i < 8; i++) blip(15.0 + i * .125, hz(81 + [0, 3, 7, 12, 7, 3, 0, -5][i]), .05, 10);

// silêncio dramático antes dos drops
[[5.875, 6.0], [12.875, 13.0]].forEach(([a, b]) => { const s = Math.floor(a * SR), e = Math.floor(b * SR); for (let i = s; i < e; i++) { const f = Math.min(1, (i - s) / 200, (e - i) / 40); L[i] *= 1 - f; R[i] *= 1 - f; } });
// master: fade final, saturação e normalização
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, f = t > 15.4 ? Math.max(0, 1 - (t - 15.4) / .85) : 1;
  L[i] = Math.tanh(L[i] * 1.3) * f; R[i] = Math.tanh(R[i] * 1.3) * f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const g = .95 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
fs.mkdirSync(__dirname + '/out', { recursive: true });
fs.writeFileSync(__dirname + '/out/trilha.wav', buf);
console.log('trilha.wav ok, peak', peak.toFixed(2));
