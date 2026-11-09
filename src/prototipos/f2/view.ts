import { challenges, sentence, type Board, type World } from './rules';
import { scene } from './scene';

export interface ViewState {
  level: number;
  board: Board;
  selected: number;
  subjects: number[];
  forms: number[];
  attempts: number;
  recovered: number;
  busy: boolean;
  solved: boolean;
  finished: boolean;
  best: number | null;
  world: World;
  feedback: string;
  highlight: number;
}

const actionNames: Record<string, string> = {
  open: 'Abrir', release: 'Soltar', wait: 'Esperar',
  lift: 'Erguer', cross: 'Atravessar', close: 'Fechar',
};

function pieces(values: string[], chosen: number, card: number, kind: string): string {
  return values.map((text, index) => `
    <button data-${kind}="${card}" data-value="${index}"
      aria-pressed="${chosen === index}">${text}</button>`).join('');
}

function cards(state: ViewState): string {
  return challenges[state.level]!.cards.map((card, index) => {
    const choice = {card: index, subject: state.subjects[index]!, form: state.forms[index]!, layer: 0 as const};
    const complete = choice.subject >= 0 && choice.form >= 0;
    const phrase = complete ? sentence(card, choice) : `… … ${card.tail}`;
    return `<article class="card ${state.selected === index ? 'selected' : ''}">
      <h2>${actionNames[card.id]}</h2>
      <div class="pieces" role="group" aria-label="Quem participa, cartão ${index + 1}">
        ${pieces(card.subjects, choice.subject, index, 'subject')}
      </div>
      <div class="pieces" role="group" aria-label="O que acontece, cartão ${index + 1}">
        ${pieces(card.forms.map(form => form.text), choice.form, index, 'form')}
      </div>
      ${state.highlight === index ? '<p class="link">Estas palavras não combinam: verifica quem participa e a ação.</p>' : ''}
      <button data-card="${index}" aria-pressed="${state.selected === index}">${phrase}</button>
      ${state.board.choices.some(item => item.card === index) ? `<button data-remove="${index}">Retirar do céu</button>` : ''}
    </article>`;
  }).join('');
}

function timeline(state: ViewState): string {
  const challenge = challenges[state.level]!;
  return ['◀ Antes', '● Agora', '▶ Depois'].map((name, layer) => `
    <div class="layer">
      <button data-layer="${layer}">${name}</button>
      <ol>${state.board.choices.filter(choice => choice.layer === layer).map(choice => `
        <li>${sentence(challenge.cards[choice.card]!, choice)}</li>`).join('')}</ol>
    </div>`).join('');
}

export function view(state: ViewState): string {
  if (state.finished) return `<section class="final">
    <p>Protótipo · Ecos das Estrelas</p><h1>O céu voltou a brilhar!</h1>
    ${scene(state.level, state.world, true)}<h2>${state.recovered} estrelas recuperadas</h2>
    <p>${state.attempts} tentativas · Melhor viagem: ${state.best} tentativas</p>
    <button id="again">Jogar de novo</button></section>`;
  const challenge = challenges[state.level]!;
  return `<header><p>Protótipo isolado · Ecos das Estrelas</p>
    <span>${state.recovered} ★ · ${state.attempts} tentativas</span>
    <h1>${state.level + 1}/3 · ${challenge.title}</h1><p class="goal">${challenge.goal}</p></header>
    <div class="scene">${scene(state.level, state.world, state.solved)}</div>
    <p class="feedback" role="status">${state.feedback}</p>
    <p class="tutorial">Monta as frases com as peças. Escolhe um cartão e toca em Antes, Agora ou Depois.
      Há acontecimentos de que não precisas!</p>
    <details><summary aria-label="Ajuda dos tempos">?</summary>
      <p>Antes: pretérito perfeito. Agora: presente. Depois: futuro.
      A forma da ação deve combinar com quem a realiza e com o momento escolhido.</p></details>
    <section class="cards" aria-label="Banco de acontecimentos">${cards(state)}</section>
    <section class="timeline" aria-label="Linha temporal">${timeline(state)}</section>
    <p class="hint">No mesmo momento, vale a ordem de colocação. Recolocar leva o cartão para o fim.
      As frases colocadas só mudam quando as recolocas.</p>
    <nav><button id="run" aria-disabled="${state.busy}">Experimentar</button>
      <button id="undo">Anular</button><button id="reset">Reiniciar desafio</button>
      ${state.solved ? `<button id="next">${state.level === 2 ? 'Ver constelações' : 'Próximo desafio'}</button>` : ''}
    </nav>`;
}
