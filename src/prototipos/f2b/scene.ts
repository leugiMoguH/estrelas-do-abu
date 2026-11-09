import abu from '../../art/assets/d5/abu-sit.webp';
import { BOAT_START, STEP, exitX, type Word, type World, won } from './rules';
export function scene(s: World, animate = false, selected?: Word): string {
  const boats = [0, 1].map((_, i) => {
    const arrived = Boolean(s.stars & (i + 1));
    const target = i === 0 ? 'a' : 'b';
    const x = arrived ? exitX(target) : BOAT_START;
    const y = 135 + i * 110;
    const connected = s.level !== 2 || (i === 0 ? s.a && !s.b : s.b && !s.a);
    return `<g style="--distance:${BOAT_START - x}px;--push:${connected ? s.wind * STEP : 0}px" class="boat ${animate && arrived && s.target === (i === 0 ? 'a' : 'b') ? 'arrived' : ''} ${animate && s.failed && !arrived && s.target === (i === 0 ? 'a' : 'b') ? 'bump' : ''}" transform="translate(${x} ${y})">
      <path d="M-22 10H22L12 25H-12Z" fill="#e9b77b"/>
      <text y="6" text-anchor="middle" fill="#ffe08b" font-size="30">&#9733;</text></g>
      <text x="${exitX(i === 0 ? 'a' : 'b')}" y="${y + 5}" class="exit">&#9734;</text>
      <text x="${exitX(i === 0 ? 'a' : 'b')}" y="${y + 48}" class="label">${i === 0 ? 'saída distante' : 'saída próxima'}</text>
`;
  }).join('');
  const clouds = Array.from({length: 2}, (_, i) => `<g class="cloud ${animate && i < s.wind ? 'blowing' : ''} ${i < (selected === 'sopra' ? 1 : selected === 'sopram' ? 2 : 0) ? 'selected-cloud' : ''}" transform="translate(${24 + i * 84} 48)">
    <path d="M0 12C-12 12-12-5 0-5C-2-23 26-25 29-10C47-16 56 12 37 12Z" fill="#e6f6f4"/>
    ${animate && i < s.wind ? '<path class="gust" d="M42 0h23m-20 8h30m-29 8h20" stroke="#b6f0ef" stroke-width="3" stroke-linecap="round"/>' : ''}</g>`).join('');
  const gates = [s.a, s.b].map((open, i) => `<g class="gate ${open ? 'gate-open' : 'gate-closed'}" transform="translate(55 ${135 + i * 110})" data-open="${open}">
    <path d="M-8-29H8M-8 29H8" stroke="#ffe1a2" stroke-width="7"/>
    <path class="gate-door" d="${open ? 'M0-26L25-38' : 'M0-26V26'}" stroke="${open ? '#90dfd2' : '#ef9a87'}" stroke-width="10"/>
    ${open ? '<path class="current" d="M12-9l10 9-10 9m18-18l10 9-10 9" fill="none" stroke="#b6f0ef" stroke-width="3"/>' : ''}</g>`).join('');
  return `<svg viewBox="0 0 390 370" role="img" aria-label="${s.level === 0 ? 'Caixa com estrela' : 'Dois barcos e duas saídas'}${won(s) ? ', constelação acesa' : ''}">
    <defs><pattern id="water" width="36" height="20" patternUnits="userSpaceOnUse"><path d="M0 10q9-7 18 0t18 0" fill="none" stroke="#b6f0ef" opacity=".45"/></pattern></defs>
    <circle cx="320" cy="45" r="34" fill="${won(s) ? '#ffda7d' : '#435867'}"/>
    <g stroke="${won(s) ? '#ffe39b' : '#6b8994'}" fill="${won(s) ? '#ffe39b' : '#6b8994'}">
      <path d="M270 32L320 45L354 22L365 72L320 45L282 78" fill="none"/>
      <circle cx="270" cy="32" r="3"/><circle cx="354" cy="22" r="3"/>
      <circle cx="365" cy="72" r="3"/><circle cx="282" cy="78" r="3"/>
    </g>
    <text x="320" y="55" text-anchor="middle" font-size="34" fill="#fff2bf">&#9733;</text>
    ${s.level === 0 ? `<path d="M180 240Q260 290 320 80" fill="none" stroke="#a0d3ca" stroke-width="5" stroke-dasharray="7 7"/>
      <rect x="125" y="225" width="100" height="60" rx="8" fill="#b78059"/>
      <g transform="translate(120 222)"><path class="lid ${s.stars && animate ? 'opened' : ''}" d="M0 0H110" stroke="#ffe1a2" stroke-width="12" transform="rotate(${s.stars ? -55 : 0})"/></g>
      <text class="moving-star ${s.stars && animate ? 'launched' : ''}" x="${s.stars ? 320 : 177}" y="${s.stars ? 55 : 222}" font-size="38" fill="#ffda7d">&#9733;</text>` : `
      <path d="M55 135H350M55 245H350" stroke="#376b79" stroke-width="58"/>
      <path class="water ${s.level !== 2 || s.a ? s.level === 2 && s.a && s.b ? 'flowing divided' : 'flowing' : 'still'}" d="M55 135H350" stroke="url(#water)" stroke-width="${s.level === 2 && !s.a ? 0 : s.level === 2 && s.b ? 24 : 48}"/>
      <path class="water ${s.level !== 2 || s.b ? s.level === 2 && s.a && s.b ? 'flowing divided' : 'flowing' : 'still'}" d="M55 245H350" stroke="url(#water)" stroke-width="${s.level === 2 && !s.b ? 0 : s.level === 2 && s.a ? 24 : 48}"/>
      <path d="M${exitX('a') + STEP / 2} 110V162M${exitX('b') + STEP / 2} 220V272" stroke="#b78059" stroke-width="12"/>
      ${s.level === 2 ? `<path d="M52 190L85 135M52 190L85 245" stroke="#90dfd2" stroke-width="9"/>
        ${gates}` : ''}
      ${[135, 245].map(y => [1, 2].map(step => `<path class="step-mark" d="M${BOAT_START + step * STEP} ${y - 26}v8"/>`).join('')).join('')}
      ${boats}${clouds}`}
    <image href="${abu}" x="0" y="275" width="95" height="95"/>
  </svg>`;
}
