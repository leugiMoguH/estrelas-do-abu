// Gera docs/audit/*.md e auditoria-itens.json a partir dos dados reais (items.json, lessons.json, matriz-curricular.json).
// Uso: npx tsx docs/audit/dump.ts && node docs/audit/build-audit.cjs
const fs = require('fs');
const items = require('./items.json');
const lessons = require('./lessons.json');
const sources = require('./sources.json');
const matriz = require('./matriz-curricular.json');

const SHORT = { xviii: 'hgp-seculo-xviii', liberalismo: 'hgp-liberalismo', 'xix-segunda-metade': 'hgp-xix-segunda-metade', republica: 'hgp-republica', ditadura: 'hgp-ditadura', '25-abril': 'hgp-25-abril', populacao: 'hgp-populacao', lugares: 'hgp-lugares', atividades: 'hgp-atividades', lazer: 'hgp-lazer', mundo: 'hgp-mundo' };
const idOf = (ref) => { const [t, n] = ref.split(':'); return `${SHORT[t]}-${String(n).padStart(2, '0')}`; };
const byId = new Map(items.map((i) => [i.id, i]));

// ---- Matriz
const missing = [];
const rows = matriz.descritores.map((d) => {
  const ids = d.i.map(idOf);
  ids.forEach((id) => { if (!byId.has(id)) missing.push(`${d.id}:${id}`); });
  return { ...d, itens: ids };
});
if (missing.length) { console.error('IDs inexistentes na matriz:', missing); process.exit(1); }
const NAME = { C: 'Coberto', P: 'Parcialmente coberto', N: 'Não coberto', AC: 'A confirmar' };
const count = (list) => Object.fromEntries(['C', 'P', 'N', 'AC'].map((k) => [k, list.filter((r) => r.e === k).length]));
const all = count(rows), noTic = count(rows.filter((r) => !r.tic));
const pct = (n, d) => (100 * n / d).toFixed(1).replace('.', ',') + '%';
const nAll = rows.length, nNoTic = rows.filter((r) => !r.tic).length;
const nAssessable = nNoTic - noTic.AC;
const topicOf = (r) => SHORT[r.t];
const perTopic = Object.values(SHORT).map((t) => {
  const r = rows.filter((x) => topicOf(x) === t);
  return { tema: t, ...count(r), total: r.length, itens: items.filter((i) => i.topic === t).length };
});
const itemsInMatrix = new Set(rows.flatMap((r) => r.itens));
const orfaos = items.filter((i) => !itemsInMatrix.has(i.id)).map((i) => i.id);

let md = `# Matriz curricular — HGP 6.º ano (Estrelas do Abu)\n\nGerada por docs/audit/build-audit.cjs a partir de matriz-curricular.json e dos bancos reais. Data: 2026-10-31.\n\n## Referencial\n- **Vigente:** ${matriz.referencial.vigente}\n- **Proposta (não vigente):** ${matriz.referencial.proposta}\n- **Acesso e limite:** ${matriz.referencial.acesso}\n- **Manual:** ${matriz.referencial.manual}\n\n## Critérios\n${Object.entries(matriz.criterios).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}\n\n## Resultado\nDenominador A = ${nAll} descritores transcritos. Denominador B = ${nNoTic} (exclui ${nAll - nNoTic} descritores TIC/TIG). Denominador C = ${nAssessable} (B sem os ${noTic.AC} «A confirmar»).\n\n| Estado | A (${nAll}) | B (${nNoTic}) | C (${nAssessable}) |\n|---|---|---|---|\n`;
for (const k of ['C', 'P', 'N', 'AC']) md += `| ${NAME[k]} | ${all[k]} (${pct(all[k], nAll)}) | ${noTic[k]} (${pct(noTic[k], nNoTic)}) | ${k === 'AC' ? '—' : `${noTic[k]} (${pct(noTic[k], nAssessable)})`} |\n`;
md += `\nPor tema:\n\n| Tema | Itens | Coberto | Parcial | Não coberto | A confirmar | Descritores |\n|---|---|---|---|---|---|---|\n${perTopic.map((p) => `| ${p.tema} | ${p.itens} | ${p.C} | ${p.P} | ${p.N} | ${p.AC} | ${p.total} |`).join('\n')}\n\nItens que não ligam a nenhum descritor (competência transversal ou enriquecimento): ${orfaos.length} — ${orfaos.join(', ') || '—'}\n\n## Matriz\n\n| Descritor | Texto | Estado | Itens | Lição | Nota |\n|---|---|---|---|---|---|\n`;
for (const r of rows) md += `| ${r.id} | ${r.d} | ${NAME[r.e]}${r.tic ? ' (TIC/TIG)' : ''} | ${r.itens.join(', ') || '—'} | ${lessons.some((l) => l.topic === SHORT[r.t]) ? SHORT[r.t] : '—'} | ${r.n || ''} |\n`;
fs.writeFileSync(__dirname + '/matriz-curricular.md', md);
fs.writeFileSync(__dirname + '/matriz-curricular.resultado.json', JSON.stringify({ all, noTic, nAll, nNoTic, nAssessable, perTopic, orfaos }, null, 1));

