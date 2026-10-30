import { uid } from '../palette';
import { gloss, line, lightOf, mix, shadowOf, shape, tone, type ArtStyle } from './style';

const STAR = 'M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z';

interface TopStyle {
  color: string;
  kind: 'tee' | 'stripes' | 'stars' | 'hoodie' | 'jacket';
}
const TOPS: Record<string, TopStyle> = {
  'top-azul': { color: '#5f9cf2', kind: 'tee' },
  'top-coral': { color: '#ff8a76', kind: 'tee' },
  'top-verde': { color: '#5fc48d', kind: 'tee' },
  'top-listras': { color: '#fffaf0', kind: 'stripes' },
  'top-estrelas': { color: '#5a6fd6', kind: 'stars' },
  'top-hoodie': { color: '#a58bf0', kind: 'hoodie' },
  'top-jaqueta': { color: '#5b86c4', kind: 'jacket' },
};
const TORSO = 'M72 150 Q100 140 128 150 Q142 156 141 178 L136 236 Q100 246 64 236 L59 178 Q58 156 72 150 Z';
export const sleeveLong = (id: string): boolean => ['hoodie', 'jacket'].includes((TOPS[id] ?? TOPS['top-azul']!).kind);

export const topColor = (id: string): string => (TOPS[id] ?? TOPS['top-azul']!).color;

