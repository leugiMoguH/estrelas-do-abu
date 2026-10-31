import { avatarD } from '../src/art/d/compose';
import { defaultAvatar } from '../src/art/catalog';
import { SKIN_TONES } from '../src/art/palette';
import '../src/styles/art.css';
const resolve = (file: string): string | undefined => {
 const name = file.includes('body_skin') ? 'body_base' : file.includes('hair-comprido') ? 'hair_long' : file.includes('outer-gabardina') ? 'coat_open' : null;
 return name ? `./shots/d-src/layers/key/${name}.png` : undefined;
};
for (const tone of SKIN_TONES) {
 const figure = document.createElement('figure');
 figure.innerHTML = avatarD({...defaultAvatar(),skin:tone.id,hairStyle:'hair-comprido',outer:'outer-gabardina',glasses:'acc-oculos',hat:'hat-pompom'}, {reduceMotion:true},resolve)+`<figcaption>${tone.name}</figcaption>`;
 document.body.append(figure);
}
