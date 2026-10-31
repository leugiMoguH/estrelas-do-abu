// Extrai da ficha factual (docs/hgp/seculo-xviii-factos.md) o estado e as fontes de cada facto Fn.
// Uso: node scripts/kb-evidencia.mjs  → content/kb/historia/xviii-evidencia.json
import { readFileSync, writeFileSync } from 'node:fs';

const lines = readFileSync('docs/hgp/seculo-xviii-factos.md', 'utf8').split('\n');
const out = {};
for (const line of lines) {
  const m = line.match(/^- \*\*(F\d+)\.\*\* (.*)$/);
  if (!m) continue;
  const body = m[2];
  const status = /CONFIRMADO/.test(body) ? 'confirmado' : /PARCIAL/.test(body) ? 'parcial' : /DISCUTIDO/.test(body) ? 'discutido' : 'desconhecido';
  const idx = body.search(/ Fontes?:/);
  const text = (idx < 0 ? body : body.slice(0, idx)).replace(/\*\*/g, '').trim();
  const sources = [...body.matchAll(/\[([^\]]+)\]\((https?:[^)]+)\)/g)].map((s) => ({ title: s[1], url: s[2] }));
  out[m[1]] = { status, text, sources };
}
// «Fontes: as duas de F34» / «as de F73»: herdam as fontes do facto referido.
for (const line of lines) {
  const m = line.match(/^- \*\*(F\d+)\.\*\*.*Fontes?: (as duas primeiras|as duas|as) de (F\d+)/);
  if (!m || !out[m[1]] || !out[m[3]]) continue;
  const inherited = out[m[3]].sources.slice(0, m[2] === 'as' ? 99 : 2);
  const known = new Set(out[m[1]].sources.map((s) => s.url));
  out[m[1]].sources = [...out[m[1]].sources, ...inherited.filter((s) => !known.has(s.url))];
}
writeFileSync('content/kb/historia/xviii-evidencia.json', JSON.stringify(out, null, 1) + '\n');
console.log(Object.keys(out).length, 'factos;', Object.values(out).filter((f) => f.status === 'confirmado').length, 'confirmados');
