/* ╔══════════════════════════════════╗
   ║  C O N F I G                    ║
   ╚══════════════════════════════════╝ */
const RECIPIENT = "Special Birthday Portal: Mba Lulu";
const LETTER_TEXT = `Selamat Ulang Tahun Mbaaa. Semoga pusingnya cepat luntur dan ganti jadi ketenangan wkwkkw
   
   hari ini bukan bertambahnya usia, tapi merayakan step by step yang mba ambil sampai hari ini. angka sih boleh nambah yaa yang penting semangat have fun nya ada dan gak kalah sama yang mudaan xixixixi
   
   Tetap jadi sosok yang punya prinsip dan visi yang kuat mbaa karna jarang ada yang kayak mba lulu, mungkin kayak sudah rare. Terus juga karakter sama sifat mba juga unique dan termasuk ke kategori rare. 
   
   Semoga tahun ini menjadi karakter yang sempurna dari sebelumnya dan juga ibadah yang meningkat xixixi.`;

const WISHES = [
  "Kesehatan yang pulih\n& selalu prima 🌿",
  "Waktu istirahat tanpa\nrasa bersalah 🕯️",
  "Prinsip kuat yang\nmembawa jauh ⭐",
  "Visi besarmu yang\nsegera terwujud 🗺️",
  "Ketenangan hati di\ntengah hiruk-pikuk 🌊",
  "Tawa lepas tanpa\nbeban deadline 🌸",
  "Rezeki yang berkah\n& mengalir deras 💫",
  "Cahaya yang selalu\nmenginspirasi 🌟",
  "Keberanian untuk\nterus melangkah 🔥",
  "Kebahagiaan dari\nhal-hal sederhana 🌈",
  "Langkah yang selalu\ndijaga & barokah ✨",
  "Tahun ini jadi saksi\nkesuksesan! 🎊",
];

const FWC = [
  "#FFD700",
  "#FF6BAD",
  "#00F5FF",
  "#BF5FFF",
  "#FF4500",
  "#7FFF00",
  "#FFA500",
  "#FF69B4",
  "#40E0D0",
  "#E8D8FF",
];
const BCOLORS = [
  "#FF6B9D",
  "#FF9F43",
  "#FECA57",
  "#48DBFB",
  "#FF6348",
  "#C44569",
  "#A29BFE",
  "#6C5CE7",
  "#00CEC9",
  "#55EFC4",
  "#FDCB6E",
  "#E17055",
];
const CANDLE_CX = [76, 97, 120, 150, 173];
const IS_MOB = window.innerWidth < 640 || navigator.maxTouchPoints > 0;
const PS = IS_MOB ? 0.58 : 1; // particle scale

/* ╔══════════════════════════════════╗
      ║  C A N V A S                    ║
      ╚══════════════════════════════════╝ */
const cvs = document.getElementById("fx");
const ctx = cvs.getContext("2d");
let W, H;
function rsz() {
  W = cvs.width = innerWidth;
  H = cvs.height = innerHeight;
}
rsz();
window.addEventListener("resize", rsz);

/* ╔══════════════════════════════════╗
      ║  W E B  A U D I O               ║
      ╚══════════════════════════════════╝ */
