import { defaultAvatar } from '../catalog';
import { uid, type AvatarConfig, type AbuPose } from '../palette';
const images = import.meta.glob<string>('../assets/d5/*.webp', { eager: true, query: '?url', import: 'default' });
export const POSE_IMAGE: Record<AbuPose, string> = { idle:'sit', sit:'sit', wag:'sit', happy:'happy', sleep:'sleep', think:'curious', stand:'stand', lie:'lie', sad:'sad' };
type Anchor = readonly [number, number, number];
export interface AbuAnchors { head: Anchor; neck: Anchor; torso: Anchor; eyes: Anchor }
const sit: AbuAnchors = { head:[289,110,8], neck:[280,264,8], torso:[290,350,0], eyes:[264,171,17] };
/** Coordenadas medidas nas telas 640 x 640; terceiro valor = rotation em graus. */
export const ABU_ANCHORS: Record<AbuPose, AbuAnchors> = {
 idle:sit, sit, wag:sit, sad:sit,
 stand:{head:[267,106,8],neck:[262,256,8],torso:[325,318,12],eyes:[241,165,14]},
 happy:{head:[271,111,9],neck:[260,274,10],torso:[331,330,17],eyes:[242,172,15]},
 think:{head:[293,114,15],neck:[283,272,8],torso:[290,350,0],eyes:[276,177,20]},
 lie:{head:[293,149,10],neck:[281,307,8],torso:[340,388,0],eyes:[265,207,17]},
 sleep:{head:[276,211,14],neck:[278,399,-18],torso:[414,345,0],eyes:[235,310,20]},
};
export function abuAccessoryD(item: string, pose: AbuPose, id: string): string {
 const m = ABU_ANCHORS[pose];
 const body = item.includes('camisola') || item==='abu-capa';
 const head = ['abu-chapeu','abu-chapeu-festa','abu-borboleta','abu-oculos'].includes(item);
 const a = item==='abu-gravata' && pose==='sleep' ? [278,399,65] : item==='abu-oculos'?m.eyes:body?m.torso:head?m.head:m.neck;
 let shape = '';
 if (item==='abu-oculos') shape='<ellipse cx="-46" rx="30" ry="32" fill-opacity=".25"/><ellipse cx="46" rx="30" ry="32" fill-opacity=".25"/><path d="M-16 0 Q0 -12 16 0" fill="none"/>';
 else if (item==='abu-chapeu-festa') shape='<path d="M-48 0 L0 -85 48 0Z"/><circle cy="-85" r="10" fill="#f8d471"/>';
 else if (item==='abu-chapeu') shape='<ellipse rx="75" ry="15"/><path d="M-45 -5 L-38 -55 Q0 -72 38 -55 L45 -5Z"/>';
 else if (item==='abu-laco'||item==='abu-borboleta') shape='<path d="M0 0 Q-65 -48 -48 20 Q-42 42 0 0 Q65 -48 48 20 Q42 42 0 0Z"/><circle r="12"/>';
 else if (item==='abu-lenco') shape='<path d="M-48 -10 Q0 20 48 -10 L0 65Z"/>';
 else if (item==='abu-gravata') shape='<path d="M-16 -8 L16 -8 9 10 22 62 0 78 -22 62 -9 10Z"/>';
 else if (body) shape=item==='abu-capa'?'<path d="M-55 -30 Q20 -65 100 25 L130 110 Q45 128 -25 60Z"/>':'<path d="M-61 -35 Q0 -12 48 -35 L70 50 40 65 32 110 Q-10 132 -55 100 L-67 45 -85 35Z"/>';
 else shape='<path d="M-48 -10 Q0 14 48 -10 L44 6 Q0 30 -48 6Z"/>'+(item==='abu-coleira-estrela'?'<path d="M0 18 L6 30 20 32 10 42 13 56 0 49 -13 56 -10 42 -20 32 -6 30Z" fill="#ffd666"/>':'<circle cy="30" r="10" fill="#ffd666"/>');
 if (body && pose==='lie' && item!=='abu-capa') shape='<path d="M-61 -35 Q0 -12 48 -35 L66 20 Q30 49 -32 38 L-58 20 -75 14Z"/>';
 if (item==='abu-capa') shape = pose==='lie' || pose==='sleep'
  ? '<path d="M-55 -30 Q5 -54 70 0 L85 42 Q25 51 -25 22Z"/>'
  : '<path d="M-55 -30 Q20 -65 84 12 L96 62 Q32 74 -25 30Z"/>';
 const color = body?'#679fd3':head?'#b78bce':'#dc859b';
 return `<defs><linearGradient id="${id}-${item}" x2=".7" y2="1"><stop stop-color="${color}"/><stop offset=".5" stop-color="${color}"/><stop offset="1" stop-color="#65516a"/></linearGradient></defs><g data-item="${item}" transform="translate(${a[0]} ${a[1]}) rotate(${a[2]})" fill="url(#${id}-${item})" stroke="#49332e" stroke-width="3" stroke-linejoin="round">${shape}${item==='abu-camisola-listras'&&pose!=='lie'?'<path d="M-55 30 L53 30 M-52 60 L35 60 M-49 90 L33 90" stroke="#fff0d9" stroke-width="9"/>':item==='abu-camisola-listras'?'<path d="M-52 0 L53 0 M-49 24 L43 24" stroke="#fff0d9" stroke-width="9"/>':''}</g>`;
}
export function abuD(config: AvatarConfig = defaultAvatar(), pose: AbuPose = 'idle', opts: { size?: number; reduceMotion?: boolean } = {}): string {
 const id=uid('abu-d'), key=POSE_IMAGE[pose];
 const url=images[`../assets/d5/abu-${key}.webp`];
 const selected=[config.abuBody,config.abuNeck,config.abuHead].filter((v):v is string=>!!v);
 return `<svg xmlns="http://www.w3.org/2000/svg" class="abu-svg abu-d abu-${pose}${opts.reduceMotion?' abu-still':''}" data-pose="${pose}" data-config='${JSON.stringify(config)}' viewBox="0 0 640 640" width="${opts.size??220}" height="${opts.size??220}" role="img" aria-label="Abu, o cão pinscher"><g class="abu-d-body"><image class="abu-base" href="${url}" width="640" height="640"/>${key==='sit'?`<image class="abu-blink" href="${images['../assets/d5/abu-sit-blink.webp']}" width="640" height="640" visibility="hidden"/>`:''}${selected.map(i=>abuAccessoryD(i,pose,id)).join('')}</g></svg>`;
}
export type AbuReaction = 'correct'|'wrong'|'curious'|'hello'|'tutor';
export const REACTION_POSE: Record<AbuReaction, AbuPose> = {correct:'happy',wrong:'think',curious:'think',hello:'stand',tutor:'think'};
export function abuReact(container: Element, reaction: AbuReaction): void {
 const el=container.matches('.abu-d')?container:container.querySelector('.abu-d');
 if (!el) return;
 const config=JSON.parse(el.getAttribute('data-config')??'null') as AvatarConfig|null;
 el.outerHTML=abuD(config??defaultAvatar(),REACTION_POSE[reaction],{reduceMotion:el.getAttribute('class')?.includes('abu-still')??false});
}
