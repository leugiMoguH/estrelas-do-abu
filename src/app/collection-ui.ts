import {CATALOG, avatarSvg, abuSvg, abuPrize} from '../art';
import {COLLECTIONS, localMonth, nextCollection} from '../core/collections';
import {getState} from './store';
import {equip} from './extras/profile';
import {button, escape} from './router';
const categoryNames:Record<string,string>={top:'Parte de cima',bottom:'Parte de baixo',outer:'Casaco',hairStyle:'Penteado',shoes:'Calçado',accessory:'Acessório',glasses:'Óculos',hat:'Chapéu',backpack:'Mochila',abuNeck:'Pescoço',abuBody:'Corpo',abuHead:'Cabeça'};
export const COLLECTION_RULES='Só os testes concluídos com pelo menos 10 perguntas válidas e distintas permitem ganhar artigos. De 80% a menos de 90%: 1 artigo; de 90% a menos de 100%: 3; 100% exato: 4; abaixo de 80%: 0. Conta o crédito original, antes de arredondar a nota. Por seleção de matéria e mês, recebes apenas a diferença para o melhor escalão já atingido (1 + 2 + 1). Repetir, Estudar e Rever continuam livres. Reabrir o resultado não repete prémios.';
function art(id:string):string {
 const item=CATALOG.find(i=>i.id===id);if(!item)return '';const avatar={...getState().profile.avatar,[item.slot]:id};
 if(item.slot==='bottom' && ['m-vestido','m-macacao'].includes(avatar.top)) avatar.top='top-azul';
 return item.slot.startsWith('abu')?abuSvg('sit',avatar):avatarSvg(avatar,{size:110});
}
export function collectionPanel():HTMLElement {
 const now=new Date();const month=localMonth(now.getFullYear(),now.getMonth());
 const panel=document.createElement('section');panel.className='panel monthly-collection';
 const ids=COLLECTIONS[month];const next=nextCollection(month);const owned=getState().save.ownedItems;
 panel.innerHTML=`<h2>Coleção mensal · ${month}</h2><p>${COLLECTION_RULES}</p><p>${ids?`${ids.filter(id=>owned.includes(id)).length}/16 ganhos · faltam ${ids.filter(id=>!owned.includes(id)).length}`:'Coleção indisponível para este mês.'}</p><p>${next?`Próxima coleção: ${next}.`:'Ainda não há próxima coleção anunciada.'} Os artigos ganhos continuam teus.</p>`;
 if(ids){const grid=document.createElement('div');grid.className='monthly-grid';
 for(const id of ids){const item=CATALOG.find(i=>i.id===id);if(!item)continue;const cell=document.createElement('article');cell.className='monthly-item';cell.innerHTML=`<div class="monthly-art">${art(id)}</div><h3>${escape(item.name)}</h3><p>${escape(categoryNames[item.category]??item.category)} · ${escape(item.compatibility.target)}</p><p>${owned.includes(id)?'Possuído':'Disponível no sorteio'}</p>`;grid.append(cell);}panel.append(grid);}
 return panel;
}
export function revealReceipt(main:HTMLElement,id:string):void {
 const receipt=getState().save.receipts.find(r=>r.attempt.id===id);if(!receipt)return;
 const section=document.createElement('section');section.className='panel prize-reveal';section.setAttribute('aria-label','Prémios guardados');
 const remaining=(COLLECTIONS[receipt.attempt.month]??[]).filter(x=>!getState().save.ownedItems.includes(x)).length;
 section.innerHTML=`<h2>Prémios guardados</h2><p>${!receipt.eligible?'Este teste não reúne os critérios para artigos mensais.':!COLLECTIONS[receipt.attempt.month]?'Coleção indisponível neste mês.':!remaining?'Coleção completa!':receipt.items.length<receipt.due?'Recebeste os artigos restantes disponíveis.':!receipt.due?'Não há diferença para o melhor escalão desta seleção.':`${receipt.items.length} artigos recebidos.`}</p>`;
 for(const id of receipt.items){const item=CATALOG.find(i=>i.id===id);if(!item)continue;const card=document.createElement('article');card.className='monthly-item';card.innerHTML=`<div class="monthly-art">${art(id)}</div><h3>${escape(item.name)}</h3>`;const control=button('Equipar',async()=>{const saved=await equip({...getState().profile.avatar,[item.slot]:id});control.textContent=saved?'Equipado':'Não foi possível guardar';control.disabled=saved;});card.append(control);section.append(card);}
 main.append(section);if(receipt.items.length)abuPrize(main,getState().options.reduceMotion);
}