let AC;
function getAC() {
  if (!AC) {
    AC = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (AC.state === "suspended") AC.resume().catch(() => {});
  return AC;
}

function osc(f, type, dur, vol, d = 0) {
  try {
    const a = getAC(),
      o = a.createOscillator(),
      g = a.createGain();
    o.connect(g);
    g.connect(a.destination);
    o.type = type;
    o.frequency.value = f;
    const t = a.currentTime + d;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch (e) {}
}

function nzBurst(dur, vol, freq, bw, d = 0) {
  try {
    const a = getAC(),
      buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const dat = buf.getChannelData(0);
    for (let i = 0; i < dat.length; i++) dat[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(),
      f = a.createBiquadFilter(),
      g = a.createGain();
    src.buffer = buf;
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = freq / bw;
    src.connect(f);
    f.connect(g);
    g.connect(a.destination);
    const t = a.currentTime + d;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.start(t);
    src.stop(t + dur + 0.02);
  } catch (e) {}
}

const SFX = {
  meteor: () => {
    nzBurst(0.55, 0.32, 350, 180);
    osc(75, "sawtooth", 0.5, 0.18, 0);
  },
  candle: () => {
    osc(1100, "sine", 0.09, 0.38);
    nzBurst(0.045, 0.28, 2800, 900, 0.01);
  },
  pop: () => {
    nzBurst(0.065, 0.48, 750, 550);
    osc(380, "sine", 0.055, 0.28);
  },
  fw: () => {
    osc(180 + Math.random() * 200, "sawtooth", 0.38, 0.11);
    nzBurst(0.18, 0.15, 600, 380, 0.04);
  },
  tick: () => {
    if (Math.random() > 0.35) nzBurst(0.012, 0.055, 2800, 900);
  },
  rustle: () => {
    nzBurst(0.22, 0.14, 360, 280);
  },
  chime: () => {
    [880, 1108, 1320].forEach((f, i) => osc(f, "sine", 0.65, 0.13, i * 0.13));
  },
  fanfare: () => {
    [523, 659, 784, 1047, 1318].forEach((f, i) => {
      osc(f, "sine", 0.5, 0.22, i * 0.09);
      osc(f * 1.26, "triangle", 0.3, 0.09, i * 0.09 + 0.05);
    });
  },
  star: () => {
    if (Math.random() > 0.5)
      osc(1100 + Math.random() * 700, "sine", 0.09, 0.06);
  },
};

/* ╔══════════════════════════════════╗
      ║  P A R T I C L E S              ║
      ╚══════════════════════════════════╝ */
const pts = [],
  cnf = [];

class Pt {
  constructor(x, y, col, vx, vy, life = 1, r = 3) {
    Object.assign(this, {
      x,
      y,
      col,
      vx,
      vy,
      life,
      _l: life,
      r,
      grav: 0.048,
      dec: 0.015 + Math.random() * 0.012,
    });
  }
  tick() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.grav;
    this.vx *= 0.988;
    this.life -= this.dec;
  }
  draw() {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this._l);
    ctx.fillStyle = this.col;
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.col;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Cnf {
  constructor(x) {
    this.x = x ?? Math.random() * W;
    this.y = -14;
    this.w = Math.random() * 9 + 4;
    this.h = Math.random() * 5 + 3;
    this.col = FWC[Math.floor(Math.random() * FWC.length)];
    this.vx = (Math.random() - 0.5) * 3.5;
    this.vy = Math.random() * 2.8 + 1.5;
    this.rot = Math.random() * 360;
    this.rv = (Math.random() - 0.5) * 5;
    this.sh = Math.floor(Math.random() * 3);
  }
  tick() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rv;
    this.vx *= 0.992;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rot * Math.PI) / 180);
    ctx.fillStyle = this.col;
    ctx.shadowBlur = 3;
    ctx.shadowColor = this.col;
    if (this.sh === 0) ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    else if (this.sh === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        i
          ? ctx.lineTo((Math.cos(a) * this.w) / 2, (Math.sin(a) * this.w) / 2)
          : ctx.moveTo((Math.cos(a) * this.w) / 2, (Math.sin(a) * this.w) / 2);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

function burst(x, y, col, n = 65) {
  n = Math.round(n * PS);
  const c2 = FWC[Math.floor(Math.random() * FWC.length)];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.4,
      sp = Math.random() * 4.5 + 1.5;
    pts.push(
      new Pt(
        x,
        y,
        Math.random() > 0.5 ? col : c2,
        Math.cos(a) * sp,
        Math.sin(a) * sp,
        1 + Math.random() * 0.5,
        Math.random() * 2.5 + 1
      )
    );
  }
  for (let i = 0; i < Math.round(10 * PS); i++) {
    const a = Math.random() * Math.PI * 2,
      sp = Math.random() * 8 + 4;
    pts.push(
      new Pt(
        x,
        y,
        "#fff",
        Math.cos(a) * sp,
        Math.sin(a) * sp,
        0.7,
        Math.random() * 2 + 0.5
      )
    );
  }
}

function rain(n = 100) {
  for (let i = 0; i < Math.round(n * PS); i++) cnf.push(new Cnf());
}

/* ╔══════════════════════════════════╗
      ║  S T A R S                      ║
      ╚══════════════════════════════════╝ */
const NS = IS_MOB ? 140 : 240;
const stars = Array.from({ length: NS }, () => ({
  x: Math.random() * 3000,
  y: Math.random() * 2000,
  r: Math.random() * 1.5 + 0.3,
  ph: Math.random() * Math.PI * 2,
  sp: Math.random() * 0.045 + 0.012,
  rev: Math.random() * 5500,
  shown: false,
  a: 0,
}));
let starOpacity = 1;

/* ╔══════════════════════════════════╗
      ║  M E T E O R                    ║
      ╚══════════════════════════════════╝ */
let meteor = null;
function launchMeteor(cb) {
  const sx = W * 0.88 + 80,
    sy = -70,
    tx = W * 0.5,
    ty = H * 0.5;
  meteor = { sx, sy, tx, ty, p: 0, trail: [], cb, done: false };
  SFX.meteor();
}

/* ╔══════════════════════════════════╗
      ║  M A I N  L O O P               ║
      ╚══════════════════════════════════╝ */
let T = 0,
  phase = 0;
function loop(ts) {
  requestAnimationFrame(loop);
  T = ts;
  ctx.clearRect(0, 0, W, H);

  /* Stars */
  stars.forEach((s) => {
    if (!s.shown) {
      if (ts > s.rev) {
        s.shown = true;
        if (phase === 0) SFX.star();
      } else return;
    }
    s.a = Math.min(s.a + 0.025, 1);
    const al = ((Math.sin(ts * 0.001 * s.sp * 50 + s.ph) + 1) / 2) * 0.72 + 0.1;
    const sx = ((s.x % W) + W) % W,
      sy = ((s.y % H) + H) % H;
    ctx.save();
    ctx.globalAlpha = al * s.a * starOpacity;
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(200,225,255,.9)";
    ctx.beginPath();
    ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  /* Meteor */
  if (meteor && !meteor.done) {
    meteor.p = Math.min(meteor.p + 0.024, 1);
    const x = meteor.sx + (meteor.tx - meteor.sx) * meteor.p;
    const y = meteor.sy + (meteor.ty - meteor.sy) * meteor.p;
    meteor.trail.push({ x, y, a: 1 });
    if (meteor.trail.length > 26) meteor.trail.shift();
    meteor.trail.forEach((t, i) => {
      const r = (i / meteor.trail.length) * 3.5;
      ctx.save();
      ctx.globalAlpha = t.a * (i / meteor.trail.length) * 0.85;
      ctx.fillStyle = "#FFE566";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#FFD700";
      ctx.beginPath();
      ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      t.a *= 0.88;
    });
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FFF";
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#FFD700";
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (meteor.p >= 1) {
      meteor.done = true;
      burst(W * 0.5, H * 0.5, "#FFD700", 110);
      rain(40);
      setTimeout(() => {
        if (meteor.cb) meteor.cb();
        meteor = null;
      }, 350);
    }
  }

  /* Particles */
  for (let i = pts.length - 1; i >= 0; i--) {
    pts[i].tick();
    pts[i].draw();
    if (pts[i].life <= 0) pts.splice(i, 1);
  }
  for (let i = cnf.length - 1; i >= 0; i--) {
    cnf[i].tick();
    cnf[i].draw();
    if (cnf[i].y > H + 22) cnf.splice(i, 1);
  }

  /* Phase 5 auto fireworks */
  if (phase === 4) {
    if (Math.random() > 0.978) {
      burst(
        Math.random() * W,
        Math.random() * H * 0.62,
        FWC[Math.floor(Math.random() * FWC.length)],
        72
      );
      SFX.fw();
    }
    if (cnf.length < (IS_MOB ? 70 : 140) && Math.random() > 0.88)
      cnf.push(new Cnf());
  }
}
requestAnimationFrame(loop);

/* ╔══════════════════════════════════╗
      ║  P H A S E  M A N A G E R       ║
      ╚══════════════════════════════════╝ */
function goPhase(n) {
  const old = document.getElementById("p" + (phase + 1));
  const next = document.getElementById("p" + (n + 1));
  if (!next) return;
  old.style.opacity = "0";
  old.style.pointerEvents = "none";
  setTimeout(() => old.classList.remove("on"), 700);
  const bl = document.getElementById("bloom");
  bl.classList.add("on");
  setTimeout(() => {
    bl.classList.remove("on");
    next.classList.add("on");
    next.style.opacity = "";
    next.style.pointerEvents = "";
    phase = n;
    onEnter(n);
  }, 380);
}

function onEnter(n) {
  if (n === 1) initP2();
  if (n === 2) initP3();
  if (n === 3) initP4();
  if (n === 4) initP5();
}

/* ╔══════════════════════════════════╗
      ║  P H A S E  1  —  C O S M O S   ║
      ╚══════════════════════════════════╝ */
let p1Ready = false,
  p1Tapped = false;
const cls = [
  document.getElementById("cl0"),
  document.getElementById("cl1"),
  document.getElementById("cl2"),
];
const hint = document.getElementById("tapHint");
setTimeout(() => cls[0].classList.add("vis"), 1800);
setTimeout(() => cls[1].classList.add("vis"), 3400);
setTimeout(() => {
  cls[2].classList.add("vis");
  setTimeout(() => {
    hint.classList.add("vis");
    p1Ready = true;
  }, 600);
}, 5000);

document.getElementById("p1").addEventListener("click", () => {
  if (p1Tapped || !p1Ready) return;
  p1Tapped = true;
  hint.style.opacity = "0";
  launchMeteor(() => setTimeout(() => goPhase(1), 200));
});

/* ╔══════════════════════════════════════╗
      ║  P H A S E  2  —  I G N I T I O N  ║
      ╚══════════════════════════════════════╝ */
let candLeft = 5;
const blwBtn = document.getElementById("blwBtn"),
  cntLbl = document.getElementById("cntLbl");

function initP2() {
  rain(20);
  for (let i = 0; i < 5; i++)
    setTimeout(
      () => burst(Math.random() * W, Math.random() * H * 0.38, FWC[i], 35),
      i * 280
    );
}

blwBtn.addEventListener("click", () => {
  if (candLeft <= 0) return;
  const idx = 5 - candLeft;
  const fl = document.getElementById("fl" + idx),
    sm = document.getElementById("sm" + idx);
  fl.style.transition = "opacity .3s";
  fl.style.opacity = "0";
  sm.style.opacity = "1";
  // convert SVG coord to screen coord
  const svg = document.getElementById("cakeSvg");
  const r = svg.getBoundingClientRect();
  const sx = r.left + CANDLE_CX[idx] * (r.width / 250);
  const sy = r.top + -8 * (r.height / 215) + r.height * 0.015;
  burst(sx, sy, [FWC[0], FWC[4], FWC[2], FWC[3], FWC[6]][idx], 45);
  SFX.candle();
  candLeft--;
  if (candLeft > 0) {
    cntLbl.textContent = candLeft + " lilin tersisa";
  } else {
    blwBtn.textContent = "🎉 Semua harapan telah dilepas!";
    blwBtn.classList.add("done");
    cntLbl.textContent = "Semua doamu sudah mengudara ✨";
    setTimeout(() => {
      SFX.fanfare();
      rain(150);
      for (let i = 0; i < 10; i++)
        setTimeout(
          () =>
            burst(
              Math.random() * W,
              Math.random() * H * 0.65,
              FWC[i % FWC.length],
              70
            ),
          i * 180
        );
    }, 300);
    setTimeout(() => goPhase(2), 2800);
  }
});

/* ╔══════════════════════════════════════════╗
      ║  P H A S E  3  —  B A L L O O N  P O P  ║
      ╚══════════════════════════════════════════╝ */
let blnLeft = 12;
function initP3() {
  const fld = document.getElementById("blnField");
  fld.innerHTML = "";
  blnLeft = 12;
  document.getElementById("p3Ctr").textContent = "12 balon tersisa";

  BCOLORS.forEach((col, i) => {
    const c = Math.floor(i % 4),
      row = Math.floor(i / 4);
    const xp = 7 + c * 24 + (Math.random() - 0.5) * 7;
    const yp = 18 + row * 26 + (Math.random() - 0.5) * 8;
    const div = document.createElement("div");
    div.className = "bln";
    div.style.cssText = `left:${xp}vw;top:${yp}vh`;
    div.innerHTML = mkBln(col, i);
    div.addEventListener("click", () => popBln(div, i, col));
    fld.appendChild(div);
    // apply float animation after append
    requestAnimationFrame(() => {
      div.style.animation = `bFloat ${7 + Math.random() * 4}s ${
        Math.random() * 2
      }s ease-in-out infinite alternate`;
    });
  });
}

function mkBln(col, i) {
  const dk = darkColor(col, 0.35);
  return `<svg width="54" height="76" viewBox="0 0 54 76" overflow="visible">
       <defs>
         <radialGradient id="rg${i}" cx="36%" cy="30%">
           <stop offset="0%" stop-color="rgba(255,255,255,.42)"/>
           <stop offset="55%" stop-color="${col}"/>
           <stop offset="100%" stop-color="${dk}"/>
         </radialGradient>
       </defs>
       <ellipse cx="27" cy="27" rx="21" ry="25" fill="url(#rg${i})"/>
       <ellipse cx="20" cy="18" rx="5.5" ry="4" fill="rgba(255,255,255,.38)" transform="rotate(-22 20 18)"/>
       <path d="M27 52 Q25 60 23 68 Q27 72 31 68 Q29 60 27 52Z" fill="${dk}" opacity=".7"/>
       <line x1="27" y1="68" x2="27" y2="76" stroke="${dk}" stroke-width="1.5" stroke-linecap="round"/>
     </svg>`;
}

function darkColor(hex, amt) {
  let n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amt));
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amt));
  const b = Math.max(0, (n & 255) * (1 - amt));
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).substring(0, 6)
  );
}

