/** Protótipo «Caderno Luminoso»: avatar, Abu e campus desenhados na mesma linguagem (contorno na cor da zona, 3 tons, luz de cima à esquerda). */
const INK = '#2E2440';

interface Ramp {
  base: string;
  shade: string;
  light: string;
  line: string;
}
const SKIN: Ramp = { base: '#EDB992', shade: '#D4906D', light: '#F8D2B4', line: '#8A4E3B' };
const HAIR: Ramp = { base: '#4B3042', shade: '#33202F', light: '#85596F', line: '#26172A' };
const HOODIE: Ramp = { base: '#B79CFF', shade: '#8F73E0', light: '#D8C9FF', line: '#5B45A8' };
const COAT: Ramp = { base: '#FFC94D', shade: '#E8A32F', light: '#FFE49A', line: '#9A5F10' };
const JEANS: Ramp = { base: '#6483DA', shade: '#4864B4', light: '#8FA8EA', line: '#2F4380' };
const SNEAKER: Ramp = { base: '#FFF6EC', shade: '#E2D3C8', light: '#FFFFFF', line: '#6A5870' };
const BOOT: Ramp = { base: '#54C6A6', shade: '#37997F', light: '#8BE0C6', line: '#1F6552' };
const FUR: Ramp = { base: '#74442F', shade: '#55301F', light: '#97613F', line: '#341B14' };
const RUST = '#D08A48';
const CORAL = '#FF8A6B';

const sh = (d: string, r: Ramp, w = 3, extra = ''): string =>
  `<path d="${d}" fill="${r.base}" stroke="${r.line}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const fill = (d: string, color: string, opacity = 1): string => `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
