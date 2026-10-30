import { shade } from '../palette';
import { line, mix, type ArtStyle } from './style';

const EYE_X = [81, 119] as const;
const EYE_Y = 94;

function eye(s: ArtStyle, style: string): string {
  const k = s.eyeScale;
  const hi = (x: number, y: number, r: number): string => `<circle cx="${x * k}" cy="${y * k}" r="${r * k}" fill="#fff"/>`;
  const pupil = s.ink;
  switch (style) {
    case 'redondos':
      return `<circle r="${6.2 * k}" fill="${pupil}"/>${hi(-2, -2.4, 2)}`;
    case 'amendoa':
      return (
        `<path d="M${-9 * k} 1 Q0 ${-9 * k} ${9 * k} 1 Q0 ${8 * k} ${-9 * k} 1 Z" fill="${pupil}"/>` +
        hi(-2, -1.5, 1.9) +
        `<path d="M${9 * k} 1 L${12 * k} ${-2 * k}" stroke="${pupil}" stroke-width="2.4" stroke-linecap="round"/>`
      );
    case 'sorridentes':
      return `<path d="M${-8 * k} 3 Q0 ${-8 * k} ${8 * k} 3" fill="none" stroke="${pupil}" stroke-width="3.4" stroke-linecap="round"/>`;
    case 'estrela':
      return (
        `<ellipse rx="${7 * k}" ry="${8.6 * k}" fill="${pupil}"/><ellipse rx="${4.4 * k}" ry="${6 * k}" fill="#7a4e3c"/>` +
        `<path transform="scale(${k})" d="M-2 -5 L-0.8 -2.5 L1.8 -2.2 L-0.2 -0.4 L0.4 2.2 L-2 0.9 L-4.4 2.2 L-3.8 -0.4 L-5.8 -2.2 L-3.2 -2.5 Z" fill="#fff"/>`
      );
    default:
      return (
        `<ellipse rx="${6.8 * k}" ry="${8.4 * k}" fill="${pupil}"/><ellipse cy="${1.2 * k}" rx="${4.2 * k}" ry="${5.8 * k}" fill="#6b4636"/>` +
        hi(-2.4, -3.2, 2.6) +
        (s.gloss ? hi(2.6, 3.2, 1.3) : '')
      );
  }
}

function brows(s: ArtStyle, expression: string, hair: string): string {
  const c = shade(hair, -0.22);
  const brow = (d: string): string => line(s, d, c, 3, 0.95);
  switch (expression) {
    case 'curiosa':
      return brow('M71 80 Q81 75 91 80') + brow('M109 73 Q119 67 129 73');
    case 'calma':
      return brow('M72 81 L91 81') + brow('M109 81 L128 81');
    case 'sorriso-grande':
      return brow('M71 79 Q81 73 91 78') + brow('M109 78 Q119 73 129 79');
    default:
      return brow('M71 81 Q81 76 91 80') + brow('M109 80 Q119 76 129 81');
  }
}

function mouth(s: ArtStyle, expression: string): string {
  const ink = s.ink;
  switch (expression) {
    case 'sorriso-grande':
      return (
        `<path d="M86 112 Q100 134 114 112 Z" fill="#8a2f3a" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/>` +
        `<path d="M89 113 L111 113 L109 118 Q100 121 91 118 Z" fill="#fff"/><ellipse cx="100" cy="125" rx="6" ry="3.2" fill="#ee7d8c"/>`
      );
    case 'curiosa':
      return `<ellipse cx="100" cy="118" rx="4" ry="5" fill="#8a2f3a" stroke="${ink}" stroke-width="2.4"/>`;
    case 'calma':
      return line(s, 'M92 118 Q100 122 108 118', ink, 2.8, 1);
    case 'divertida':
      return (
        line(s, 'M89 114 Q100 126 111 114', ink, 2.8, 1) +
        `<path d="M101 120 Q110 120 108 129 Q104 134 99 129 Q97 121 101 120 Z" fill="#ee7d8c" stroke="${ink}" stroke-width="2.2" stroke-linejoin="round"/>`
      );
    default:
      return line(s, 'M90 114 Q100 126 110 114', ink, 3, 1);
  }
}

/** Rosto: olhos, sobrancelhas, nariz, boca e rubor; sombra do cabelo sobre a testa. */
export function face(s: ArtStyle, eyes: string, expression: string, skin: string, hair: string): string {
  const cheek = mix(skin, '#e8607a', 0.55);
  const nose = mix(skin, '#5b2a1e', 0.35);
  const eyeNodes = EYE_X.map((x) => `<g transform="translate(${x} ${EYE_Y})"><g class="av-eye">${eye(s, eyes)}</g></g>`).join('');
  return (
    `<ellipse cx="70" cy="106" rx="9" ry="5.6" fill="${cheek}" opacity="${s.blush}"/>` +
    `<ellipse cx="130" cy="106" rx="9" ry="5.6" fill="${cheek}" opacity="${s.blush}"/>` +
    line(s, 'M97 104 Q100 107 103 104', nose, 2.4, 0.9) +
    eyeNodes +
    brows(s, expression, hair) +
    mouth(s, expression)
  );
}
