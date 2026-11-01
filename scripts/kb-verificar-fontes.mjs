// Verificação determinística da evidência: descarrega cada URL citada na ficha e confirma que a página
// contém os números e nomes da afirmação (sinal lexical, NÃO prova). Uso: node scripts/kb-verificar-fontes.mjs
// Saída: sinais lexicais e acessibilidade. Só a leitura contextual pode sustentar a afirmação.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const evidence = Object.assign({}, ...['xviii-evidencia', 'xviii-evidencia-extra', 'xviii-evidencia-atomos'].map(f => JSON.parse(readFileSync(`content/kb/historia/${f}.json`, 'utf8'))));
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/(\d)[.\s](\d{3})\b/g, '$1$2');

/** Números (≥3 algarismos) e nomes próprios (palavras maiúsculas a meio de frase) da afirmação. */
function tokens(text) {
  const nums = [...new Set((text.match(/\b\d{3,}\b/g) ?? []))];
  const names = [...new Set([...text.matchAll(/(?<=[a-zà-ú,;:)»] )([A-ZÀ-Ú][a-zà-úç]{3,})/g)].map((m) => norm(m[1])))];
  return { nums, names };
}

const tmp = mkdtempSync(join(tmpdir(), 'kb-'));
async function fetchText(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 30000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (verificacao de fontes educativas)', accept: 'text/html,application/pdf,*/*' } });
    if (!r.ok) return { estado: r.status === 403 || r.status === 401 ? 'bloqueada' : 'erro', http: r.status };
    const type = r.headers.get('content-type') ?? '';
    const buf = Buffer.from(await r.arrayBuffer());
    if (/pdf/i.test(type) || buf.subarray(0, 4).toString() === '%PDF') {
      const file = join(tmp, `${Math.abs(hash(url))}.pdf`);
      writeFileSync(file, buf);
      const py = spawnSync('python', ['-c', 'import sys,pypdf;r=pypdf.PdfReader(sys.argv[1]);print(" ".join((p.extract_text() or "") for p in r.pages[:60]))', file], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 90000, cwd: tmp });
      return py.status === 0 ? { estado: 'pdf', texto: py.stdout } : { estado: 'erro', http: 'pdf-ilegivel' };
    }
    const html = buf.toString('utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#?\w+;/g, ' ');
    return { estado: 'lida', texto: text };
  } catch (e) {
    return { estado: 'erro', http: String(e.name) };
  } finally { clearTimeout(t); }
}
function hash(s) { let h = 0; for (const c of s) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0; return h; }

const jobs = [];
for (const [f, ev] of Object.entries(evidence)) if (ev.status === 'confirmado') for (const s of ev.sources) jobs.push({ f, url: s.url });
const urls = [...new Set(jobs.map((j) => j.url))];
const pages = {};
let next = 0;
async function worker() {
  while (next < urls.length) {
    const url = urls[next++];
    let p = await fetchText(url);
    if (p.estado === 'erro' && p.http === 'TypeError') p = await fetchText(url);
    pages[url] = p;
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const out = {};
for (const url of urls) {
  const p = pages[url];
  out[url] = { estado: p.estado, ...(p.http ? { http: p.http } : {}), bytes: p.texto?.length ?? 0, em: {} };
}
for (const { f, url } of jobs) {
  const p = pages[url];
  if (!p.texto) continue;
  const page = norm(p.texto);
  const ch = evidence[f].chave;
  const { nums, names } = ch ? { nums: ch.filter((x) => /^\d+$/.test(x)), names: ch.filter((x) => !/^\d+$/.test(x)).map(norm) } : tokens(evidence[f].text);
  const nHit = nums.filter((n) => page.includes(n)).length;
  const mHit = names.filter((n) => page.includes(n)).length;
  const ok = (nums.length === 0 || nHit >= Math.ceil(nums.length * 0.6)) && (names.length === 0 || mHit >= Math.ceil(names.length * 0.5)) && nums.length + names.length > 0;
  const contextual = evidence[f].sources.some(s => s.url === url && s.atestado);
  out[url].em[f] = { numeros: `${nHit}/${nums.length}`, nomes: `${mHit}/${names.length}`, lexical: ok, ok: contextual };
}
writeFileSync('content/kb/historia/xviii-fontes-verificadas.json', JSON.stringify(out, null, 1) + '\n');
const estados = {};
for (const v of Object.values(out)) estados[v.estado] = (estados[v.estado] ?? 0) + 1;
console.log(urls.length, 'URLs', JSON.stringify(estados), '| pares F×URL ok:', Object.values(out).flatMap((v) => Object.values(v.em)).filter((x) => x.ok).length, '/', Object.values(out).flatMap((v) => Object.values(v.em)).length);
const report = Object.fromEntries(Object.entries(evidence).map(([id, ev]) => [id, {
  estado: ev.status === 'contradiz' ? 'erro factual confirmado' : ev.status !== 'confirmado' || ev.sources.filter(s => s.atestado).length < 2 ? 'evidência insuficiente' : ev.sources.every(s => !pages[s.url]?.texto) ? 'fonte inacessível' : ev.sources.some(s => s.atestado && !out[s.url]?.em[id]?.lexical) ? 'fonte válida que o verificador lexical não leu' : 'fonte válida com leitura contextual',
  erroOriginal: ev.originalVerdict === 'contradiz', corrigido: !!ev.correction,
  contextual: ev.sources.filter(s => s.atestado).length,
  fontes: ev.sources.map(s => ({ url: s.url, acesso: pages[s.url]?.estado ?? 'não consultada', leitura: !!s.atestado, lexical: out[s.url]?.em[id]?.lexical ?? false })),
}]));
writeFileSync('docs/hgp/fabrica/verificacao-fontes.json', JSON.stringify(report, null, 2) + '\n');
