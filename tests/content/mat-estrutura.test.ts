import { expect, it } from 'vitest';
import { gamePack, TOPICS } from '../../content';
import { MAT_SECTIONS, MAT_TEMPLATE_SECTION, matSectionInfo } from '../../content/matematica/estrutura';
import { availability, sectionModeAllowed } from '../../content/estrutura';
import { instantiate, materialize, correctAnswerOf } from '../../src/core/content';
import { seededRng, buildSession } from '../../src/core/session';
import { filterSections, collectionSelection } from '../../src/app/section-selection';
import { defaultSave, importSave, recordAttempt } from '../../src/core/save';
import { emptyMastery } from '../../src/core/mastery';
it('mapeia os 70 templates registados exatamente uma vez, sem destinos desconhecidos', () => {
 const templates = gamePack.templates.filter(t => t.competencyId.startsWith('mat-'));
 expect(templates).toHaveLength(70);
 expect(TOPICS.filter(t=>t.subject==='matematica').every(t=>t.level==='6')).toBe(true);
 expect(Object.keys(MAT_TEMPLATE_SECTION).sort()).toEqual(templates.map(t => t.id).sort());
 for(const t of templates) {
  const section = MAT_SECTIONS.find(s => s.id === MAT_TEMPLATE_SECTION[t.id]);
  expect(section?.competencyIds).toContain(t.competencyId);
 }
});
for(const mode of ['study','test','review'] as const) it(`isola cada subcapítulo em ${mode}`, () => {
 const ids=gamePack.competencies.filter(c=>c.id.startsWith('mat-')).map(c=>c.id);
 const pool=materialize(gamePack,{competencyIds:ids,rng:seededRng(42),perTemplate:24,difficultyFor:()=>1});
 for(const section of MAT_SECTIONS.filter(s=>matSectionInfo(s.id).status==='exercicios')) {
  const session=buildSession({mode,pool:filterSections(pool,'matematica',[section.id]),competencyIds:ids,n:3,state:{},rng:seededRng(9),now:0});
  expect(session.exercises.length).toBeGreaterThan(0);
  expect(session.exercises.every(e=>MAT_TEMPLATE_SECTION[e.ref!.templateId]===section.id)).toBe(true);
 }
});
it('deriva preparação e lição sem herdar lições amplas',()=>{
 expect(availability(0,true)).toBe('licao');
 expect(sectionModeAllowed('licao','study')).toBe(true);
 expect(sectionModeAllowed('licao','test')).toBe(false);
 expect(sectionModeAllowed('licao','review')).toBe(false);
 expect(sectionModeAllowed('preparacao','study')).toBe(false);
 expect(matSectionInfo('mat-sec-calculo-mental').status).toBe('preparacao');
 expect(matSectionInfo('mat-sec-construcao-rotacao').functional).toBe(false);
});
it('coleções distinguem subcapítulos da mesma competência e normalizam a ordem',()=>{
 const context={competencyIds:['mat-primos'],sectionIds:['mat-sec-primos']};
 expect(collectionSelection('matematica',['mat-primos'],context)).not.toBe(collectionSelection('matematica',['mat-primos'],{...context,sectionIds:['mat-sec-mmc-mdc']}));
 expect(collectionSelection('matematica',[],{...context,sectionIds:['b','a','b']})).toBe(collectionSelection('matematica',[],{...context,sectionIds:['a','b']}));
});
it('carrega progresso antigo e reconstitui histórico e erros sem mudar referências',()=>{
 const ref={packId:'estrelas',packVersion:'1.0.0',templateId:'frac-soma',seed:42,difficulty:1 as const};
 const ex=instantiate(gamePack,ref);
 const before=recordAttempt({...defaultSave(),mastery:{'mat-racionais':{...emptyMastery(),attempts:7,correct:5,hintsUsed:1,lastSeen:90,recent:[true,false,true,true,true],recentHints:[0,1,0,0,0]}}},ex,correctAnswerOf(ex),false,100);
 const loaded=importSave(JSON.stringify(before));
 expect(loaded.ok).toBe(true);
 if(!loaded.ok) return;
 expect(loaded.save.mastery).toEqual(before.mastery);
 for(const entry of [...loaded.save.seen,...loaded.save.mistakes]) expect(instantiate(gamePack,entry.ref)).toEqual(ex);
});
