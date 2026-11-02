import { avatarD } from '../src/art/d/compose';
import { defaultAvatar, resolveAvatarCompatibility } from '../src/art/catalog';
import { SKIN_TONES, type AvatarConfig } from '../src/art/palette';
import '../src/styles/art.css';

const cases: Partial<AvatarConfig>[] = [
 {hairStyle:'hair-franja',top:'top-azul',bottom:'bottom-calcoes',shoes:'shoes-chuva',accessory:'acc-colar'},
 {hairStyle:'hair-comprido',top:'top-coral',bottom:'bottom-saia',shoes:'shoes-botas',hat:'hat-sol',accessory:'acc-bandolete'},
 {hairStyle:'hair-cachos',top:'top-estrelas',bottom:'bottom-xadrez',shoes:'shoes-vermelhas',hat:'acc-auscultadores',accessory:'acc-fita'},
 {hairStyle:'hair-coque',top:'top-hoodie',bottom:'bottom-verdes',shoes:'shoes-chuva',outer:'outer-gabardina',hat:'hat-pompom',accessory:'acc-bandolete'},
 {hairStyle:'hair-trancas',top:'top-jaqueta',bottom:'bottom-calcoes',shoes:'shoes-botas',hat:'acc-gorro',accessory:'acc-fita'},
 {hairStyle:'hair-rabo',top:'top-listras',bottom:'bottom-calcas',shoes:'shoes-brancas',outer:'outer-gabardina',glasses:'acc-oculos'},
 {hairStyle:'hair-franja',top:'top-verde',bottom:'bottom-saia',shoes:'shoes-vermelhas',accessory:'acc-laco'},
 {hairStyle:'hair-comprido',top:'top-jaqueta',bottom:'bottom-verdes',shoes:'shoes-chuva',outer:'outer-gabardina',hat:'acc-coroa',backpack:'backpack-rosa'},
 {hairStyle:'hair-franja',top:'top-hoodie',bottom:'bottom-xadrez',outer:'outer-gabardina',shoes:'shoes-botas',hat:'hat-sol',accessory:'acc-fita'},
 {hairStyle:'hair-cachos',top:'top-verde',bottom:'bottom-calcoes',shoes:'shoes-brancas',hat:'acc-coroa',accessory:'acc-bandolete'},
 {hairStyle:'hair-comprido',top:'top-listras',bottom:'bottom-saia',outer:'outer-gabardina',shoes:'shoes-chuva'},
 {hairStyle:'hair-rapado',top:'top-estrelas',bottom:'bottom-calcas',shoes:'shoes-botas',glasses:'acc-sol',accessory:'acc-colar'},
 {hairStyle:'hair-trancas',top:'top-coral',bottom:'bottom-verdes',outer:'outer-gabardina',hat:'acc-auscultadores'},
 {hairStyle:'hair-coque',top:'top-jaqueta',bottom:'bottom-xadrez',shoes:'shoes-vermelhas',hat:'hat-sol',accessory:'acc-bandolete'},
 {hairStyle:'hair-franja',top:'top-azul',bottom:'bottom-calcas',shoes:'shoes-brancas',glasses:'acc-oculos-estrela'},
 {hairStyle:'hair-comprido',top:'top-hoodie',bottom:'bottom-calcoes',shoes:'shoes-botas',accessory:'acc-fita'},
];
for (const [i, changes] of cases.entries()) {
 const c = {...defaultAvatar(),...changes,skin:SKIN_TONES[i%8]!.id};
 const figure = document.createElement('figure');
 figure.dataset.case = String(i);
 figure.innerHTML = avatarD(c,{size:300,reduceMotion:true});
 const caption = document.createElement('figcaption');
 caption.textContent = `${i+1}. ${c.skin} / ${c.hairStyle} / ${c.top} / ${c.bottom} / ${c.shoes}${c.outer ? ' / casaco' : ''}`;
 const notice = document.createElement('small');
 notice.textContent = resolveAvatarCompatibility(c).notices.join(' ');
 caption.append(notice);figure.append(caption);document.querySelector('main')!.append(figure);
}
