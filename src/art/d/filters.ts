/** Mapa HLS idêntico a skin_map.py; canais normalizados entre 0 e 1. */
export function ramp(hex: string): number[][] {
  const rgb = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
  const [r,g,b] = rgb as [number,number,number];
  const max = Math.max(...rgb), min = Math.min(...rgb), l = (max+min)/2, d = max-min;
  const s = d === 0 ? 0 : d/(1-Math.abs(2*l-1));
  const h = d === 0 ? 0 : ((max === r ? (g-b)/d : max === g ? (b-r)/d+2 : (r-g)/d+4)/6+1)%1;
  const color = (dl: number, ds: number, dh: number): number[] => {
    const ll = Math.max(0,Math.min(1,l+dl)), ss = Math.max(0,Math.min(1,s+ds)), hh = (h+dh+1)%1;
    const a = ss*Math.min(ll,1-ll);
    return [0,8,4].map(n => { const k = (n+hh*12)%12; return ll-a*Math.max(-1,Math.min(k-3,9-k,1)); });
  };
  return [color(-l*.62,.05,-.012),color(-.10-l*.12,.06,-.012),rgb,color((1-l)*.30,-.04,.006)];
}
export const STOPS = [0,.22,.77,1] as const;
export function sampleRamp(colors: number[][], x: number): number[] {
  const v = Math.max(0,Math.min(1,x));
  const j = v <= .22 ? 0 : v <= .77 ? 1 : 2;
  const t = (v-STOPS[j]!)/(STOPS[j+1]!-STOPS[j]!);
  return [0,1,2].map(c => colors[j]![c]!*(1-t)+colors[j+1]![c]!*t);
}
export function gradientFilter(id: string, hex: string, sourceWhite = 207/255): string {
  const colors = ramp(hex);
  const tables = [0,1,2].map(c => Array.from({length:256},(_,i) => sampleRamp(colors,i/255)[c]!.toFixed(6)).join(' '));
  return `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${Array.from({length:3},()=>`${.299/sourceWhite} ${.587/sourceWhite} ${.114/sourceWhite} 0 0`).join(' ')} 0 0 0 1 0"/><feComponentTransfer>${['R','G','B'].map((c,i)=>`<feFunc${c} type="table" tableValues="${tables[i]}"/>`).join('')}</feComponentTransfer></filter>`;
}
