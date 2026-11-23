// This script makes plans/stand-clear-game-mockup.html, four still screens of the
// game with the stripped-back map and one real question. The ride is the 4
// downtown from Fulton St to Borough Hall/Court St. Every fact comes from data.json.
//
// Run it like this:
//   node game-mockup.js

const fs = require('fs');
const path = require('path');
const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

const ROUTE = '4', FROM = '418', TO = '423';
const pat = D.patterns.find(p => p.route === ROUTE && p.dir === 'S');
const stops = pat.stops.slice(pat.stops.indexOf(FROM), pat.stops.indexOf(TO) + 1);
const cxOf = s => D.complexes[D.stations[s].complex];
const R = D.routes;
const target = cxOf(TO);
const targetLines = target.routes;
const nextAfter = pat.stops[pat.stops.indexOf(TO) + 1];

// The question. Its answer comes from the station data.
const Q = {
  tag: 'Question 1 of 10 · On the way in',
  text: 'Which line will you be able to switch to at the next stop?',
  options: ['R', 'A', '7'],
  answer: 'R',
  fact: 'Court St, on the R, is part of the Borough Hall station. You can switch without paying again.',
};
if (!targetLines.includes(Q.answer) || Q.options.some(o => o !== Q.answer && targetLines.includes(o))) {
  throw new Error('The question does not match the station data.');
}

// ---------- The map strip: only this train's stretch ----------
const textW = (t, size) => t.length * size * 0.56;
const nameOf = s => (cxOf(s).transfer ? cxOf(s).name.split('/')[0] : D.stations[s].name);
const sizeOf = (s, i) => (i === 0 || i === stops.length - 1 ? 16 : 13);
const xs = [0];
for (let i = 1; i < stops.length; i++) {
  const need = (textW(nameOf(stops[i - 1]), sizeOf(stops[i - 1], i - 1)) + textW(nameOf(stops[i]), sizeOf(stops[i], i))) / 2 + 14;
  xs.push(xs[i - 1] + Math.max(70, need));
}
const end = xs[xs.length - 1];
const pill = (x, y) =>
  `<line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}" stroke="#111" stroke-width="16" stroke-linecap="round"/>` +
  `<line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`;

// "at" is how far along the stretch the train is, from 0 to 1.
function strip(at) {
  const tx = end * at;
  let s = `<line x1="0" y1="0" x2="${end}" y2="0" stroke="#e2e2e2" stroke-width="5" stroke-linecap="round"/>`;
  s += `<line x1="0" y1="0" x2="${tx}" y2="0" stroke="${R[ROUTE].color}" stroke-width="8" stroke-linecap="round"/>`;
  stops.forEach((sid, i) => {
    const x = xs[i];
    const stopHere = i === 0 || i === stops.length - 1;
    s += stopHere ? pill(x, 0) : `<circle cx="${x}" cy="0" r="3.5" fill="#fff" stroke="#111" stroke-width="2"/>`;
    s += `<text class="lb" font-size="${sizeOf(sid, i)}" text-anchor="middle" x="${x}" y="-18">${nameOf(sid)}</text>`;
  });
  s += `<circle cx="${tx}" cy="0" r="17.5" fill="#fff"/><circle cx="${tx}" cy="0" r="16" fill="${R[ROUTE].color}"/>` +
    `<text x="${tx}" y="7" text-anchor="middle" font-size="20" font-weight="700" fill="${R[ROUTE].text}">${R[ROUTE].bullet}</text>`;
  // The camera keeps the train in one spot on screen.
  return `<svg class="map" width="390" height="844"><g transform="translate(${195 - tx} 360)">${s}</g></svg>`;
}

// ---------- Screen parts ----------
const bl = (r, size, extra = '') => {
  const t = size >= 40 ? 28 : size >= 30 ? 20 : size >= 22 ? 16 : 13;
  return `<span class="bl" style="width:${size}px;height:${size}px;font-size:${t}px;background:${R[r].color};color:${R[r].text};${extra}">${R[r].bullet}</span>`;
};
const band = (lab, name, lines = [], hi) =>
  `<div class="band"><div class="lab">${lab}</div><div class="name">${name}</div>` +
  (lines.length ? `<div class="buls">${lines.map(r => bl(r, 24, r === hi ? 'box-shadow:0 0 0 2px #111,0 0 0 4px #fff;' : '')).join('')}</div>` : '') + '</div>';
const phone = (cap, inner) => `<div><p class="cap">${cap}</p><div class="ph">${inner}</div></div>`;
const dirWords = D.stations[FROM].south;

const riding = phone('1. Riding', strip(0.62) +
  band('Next stop', target.name) +
  `<div class="card"><div class="row">${bl(ROUTE, 44)}<div><div class="k13">Riding</div>` +
  `<div class="h20">The ${R[ROUTE].bullet} · ${dirWords}</div><div class="t16" style="margin-top:2px">To ${pat.headsign}</div></div></div>` +
  `<div class="rule">Line bullets stay hidden until you arrive, so the screen can't give away an answer.</div></div>`);

