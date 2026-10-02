// Trilha do reels do geoTotal: batidão de funk a 120 BPM, efeitos de quiz sincronizados. -> out/trilha.wav
const fs = require('fs');
const SR = 44100, DUR = 26.3, N = Math.floor(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 777; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1;
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

// ---- batidão (tamborzão simplificado), compasso de 16 semicolcheias = 2s ----
const BREAKS = [[12.25, 12.5], [17.5, 18.0]];
const inBreak = t => BREAKS.some(([a, b]) => t >= a - 1e-6 && t < b) || t >= 25.5;
const ROOTS = [33, 33, 36, 31]; // A A C G
for (let bar = 0; bar < 13; bar++) {
  const b0 = bar * 2, root = ROOTS[bar % 4];
  for (let st = 0; st < 16; st++) {
    const t = b0 + st * .125; if (t >= 25.5 || inBreak(t)) continue;
    if ([0, 3, 8, 11].includes(st)) k808(t, st === 11 ? root + 3 : root, 1, st === 3 || st === 11 ? .35 : .45);
    if ([4, 12].includes(st)) clap(t, .5);
    if ([6, 7, 10, 14].includes(st)) tamb(t, .28, st === 14 ? 240 : 190);
    if (st % 2 === 1) hat(t, .05); else hat(t, .025);
  }
}
// "plin" do funk (sino agudo) a cada compasso
for (let t = 0; t < 25; t += 2) if (!inBreak(t + .75)) { tone(t + .75, .25, 1975, 0, .06, 12); tone(t + 1.75, .25, 1760, 0, .06, 12); }

// ---- efeitos sincronizados ----
impact(0, .8); whoosh(.45, .25);
[2.5, 5.5, 8.5].forEach((q, n) => {
  whoosh(q - .1, .3); pop(q + .1, 600, .1);
  for (let i = 0; i < 4; i++) pop(q + .15 + i * .08, 800 + i * 120, .06);
  for (let s = q + .5; s < q + 2.25; s += .5) tick(s, .14);
  ding(q + 2.25, .18); if (n < 2) buzz(q + 2.25, .1);
  if (n === 2) crash(q + 2.25, .25);
});
[11.75, 11.9, 12.05, 12.1].forEach((t, i) => pop(t, 600 + i * 150, .1));
riser(11.5, 12.25, .3);
impact(12.5); ding(12.75, .12); crash(12.75, .2);
for (let i = 0; i < 4; i++) whoosh(14 + i * .875, .22, .3);
riser(17.0, 17.5, .25);
tone(17.5, .5, 220, 110, .18, 3); // "e hoje..." queda
impact(18.0, 1.1); ding(18.5, .14);
impact(19.5, .6);
for (let i = 0; i < 12; i++) pop(20.5 + i * .08, 500 + i * 60, .07);
ding(21.75, .12);
impact(22.5, .9);
for (let i = 0; i < 4; i++) noise(23.15 + i * .125, .02, .1, 180, .95); // digitando
pop(23.8, 900, .15); ding(23.9, .12);
pop(24.2, 700, .12);
impact(25.0, .9);
k808(25.5, 33, .9, .9);

// master
let peak = 0;
for (let i = 0; i < N; i++) { const t = i / SR, f = t > 25.6 ? Math.max(0, 1 - (t - 25.6) / .65) : 1; L[i] = Math.tanh(L[i] * 1.2) * f; R[i] = Math.tanh(R[i] * 1.2) * f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = .93 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
fs.mkdirSync(__dirname + '/out', { recursive: true }); fs.writeFileSync(__dirname + '/out/trilha.wav', buf); console.log('trilha.wav ok');
