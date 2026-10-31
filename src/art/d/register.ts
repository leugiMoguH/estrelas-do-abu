import { registerArtTheme } from '../themes';
import { mapSvg } from '../map';
import { roomSvg } from '../rooms';
import { starSvg, welcomeSvg } from '../scenes';
import { avatarD, abuD } from './compose';
registerArtTheme('d', { avatarSvg: avatarD, abuSvg: pose => `<svg class="abu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="Abu, o cão pinscher">${abuD(undefined,pose)}</svg>`, mapSvg, roomSvg, starSvg, welcomeSvg });
