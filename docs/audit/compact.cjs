const items=require('./items.json'),lessons=require('./lessons.json');
const t=process.argv[2];
if(t==='L'){for(const l of lessons){console.log('## LIÇÃO',l.topic);console.log(l.explanation.join('\n'));for(const e of l.examples)console.log('EX',e.title,'|',e.steps.join(' / '));console.log('CHK',l.checklist.join(' | '));console.log('ERR',l.commonErrors.join(' | '));console.log('SRC',l.sources.join(','));}}
else for(const i of items.filter(x=>x.topic===t)){
 let s=`[${i.id}] ${i.kind} d${i.difficulty} ${i.skill} (${i.sub})\nQ: ${i.stimulus?'«'+i.stimulus+'» ':''}${i.prompt}${i.figure?' FIG:'+JSON.stringify(i.figure):''}\n`;
 if(i.kind==='mcq')s+=`OK: ${i.correct}\n`+Object.entries(i.wrong).map(([k,v])=>`  x ${k} -> ${v}`).join('\n')+'\n';
 else if(i.kind==='order')s+=`ORDEM: ${i.correct.join(' > ')}\n`;
 else if(i.kind==='numeric')s+=`NUM: ${i.correct} ${JSON.stringify(i.wrongHints||'')}\n`;
 else s+=`CLOZE: ${JSON.stringify(i.correct)}\n`;
 s+=`H: ${i.hints.join(' / ')}\nE: ${i.explanation}\nS: ${i.sources.join(',')}\n`;console.log(s);}
