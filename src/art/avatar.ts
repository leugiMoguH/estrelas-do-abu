import { abuInner } from './abu';
import {
  accessorySvg,
  bottomHidesLegs,
  bottomSvg,
  shoesAreTall,
  shoesSvg,
  topColor,
  topSvg,
} from './clothes';
import { face } from './face';
import { hairBack, hairFront } from './hair';
import type { AvatarConfig } from './palette';
import { HAIR_COLORS, INK, SKIN_TONES, shade } from './palette';

export type AvatarPose = 'idle' | 'cheer' | 'think';
export interface AvatarOptions {
  pose?: AvatarPose;
  size?: number;
  withAbu?: boolean;
}

const ARMS: Record<AvatarPose, readonly [string, string]> = {
  idle: ['M70 168 Q54 192 60 218', 'M130 168 Q146 192 140 218'],
  cheer: ['M70 166 Q48 142 46 114', 'M130 166 Q152 142 154 114'],
  think: ['M70 168 Q54 192 60 218', 'M130 170 Q160 184 126 150'],
};

function arm(path: string, skin: string, sleeve: string): string {
  const hand = path.split(' ').slice(-2).map(Number) as [number, number];
  return (
    `<path d="${path}" fill="none" stroke="${INK}" stroke-width="19" stroke-linecap="round"/>` +
    `<path d="${path}" fill="none" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>` +
    `<circle cx="${hand[0]}" cy="${hand[1]}" r="8.5" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    `<path d="${path}" pathLength="100" fill="none" stroke="${sleeve}" stroke-width="14" stroke-dasharray="38 100"/>`
  );
}

const lookup = <T extends { id: string }>(list: readonly T[], id: string): T =>
  list.find((x) => x.id === id) ?? list[0]!;

function legs(skin: string, config: AvatarConfig): string {
  if (bottomHidesLegs(config.bottom) && !shoesAreTall(config.shoes)) return '';
  const leg = (x: number): string =>
    `<rect x="${x}" y="212" width="18" height="60" rx="8" fill="${skin}" stroke="${INK}" stroke-width="3"/>`;
  return leg(82) + leg(102);
}

export function avatarBody(config: AvatarConfig, pose: AvatarPose): string {
  const skin = lookup(SKIN_TONES, config.skin).hex;
  const hair = lookup(HAIR_COLORS, config.hairColor).hex;
  const sleeve = topColor(config.top);
  const [left, right] = ARMS[pose];
  return (
    `<ellipse cx="100" cy="284" rx="54" ry="8" fill="#000" opacity=".12"/>` +
    hairBack(config.hairStyle, hair) +
    legs(skin, config) +
    shoesSvg(config.shoes) +
    bottomSvg(config.bottom) +
    topSvg(config.top) +
    arm(left, skin, sleeve) +
    arm(right, skin, sleeve) +
    `<rect x="90" y="132" width="20" height="30" rx="8" fill="${shade(skin, -0.1)}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="51" cy="100" r="10" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="149" cy="100" r="10" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    `<ellipse cx="100" cy="94" rx="50" ry="47" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    face(config.eyes, config.expression, skin, hair) +
    hairFront(config.hairStyle, hair) +
    accessorySvg(config.accessory)
  );
}

export function avatarSvg(config: AvatarConfig, options: AvatarOptions = {}): string {
  const pose = options.pose ?? 'idle';
  const size = options.size ?? 220;
  const body = avatarBody(config, pose);
  const label = `Personagem com cabelo ${config.hairStyle.replace('hair-', '')} e tom de pele ${config.skin}`;
  if (options.withAbu) {
    const abu = `<g transform="translate(168 150) scale(.95)">${abuInner('wag', config.abuAccessory)}</g>`;
    return (
      `<svg class="av av-with-abu av-${pose}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 300" width="${size}" ` +
      `height="${Math.round((size * 300) / 320)}" role="img" aria-label="${label}">${body}${abu}</svg>`
    );
  }
  return (
    `<svg class="av av-${pose}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="${size}" ` +
    `height="${Math.round(size * 1.5)}" role="img" aria-label="${label}">${body}</svg>`
  );
}
