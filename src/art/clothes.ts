import { INK, shade, uid } from './palette';

const outline = (extra = ''): string =>
  `stroke="${INK}" ${extra.includes('stroke-width') ? '' : 'stroke-width="3"'} stroke-linejoin="round" ${extra}`;

interface TopStyle {
  color: string;
  kind: 'tee' | 'stripes' | 'stars' | 'hoodie' | 'jacket';
}
const TOPS: Record<string, TopStyle> = {
  'top-azul': { color: '#6aa8ff', kind: 'tee' },
  'top-coral': { color: '#ff8f7a', kind: 'tee' },
  'top-verde': { color: '#6cc791', kind: 'tee' },
  'top-listras': { color: '#fffaf0', kind: 'stripes' },
  'top-estrelas': { color: '#5a6fd6', kind: 'stars' },
  'top-hoodie': { color: '#a58bf0', kind: 'hoodie' },
  'top-jaqueta': { color: '#5b86c4', kind: 'jacket' },
};
const TORSO = 'M68 158 Q100 148 132 158 L138 224 Q100 234 62 224 Z';

export const topColor = (id: string): string => (TOPS[id] ?? TOPS['top-azul']!).color;

export function topSvg(id: string): string {
  const style = TOPS[id] ?? TOPS['top-azul']!;
  const clip = uid('torso');
  const base = `<path d="${TORSO}" fill="${style.color}" ${outline()}/>`;
  const clipDef = `<clipPath id="${clip}"><path d="${TORSO}"/></clipPath>`;
  const hem = `<path d="M63 218 Q100 228 137 218" fill="none" stroke="${shade(style.color, -0.18)}" stroke-width="3"/>`;
  switch (style.kind) {
    case 'stripes': {
      const bars = [166, 182, 198, 214]
        .map((y) => `<rect x="55" y="${y}" width="90" height="8" fill="#4f7fd9"/>`)
        .join('');
      return clipDef + base + `<g clip-path="url(#${clip})">${bars}</g>` + hem;
    }
    case 'stars': {
      const stars = [
        [88, 178],
        [112, 172],
        [100, 196],
        [80, 210],
        [120, 208],
      ]
        .map(
          ([x, y]) =>
            `<path transform="translate(${x} ${y})" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="#ffd666"/>`,
        )
        .join('');
      return base + stars + hem;
    }
    case 'hoodie':
      return (
        base +
        `<path d="M80 152 Q100 172 120 152 L122 146 Q100 162 78 146 Z" fill="${shade(style.color, -0.15)}" ${outline()}/>` +
        `<path d="M84 206 L116 206 L112 224 L88 224 Z" fill="${shade(style.color, -0.12)}" ${outline('opacity=".9"')}/>` +
        `<path d="M94 166 L94 186 M106 166 L106 186" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`
      );
    case 'jacket':
      return (
        `<path d="${TORSO}" fill="#fffaf0" ${outline()}/>` +
        `<path d="M68 158 Q82 154 90 156 L92 228 L62 224 Z M132 158 Q118 154 110 156 L108 228 L138 224 Z" fill="${style.color}" ${outline()}/>` +
        `<path d="M80 152 L94 172 L100 156 L106 172 L120 152" fill="#f4f8ff" ${outline()}/>`
      );
    default:
      return (
        base +
        hem +
        `<path d="M84 154 Q100 166 116 154" fill="none" stroke="${shade(style.color, -0.2)}" stroke-width="3" stroke-linecap="round"/>`
      );
  }
}

interface BottomStyle {
  color: string;
  kind: 'pants' | 'shorts' | 'skirt' | 'plaid';
}
const BOTTOMS: Record<string, BottomStyle> = {
  'bottom-calcas': { color: '#3f6bb5', kind: 'pants' },
  'bottom-saia': { color: '#ff9bb3', kind: 'skirt' },
  'bottom-calcoes': { color: '#f2b24a', kind: 'shorts' },
  'bottom-xadrez': { color: '#d94f5c', kind: 'plaid' },
  'bottom-verdes': { color: '#4fa66f', kind: 'pants' },
};

export const bottomHidesLegs = (id: string): boolean => (BOTTOMS[id]?.kind ?? 'pants') === 'pants';

export function bottomSvg(id: string): string {
  const style = BOTTOMS[id] ?? BOTTOMS['bottom-calcas']!;
  const fill = style.color;
  if (style.kind === 'pants' || style.kind === 'shorts') {
    const bottomY = style.kind === 'pants' ? 266 : 242;
    const leg = (x: number): string =>
      `<path d="M${x} 216 L${x + 22} 216 L${x + 21} ${bottomY} L${x + 1} ${bottomY} Z" fill="${fill}" ${outline()}/>`;
    return (
      leg(77) +
      leg(101) +
      `<path d="M64 214 Q100 222 136 214 L136 226 Q100 234 64 226 Z" fill="${shade(fill, -0.12)}" ${outline()}/>`
    );
  }
  const clip = uid('skirt');
  const skirt = 'M64 214 L136 214 L150 250 Q100 262 50 250 Z';
  const plaid =
    style.kind === 'plaid'
      ? `<clipPath id="${clip}"><path d="${skirt}"/></clipPath><g clip-path="url(#${clip})" stroke="${shade(fill, -0.3)}" stroke-width="3" opacity=".6">` +
        [60, 76, 92, 108, 124, 140].map((x) => `<path d="M${x} 214 V262"/>`).join('') +
        [226, 238, 250].map((y) => `<path d="M44 ${y} H156"/>`).join('') +
        `</g>`
      : '';
  return `<path d="${skirt}" fill="${fill}" ${outline()}/>` + plaid;
}

