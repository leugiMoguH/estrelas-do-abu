import type { Topic } from '../index';
import type { HgpTopicId } from './schema';
export const RECOVERY_TOPICS: readonly HgpTopicId[] = [];
const rows: [HgpTopicId, string, string, string, string][] = [
['hgp-seculo-xviii','Portugal no século XVIII','Descobre a sociedade e o poder no século XVIII.','👑','Teste escolar — capítulo 1 (págs. 20–40)'],
['hgp-liberalismo','O triunfo do liberalismo','Compreende a mudança para o liberalismo.','📜','O liberalismo e o século XIX'],
['hgp-xix-segunda-metade','Portugal na segunda metade do século XIX','Explora as mudanças do país.','🚂','O liberalismo e o século XIX'],
['hgp-republica','A revolução republicana','Descobre a implantação da República.','🏛️','Portugal no século XX'],
['hgp-ditadura','Os anos da ditadura','Compreende a vida durante a ditadura.','🕯️','Portugal no século XX'],
['hgp-25-abril','O 25 de Abril e a construção da democracia','Conhece a conquista da liberdade.','🌹','Portugal no século XX'],
['hgp-populacao','A população portuguesa','Observa como evolui a população.','👥','Portugal atual'],
['hgp-lugares','Os lugares onde vivemos','Explora o território português.','🗺️','Portugal atual'],
['hgp-atividades','As atividades económicas','Conhece o trabalho e a produção.','🌾','Portugal atual'],
['hgp-lazer','Como ocupamos os tempos livres','Descobre formas de lazer.','🎭','Portugal atual'],
['hgp-mundo','O mundo mais perto de nós','Explora as ligações ao mundo.','🌍','Portugal atual'],
];
export const hgpTopics: Topic[] = rows.map(([id,title,blurb,icon,group]) => ({id, title, blurb, icon, group, subject:'historia', competencyIds:[id], level:RECOVERY_TOPICS.includes(id)?'recuperacao5':'6', curriculumRef:`DGE — Aprendizagens Essenciais, HGP: ${title}`}));
