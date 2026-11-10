import"./modulepreload-polyfill-P2Xu9kJm.js";import{t as e}from"./abu-sit-DfgQsQ-6.js";var t=new URL(`abu-happy-BBk7ZBnh.webp`,import.meta.url).href,n=new URL(`abu-curious-C0uFS3l1.webp`,import.meta.url).href,r=[`vanilla`,`chocolate`,`strawberry`,`mint`],i=e=>e[0].toUpperCase()+e.slice(1);function a(e){switch(e.kind){case`scoops`:return e.count===1?`One scoop, please!`:`Two scoops, please!`;case`top`:return`${i(e.flavour)} on top, please!`;case`bottom`:return`${i(e.flavour)} at the bottom, please!`;case`exclude`:return e.dislike?`I don't like ${e.flavour}!`:`No ${e.flavour}, please!`;default:return e.value?`With ${e.kind}, please!`:`No ${e.kind}, please!`}}function o(e,t){for(let n of e.conditions)if(!(n.kind===`scoops`?t.scoops.length===n.count:n.kind===`top`?t.scoops.at(-1)===n.flavour:n.kind===`bottom`?t.scoops[0]===n.flavour:n.kind===`exclude`?!t.scoops.includes(n.flavour):`value`in n&&t[n.kind]===n.value))return{...n,phrase:a(n)};return null}var s=()=>[{text:`One scoop, please. Any flavour!`,conditions:[{kind:`scoops`,count:1}]},{text:`Two scoops, please. Chocolate on top, no sauce!`,conditions:[{kind:`scoops`,count:2},{kind:`top`,flavour:`chocolate`},{kind:`sauce`,value:!1}]}];function c(e){let[t,...n]=e,r=n.map(e=>a(e).replace(`, please!`,``).replace(`!`,``));if(n[0]?.kind===`exclude`&&n[0].dislike)return`${a(t).replace(`!`,`.`)} ${r[0]}! ${r[1]}.`;let i=r.map((e,t)=>t===0?e:e[0].toLowerCase()+e.slice(1)).join(`, `);return`${a(t).replace(`!`,`.`)} ${i}!`}function l(e){let t=e>>>0,n=e=>(t=Math.imul(t,1664525)+1013904223>>>0,Math.floor(t/4294967296*e)),i={conditions:[{kind:`scoops`,count:n(2)===0?1:2}],text:``};i.text=`${a(i.conditions[0]).replace(`!`,`.`)} Any flavour!`;let o=r[n(4)],s=n(3),l=[{kind:`scoops`,count:s===2?1:2}];return s<2?l.push({kind:s===0?`top`:`bottom`,flavour:o}):l.push({kind:`exclude`,flavour:o,dislike:n(2)===1}),l.push({kind:n(2)===0?`sauce`:`sprinkles`,value:n(2)===1}),[i,{conditions:l,text:c(l)}]}var u={vanilla:`#fff0c7`,chocolate:`#91583f`,strawberry:`#f499b3`,mint:`#9addc0`};function d(e){let t=112-(e.scoops.length-1)*54;return`<svg viewBox="0 0 180 240" aria-hidden="true">
<defs>
<linearGradient id="waffle" x2="1" y2="1">
<stop stop-color="#f5cf8b"/>
<stop offset="1" stop-color="#ba783e"/>
</linearGradient>
</defs>
<ellipse cx="90" cy="224" rx="38" ry="8" fill="#4a2f2725"/>
<path d="M46 119H134L90 222Z" fill="url(#waffle)" stroke="#80512e" stroke-width="3"/>
<path d="M55 140L103 190M65 121L115 171M85 121L126 153M125 140L77 190M115 121L65 171M95 121L54 153" stroke="#a56d37" stroke-width="2"
  opacity=".55"/>${e.scoops.map((e,t)=>`<g class="scoop">
<path d="M47 ${112-t*54}C32 ${85-t*54} 49 ${59-t*54} 73 ${61-t*54}C94 ${45-t*54} 132 ${63-t*54} 132 ${87-t*54}Q150 ${120-t*54} 119
  ${125-t*54}Q105 ${133-t*54} 91 ${124-t*54}Q72 ${134-t*54} 59 ${124-t*54}Q40 ${129-t*54} 47
  ${112-t*54}Z" fill="${u[e]}" stroke="#654335" stroke-width="3"/>
<path d="M58 ${88-t*54}Q67 ${70-t*54} 84 ${72-t*54}" fill="none" stroke="#ffffff75" stroke-width="7" stroke-linecap="round"/>
</g>`).join(``)}${e.scoops.length&&e.sauce?`<path d="M51 ${t-21}Q90 ${t-47} 130 ${t-21}L123 ${t-3}Q113 ${t+8} 106
  ${t-13}Q92 ${t+5} 82 ${t-13}Q65 ${t+3} 51 ${t-21}" fill="#efb544" stroke="#814517" stroke-width="2"/>
<path d="M65 ${t-24}Q89 ${t-35} 112 ${t-24}" fill="none" stroke="#fff0ac" stroke-width="4" stroke-linecap="round"/>`:``}${e.scoops.length&&e.sprinkles?Array.from({length:12},(e,n)=>`<path d="M${60+n%5*14} ${t-34+Math.floor(n/5)*12}l5 4"
  stroke="${[`#fff6e8`,`#fa797c`,`#ffd666`,`#5ba9cb`][n%4]}" stroke-width="4" stroke-linecap="round"/>`).join(``):``}</svg>`}function f(e,t){let n=e===0?`#a86d44`:`#f6cdb0`;return`<svg viewBox="0 0 230 230" aria-hidden="true">
<defs>
<linearGradient id="shirt${e}" x2="1" y2="1">
<stop stop-color="${e?`#b5a3e9`:`#6ed3c7`}"/>
<stop offset="1" stop-color="${e?`#7764ac`:`#368c91`}"/>
</linearGradient>
</defs>
<ellipse cx="115" cy="219" rx="78" ry="9" fill="#071a3433"/>
<g stroke="#4a2f27" stroke-width="3" stroke-linejoin="round">
<path d="M68 131Q115 108 164 133L183 185L157 197L151 162L158 213Q115 233 69 213L78 161L64 191L44 178Z" fill="url(#shirt${e})"/>
<path d="M47 177Q41 191 59 201L86 207Q99 206 96 195L66 185L64 180Z" fill="${n}"/>
<path d="M165 188L174 175Q179 169 185 176L190 192Q178 216 157 204L151 194Z" fill="${n}"/>
<path d="M105 112V136Q116 147 128 134V112" fill="${n}"/>${e===0?`<path d="M65 79Q30 75 42 37Q58 13 83 39M161 78Q199 78 190
  39Q174 13 151 38" fill="#35251f"/>`:``}<ellipse cx="69" cy="84" rx="12" ry="17" fill="${n}"/>
<ellipse cx="162" cy="84" rx="12" ry="17" fill="${n}"/>
<path d="M67 58Q70 17 117 21Q164 22 166 62L158 105Q147 132 115 132Q83 130 72 105Z" fill="${n}"/>
<path d="M66 71Q54 20 103 17Q163 5 170 59L160 77L149 49Q116 68 81 52L74 76Z" fill="${e?`#945a35`:`#35251f`}"/>
<path d="M83 72Q92 67 101 72M132 72Q141 67 150 72" fill="none"/>
<ellipse cx="93" cy="86" rx="6" ry="8" fill="#30233e"/>
<ellipse cx="140" cy="86" rx="6" ry="8" fill="#30233e"/>
<path d="M114 86L110 100H118" fill="none" opacity=".5"/>
<path d="M101 109Q116 ${t?132:122} 133 108" fill="${t?`#fff6e8`:`none`}"/>
<circle cx="91" cy="83" r="2" fill="white"/>
<circle cx="138" cy="83" r="2" fill="white"/>${e?`<g fill="none" stroke="#554269">
<rect x="77" y="75" width="31" height="25" rx="10"/>
<rect x="125" y="75" width="31" height="25" rx="10"/>
<path d="M108 83H125"/>
</g>`:`<path d="M108 146L116 156L125 146" fill="#fff0c7"/>`}</g>${t?`<g transform="translate(147 103) scale(.47)">${d(t)}</g>
<path d="M176 183Q180 175 188 179L196 185Q201 194 193 198L181 195Z" fill="${n}" stroke="#4a2f27" stroke-width="2"/>`:``}<ellipse
  cx="115" cy="222" rx="78" ry="7" fill="#213b4d" opacity=".65"/>
</svg>`}function p(e){let t=e.every(Boolean);return`<svg class="sky" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="night" x2="0" y2="1">
<stop stop-color="#152343"/>
<stop offset="1" stop-color="#405578"/>
</linearGradient>
<radialGradient id="glow">
<stop stop-color="#ffd666" stop-opacity=".4"/>
<stop offset="1" stop-color="#ffd666" stop-opacity="0"/>
</radialGradient>
</defs>
<path fill="url(#night)" d="M0 0H1200V720H0Z"/>${Array.from({length:65},(e,t)=>`<circle cx="${t*137%1200}" cy="${t*89%550}"
  r="${t%3+1}" fill="#fff6e8" opacity="${.25+t%4*.15}"/>`).join(``)}</svg>
<svg class="garland" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
<path d="M0 0Q600 190 1200 0" fill="none" stroke="#a39287" stroke-width="3"/>${[120,310,500,700,890,1080].map((n,r)=>{let i=40+Math.sin(n/1200*Math.PI)*68,a=t||r===1&&e[0]||r===4&&e[1];return`<g class="lantern
  ${a?`lit`:``}" transform="translate(${n} ${i})">
<path d="M0 -25V0" stroke="#b9a28a" stroke-width="2"/>${a?`<circle r="66" fill="#ffd666" opacity=".12"/>`:``}<path d="M0 -19L7 -5L24
  -3L12 9L15 25L0 17L-15 25L-12 9L-24 -3L-7 -5Z" fill="${a?`#ffdf7e`:`#69717f`}" stroke="${a?`#fff3b0`:`#9c9692`}" stroke-width="3"/>
<path d="M0 -12V14M-16 -1L15 14M16 -1L-15 14" stroke="#ae7b49" opacity=".4"/>
</g>`}).join(``)}</svg>
<svg class="ground" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
<path d="M0 598Q150 492 300 582Q490 477 640 565Q900 475 1200 558V720H0" fill="#213b4d"/>
<path d="M0 655Q380 605 650 649T1200 625V720H0" fill="#53605a"/>
</svg>`}var m=`eda-proto-en`,h={version:1,roundsPlayed:0,metrics:[]};try{let e=JSON.parse(localStorage.getItem(m)??`null`);if(e&&typeof e==`object`&&`version`in e&&e.version===1&&`roundsPlayed`in e&&Number.isSafeInteger(e.roundsPlayed)&&Number(e.roundsPlayed)>=0&&`metrics`in e&&Array.isArray(e.metrics)){let t=e;t.metrics.every(e=>e&&Array.isArray(e.returns)&&e.returns.length===2&&e.returns.every(e=>Number.isSafeInteger(e)&&e>=0)&&(e.firstMs===void 0||Number.isFinite(e.firstMs)&&e.firstMs>=0))&&(h=t)}}catch{}var g=()=>({scoops:[],sauce:!1,sprinkles:!1}),_=g(),v=s(),y=[null,null],b=[``,``],x=e,S=performance.now(),C,w=1,T,E=document.querySelector(`#app`),D=()=>{try{localStorage.setItem(m,JSON.stringify(h))}catch{}};function O(){C={returns:[0,0]},h.metrics.push(C),h.roundsPlayed++,D()}function k(e){if(T)try{let t=new SpeechSynthesisUtterance(b[e]||v[e].text);t.voice=T,t.lang=T.lang,t.rate=.88,speechSynthesis.cancel(),speechSynthesis.speak(t)}catch{}}function A(e){if(y[e])return;C.firstMs??=Math.round(performance.now()-S);let r=o(v[e],_);r?(b[e]=r.phrase,C.returns[e]++,x=n):(y[e]=structuredClone(_),_=g(),b[e]=`Thank you!`,x=t),D(),j()}function j(){let e=document.activeElement?.dataset.action,i=y.every(Boolean);E.innerHTML=`<main>
<header>
<p>PROTÓTIPO · INGLÊS <span>Festival do Abu</span>
</p>
<h1>Faz o gelado que cada visitante pede.</h1>
</header>
<section class="festival ${i?`complete`:``}" aria-label="Festival do Abu">${p(y.map(Boolean))}<div
  class="visitors">${v.map((e,t)=>`<article class="visitor ${y[t]?`served`:``}">
<div class="bubble">
<p lang="en" ${b[t]?`role="status"`:``}>${b[t]||e.text}</p>${T?`<button class="speaker"
  data-action="speak-${t}" aria-label="Ouvir pedido ${t+1}">♪</button>`:``}</div>
<button class="person" data-action="give-${t}" aria-label="Dar ao visitante ${t+1}" ${y[t]?`disabled`:``}>${f(t,y[t])}<span>${y[t]?`✓`:`Dar`}</span>
</button>
</article>`).join(``)}</div>
<section class="stall" aria-label="Banca de gelados">
<div class="awning">
<span>Festival do Abu</span>
</div>
<div class="worktop">
<img class="abu" src="${x}" alt="Abu ${x===n?`curioso`:x===t?`feliz`:`sentado`}">
<div class="cone-area">
<button class="cone" data-action="remove" aria-label="Tirar a bola de cima" ${_.scoops.length?``:`disabled`}>${d(_)}</button>
</div>
<div class="toppings">
<button data-action="sauce" aria-pressed="${_.sauce}" lang="en">
<span class="sauce-icon">〰</span>Sauce</button>
<button data-action="sprinkles" aria-pressed="${_.sprinkles}" lang="en">
<span class="sprinkles-icon">▰ ▰ ▰</span>Sprinkles</button>
</div>
</div>
<div class="display">${r.map(e=>`<button class="tub" data-action="${e}" aria-label="${e}" ${_.scoops.length===2||i?`disabled`:``}>
<span style="--ice:${u[e]}" class="ice-tub">
</span>
<span lang="en">${e}</span>
</button>`).join(``)}</div>
<div class="wood">
<span>✦</span>
<span>ABU</span>
<span>✦</span>
</div>
</section>
<div class="finish" ${i?``:`hidden`}>
<p role="status">Constelação acesa!</p>
<button data-action="next">Outra ronda</button>
</div>
</section>${new URLSearchParams(location.search).has(`registo`)?`<output id="metrics">${JSON.stringify(h)}</output>`:``}</main>`,e&&E.querySelector(`[data-action="${e}"]`)?.focus({preventScroll:!0})}E.addEventListener(`click`,t=>{let n=t.target.closest(`button[data-action]`);if(!n||n.disabled)return;let i=n.dataset.action;if(i.startsWith(`give-`))A(Number(i.at(-1)));else if(i.startsWith(`speak-`))k(Number(i.at(-1)));else{if(i===`next`){w++;let t=JSON.stringify(v),n=Date.now()+w>>>0;do v=l(n++);while(JSON.stringify(v)===t);_=g(),y=[null,null],b=[``,``],x=e,S=performance.now(),O()}else i===`remove`?_.scoops.pop():i===`sauce`||i===`sprinkles`?_[i]=!_[i]:r.includes(i)&&_.scoops.length<2&&_.scoops.push(i);j()}});function M(){try{T=speechSynthesis.getVoices().find(e=>e.localService===!0&&e.lang.toLowerCase().startsWith(`en`))}catch{T=void 0}j()}O(),j(),`speechSynthesis`in window&&(M(),speechSynthesis.addEventListener(`voiceschanged`,M));