import { abuD, ABU_ANCHORS } from '../src/art/d/abu';
import { CATALOG, defaultAvatar } from '../src/art/catalog';
import type { AbuPose } from '../src/art/palette';
import '../src/styles/art.css';
for(const item of CATALOG.filter(i=>i.slot.startsWith('abu'))) for(const pose of ['sit','stand','happy','sleep','think','lie'] as AbuPose[]) {
 const f=document.createElement('figure');
 f.innerHTML=abuD({...defaultAvatar(),abuNeck:null,[item.slot]:item.id},pose,{reduceMotion:true})+`<figcaption>${item.id} / ${pose}</figcaption>`;
 f.dataset.anchors=JSON.stringify(ABU_ANCHORS[pose]);document.body.append(f);
}
