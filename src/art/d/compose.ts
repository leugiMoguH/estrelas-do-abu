import type { AvatarOptions } from '../avatar';
import { uid, SKIN_TONES, HAIR_COLORS, type AvatarConfig } from '../palette';
import { resolveAvatarCompatibility } from '../catalog';
import { assetUrl, BODY, MANIFEST, ANCHORS, type Layer } from './manifest';
import { gradientFilter, thumbnailFilter } from './filters';
import { faceD } from './face';
import { accessoryD } from './accessories';
import { abuD } from './abu';
export { abuD } from './abu';
export type ResolveAsset = (file: string) => string | undefined;

/** Back accessories/hair → body → bottom/shoes → top/coat → hands → face → fringe → front accessories. */
export function avatarD(input: AvatarConfig, options: AvatarOptions = {}, resolve: ResolveAsset = assetUrl): string {
 const fit = resolveAvatarCompatibility(input), config = fit.avatar;
 const id = uid('d'), size = options.size ?? 220, pose = options.pose ?? 'idle';
 const skin = SKIN_TONES.find(t=>t.id===config.skin)?.hex ?? '#ebb98f';
 const hair = HAIR_COLORS.find(t=>t.id===config.hairColor)?.hex ?? '#7a4a2b';
 const hairWhite = .299*.478+.587*.290+.114*.169;
 const shared = size <= 100 && typeof document !== 'undefined' && !!document.body;
 const skinFilter = shared ? thumbnailFilter(skin) : id+'-skin';
 const hairFilter = shared ? thumbnailFilter(hair, hairWhite) : id+'-hairStyle';
 const top = MANIFEST[config.top], bottom = MANIFEST[config.bottom];
 const shoes = MANIFEST[config.shoes];
 const hasBottom = !!(bottom?.file && resolve(bottom.file));
 const hasTop = !!(top?.file && resolve(top.file));
 const hasShoes = !!(shoes?.file && resolve(shoes.file));
 const underHem = Math.min(hasBottom ? (bottom.coverage?.waist ?? 1520) + 16 : 1536, hasTop ? top.coverage?.hem ?? 1536 : 1536);
 const image = (layer: Layer | undefined, name: string | undefined = layer?.slot, clip?: string): string => {
   const url = layer?.file && resolve(layer.file);
   if (!url) return '';
   const filter = layer.slot === 'skin' ? skinFilter : layer.slot === 'hairStyle' ? hairFilter : undefined;
   return `<g${layer.transform ? ` transform="${layer.transform}"` : ''}><image data-layer="${name}"${['accessory','hat','glasses','backpack'].includes(layer.slot) ? ` data-item="${config[layer.slot as 'accessory']}"` : ''} data-anchor="${layer.coverage?.anchor ?? 'head'}" href="${url}" width="1024" height="1536"${clip ? ` clip-path="url(#${id}-${clip})"` : ''}${filter ? ` filter="url(#${filter})"` : ''}/></g>`;
 };
 const selectedHair = MANIFEST[config.hairStyle];
 const hairLayer = fit.tuckHair && selectedHair?.hatFile ? {...selectedHair,file:selectedHair.hatFile} : selectedHair;
 // Partition the existing transparent export into disjoint rear/front regions.
 // Side locks lie over the shoulders; the central lengths fall behind the neck/body.
 const frontLocks = !['hair-rabo','hair-coque'].includes(config.hairStyle);
 const rearShape = frontLocks ? 'M455 330 Q460 365 435 390 Q410 420 410 500 V1536 H610 V500 Q610 420 580 390 Q555 365 560 330Z' : 'M0 330 H1024 V1536 H0Z';
 const frontShape = `<path clip-rule="evenodd" d="M0 0 H1024 V1536 H0Z ${rearShape}"/>`;
 const hairImage = (front: boolean): string => `<g${fit.tuckHair ? ` clip-path="url(#${id}-hat-fit)"` : ''}>${image(hairLayer, front ? 'hairFront' : 'hairBack', front ? 'hair-front' : 'hair-back')}</g>`;
 const body = BODY[0], under = BODY[1];
 const fullOutfit = fit.hiddenSlots.includes('bottom');
 const newLower = fullOutfit || bottom?.coverage?.skinOcclusionHem !== undefined;
 const hiddenLegHem = (fullOutfit ? top?.coverage?.skinOcclusionHem : bottom?.coverage?.skinOcclusionHem) ?? 850;
 const skinImage = `<g${newLower ? ` clip-path="url(#${id}-lower-fit)"` : ''}>${image(body, 'skin', hasShoes ? 'feet' : undefined)}</g>`;
 const outer = MANIFEST[config.outer ?? ''];
 const hasOuter = !!(outer?.file && resolve(outer.file));
 const clothes = (fullOutfit ? '' : image(bottom)) + image(shoes) + image(top, 'top', hasOuter ? 'coat-opening' : undefined) + image(outer);
 return `<svg xmlns="http://www.w3.org/2000/svg" class="av av-d av-d-${pose}${options.reduceMotion?' av-d-still':''}" viewBox="0 -70 ${options.withAbu?1380:1024} 1606" width="${size}" height="${Math.round(size*1606/(options.withAbu?1380:1024))}" role="img" aria-label="A tua personagem"><defs>
 <clipPath id="${id}-lower-fit"><path clip-rule="evenodd" d="M0 0 H1024 V1536 H0Z M385 680 H628 L650 800 V${Math.min(940,hiddenLegHem)} H350 V800Z ${hiddenLegHem>940 ? `M0 940 H1024 V${hiddenLegHem} H0Z` : ''}"/></clipPath>
 <clipPath id="${id}-feet"><rect width="1024" height="1380"/></clipPath>
 <clipPath id="${id}-under"><rect y="${hasTop && !top.coverage?.underlay ? underHem : ANCHORS.neck[1]}" width="1024" height="${hasTop && !top.coverage?.underlay ? 0 : Math.max(0, underHem - ANCHORS.neck[1])}"/></clipPath>
 <clipPath id="${id}-hair-front">${frontShape}</clipPath>
 <clipPath id="${id}-hair-back"><path d="${rearShape}"/></clipPath>
 <clipPath id="${id}-hat-fit"><rect y="95" width="1024" height="1441"/></clipPath>
 <clipPath id="${id}-coat-opening"><path d="M420 310 H600 L625 850 H395Z M0 850 H1024 V1536 H0Z"/></clipPath>
 <clipPath id="${id}-hands"><path d="M260 850 H350 V990 H260Z M650 850 H750 V990 H650Z"/></clipPath>
 ${shared?'':gradientFilter(skinFilter,skin)+gradientFilter(hairFilter,hair,hairWhite)}</defs>
 ${fit.notices.length ? `<desc>${fit.notices.join(' ')}</desc>` : ''}<g class="avatar-d-body">${image(MANIFEST[config.backpack ?? ''])}${accessoryD(config.backpack,id)}${hairImage(false)}${skinImage}${image(under, 'under', 'under')}${clothes}${image(body, 'hands', 'hands')}${faceD(config,id)}${hairImage(true)}${image(MANIFEST[config.glasses ?? ''])}${accessoryD(config.glasses,id)}${image(MANIFEST[config.hat ?? ''])}${accessoryD(config.hat,id)}${image(MANIFEST[config.accessory ?? ''])}${accessoryD(config.accessory,id,fit.headAccessoryPlacement)}</g>${options.withAbu?`<g transform="translate(940 1090) scale(.625)">${abuD(config,'wag',{size:640,reduceMotion:options.reduceMotion})}</g>`:''}</svg>`;
}