// ---- Auditoria por item
const CORRIGIDOS = {
  'hgp-liberalismo-03': 'Opção «apoiantes do rei D. Pedro» imprecisa (D. Pedro não era rei de Portugal em 1832): reescrita.',
  'hgp-liberalismo-06': 'Excerto atribuído ao «Manifesto aos Portugueses» não foi confirmado em nenhuma fonte: substituído pelo art. 26.º da Constituição de 1822 (texto confirmado).',
  'hgp-xix-segunda-metade-12': '«Pioneiro» afirmado sem fonte primária: passou a «um dos primeiros países da Europa».',
  'hgp-populacao-01': 'Gralha na pista («IMigrante»).',
  'hgp-populacao-10': 'Afirmação «todos os concelhos de Bragança perderam população» sem fonte: reduzida ao que está apoiado (o distrito perdeu população).',
  'hgp-lugares-01': 'Explicação confundia êxodo rural com emigração: corrigida (e na lição).',
  'hgp-lugares-06': 'Marcadores ordinais («Primeiro», «Por fim»…) revelavam a ordem: removidos.',
  'hgp-lugares-08': 'Resposta lida diretamente no enunciado: passou a exigir um cálculo (diferença de percentagens).',
  'hgp-atividades-06': 'Afirmação «desde 1991 o terciário tem mais de metade» sem fonte: retirada.',
  'hgp-atividades-09': 'Percentagens atribuídas aos Censos 2021 não confirmadas: substituídas por dados confirmados (INE/GPP, 4.º trimestre de 2025: 2%, 24%, 74%).',
  'hgp-lazer-08': 'Estratégia Turismo 2027 apresentada como atual: acrescentada a nota da Estratégia Turismo 2035.',
  'hgp-mundo-07': 'Segundo espaço do cloze ambíguo e artificial: reformulado com um só espaço.',
  'hgp-mundo-10': 'Quota de Sines (56%) incoerente com o total (47 de 88 milhões de t, ≈53%) e restantes quotas por confirmar: substituída por cálculo com valores confirmados.',
};
const V1 = new Set(['hgp-populacao-02', 'hgp-populacao-05', 'hgp-lugares-03', 'hgp-lugares-09', 'hgp-lugares-10', 'hgp-mundo-02', 'hgp-mundo-05', 'hgp-mundo-10', 'hgp-lazer-08', 'hgp-liberalismo-06', 'hgp-atividades-04', 'hgp-atividades-09', 'hgp-xix-segunda-metade-13', 'hgp-xix-segunda-metade-14', 'hgp-republica-13', 'hgp-republica-14', 'hgp-ditadura-13', 'hgp-lazer-14']);
const ACONF = {
  'hgp-lugares-04': 'Variação +1,7% da AML (Censos 2021) por confirmar em tabela do INE.',
  'hgp-lugares-08': 'Usa os +1,7% da AML, por confirmar em tabela do INE.',
  'hgp-lazer-06': 'Cortes de água para o golfe em 2023: fonte jornalística; confirmar em documento oficial.',
  'hgp-lazer-07': 'Idem (cadeia causal baseada nos cortes de 2023).',
  'hgp-lazer-12': 'Idem (afirmação sobre os cortes de 2023).',
  'hgp-atividades-05': 'Comparação com 1960 sem fonte consultada nesta auditoria.',
  'hgp-atividades-07': 'Setor com mais trabalhadores em 1960 (primário): confirmar em série do INE/PORDATA.',
  'hgp-xix-segunda-metade-06': 'Citação atribuída a Ana Silvia Volpi Scott (2002): confirmar na fonte (REBEP).',
};
const NOVOS = new Set(items.filter((i) => /-(13|14|15)$/.test(i.id) && i.sources.some((s) => /^(const1822|aljube|uporto|infopedia|analise-social|marinha|mec-liceus|unesco)/.test(s)) || ['hgp-seculo-xviii-13', 'hgp-seculo-xviii-14', 'hgp-liberalismo-13', 'hgp-liberalismo-14', 'hgp-25-abril-13', 'hgp-25-abril-14', 'hgp-populacao-13', 'hgp-populacao-14', 'hgp-populacao-15', 'hgp-lugares-13', 'hgp-lazer-13', 'hgp-mundo-13', 'hgp-mundo-14', 'hgp-xix-segunda-metade-13', 'hgp-xix-segunda-metade-14', 'hgp-republica-13', 'hgp-republica-14', 'hgp-ditadura-13', 'hgp-lazer-14'].includes(i.id)).map((i) => i.id));
const opiniao = new Set(items.filter((i) => i.skill === 'opiniao').map((i) => i.id));
const audit = items.map((i) => {
  const problemas = [];
  if (CORRIGIDOS[i.id]) problemas.push(CORRIGIDOS[i.id]);
  if (ACONF[i.id]) problemas.push(ACONF[i.id]);
  const flags = [];
  if (i.kind === 'mcq' && i.options.length < 4) flags.push('so-3-opcoes');
  if (opiniao.has(i.id)) flags.push('tarefa-facto-vs-opiniao (modelo repetido em 11 temas; resposta identificável pelo adjetivo)');
  const estado = ACONF[i.id] ? 'a-confirmar' : CORRIGIDOS[i.id] ? 'corrigido' : NOVOS.has(i.id) ? 'novo' : 'ok';
  const verificacao = V1.has(i.id) ? 'fonte-consultada-nesta-auditoria' : ACONF[i.id] ? 'por-confirmar' : 'conhecimento-do-revisor+coerencia-interna (fonte do banco não reaberta)';
  const fonteNova = i.sources.filter((s) => /^(const1822|aljube|uporto|infopedia|analise-social|marinha|mec-liceus|unesco)/.test(s));
  return { id: i.id, tema: i.topic, formato: i.kind, estado, verificacao, problemas, sinalizacoes: flags, fontesRegistadas: i.sources.length, fontesNovasConsultadasPorPesquisa: fonteNova };
});
fs.writeFileSync(__dirname + '/auditoria-itens.json', JSON.stringify(audit, null, 1));
const tally = (key) => audit.reduce((m, a) => ((m[a[key]] = (m[a[key]] || 0) + 1), m), {});
const est = tally('estado'), ver = tally('verificacao');
const exemplos = audit.filter((a) => a.problemas.length).map((a) => `- ${a.id} [${a.estado}]: ${a.problemas.join(' ')}`).join('\n');
const licoes = lessons.map((l) => {
  const alvo = items.filter((i) => i.topic === l.topic);
  const texto = (l.explanation.join(' ') + ' ' + l.examples.map((e) => e.title + ' ' + e.steps.join(' ')).join(' ') + ' ' + l.checklist.join(' ') + ' ' + l.commonErrors.join(' ')).toLowerCase();
  const tokens = (it) => {
    const alvoTxt = it.kind === 'mcq' ? it.correct : it.kind === 'order' ? it.correct.join(' ') : it.kind === 'numeric' ? String(it.correct) : it.correct.map((a) => a[0]).join(' ');
    return [...new Set(alvoTxt.toLowerCase().match(/[a-zà-ú0-9]{4,}/g) || [])];
  };
  const ensinados = alvo.filter((it) => { const t = tokens(it); if (!t.length) return false; const hit = t.filter((w) => texto.includes(w.replace(/^0+/, ''))).length; return hit / t.length >= 0.5; });
  return { topic: l.topic, itens: alvo.length, comResposta: ensinados.length, pct: pct(ensinados.length, alvo.length), semResposta: alvo.filter((it) => !ensinados.includes(it)).map((it) => it.id) };
});
fs.writeFileSync(__dirname + '/licoes-vs-itens.json', JSON.stringify(licoes, null, 1));
const mcq = items.filter((i) => i.kind === 'mcq');
const longest = mcq.filter((i) => i.correct.length > Math.max(...i.options.filter((o) => o !== i.correct).map((o) => o.length))).length;
const skills = tally2(items.map((i) => i.skill));
function tally2(a) { return a.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {}); }
const fmts = tally2(items.map((i) => i.kind));
const dif = tally2(items.map((i) => i.difficulty));
const rep = `# Relatório de qualidade pedagógica — HGP 6.º ano\n\nGerado por docs/audit/build-audit.cjs a partir dos dados reais. Data: 2026-10-31. Revisão independente do Codex: NÃO ocorreu (as chamadas ao Codex foram bloqueadas pelo classificador de permissões); a auditoria foi feita só por Claude. Conteúdo não certificado por professor nem por organismo oficial.\n\n## Contagens\n- Itens: ${items.length} (132 originais + ${NOVOS.size} novos). Lições: ${lessons.length}. Fontes registadas: ${sources.length}.\n- Itens lidos integralmente (enunciado, opção correta, todas as opções erradas, pistas, explicação, figura, fonte): ${items.length} de ${items.length}. Lições lidas: ${lessons.length} de ${lessons.length}.\n- Estado: ${Object.entries(est).map(([k, v]) => `${k} ${v}`).join(', ')}.\n- Itens com problema comprovado e corrigido: ${Object.keys(CORRIGIDOS).length} dos 132 originais (${pct(Object.keys(CORRIGIDOS).length, 132)}). Itens retirados: 0. Itens a confirmar mantidos: ${Object.keys(ACONF).length}.\n- Verificação: ${Object.entries(ver).map(([k, v]) => `${k}: ${v}`).join('; ')}.\n- Fontes por pesquisa nesta auditoria: INE (comércio externo 2024, Censos 2021), Governo/AMT (portos 2024), INE/ANA (aeroportos 2024), Turismo de Portugal (ET27), Museu do Aljube, U.Porto, UNESCO, Marinha, Min. Educação (liceus). Muitas foram lidas só nos resumos devolvidos pela pesquisa, sem abrir o documento primário.\n\n## Cobertura curricular\nVer matriz-curricular.md. Descritores transcritos: ${nAll}. Coberto ${all.C} (${pct(all.C, nAll)} de ${nAll}; ${pct(noTic.C, nNoTic)} de ${nNoTic} sem TIC/TIG; ${pct(noTic.C, nAssessable)} de ${nAssessable} sem TIC/TIG nem «A confirmar»). Parcialmente coberto ${all.P}, Não coberto ${all.N} (${all.N - (nAll - nNoTic)} sem TIC/TIG), A confirmar ${all.AC}.\nPrincipais lacunas (Não coberto): ${rows.filter((r) => r.e === 'N' && !r.tic).map((r) => `${r.id} (${r.d.slice(0, 60)}…)`).join('; ')}.\n\n## Variedade dos exercícios\n- Formatos: ${JSON.stringify(fmts)}. Competências: ${JSON.stringify(skills)}. Dificuldade 1/2/3: ${JSON.stringify(dif)}.\n- Escolha múltipla com 3 opções (33% de acerto ao acaso): ${mcq.filter((i) => i.options.length === 3).length} de ${mcq.length}.\n- Escolha múltipla em que a opção correta é a mais longa: ${longest} de ${mcq.length} (${pct(longest, mcq.length)}): enviesamento ligeiro.\n- Tarefa «facto vs opinião»: ${opiniao.size} itens (${pct(opiniao.size, items.length)}), um modelo igual em cada tema; a resposta identifica-se pelo adjetivo (melhor, bonito…), sem exigir conhecimento do tema.\n- Datas e cronologia: ${items.filter((i) => i.skill === 'cronologia').length} itens de cronologia; várias datas repetem-se em escolha múltipla, ordenação e numérico (ex.: 1856, 1910, 1961, 1986).\n- Parque Nacional da Peneda-Gerês aparece em 4 itens (lazer-03, -05, -10, -11).\n\n## Lições vs itens (proxy automático)\nProxy: fração de itens cuja resposta correta tem ≥50% das palavras-chave presentes no texto da lição do tema. É ruidoso (não reconhece itens de cálculo nem de raciocínio) e não prova que a lição ensine.\n${licoes.map((l) => `- ${l.topic}: ${l.comResposta}/${l.itens} (${l.pct}); sem resposta na lição: ${l.semResposta.join(', ') || '—'}`).join('\n')}\n\n## Testes e modos\n- Seleção de itens: classificação por dificuldade-alvo, penalização de repetição e de competência já escolhida (distribui pelos temas); não estratifica por competência (descritor), por isso um teste de 3–8 perguntas não avalia todos os temas escolhidos.\n- Nota: média dos créditos × 20; com 3 ou 5 perguntas cada resposta vale 6,7 ou 4 pontos. «Dominada» resulta de ≥80% numa competência, mesmo com 1 pergunta.\n- Teste sem pistas confirmado no código; explicação só no fim.\n- Todos os itens têm review='approved' no motor (condição para serem servidos); isto não significa revisão por docente.\n\n## Itens corrigidos / a confirmar\n${exemplos}\n\n## Riscos por resolver\n- Descritores transcritos de planificação escolar (PDF oficial da DGE inacessível); 3 descritores por confirmar.\n- Itens e lições nunca revistos por docente; dados estatísticos dependem de fontes por reabrir.\n- Sem revisão independente por Codex.\n- Conteúdo adicional do manual (se o manual tiver temas além das AE) não foi comparado com o manual.\n`;
fs.writeFileSync(__dirname + '/relatorio-qualidade.md', rep);
fs.writeFileSync(__dirname + '/auditoria-itens.md', `# Auditoria por item\n\nEstados: ${JSON.stringify(est)}\nVerificação: ${JSON.stringify(ver)}\n\n${exemplos}\n\nLista completa em auditoria-itens.json (151 linhas).\n`);
console.log(JSON.stringify({ all, noTic, nAll, nNoTic, nAssessable, est, ver, orfaos: orfaos.length, longest, mcq: mcq.length, trio: mcq.filter((i) => i.options.length === 3).length, licoes: licoes.map((l) => `${l.topic} ${l.pct}`) }, null, 1));
