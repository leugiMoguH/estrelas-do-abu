import { PT_MAP, PT_MAP_VIEWBOX } from '../../content/historia/pt-map';
export function ptMapSvg(highlight: readonly string[]): string {
 const selected = new Set(highlight.filter(id => Object.prototype.hasOwnProperty.call(PT_MAP,id)));
 return `<svg class="pt-map" xmlns="http://www.w3.org/2000/svg" viewBox="${PT_MAP_VIEWBOX}" role="img" aria-label="Mapa de Portugal com a região em causa destacada" style="display:block;width:100%;max-width:300px;max-height:400px;margin:1rem auto;background:#dce9e8;border-radius:16px">${Object.entries(PT_MAP).map(([id,r])=>`<path d="${r.d}" fill="${selected.has(id)?'#d99c43':'#f3e7cf'}" stroke="${selected.has(id)?'#493457':'#9a897c'}" stroke-width="${selected.has(id)?2.5:0.7}" ${selected.has(id)?'stroke-dasharray="4 2"':''}/>`).join('')}</svg>`;
}
