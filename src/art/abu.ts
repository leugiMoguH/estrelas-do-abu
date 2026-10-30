import type { AbuPose } from './palette';
import { INK } from './palette';

/** Abu: pinscher miniatura. Desenhado sentado, de frente, numa caixa 160×150. */
const COAT = '#8a4b2c';
const COAT_DARK = '#6a3720';
const TAN = '#e0a468';
const PINK = '#f0a79c';

const ln = (w: number): string =>
  `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const line = ln(2.6);
const path = (d: string, fill: string, extra = ''): string => {
  const width = /stroke-width="([\d.]+)"/.exec(extra)?.[1];
  const rest = extra.replace(/stroke-width="[\d.]+"/, '');
  return `<path d="${d}" fill="${fill}" ${width ? ln(Number(width)) : line} ${rest}/>`;
};

function eyes(pose: AbuPose): string {
  if (pose === 'sleep' || pose === 'happy') {
    const arc = (cx: number): string =>
      `<path d="M${cx - 6} 58 Q${cx} ${pose === 'sleep' ? 63 : 50} ${cx + 6} 58" fill="none" ${ln(3)}/>`;
    return arc(68) + arc(92);
  }
  const eye = (cx: number): string =>
    `<g class="abu-eye"><ellipse cx="${cx}" cy="56" rx="5.4" ry="6.6" fill="${INK}"/>` +
    `<circle cx="${cx - 1.8}" cy="53.2" r="2.2" fill="#fff"/><circle cx="${cx + 1.8}" cy="58.6" r="1.1" fill="#fff"/></g>`;
  return eye(68) + eye(92);
}

function mouth(pose: AbuPose): string {
  if (pose === 'happy' || pose === 'wag') {
    return (
      `<path d="M72 76 Q80 90 88 76 Z" fill="#8a2f3a" ${ln(2.2)}/>` +
      `<ellipse cx="80" cy="83" rx="4.4" ry="3.2" fill="#ee7d8c"/>`
    );
  }
  return `<path d="M73 77 Q76.5 81 80 77 Q83.5 81 87 77" fill="none" ${ln(2.2)}/>`;
}

function ears(pose: AbuPose): string {
  const left =
    pose === 'think'
      ? path('M59 46 L40 36 L58 22 Z', COAT_DARK)
      : path('M59 46 L52 8 L76 36 Z', COAT_DARK) + path('M60 40 L56 18 L70 36 Z', PINK, 'stroke="none"');
  const right =
    path('M101 46 L108 8 L84 36 Z', COAT_DARK) + path('M100 40 L104 18 L90 36 Z', PINK, 'stroke="none"');
  return left + right;
}

const SPOTS = `<circle cx="68" cy="45" r="3.4" fill="${TAN}"/><circle cx="92" cy="45" r="3.4" fill="${TAN}"/>`;

function head(pose: AbuPose): string {
  const tilt =
    pose === 'think' ? ' rotate(-9 80 74)' : pose === 'sleep' ? ' translate(0 8) rotate(5 80 74)' : '';
  return (
    `<g class="abu-head" transform="${tilt.trim()}">` +
    ears(pose) +
    `<ellipse cx="80" cy="58" rx="25" ry="22" fill="${COAT}" ${line}/>` +
    `<ellipse cx="80" cy="72" rx="14" ry="11" fill="${TAN}" ${line}/>` +
    SPOTS +
    eyes(pose) +
    `<ellipse cx="80" cy="67" rx="5.4" ry="3.8" fill="${INK}"/><ellipse cx="78.4" cy="65.6" rx="1.6" ry=".9" fill="#fff" opacity=".7"/>` +
    mouth(pose) +
    `<ellipse cx="58" cy="68" rx="5" ry="3.4" fill="#ff8f9d" opacity=".5"/><ellipse cx="102" cy="68" rx="5" ry="3.4" fill="#ff8f9d" opacity=".5"/>` +
    `</g>`
  );
}

function body(): string {
  return (
    `<g class="abu-body">` +
    path('M50 142 C46 100 62 84 80 84 C98 84 114 100 110 142 Z', COAT) +
    path('M72 92 Q80 88 88 92 Q92 112 80 128 Q68 112 72 92 Z', TAN) +
    `<ellipse cx="52" cy="130" rx="13" ry="13" fill="${COAT}" ${line}/>` +
    `<ellipse cx="108" cy="130" rx="13" ry="13" fill="${COAT}" ${line}/>` +
    `<rect x="63" y="106" width="10" height="36" rx="5" fill="${COAT}" ${line}/>` +
    `<rect x="87" y="106" width="10" height="36" rx="5" fill="${COAT}" ${line}/>` +
    `<ellipse cx="68" cy="143" rx="8" ry="5" fill="${TAN}" ${line}/><ellipse cx="92" cy="143" rx="8" ry="5" fill="${TAN}" ${line}/>` +
    `<ellipse cx="40" cy="141" rx="8" ry="5" fill="${TAN}" ${line}/><ellipse cx="120" cy="141" rx="8" ry="5" fill="${TAN}" ${line}/>` +
    `</g>`
  );
}

function sleeping(accessory: string | null): string {
  return (
    `<g class="abu-body abu-sleeping">` +
    path('M22 128 C18 96 60 86 96 90 C134 94 146 112 140 134 Q80 148 22 128 Z', COAT) +
    `<ellipse cx="100" cy="132" rx="12" ry="5" fill="${TAN}" ${line}/>` +
    `<g class="abu-tail">${path('M138 124 Q154 112 152 96', 'none', 'stroke-width="6"')}</g>` +
    `<g transform="translate(-6 36) scale(.9)">${head('sleep')}</g>` +
    `<text x="118" y="60" class="abu-z" font-size="16" font-weight="800" fill="#6aa8ff">z</text>` +
    `<text x="130" y="42" class="abu-z2" font-size="20" font-weight="800" fill="#6aa8ff">Z</text>` +
    accessoryLayer(accessory, 'sleep') +
    `</g>`
  );
}

function accessoryLayer(id: string | null, pose: AbuPose): string {
  const sleepShift = pose === 'sleep' ? 'transform="translate(-6 36) scale(.9)"' : '';
  switch (id) {
    case 'abu-coleira':
      return `<g ${sleepShift}><path d="M62 80 Q80 92 98 80" fill="none" stroke="#e0524f" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="92" r="5" fill="#ffd666" ${ln(2)}/></g>`;
    case 'abu-laco':
      return `<g ${sleepShift}><path d="M80 84 L62 74 L62 96 Z M80 84 L98 74 L98 96 Z" fill="#ff7aa2" ${line}/><circle cx="80" cy="85" r="5" fill="#ff9bb8" ${ln(2)}/></g>`;
    case 'abu-lenco':
      return `<g ${sleepShift}><path d="M58 80 Q80 90 102 80 L80 112 Z" fill="#4fa6e8" ${line}/><circle cx="74" cy="90" r="2" fill="#fff"/><circle cx="86" cy="90" r="2" fill="#fff"/><circle cx="80" cy="99" r="2" fill="#fff"/></g>`;
    case 'abu-oculos':
      return `<g ${sleepShift}><circle cx="68" cy="56" r="9.5" fill="#cfe8ff" fill-opacity=".3" ${line}/><circle cx="92" cy="56" r="9.5" fill="#cfe8ff" fill-opacity=".3" ${line}/><path d="M77.5 56 L82.5 56" ${line}/></g>`;
    case 'abu-chapeu':
      return `<g ${sleepShift}><path d="M62 38 L80 6 L98 38 Z" fill="#a58bf0" ${line}/><circle cx="80" cy="6" r="4.5" fill="#ffd666" ${ln(2)}/><path d="M62 38 Q80 44 98 38" fill="none" ${line}/></g>`;
    default:
      return '';
  }
}

/** Conteúdo SVG de Abu (sem o elemento <svg>), caixa de desenho 160×150. */
export function abuInner(pose: AbuPose, accessory: string | null = null): string {
  if (pose === 'sleep') return sleeping(accessory);
  const fast = pose === 'happy' || pose === 'wag' ? ' abu-tail-fast' : '';
  const bubble =
    pose === 'think'
      ? `<circle cx="124" cy="40" r="3" fill="#fff" ${ln(1.8)}/><circle cx="132" cy="30" r="5" fill="#fff" ${ln(1.8)}/>` +
        `<ellipse cx="146" cy="14" rx="12" ry="10" fill="#fff" ${ln(1.8)}/><text x="146" y="19" text-anchor="middle" font-size="14" font-weight="800" fill="${INK}">?</text>`
      : '';
  return (
    `<g class="abu abu-${pose}">` +
    `<ellipse cx="80" cy="147" rx="52" ry="5" fill="#000" opacity=".12"/>` +
    `<g class="abu-tail${fast}">${path('M108 130 Q134 124 132 92', 'none', 'stroke-width="7"')}<path d="M108 130 Q134 124 132 92" fill="none" stroke="${COAT}" stroke-width="3.6" stroke-linecap="round"/></g>` +
    body() +
    head(pose) +
    accessoryLayer(accessory, pose) +
    bubble +
    `</g>`
  );
}

export function abuSvg(pose: AbuPose, accessory: string | null = null): string {
  return (
    `<svg class="abu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 150" role="img" aria-label="Abu, o cão pinscher">` +
    `${abuInner(pose, accessory)}</svg>`
  );
}