const stroke = (d: string, color: string, w: number, opacity = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;

const TORSO = (hem: number): string =>
  `M66 130 C66 122 80 118 100 118 C120 118 134 122 134 130 L138 190 C140 204 142 ${hem - 8} 142 ${hem} C124 ${hem + 8} 76 ${hem + 8} 58 ${hem} C58 ${hem - 8} 60 204 62 190 Z`;

/** Roupa: o mesmo esqueleto com rampas e detalhes diferentes. */
function outfit(kind: 'hoodie' | 'coat'): { torso: string; armBack: string; armDown: string; armWave: string; legs: string; shoes: string } {
  const r = kind === 'hoodie' ? HOODIE : COAT;
  const hem = kind === 'hoodie' ? 222 : 252;
  const clip = `ct-${kind}`;
  const torso =
    `<clipPath id="${clip}"><path d="${TORSO(hem)}"/></clipPath>` +
    sh('M72 124 C80 138 120 138 128 124 C134 136 124 148 100 150 C76 148 66 136 72 124 Z', r, 2.4) +
    fill('M72 124 C80 138 120 138 128 124 C128 130 124 134 118 136 C108 140 92 140 82 136 C76 134 72 130 72 124 Z', r.shade, 0.55) +
    sh(TORSO(hem), r) +
    `<g clip-path="url(#${clip})">` +
    fill('M112 120 L140 128 L144 270 L112 270 Z', r.shade, 0.5) +
    fill('M60 120 L70 120 L66 270 L56 270 Z', r.light, 0.45) +
    `</g>` +
    (kind === 'hoodie'
      ? sh('M80 192 L120 192 L127 216 L73 216 Z', r, 2) +
        fill('M80 192 L120 192 L121 197 L79 197 Z', r.shade, 0.5) +
        stroke('M92 138 L90 164 M108 138 L110 162', '#FFF6EC', 2.2) +
        `<circle cx="90" cy="166" r="2.6" fill="#FFF6EC"/><circle cx="110" cy="164" r="2.6" fill="#FFF6EC"/>` +
        `<path d="M100 150 L103 158 L111 159 L105 164 L107 172 L100 168 L93 172 L95 164 L89 159 L97 158 Z" fill="#FFC94D" stroke="#B07A10" stroke-width="1.8" stroke-linejoin="round"/>`
      : stroke('M100 140 L100 ' + (hem + 6), r.line, 1.6, 0.7) +
        [160, 190, 220].map((y) => `<circle cx="108" cy="${y}" r="3.2" fill="${r.light}" stroke="${r.line}" stroke-width="1.6"/>`).join('') +
        sh('M76 188 L92 188 L92 206 L76 206 Z', r, 1.8)) +
    stroke(kind === 'hoodie' ? 'M66 134 C64 160 66 184 64 212' : 'M66 134 C64 170 66 210 64 244', r.light, 2, 0.7);
  const sleeve = (flip: boolean, long: number): string => {
    const d = flip
      ? `M134 130 C146 136 152 160 150 ${long} L134 ${long + 2} C132 170 130 150 124 136 Z`
      : `M66 130 C54 136 48 160 50 ${long} L66 ${long + 2} C68 170 70 150 76 136 Z`;
    return sh(d, r);
  };
  const armBack = `<g>${sleeve(false, 196)}${`<ellipse cx="58" cy="206" rx="8.5" ry="9.5" fill="${SKIN.base}" stroke="${SKIN.line}" stroke-width="2.6"/>`}</g>`;
  const armDown = `<g class="arm-r">${`<ellipse cx="142" cy="206" rx="8.5" ry="9.5" fill="${SKIN.base}" stroke="${SKIN.line}" stroke-width="2.6"/>`}${sleeve(true, 196)}</g>`;
  const armWave =
    `<g class="arm-wave"><g transform="rotate(-142 134 132)">` +
    `<ellipse cx="142" cy="206" rx="8.5" ry="9.5" fill="${SKIN.base}" stroke="${SKIN.line}" stroke-width="2.6"/>${sleeve(true, 196)}</g></g>`;
  const legR = kind === 'hoodie' ? JEANS : JEANS;
  const legs =
    sh('M74 214 L98 214 L96 298 L73 298 Z', legR) +
    sh('M100 214 L126 214 L131 296 L106 300 Z', legR) +
    fill('M104 214 L126 214 L130 290 L108 292 Z', JEANS.shade, 0.5) +
    stroke('M76 224 C78 250 76 270 75 292', JEANS.light, 2, 0.6);
  const shoes =
    kind === 'hoodie'
      ? sh('M62 296 H97 L99 312 C99 322 93 326 85 326 H62 C55 326 55 318 58 314 Z', SNEAKER) +
        sh('M104 298 H133 L141 316 C143 324 137 328 129 328 H108 C101 328 101 318 104 314 Z', SNEAKER) +
        stroke('M58 321 H98 M103 322 H140', '#FFC94D', 3.4) +
        stroke('M70 300 L88 300 M112 302 L128 302', SNEAKER.line, 1.6, 0.7)
      : sh('M66 276 H97 L99 312 C99 324 93 328 85 328 H62 C55 328 55 318 58 314 L62 300 Z', BOOT) +
        sh('M104 278 H134 L142 316 C144 326 138 330 129 330 H108 C101 330 101 318 104 314 Z', BOOT) +
        stroke('M60 322 H98 M103 324 H141', BOOT.light, 3) +
        stroke('M66 284 H96 M106 286 H132', BOOT.line, 1.6, 0.7);
  return { torso, armBack, armDown, armWave, legs, shoes };
}

function eyes(kind: 'happy' | 'wow'): string {
  const w = kind === 'happy';
  const rx = w ? 9.5 : 10.6;
  const ry = w ? 11.5 : 13.6;
  const eye = (x: number): string =>
    `<g transform="translate(${x} 68)">` +
    `<ellipse rx="${rx}" ry="${ry}" fill="#FFFDF8" stroke="${HAIR.line}" stroke-width="1.4"/>` +
    `<ellipse cy="${w ? 1.5 : 0.5}" rx="${w ? 7.6 : 6.6}" ry="${w ? 9.6 : 9.2}" fill="#4A2E2A"/>` +
    `<ellipse cy="${w ? 4.2 : 3.2}" rx="${w ? 5.4 : 4.6}" ry="${w ? 5.4 : 5}" fill="#8A5440" opacity=".85"/>` +
    `<ellipse cy="${w ? 1.5 : 0.5}" rx="3" ry="4.2" fill="#24141A"/>` +
    `<circle cx="-3" cy="-3.2" r="3.2" fill="#fff"/><circle cx="3.2" cy="4.4" r="1.6" fill="#fff"/>` +
    `<path d="M${-rx - 1} -3 C${-rx + 2} ${-ry - 3} ${rx - 2} ${-ry - 3} ${rx + 1} -3" fill="none" stroke="${HAIR.line}" stroke-width="3.2" stroke-linecap="round"/>` +
    `</g>`;
  return `<g class="av-eyes">${eye(83)}${eye(117)}</g>`;
}

function face(kind: 'happy' | 'wow'): string {
  const w = kind === 'happy';
  const brows = w
    ? stroke('M74 50 Q83 45 92 49 M108 49 Q117 45 126 50', HAIR.line, 2.6)
    : stroke('M74 44 Q83 38 92 42 M108 42 Q117 38 126 44', HAIR.line, 2.6);
  const mouth = w
    ? `<path d="M89 88 Q100 106 111 88 Q100 92 89 88 Z" fill="#7A2A38" stroke="${SKIN.line}" stroke-width="1.8" stroke-linejoin="round"/>` +
      fill('M91 89 Q100 92.4 109 89 L108 91.4 Q100 95 92 91.4 Z', '#FFFDF8') +
      fill('M94.5 97.4 Q100 101.6 105.5 97.4 Q100 94.6 94.5 97.4 Z', '#FF8A8A')
    : `<ellipse cx="100" cy="93" rx="5.2" ry="6.8" fill="#7A2A38" stroke="${SKIN.line}" stroke-width="1.8"/>` +
      fill('M96 96.6 Q100 100 104 96.6 Q100 94.6 96 96.6 Z', '#FF8A8A');
  return (
    `<g class="f-${kind}">${eyes(kind)}${brows}${mouth}` +
    `<ellipse cx="73" cy="84" rx="8" ry="4.4" fill="${CORAL}" opacity="${w ? 0.38 : 0.5}"/><ellipse cx="127" cy="84" rx="8" ry="4.4" fill="${CORAL}" opacity="${w ? 0.38 : 0.5}"/>` +
    `</g>`
  );
}

const HEAD = 'M60 62 C60 34 78 22 100 22 C122 22 140 34 140 62 C140 86 126 106 100 108 C74 106 60 86 60 62 Z';
const HAIR_BACK =
  'M58 62 C48 28 74 12 100 12 C126 12 152 28 142 62 L150 130 C152 160 144 190 134 200 C128 178 122 152 120 124 L80 124 C78 152 72 178 66 200 C56 190 48 160 50 130 Z';

export function avatarSvg(): string {
  const a = outfit('hoodie');
  const b = outfit('coat');
  const headClip = `<clipPath id="hd"><path d="${HEAD}"/></clipPath>`;
  const frontHair =
    sh('M60 64 C56 34 80 18 102 18 C126 18 144 34 140 62 C134 48 124 40 112 38 C104 54 90 64 74 66 C68 68 62 70 60 64 Z', HAIR, 2.6) +
    sh('M60 62 C54 84 56 102 62 114 L72 102 C66 92 66 78 70 66 Z', HAIR, 2.2) +
    sh('M140 62 C146 84 144 102 138 114 L128 102 C134 92 134 78 130 66 Z', HAIR, 2.2) +
    stroke('M62 72 C58 88 60 100 63 110', CORAL, 4.2) +
    stroke('M80 27 C92 21 112 23 126 33', HAIR.light, 3, 0.85) +
    stroke('M84 36 C96 32 108 34 116 40', HAIR.light, 1.8, 0.5);
  const body = (o: ReturnType<typeof outfit>, id: string): string =>
    `<g class="outfit o-${id}">${o.legs}${o.shoes}${o.armBack}${o.torso}${o.armDown}${o.armWave}</g>`;
  return (
    `<g class="avatar">` +
    `<ellipse cx="100" cy="328" rx="62" ry="8" fill="${INK}" opacity=".14"/>` +
    headClip +
    sh(HAIR_BACK, HAIR, 3) +
    fill('M60 96 C56 120 58 150 62 180 L50 130 Z', HAIR.shade, 0.5) +
    body(a, 'hoodie') +
    body(b, 'coat') +
    `<g class="av-breath">` +
    sh('M91 100 L91 126 C96 132 104 132 109 126 L109 100 Z', SKIN, 2.6) +
    fill('M91 100 L109 100 L109 114 C102 120 98 120 91 114 Z', SKIN.shade, 0.6) +
    `<ellipse cx="59" cy="72" rx="5" ry="8" fill="${SKIN.base}" stroke="${SKIN.line}" stroke-width="2.4"/><ellipse cx="141" cy="72" rx="5" ry="8" fill="${SKIN.base}" stroke="${SKIN.line}" stroke-width="2.4"/>` +
    sh(HEAD, SKIN, 3) +
    `<g clip-path="url(#hd)">${fill('M120 30 Q150 70 126 112 L150 112 L150 30 Z', SKIN.shade, 0.35)}${fill('M64 52 C84 66 106 66 134 54 L134 34 L64 34 Z', SKIN.shade, 0.5)}</g>` +
    stroke('M98 80 Q100 83 103 80', SKIN.line, 1.8, 0.8) +
    face('happy') +
    face('wow') +
    frontHair +
    `</g></g>`
  );
}

function abuFace(kind: 'happy' | 'curious'): string {
  const happy = kind === 'happy';
  const ear2 = happy
    ? sh('M72 28 L84 2 C92 10 94 24 90 38 Z', FUR, 2.8)
    : sh('M72 28 L90 14 C97 22 95 31 90 38 Z', FUR, 2.8);
  const mouth = happy
    ? stroke('M44 70 Q56 80 68 70', FUR.line, 2.4) + `<path d="M52 74 Q57 82 62 74 Z" fill="#FF8A8A" stroke="${FUR.line}" stroke-width="1.6" stroke-linejoin="round"/>`
    : stroke('M46 71 Q56 74 66 70', FUR.line, 2.4);
  const brow2 = happy ? 35 : 29;
  return (
    `<g class="abu-${kind}"><g ${happy ? '' : 'transform="rotate(-11 62 60)"'}>` +
    sh('M46 32 L40 4 C52 6 62 18 62 30 Z', FUR, 2.8) +
    fill('M46 28 L43 12 C50 14 56 20 58 28 Z', '#E8A39A', 0.9) +
    ear2 +
    sh('M36 52 C36 34 50 24 66 26 C82 28 90 40 90 54 C90 66 82 74 70 74 L52 74 C42 74 36 66 36 52 Z', FUR, 3) +
    fill('M36 56 C36 70 44 76 56 76 L70 76 C74 70 72 60 62 58 Z', RUST) +
    fill('M70 30 C84 32 90 42 90 54 C88 44 80 36 70 30 Z', FUR.light, 0.6) +
    `<ellipse cx="38" cy="59" rx="5.2" ry="3.8" fill="#24141A"/><circle cx="36.4" cy="57.6" r="1.4" fill="#fff"/>` +
    `<ellipse cx="60" cy="48" rx="7.6" ry="9.2" fill="#2A1818"/><circle cx="57" cy="44" r="3.1" fill="#fff"/><circle cx="63" cy="52" r="1.6" fill="#fff"/>` +
    `<ellipse cx="78" cy="47" rx="5.4" ry="7" fill="#2A1818"/><circle cx="76.4" cy="44" r="2.2" fill="#fff"/>` +
    `<ellipse cx="60" cy="35" rx="3.6" ry="2.4" fill="${RUST}"/><ellipse cx="77" cy="${brow2}" rx="3" ry="2.2" fill="${RUST}"/>` +
    mouth +
    `</g></g>`
  );
}

export function abuSvg(): string {
  const body =
    `<ellipse cx="80" cy="142" rx="54" ry="7" fill="${INK}" opacity=".14"/>` +
    `<g class="abu-tail"><path d="M124 122 C146 118 152 96 142 82" fill="none" stroke="${FUR.line}" stroke-width="9" stroke-linecap="round"/><path d="M124 122 C146 118 152 96 142 82" fill="none" stroke="${FUR.base}" stroke-width="5" stroke-linecap="round"/></g>` +
    sh('M52 130 C44 100 56 78 76 74 C98 70 120 84 126 108 C130 124 124 140 112 142 L60 142 C54 142 52 136 52 130 Z', FUR, 3) +
    fill('M100 80 C118 86 126 106 124 126 C118 110 112 94 100 80 Z', FUR.shade, 0.55) +
    sh('M58 98 L58 138 C58 143 72 143 72 138 L72 98 Z', FUR, 2.6) +
    sh('M76 102 L76 138 C76 143 90 143 90 138 L90 102 Z', FUR, 2.6) +
    fill('M58 132 L58 138 C58 143 72 143 72 138 L72 132 Z', RUST) +
    fill('M76 132 L76 138 C76 143 90 143 90 138 L90 132 Z', RUST) +
    fill('M60 84 C66 100 80 100 84 84 L78 78 Z', RUST, 0.95) +
    abuFace('happy') +
    abuFace('curious') +
    sh('M48 80 C60 92 84 92 96 80 L98 91 C84 103 58 103 46 91 Z', { base: '#6C8CFF', shade: '#4F6CD6', light: '#9BB2FF', line: '#2F4380' }, 2.6) +
    sh('M62 98 L72 118 L80 98 Z', { base: '#6C8CFF', shade: '#4F6CD6', light: '#9BB2FF', line: '#2F4380' }, 2.2) +
    `<circle cx="70" cy="104" r="1.6" fill="#FFF6EC"/><circle cx="68" cy="110" r="1.4" fill="#FFF6EC"/>`;
  return `<g class="abu">${body}</g>`;
}

const LINE = '#8B7BA3';
const star4 = (x: number, y: number, r: number): string =>
  `<path d="M${x} ${y - r} L${x + r * 0.32} ${y - r * 0.32} L${x + r} ${y} L${x + r * 0.32} ${y + r * 0.32} L${x} ${y + r} L${x - r * 0.32} ${y + r * 0.32} L${x - r} ${y} L${x - r * 0.32} ${y - r * 0.32} Z" fill="#FFC94D" opacity=".9"/>`;

function pill(cx: number, cy: number, text: string): string {
  const w = text.length * 8.6 + 22;
  return (
    `<rect x="${cx - w / 2}" y="${cy - 14}" width="${w}" height="26" rx="13" fill="#FFF6EC" stroke="${INK}" stroke-width="2"/>` +
    `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-family="'Baloo 2','Trebuchet MS',sans-serif" font-weight="700" font-size="15" fill="${INK}">${text}</text>`
  );
}

export function campusSvg(): string {
  const bld = (d: string, c: string, w = 2): string => `<path d="${d}" fill="${c}" stroke="${LINE}" stroke-width="${w}" stroke-linejoin="round"/>`;
  return (
    `<defs><linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3D1"/><stop offset=".6" stop-color="#FFF3E6"/><stop offset="1" stop-color="#FFF6EC"/></linearGradient></defs>` +
    `<rect width="390" height="470" fill="url(#cv-sky)"/>` +
    star4(48, 40, 7) + star4(336, 28, 9) + star4(200, 22, 5) + star4(300, 70, 5) + star4(110, 76, 4) +
    fill('M0 250 C60 210 120 228 190 214 C260 200 330 226 390 206 V340 H0 Z', '#E7DDF8') +
    fill('M0 290 C80 262 150 280 230 268 C300 258 350 276 390 266 V360 H0 Z', '#D6F0E4') +
    /* edifícios de fundo: menos contraste, linha mais fina */
    bld('M150 232 H206 V268 H150 Z', '#EFE4F2', 1.6) + bld('M144 232 L178 208 L212 232 Z', '#E4D5EC', 1.6) +
    bld('M214 240 H262 V270 H214 Z', '#F4E8D8', 1.6) + bld('M210 240 L238 222 L266 240 Z', '#E9D7C2', 1.6) +
    bld('M110 244 H148 V272 H110 Z', '#E5EEF8', 1.6) + bld('M106 244 L129 228 L152 244 Z', '#D3E0F0', 1.6) +
    /* Biblioteca */
    bld('M8 214 H124 V324 H8 Z', '#FFD9C9') + bld('M0 214 L66 168 L132 214 Z', '#FF9C7F') +
    `<circle cx="66" cy="198" r="11" fill="#FFF6EC" stroke="${LINE}" stroke-width="2"/><path d="M66 191 V198 L71 201" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` +
    bld('M52 324 V270 Q66 254 80 270 V324 Z', '#A9785F') +
    bld('M20 240 H42 V270 H20 Z', '#FFF6EC') + bld('M90 240 H112 V270 H90 Z', '#FFF6EC') +
    pill(62, 126, 'Português') +
    /* Laboratório dos Números */
    bld('M262 250 H384 V324 H262 Z', '#D8F1E8') + bld('M270 250 C270 204 376 204 376 250 Z', '#BFE5F5') +
    star4(323, 232, 9) +
    bld('M310 324 V292 Q323 278 336 292 V324 Z', '#54C6A6') +
    `<circle cx="282" cy="288" r="9" fill="#FFF6EC" stroke="${LINE}" stroke-width="2"/><path d="M278 288 H286 M282 284 V292" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>` +
    pill(323, 186, 'Matemática') +
    /* árvores e chão */
    `<g><rect x="6" y="318" width="8" height="26" rx="4" fill="#B88A68"/><circle cx="10" cy="312" r="22" fill="#9ADBB8" stroke="#5FA98A" stroke-width="2"/></g>` +
    `<g><rect x="380" y="322" width="8" height="24" rx="4" fill="#B88A68"/><circle cx="384" cy="314" r="20" fill="#9ADBB8" stroke="#5FA98A" stroke-width="2"/></g>` +
    fill('M0 340 C90 330 300 330 390 340 V470 H0 Z', '#F3E3D3') +
    stroke('M0 340 C90 330 300 330 390 340', LINE, 1.8, 0.7) +
    stroke('M40 400 H350 M20 436 H370 M120 340 L60 470 M270 340 L330 470', '#E2CFBB', 2, 0.9)
  );
}

/** Cena completa: campus, avatar à esquerda, Abu à direita; as variações vêm de `data-face` e `data-outfit` no elemento-raiz (sem redesenhar). */
export function sceneSvg(): string {
  return (
    `<svg class="cv-scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 470" role="img" aria-label="Personagem e o Abu diante do campus">` +
    campusSvg() +
    `<g transform="translate(20 138) scale(.98)">${avatarSvg()}</g>` +
    `<g transform="translate(216 322) scale(.98)">${abuSvg()}</g>` +
    `<g class="cv-bubble"><path d="M246 300 C246 282 262 276 282 276 H332 C350 276 358 284 358 296 C358 310 346 316 332 316 H300 L286 328 L288 316 H270 C254 316 246 310 246 300 Z" fill="#FFF6EC" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` +
    `<text class="b-happy" x="302" y="302" text-anchor="middle" font-family="'Baloo 2','Trebuchet MS',sans-serif" font-weight="700" font-size="15" fill="${INK}">Fica-te bem!</text>` +
    `<text class="b-wow" x="302" y="302" text-anchor="middle" font-family="'Baloo 2','Trebuchet MS',sans-serif" font-weight="700" font-size="15" fill="${INK}">Uau! Que fixe!</text></g>` +
    `</svg>`
  );
}
