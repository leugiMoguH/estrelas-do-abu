import type { AbuPose, AvatarConfig } from '../palette';
import abuHappy from '../assets/b/abu_happy.webp';
import abuSit from '../assets/b/abu_sit.webp';
import abuSleep from '../assets/b/abu_sleep.webp';
import abuThink from '../assets/b/abu_think.webp';
import campus from '../assets/b/campus.webp';
import welcome from '../assets/b/welcome.webp';
import { makeAvatarSvg } from './avatar';
import { STYLE_B } from './style';
import { roomSvg } from '../rooms';
import { starSvg } from '../scenes';

/** Direção B «Mundo Ilustrado»: cenários e Abu ilustrados (imagens geradas), avatar vetorial no estilo B. */
interface Landmarks {
  l: readonly [number, number];
  r: readonly [number, number];
  neck: readonly [number, number];
  top: readonly [number, number];
}
interface AbuImage {
  src: string;
  w: number;
  h: number;
  marks?: Landmarks;
}

const ABU: Record<'sit' | 'happy' | 'think' | 'sleep', AbuImage> = {
  sit: { src: abuSit, w: 268, h: 560, marks: { l: [92, 154], r: [163, 174], neck: [116, 245], top: [130, 118] } },
  happy: { src: abuHappy, w: 340, h: 560, marks: { l: [128, 155], r: [202, 183], neck: [160, 250], top: [170, 112] } },
  think: { src: abuThink, w: 250, h: 560, marks: { l: [97, 150], r: [165, 182], neck: [125, 235], top: [140, 108] } },
  sleep: { src: abuSleep, w: 560, h: 448 },
};
const POSE_IMAGE: Record<AbuPose, keyof typeof ABU> = {
  stand:'sit', lie:'sleep', sad:'sit',
  idle: 'sit',
  sit: 'sit',
  wag: 'happy',
  happy: 'happy',
  think: 'think',
  sleep: 'sleep',
};

const INK = '#4a2f2f';
const o = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;

function accessoryOverlay(id: string | null, m: Landmarks): string {
  if (!id) return '';
  const mid = [(m.l[0] + m.r[0]) / 2, (m.l[1] + m.r[1]) / 2];
  const dx = m.r[0] - m.l[0];
  const dy = m.r[1] - m.l[1];
  const tilt = (Math.atan2(dy, dx) * 180) / Math.PI;
  const s = Math.hypot(dx, dy) / 76;
  const at = (p: readonly number[], rot: number, body: string): string =>
    `<g transform="translate(${p[0]} ${p[1]}) rotate(${rot}) scale(${s})">${body}</g>`;
  switch (id) {
    case 'abu-coleira':
      return at(m.neck, tilt * 0.4, `<path d="M-36 -6 Q0 16 36 -6" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-36 -6 Q0 16 36 -6" fill="none" stroke="#e0524f" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="17" r="8" fill="#ffd666" ${o}/>`);
    case 'abu-laco':
      return at(m.neck, tilt * 0.4, `<path d="M0 4 L-30 -12 L-30 20 Z M0 4 L30 -12 L30 20 Z" fill="#ff7aa2" ${o}/><circle cx="0" cy="4" r="8" fill="#ff9bb8" ${o}/>`);
    case 'abu-lenco':
      return at(m.neck, tilt * 0.4, `<path d="M-42 -8 Q0 18 42 -8 L0 52 Z" fill="#4fa6e8" ${o}/><circle cx="-12" cy="8" r="3" fill="#fff"/><circle cx="12" cy="8" r="3" fill="#fff"/><circle cx="0" cy="26" r="3" fill="#fff"/>`);
    case 'abu-oculos':
      return at(mid, tilt, `<circle cx="-38" cy="0" r="25" fill="#cfe8ff" fill-opacity=".3" ${o}/><circle cx="38" cy="0" r="25" fill="#cfe8ff" fill-opacity=".3" ${o}/><path d="M-13 -2 Q0 -10 13 -2" fill="none" ${o}/>`);
    case 'abu-chapeu':
      return at(m.top, tilt, `<path d="M-36 8 L0 -78 L36 8 Z" fill="#a58bf0" ${o}/><circle cx="0" cy="-78" r="9" fill="#ffd666" ${o}/><path d="M-36 8 Q0 20 36 8" fill="none" ${o}/>`);
    default:
      return '';
  }
}

export function abuB(pose: AbuPose, accessory: string | null = null): string {
  const key = POSE_IMAGE[pose];
  const img = ABU[key];
  const overlay = img.marks ? accessoryOverlay(accessory, img.marks) : '';
  return (
    `<svg class="abu-svg abu-b abu-${pose}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${img.w} ${img.h}" role="img" aria-label="Abu, o cão pinscher">` +
    `<g class="abu-b-body"><image href="${img.src}" width="${img.w}" height="${img.h}"/>${overlay}</g></svg>`
  );
}

interface Spot {
  id: string;
  name: string;
  subject: string;
  /** Retângulo clicável na imagem 1024×1536 e centro da legenda. */
  rect: readonly [number, number, number, number];
  label: readonly [number, number];
}

