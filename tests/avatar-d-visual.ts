import { avatarD } from '../src/art/d/compose';
import { defaultAvatar } from '../src/art/catalog';
import { SKIN_TONES } from '../src/art/palette';
import '../src/styles/art.css';
for (const tone of SKIN_TONES) {
 const figure = document.createElement('figure');
 figure.innerHTML = avatarD({...defaultAvatar(),skin:tone.id,hairStyle:'hair-comprido',outer:'outer-gabardina',glasses:'acc-oculos',hat:'hat-pompom'}, {reduceMotion:true})+`<figcaption>${tone.name}</figcaption>`;
 document.body.append(figure);
}
