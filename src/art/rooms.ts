import { INK, shade } from './palette';

const o = (extra = ''): string =>
  `stroke="${INK}" ${extra.includes('stroke-width') ? '' : 'stroke-width="3"'} stroke-linejoin="round" ${extra}`;
const rect = (x: number, y: number, w: number, h: number, fill: string, r = 4): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${o()}/>`;

interface Theme {
  wall: string;
  floor: string;
  accent: string;
}
const THEMES: Record<string, Theme> = {
  matematica: { wall: '#d6e8ff', floor: '#e8c89a', accent: '#6aa8ff' },
  portugues: { wall: '#ffe6c8', floor: '#dcae7c', accent: '#e8734f' },
  ingles: { wall: '#ffd9e6', floor: '#e8c89a', accent: '#4fc1b5' },
  historia: { wall: '#efe6d6', floor: '#d6b48a', accent: '#9a7bd1' },
  ciencias: { wall: '#dcf3e4', floor: '#e0c394', accent: '#4fa66f' },
  evt: { wall: '#ffe9c9', floor: '#e8c89a', accent: '#ff8f7a' },
  musica: { wall: '#e6dcff', floor: '#d6b48a', accent: '#8a6fd6' },
};

function windowFrame(): string {
  return (
    rect(36, 70, 120, 150, '#bfe4f7', 10) +
    `<path d="M96 70 V220 M36 145 H156" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="70" cy="104" r="14" fill="#ffe08a" opacity=".9"/>` +
    `<path d="M104 188 q14 -20 28 0" fill="#fff" opacity=".8"/>`
  );
}

function mathDecor(accent: string): string {
  const shapes = `<path d="M600 98 L640 98 L620 62 Z" fill="#ffd666" ${o('stroke-width="2.4"')}/><circle cx="668" cy="82" r="18" fill="#ff8f9d" ${o('stroke-width="2.4"')}/><rect x="700" y="64" width="34" height="34" rx="4" fill="${accent}" ${o('stroke-width="2.4"')}/>`;
  const abacus =
    `<rect x="610" y="150" width="130" height="86" rx="8" fill="#fffaf0" ${o()}/>` +
    [166, 184, 202, 220]
      .map(
        (y, i) =>
          `<path d="M618 ${y} H732" stroke="${INK}" stroke-width="2.4"/>${[0, 1, 2, 3].map((k) => `<circle cx="${640 + k * 22 + (i % 2) * 8}" cy="${y}" r="7" fill="${['#ff8f7a', '#6aa8ff', '#6cc791', '#ffd666'][(i + k) % 4]}" ${o('stroke-width="2"')}/>`).join('')}`,
      )
      .join('');
  return rect(590, 44, 160, 68, '#fffaf0', 8) + shapes + abacus;
}

function languageDecor(accent: string): string {
  const books = ['#ff8f7a', '#6aa8ff', '#ffd666', '#6cc791', '#a58bf0', '#ff7aa2', '#4fc1b5']
    .map(
      (c, i) =>
        `<rect x="${606 + i * 18}" y="${i % 2 ? 100 : 92}" width="15" height="${i % 2 ? 44 : 52}" rx="3" fill="${c}" ${o('stroke-width="2.2"')}/>`,
    )
    .join('');
  const shelf = rect(596, 144, 150, 10, '#b9825a', 3) + books;
  const letters = ['A', 'B', 'C']
    .map(
      (l, i) =>
        `<g transform="translate(${616 + i * 42} 200)"><rect x="-17" y="-22" width="34" height="38" rx="6" fill="${accent}" ${o('stroke-width="2.4"')}/><text y="8" text-anchor="middle" font-size="26" font-weight="800" fill="#fff" font-family="'Trebuchet MS',system-ui,sans-serif">${l}</text></g>`,
    )
    .join('');
  return shelf + letters;
}

function genericDecor(accent: string): string {
  return (
    `<circle cx="660" cy="96" r="38" fill="#fffaf0" ${o()}/><path d="M660 96 V70 M660 96 L678 106" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` +
    rect(620, 176, 70, 58, shade(accent, 0.2), 10) +
    `<path d="M655 176 q-14 -34 -28 -22 M655 176 q16 -38 30 -22" fill="none" stroke="#4fa66f" stroke-width="6" stroke-linecap="round"/>`
  );
}

/** Fundo de sala: quadro ao centro e área livre para exercícios; sem texto. */
export function roomSvg(subject: string): string {
  const t = THEMES[subject] ?? THEMES.matematica!;
  const decor =
    subject === 'matematica'
      ? mathDecor(t.accent)
      : subject === 'portugues'
        ? languageDecor(t.accent)
        : genericDecor(t.accent);
  return (
    `<svg class="room-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
    `<rect width="800" height="500" fill="${t.wall}"/>` +
    `<path d="M0 60 H800" stroke="${shade(t.wall, -0.08)}" stroke-width="3"/>` +
    `<rect y="330" width="800" height="170" fill="${t.floor}"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7]
      .map(
        (i) =>
          `<path d="M${i * 110 - 40} 500 L${160 + i * 70} 330" stroke="${shade(t.floor, -0.12)}" stroke-width="2"/>`,
      )
      .join('') +
    `<path d="M0 330 H800" stroke="${INK}" stroke-width="3"/>` +
    windowFrame() +
    rect(190, 56, 400, 250, '#4a6b57', 12) +
    rect(204, 70, 372, 222, '#5a8068', 8) +
    `<path d="M214 86 q60 -8 120 0" stroke="#fff" stroke-width="3" opacity=".25" fill="none" stroke-linecap="round"/>` +
    rect(210, 296, 360, 12, '#b9825a', 4) +
    decor +
    rect(130, 372, 540, 26, '#d9a066', 8) +
    rect(150, 398, 14, 70, '#b9825a', 3) +
    rect(636, 398, 14, 70, '#b9825a', 3) +
    `<ellipse cx="400" cy="486" rx="320" ry="10" fill="#000" opacity=".1"/>` +
    `</svg>`
  );
}
