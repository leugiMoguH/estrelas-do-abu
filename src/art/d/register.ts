import { defaultAvatar } from '../catalog';
import { registerArtTheme } from '../themes';
import { mapD as mapSvg, roomD as roomSvg, starD as starSvg, welcomeD as welcomeSvg } from './scenes';
import { avatarD, abuD } from './compose';
registerArtTheme('d', { avatarSvg: avatarD, abuSvg: (pose, config) => abuD(typeof config === 'object' && config ? config : {...defaultAvatar(),abuNeck:config?.includes('oculos')||config?.includes('chapeu')?null:config??'abu-coleira',abuHead:config?.includes('oculos')||config?.includes('chapeu')?config:null},pose), mapSvg, roomSvg, starSvg, welcomeSvg });