export function topSvg(s: ArtStyle, id: string): string {
  const t = TOPS[id] ?? TOPS['top-azul']!;
  const clip = uid('tc');
  const dark = shadowOf(s, t.color);
  const clipDef = `<clipPath id="${clip}"><path d="${TORSO}"/></clipPath>`;
  const base = shape(s, TORSO, t.color);
  const side = `<g clip-path="url(#${clip})">${tone('M116 144 Q130 190 126 244 L146 244 L146 144 Z', dark, 0.85)}</g>`;
  const hem = line(s, 'M66 226 Q100 236 134 226', dark, 2.4, 0.9);
  const neck = line(s, 'M84 148 Q100 164 116 148', dark, 3, 1);
  switch (t.kind) {
    case 'stripes': {
      const bars = [166, 182, 198, 214, 230].map((y) => `<rect x="55" y="${y}" width="92" height="8" fill="#4f7fd9"/>`).join('');
      return clipDef + base + `<g clip-path="url(#${clip})">${bars}</g>` + side + hem + neck;
    }
    case 'stars': {
      const stars = [[88, 178], [114, 172], [100, 200], [80, 216], [122, 214]]
        .map(([x, y], i) => `<path transform="translate(${x} ${y}) scale(${i % 2 ? 1.1 : 1.4})" d="${STAR}" fill="#ffd666"/>`)
        .join('');
      return clipDef + base + stars + side + hem + neck;
    }
    case 'hoodie':
      return (
        clipDef + base + side +
        shape(s, 'M74 148 Q100 180 126 148 L130 142 Q100 166 70 142 Z', mix(t.color, '#ffffff', 0.12)) +
        shape(s, 'M82 210 L118 210 L114 232 L86 232 Z', dark) +
        line(s, 'M93 168 L93 190 M107 168 L107 190', '#fff', 3.2, 0.95) + hem
      );
    case 'jacket':
      return (
        `<path d="${TORSO}" fill="#fffaf0" stroke="${s.ink}" stroke-width="${s.line}" stroke-linejoin="round"/>` +
        shape(s, 'M72 150 Q84 146 92 148 L94 242 L64 236 L59 178 Q58 156 72 150 Z M128 150 Q116 146 108 148 L106 242 L136 236 L141 178 Q142 156 128 150 Z', t.color) +
        line(s, 'M80 190 H90 M110 190 H120 M76 212 H90 M110 212 H124', '#e4efff', 1.8, 0.7) +
        shape(s, 'M78 146 L94 168 L100 150 L106 168 L122 146 Z', '#f4f8ff')
      );
    default:
      return clipDef + base + side + hem + neck + gloss(s, 'M76 166 Q82 190 80 212', 0.55);
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
export const bottomKind = (id: string): BottomStyle['kind'] => (BOTTOMS[id] ?? BOTTOMS['bottom-calcas']!).kind;

export function bottomSvg(s: ArtStyle, id: string): string {
  const b = BOTTOMS[id] ?? BOTTOMS['bottom-calcas']!;
  const dark = shadowOf(s, b.color);
  const band = shape(s, 'M65 222 Q100 232 135 222 L136 236 Q100 246 64 236 Z', mix(b.color, '#000000', 0.08));
  if (b.kind === 'pants' || b.kind === 'shorts') {
    const end = b.kind === 'pants' ? 304 : 266;
    const leg = (x: number, w: number): string =>
      shape(s, `M${x} 228 L${x + w} 228 L${x + w - 2} ${end} L${x + 2} ${end} Z`, b.color) +
      tone(`M${x + w - 8} 232 L${x + w} 232 L${x + w - 2} ${end - 2} L${x + w - 9} ${end - 2} Z`, dark, 0.8) +
      line(s, `M${x + 6} 250 L${x + 5} ${end - 12}`, lightOf(b.color), 2, 0.5);
    return leg(70, 29) + leg(101, 29) + band + (b.kind === 'pants' ? line(s, 'M72 298 H97 M103 298 H128', dark, 2, 0.8) : '');
  }
  const clip = uid('sk');
  const d = 'M66 228 L134 228 L150 276 Q100 290 50 276 Z';
  const pleats = line(s, 'M80 232 L72 282 M100 234 L100 286 M120 232 L128 282', dark, 2, 0.8);
  const plaid =
    b.kind === 'plaid'
      ? `<clipPath id="${clip}"><path d="${d}"/></clipPath><g clip-path="url(#${clip})" stroke="${shadowOf(s, b.color)}" stroke-width="3" opacity=".7">` +
        [62, 78, 94, 110, 126, 142].map((x) => `<path d="M${x} 226 V290"/>`).join('') +
        [240, 254, 268].map((y) => `<path d="M44 ${y} H156"/>`).join('') +
        `</g>`
      : '';
  return shape(s, d, b.color) + plaid + pleats + band;
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

export function shoesSvg(s: ArtStyle, id: string): string {
  const k = SHOES[id] ?? SHOES['shoes-brancas']!;
  const dark = shadowOf(s, k.color);
  const foot = (flip: boolean): string => {
    const shaft = k.tall ? shape(s, 'M74 268 L100 268 L99 304 L75 304 Z', k.color) : '';
    return (
      `<g ${flip ? 'transform="translate(200 0) scale(-1 1)"' : ''}>` +
      shaft +
      shape(s, 'M72 302 Q71 292 84 292 L99 292 L101 318 Q100 324 94 324 L68 324 Q61 322 64 314 Q71 312 72 302 Z', k.color) +
      tone('M82 312 Q92 308 100 312 L101 318 Q100 324 94 324 L82 324 Z', dark, 0.55) +
      `<path d="M63 322 H100" stroke="${k.sole}" stroke-width="5" stroke-linecap="round"/>` +
      line(s, 'M80 298 L92 298 M80 304 L92 304', mix(k.color, '#000000', 0.25), 1.8, 0.6) +
      `</g>`
    );
  };
  return foot(false) + foot(true);
}

/** Acessórios encaixados na cabeça (centro 100,86; olhos a y=94). */
export function accessorySvg(s: ArtStyle, id: string | null): string {
  const ink = s.ink;
  switch (id) {
    case 'acc-bandolete':
      return `<path d="M60 76 C64 38 136 38 140 76" fill="none" stroke="${ink}" stroke-width="9" stroke-linecap="round"/><path d="M60 76 C64 38 136 38 140 76" fill="none" stroke="#4fc1b5" stroke-width="5.4" stroke-linecap="round"/>`;
    case 'acc-fita':
      return shape(s, 'M128 50 L152 36 L152 66 Z M128 50 L104 36 L104 66 Z', '#ff7aa2') + shape(s, 'M121 44 h14 v12 h-14 Z', '#ff9bb8');
    case 'acc-oculos':
      return (
        `<circle cx="81" cy="94" r="14.5" fill="#cfe8ff" fill-opacity=".3" stroke="${ink}" stroke-width="3"/>` +
        `<circle cx="119" cy="94" r="14.5" fill="#cfe8ff" fill-opacity=".3" stroke="${ink}" stroke-width="3"/>` +
        `<path d="M95.5 92 Q100 88 104.5 92 M66.5 91 L56 86 M133.5 91 L144 86" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
      );
    case 'acc-sol':
      return (
        shape(s, 'M66 86 h30 a4 4 0 0 1 4 4 v8 a10 10 0 0 1 -10 10 h-14 a10 10 0 0 1 -10 -10 v-8 a4 4 0 0 1 0 -4 Z', '#2d2a3f') +
        shape(s, 'M104 86 h30 a4 4 0 0 1 4 4 v8 a10 10 0 0 1 -10 10 h-14 a10 10 0 0 1 -10 -10 v-8 a4 4 0 0 1 0 -4 Z', '#2d2a3f') +
        `<path d="M100 92 H100 M66 88 L56 84 M134 88 L144 84" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M72 92 L80 92 M110 92 L118 92" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`
      );
    case 'acc-colar':
      return `<path d="M82 148 Q100 168 118 148" fill="none" stroke="${ink}" stroke-width="2.2"/><path transform="translate(100 167) scale(1.9)" d="${STAR}" fill="#ffd666" stroke="${ink}" stroke-width="1.2"/>`;
    case 'acc-gorro':
      return (
        shape(s, 'M54 80 C50 22 150 22 146 80 C128 70 72 70 54 80 Z', '#e0524f') +
        shape(s, 'M54 80 C72 70 128 70 146 80 L144 92 C126 82 74 82 56 92 Z', '#fff6e8') +
        shape(s, 'M92 22 a9 9 0 1 0 16 0 a9 9 0 1 0 -16 0 Z', '#fff6e8')
      );
    case 'acc-auscultadores':
      return (
        `<path d="M56 90 C50 22 150 22 144 90" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="M56 90 C50 22 150 22 144 90" fill="none" stroke="#a58bf0" stroke-width="6" stroke-linecap="round"/>` +
        shape(s, 'M42 82 h14 a4 4 0 0 1 4 4 v24 a4 4 0 0 1 -4 4 h-14 a8 8 0 0 1 -8 -8 v-16 a8 8 0 0 1 8 -8 Z', '#6aa8ff') +
        shape(s, 'M158 82 h-14 a4 4 0 0 0 -4 4 v24 a4 4 0 0 0 4 4 h14 a8 8 0 0 0 8 -8 v-16 a8 8 0 0 0 -8 -8 Z', '#6aa8ff')
      );
    case 'acc-coroa':
      return shape(s, 'M66 46 L72 22 L86 38 L100 16 L114 38 L128 22 L134 46 Z', '#ffd666') + `<circle cx="100" cy="32" r="3.6" fill="#ff7aa2"/><circle cx="76" cy="36" r="2.8" fill="#6aa8ff"/><circle cx="124" cy="36" r="2.8" fill="#6cc791"/>`;
    default:
      return '';
  }
}
