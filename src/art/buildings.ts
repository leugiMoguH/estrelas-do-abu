import { INK } from './palette';

/** Cada edifício desenha-se numa caixa de 260×150 (chão em y=150). */
const o = (extra = ''): string =>
  `stroke="${INK}" ${extra.includes('stroke-width') ? '' : 'stroke-width="3"'} stroke-linejoin="round" ${extra}`;
const rect = (x: number, y: number, w: number, h: number, fill: string, r = 0): string =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${o()}/>`;
const poly = (points: string, fill: string): string => `<path d="${points}" fill="${fill}" ${o()}/>`;
const glyph = (x: number, y: number, text: string, size: number, fill: string): string =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${fill}" font-family="'Trebuchet MS',system-ui,sans-serif">${text}</text>`;
const window = (x: number, y: number, w: number, h: number, inner = ''): string =>
  rect(x, y, w, h, '#d9f1ff', 6) +
  `<path d="M${x + 5} ${y + 7} L${x + w * 0.45} ${y + 7}" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` +
  inner;
const arch = (x: number, y: number, w: number, h: number, fill: string): string =>
  `<path d="M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z" fill="${fill}" ${o()}/>`;
const star = (x: number, y: number, s: number, fill: string): string =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="${fill}" ${o('stroke-width="1.6"')}/>`;
const steps = (x: number, w: number): string => rect(x, 140, w, 10, '#e3d6c3', 3);

export function biblioteca(): string {
  return (
    rect(24, 52, 212, 90, '#ffe1bd', 6) +
    poly('M8 56 L130 8 L252 56 Z', '#b5473e') +
    `<path d="M40 44 L130 14 M220 44 L130 14" stroke="#d96a5e" stroke-width="4" opacity=".7"/>` +
    `<circle cx="130" cy="38" r="13" fill="#fffaf0" ${o()}/><path d="M130 38 V30 M130 38 L136 41" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>` +
    window(
      38,
      68,
      46,
      56,
      `<path d="M50 96 h22 M50 106 h22" stroke="#b5473e" stroke-width="4" stroke-linecap="round"/>`,
    ) +
    window(
      176,
      68,
      46,
      56,
      `<path d="M188 96 h22 M188 106 h22" stroke="#b5473e" stroke-width="4" stroke-linecap="round"/>`,
    ) +
    arch(104, 76, 52, 66, '#9a5a37') +
    `<circle cx="146" cy="116" r="3" fill="#ffd666"/><path d="M130 82 V142" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M106 70 Q118 62 130 70 Q142 62 154 70 V78 Q142 70 130 78 Q118 70 106 78 Z" fill="#fffaf0" ${o('stroke-width="2.4"')}/>` +
    steps(96, 68)
  );
}

export function laboratorio(): string {
  const note = (x: number, t: string): string =>
    `<circle cx="${x}" cy="92" r="19" fill="#fff" ${o('stroke-width="2.6"')}/>` +
    glyph(x, 102, t, 26, '#4f7fd9');
  return (
    rect(24, 70, 212, 72, '#cfe6ff', 8) +
    `<path d="M40 70 A90 62 0 0 1 220 70 Z" fill="#a9cdf7" ${o()}/>` +
    `<path d="M62 62 A68 46 0 0 1 100 30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>` +
    rect(198, 26, 18, 44, '#ffb8c6', 4) +
    `<ellipse cx="207" cy="22" rx="14" ry="6" fill="#ffd9e1" ${o('stroke-width="2.4"')}/>` +
    `<circle cx="214" cy="8" r="6" fill="#bfe4f7" opacity=".85"/><circle cx="224" cy="-2" r="4" fill="#bfe4f7" opacity=".6"/>` +
    note(60, '+') +
    note(130, '×') +
    note(200, '÷') +
    arch(108, 104, 44, 38, '#5bbd8c') +
    `<g class="twinkle">${star(130, 34, 2.2, '#ffd666')}</g>` +
    steps(96, 68)
  );
}

