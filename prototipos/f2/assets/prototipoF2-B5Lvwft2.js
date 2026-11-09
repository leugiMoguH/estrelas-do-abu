(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t,n)=>({text:e,plural:t,time:n}),t=[`O Abu`,`O Abu e a estrela`],n=[`A estrela`,`As estrelas`],r={id:`open`,subjects:t,tail:`a caixa`,forms:[e(`abriu`,!1,0),e(`abre`,!1,1),e(`abrem`,!0,1)]},i={id:`wait`,subjects:t,tail:`junto à passagem`,forms:[e(`esperou`,!1,0),e(`espera`,!1,1),e(`esperará`,!1,2)]},a={id:`cross`,subjects:n,tail:`o canal`,forms:[e(`atravessa`,!1,1),e(`atravessam`,!0,1),e(`atravessarão`,!0,2)]},o=[{title:`A caixa dos ecos`,goal:`Liberta a estrela da caixa para a constelação.`,cards:[r,{id:`release`,subjects:n,tail:`da caixa`,forms:[e(`sai`,!1,1),e(`saem`,!0,1),e(`sairá`,!1,2)]},i],solution:[{card:0,subject:0,form:0,layer:0},{card:1,subject:0,form:0,layer:1}]},{title:`Duas pontas, uma ponte`,goal:`Ergue as duas pontas da ponte e faz passar as duas estrelas.`,cards:[{id:`lift`,subjects:n,tail:`a ponte`,forms:[e(`levantou`,!1,0),e(`levantaram`,!0,0),e(`levantam`,!0,1)]},{...a,tail:`a ponte`},i],solution:[{card:0,subject:1,form:1,layer:0},{card:1,subject:1,form:1,layer:1}]},{title:`O canal do tempo`,goal:`Faz passar as duas estrelas e deixa a comporta fechada.`,cards:[{...r,tail:`a comporta`},a,{id:`close`,subjects:t,tail:`a comporta`,forms:[e(`fechará`,!1,2),e(`fecha`,!1,1),e(`fecharão`,!0,2)]},i],solution:[{card:0,subject:0,form:0,layer:0},{card:1,subject:1,form:1,layer:1},{card:2,subject:0,form:0,layer:2}]}],s=()=>({open:!1,bridge:0,stars:0,bumped:!1,echo:!1});function c(e,t,n){let r=e?.forms[t.form];return!e||!r||![0,1].includes(t.subject)||![0,1,2].includes(t.layer)||n?`Este eco não consegue formar um acontecimento.`:r.plural===(t.subject===1)?r.time===t.layer?``:`O acontecimento não encaixa neste tempo; o eco ficou suspenso.`:`O eco ficou incompleto: estas palavras não combinam entre si.`}function l(e,t){let n=o[e];if(!n)return{steps:[],success:!1};let r=s(),i=[],a=new Set;for(let o of[...t].sort((e,t)=>e.layer-t.layer)){let t=n.cards[o.card],s=c(t,o,a.has(o.card));if(r={...r,bumped:!1,echo:!1},s){r.echo=!0;let e=t?.forms[o.form];t?.id===`lift`&&e&&e.plural!==(o.subject===1)&&(r.bridge=Math.max(1,r.bridge)),i.push({world:{...r},kind:`impossible`,text:s,card:o.card,agreementError:!!e&&e.plural!==(o.subject===1)})}else{let n=d(e,t,o,r);r=n.world,i.push({...n,world:{...r}})}a.add(o.card)}return{steps:i,success:i.length>0&&i.every(e=>e.kind!==`impossible`)&&r.stars===(e===0?1:2)&&(e!==2||!r.open)}}function u(e,t,n){return(e===1?t.bridge===2:t.open)?(t.stars=n,{kind:`effect`,text:n===2?`As duas estrelas chegaram à constelação.`:`Uma estrela chegou à constelação.`}):(t.bumped=!0,{kind:`no-effect`,text:e===0?`A estrela bateu na tampa fechada e ficou à espera.`:`A passagem travou as estrelas; ficaram na margem.`})}function d(e,t,n,r){let i={...r},a=n.subject===1?2:1,o=`effect`,s=``;switch(t.id){case`wait`:o=`no-effect`,s=`O Abu ficou à espera junto à passagem; as estrelas não se moveram.`;break;case`open`:o=i.open?`no-effect`:`effect`,i.open=!0,s=`A passagem abriu-se; as estrelas ainda esperam pelo seu eco.`;break;case`close`:o=i.open?`effect`:`no-effect`,i.open=!1,s=`A comporta fechou-se; quem ficou na margem terá de esperar.`;break;case`lift`:o=i.bridge===a?`no-effect`:`effect`,i.bridge=a,s=a===1?`Só uma ponta subiu; a ponte ficou inclinada.`:`As duas estrelas ergueram as duas pontas da ponte.`;break;case`release`:case`cross`:({kind:o,text:s}=u(e,i,a))}return{world:i,kind:o,text:s,card:n.card}}var f=()=>({choices:[],history:[]});function p(e,t){return{history:[...e.history,e.choices.map(e=>({...e}))],choices:[...e.choices.filter(e=>e.card!==t.card),{...t}]}}function m(e){return e.history.length?{choices:e.history.at(-1),history:e.history.slice(0,-1)}:f()}function h(e,t){return`${e.subjects[t.subject]} ${e.forms[t.form]?.text} ${e.tail}`}var g=new URL(`abu-sit-41GEqvyj.webp`,import.meta.url).href;function _(e,t){return e===0?`
    <rect x="158" y="151" width="115" height="61" rx="8" fill="#ba8059"/>
    <path d="M153 150H278" stroke="#ffe2aa" stroke-width="13"
      transform="rotate(${t.open?-48:0} 153 150)"/>`:e===1?`
    <path d="M140 205L${t.bridge?180:140} ${t.bridge?155:205}
      L${t.bridge===2?320:290} ${t.bridge===2?155:205}L340 205"
      fill="none" stroke="#d7ab77" stroke-width="14"/>`:`
    <path d="M170 130V212M290 130V212" stroke="#aa8cd0" stroke-width="12"/>
    <rect x="177" y="${t.open?96:142}" width="106" height="70" rx="5" fill="#b38cba"/>
    <path d="M155 220Q230 192 310 220" fill="none" stroke="#83d4e4" stroke-width="14"/>`}function v(e,t,n){let r=[`caixa`,`ponte`,`comporta`][e],i=n?`lit`:``;return`<svg viewBox="0 0 480 270" role="img"
    aria-label="Abu junto à ${r}; ${t.stars} estrelas recuperadas">
    <path d="M0 230Q100 210 160 232T480 226V270H0" fill="#41676e"/>
    <g class="constellation ${i}" aria-label="Constelação ${n?`acesa`:`à espera`}">
      <path d="M340 65L380 30L435 60L405 105L340 65" fill="none"/>
      <g font-size="25" text-anchor="middle">
        <text x="340" y="73">&#9733;</text><text x="380" y="38">&#9733;</text>
        <text x="435" y="68">&#9733;</text><text x="405" y="113">&#9733;</text>
      </g>
    </g>
    <g fill="#ffd875">${Array.from({length:e===0?1:2},(e,n)=>`
      <text class="star" x="${t.stars>n?355+n*45:t.bumped?145:195+n*40}"
        y="${t.stars>n?85:128}" font-size="30">&#9733;</text>`).join(``)}</g>
    ${_(e,t)}
    <image href="${g}" x="0" y="128" width="135" height="135"/>
    ${t.echo?`<text x="180" y="85" fill="#ffb6b0" font-size="20">eco incompleto…</text>`:``}
  </svg>`}var y={open:`Abrir`,release:`Soltar`,wait:`Esperar`,lift:`Erguer`,cross:`Atravessar`,close:`Fechar`};function b(e,t,n,r){return e.map((e,i)=>`
    <button data-${r}="${n}" data-value="${i}"
      aria-pressed="${t===i}">${e}</button>`).join(``)}function x(e){return o[e.level].cards.map((t,n)=>{let r={card:n,subject:e.subjects[n],form:e.forms[n],layer:0},i=r.subject>=0&&r.form>=0?h(t,r):`… … ${t.tail}`;return`<article class="card ${e.selected===n?`selected`:``}">
      <h2>${y[t.id]}</h2>
      <div class="pieces" role="group" aria-label="Quem participa, cartão ${n+1}">
        ${b(t.subjects,r.subject,n,`subject`)}
      </div>
      <div class="pieces" role="group" aria-label="O que acontece, cartão ${n+1}">
        ${b(t.forms.map(e=>e.text),r.form,n,`form`)}
      </div>
      ${e.highlight===n?`<p class="link">Estas palavras não combinam: verifica quem participa e a ação.</p>`:``}
      <button data-card="${n}" aria-pressed="${e.selected===n}">${i}</button>
      ${e.board.choices.some(e=>e.card===n)?`<button data-remove="${n}">Retirar do céu</button>`:``}
    </article>`}).join(``)}function S(e){let t=o[e.level];return[`◀ Antes`,`● Agora`,`▶ Depois`].map((n,r)=>`
    <div class="layer">
      <button data-layer="${r}">${n}</button>
      <ol>${e.board.choices.filter(e=>e.layer===r).map(e=>`
        <li>${h(t.cards[e.card],e)}</li>`).join(``)}</ol>
    </div>`).join(``)}function C(e){if(e.finished)return`<section class="final">
    <p>Protótipo · Ecos das Estrelas</p><h1>O céu voltou a brilhar!</h1>
    ${v(e.level,e.world,!0)}<h2>${e.recovered} estrelas recuperadas</h2>
    <p>${e.attempts} tentativas · Melhor viagem: ${e.best} tentativas</p>
    <button id="again">Jogar de novo</button></section>`;let t=o[e.level];return`<header><p>Protótipo isolado · Ecos das Estrelas</p>
    <span>${e.recovered} ★ · ${e.attempts} tentativas</span>
    <h1>${e.level+1}/3 · ${t.title}</h1><p class="goal">${t.goal}</p></header>
    <div class="scene">${v(e.level,e.world,e.solved)}</div>
    <p class="feedback" role="status">${e.feedback}</p>
    <p class="tutorial">Monta as frases com as peças. Escolhe um cartão e toca em Antes, Agora ou Depois.
      Há acontecimentos de que não precisas!</p>
    <details><summary aria-label="Ajuda dos tempos">?</summary>
      <p>Antes: pretérito perfeito. Agora: presente. Depois: futuro.
      A forma da ação deve combinar com quem a realiza e com o momento escolhido.</p></details>
    <section class="cards" aria-label="Banco de acontecimentos">${x(e)}</section>
    <section class="timeline" aria-label="Linha temporal">${S(e)}</section>
    <p class="hint">No mesmo momento, vale a ordem de colocação. Recolocar leva o cartão para o fim.
      As frases colocadas só mudam quando as recolocas.</p>
    <nav><button id="run" aria-disabled="${e.busy}">Experimentar</button>
      <button id="undo">Anular</button><button id="reset">Reiniciar desafio</button>
      ${e.solved?`<button id="next">${e.level===2?`Ver constelações`:`Próximo desafio`}</button>`:``}
    </nav>`}var w=document.querySelector(`#app`),T=`eda-proto-f2`,E=0,D={level:0,board:f(),selected:-1,subjects:[],forms:[],attempts:0,recovered:0,busy:!1,solved:!1,finished:!1,best:O(),world:s(),feedback:``,highlight:-1};function O(){try{let e=JSON.parse(localStorage.getItem(T)??`null`);return typeof e==`number`&&Number.isInteger(e)&&e>=3?e:null}catch{return null}}function k(){E++,D.busy=!1,D.solved=!1,D.world=s(),D.highlight=-1,D.feedback=`O Abu espera pelos teus ecos.`}function A(){D.board=f(),D.subjects=o[D.level].cards.map(()=>-1),D.forms=o[D.level].cards.map(()=>-1),D.selected=-1,k()}function j(e){return e?.tagName===`SUMMARY`?`summary`:e instanceof HTMLButtonElement?e.id?`#${e.id}`:[`subject`,`form`,`card`,`layer`,`remove`].map(t=>{let n=e.getAttribute(`data-${t}`),r=e.getAttribute(`data-value`);return n===null?``:`[data-${t}="${n}"]${r===null?``:`[data-value="${r}"]`}`}).find(Boolean)??null:null}function M(e=j(document.activeElement)){let t=w.querySelector(`details`)?.open??!1;w.innerHTML=C(D);let n=w.querySelector(`details`);n&&(n.open=t),e&&w.querySelector(e)?.focus({preventScroll:!0})}function N(e,t){k();let n=Number(e.dataset[t]),r=t===`subject`?D.subjects:D.forms;r[n]=Number(e.dataset.value),D.selected=n}function P(e){let t=D.selected;t<0||D.subjects[t]<0||D.forms[t]<0?D.feedback=`Toca nas duas peças de uma frase antes de a colocares no céu.`:(k(),D.board=p(D.board,{card:t,subject:D.subjects[t],form:D.forms[t],layer:e}))}function F(){if(D.recovered+=D.level===0?1:2,D.level<2)D.level++,A();else{D.finished=!0,D.best=Math.min(D.best??D.attempts,D.attempts);try{localStorage.setItem(T,JSON.stringify(D.best))}catch{}}}function I(e){e.dataset.subject!==void 0&&N(e,`subject`),e.dataset.form!==void 0&&N(e,`form`),e.dataset.card!==void 0&&(D.selected=Number(e.dataset.card)),e.dataset.layer!==void 0&&P(Number(e.dataset.layer)),e.dataset.remove!==void 0&&(k(),D.board={choices:D.board.choices.filter(t=>t.card!==Number(e.dataset.remove)),history:[...D.board.history,D.board.choices]}),e.id===`undo`&&(D.board=m(D.board),k()),e.id===`reset`&&A(),e.id===`next`&&D.solved&&F()}w.addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(!t)return;let n=j(t);t.id===`again`?location.reload():t.id===`run`?D.busy||L():(I(t),M(n),t.id===`next`&&w.querySelector(`h1`)?.setAttribute(`tabindex`,`-1`),t.id===`next`&&w.querySelector(`h1`)?.focus(),t.dataset.remove!==void 0&&w.querySelector(`[data-card="${t.dataset.remove}"]`)?.focus())});async function L(){let e=++E;D.attempts++,D.busy=!0,D.solved=!1,D.world=s(),D.highlight=-1;let t=l(D.level,D.board.choices);t.steps.length||(D.feedback=`O céu está à espera: coloca um cartão num tempo.`),M(`#run`);for(let n of t.steps){if(await new Promise(e=>setTimeout(e,matchMedia(`(prefers-reduced-motion: reduce)`).matches?80:650)),E!==e)return;D.world=n.world,D.feedback=n.text,D.highlight=n.agreementError?n.card:-1,M()}D.busy=!1,D.solved=t.success,D.solved&&(D.feedback=`A constelação acendeu-se com os teus ecos!`),M()}A(),M();