function popBln(el, idx, col) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2,
    cy = r.top + r.height * 0.38;
  el.style.transition = "transform .14s,opacity .18s";
  el.style.transform = "scale(1.35)";
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "scale(0)";
  }, 130);
  setTimeout(() => el.remove(), 320);
  burst(cx, cy, col, 35);
  SFX.pop();
  // wish
  const w = document.createElement("div");
  w.className = "wish-txt";
  w.textContent = WISHES[idx];
  w.style.left = cx + "px";
  w.style.top = cy + "px";
  w.style.color = col;
  w.style.textShadow = `0 0 14px ${col}`;
  document.body.appendChild(w);
  setTimeout(() => w.remove(), 3400);
  blnLeft--;
  const ctr = document.getElementById("p3Ctr");
  if (blnLeft > 0) {
    ctr.textContent = blnLeft + " balon tersisa";
  } else {
    ctr.textContent = "Semua doa sudah dilepas! 🎊";
    rain(220);
    SFX.fanfare();
    for (let i = 0; i < 12; i++)
      setTimeout(
        () =>
          burst(
            Math.random() * W,
            Math.random() * H * 0.72,
            FWC[i % FWC.length],
            75
          ),
        i * 170
      );
    setTimeout(() => goPhase(3), 3000);
  }
}

