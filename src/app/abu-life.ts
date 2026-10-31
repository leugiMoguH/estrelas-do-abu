import { abuD } from '../art/d/abu';
import { getState } from './store';
export function lifeAllowed(options: {abuLife:boolean;reduceMotion:boolean}, activeSession:boolean, test:boolean, mediaReduced=false): boolean {
 return options.abuLife && !options.reduceMotion && !mediaReduced && !activeSession && !test;
}
let stop: (()=>void)|undefined;
export function startAbuLife(main: HTMLElement, eligible: boolean): void {
 stop?.();
 const timers = new Set<ReturnType<typeof setTimeout>>();
 let cancelled=false;
 const after=(callback:()=>void,ms:number):void=>{const timer=setTimeout(()=>{timers.delete(timer);if(!cancelled && main.isConnected)callback();},ms);timers.add(timer);};
 const reduced=()=>getState().options.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
 const blinkNext=():void=>after(()=>{
  if(!reduced()) for(const el of main.querySelectorAll('.abu-sit, .abu-idle, .abu-wag')) {
   const image=el.querySelector('.abu-blink'), base=el.querySelector('.abu-base');
   if(image){image.setAttribute('visibility','visible');base?.setAttribute('visibility','hidden');}
   after(()=>{image?.setAttribute('visibility','hidden');base?.setAttribute('visibility','visible');},150);
  }
  blinkNext();
 },3000+Math.random()*4000);
 const next=():void=>after(()=>{
  if(lifeAllowed(getState().options,!eligible,false,reduced())) {
   const host=main.querySelector('.abu-life-host');
   if(host) {
    const kind=Math.floor(Math.random()*3);
    host.innerHTML=abuD(getState().profile.avatar,kind===0?'lie':'think')+(kind===1?'<svg class="abu-butterfly" viewBox="0 0 80 60"><path d="M40 30 C0 -20 0 65 40 30 C80 -20 80 65 40 30" fill="#c98bd4" stroke="#49332e"/></svg>':kind===2?'<svg viewBox="0 0 80 80"><path d="M40 5 L50 28 76 30 56 48 63 74 40 60 17 74 24 48 4 30 30 28Z" fill="#ffd666" stroke="#49332e"/></svg>':'<svg viewBox="0 0 80 80"><ellipse cx="30" cy="45" rx="13" ry="22" fill="#fff6e8" stroke="#49332e"/><text x="48" y="25">zZ</text></svg>');
    after(()=>host.replaceChildren(),3000);
   }
  }
  next();
 },60000+Math.random()*60000);
 if(eligible) {
  const host=document.createElement('aside'); host.className='abu-life-host';host.setAttribute('aria-hidden','true');main.append(host);next();
 }
 blinkNext();
 stop=()=>{cancelled=true;timers.forEach(clearTimeout);timers.clear();};
}