const question = phone('2. The train holds. A question.', strip(0.8) +
  band('Next stop', target.name) +
  `<div class="card"><span class="tag">${Q.tag}</span><div class="h20" style="margin-top:8px">${Q.text}</div>` +
  Q.options.map(o => `<div class="opt">${bl(o, 28)}<span>The ${R[o].bullet}</span></div>`).join('') + '</div>');

const right = phone('3. Right answer. You arrive.', strip(1) +
  band('Transfer station', target.name, targetLines, Q.answer) +
  `<div class="card"><div class="row" style="gap:10px"><span class="check">✓</span><span class="h28">Right</span></div>` +
  `<div class="t16 b" style="line-height:1.3;margin-top:12px">${Q.fact}</div><div class="big">Keep riding</div></div>`);

const nextName = cxOf(nextAfter).transfer ? cxOf(nextAfter).name : D.stations[nextAfter].name;
const others = targetLines.filter(r => r !== ROUTE);
const where = phone('4. Where to next?', strip(1) +
  band('Transfer station', target.name, targetLines) +
  `<div class="card"><div class="row" style="justify-content:space-between;align-items:baseline"><div class="h20">Where to next?</div><span class="k13" style="text-decoration:underline;color:#111">End ride</span></div>` +
  `<div class="choice">${bl(ROUTE, 36)}<div><div class="k13">Stay on</div><div class="t16 b">The ${R[ROUTE].bullet} · ${D.stations[TO].south}</div><div class="t13" style="color:#666;margin-top:2px">Next stop: ${nextName}</div></div><span class="go">→</span></div>` +
  `<div class="choice"><span class="bl" style="width:36px;height:36px;font-size:20px;background:#111;color:#fff">⇄</span><div><div class="k13">Transfer</div><div class="t16 b">Switch trains</div>` +
  `<div style="display:flex;gap:4px;margin-top:5px">${others.map(r => bl(r, 20)).join('')}</div></div><span class="go">→</span></div></div>`);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stand Clear game mockup</title>
<!--
Four still screens of Stand Clear with the stripped-back map and one real
question. Made by plans/stand-clear-data/game-mockup.js from MTA data.
It is a design reference for the user's OK, not the game.
-->
<style>
body{margin:0;background:#f3f3f3;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:-.3px;color:#111}
.wrap{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;padding:24px 12px}
.cap{font-size:16px;font-weight:700;margin:0 0 10px;text-align:center}
.ph{width:390px;height:844px;position:relative;overflow:hidden;background:#fff;border:3px solid #111}
.map{position:absolute;inset:0}
.lb{paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round;fill:#111;font-weight:700}
.band{position:absolute;top:0;left:0;right:0;background:#111;color:#fff;padding:16px 20px 14px;z-index:2}
.lab{font-size:13px;font-weight:700;color:#aaa}
.name{font-size:28px;font-weight:700;line-height:1.05;margin-top:4px}
.buls{display:flex;gap:6px;margin-top:10px}
.card{position:absolute;left:0;right:0;bottom:0;height:300px;box-sizing:border-box;background:#fff;border-top:3px solid #111;padding:16px 20px;z-index:2}
.bl{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;flex:none;line-height:1}
.row{display:flex;align-items:center;gap:14px}
.k13{font-size:13px;font-weight:700;color:#666}
.t13{font-size:13px}
.h20{font-size:20px;font-weight:700;line-height:1.15}
.h28{font-size:28px;font-weight:700}
.t16{font-size:16px}
.b{font-weight:700}
.rule{border-top:3px solid #111;margin-top:16px;padding-top:12px;color:#666;font-size:13px;line-height:1.35}
.tag{display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:700;padding:3px 8px}
.opt{display:flex;align-items:center;gap:12px;box-sizing:border-box;border:3px solid #111;font-weight:700;font-size:16px;padding:5px 12px;margin-top:8px;min-height:46px}
.check{width:28px;height:28px;border-radius:50%;border:3px solid #111;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:16px}
.big{display:block;text-align:center;font-weight:700;font-size:16px;padding:13px;background:#111;color:#fff;margin-top:16px}
.choice{display:flex;align-items:center;gap:14px;border:3px solid #111;padding:10px 14px;margin-top:10px;min-height:72px;box-sizing:border-box}
.go{margin-left:auto;font-size:20px;font-weight:700}
</style>
</head>
<body>
<div class="wrap">${riding}${question}${right}${where}</div>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, '..', 'stand-clear-game-mockup.html'), html);
console.log('wrote game mockup:', stops.map(s => D.stations[s].name).join(' > '));
