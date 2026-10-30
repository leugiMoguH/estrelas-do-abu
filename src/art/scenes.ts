import { biblioteca, laboratorio } from './buildings';
import { INK, SOFT } from './palette';

const o = (extra = ''): string =>
  `stroke="${INK}" ${extra.includes('stroke-width') ? '' : 'stroke-width="3"'} stroke-linejoin="round" ${extra}`;
const STAR_PATH =
  'M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z';

export function starSvg(size = 24): string {
  return (
    `<svg class="star-svg" xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 16 16" width="${size}" height="${size}" aria-hidden="true">` +
    `<path d="${STAR_PATH}" fill="#ffd666" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<path d="M-1.6 -3.2 L-0.5 -1 " stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".9"/></svg>`
  );
}

const twinkle = (x: number, y: number, s: number, delay: number): string =>
  `<g class="twinkle" style="animation-delay:${delay}s"><path transform="translate(${x} ${y}) scale(${s})" d="${STAR_PATH}" fill="#ffd666" ${o('stroke-width="1.4"')}/></g>`;

function flower(x: number, y: number, fill: string): string {
  const petals = [0, 72, 144, 216, 288]
    .map((a) => `<ellipse cx="0" cy="-7" rx="4.4" ry="6" fill="${fill}" transform="rotate(${a})"/>`)
    .join('');
  return `<g transform="translate(${x} ${y})"><path d="M0 0 V22" stroke="#4fa66f" stroke-width="3"/>${petals}<circle r="3.6" fill="#ffd666"/></g>`;
}

/** Cena de fundo do ecrã de boas-vindas (sem texto): a app põe título, personagem e Abu por cima. */
export function welcomeSvg(): string {
  const cloud = (x: number, y: number, cls: string): string =>
    `<g class="cloud ${cls}"><g transform="translate(${x} ${y})" fill="#fff" opacity=".95"><ellipse rx="52" ry="20"/><ellipse cx="-28" cy="-12" rx="28" ry="18"/><ellipse cx="22" cy="-18" rx="32" ry="20"/></g></g>`;
  const bunting = [60, 150, 240, 330, 420, 510, 600, 690]
    .map(
      (x, i) =>
        `<path d="M${x} ${64 + (i % 2) * 6} l22 0 l-11 24 Z" fill="${['#ff8f7a', '#ffd666', '#6aa8ff', '#a58bf0', '#6cc791', '#ff7aa2', '#4fc1b5', '#ffaa5c'][i]}" ${o('stroke-width="2"')}/>`,
    )
    .join('');
  return (
    `<svg class="welcome-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
    `<defs><linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f0"/><stop offset=".7" stop-color="#d6f0fb"/><stop offset="1" stop-color="#fff2d6"/></linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#wsky)"/>` +
    `<circle cx="660" cy="120" r="46" fill="${SOFT.sun}" opacity=".95"/><circle cx="660" cy="120" r="70" fill="${SOFT.sun}" opacity=".25"/>` +
    cloud(150, 130, '') +
    cloud(520, 90, 'cloud-b') +
    cloud(380, 210, '') +
    `<path d="M0 64 Q400 90 800 60" fill="none" stroke="${INK}" stroke-width="2.4"/>${bunting}` +
    `<path d="M0 380 Q200 320 400 370 T800 350 V600 H0 Z" fill="#b6e3a4"/>` +
    `<g transform="translate(40 236) scale(1.15)">${biblioteca()}</g>` +
    `<g transform="translate(440 246) scale(1.1)">${laboratorio()}</g>` +
    `<path d="M0 450 Q200 410 400 440 T800 430 V600 H0 Z" fill="${SOFT.grass}"/>` +
    `<path d="M0 520 Q240 490 460 520 T800 508 V600 H0 Z" fill="${SOFT.grassDark}"/>` +
    flower(60, 500, '#ff8f9d') +
    flower(150, 540, '#fff6e8') +
    flower(690, 510, '#ffb8c6') +
    flower(760, 548, '#fff6e8') +
    flower(330, 556, '#ffd666') +
    twinkle(120, 40, 2, 0) +
    twinkle(700, 220, 1.8, 0.8) +
    twinkle(330, 150, 1.4, 1.4) +
    twinkle(570, 40, 1.6, 0.4) +
    `</svg>`
  );
}