// Balloon CSS keyframes
document.head.insertAdjacentHTML(
  "beforeend",
  `<style>
   @keyframes bFloat{
     0%  {transform:translateX(0) translateY(0) rotate(-2deg)}
     33% {transform:translateX(10px) translateY(-16px) rotate(3deg)}
     66% {transform:translateX(-8px) translateY(-7px) rotate(-4deg)}
     100%{transform:translateX(6px) translateY(-20px) rotate(2deg)}
   }</style>`
);

/* ╔══════════════════════════════════════╗
      ║  P H A S E  4  —  T H E  L E T T E R ║
      ╚══════════════════════════════════════╝ */
let envOpen = false,
  envRead = false;
function initP4() {
  envOpen = false;
  envRead = false;
}

document.getElementById("envOuter").addEventListener("click", () => {
  if (!envOpen) {
    openEnv();
    return;
  }
  if (!envRead) {
    envRead = true;
    showLetter();
  }
});

function openEnv() {
  if (envOpen) return;
  envOpen = true;
  SFX.rustle();
  document.getElementById("env3d").classList.add("tilt");
  document.getElementById("envFlap").classList.add("open");
  document.getElementById("envHint").textContent =
    "✦ ketuk lagi untuk membaca ✦";
}

function showLetter() {
  document.getElementById("envScene").style.display = "none";
  const lf = document.getElementById("ltrFull");
  lf.style.display = "block";
  addFlowers(lf);
  SFX.chime();
  setTimeout(
    () =>
      typeText(document.getElementById("ltrBody"), LETTER_TEXT, () => {
        document
          .getElementById("ltrBody")
          .querySelector(".cursor-tw")
          ?.remove();
        setTimeout(
          () => document.getElementById("ltrSig").classList.add("show"),
          500
        );
        setTimeout(
          () => document.getElementById("ltrBtn").classList.add("show"),
          950
        );
      }),
    450
  );
}

