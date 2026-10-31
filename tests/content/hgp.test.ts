import type { HgpItem } from '../../content/historia/schema';
import { describe, it, expect } from 'vitest';
import { hgpBanks, hgpItems, hgpTemplates, hgpTemplate, HGP_SOURCES, hgpLessons } from '../../content/historia';
import { hgpTopics } from '../../content/historia/topics';
import { PT_MAP } from '../../content/historia/pt-map';
import { grade, normalize } from '../../src/core/grading';
import { correctAnswerOf, materialize } from '../../src/core/content';
import { gamePack } from '../../content';
import { validateLessons } from '../../content/tutor';
import { ptMapSvg } from '../../src/app/figure';
const groups = [['hgp-seculo-xviii','hgp-liberalismo','hgp-xix-segunda-metade'],['hgp-republica','hgp-ditadura','hgp-25-abril'],['hgp-populacao','hgp-lugares','hgp-atividades'],['hgp-lazer','hgp-mundo']];
describe('banco HGP',()=>{
 it('valida cobertura dos bancos presentes e lista os ausentes',()=>{
  groups.forEach((topics,i)=>{
   const file=`./bank-${'abcd'[i]}.ts`;
   if(!hgpBanks[file]) {console.warn(`Banco ausente: ${file}; temas: ${topics.join(', ')}`);return;}
   for(const topic of topics) expect(hgpItems.filter(x=>x.topic===topic).length,topic).toBeGreaterThanOrEqual(8);
  });
  expect(validateLessons(hgpLessons,gamePack.competencies)).toEqual([]);
  expect(new Set(hgpItems.map(x=>x.id)).size).toBe(hgpItems.length);
  const prompts=new Map<string,string>();const duplicates: string[]=[];
  for(const item of hgpItems){const key=normalize(item.prompt);if(prompts.has(key))duplicates.push(`${prompts.get(key)} / ${item.id}`);else prompts.set(key,item.id);}
  expect(duplicates,'Enunciados repetidos após normalize').toEqual([]);
 });
 it.each(hgpItems)('valida estrutura, fontes, determinismo e correção: $id',(item)=>{
   expect(hgpTopics.some(t=>t.id===item.topic)).toBe(true);
   expect(hgpLessons.some(l=>l.id===item.topic),`Lição: ${item.topic}`).toBe(true);
   expect([1,2,3]).toContain(item.difficulty);expect(item.hints.length).toBeGreaterThanOrEqual(2);
   expect(item.hints.every(h=>h.trim())).toBe(true);expect(item.explanation.trim()).not.toBe('');
   expect(item.sources.length).toBeGreaterThanOrEqual(1);
   item.sources.forEach(id=>expect(HGP_SOURCES.some(s=>s.id===id),id).toBe(true));
   item.figure?.highlight.forEach(id=>expect(Object.keys(PT_MAP)).toContain(id));
   const template=hgpTemplates.find(t=>t.id===item.id)!;const ex=template.generate(42,item.difficulty);
   expect(ex).toEqual(template.generate(42,item.difficulty));expect(grade(ex,correctAnswerOf(ex))).toMatchObject({correct:true});
   if(item.kind==='mcq'){
    expect(new Set(item.options.map(x=>normalize(x))).size).toBe(item.options.length);expect(item.options).toContain(item.correct);
    expect(Object.keys(item.wrong).sort()).toEqual(item.options.filter(o=>o!==item.correct).sort());
    for(const [value,feedback] of Object.entries(item.wrong)) {expect(feedback.trim()).not.toBe('');expect(grade(ex,{kind:'mcq',value})).toMatchObject({correct:false,feedback});}
   } else if(item.kind==='order'){
    expect(new Set(item.items).size).toBe(item.items.length);expect([...item.items].sort()).toEqual([...item.correct].sort());
   } else if(item.kind==='numeric') {expect(Number.isFinite(item.correct),`${item.id}: numeric deve ser finito (${item.correct})`).toBe(true);for(const [value,feedback] of Object.entries(item.wrongHints ?? {}))expect(grade(ex,{kind:'numeric',value})).toMatchObject({correct:false,feedback});}
   else {expect(item.correct.length).toBeGreaterThan(0);expect(item.correct.every(a=>a.length && a.every(x=>x.trim()))).toBe(true);}
 });
 it('embaralha cópias e materializa apenas uma instância',()=>{
  const item={id:'fixture',topic:'hgp-lugares' as const,sub:'distrito',skill:'mapa' as const,difficulty:1 as const,prompt:'Localiza a região.',hints:['Observa.','Compara.'],explanation:'Exemplo técnico.',sources:['fixture'],kind:'mcq' as const,options:['A','B','C'],correct:'B',wrong:{A:'Erro A',C:'Erro C'}};
  const t=hgpTemplate(item);const before=JSON.stringify(item);
  const orders=new Set(Array.from({length:20},(_,s)=>JSON.stringify(t.generate(s,1))));expect(orders.size).toBeGreaterThan(1);expect(JSON.stringify(item)).toBe(before);
  expect(materialize({...gamePack,templates:[t]},{competencyIds:[item.topic],rng:()=>0.5,perTemplate:4,difficultyFor:()=>1})).toHaveLength(1);
  const fixtures: HgpItem[] = [
   {...item,kind:'order',items:['A','B','C'],correct:['A','B','C']},
   {...item,kind:'numeric',correct:1974,wrongHints:{'1975':'Confere o ano.'}},
   {...item,kind:'cloze',correct:[['Portugal'],['Lisboa','lisboa']]},
  ];
  for(const fixed of fixtures){const template=hgpTemplate(fixed);const ex=template.generate(42,1);expect(ex).toEqual(template.generate(42,1));expect(grade(ex,correctAnswerOf(ex))).toMatchObject({correct:true});}
  const svg=ptMapSvg(['faro','<script>']);expect(svg).toContain('stroke-dasharray');expect(svg).not.toContain('<script>');expect(svg).not.toContain('aria-label="Faro');
 });
});