interface ShoeStyle {
  color: string;
  tall: boolean;
  sole: string;
}
const SHOES: Record<string, ShoeStyle> = {
  'shoes-brancas': { color: '#fdfdfd', tall: false, sole: '#4fc1b5' },
  'shoes-vermelhas': { color: '#e04a4a', tall: false, sole: '#fff6e8' },
  'shoes-botas': { color: '#8a5a3a', tall: true, sole: '#5d3a22' },
  'shoes-chuva': { color: '#ffd23f', tall: true, sole: '#d89f10' },
};

export const shoesAreTall = (id: string): boolean => (SHOES[id] ?? SHOES['shoes-brancas']!).tall;

export function shoesSvg(id: string): string {
  const style = SHOES[id] ?? SHOES['shoes-brancas']!;
  const foot = (flip: boolean): string => {
    const transform = flip ? 'transform="translate(200 0) scale(-1 1)"' : '';
    const shaft = style.tall
      ? `<path d="M78 244 L98 244 L98 268 L78 268 Z" fill="${style.color}" ${outline()}/>`
      : '';
    return (
      `<g ${transform}>` +
      shaft +
      `<path d="M70 270 Q70 258 86 258 L98 258 L98 278 L68 278 Q64 274 70 270 Z" fill="${style.color}" ${outline()}/>` +
      `<path d="M66 278 L98 278" stroke="${style.sole}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M78 266 Q86 262 94 266" fill="none" stroke="${shade(style.color, -0.2)}" stroke-width="2.4" stroke-linecap="round"/>` +
      `</g>`
    );
  };
  return foot(false) + foot(true);
}

const star = (x: number, y: number, s: number, fill: string): string =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="${fill}" ${outline('vector-effect="non-scaling-stroke" stroke-width="2"')}/>`;

/** Acessórios: `behind` desenha-se antes do rosto (nenhum de momento); `front` por cima do cabelo. */
export function accessorySvg(id: string | null): string {
  switch (id) {
    case 'acc-bandolete':
      return `<path d="M52 82 C60 46 140 46 148 82" fill="none" stroke="#4fc1b5" stroke-width="7" stroke-linecap="round"/>`;
    case 'acc-fita':
      return (
        `<path d="M124 50 L146 38 L146 66 Z M124 50 L102 38 L102 66 Z" fill="#ff7aa2" ${outline()}/>` +
        `<circle cx="124" cy="52" r="7" fill="#ff9bb8" ${outline()}/>`
      );
    case 'acc-oculos':
      return (
        `<circle cx="80" cy="100" r="15" fill="#cfe8ff" fill-opacity=".28" ${outline()}/>` +
        `<circle cx="120" cy="100" r="15" fill="#cfe8ff" fill-opacity=".28" ${outline()}/>` +
        `<path d="M95 99 Q100 95 105 99 M65 97 L52 93 M135 97 L148 93" fill="none" ${outline('stroke-linecap="round"')}/>`
      );
    case 'acc-sol':
      return (
        `<rect x="64" y="90" width="32" height="22" rx="8" fill="#2d2a3f" ${outline()}/>` +
        `<rect x="104" y="90" width="32" height="22" rx="8" fill="#2d2a3f" ${outline()}/>` +
        `<path d="M96 96 L104 96 M64 94 L52 90 M136 94 L148 90" fill="none" ${outline('stroke-linecap="round"')}/>` +
        `<path d="M70 95 L78 95 M110 95 L118 95" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`
      );
    case 'acc-colar':
      return (
        `<path d="M82 154 Q100 172 118 154" fill="none" stroke="${INK}" stroke-width="2.6"/>` +
        star(100, 172, 1.7, '#ffd666')
      );
    case 'acc-gorro':
      return (
        `<path d="M50 78 C46 36 76 22 100 22 C124 22 154 36 150 78 C130 66 70 66 50 78 Z" fill="#e0524f" ${outline()}/>` +
        `<path d="M50 78 C70 66 130 66 150 78 L148 90 C128 80 72 80 52 90 Z" fill="#fff6e8" ${outline()}/>` +
        `<circle cx="100" cy="18" r="9" fill="#fff6e8" ${outline()}/>`
      );
    case 'acc-auscultadores':
      return (
        `<path d="M50 96 C46 30 154 30 150 96" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>` +
        `<path d="M50 96 C46 30 154 30 150 96" fill="none" stroke="#a58bf0" stroke-width="5" stroke-linecap="round"/>` +
        `<rect x="38" y="86" width="18" height="30" rx="8" fill="#6aa8ff" ${outline()}/>` +
        `<rect x="144" y="86" width="18" height="30" rx="8" fill="#6aa8ff" ${outline()}/>`
      );
    case 'acc-coroa':
      return (
        `<path d="M66 54 L72 26 L86 44 L100 20 L114 44 L128 26 L134 54 Z" fill="#ffd666" ${outline()}/>` +
        `<circle cx="100" cy="36" r="4" fill="#ff7aa2"/><circle cx="76" cy="42" r="3" fill="#6aa8ff"/><circle cx="124" cy="42" r="3" fill="#6cc791"/>`
      );
    default:
      return '';
  }
}
