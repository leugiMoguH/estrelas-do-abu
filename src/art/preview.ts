import '../styles/art.css';
import {
  abuSvg,
  avatarSvg,
  mapSvg,
  roomSvg,
  welcomeSvg,
  CATALOG,
  defaultAvatar,
  EXPRESSIONS,
  EYE_STYLES,
  SKIN_TONES,
} from './index';
import type { AbuPose, AvatarConfig } from './index';
import { setArtTheme } from './index';

const tema = new URLSearchParams(location.search).get('tema');
if (tema === 'a' || tema === 'b') setArtTheme(tema);

const root = document.getElementById('preview')!;
const section = (title: string, html: string): string =>
  `<section><h2>${title}</h2><div class="row">${html}</div></section>`;
const base = defaultAvatar();
const make = (patch: Partial<AvatarConfig>, pose: 'idle' | 'cheer' | 'think' = 'idle', size = 150): string =>
  `<figure>${avatarSvg({ ...base, ...patch }, { pose, size })}<figcaption>${Object.values(patch).join(' · ') || 'base'}</figcaption></figure>`;

const hairs = CATALOG.filter((i) => i.slot === 'hairStyle');
const tops = CATALOG.filter((i) => i.slot === 'top');
const poses: AbuPose[] = ['idle', 'sit', 'happy', 'sleep', 'think', 'wag'];
const accessories = CATALOG.filter((i) => i.slot === 'accessory');

root.innerHTML =
  section('Tons de pele', SKIN_TONES.map((s) => make({ skin: s.id }, 'idle', 110)).join('')) +
  section(
    'Penteados',
    hairs
      .map((h, i) =>
        make({
          hairStyle: h.id,
          hairColor: ['castanho', 'preto', 'ruivo', 'loiro', 'azul', 'rosa', 'cinza', 'roxo'][i]!,
        }),
      )
      .join(''),
  ) +
  section(
    'Roupa',
    tops
      .map((t, i) =>
        make({
          top: t.id,
          bottom: CATALOG.filter((c) => c.slot === 'bottom')[i % 5]!.id,
          shoes: CATALOG.filter((c) => c.slot === 'shoes')[i % 4]!.id,
        }),
      )
      .join(''),
  ) +
  section(
    'Olhos e expressões',
    EYE_STYLES.map((e, i) =>
      make({ eyes: e.id, expression: EXPRESSIONS[i]!.id, skin: SKIN_TONES[(i * 2) % 8]!.id }),
    ).join(''),
  ) +
  section('Acessórios', accessories.map((a) => make({ accessory: a.id })).join('')) +
  section(
    'Poses',
    make({}, 'cheer') +
      make({}, 'think') +
      `<figure>${avatarSvg(base, { withAbu: true, size: 280 })}</figure>`,
  ) +
  section(
    'Abu',
    poses
      .map(
        (p) =>
          `<figure><div class="abu-box">${abuSvg(p, 'abu-coleira')}</div><figcaption>${p}</figcaption></figure>`,
      )
      .join(''),
  ) +
  section(
    'Acessórios do Abu',
    CATALOG.filter((c) => c.slot === 'abuAccessory')
      .map(
        (a) =>
          `<figure><div class="abu-box">${abuSvg('idle', a.id)}</div><figcaption>${a.name}</figcaption></figure>`,
      )
      .join(''),
  );

const scenes = document.createElement('div');
scenes.innerHTML =
  section(
    'Mapa',
    `<div style="width:420px">${mapSvg({ activeSubjects: ['matematica', 'portugues'] })}</div>`,
  ) +
  section(
    'Salas',
    ['matematica', 'portugues', 'ingles', 'ciencias']
      .map((s) => `<div style="width:380px">${roomSvg(s)}</div>`)
      .join(''),
  ) +
  section('Boas-vindas', `<div style="width:640px;height:480px">${welcomeSvg()}</div>`);
root.append(scenes);
