import { BUILDINGS } from './buildings';
import { INK, SOFT } from './palette';

const FONT = `font-family="'Trebuchet MS',system-ui,sans-serif" font-weight="800"`;
const o = (extra = ''): string =>
  `stroke="${INK}" ${extra.includes('stroke-width') ? '' : 'stroke-width="3"'} stroke-linejoin="round" ${extra}`;

interface Spot {
  id: string;
  building: string;
  subject: string;
  x: number;
  y: number;
}

const SPOTS: readonly Spot[] = [
  { id: 'historia', building: 'Museu das Descobertas', subject: 'História e Geografia', x: 20, y: 28 },
  { id: 'musica', building: 'Estúdio Musical', subject: 'Educação Musical', x: 320, y: 28 },
  { id: 'ingles', building: 'Casa das Línguas', subject: 'Inglês', x: 20, y: 246 },
  { id: 'ciencias', building: 'Jardim das Ciências', subject: 'Ciências Naturais', x: 320, y: 246 },
  { id: 'evt', building: 'Atelier Criativo', subject: 'Educação Visual e Tecnológica', x: 170, y: 464 },
  { id: 'portugues', building: 'Biblioteca', subject: 'Português', x: 20, y: 900 },
  { id: 'matematica', building: 'Laboratório dos Números', subject: 'Matemática', x: 320, y: 900 },
];

function pill(cx: number, y: number, text: string, fill: string, color: string, size = 17): string {
  const w = Math.max(60, text.length * size * 0.56 + 22);
  return (
    `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${size + 12}" rx="${(size + 12) / 2}" fill="${fill}" ${o('stroke-width="2.4"')}/>` +
    `<text x="${cx}" y="${y + size + 1}" text-anchor="middle" font-size="${size}" fill="${color}" ${FONT}>${text}</text>`
  );
}

/** `big`: legendas legíveis em ecrãs de telemóvel (mapa desenhado a ~60%): só a disciplina nos abertos, só «Em preparação» nos fechados. */
function label(spot: Spot, active: boolean, big = false): string {
  if (big)
    return active
      ? pill(130, 160, spot.subject.split(' ')[0]!, SOFT.coral, '#fff', 30)
      : pill(130, 168, 'Em preparação', '#e4dccd', '#6a574b', 23);
  const name = pill(130, 152, spot.building, '#fffaf0', INK, 19);
  const tag = active
    ? pill(130, 186, spot.subject, SOFT.coral, '#fff', 16)
    : pill(130, 186, 'Em preparação', '#e4dccd', '#7a675b', 15);
  return name + tag;
}

function building(spot: Spot, active: boolean, big = false): string {
  const scale = 1;
  const art = BUILDINGS[spot.id]!();
  const hint = active
    ? `<g class="map-hint"><circle cx="236" cy="14" r="17" fill="${SOFT.sun}" ${o()}/><path transform="translate(236 14) scale(2)" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="#fff"/></g>`
    : '';
  const aria = active
    ? `Abrir ${spot.building}, ${spot.subject}`
    : `${spot.building}, ${spot.subject}: em preparação`;
  return (
    `<g class="map-hit${active ? '' : ' is-idle'}" data-target="${spot.id}" role="button" tabindex="${active ? 0 : -1}" ` +
    `aria-label="${aria}" aria-disabled="${active ? 'false' : 'true'}" transform="translate(${spot.x} ${spot.y}) scale(${scale})">` +
    `<rect class="map-focus" x="-4" y="-6" width="268" height="214" rx="22" fill="transparent" stroke="transparent"/>` +
    `<ellipse cx="130" cy="150" rx="128" ry="12" fill="#000" opacity=".12"/>` +
    `<g class="map-body">${art}</g>${hint}${label(spot, active, big)}</g>`
  );
}

function stall(): string {
  const stripes = [0, 1, 2, 3, 4]
    .map((i) => `<path d="M${-46 + i * 19} -30 h19 l-5 20 h-9 Z" fill="${i % 2 ? '#fffaf0' : '#e0524f'}"/>`)
    .join('');
  return (
    `<rect x="-40" y="-12" width="80" height="44" rx="4" fill="#d9a066" ${o()}/>` +
    `<path d="M-48 -30 H48 L42 -8 H-42 Z" fill="#fffaf0" ${o()}/>${stripes}` +
    `<circle cx="-18" cy="6" r="8" fill="#ff8f7a" ${o('stroke-width="2.4"')}/><rect x="2" y="-2" width="16" height="16" rx="3" fill="#ffd666" ${o('stroke-width="2.4"')}/>` +
    `<path transform="translate(30 20) scale(1.6)" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="#ffd666" stroke="${INK}" stroke-width="1.4"/>`
  );
}

function trophy(): string {
  return (
    `<rect x="-24" y="14" width="48" height="16" rx="4" fill="#9a7bd1" ${o()}/><rect x="-12" y="4" width="24" height="12" fill="#b49be0" ${o()}/>` +
    `<path d="M-22 -34 H22 V-8 Q22 8 0 8 Q-22 8 -22 -8 Z" fill="#ffd666" ${o()}/>` +
    `<path d="M-22 -28 Q-40 -28 -36 -14 Q-32 -6 -20 -8 M22 -28 Q40 -28 36 -14 Q32 -6 20 -8" fill="none" ${o()}/>` +
    `<path d="M-12 -28 V-12" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`
  );
}

