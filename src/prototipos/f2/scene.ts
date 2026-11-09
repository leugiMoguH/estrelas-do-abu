import abuImage from '../../art/assets/d5/abu-sit.webp';
import { type World } from './rules';

function mechanism(level: number, world: World): string {
  if (level === 0) return `
    <rect x="158" y="151" width="115" height="61" rx="8" fill="#ba8059"/>
    <path d="M153 150H278" stroke="#ffe2aa" stroke-width="13"
      transform="rotate(${world.open ? -48 : 0} 153 150)"/>`;
  if (level === 1) return `
    <path d="M140 205L${world.bridge ? 180 : 140} ${world.bridge ? 155 : 205}
      L${world.bridge === 2 ? 320 : 290} ${world.bridge === 2 ? 155 : 205}L340 205"
      fill="none" stroke="#d7ab77" stroke-width="14"/>`;
  return `
    <path d="M170 130V212M290 130V212" stroke="#aa8cd0" stroke-width="12"/>
    <rect x="177" y="${world.open ? 96 : 142}" width="106" height="70" rx="5" fill="#b38cba"/>
    <path d="M155 220Q230 192 310 220" fill="none" stroke="#83d4e4" stroke-width="14"/>`;
}

export function scene(level: number, world: World, success: boolean): string {
  const label = ['caixa', 'ponte', 'comporta'][level];
  const lights = success ? 'lit' : '';
  return `<svg viewBox="0 0 480 270" role="img"
    aria-label="Abu junto à ${label}; ${world.stars} estrelas recuperadas">
    <path d="M0 230Q100 210 160 232T480 226V270H0" fill="#41676e"/>
    <g class="constellation ${lights}" aria-label="Constelação ${success ? 'acesa' : 'à espera'}">
      <path d="M340 65L380 30L435 60L405 105L340 65" fill="none"/>
      <g font-size="25" text-anchor="middle">
        <text x="340" y="73">&#9733;</text><text x="380" y="38">&#9733;</text>
        <text x="435" y="68">&#9733;</text><text x="405" y="113">&#9733;</text>
      </g>
    </g>
    <g fill="#ffd875">${Array.from({length: level === 0 ? 1 : 2}, (_, i) => `
      <text class="star" x="${world.stars > i ? 355 + i * 45 : world.bumped ? 145 : 195 + i * 40}"
        y="${world.stars > i ? 85 : 128}" font-size="30">&#9733;</text>`).join('')}</g>
    ${mechanism(level, world)}
    <image href="${abuImage}" x="0" y="128" width="135" height="135"/>
    ${world.echo ? '<text x="180" y="85" fill="#ffb6b0" font-size="20">eco incompleto…</text>' : ''}
  </svg>`;
}