const SPOTS: readonly Spot[] = [
  { id: 'ciencias', name: 'Jardim das Ciências', subject: 'Ciências Naturais', rect: [20, 100, 280, 310], label: [160, 416] },
  { id: 'historia', name: 'Museu das Descobertas', subject: 'História e Geografia', rect: [300, 150, 215, 260], label: [408, 432] },
  { id: 'ingles', name: 'Casa das Línguas', subject: 'Inglês', rect: [535, 150, 230, 260], label: [650, 428] },
  { id: 'evt', name: 'Atelier Criativo', subject: 'Educação Visual e Tecnológica', rect: [770, 190, 240, 260], label: [890, 470] },
  { id: 'musica', name: 'Estúdio Musical', subject: 'Educação Musical', rect: [770, 450, 240, 290], label: [890, 770] },
  { id: 'portugues', name: 'Biblioteca', subject: 'Português', rect: [0, 480, 460, 760], label: [226, 1255] },
  { id: 'matematica', name: 'Laboratório dos Números', subject: 'Matemática', rect: [580, 740, 440, 480], label: [800, 1255] },
];
const PLAZA: readonly Spot[] = [
  { id: 'loja', name: 'Loja', subject: '', rect: [330, 600, 150, 130], label: [405, 740] },
  { id: 'conquistas', name: 'Conquistas', subject: '', rect: [595, 550, 140, 150], label: [665, 712] },
  { id: 'minijogo', name: 'Minijogo', subject: '', rect: [545, 702, 150, 130], label: [620, 818] },
];

function pill(cx: number, cy: number, text: string, fill: string, color: string, size: number): string {
  const w = text.length * size * 0.55 + size * 1.6;
  return (
    `<g><rect x="${cx - w / 2}" y="${cy - size * 0.95}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="${fill}" stroke="${INK}" stroke-width="3"/>` +
    `<text x="${cx}" y="${cy + size * 0.28}" text-anchor="middle" font-size="${size}" font-weight="800" fill="${color}" font-family="Fredoka,Baloo 2,'Trebuchet MS',system-ui,sans-serif">${text}</text></g>`
  );
}

function hotspot(spot: Spot, active: boolean, plaza: boolean): string {
  const [x, y, w, h] = spot.rect;
  const aria = plaza ? spot.name : active ? `Abrir ${spot.name}, ${spot.subject}` : `${spot.name}, ${spot.subject}: em preparação`;
  const veil = !plaza && !active ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="#f5efe3" opacity=".42"/>` : '';
  const ring =
    !plaza && active
      ? `<rect class="map-focus map-ring" x="${x}" y="${y}" width="${w}" height="${h}" rx="44" fill="rgba(255,236,170,.10)" stroke="#ffe08a" stroke-width="7" stroke-dasharray="2 16" stroke-linecap="round"/>`
      : `<rect class="map-focus" x="${x}" y="${y}" width="${w}" height="${h}" rx="30" fill="transparent" stroke="transparent"/>`;
  // Em ecrã de telemóvel o mapa é desenhado a ~35%: textos grandes, só nos espaços ativos. Praça e inativos: ícone/etiqueta mínima.
  const tag = plaza
    ? ''
    : active
      ? pill(spot.label[0], spot.label[1], spot.subject.split(' ')[0]!, '#fff6e8', INK, 52)
      : pill(spot.label[0], spot.label[1] - 110, 'Em breve', '#efe7d8', '#6f6154', 40);
  const badge =
    !plaza && active
      ? `<g class="map-hint"><circle cx="${x + w - 24}" cy="${y + 24}" r="30" fill="#ffd25e" stroke="${INK}" stroke-width="4"/><path transform="translate(${x + w - 24} ${y + 24}) scale(3.4)" d="M0 -6 L1.8 -1.8 L6 -1.6 L2.7 1.3 L3.8 5.6 L0 3.2 L-3.8 5.6 L-2.7 1.3 L-6 -1.6 L-1.8 -1.8 Z" fill="#fff"/></g>`
      : '';
  return (
    `<g class="map-hit${!plaza && !active ? ' is-idle' : ''}" data-target="${spot.id}" role="button" tabindex="${plaza || active ? 0 : -1}" ` +
    `aria-label="${aria}" aria-disabled="${!plaza && !active}">${veil}${ring}${badge}${tag}</g>`
  );
}

export function mapB(options: { activeSubjects: readonly string[] }): string {
  const active = new Set(options.activeSubjects);
  return (
    `<svg class="map-svg map-b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1536" role="group" aria-label="Centro escolar">` +
    `<image href="${campus}" width="1024" height="1536"/>` +
    SPOTS.map((s) => hotspot(s, active.has(s.id), false)).join('') +
    PLAZA.map((s) => hotspot(s, true, true)).join('') +
    `</svg>`
  );
}

export const welcomeB = (): string =>
  `<svg class="welcome-svg welcome-b" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${welcome}" width="1536" height="1024"/></svg>`;

export const avatarB = makeAvatarSvg(STYLE_B, (config: AvatarConfig) => {
  const img = ABU.sit;
  const h = 170;
  const w = (img.w / img.h) * h;
  return (
    `<g transform="translate(205 168)"><svg viewBox="0 0 ${img.w} ${img.h}" width="${w}" height="${h}">` +
    `<image href="${img.src}" width="${img.w}" height="${img.h}"/>${img.marks ? accessoryOverlay(config.abuNeck ?? config.abuAccessory, img.marks) : ''}</svg></g>`
  );
});

export { roomSvg as roomB, starSvg as starB };