function typeText(el, text, done, i = 0) {
  const ch = text[i];
  el.innerHTML =
    text.slice(0, i + 1).replace(/\n/g, "<br>") +
    (!done || i < text.length - 1 ? '<span class="cursor-tw"></span>' : "");
  if (ch && ch !== " " && ch !== "\n") SFX.tick();
  if (i >= text.length - 1) {
    done && done();
    return;
  }
  const d =
    ch === "\n"
      ? 330
      : ch === "." || ch === "!"
      ? 210
      : ch === ","
      ? 140
      : 21 + Math.random() * 11;
  setTimeout(() => typeText(el, text, done, i + 1), d);
}

function addFlowers(parent) {
  const pos = [
    { top: "-14px", left: "-14px" },
    { top: "-14px", right: "-14px" },
    { bottom: "-14px", left: "-14px" },
    { bottom: "-14px", right: "-14px" },
  ];
  const fCols = ["#FF9FBE", "#FFD700", "#B5E8FF", "#D4A8FF"];
  pos.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "flwr";
    Object.entries(p).forEach(([k, v]) => (d.style[k] = v));
    d.style.transitionDelay = i * 0.18 + "s";
    d.innerHTML = mkFlower(fCols[i]);
    parent.appendChild(d);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => d.classList.add("show"))
    );
  });
}

