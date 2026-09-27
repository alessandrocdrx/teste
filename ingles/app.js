(function () {
  "use strict";

  var LESSONS = window.LESSONS;
  var GUIDE = window.SOUND_GUIDE;
  var view = document.getElementById("view");

  var STEPS = [
    { id: "ler", n: 1, name: "Ler" },
    { id: "falar", n: 2, name: "Falar" },
    { id: "ouvir", n: 3, name: "Ouvir" },
    { id: "ditado", n: 4, name: "Ditado" }
  ];
  var SPEEDS = { devagar: 0.7, normal: 0.92, rapido: 1.08 };
  var SPEED_LABELS = { devagar: "Devagar", normal: "Normal", rapido: "Rápido" };
  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120]; // dias, por caixa (Leitner)
  var NEW_PER_SESSION = 15;

  var ICON = {
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z"/></svg>',
    stop: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect fill="currentColor" x="3.5" y="3.5" width="9" height="9" rx="1.5"/></svg>',
    slow: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M8 4.5V8l2.2 1.6M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"/></svg>',
    mic: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M8 1.8a2.2 2.2 0 0 0-2.2 2.2v4a2.2 2.2 0 0 0 4.4 0V4A2.2 2.2 0 0 0 8 1.8ZM3.8 7.5a4.2 4.2 0 0 0 8.4 0M8 11.8v2.4"/></svg>'
  };

  /* ---------- Estado salvo no navegador ---------- */
  var KEY = "icsf.v1";
  var state = { steps: {}, cards: {}, speed: "normal", voice: "", role: {}, show: { en: true, pr: true, pt: true } };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      for (var k in saved) state[k] = saved[k];
    }
  } catch (e) { /* sem armazenamento: tudo continua funcionando nesta visita */ }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignora */ }
  }

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // Sílabas fortes (MAIÚSCULAS) ficam em negrito sublinhado.
  function pron(s) {
    return esc(s).replace(/[A-ZÀ-Ý]+/g, function (m) { return "<b>" + m + "</b>"; });
  }
  function lessonById(id) {
    for (var i = 0; i < LESSONS.length; i++) if (LESSONS[i].id === id) return LESSONS[i];
    return null;
  }
  function stepsOf(id) { return state.steps[id] || {}; }
  function markStep(id, step) {
    state.steps[id] = stepsOf(id);
    state.steps[id][step] = true;
    save();
    updateDueCount();
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Voz (Web Speech API) ---------- */
  var synth = window.speechSynthesis || null;
  var voices = [];
  var PREFERRED = ["Google US English", "Samantha", "Microsoft Aria", "Microsoft Jenny", "Microsoft Guy", "Alex", "Ava", "Allison", "Aaron", "Nicky"];

  function loadVoices() {
    if (!synth) return;
    var all = synth.getVoices() || [];
    var en = all.filter(function (v) { return /^en[-_]/i.test(v.lang); });
    var us = en.filter(function (v) { return /en[-_]US/i.test(v.lang); });
    var pool = us.length ? us.concat(en.filter(function (v) { return us.indexOf(v) < 0; })) : en;
    pool.sort(function (a, b) { return rank(a) - rank(b); });
    voices = pool;
    var sel = document.getElementById("voice-select");
    if (sel) sel.innerHTML = voiceOptions();
  }
  function rank(v) {
    for (var i = 0; i < PREFERRED.length; i++) if (v.name.indexOf(PREFERRED[i]) === 0) return i;
    return /en[-_]US/i.test(v.lang) ? 50 : 80;
  }
  if (synth) {
    loadVoices();
    if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", loadVoices);
    else synth.onvoiceschanged = loadVoices;
  }
  function mainVoice() {
    for (var i = 0; i < voices.length; i++) if (voices[i].name === state.voice) return voices[i];
    return voices[0] || null;
  }
  function otherVoice() {
    var m = mainVoice();
    for (var i = 0; i < voices.length; i++) if (voices[i] !== m && voices[i].lang === (m && m.lang)) return voices[i];
    return m;
  }
  // "A" (você) usa a voz principal; os outros personagens usam outra voz, se houver.
  function voiceFor(speaker) {
    if (!speaker || speaker === "A") return { voice: mainVoice(), pitch: 1 };
    var o = otherVoice();
    var same = o === mainVoice();
    return { voice: o, pitch: speaker === "C" ? (same ? 1.25 : 1.12) : (same ? 0.8 : 1) };
  }

  var speakToken = 0;
  function speak(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!synth) { resolve(false); return; }
      var u = new SpeechSynthesisUtterance(text.replace(/\.\.\./g, ","));
      var vf = voiceFor(opts.speaker);
      u.lang = (vf.voice && vf.voice.lang) || "en-US";
      if (vf.voice) u.voice = vf.voice;
      u.pitch = vf.pitch;
      u.rate = opts.rate || SPEEDS[state.speed] || 0.92;
      var done = false;
      function fin(ok) { if (!done) { done = true; resolve(ok); } }
      u.onend = function () { fin(true); };
      u.onerror = function () { fin(false); };
      synth.speak(u);
      // Alguns navegadores não disparam onend; evita travar a sequência.
      setTimeout(function () { fin(true); }, 2500 + (text.length * 110) / u.rate);
    });
  }
  function stopSpeech() {
    speakToken++;
    if (synth) synth.cancel();
    document.querySelectorAll(".speaking").forEach(function (el) { el.classList.remove("speaking"); });
  }
  function say(text, opts) {
    stopSpeech();
    return speak(text, opts);
  }
  // Toca várias falas em sequência, destacando cada linha.
  function playSequence(items) {
    stopSpeech();
    var token = speakToken;
    var chain = Promise.resolve();
    items.forEach(function (it) {
      chain = chain.then(function () {
        if (token !== speakToken) return;
        if (it.el) it.el.classList.add("speaking");
        return speak(it.text, { speaker: it.speaker }).then(function () {
          if (it.el) it.el.classList.remove("speaking");
          if (token !== speakToken) return;
          return wait(380);
        });
      });
    });
    return chain.then(function () { return token === speakToken; });
  }

  /* ---------- Reconhecimento de fala (opcional) ---------- */
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  function listenOnce() {
    return new Promise(function (resolve, reject) {
      var r = new Recognition();
      r.lang = "en-US";
      r.interimResults = false;
      r.maxAlternatives = 3;
      var got = false;
      r.onresult = function (ev) {
        got = true;
        var alts = [];
        for (var i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
        resolve(alts);
      };
      r.onerror = function (ev) { reject(ev.error || "erro"); };
      r.onend = function () { if (!got) reject("no-speech"); };
      try { r.start(); } catch (e) { reject("start"); }
    });
  }

  /* ---------- Comparação de palavras (ditado e fala) ---------- */
  function normWords(s) {
    return s.toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/-/g, " ")
      .replace(/[^a-z0-9' ]+/g, " ")
      .replace(/'/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map(function (w) { return w === "ok" ? "okay" : w; });
  }
  // Marca quais palavras do alvo aparecem, na ordem, no que a pessoa escreveu/falou (LCS).
  function compare(target, attempt) {
    var shown = target.replace(/-/g, " ").split(/\s+/).filter(Boolean);
    var t = shown.map(function (w) { return normWords(w).join(""); });
    var a = normWords(attempt);
    var n = t.length, m = a.length, i, j;
    var dp = [];
    for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) {
      dp[i][j] = t[i] && t[i] === a[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
    var ok = new Array(n).fill(false);
    i = 0; j = 0;
    while (i < n && j < m) {
      if (t[i] && t[i] === a[j]) { ok[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    var counted = t.filter(Boolean).length || 1;
    var hits = ok.filter(Boolean).length;
    return {
      html: shown.map(function (w, k) {
        return '<span class="' + (ok[k] || !t[k] ? "ok" : "miss") + '">' + esc(w) + "</span>";
      }).join(" "),
      score: hits / counted
    };
  }

  /* ---------- Revisão espaçada ---------- */
  function unlockedLessons() {
    return LESSONS.filter(function (l) { return Object.keys(stepsOf(l.id)).length > 0; });
  }
  function allCards() {
    var cards = [];
    unlockedLessons().forEach(function (l) {
      l.lines.forEach(function (ln, i) {
        if (!ln.noDict) cards.push({ id: l.id + ":l" + i, lesson: l, item: ln, speaker: ln.s });
      });
      l.phrases.forEach(function (p, i) {
        cards.push({ id: l.id + ":p" + i, lesson: l, item: p, speaker: "A" });
      });
    });
    return cards;
  }
  function dueCards() {
    var now = Date.now();
    var due = [], fresh = [];
    allCards().forEach(function (c) {
      var s = state.cards[c.id];
      if (!s) fresh.push(c);
      else if (s.due <= now) due.push(c);
    });
    due.sort(function (a, b) { return state.cards[a.id].due - state.cards[b.id].due; });
    return due.concat(fresh.slice(0, NEW_PER_SESSION));
  }
  function updateDueCount() {
    var el = document.getElementById("due-count");
    if (!el) return;
    var n = dueCards().length;
    el.textContent = n ? n : "";
  }

  /* ---------- Controles comuns ---------- */
  function voiceOptions() {
    if (!voices.length) return '<option value="">Voz padrão</option>';
    var cur = mainVoice();
    return voices.map(function (v) {
      return '<option value="' + esc(v.name) + '"' + (v === cur ? " selected" : "") + ">" + esc(v.name.replace(/^Microsoft |^Google /, "")) + " (" + esc(v.lang) + ")</option>";
    }).join("");
  }
  function audioSettings() {
    var seg = Object.keys(SPEEDS).map(function (k) {
      return '<button type="button" data-act="speed" data-v="' + k + '" aria-pressed="' + (state.speed === k) + '">' + SPEED_LABELS[k] + "</button>";
    }).join("");
    return '<div class="settings"><span class="seg" role="group" aria-label="Velocidade da voz">' + seg + "</span>" +
      '<label class="sr-only" for="voice-select">Voz</label><select id="voice-select" data-act="voice">' + voiceOptions() + "</select></div>";
  }
  function noVoiceNotice() {
    return synth ? "" : '<p class="notice">Este navegador não tem voz sintetizada. Abra no Chrome, Edge ou Safari para ouvir os áudios.</p>';
  }
  function playBtn(attrs, label) {
    return '<button type="button" class="play" ' + attrs + ' aria-label="' + esc(label || "Ouvir") + '">' + ICON.play + "</button>";
  }
  function glossHTML(item) {
    return '<div class="g-en" lang="en">' + esc(item.en) + "</div>" +
      '<div class="g-pr">' + pron(item.pr) + "</div>" +
      (item.nat ? '<div class="g-nat"><span class="tag">rápido</span>' + pron(item.nat) + "</div>" : "") +
      '<div class="g-pt">' + esc(item.pt) + "</div>";
  }
  function setNav(which) {
    document.querySelectorAll("#nav a").forEach(function (a) {
      if (a.getAttribute("data-nav") === which) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Página inicial ---------- */
  function renderHome() {
    setNav("home");
    var due = dueCards().length;
    var demo = LESSONS[0].lines[4];
    var cards = LESSONS.map(function (l, i) {
      var st = stepsOf(l.id);
      var dots = STEPS.map(function (s) { return '<i class="' + (st[s.id] ? "on" : "") + '" title="' + s.name + '"></i>'; }).join("");
      return '<a class="lcard" href="#' + l.id + '">' +
        '<div class="top-row"><span class="num">Lição ' + pad2(i + 1) + '</span><span class="dots" aria-label="Passos concluídos">' + dots + "</span></div>" +
        "<h3>" + esc(l.title) + "</h3>" +
        '<p class="en" lang="en">' + esc(l.en) + "</p></a>";
    }).join("");

    view.innerHTML =
      '<section class="hero">' +
        "<div>" +
          '<p class="eyebrow">Inglês falado, escrito para brasileiros</p>' +
          "<h1>Aprenda a falar lendo. Aprenda a ouvir ouvindo.</h1>" +
          '<p class="lead">Cada frase vem em inglês correto e também escrita do jeito que se pronuncia, com as regras de leitura do português. É o mesmo princípio do romaji no japonês. Os diálogos são situações reais: café, aeroporto, reunião, farmácia.</p>' +
        "</div>" +
        '<figure class="demo">' +
          '<div class="row"><span class="lbl">Inglês</span><span class="g-en" lang="en">' + esc(demo.en) + "</span></div>" +
          '<div class="row"><span class="lbl">Fala-se</span><span class="g-pr">' + pron(demo.pr) + "</span></div>" +
          '<div class="row"><span class="lbl">Significa</span><span class="g-pt">' + esc(demo.pt) + "</span></div>" +
          '<div class="foot"><span>Sílaba em <b>MAIÚSCULA</b> = sílaba forte</span>' +
          '<button type="button" class="btn listen" data-act="say" data-text="' + esc(demo.en) + '">' + ICON.play + "Ouvir</button></div>" +
        "</figure>" +
      "</section>" +
      noVoiceNotice() +
      '<ol class="steps4" aria-label="Os 4 passos de cada lição">' +
        '<li><span class="n">passo 1</span><strong>Ler</strong><span>Leia o diálogo com a pronúncia escrita.</span></li>' +
        '<li><span class="n">passo 2</span><strong>Falar</strong><span>Faça o seu papel em voz alta, sem olhar o inglês.</span></li>' +
        '<li><span class="n">passo 3</span><strong>Ouvir</strong><span>Escute sem texto. Só depois confira.</span></li>' +
        '<li><span class="n">passo 4</span><strong>Ditado</strong><span>Escreva o que ouviu, palavra por palavra.</span></li>' +
      "</ol>" +
      (unlockedLessons().length
        ? '<div class="review-cta"><div><strong>' + (due ? due + " frases para revisar hoje" : "Revisão em dia") + '</strong><p class="muted">As frases das lições voltam antes de você esquecer.</p></div>' +
          '<a class="btn primary" href="#revisao">' + (due ? "Revisar agora" : "Abrir revisão") + "</a></div>"
        : "") +
      "<section>" +
        '<div class="section-head"><h2>Lições</h2><p>Comece pela 1: ela ensina a pedir para repetir, o que salva qualquer conversa.</p></div>' +
        '<div class="lessons">' + cards + "</div>" +
      "</section>";
  }

  /* ---------- Lição ---------- */
  var session = {}; // estado temporário dos passos (não precisa ser salvo)

  function renderLesson(id, step) {
    var l = lessonById(id);
    if (!l) { renderHome(); return; }
    setNav("");
    if (!STEPS.some(function (s) { return s.id === step; })) step = "ler";
    var st = stepsOf(l.id);
    var idx = LESSONS.indexOf(l);
    var nav = STEPS.map(function (s) {
      return '<a href="#' + l.id + "-" + s.id + '" class="' + (st[s.id] ? "done" : "") + '"' + (s.id === step ? ' aria-current="step"' : "") + '>' +
        '<span class="n">' + (st[s.id] ? "✓" : s.n) + "</span>" + s.name + "</a>";
    }).join("");

    view.innerHTML =
      '<div class="lhead">' +
        '<a class="back" href="#">← Todas as lições</a>' +
        '<p class="eyebrow">Lição ' + pad2(idx + 1) + ' · <span lang="en">' + esc(l.en) + "</span></p>" +
        "<h1>" + esc(l.title) + "</h1>" +
        '<p class="ctx">' + esc(l.ctx) + "</p>" +
      "</div>" +
      '<div class="toolbar"><nav class="stepnav" aria-label="Passos">' + nav + "</nav>" + audioSettings() + "</div>" +
      noVoiceNotice() +
      '<div id="step" class="stack"></div>';

    var box = document.getElementById("step");
    session.lesson = l;
    session.step = step;
    if (step === "ler") stepRead(l, box);
    else if (step === "falar") stepSpeak(l, box);
    else if (step === "ouvir") stepListen(l, box);
    else stepDictation(l, box);
  }

  function nextStepLink(l, step) {
    var i = STEPS.map(function (s) { return s.id; }).indexOf(step);
    if (i < STEPS.length - 1) return "#" + l.id + "-" + STEPS[i + 1].id;
    return "#revisao";
  }
  function doneButton(l, step, label) {
    return '<div class="next-row"><button type="button" class="btn primary" data-act="done" data-step="' + step + '">' + esc(label) + " →</button></div>";
  }
  function speakerName(l, s) { return l.speakers[s] || s; }

  /* Passo 1: Ler */
  function stepRead(l, box) {
    var sh = state.show;
    var cls = (sh.en ? "" : " hide-en") + (sh.pr ? "" : " hide-pr") + (sh.pt ? "" : " hide-pt");
    var lines = l.lines.map(function (ln, i) {
      return '<div class="line" data-line="' + i + '">' +
        '<div class="who' + (ln.s === "A" ? " me" : "") + '">' + esc(speakerName(l, ln.s)) + "</div>" +
        '<div class="gloss">' + glossHTML(ln) + "</div>" +
        playBtn('data-act="line" data-i="' + i + '"', "Ouvir esta frase") + "</div>";
    }).join("");
    var phrases = l.phrases.map(function (p) {
      return '<div class="line"><div class="who">Frase útil</div><div class="gloss">' + glossHTML(p) + "</div>" +
        playBtn('data-act="say" data-text="' + esc(p.en) + '"', "Ouvir esta frase") + "</div>";
    }).join("");
    function chip(k, label) {
      return '<button type="button" class="chip" data-act="toggle" data-k="' + k + '" aria-pressed="' + !!sh[k] + '">' + label + "</button>";
    }
    box.innerHTML =
      '<div class="intro"><p><strong>Leia cada fala em voz alta seguindo a linha verde.</strong> A sílaba sublinhada é a forte: bata nela. Depois toque ▶ e compare com o seu jeito. Quando já souber a pronúncia de uma frase, esconda a linha verde e leia só o inglês.</p></div>' +
      '<div class="row-btns" style="justify-content:space-between">' +
        '<div class="toggles">Mostrar: ' + chip("en", "Inglês") + chip("pr", "Pronúncia") + chip("pt", "Tradução") + "</div>" +
        '<div class="row-btns"><button type="button" class="btn listen" data-act="play-all">' + ICON.play + "Tocar diálogo</button>" +
        '<button type="button" class="btn ghost" data-act="stop">' + ICON.stop + "Parar</button></div>" +
      "</div>" +
      '<div class="dialog' + cls + '" id="dialog">' + lines + "</div>" +
      '<div class="notes"><h3>Detalhes que fazem diferença</h3><ul>' + l.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>" +
      "<section class=\"stack\"><h2>Frases para levar</h2><div class=\"dialog" + cls + '" id="phrases">' + phrases + "</div></section>" +
      doneButton(l, "ler", "Li tudo em voz alta");
  }

  /* Passo 2: Falar (você faz um papel, a voz faz o outro) */
  function stepSpeak(l, box) {
    var roles = Object.keys(l.speakers);
    var role = state.role[l.id] || "A";
    if (!session.rp || session.rp.lesson !== l.id || session.rp.role !== role) {
      session.rp = { lesson: l.id, role: role, i: 0, hint: false, reveal: false, check: "" };
    }
    var rp = session.rp;
    var roleBtns = roles.map(function (r) {
      return '<button type="button" data-act="role" data-v="' + r + '" aria-pressed="' + (r === role) + '">' + esc(l.speakers[r]) + "</button>";
    }).join("");

    var done = rp.i >= l.lines.length;
    var past = l.lines.slice(Math.max(0, rp.i - 3), rp.i).map(function (ln, k) {
      var i = Math.max(0, rp.i - 3) + k;
      return '<div class="line"><div class="who' + (ln.s === role ? " me" : "") + '">' + esc(ln.s === role ? "Você" : speakerName(l, ln.s)) + '</div><div class="gloss"><div class="g-en" lang="en">' + esc(ln.en) + '</div><div class="g-pr">' + pron(ln.pr) + "</div></div>" +
        playBtn('data-act="line" data-i="' + i + '"', "Ouvir de novo") + "</div>";
    }).join("");

    var stage;
    if (done) {
      stage = '<div class="stage"><h2>Diálogo completo.</h2><p class="muted">Faça de novo trocando de papel, ou até conseguir falar suas frases sem abrir a dica.</p>' +
        '<div class="row-btns"><button type="button" class="btn" data-act="rp-restart">Treinar de novo</button></div></div>' +
        doneButton(l, "falar", "Concluir e ir para Ouvir");
    } else {
      var ln = l.lines[rp.i];
      var mine = ln.s === role;
      var head = '<p class="progress">Fala ' + (rp.i + 1) + " de " + l.lines.length + "</p>";
      if (mine) {
        stage = '<div class="stage">' + head +
          '<p class="prompt-label">Sua vez. Diga em inglês:</p>' +
          '<p class="prompt">' + esc(ln.pt) + "</p>" +
          (rp.hint || rp.reveal ? '<div class="g-pr">' + pron(ln.pr) + "</div>" : "") +
          (rp.reveal ? '<div class="g-en" lang="en">' + esc(ln.en) + "</div>" : "") +
          (rp.check ? '<div class="check">' + rp.check + "</div>" : "") +
          '<div class="row-btns">' +
            (rp.hint || rp.reveal ? "" : '<button type="button" class="btn" data-act="rp-hint">Dica: ver pronúncia</button>') +
            (rp.reveal ? "" : '<button type="button" class="btn" data-act="rp-reveal">Mostrar resposta</button>') +
            '<button type="button" class="btn listen" data-act="line" data-i="' + rp.i + '">' + ICON.play + "Ouvir modelo</button>" +
            (Recognition ? '<button type="button" class="btn" data-act="rp-mic">' + ICON.mic + "Checar minha fala</button>" : "") +
            '<button type="button" class="btn primary" data-act="rp-next">Próxima →</button>' +
          "</div></div>";
      } else {
        stage = '<div class="stage">' + head +
          '<p class="prompt-label">' + esc(speakerName(l, ln.s)) + " diz:</p>" +
          '<div class="gloss">' + glossHTML(ln) + "</div>" +
          '<div class="row-btns"><button type="button" class="btn listen" data-act="line" data-i="' + rp.i + '">' + ICON.play + "Ouvir de novo</button>" +
          '<button type="button" class="btn primary" data-act="rp-next">Continuar →</button></div></div>';
      }
    }

    box.innerHTML =
      '<div class="intro"><p><strong>Você faz um papel, a voz faz o outro.</strong> Quando for a sua vez, aparece a frase em português: fale em inglês, em voz alta. Travou? Abra a dica. Depois ouça o modelo e repita imitando o ritmo e a melodia, não só as palavras.</p></div>' +
      '<div class="toggles">Seu papel: <span class="seg" role="group" aria-label="Seu papel">' + roleBtns + "</span></div>" +
      (past ? '<div class="dialog">' + past + "</div>" : "") +
      stage;

    // A fala do outro personagem toca sozinha.
    if (!done && l.lines[rp.i].s !== role && rp.autoplayed !== rp.i) {
      rp.autoplayed = rp.i;
      say(l.lines[rp.i].en, { speaker: l.lines[rp.i].s });
    }
  }

  /* Passo 3: Ouvir (sem texto primeiro) */
  function stepListen(l, box) {
    if (!session.ls || session.ls.lesson !== l.id) session.ls = { lesson: l.id, open: {}, rate: {} };
    var ls = session.ls;
    var rated = Object.keys(ls.rate).length;
    var got = Object.keys(ls.rate).filter(function (k) { return ls.rate[k]; }).length;
    var lines = l.lines.map(function (ln, i) {
      var open = ls.open[i];
      var mask = ln.en.split(/\s+/).map(function (w) {
        return '<i style="width:' + Math.max(1.2, w.replace(/[^A-Za-z']/g, "").length * 0.55) + 'em"></i>';
      }).join("");
      return '<div class="line" data-line="' + i + '">' +
        '<div class="who' + (ln.s === "A" ? " me" : "") + '">' + esc(speakerName(l, ln.s)) + "</div>" +
        '<div class="gloss">' +
          (open ? glossHTML(ln) +
            '<div class="rate"><button type="button" class="chip got" data-act="rate" data-i="' + i + '" data-v="1" aria-pressed="' + (ls.rate[i] === true) + '">Tinha entendido</button>' +
            '<button type="button" class="chip miss" data-act="rate" data-i="' + i + '" data-v="0" aria-pressed="' + (ls.rate[i] === false) + '">Não tinha entendido</button></div>'
            : '<div class="mask" aria-label="Frase escondida">' + mask + '</div><div class="rate"><button type="button" class="chip" data-act="open" data-i="' + i + '">Mostrar texto</button></div>') +
        "</div>" +
        playBtn('data-act="line" data-i="' + i + '"', "Ouvir esta frase") + "</div>";
    }).join("");

    box.innerHTML =
      '<div class="intro"><p><strong>Agora o contrário: ouça sem ler.</strong> Toque o diálogo inteiro uma vez só ouvindo. Depois vá frase por frase: ouça quantas vezes quiser, tente entender, e só então mostre o texto. Não entendeu no Normal? Ouça no Devagar e volte para o Normal.</p></div>' +
      '<div class="row-btns"><button type="button" class="btn listen" data-act="play-all">' + ICON.play + "Ouvir diálogo inteiro</button>" +
      '<button type="button" class="btn ghost" data-act="stop">' + ICON.stop + "Parar</button></div>" +
      '<div class="dialog" id="dialog">' + lines + "</div>" +
      (rated ? '<div class="stage"><p class="prompt-label">Você entendeu de ouvido</p><p class="score">' + got + " de " + rated + " frases</p>" +
        '<p class="muted">Repita este passo em outro dia até entender tudo no Normal. Depois tente no Rápido.</p></div>' : "") +
      doneButton(l, "ouvir", "Concluir e ir para o Ditado");
  }

  /* Passo 4: Ditado */
  function stepDictation(l, box) {
    var items = l.lines.map(function (ln, i) { return i; }).filter(function (i) { return !l.lines[i].noDict; });
    if (!session.dt || session.dt.lesson !== l.id) session.dt = { lesson: l.id, k: 0, result: null, scores: [], text: "" };
    var dt = session.dt;

    if (dt.k >= items.length) {
      var avg = dt.scores.reduce(function (a, b) { return a + b; }, 0) / (dt.scores.length || 1);
      box.innerHTML =
        '<div class="stage"><p class="prompt-label">Resultado do ditado</p><p class="score">' + Math.round(avg * 100) + "% das palavras</p>" +
        '<p class="muted">As palavras que escapam no ditado são quase sempre as pequenas: to, the, a, you, and. É exatamente elas que o ouvido precisa treinar.</p>' +
        '<div class="row-btns"><button type="button" class="btn" data-act="dt-restart">Fazer de novo</button></div></div>' +
        doneButton(l, "ditado", "Concluir lição e revisar");
      return;
    }
    var i = items[dt.k];
    var ln = l.lines[i];
    box.innerHTML =
      '<div class="intro"><p><strong>Ouça e escreva o que entendeu.</strong> Pode ouvir quantas vezes quiser, inclusive devagar. Não se preocupe com pontuação e maiúsculas.</p></div>' +
      '<div class="stage">' +
        '<p class="progress">Frase ' + (dt.k + 1) + " de " + items.length + " · " + esc(speakerName(l, ln.s)) + "</p>" +
        '<div class="row-btns"><button type="button" class="btn listen" data-act="line" data-i="' + i + '">' + ICON.play + "Ouvir</button>" +
        '<button type="button" class="btn" data-act="line-slow" data-i="' + i + '">' + ICON.slow + "Ouvir devagar</button></div>" +
        '<label class="sr-only" for="dict-input">O que você ouviu</label>' +
        '<textarea id="dict-input" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escreva aqui em inglês…"' + (dt.result ? " readonly" : "") + ">" + esc(dt.text) + "</textarea>" +
        (dt.result
          ? '<div class="check"><div class="words" lang="en">' + dt.result.html + '</div></div>' +
            '<div class="gloss">' + glossHTML(ln) + "</div>" +
            '<div class="row-btns"><button type="button" class="btn primary" data-act="dt-next">Próxima →</button></div>'
          : '<div class="row-btns"><button type="button" class="btn primary" data-act="dt-check">Conferir</button>' +
            '<button type="button" class="btn ghost" data-act="dt-skip">Não entendi nada, mostrar</button></div>') +
      "</div>";
    if (!dt.result) {
      var ta = document.getElementById("dict-input");
      ta.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); act("dt-check", {}); }
      });
      ta.addEventListener("input", function () { dt.text = ta.value; });
    }
  }

  /* ---------- Revisão ---------- */
  var review = null;
  function renderReview() {
    setNav("revisao");
    if (!review) review = { mode: "falar", queue: dueCards(), open: false, done: 0 };
    var modeBtns = [["falar", "Falar (português → inglês)"], ["ouvir", "Ouvir (áudio → entender)"]].map(function (m) {
      return '<button type="button" data-act="rv-mode" data-v="' + m[0] + '" aria-pressed="' + (review.mode === m[0]) + '">' + m[1] + "</button>";
    }).join("");
    var total = allCards().length;
    var learned = allCards().filter(function (c) { var s = state.cards[c.id]; return s && s.box >= 3; }).length;

    var head =
      '<div class="lhead"><h1>Revisão</h1><p class="ctx">As frases das lições que você já começou voltam aqui em intervalos cada vez maiores: 1 dia, 3 dias, uma semana, um mês. Errou, ela volta logo.</p></div>' +
      '<div class="toolbar"><span class="seg" role="group" aria-label="Tipo de revisão">' + modeBtns + "</span>" + audioSettings() + "</div>" +
      noVoiceNotice() +
      '<div class="stats"><span>Para hoje: <b>' + review.queue.length + "</b></span><span>Revisadas agora: <b>" + review.done + "</b></span><span>Frases firmes: <b>" + learned + "</b> de <b>" + total + "</b></span></div>";

    if (!total) {
      view.innerHTML = head + '<div class="stage"><h2>Nada para revisar ainda.</h2><p class="muted">Faça o passo 1 de uma lição e as frases dela entram aqui.</p><div class="row-btns"><a class="btn primary" href="#l1">Começar a lição 1</a></div></div>';
      return;
    }
    if (!review.queue.length) {
      view.innerHTML = head + '<div class="stage"><h2>Revisão em dia.</h2><p class="muted">Volte amanhã. Enquanto isso, faça o próximo passo de uma lição ou ouça de novo um diálogo antigo no Normal.</p><div class="row-btns"><a class="btn primary" href="#">Ver lições</a></div></div>';
      return;
    }
    var c = review.queue[0];
    var it = c.item;
    var isNew = !state.cards[c.id];
    var front = review.mode === "falar"
      ? '<p class="prompt-label">Diga em inglês, em voz alta:</p><p class="big">' + esc(it.pt) + "</p>"
      : '<p class="prompt-label">Ouça e tente entender:</p><div class="row-btns"><button type="button" class="btn listen" data-act="rv-play">' + ICON.play + "Ouvir</button>" +
        '<button type="button" class="btn" data-act="rv-play-slow">' + ICON.slow + "Devagar</button></div>";
    var answer = review.open
      ? '<div class="answer">' + glossHTML(it) + '<div class="row-btns" style="margin-top:8px"><button type="button" class="btn listen" data-act="rv-play">' + ICON.play + "Ouvir</button></div></div>" +
        '<div class="grades"><button type="button" class="btn again" data-act="grade" data-v="0">Errei</button>' +
        '<button type="button" class="btn" data-act="grade" data-v="1">Difícil</button>' +
        '<button type="button" class="btn primary" data-act="grade" data-v="2">Acertei</button></div>'
      : '<div class="row-btns"><button type="button" class="btn primary" data-act="rv-open">Mostrar resposta</button></div>';

    view.innerHTML = head +
      '<div class="card"><p class="src">' + (isNew ? "Nova · " : "") + esc(c.lesson.title) + "</p>" + front + answer + "</div>";

    if (review.mode === "ouvir" && !review.open && review.autoplayed !== c.id) {
      review.autoplayed = c.id;
      say(it.en, { speaker: c.speaker });
    }
  }
  function grade(v) {
    var c = review.queue.shift();
    var s = state.cards[c.id] || { box: 0, due: 0 };
    var now = Date.now();
    if (v === 0) {
      s.box = 0; s.due = now;
      review.queue.splice(Math.min(3, review.queue.length), 0, c); // volta daqui a pouco
    } else if (v === 1) {
      s.box = Math.max(1, s.box); s.due = now + DAY;
    } else {
      s.box = Math.min(INTERVALS.length - 1, s.box + 1); s.due = now + INTERVALS[s.box] * DAY;
    }
    state.cards[c.id] = s;
    review.done++;
    review.open = false;
    save();
    updateDueCount();
    renderReview();
  }

  /* ---------- Guia de pronúncia ---------- */
  function renderGuide() {
    setNav("guia");
    function soundRows(list) {
      return list.map(function (r) {
        var exs = r.ex.split(", ");
        var prs = r.pr.split(", ");
        var cells = exs.map(function (e, i) {
          return '<button type="button" class="inline-play" data-act="say" data-text="' + esc(e) + '">' + ICON.play + '<span lang="en">' + esc(e) + '</span></button> <span class="g-pr">' + pron(prs[i] || "") + "</span>";
        }).join("<br>");
        return '<tr><td class="sym">' + esc(r.sym) + "</td><td>" + cells + '</td><td class="tip">' + esc(r.tip) + "</td></tr>";
      }).join("");
    }
    var pairs = GUIDE.pairs.map(function (p) {
      function side(x) {
        return '<div class="side"><button type="button" class="inline-play" data-act="say" data-text="' + esc(x.ex) + '">' + ICON.play + '<span lang="en">' + esc(x.ex) + '</span></button><span class="g-pr">' + pron(x.pr) + "</span></div>";
      }
      return '<div class="pair">' + side(p[0]) + '<span class="vs">x</span>' + side(p[1]) + "</div>";
    }).join("");
    var weak = GUIDE.weak.map(function (w) {
      return '<tr><td><button type="button" class="inline-play" data-act="say" data-text="' + esc(w.w) + '">' + ICON.play + '<span lang="en">' + esc(w.w) + '</span></button></td><td class="g-pr">' + esc(w.strong) + '</td><td class="g-pr"><b>' + esc(w.weak) + "</b></td></tr>";
    }).join("");
    var chunks = GUIDE.chunks.map(function (c) {
      return '<tr><td lang="en">' + esc(c.en) + '</td><td lang="en"><em>' + esc(c.sounds) + '</em></td><td class="g-pr">' + pron(c.pr) + "</td></tr>";
    }).join("");

    view.innerHTML =
      '<div class="lhead"><h1>Guia de pronúncia</h1><p class="ctx">A linha verde de cada frase usa as regras de leitura do português, mais alguns combinados abaixo. Leia estas regras uma vez, com calma, tocando cada exemplo. Depois volte aqui sempre que um símbolo te deixar em dúvida.</p></div>' +
      '<div class="toolbar"><span class="muted">Toque numa palavra para ouvir.</span>' + audioSettings() + "</div>" +
      noVoiceNotice() +
      '<section class="rules">' +
        '<div class="rule"><h3>Sílaba forte em MAIÚSCULA</h3><p class="ex">â-BAUT · ÉV-ri-thing</p><p>Em inglês, errar a sílaba forte atrapalha mais do que errar uma vogal. Bata forte nela e deixe o resto fraco.</p></div>' +
        '<div class="rule"><h3>Termine seco</h3><p class="ex">big · GÁ-dit · uát</p><p>Não coloque vogal no final: é big, não "bigui". Quando a palavra termina em consoante, a boca para ali.</p></div>' +
        '<div class="rule"><h3>Hífen = tudo junto</h3><p class="ex">KUD-jâ · MII-tchâ</p><p>O hífen separa sílabas. Quando junta palavras (could you → KUD-jâ), é porque na fala real elas viram uma coisa só.</p></div>' +
        '<div class="rule"><h3>A linha "rápido"</h3><p class="ex">uá-djâ-DUU?</p><p>Algumas frases têm uma segunda versão: é como o nativo fala sem cuidado. Use para entender. Para falar, a linha verde já é natural.</p></div>' +
      "</section>" +
      '<section class="stack"><h2>Vogais</h2><div class="table-wrap"><table><thead><tr><th>Símbolo</th><th>Exemplo</th><th>Como fazer</th></tr></thead><tbody>' + soundRows(GUIDE.vowels) + "</tbody></table></div></section>" +
      '<section class="stack"><h2>Consoantes</h2><div class="table-wrap"><table><thead><tr><th>Símbolo</th><th>Exemplo</th><th>Como fazer</th></tr></thead><tbody>' + soundRows(GUIDE.consonants) + "</tbody></table></div></section>" +
      '<section class="stack"><h2>Pares que o brasileiro confunde</h2><p class="muted">Toque os dois lados várias vezes até ouvir a diferença. Depois tente produzir a diferença você mesmo.</p><div class="pairs">' + pairs + "</div></section>" +
      '<section class="stack"><h2>Palavras que encolhem</h2><p class="muted">As palavras pequenas têm duas pronúncias. Sozinhas ou com ênfase, soam fortes. Dentro da frase, quase sempre soam fracas. Por isso parece que o nativo "come" palavras.</p>' +
        '<div class="table-wrap"><table><thead><tr><th>Palavra</th><th>Forte</th><th>Fraca (a mais comum)</th></tr></thead><tbody>' + weak + "</tbody></table></div></section>" +
      '<section class="stack"><h2>Palavras que grudam</h2><div class="table-wrap"><table><thead><tr><th>Escrito</th><th>Soa como</th><th>Pronúncia</th></tr></thead><tbody>' + chunks + "</tbody></table></div></section>";
  }

  /* ---------- Método ---------- */
  function renderMethod() {
    setNav("metodo");
    view.innerHTML =
      '<div class="lhead"><h1>Como este método funciona</h1><p class="ctx">Você disse que aprende melhor lendo. Então a fala entra pela leitura, e o ouvido é treinado separado, com áudio de verdade.</p></div>' +
      '<div class="prose">' +
        "<h2>Falar: pela leitura</h2>" +
        "<p>No japonês, o romaji deixa você ler em voz alta antes de dominar a escrita. Aqui é igual: cada frase vem escrita com as regras de leitura do português (a linha verde). Lendo em voz alta, você já sai falando perto do certo, sem depender de imitar só de ouvido.</p>" +
        "<p>Mas a pronúncia escrita é uma ponte, não o destino. Conforme uma frase fica fácil, desligue a linha verde e leia só o inglês. O objetivo é olhar para <em>could you</em> e sair KUD-jâ naturalmente.</p>" +
        "<h2>Ouvir: pelo ouvido, sem apoio</h2>" +
        "<p>Ler enquanto escuta treina a leitura, não o ouvido. Por isso o passo Ouvir esconde o texto: você escuta primeiro, tenta entender, e só depois confere. O ditado força o ouvido a pegar as palavras pequenas (to, the, you, and), que são justamente as que somem na fala rápida.</p>" +
        "<h2>Frases inteiras, não palavras soltas</h2>" +
        "<p>Ninguém conversa com palavras soltas. Os diálogos são situações que você vai viver (café, aeroporto, reunião, farmácia) e as frases úteis servem em muitas outras. Você decora blocos prontos como <em>Can I get...?</em>, <em>Could you say that again?</em> e <em>How long have you...?</em>, e só troca o final.</p>" +
        "<h2>Revisão antes de esquecer</h2>" +
        "<p>Cada frase que você estuda entra na Revisão. Acertou, ela volta em 1 dia, depois 3, 7, 14, 30. Errou, volta na hora. Assim você gasta tempo só com o que ainda não está firme.</p>" +
        "<h2>Rotina de 20 minutos por dia</h2>" +
      "</div>" +
      '<div class="routine">' +
        '<div><span class="min">5 min</span><strong>Revisão</strong><span>Faça as frases do dia. Alterne entre Falar e Ouvir.</span></div>' +
        '<div><span class="min">10 min</span><strong>Lição atual</strong><span>Um ou dois passos da lição. Não precisa fazer os 4 no mesmo dia.</span></div>' +
        '<div><span class="min">5 min</span><strong>Ouvido</strong><span>Ouça de novo um diálogo antigo no Normal ou Rápido, sem texto.</span></div>' +
      "</div>" +
      '<div class="prose">' +
        "<h2>Dicas que aceleram</h2>" +
        "<ul>" +
          "<li><strong>Sempre em voz alta.</strong> Ler com os olhos não treina a boca.</li>" +
          "<li><strong>Imite a melodia.</strong> Exagere a sílaba forte e deixe o resto fraco. O inglês é uma língua de batidas.</li>" +
          "<li><strong>Grave-se de vez em quando</strong> com o gravador do celular e compare com o áudio da frase.</li>" +
          "<li><strong>Repita o passo Ouvir em outro dia.</strong> Entender no Devagar é o começo. O objetivo é entender no Normal.</li>" +
          "<li><strong>Use a lição 1 de verdade.</strong> Pedir para repetir é normal, e nativos fazem isso entre si o tempo todo.</li>" +
        "</ul>" +
        '<p class="muted">Seu progresso fica salvo neste navegador. A voz vem do seu sistema: no Chrome, Edge e Safari há vozes em inglês americano de boa qualidade. Escolha a que preferir no seletor de voz.</p>' +
      "</div>" +
      '<div class="row-btns"><a class="btn primary" href="#l1">Começar pela lição 1</a><a class="btn" href="#guia">Ver o guia de pronúncia</a></div>';
  }

  /* ---------- Ações ---------- */
  function rerender() { route(); }

  function act(name, d, el) {
    var l = session.lesson;
    switch (name) {
      case "say":
        say(d.text);
        break;
      case "line": {
        var ln = l.lines[+d.i];
        var row = document.querySelector('[data-line="' + d.i + '"]');
        stopSpeech();
        if (row) row.classList.add("speaking");
        speak(ln.en, { speaker: ln.s }).then(function () { if (row) row.classList.remove("speaking"); });
        break;
      }
      case "line-slow": {
        var ls = l.lines[+d.i];
        say(ls.en, { speaker: ls.s, rate: SPEEDS.devagar });
        break;
      }
      case "play-all":
        playSequence(l.lines.map(function (ln, i) {
          return { text: ln.en, speaker: ln.s, el: document.querySelector('#dialog [data-line="' + i + '"]') };
        }));
        break;
      case "stop":
        stopSpeech();
        break;
      case "speed":
        state.speed = d.v; save();
        document.querySelectorAll('[data-act="speed"]').forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-v") === d.v)); });
        break;
      case "toggle":
        state.show[d.k] = !state.show[d.k]; save();
        el.setAttribute("aria-pressed", String(state.show[d.k]));
        document.querySelectorAll("#dialog, #phrases").forEach(function (dl) { dl.classList.toggle("hide-" + d.k, !state.show[d.k]); });
        break;
      case "done":
        stopSpeech();
        markStep(l.id, d.step);
        location.hash = nextStepLink(l, d.step).slice(1);
        break;
      case "role":
        state.role[l.id] = d.v; save();
        session.rp = null;
        stopSpeech();
        rerender();
        break;
      case "rp-hint": session.rp.hint = true; rerender(); break;
      case "rp-reveal": session.rp.reveal = true; rerender(); break;
      case "rp-next":
        stopSpeech();
        session.rp.i++; session.rp.hint = false; session.rp.reveal = false; session.rp.check = "";
        rerender();
        break;
      case "rp-restart": session.rp = null; rerender(); break;
      case "rp-mic": {
        var rp = session.rp;
        var target = l.lines[rp.i].en;
        stopSpeech();
        el.disabled = true;
        el.lastChild.textContent = "Ouvindo… fale agora";
        listenOnce().then(function (alts) {
          var best = null;
          alts.forEach(function (a) { var r = compare(target, a); if (!best || r.score > best.score) best = r; });
          var pct = Math.round(best.score * 100);
          rp.check = '<p class="muted">Entendi: “' + esc(alts[0]) + "”</p><div class=\"words\" lang=\"en\">" + best.html + "</div>" +
            "<p>" + (pct >= 90 ? "Ótimo! Saiu claro." : pct >= 60 ? "Quase. Ouça o modelo e repita as palavras em vermelho." : "Ainda não. Leia a pronúncia devagar e tente de novo.") + "</p>";
          rp.reveal = true;
          rerender();
        }, function (err) {
          rp.check = err === "not-allowed" || err === "service-not-allowed"
            ? "O microfone não está liberado aqui. Sem problema: fale em voz alta e compare ouvindo o modelo."
            : "Não consegui ouvir. Tente de novo, mais perto do microfone.";
          rerender();
        });
        break;
      }
      case "open": session.ls.open[+d.i] = true; rerender(); break;
      case "rate": session.ls.rate[+d.i] = d.v === "1"; rerender(); break;
      case "dt-check":
      case "dt-skip": {
        var dt = session.dt;
        var items = l.lines.map(function (x, i) { return i; }).filter(function (i) { return !l.lines[i].noDict; });
        var ta = document.getElementById("dict-input");
        dt.text = name === "dt-skip" ? "" : (ta ? ta.value : "");
        if (name === "dt-check" && !dt.text.trim()) { if (ta) ta.focus(); break; }
        dt.result = compare(l.lines[items[dt.k]].en, dt.text);
        dt.scores.push(dt.result.score);
        rerender();
        break;
      }
      case "dt-next":
        session.dt.k++; session.dt.result = null; session.dt.text = "";
        rerender();
        setTimeout(function () { var t = document.getElementById("dict-input"); if (t) t.focus(); }, 0);
        break;
      case "dt-restart": session.dt = null; rerender(); break;
      case "rv-mode": review.mode = d.v; review.open = false; review.autoplayed = null; renderReview(); break;
      case "rv-open": review.open = true; renderReview(); break;
      case "rv-play": say(review.queue[0].item.en, { speaker: review.queue[0].speaker }); break;
      case "rv-play-slow": say(review.queue[0].item.en, { speaker: review.queue[0].speaker, rate: SPEEDS.devagar }); break;
      case "grade": grade(+d.v); break;
    }
  }

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]");
    if (!el || el.tagName === "SELECT") return;
    ev.preventDefault();
    var d = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name.indexOf("data-") === 0) d[a.name.slice(5)] = a.value;
    }
    act(el.getAttribute("data-act"), d, el);
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.id === "voice-select") {
      state.voice = ev.target.value; save();
      say("Hi! This is my voice.");
    }
  });

  /* ---------- Rotas ---------- */
  function route() {
    var h = location.hash.replace(/^#/, "");
    var m = /^(l\d+)(?:-(\w+))?$/.exec(h);
    if (m) {
      if (!session.lesson || session.lesson.id !== m[1]) { session = {}; }
      renderLesson(m[1], m[2] || "ler");
    } else {
      if (h !== "revisao") review = null;
      if (h === "guia") renderGuide();
      else if (h === "revisao") renderReview();
      else if (h === "metodo") renderMethod();
      else renderHome();
    }
  }
  var lastHash = null;
  window.addEventListener("hashchange", function () {
    stopSpeech();
    var h = location.hash;
    var sameLesson = lastHash && h.split("-")[0] === lastHash.split("-")[0] && /^#l\d/.test(h);
    lastHash = h;
    route();
    if (!sameLesson) window.scrollTo(0, 0);
  });
  lastHash = location.hash;
  route();
  updateDueCount();
})();