export function casaLinguas(): string {
  const bubble = (x: number, y: number, t: string, fill: string): string =>
    `<path d="M${x} ${y} h46 a8 8 0 0 1 8 8 v18 a8 8 0 0 1 -8 8 h-30 l-10 10 v-10 h-6 a8 8 0 0 1 -8 -8 v-18 a8 8 0 0 1 8 -8 Z" fill="${fill}" ${o('stroke-width="2.6"')}/>` +
    glyph(x + 27, y + 24, t, 18, INK);
  return (
    rect(30, 56, 200, 86, '#ffd0e0', 10) +
    poly('M16 60 Q130 -2 244 60 Z', '#4fc1b5') +
    `<path d="M44 52 Q130 8 216 52" fill="none" stroke="#8fe0d6" stroke-width="5" stroke-linecap="round" opacity=".8"/>` +
    bubble(38, 68, 'Hi!', '#fff6e8') +
    bubble(150, 68, 'Olá!', '#fff6e8') +
    arch(108, 92, 44, 50, '#8a5aa8') +
    `<circle cx="142" cy="120" r="3" fill="#ffd666"/>` +
    `<path d="M30 56 Q80 78 130 56 Q180 78 230 56" fill="none" stroke="${INK}" stroke-width="2"/>` +
    [50, 90, 130, 170, 210]
      .map(
        (x, i) =>
          `<path d="M${x} ${i % 2 ? 63 : 67} l8 0 l-4 12 Z" fill="${['#ff8f7a', '#ffd666', '#6aa8ff', '#a58bf0', '#6cc791'][i]}" ${o('stroke-width="1.6"')}/>`,
      )
      .join('') +
    steps(98, 64)
  );
}

export function museu(): string {
  const column = (x: number): string =>
    rect(x, 56, 20, 84, '#f6eddc', 4) +
    `<path d="M${x + 6} 62 V134 M${x + 13} 62 V134" stroke="#dccfb8" stroke-width="2"/>`;
  return (
    rect(20, 138, 220, 10, '#e3d6c3', 3) +
    rect(34, 48, 192, 10, '#efe3cf', 3) +
    poly('M20 50 L130 6 L240 50 Z', '#f1e6d2') +
    `<circle cx="130" cy="30" r="10" fill="#ffd666" ${o('stroke-width="2.4"')}/>` +
    [44, 84, 156, 196].map(column).join('') +
    rect(104, 80, 52, 58, '#9a7bd1', 6) +
    `<path d="M114 88 h32 M114 100 h32" stroke="#d9c9f5" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M120 124 Q130 110 140 124" fill="none" stroke="#ffd666" stroke-width="4" stroke-linecap="round"/>` +
    rect(70, 70, 4, 0, '#fff') +
    `<path d="M22 56 V92 L32 84 L42 92 V56 Z" fill="#e0524f" ${o('stroke-width="2.4"')}/><path d="M218 56 V92 L228 84 L238 92 V56 Z" fill="#e0524f" ${o('stroke-width="2.4"')}/>`
  );
}

