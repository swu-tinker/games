// This script packs data.json into the game file.
// It replaces everything between the MAP DATA START and MAP DATA END lines
// in games/stand-clear/index.html. The game draws its own strip map from
// the stop lists, so no map drawing data is packed.
//
// Run it like this:
//   node assemble.js

const fs = require('fs');
const path = require('path');
const here = __dirname;
const D = JSON.parse(fs.readFileSync(path.join(here, 'data.json')));
const gamePath = path.join(here, '..', '..', 'games', 'stand-clear', 'index.html');

const routes = {};
for (const r of Object.values(D.routes)) routes[r.id] = [r.bullet, r.color, r.text, r.name];
const st = {};
for (const s of Object.values(D.stations)) st[s.id] = [s.name, s.complex, s.north || '', s.south || ''];
const cx = {};
for (const c of Object.values(D.complexes)) cx[c.id] = [c.name, c.transfer ? 1 : 0, c.stations];
const pat = D.patterns.map(p => [p.route, p.dir, p.headsign, p.stops]);

// Running Late gets its own block: parts of the day, the trains in each part,
// hop times in half minutes, platform tabs, and walks.
const L = D.late;
// Each complex also gets a map spot, so the game can pick goals a fair distance away.
const ll = {};
for (const c of Object.values(D.complexes)) {
  const s = D.stations[c.stations[0]];
  ll[c.id] = [+s.lat.toFixed(4), +s.lon.toFixed(4)];
}
const late = { bands: L.bands, pat: L.pat, svc: L.svc, hops: L.hops, tabs: L.tabs, walks: L.walks, ll };

const data = { downloaded: D.downloaded, feed: D.feed, routes, st, cx, pat, late };
const json = JSON.stringify(data);
const html = fs.readFileSync(gamePath, 'utf8');
const start = html.indexOf('// MAP DATA START');
const end = html.indexOf('// MAP DATA END');
if (start < 0 || end < 0) throw new Error('Markers not found in the game file.');
const out = html.slice(0, start) +
  '// MAP DATA START\n' +
  '// This block is written by plans/stand-clear-data/assemble.js. Do not edit it by hand.\n' +
  'const MAP_DATA = ' + json + ';\n' +
  html.slice(end);
fs.writeFileSync(gamePath, out);
console.log('packed', (json.length / 1024).toFixed(0), 'KB of subway data');
