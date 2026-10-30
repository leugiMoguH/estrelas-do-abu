import { INK, shade } from './palette';

const EYE_X = [80, 120] as const;
const EYE_Y = 100;

function eye(style: string): string {
  switch (style) {
    case 'redondos':
      return `<circle r="6.5" fill="${INK}"/><circle cx="-2" cy="-2.5" r="2.2" fill="#fff"/>`;
    case 'amendoa':
      return (
        `<path d="M-9 1 Q0 -9 9 1 Q0 8 -9 1 Z" fill="${INK}"/>` +
        `<circle cx="-2" cy="-1.5" r="2" fill="#fff"/><path d="M-9 1 L-12 -2" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`
      );
    case 'sorridentes':
      return `<path d="M-8 3 Q0 -8 8 3" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
    case 'estrela':
      return (
        `<ellipse rx="7.5" ry="9" fill="${INK}"/><ellipse rx="4.6" ry="6.4" fill="#7a4e3c"/>` +
        `<path d="M-2 -5 L-0.8 -2.5 L1.8 -2.2 L-0.2 -0.4 L0.4 2.2 L-2 0.9 L-4.4 2.2 L-3.8 -0.4 L-5.8 -2.2 L-3.2 -2.5 Z" fill="#fff"/>`
      );
    default:
      return (
        `<ellipse rx="7.5" ry="9" fill="${INK}"/><ellipse rx="4.8" ry="6.5" fill="#6b4636"/>` +
        `<circle cx="-2.4" cy="-3.6" r="2.8" fill="#fff"/><circle cx="2.6" cy="3" r="1.4" fill="#fff" opacity=".85"/>`
      );
  }
}

function brows(expression: string, hairHex: string): string {
  const c = shade(hairHex, -0.2);
  const brow = (d: string): string =>
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`;
  switch (expression) {
    case 'curiosa':
      return brow('M70 84 Q80 78 90 84') + brow('M110 78 Q120 71 130 77');
    case 'calma':
      return brow('M70 85 L90 85') + brow('M110 85 L130 85');
    case 'sorriso-grande':
      return brow('M70 83 Q80 77 90 82') + brow('M110 82 Q120 77 130 83');
    default:
      return brow('M70 85 Q80 80 90 84') + brow('M110 84 Q120 80 130 85');
  }
}

function mouth(expression: string): string {
  switch (expression) {
    case 'sorriso-grande':
      return (
        `<path d="M85 122 Q100 146 115 122 Z" fill="#8a2f3a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M89 123 L111 123 L109 128 Q100 131 91 128 Z" fill="#fff"/>` +
        `<ellipse cx="100" cy="135" rx="6" ry="3.4" fill="#ee7d8c"/>`
      );
    case 'curiosa':
      return `<ellipse cx="100" cy="127" rx="4.2" ry="5.2" fill="#8a2f3a" stroke="${INK}" stroke-width="2.6"/>`;
    case 'calma':
      return `<path d="M91 127 Q100 131 109 127" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    case 'divertida':
      return (
        `<path d="M88 123 Q100 135 112 123" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M101 129 Q110 129 108 138 Q104 143 99 138 Q97 130 101 129 Z" fill="#ee7d8c" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`
      );
    default:
      return `<path d="M89 123 Q100 135 111 123" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
}

/** Rosto completo: bochechas, nariz, olhos, sobrancelhas e boca. */
export function face(eyes: string, expression: string, skinHex: string, hairHex: string): string {
  const cheek = shade(skinHex, -0.12);
  // A animação CSS substitui o atributo transform; por isso a posição fica num <g> exterior.
  const eyeNodes = EYE_X.map(
    (x) => `<g transform="translate(${x} ${EYE_Y})"><g class="av-eye">${eye(eyes)}</g></g>`,
  ).join('');
  return (
    `<ellipse cx="70" cy="116" rx="9" ry="6" fill="#ff8f9d" opacity=".38"/>` +
    `<ellipse cx="130" cy="116" rx="9" ry="6" fill="#ff8f9d" opacity=".38"/>` +
    `<path d="M97 112 Q100 115 103 112" fill="none" stroke="${cheek}" stroke-width="2.6" stroke-linecap="round"/>` +
    eyeNodes +
    brows(expression, hairHex) +
    mouth(expression)
  );
}
