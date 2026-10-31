import type { AvatarOptions, AvatarPose } from '../avatar';
import { HAIR_COLORS, SKIN_TONES, shade, uid, type AvatarConfig } from '../palette';
import { accessorySvg, bottomKind, bottomSvg, shoesAreTall, shoesSvg, sleeveLong, topColor, topSvg } from './clothes';
import { face } from './face';
import { hairBack, hairFront } from './hair';
import { line, mix, shadowOf, shape, tone, type ArtStyle } from './style';

const HEAD = 'M58 84 C56 50 76 38 100 38 C124 38 144 50 142 84 C141 112 124 132 100 132 C76 132 59 112 58 84 Z';

interface ArmPose {
  upper: number;
  fore: number;
}
const ARMS: Record<AvatarPose, readonly [ArmPose, ArmPose]> = {
  idle: [
    { upper: 7, fore: 4 },
    { upper: -7, fore: -4 },
  ],
  cheer: [
    { upper: 152, fore: -8 },
    { upper: -152, fore: 8 },
  ],
  think: [
    { upper: 7, fore: 4 },
    { upper: -40, fore: 186 },
  ],
};

const lookup = <T extends { id: string }>(list: readonly T[], id: string): T => list.find((x) => x.id === id) ?? list[0]!;

function hand(s: ArtStyle, skin: string, flip: boolean): string {
  const t = flip ? -1 : 1;
  return (
    shape(s, 'M-8 70 Q-9 86 0 87 Q9 86 8 70 Q0 66 -8 70 Z', skin) +
    shape(s, `M${6 * t} 72 Q${13 * t} 76 ${9 * t} 83 Q${5 * t} 79 ${6 * t} 72 Z`, skin)
  );
}

/** Braço articulado em coordenadas locais (ombro na origem, a apontar para baixo). */
function arm(s: ArtStyle, pose: ArmPose, skin: string, sleeve: string, long: boolean, sx: number, flip: boolean): string {
  const edge = (c: string): string => (s.coloredOutline ? shade(c, -0.5) : s.ink);
  const forearm = `<path d="M-7 30 L-7 70 L7 70 L7 30 Z" fill="${skin}" stroke="${edge(skin)}" stroke-width="${s.line}" stroke-linejoin="round"/>`;
  const sleeveEnd = long ? 62 : 34;
  const sleeveShape = shape(s, `M-12 -4 Q0 -11 12 -4 L13 ${sleeveEnd - 2} Q0 ${sleeveEnd + 5} -13 ${sleeveEnd - 2} Z`, sleeve);
  const cuff = long ? '' : line(s, `M-12 ${sleeveEnd - 4} Q0 ${sleeveEnd + 3} 12 ${sleeveEnd - 4}`, shadowOf(s, sleeve), 2.2, 0.9);
  return (
    `<g transform="translate(${sx} 160) rotate(${pose.upper})">` +
    `<g transform="translate(0 34) rotate(${pose.fore}) translate(0 -34)">${forearm}${hand(s, skin, flip)}</g>` +
    sleeveShape + cuff +
    `</g>`
  );
}

function legs(s: ArtStyle, skin: string, config: AvatarConfig): string {
  const kind = bottomKind(config.bottom);
  if (kind === 'pants' && !shoesAreTall(config.shoes)) return '';
  const leg = (x: number): string => shape(s, `M${x} 226 h24 v82 a12 12 0 0 1 -24 0 Z`, skin);
  return leg(75) + leg(101);
}

export function avatarBody(s: ArtStyle, config: AvatarConfig, pose: AvatarPose): string {
  const skin = lookup(SKIN_TONES, config.skin).hex;
  const hair = lookup(HAIR_COLORS, config.hairColor).hex;
  const [left, right] = ARMS[pose];
  const long = sleeveLong(config.top);
  const skinShade = shadowOf(s, skin);
  const headClip = uid('hd');
  const ear = (x: number): string => shape(s, `M${x} 84 q-9 0 -9 10 q0 10 9 10 Z`, skin);
  const earR = (x: number): string => shape(s, `M${x} 84 q9 0 9 10 q0 10 -9 10 Z`, skin);
  return (
    `<ellipse cx="100" cy="330" rx="58" ry="8" fill="#3b2a4a" opacity=".16"/>` +
    hairBack(s, config.hairStyle, hair) +
    legs(s, skin, config) +
    shoesSvg(s, config.shoes) +
    bottomSvg(s, config.bottom) +
    topSvg(s, config.top) +
    arm(s, left, skin, topColor(config.top), long, 70, false) +
    arm(s, right, skin, topColor(config.top), long, 130, true) +
    shape(s, 'M90 120 L90 150 Q100 158 110 150 L110 120 Z', skin) +
    tone('M90 134 Q100 146 110 134 L110 124 L90 124 Z', skinShade, 0.7) +
    ear(60) +
    earR(140) +
    shape(s, HEAD, skin) +
    `<clipPath id="${headClip}"><path d="${HEAD}"/></clipPath><g clip-path="url(#${headClip})">${tone('M126 40 Q150 92 124 136 L150 136 L150 40 Z', skinShade, 0.45)}</g>` +
    face(s, config.eyes, config.expression, skin, hair) +
    hairFront(s, config.hairStyle, hair) +
    accessorySvg(s, config.accessory) + accessorySvg(s, config.glasses) + accessorySvg(s, config.hat)
  );
}

export function makeAvatarSvg(s: ArtStyle, abuMarkup: (config: AvatarConfig) => string) {
  return (config: AvatarConfig, options: AvatarOptions = {}): string => {
    const pose = options.pose ?? 'idle';
    const size = options.size ?? 220;
    const body = avatarBody(s, config, pose);
    const label = `Personagem com cabelo ${config.hairStyle.replace('hair-', '')} e tom de pele ${config.skin}`;
    if (options.withAbu) {
      return (
        `<svg class="av av-with-abu av-${pose} av-${s.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 340" width="${size}" ` +
        `height="${Math.round((size * 340) / 330)}" role="img" aria-label="${label}">${body}${abuMarkup(config)}</svg>`
      );
    }
    return (
      `<svg class="av av-${pose} av-${s.id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 340" width="${size}" ` +
      `height="${Math.round(size * 1.7)}" role="img" aria-label="${label}">${body}</svg>`
    );
  };
}

export { mix };
