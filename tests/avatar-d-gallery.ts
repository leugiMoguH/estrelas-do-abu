import { avatarD } from '../src/art/d/compose';
import { SKIN_TONES } from '../src/art/palette';
import { faceD } from '../src/art/d/face';
import { defaultAvatar } from '../src/art/catalog';
import '../src/styles/art.css';
const base = defaultAvatar();
const combos = [
  { skin: 'clara', hairStyle: 'hair-curto' },
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

const faces = document.createElement('section');
faces.id = 'face-grid';
faces.style.cssText = 'display:flex;flex-wrap:nowrap;width:max-content;background:#d6dfed';
for (const tone of SKIN_TONES) {
 const f = document.createElement('figure');
 const config = {...base, skin:tone.id};
 f.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="390 135 235 180" style="width:180px;height:138px"><rect x="390" y="135" width="235" height="180" fill="${tone.hex}"/>${faceD(config,`face-${tone.id}`)}</svg><figcaption>${tone.name}</figcaption>`;
 faces.append(f);
}
document.body.append(faces);
const feet = document.createElement('section');
feet.id = 'feet-grid'; feet.style.cssText='display:grid;grid-template-columns:repeat(4,280px)';
for (const skin of ['porcelana','bege','ebano']) for (const shoes of ['shoes-brancas','shoes-vermelhas','shoes-botas','shoes-chuva']) {
 const f = document.createElement('figure');
 f.innerHTML=avatarD({...base,skin,shoes,bottom:'bottom-calcoes'},{reduceMotion:true})+`<figcaption>${skin} / ${shoes}</figcaption>`;
 const svg=f.querySelector('svg')!; svg.setAttribute('viewBox','280 1260 470 276'); svg.style.cssText='width:270px;height:200px;overflow:hidden';
 feet.append(f);
}
document.body.append(feet);