function mkFlower(col) {
  const pts2 = [0, 72, 144, 216, 288];
  let s = `<svg width="50" height="50" viewBox="0 0 50 50">`;
  pts2.forEach((a) => {
    const r = (a * Math.PI) / 180;
    const cx = 25 + 12 * Math.cos(r),
      cy = 25 + 12 * Math.sin(r);
    s += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(
      1
    )}" rx="8" ry="5" fill="${col}" opacity=".82" transform="rotate(${a} ${cx.toFixed(
      1
    )} ${cy.toFixed(1)})"/>`;
  });
  s += `<circle cx="25" cy="25" r="7.5" fill="${col}"/><circle cx="25" cy="25" r="4.5" fill="rgba(255,255,255,.72)"/></svg>`;
  return s;
}

/* ╔══════════════════════════════════════╗
      ║  P H A S E  5  —  F I N A L E       ║
      ╚══════════════════════════════════════╝ */
function initP5() {
  document.getElementById("finName").textContent = RECIPIENT;
  SFX.fanfare();
  rain(220);
  for (let i = 0; i < 14; i++)
    setTimeout(() => {
      burst(
        Math.random() * W,
        Math.random() * H * 0.68,
        FWC[i % FWC.length],
        85
      );
      SFX.fw();
    }, i * 220);
}

/* ╔══════════════════════════════════╗
      ║  C U R S O R  +  T A P  F W     ║
      ╚══════════════════════════════════╝ */
const cur = document.getElementById("cur");
document.addEventListener("mousemove", (e) => {
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
});
document.addEventListener("click", (e) => {
  if (phase === 4)
    burst(
      e.clientX,
      e.clientY,
      FWC[Math.floor(Math.random() * FWC.length)],
      45
    );
});
