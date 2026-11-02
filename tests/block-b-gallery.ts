import { avatarD } from '../src/art/d/compose';
import { abuD, POSE_IMAGE } from '../src/art/d/abu';
import { defaultAvatar, CATALOG } from '../src/art/catalog';
import { NEW_PIECES } from '../src/art/d/pieces';
import { SKIN_TONES, EYE_STYLES, EYE_COLORS, EXPRESSIONS, BROWS, FACE_SHAPES, type AvatarConfig, type AbuPose } from '../src/art/palette';
import '../src/styles/art.css';
const cases: {name:string;c:AvatarConfig;dog:boolean;pose:AbuPose}[] = NEW_PIECES.map((p,i)=>({name:p.name,c:{...defaultAvatar(),skin:SKIN_TONES[i%8]!.id,[p.slot]:p.id},dog:p.slot.startsWith('abu'),pose:'sit' as AbuPose}));
for(const pose of Object.keys(POSE_IMAGE) as AbuPose[]) cases.push({name:`Abu: ${pose}`,c:{...defaultAvatar(),abuBody:'m-abu-malha',abuNeck:'m-abu-lenco-pontas',abuHead:'m-abu-oculos-quadrados'},dog:true,pose});
for(let i=0;i<8;i++) cases.push({name:`Encaixe ${i+1}: conjunto, casaco e franja`,c:{...defaultAvatar(),top:i%2?'m-vestido':'m-macacao',hairStyle:['b-franja','m-cabelo-duplo','m-cabelo-longo-franja','m-cabelo-ondulado'][i%4]!,outer:['b-casaco','m-gabardina','m-casaco-capuz','m-sobretudo'][i%4]!,hat:'m-boina',accessory:i%2?'acc-bandolete':'acc-fita',skin:SKIN_TONES[i]!.id},dog:false,pose:'sit'});
for(let i=0;i<7;i++) cases.push({name:`Rosto: ${EYE_STYLES[i]!.name}`,c:{...defaultAvatar(),hairStyle:'m-cabelo-pixie',eyes:EYE_STYLES[i]!.id,eyeColor:EYE_COLORS[i%6]!.id,expression:EXPRESSIONS[i]!.id,brows:BROWS[i%3]!.id,faceShape:FACE_SHAPES[i%3]!.id,skin:SKIN_TONES[i]!.id},dog:false,pose:'sit'});
for (const [i,x] of cases.entries()) {
 let section=document.querySelector(`section[data-sheet="${Math.floor(i/16)}"]`);
 if(!section){section=document.createElement('section');section.setAttribute('data-sheet',String(Math.floor(i/16)));document.querySelector('main')!.append(section);}
 const f=document.createElement('figure');f.dataset.case=String(i);
 f.innerHTML=(x.dog?abuD(x.c,x.pose,{size:300,reduceMotion:true}):avatarD(x.c,{size:300,reduceMotion:true}))+`<figcaption>${i+1}. ${x.name}</figcaption>`;
 section.append(f);
}
document.documentElement.dataset.ready=String(cases.length);
// Expose counts without creating another product route.
console.info('Peças novas',NEW_PIECES.length,'Catálogo',CATALOG.length);
