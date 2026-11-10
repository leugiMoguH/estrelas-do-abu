import type { Cone, Flavour } from './rules';
export const colours: Record<Flavour, string> = { vanilla: '#fff0c7', chocolate: '#91583f', strawberry: '#f499b3', mint: '#9addc0' };
export function ice(cone: Cone): string {
  const top = 112 - (cone.scoops.length - 1) * 54;
  return `<svg viewBox="0 0 180 240" aria-hidden="true">
<defs>
<linearGradient id="waffle" x2="1" y2="1">
<stop stop-color="#f5cf8b"/>
<stop offset="1" stop-color="#ba783e"/>
</linearGradient>
</defs>
<ellipse cx="90" cy="224" rx="38" ry="8" fill="#4a2f2725"/>
<path d="M46 119H134L90 222Z" fill="url(#waffle)" stroke="#80512e" stroke-width="3"/>
<path d="M55 140L103 190M65 121L115 171M85 121L126 153M125 140L77 190M115 121L65 171M95 121L54 153" stroke="#a56d37" stroke-width="2"
  opacity=".55"/>${cone.scoops.map((f, i) => `<g class="scoop">
<path d="M47 ${112-i*54}C32 ${85-i*54} 49 ${59-i*54} 73 ${61-i*54}C94 ${45-i*54} 132 ${63-i*54} 132 ${87-i*54}Q150 ${120-i*54} 119
  ${125-i*54}Q105 ${133-i*54} 91 ${124-i*54}Q72 ${134-i*54} 59 ${124-i*54}Q40 ${129-i*54} 47
  ${112-i*54}Z" fill="${colours[f]}" stroke="#654335" stroke-width="3"/>
<path d="M58 ${88-i*54}Q67 ${70-i*54} 84 ${72-i*54}" fill="none" stroke="#ffffff75" stroke-width="7" stroke-linecap="round"/>
</g>`).join('')}${cone.scoops.length && cone.sauce ? `<path d="M51 ${top-21}Q90 ${top-47} 130 ${top-21}L123 ${top-3}Q113 ${top+8} 106
  ${top-13}Q92 ${top+5} 82 ${top-13}Q65 ${top+3} 51 ${top-21}" fill="#efb544" stroke="#814517" stroke-width="2"/>
<path d="M65 ${top-24}Q89 ${top-35} 112 ${top-24}" fill="none" stroke="#fff0ac" stroke-width="4" stroke-linecap="round"/>` :
  ''}${cone.scoops.length && cone.sprinkles ? Array.from({length: 12}, (_,i) => `<path d="M${60+i%5*14} ${top-34+Math.floor(i/5)*12}l5 4"
  stroke="${['#fff6e8','#fa797c','#ffd666','#5ba9cb'][i%4]}" stroke-width="4" stroke-linecap="round"/>`).join('') : ''}</svg>`;
}
export function visitor(index: number, cone: Cone | null): string {
  const skin = index === 0 ? '#a86d44' : '#f6cdb0';
  return `<svg viewBox="0 0 230 230" aria-hidden="true">
<defs>
<linearGradient id="shirt${index}" x2="1" y2="1">
<stop stop-color="${index ? '#b5a3e9' : '#6ed3c7'}"/>
<stop offset="1" stop-color="${index ? '#7764ac' : '#368c91'}"/>
</linearGradient>
</defs>
<ellipse cx="115" cy="219" rx="78" ry="9" fill="#071a3433"/>
<g stroke="#4a2f27" stroke-width="3" stroke-linejoin="round">
<path d="M68 131Q115 108 164 133L183 185L157 197L151 162L158 213Q115 233 69 213L78 161L64 191L44 178Z" fill="url(#shirt${index})"/>
<path d="M47 177Q41 191 59 201L86 207Q99 206 96 195L66 185L64 180Z" fill="${skin}"/>
<path d="M165 188L174 175Q179 169 185 176L190 192Q178 216 157 204L151 194Z" fill="${skin}"/>
<path d="M105 112V136Q116 147 128 134V112" fill="${skin}"/>${index === 0 ? `<path d="M65 79Q30 75 42 37Q58 13 83 39M161 78Q199 78 190
  39Q174 13 151 38" fill="#35251f"/>` : ''}<ellipse cx="69" cy="84" rx="12" ry="17" fill="${skin}"/>
<ellipse cx="162" cy="84" rx="12" ry="17" fill="${skin}"/>
<path d="M67 58Q70 17 117 21Q164 22 166 62L158 105Q147 132 115 132Q83 130 72 105Z" fill="${skin}"/>
<path d="M66 71Q54 20 103 17Q163 5 170 59L160 77L149 49Q116 68 81 52L74 76Z" fill="${index ? '#945a35' : '#35251f'}"/>
<path d="M83 72Q92 67 101 72M132 72Q141 67 150 72" fill="none"/>
<ellipse cx="93" cy="86" rx="6" ry="8" fill="#30233e"/>
<ellipse cx="140" cy="86" rx="6" ry="8" fill="#30233e"/>
<path d="M114 86L110 100H118" fill="none" opacity=".5"/>
<path d="M101 109Q116 ${cone ? 132 : 122} 133 108" fill="${cone ? '#fff6e8' : 'none'}"/>
<circle cx="91" cy="83" r="2" fill="white"/>
<circle cx="138" cy="83" r="2" fill="white"/>${index ? `<g fill="none" stroke="#554269">
<rect x="77" y="75" width="31" height="25" rx="10"/>
<rect x="125" y="75" width="31" height="25" rx="10"/>
<path d="M108 83H125"/>
</g>` : `<path d="M108 146L116 156L125 146" fill="#fff0c7"/>`}</g>${cone ? `<g transform="translate(147 103) scale(.47)">${ice(cone)}</g>
<path d="M176 183Q180 175 188 179L196 185Q201 194 193 198L181 195Z" fill="${skin}" stroke="#4a2f27" stroke-width="2"/>` : ''}<ellipse
  cx="115" cy="222" rx="78" ry="7" fill="#213b4d" opacity=".65"/>
</svg>`;
}
export function sky(served: boolean[]): string {
  const complete = served.every(Boolean);
  return `<svg class="sky" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="night" x2="0" y2="1">
<stop stop-color="#152343"/>
<stop offset="1" stop-color="#405578"/>
</linearGradient>
<radialGradient id="glow">
<stop stop-color="#ffd666" stop-opacity=".4"/>
<stop offset="1" stop-color="#ffd666" stop-opacity="0"/>
</radialGradient>
</defs>
<path fill="url(#night)" d="M0 0H1200V720H0Z"/>${Array.from({length: 65}, (_,i) => `<circle cx="${i*137%1200}" cy="${i*89%550}"
  r="${i%3+1}" fill="#fff6e8" opacity="${.25+i%4*.15}"/>`).join('')}</svg>
<svg class="garland" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
<path d="M0 0Q600 190 1200 0" fill="none" stroke="#a39287" stroke-width="3"/>${[120,310,500,700,890,1080].map((x,i) => {const y =
  40+Math.sin(x/1200*Math.PI)*68; const lit = complete || (i === 1 && served[0]) || (i === 4 && served[1]); return `<g class="lantern
  ${lit ? 'lit' : ''}" transform="translate(${x} ${y})">
<path d="M0 -25V0" stroke="#b9a28a" stroke-width="2"/>${lit ? `<circle r="66" fill="#ffd666" opacity=".12"/>` : ''}<path d="M0 -19L7 -5L24
  -3L12 9L15 25L0 17L-15 25L-12 9L-24 -3L-7 -5Z" fill="${lit ? '#ffdf7e' : '#69717f'}" stroke="${lit ? '#fff3b0' :
  '#9c9692'}" stroke-width="3"/>
<path d="M0 -12V14M-16 -1L15 14M16 -1L-15 14" stroke="#ae7b49" opacity=".4"/>
</g>`;}).join('')}</svg>
<svg class="ground" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
<path d="M0 598Q150 492 300 582Q490 477 640 565Q900 475 1200 558V720H0" fill="#213b4d"/>
<path d="M0 655Q380 605 650 649T1200 625V720H0" fill="#53605a"/>
</svg>`;
}