export function jardim(): string {
  const leaf = (x: number, y: number, r: number, fill: string): string =>
    `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 C-12 -10 -12 -30 0 -40 C12 -30 12 -10 0 0 Z" fill="${fill}" ${o('stroke-width="2.2"')}/>`;
  return (
    `<path d="M20 142 V74 Q20 22 130 22 Q240 22 240 74 V142 Z" fill="#d4f3ea" fill-opacity=".85" ${o()}/>` +
    `<path d="M20 74 H240 M80 26 V142 M130 22 V142 M180 26 V142" stroke="#fff" stroke-width="5"/>` +
    `<path d="M20 142 V74 Q20 22 130 22 Q240 22 240 74 V142" fill="none" ${o()}/>` +
    leaf(60, 140, -10, '#6cc791') +
    leaf(76, 140, 18, '#4fa66f') +
    leaf(112, 140, -6, '#6cc791') +
    leaf(150, 140, 12, '#4fa66f') +
    leaf(190, 140, -14, '#6cc791') +
    leaf(206, 140, 14, '#4fa66f') +
    `<circle cx="112" cy="94" r="9" fill="#ff8f9d" ${o('stroke-width="2.2"')}/><circle cx="190" cy="100" r="8" fill="#ffd666" ${o('stroke-width="2.2"')}/><circle cx="62" cy="98" r="8" fill="#a58bf0" ${o('stroke-width="2.2"')}/>` +
    rect(104, 108, 52, 40, '#b9825a', 5) +
    `<path d="M130 112 V146" stroke="${INK}" stroke-width="2.4"/>` +
    `<path d="M70 52 Q86 40 100 48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>`
  );
}

export function atelier(): string {
  return (
    rect(26, 60, 208, 82, '#ffc58a', 8) +
    poly('M14 66 L48 24 L92 66 L136 24 L180 66 L224 24 L246 66 Z', '#e8734f') +
    rect(44, 80, 78, 52, '#fff6e8', 6) +
    `<path d="M60 124 L76 92 L92 124 M92 124 L100 108 L112 124" fill="none" stroke="#6aa8ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<circle cx="104" cy="96" r="6" fill="#ffd666"/>` +
    `<path d="M168 122 Q150 120 154 104 Q156 88 176 88 Q200 90 200 108 Q198 124 184 118 Q176 116 180 126 Q172 128 168 122 Z" fill="#fff6e8" ${o('stroke-width="2.6"')}/>` +
    `<circle cx="168" cy="100" r="5" fill="#ff8f7a"/><circle cx="182" cy="98" r="5" fill="#6aa8ff"/><circle cx="190" cy="110" r="5" fill="#6cc791"/>` +
    arch(204, 98, 22, 44, '#8a5aa8') +
    `<circle cx="32" cy="118" r="9" fill="#ff7aa2" opacity=".85"/><circle cx="44" cy="132" r="6" fill="#6aa8ff" opacity=".85"/>`
  );
}

export function estudio(): string {
  return (
    rect(24, 64, 212, 78, '#cdb8ff', 10) +
    `<path d="M14 70 Q130 -12 246 70 Z" fill="#8a6fd6" ${o()}/>` +
    `<path d="M50 60 Q100 20 150 22" fill="none" stroke="#b7a2ec" stroke-width="5" stroke-linecap="round" opacity=".8"/>` +
    `<circle cx="130" cy="84" r="26" fill="#2d2a3f" ${o()}/><circle cx="130" cy="84" r="17" fill="none" stroke="#6b5fa8" stroke-width="2"/><circle cx="130" cy="84" r="7" fill="#ff8f7a"/><circle cx="130" cy="84" r="2" fill="#fff"/>` +
    `<path d="M62 116 V86 L84 80 V110" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="58" cy="118" r="7" fill="${INK}"/><circle cx="80" cy="112" r="7" fill="${INK}"/><path d="M62 86 L84 80 V90 L62 96 Z" fill="${INK}"/>` +
    rect(176, 92, 40, 50, '#fffaf0', 6) +
    `<circle cx="196" cy="108" r="9" fill="#ddd2f5" ${o('stroke-width="2.4"')}/><circle cx="196" cy="128" r="6" fill="#ddd2f5" ${o('stroke-width="2.4"')}/>` +
    `<g class="twinkle">${star(232, 36, 1.6, '#ffd666')}</g><g class="twinkle">${star(30, 40, 1.3, '#ff8f9d')}</g>`
  );
}

export const BUILDINGS: Record<string, () => string> = {
  portugues: biblioteca,
  matematica: laboratorio,
  ingles: casaLinguas,
  historia: museu,
  ciencias: jardim,
  evt: atelier,
  musica: estudio,
};
