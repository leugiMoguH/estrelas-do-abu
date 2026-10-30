import { gloss, line, lightOf, shadowOf, shape, tone, type ArtStyle } from './style';

/** Cabeça: centro (100, 86), largura ~84, altura ~92. Cabelo em massas com mechas desenhadas. */
const CAP =
  'M56 88 C50 46 76 30 100 30 C126 30 152 46 144 88 C140 70 130 58 112 54 C100 60 76 64 62 80 Z';

function strands(s: ArtStyle, fill: string, paths: readonly string[]): string {
  return paths.map((d) => line(s, d, shadowOf(s, fill), 1.7, 0.7)).join('');
}

/** Escalonado: círculos de raios diferentes ao longo de uma elipse formam a massa dos cachos. */
function curlyMass(s: ArtStyle, fill: string, cx: number, cy: number, rx: number, ry: number, from: number, to: number, count: number, size: number): string {
  let out = '';
  for (let i = 0; i < count; i++) {
    const t = from + ((to - from) * i) / (count - 1);
    const r = size * (0.82 + 0.28 * Math.abs(Math.sin(i * 2.3)));
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    out += shape(s, `M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`, i % 3 === 0 ? lightOf(fill) : fill);
  }
  return out;
}

export function hairBack(s: ArtStyle, style: string, fill: string): string {
  switch (style) {
    case 'hair-comprido':
      return (
        shape(s, 'M52 84 C46 40 154 40 148 84 L156 196 Q128 214 100 204 Q72 214 44 196 Z', fill) +
        tone('M100 204 Q128 214 156 196 L150 150 Q128 176 100 170 Z', shadowOf(s, fill), 0.55) +
        strands(s, fill, ['M62 100 Q56 150 54 190', 'M138 100 Q144 150 146 190', 'M78 110 Q72 160 72 200'])
      );
    case 'hair-rabo':
      return (
        shape(s, 'M134 54 C176 38 196 92 176 150 C170 168 160 176 152 168 C160 134 148 104 130 84 Z', fill) +
        tone('M152 168 C160 176 170 168 176 150 C180 134 178 118 174 106 C170 140 162 158 152 168 Z', shadowOf(s, fill), 0.6) +
        strands(s, fill, ['M146 70 Q172 96 162 150', 'M154 66 Q184 100 172 144'])
      );
    case 'hair-trancas':
      return [62, 138].map((x, k) => braid(s, fill, x, k === 1)).join('');
    case 'hair-cachos':
      return curlyMass(s, fill, 100, 92, 58, 56, Math.PI * 0.72, Math.PI * 2.28, 11, 17);
    case 'hair-franja':
      return (
        shape(s, 'M50 90 C46 40 154 40 150 90 L154 150 Q128 166 100 160 Q72 166 46 150 Z', fill) +
        tone('M100 160 Q128 166 154 150 L150 120 Q128 142 100 138 Z', shadowOf(s, fill), 0.55)
      );
    case 'hair-coque':
      return shape(s, 'M84 40 C86 12 114 12 116 40 Z', fill);
    default:
      return '';
  }
}

function braid(s: ArtStyle, fill: string, x: number, mirror: boolean): string {
  const dir = mirror ? 1 : -1;
  let out = '';
  for (let i = 0; i < 5; i++) {
    const y = 118 + i * 17;
    const cx = x + dir * (i % 2 ? -2 : 3) * 0.8;
    out += shape(s, `M${cx - 9} ${y} Q${cx} ${y - 9} ${cx + 9} ${y} Q${cx + 6} ${y + 14} ${cx} ${y + 18} Q${cx - 6} ${y + 14} ${cx - 9} ${y} Z`, i % 2 ? lightOf(fill) : fill);
  }
  return out + shape(s, `M${x - 6} 204 h12 v8 h-12 Z`, shadowOf(s, '#e5a8c0'));
}

export function hairFront(s: ArtStyle, style: string, fill: string): string {
  const light = gloss(s, 'M70 52 C82 40 98 38 112 42', 0.8);
  const soft = s.gloss ? '' : line(s, 'M68 56 C80 44 96 42 110 44', lightOf(fill), 3, 0.5);
  switch (style) {
    case 'hair-comprido':
      return (
        shape(s, 'M54 90 C48 44 74 30 100 30 C128 30 152 44 146 90 C144 66 128 56 104 54 C96 66 72 70 54 90 Z', fill) +
        strands(s, fill, ['M100 32 Q80 44 62 70', 'M100 32 Q124 42 140 68']) + light + soft
      );
    case 'hair-cachos':
      return curlyMass(s, fill, 100, 66, 46, 30, Math.PI * 1.04, Math.PI * 1.96, 8, 15) + light;
    case 'hair-coque':
      return shape(s, CAP, fill) + shape(s, 'M86 36 C88 24 112 24 114 36 C108 40 92 40 86 36 Z', shadowOf(s, fill)) + strands(s, fill, ['M100 31 Q84 42 68 64', 'M100 31 Q122 42 134 64']) + light + soft;
    case 'hair-franja':
      return (
        shape(s, 'M52 92 C46 42 74 30 100 30 C128 30 154 42 148 92 C140 80 126 74 100 74 C74 74 60 80 52 92 Z', fill) +
        strands(s, fill, ['M76 40 Q74 54 72 68', 'M100 32 Q100 50 100 66', 'M124 40 Q126 54 128 68']) + light + soft
      );
    case 'hair-rapado':
      return shape(s, 'M58 84 C56 52 76 40 100 40 C124 40 144 52 142 84 C136 64 122 54 100 54 C78 54 64 64 58 84 Z', fill, 'opacity=".9"') + soft;
    case 'hair-trancas':
    case 'hair-rabo':
      return shape(s, CAP, fill) + strands(s, fill, ['M100 31 Q84 42 68 64', 'M100 31 Q122 42 134 64']) + light + soft;
    default:
      return (
        shape(s, CAP, fill) +
        shape(s, 'M62 80 C70 66 90 60 112 54 C104 70 84 76 62 80 Z', fill) +
        strands(s, fill, ['M100 31 Q86 42 74 60', 'M126 36 Q136 48 138 64']) + light + soft
      );
  }
}
