import { avatarD } from '../src/art/d/compose';
import { defaultAvatar } from '../src/art/catalog';
import '../src/styles/art.css';
const base = defaultAvatar();
const combos = [
  { skin: 'ebano', hairStyle: 'hair-cachos', hairColor: 'preto', top: 'top-hoodie', bottom: 'bottom-calcas', shoes: 'shoes-brancas', eyes: 'brilhantes', expression: 'feliz', hat: null },
  { skin: 'porcelana', hairStyle: 'hair-rabo', hairColor: 'loiro', top: 'top-listras', bottom: 'bottom-saia', shoes: 'shoes-vermelhas', eyes: 'redondos', expression: 'sorriso-grande', glasses: 'acc-oculos' },
  { skin: 'caramelo', hairStyle: 'hair-trancas', hairColor: 'castanho-escuro', top: 'top-estrelas', bottom: 'bottom-xadrez', shoes: 'shoes-botas', eyes: 'amendoa', expression: 'curiosa', hat: 'hat-pompom' },
  { skin: 'dourada', hairStyle: 'hair-comprido', hairColor: 'ruivo', top: 'top-azul', bottom: 'bottom-verdes', shoes: 'shoes-chuva', eyes: 'estrela', expression: 'divertida', outer: 'outer-gabardina' },
  { skin: 'bege', hairStyle: 'hair-curto', hairColor: 'rosa', top: 'top-coral', bottom: 'bottom-calcoes', shoes: 'shoes-brancas', eyes: 'sorridentes', expression: 'calma', glasses: 'acc-sol' },
  { skin: 'castanha', hairStyle: 'hair-franja', hairColor: 'azul', top: 'top-jaqueta', bottom: 'bottom-calcas', shoes: 'shoes-vermelhas', eyes: 'brilhantes', expression: 'feliz' },
  { skin: 'oliva', hairStyle: 'hair-coque', hairColor: 'loiro-escuro', top: 'top-verde', bottom: 'bottom-saia', shoes: 'shoes-botas', eyes: 'redondos', expression: 'curiosa' },
];
for (const c of combos) {
  const f = document.createElement('figure');
  f.innerHTML = avatarD({ ...base, ...c } as never, { reduceMotion: true }) + `<figcaption>${c.skin}/${c.hairStyle}</figcaption>`;
  document.body.append(f);
}
