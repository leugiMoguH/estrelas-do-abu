import type { AvatarOptions } from '../avatar';
import { uid, SKIN_TONES, HAIR_COLORS, type AvatarConfig } from '../palette';
import { assetUrl, BODY, MANIFEST, type Layer } from './manifest';
import { gradientFilter, thumbnailFilter } from './filters';
import { faceD } from './face';
import { accessoryD, headAccessory } from './accessories';
import { abuD } from './abu';
export { abuD } from './abu';
export type ResolveAsset = (file: string) => string | undefined;
export function avatarD(config: AvatarConfig, options: AvatarOptions = {}, resolve: ResolveAsset = assetUrl): string {
 const id = uid('d'), size = options.size ?? 220, pose = options.pose ?? 'idle';
 const skin = SKIN_TONES.find(t=>t.id===config.skin)?.hex ?? '#ebb98f';
 const hair = HAIR_COLORS.find(t=>t.id===config.hairColor)?.hex ?? '#7a4a2b';
 const hairWhite = .299*.478+.587*.290+.114*.169;
 const shared = size <= 100 && typeof document !== 'undefined' && !!document.body;
 const skinFilter = shared ? thumbnailFilter(skin) : id+'-skin';
 const hairFilter = shared ? thumbnailFilter(hair, hairWhite) : id+'-hairStyle';
 const shoes = MANIFEST[config.shoes];
 const hideFeet = !!(shoes?.file && resolve(shoes.file));
 const image = (layer: Layer): string => {
   const url = layer.file && layer.file !== layer.hairFront && resolve(layer.file);
   return url ? `<image data-layer="${layer.slot}" href="${url}" x="0" y="0" width="1024" height="1536"${layer.slot==='under'&&hideUnderBottom?` clip-path="url(#${id}-under)"`:''}${layer.slot==='skin'&&hideFeet?` clip-path="url(#${id}-feet)"`:''}${layer.slot==='skin'||layer.slot==='hairStyle'?` filter="url(#${layer.slot==='skin'?skinFilter:hairFilter})"`:''}/>` : '';
 };
 const bottom = MANIFEST[config.bottom];
 const hideUnderBottom = bottom?.covers?.includes('under-bottom') && bottom.file && resolve(bottom.file);
 const selected = Object.values(config).filter((v): v is string => typeof v==='string').map(v=>MANIFEST[v]).filter((v):v is Layer=>!!v && !!v.file);
 const layers = [...BODY,...selected].sort((a,b)=>a.z-b.z);
 const front = MANIFEST[config.hairStyle]?.hairFront;
 const frontUrl = front && resolve(front);
 return `<svg xmlns="http://www.w3.org/2000/svg" class="av av-d av-d-${pose}${options.reduceMotion?' av-d-still':''}" viewBox="0 -70 ${options.withAbu?1380:1024} 1606" width="${size}" height="${Math.round(size*1606/(options.withAbu?1380:1024))}" role="img" aria-label="A tua personagem"><defs><clipPath id="${id}-feet"><rect width="1024" height="1380"/></clipPath><clipPath id="${id}-under"><rect width="1024" height="700"/></clipPath>${shared?'':gradientFilter(skinFilter,skin)+gradientFilter(hairFilter,hair,hairWhite)}</defs><g class="avatar-d-body">${accessoryD(config.backpack,id)}${layers.map(image).join('')}${faceD(config,id)}${frontUrl?`<image data-layer="hairFront" href="${frontUrl}" width="1024" height="1536" filter="url(#${hairFilter})"/>`:''}${accessoryD(config.glasses,id)}${accessoryD(config.hat,id)}${!config.hat||!headAccessory(config)?accessoryD(config.accessory,id):''}</g>${options.withAbu?`<g transform="translate(940 1090) scale(.625)">${abuD(config,'wag',{size:640,reduceMotion:options.reduceMotion})}</g>`:''}</svg>`;
}
