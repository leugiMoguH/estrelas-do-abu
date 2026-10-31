import type { AvatarConfig } from '../palette';
const star = (x: number,y: number,r: number): string => Array.from({length:10},(_,i)=> {const a=i*Math.PI/5-Math.PI/2, n=i%2?r*.45:r; return `${x+Math.cos(a)*n},${y+Math.sin(a)*n}`;}).join(' ');
export function accessoryD(item: string | null, uid: string): string {
 if (!item) return '';
 let shape = '';
 if (item.startsWith('backpack-')) shape = '<path d="M350 410 Q300 340 285 470 L285 770 Q350 850 430 760 L445 470 Q430 390 350 410Z"/><path d="M330 430 Q385 350 420 450 M310 590 Q360 560 400 600 L400 730 310 730Z" fill="none"/>';
 else if (item==='acc-oculos' || item==='acc-sol' || item==='acc-oculos-estrela') shape = (item==='acc-oculos-estrela' ? [448,568].map(x=>`<polygon points="${star(x,196,43)}"/>`).join('') : [448,568].map(x=>`<ellipse cx="${x}" cy="196" rx="40" ry="35"/>`).join('')) + '<path d="M488 192 Q508 180 528 192 M408 185 L390 178 M608 185 L626 178" fill="none"/>';
 else if (item==='acc-coroa') shape = '<path d="M392 98 L385 12 453 53 507 0 562 53 630 12 620 98Z"/>';
 else if (item==='hat-sol') shape = '<ellipse cx="508" cy="108" rx="177" ry="29"/><path d="M400 100 Q408 -20 508 -20 Q608 -20 616 100Z"/>';
 else if (item==='hat-pompom' || item==='acc-gorro') shape = '<path d="M385 115 Q365 -10 508 -10 Q650 -10 630 115Z"/><rect x="380" y="82" width="255" height="45" rx="15"/>' + (item==='hat-pompom'?'<circle cx="508" cy="-25" r="35"/>':'');
 else if (item==='acc-auscultadores') shape = '<path d="M375 200 C325 -30 685 -30 640 200" fill="none" stroke-width="22"/><rect x="357" y="160" width="36" height="90" rx="16"/><rect x="623" y="160" width="36" height="90" rx="16"/>';
 else if (item==='acc-bandolete') shape = '<path d="M390 151 Q400 -10 625 151" fill="none" stroke-width="18"/>';
 else if (item==='acc-colar') shape = `<path d="M455 350 Q508 425 560 350" fill="none"/><polygon points="${star(508,414,25)}"/>`;
 else if (item==='acc-fita' || item==='acc-laco') { const y = item==='acc-fita'?100:365; shape = `<path d="M508 ${y} L460 ${y-25} Q440 ${y} 460 ${y+25}Z M508 ${y} L556 ${y-25} Q576 ${y} 556 ${y+25}Z"/><circle cx="508" cy="${y}" r="12"/>`; }
 const color = item==='backpack-azul'?'#629de2':item==='acc-coroa'||item==='acc-colar'||item==='hat-sol'?'#edbf55':item==='acc-sol'?'#34405e':item==='acc-oculos'?'#c2dde4':'#d77fa9';
 const id = `${uid}-${item}`;
 const opacity = item === 'acc-oculos' ? .25 : item === 'acc-oculos-estrela' ? .4 : 1;
 return shape ? `<defs><linearGradient id="${id}" x2=".6" y2="1"><stop stop-color="${color}"/><stop offset=".45" stop-color="${color}"/><stop offset="1" stop-color="#66506d"/></linearGradient></defs><g data-item="${item}" fill="url(#${id})" fill-opacity="${opacity}" stroke="#49332e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${shape}</g>` : '';
}
export const headAccessory = (c: AvatarConfig): boolean => c.accessory==='acc-fita'||c.accessory==='acc-bandolete';
