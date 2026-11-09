import abu from '../../art/assets/d5/abu-sit.webp';
import { type World, won } from './rules';
export function scene(s: World, animate = false): string {
  const boats = [0, 1].map((_, i) => {
    const arrived = Boolean(s.stars & (i + 1));
    const x = arrived ? (i === 0 ? 305 : 215) : 105;
    const y = 135 + i * 110;
    return `<g style="--distance:${105 - x}px;--push:${s.wind === 2 ? 170 : 60}px" class="boat ${animate && arrived && s.target === (i === 0 ? 'a' : 'b') ? 'arrived' : ''} ${animate && s.failed && s.target === (i === 0 ? 'a' : 'b') ? 'bump' : ''}" transform="translate(${x} ${y})">
      <path d="M-22 10H22L12 25H-12Z" fill="#e9b77b"/>
      <text y="6" text-anchor="middle" fill="#ffe08b" font-size="30">&#9733;</text></g>
      <text x="${i === 0 ? 305 : 215}" y="${y + 5}" class="exit">&#9734;</text>
      <text x="${i === 0 ? 305 : 215}" y="${y + 48}" class="label">${i === 0 ? 'saída distante' : 'saída próxima'}</text>
`;
  }).join('');
  return `<svg viewBox="0 0 390 370" role="img" aria-label="${s.level === 0 ? 'Caixa com estrela' : 'Dois barcos e duas saídas'}${won(s) ? ', constelação acesa' : ''}">
    <defs><pattern id="water" width="36" height="20" patternUnits="userSpaceOnUse"><path d="M0 10q9-7 18 0t18 0" fill="none" stroke="#b6f0ef" opacity=".45"/></pattern></defs>
    <circle cx="320" cy="45" r="34" fill="${won(s) ? '#ffda7d' : '#435867'}"/>
    <text x="320" y="55" text-anchor="middle" font-size="34" fill="#fff2bf">&#9733;</text>
    ${s.level === 0 ? `<path d="M180 240Q260 290 320 80" fill="none" stroke="#a0d3ca" stroke-width="5" stroke-dasharray="7 7"/>
      <rect x="125" y="225" width="100" height="60" rx="8" fill="#b78059"/>
      <path class="lid ${s.stars && animate ? 'opened' : ''}" d="M120 222H230" stroke="#ffe1a2" stroke-width="12" transform="rotate(${s.stars ? -55 : 0} 120 222)"/>
      <text class="moving-star ${s.stars && animate ? 'launched' : ''}" x="${s.stars ? 320 : 177}" y="${s.stars ? 55 : 222}" font-size="38" fill="#ffda7d">&#9733;</text>` : `
      <path d="M55 135H350M55 245H350" stroke="#376b79" stroke-width="58"/>
      <path d="M55 135H350M55 245H350" stroke="url(#water)" stroke-width="48"/>
      <path d="M352 110V162M262 220V272" stroke="#b78059" stroke-width="12"/>
      ${s.level === 2 ? `<path d="M52 190L85 135M52 190L85 245" stroke="#90dfd2" stroke-width="9"/>
        <path d="M80 110V160" stroke="${s.a ? '#90dfd2' : '#ef9a87'}" stroke-width="${s.a ? 3 : 15}"/>
        <path d="M80 220V270" stroke="${s.b ? '#90dfd2' : '#ef9a87'}" stroke-width="${s.b ? 3 : 15}"/>
        <text x="92" y="100" class="label">${s.a ? '→ corrente' : '× fechado'}</text>
        <text x="92" y="212" class="label">${s.b ? '→ corrente' : '× fechado'}</text>` : ''}
      ${boats}<text x="20" y="65" font-size="30">${s.wind === 2 ? '☁ ☁' : '☁'}</text>`}
    <image href="${abu}" x="0" y="275" width="95" height="95"/>
  </svg>`;
}
