import { INK, shade } from './palette';

/** Cabeça: centro (100, 94), rx 50, ry 47. Cabelo em duas camadas: atrás do corpo e à frente do rosto. */
const shape = (d: string, fill: string, extra = ''): string =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
const dot = (cx: number, cy: number, r: number, fill: string): string =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="3"/>`;
const shine = (d: string, color: string): string =>
  `<path d="${d}" fill="none" stroke="${shade(color, 0.35)}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;

const CAP = 'M49 96 C44 52 74 38 100 38 C126 38 156 52 151 96 C146 78 132 66 112 62 C92 70 62 74 49 96 Z';
const CAP_SHINE = 'M70 54 C80 46 92 44 102 45';

export function hairBack(style: string, color: string): string {
  switch (style) {
    case 'hair-comprido':
      return shape('M46 92 C40 40 160 40 154 92 L162 214 C140 228 60 228 38 214 Z', color);
    case 'hair-rabo':
      return (
        shape('M138 66 C182 56 196 112 172 152 C166 124 152 108 138 102 Z', color) +
        dot(142, 76, 6, shade(color, -0.25))
      );
    case 'hair-trancas':
      return [58, 142].map((x) => braid(x, color)).join('');
    case 'hair-cachos':
      return [48, 152, 60, 140, 52, 148].map((x, i) => dot(x, 108 + (i % 3) * 18, 17, color)).join('');
    case 'hair-franja':
      return shape('M44 96 C42 40 158 40 156 96 L160 152 C140 160 60 160 40 152 Z', color);
    default:
      return '';
  }
}

function braid(x: number, color: string): string {
  const tie = dot(x, 192, 5, shade(color, -0.3));
  const links = [124, 142, 160, 178]
    .map(
      (y, i) =>
        `<ellipse cx="${x + (i % 2 ? -3 : 3)}" cy="${y}" rx="11" ry="10" fill="${color}" stroke="${INK}" stroke-width="3"/>`,
    )
    .join('');
  return links + tie;
}

export function hairFront(style: string, color: string): string {
  switch (style) {
    case 'hair-comprido':
      return shape(CAP, color) + shine(CAP_SHINE, color);
    case 'hair-cachos': {
      const top = [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = Math.PI + (i / 6) * Math.PI;
        return dot(Math.round(100 + 52 * Math.cos(angle)), Math.round(92 + 50 * Math.sin(angle)), 17, color);
      });
      return top.join('') + dot(100, 52, 18, color) + shine('M82 46 C90 40 98 40 106 42', color);
    }
    case 'hair-coque':
      return dot(100, 30, 21, color) + shape(CAP, color) + shine(CAP_SHINE, color);
    case 'hair-franja':
      return (
        shape(
          'M50 94 C46 52 74 38 100 38 C126 38 154 52 150 94 C142 82 128 76 100 76 C72 76 58 82 50 94 Z',
          color,
        ) + shine('M68 54 C80 46 92 44 104 45', color)
      );
    case 'hair-rapado':
      return shape(
        'M52 88 C52 56 76 46 100 46 C124 46 148 56 148 88 C138 68 120 60 100 60 C80 60 62 68 52 88 Z',
        shade(color, 0.05),
        'opacity=".92"',
      );
    default:
      return shape(CAP, color) + shine(CAP_SHINE, color);
  }
}
