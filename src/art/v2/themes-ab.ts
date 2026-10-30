import { abuInner, abuSvg as abuLegacy } from '../abu';
import { mapSvgBig as mapLegacy } from '../map';
import { roomSvg as roomLegacy } from '../rooms';
import { starSvg as starLegacy, welcomeSvg as welcomeLegacy } from '../scenes';
import { registerArtTheme } from '../themes';
import { makeAvatarSvg } from './avatar';
import { STYLE_A } from './style';
import { abuB, avatarB, mapB, roomB, starB, welcomeB } from './theme-b';

const abuA = (config: { abuAccessory: string | null }): string =>
  `<g transform="translate(176 196) scale(.98)">${abuInner('wag', config.abuAccessory)}</g>`;

registerArtTheme('a', {
  avatarSvg: makeAvatarSvg(STYLE_A, abuA),
  abuSvg: abuLegacy,
  mapSvg: mapLegacy,
  welcomeSvg: welcomeLegacy,
  roomSvg: roomLegacy,
  starSvg: starLegacy,
});

registerArtTheme('b', {
  avatarSvg: avatarB,
  abuSvg: abuB,
  mapSvg: mapB,
  welcomeSvg: welcomeB,
  roomSvg: roomB,
  starSvg: starB,
});