function arcade(): string {
  return (
    `<path d="M-38 -4 Q-40 -26 -20 -26 H20 Q40 -26 38 -4 Q36 22 24 22 Q16 22 12 12 H-12 Q-16 22 -24 22 Q-36 22 -38 -4 Z" fill="#6aa8ff" ${o()}/>` +
    `<path d="M-24 -10 v12 M-30 -4 h12" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
    `<circle cx="22" cy="-10" r="5" fill="#ff8f7a"/><circle cx="30" cy="0" r="5" fill="#ffd666"/><circle cx="14" cy="0" r="5" fill="#6cc791"/>`
  );
}

function plazaPoint(id: string, x: number, y: number, title: string, art: string, big = false): string {
  return (
    `<g class="map-hit" data-target="${id}" role="button" tabindex="0" aria-label="${title}" transform="translate(${x} ${y})">` +
    `<rect class="map-focus" x="-56" y="-52" width="112" height="124" rx="20" fill="transparent" stroke="transparent"/>` +
    `<ellipse cx="0" cy="34" rx="46" ry="8" fill="#000" opacity=".12"/>${art}${pill(0, 40, title, '#fffaf0', INK, big ? 26 : 17)}</g>`
  );
}

function fountain(): string {
  return (
    `<ellipse cx="300" cy="580" rx="64" ry="26" fill="#b9d9ee" ${o()}/><ellipse cx="300" cy="574" rx="50" ry="18" fill="#8fd0f0" ${o('stroke-width="2.4"')}/>` +
    `<rect x="292" y="534" width="16" height="42" rx="6" fill="#efe3cf" ${o('stroke-width="2.6"')}/>` +
    `<g class="fountain-water"><path d="M300 534 Q290 516 280 530 M300 534 Q310 516 320 530 M300 534 V508" fill="none" stroke="#8fd0f0" stroke-width="5" stroke-linecap="round"/></g>`
  );
}

function tree(x: number, y: number, s = 1): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="0" width="10" height="26" rx="4" fill="#9a6a45" ${o('stroke-width="2.4"')}/>` +
    `<circle cx="0" cy="-8" r="22" fill="#6cc791" ${o('stroke-width="2.4"')}/><circle cx="-12" cy="-2" r="14" fill="#7bd49c"/><circle cx="12" cy="-12" r="12" fill="#57b57e"/></g>`
  );
}

function sky(): string {
  const cloud = (x: number, y: number, cls: string): string =>
    `<g class="cloud ${cls}"><g transform="translate(${x} ${y})" fill="#fff" opacity=".92"><ellipse cx="0" cy="0" rx="34" ry="14"/><ellipse cx="-18" cy="-8" rx="18" ry="12"/><ellipse cx="14" cy="-12" rx="22" ry="14"/></g></g>`;
  return (
    `<defs><linearGradient id="mapsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SOFT.skyTop}"/><stop offset=".45" stop-color="${SOFT.sky}"/><stop offset="1" stop-color="#e5f6dd"/></linearGradient></defs>` +
    `<rect width="600" height="1110" fill="url(#mapsky)"/>` +
    cloud(110, 20, '') +
    cloud(470, 16, 'cloud-b') +
    `<circle cx="548" cy="26" r="20" fill="${SOFT.sun}" opacity=".9"/>` +
    `<path d="M0 90 Q150 40 300 80 T600 70 V1110 H0 Z" fill="${SOFT.grass}"/>` +
    `<path d="M0 300 Q150 270 300 300 T600 290 V1110 H0 Z" fill="${SOFT.grassDark}" opacity=".35"/>` +
    `<path d="M300 760 V896" fill="none" stroke="#efe0c4" stroke-width="26" stroke-linecap="round"/>`
  );
}

function plaza(big = false): string {
  const ground =
    `<ellipse cx="300" cy="570" rx="290" ry="108" fill="#f1e5cf" ${o('stroke-width="2.6"')}/>` +
    `<ellipse cx="300" cy="570" rx="262" ry="90" fill="#f8f0e0"/>`;
  const points = [
    plazaPoint('loja', 98, 572, 'Loja', stall(), big),
    plazaPoint('conquistas', 502, 572, 'Conquistas', trophy(), big),
    plazaPoint('minijogo', 300, 640, 'Minijogo', arcade(), big),
  ];
  return `<g transform="translate(0 130)">${ground}${tree(30, 520, 0.8)}${tree(570, 520, 0.8)}${fountain()}${points.join('')}</g>`;
}

/** Mapa do centro escolar. `activeSubjects` indica os edifícios abertos; os restantes ficam «Em preparação». */
export const mapSvg = (options: { activeSubjects: readonly string[] }): string => drawMap(options, false);
export const mapSvgBig = (options: { activeSubjects: readonly string[] }): string => drawMap(options, true);

function drawMap(options: { activeSubjects: readonly string[] }, big: boolean): string {
  const active = new Set(options.activeSubjects);
  const buildings = SPOTS.map((s) => building(s, active.has(s.id), big));
  return (
    `<svg class="map-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1110" role="group" aria-label="Centro escolar">` +
    sky() +
    tree(18, 486, 0.9) +
    tree(582, 486, 0.9) +
    plaza(big) +
    buildings.join('') +
    `</svg>`
  );
}
