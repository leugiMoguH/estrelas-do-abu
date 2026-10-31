import campus from '../assets/d/campus.webp';
import plaza from '../assets/d2/plaza_bg.webp';
import mathematics from '../assets/d6/room-mat.webp';
import portuguese from '../assets/d6/room-por.webp';
import { uid } from '../palette';

type Spot = readonly [string, string, number, number, number, number];
const subjects: readonly Spot[] = [
 ['portugues', 'Biblioteca, Português', 0,520,365,290],
 ['matematica', 'Laboratório dos Números, Matemática',485,530,283,290],
 ['ciencias','Ciências Naturais',70,180,170,115],
 ['historia','História e Geografia',335,180,165,135],
 ['ingles','Inglês',560,200,160,105],
 ['evt','Educação Visual e Tecnológica',65,315,175,100],
 ['musica','Educação Musical',560,340,200,95],
];
const square: readonly Spot[] = [
 ['loja','Loja',255,440,105,110], ['conquistas','Conquistas',545,430,110,105],
 ['minijogo','Minijogo',370,345,110,95],
];
export function mapD({activeSubjects}: {activeSubjects: readonly string[]}): string {
 const spot = ([id,name,x,y,w,h]: Spot, plaza = false): string => {
  const active = plaza || activeSubjects.includes(id);
  const label = plaza ? '' : active ? id === 'portugues' ? 'Português' : 'Matemática' : 'Em breve';
  const size = active ? 34 : 26;
  const pw = label.length * size * .57 + 24;
  const cx = x+w/2, cy = active ? y+h-20 : y+h/2;
  const icon = id === 'loja' ? '<path d="M-21 -15H21L25 24H-25Z M-11 -15V-22A11 11 0 0 1 11 -22V-15"/>' : id === 'conquistas' ? '<path d="M-16 -24H16V-4Q16 14 0 14Q-16 14 -16 -4Z M-16 -18H-28V-8Q-28 4 -14 4 M16 -18H28V-8Q28 4 14 4 M0 14V25 M-14 25H14"/>' : '<rect x="-24" y="-24" width="48" height="48" rx="9"/><path d="M-12 -12H-11 M11 12H12 M0 0H1" stroke-width="8"/>';
  const marker = plaza ? `<g pointer-events="none" transform="translate(${cx} ${y+h/2})"><circle r="38" fill="#fff4df" stroke="#b77522" stroke-width="3"/><g fill="none" stroke="#563916" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${icon}</g></g>` : '';
  return `<g class="map-hit${active?'':' is-idle'}" data-target="${id}" role="button" tabindex="${active?0:-1}" aria-disabled="${!active}" aria-label="${active?'Abrir '+name:name+': em preparação — Em breve'}"><rect x="${x}" y="${y}" width="${w}" height="${Math.max(h,100)}" fill="transparent"/><rect class="map-focus${active?' map-ring':''}" x="${x+3}" y="${y+3}" width="${w-6}" height="${h-6}" rx="24" fill="${active?'#ffcf6510':'#29214328'}" stroke="${active?'#ffcf65':'transparent'}" stroke-width="5"/>${marker}${label?`<g pointer-events="none"><rect x="${cx-pw/2}" y="${cy-30}" width="${pw}" height="48" rx="24" fill="${active?'#fff4df':'#292143'}" stroke="#e5bd70" stroke-width="2"/><text x="${cx}" y="${cy+4}" text-anchor="middle" fill="${active?'#30233e':'#fff4df'}" font-family="Trebuchet MS, sans-serif" font-size="${size}" font-weight="700">${label}</text></g>`:''}</g>`;
 };
 return `<svg class="map-svg map-d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1152" role="group" aria-label="Centro escolar"><image href="${campus}" width="768" height="1152"/>${subjects.map(s=>spot(s)).join('')}${square.map(s=>spot(s,true)).join('')}</svg>`;
}
export function roomD(subject: string): string {
 const src = subject==='matematica'?mathematics:subject==='portugues'?portuguese:plaza;
 return `<svg class="room-svg room-d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 853" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${src}" width="1280" height="853" preserveAspectRatio="xMidYMid slice"/></svg>`;
}
export const welcomeD = (): string => `<svg class="welcome-svg welcome-d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1152" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${plaza}" width="768" height="1152"/></svg>`;
export function starD(size = 24): string {
 const id = uid('gold');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="estrela"><defs><linearGradient id="${id}" x2=".7" y2="1"><stop stop-color="#fff3b0"/><stop offset=".45" stop-color="#ffd167"/><stop offset="1" stop-color="#b77522"/></linearGradient></defs><path d="M32 4 40 22 60 25 45 39 49 59 32 49 15 59 19 39 4 25 24 22Z" fill="url(#${id})" stroke="#8b561d" stroke-width="2" stroke-linejoin="round"/></svg>`;
}
