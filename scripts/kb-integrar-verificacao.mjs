// Integra leituras contextuais anteriores; não transforma um match lexical em prova.
import { readFileSync, writeFileSync } from 'node:fs';
const out = {};
for (const n of [1, 2, 3]) {
  const path = `docs/hgp/fabrica/verif/resposta-${n}.json`;
  for (const r of JSON.parse(readFileSync(path, 'utf8'))) {
    if (out[`A:${r.atom}`]) throw new Error(`Átomo repetido: ${r.atom}`);
    out[`A:${r.atom}`] = {
      status: r.veredicto === 'confirma' ? 'confirmado' : r.veredicto === 'contradiz' ? 'contradiz' : 'insuficiente',
      text: r.qualificacoes, review: path, originalVerdict: r.veredicto,
      sources: r.fontes.map(s => ({ title: s.titulo, url: s.url, kind: s.tipo,
        reading: s.leitura, excerpt: s.excerto,
        // SciELO aloja revistas e obras diferentes; não é uma única autoria.
        ...(/scielo\.br/.test(s.url) ? { group: new URL(s.url).pathname.split('/').slice(0, 4).join('/') } : {}),
        ...(s.leitura === 'lida' && s.excerto ? { atestado: `${path}#${r.atom}: ${s.excerto}` } : {}) })),
    };
  }
}
// Autoverificação da aplicação das correções explícitas propostas nos relatórios.
// O veredicto original permanece, para não apresentar a correção como nova auditoria independente.
for (const id of ['od-mafra', 'so-limpeza', 'mj-biblioteca-fim', 'bp-estilo', 'pl-vrsa']) {
  out[`A:${id}`].status = 'confirmado';
  out[`A:${id}`].correction = 'Aplicada a redação restrita proposta na revisão; autoverificação, 2026-11-01. Ver xviii.atoms.ts.';
}
writeFileSync('content/kb/historia/xviii-evidencia-atomos.json', JSON.stringify(out, null, 2) + '\n');
console.log(Object.keys(out).length, 'revisões contextuais integradas (antes das correções).');
