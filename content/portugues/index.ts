import type { Exercise, Answer } from '../../src/core/types';
import type { Difficulty, ExerciseTemplate } from '../../src/core/content';
import { base, random, template } from '../matematica/shared';
import { names, nouns, adjectives, adverbs, places, verbs } from './lexicon';

export const portugueseDifficultyCriteria = {
  classes: [
    'frase simples sem expansão',
    'grupo nominal com adjetivo e advérbio',
    'grupo nominal expandido e localização',
  ],
  tempos: [
    'reconhecer presente',
    'distinguir pretérito perfeito e presente',
    'distinguir imperfeito e futuro num contexto expandido',
  ],
  modos: ['afirmação no indicativo', 'desejo no conjuntivo', 'instrução no imperativo: tu'],
  completar: [
    'presente, terceira pessoa singular',
    'pretérito perfeito, terceira pessoa singular',
    'futuro, terceira pessoa plural',
  ],
  voz: [
    'presente e singular',
    'pretérito perfeito e singular',
    'futuro e plural: concordância de auxiliar e particípio',
  ],
} as const;
function scene(seed: number, d: Difficulty) {
  const r = random(seed),
    name = names[r(0, names.length - 1)]!,
    noun = nouns[r(0, nouns.length - 1)]!,
    adjective = adjectives[r(0, adjectives.length - 1)]!,
    verb = verbs[r(0, verbs.length - 1)]!,
    adverb = adverbs[r(0, adverbs.length - 1)]!,
    place = places[r(0, places.length - 1)]!;
  const other = names[(names.indexOf(name) + 1) % names.length]!;
  const plural = d === 3;
  const subject = plural ? `A ${name} e a ${other}` : `A ${name}`;
  const agent = plural ? `pela ${name} e pela ${other}` : `pela ${name}`;
  const object = `${plural ? 'as' : 'a'} ${noun[plural ? 1 : 0]} ${adjective[plural ? 1 : 0]}`;
  const activeVerb = d === 1 ? verb.present : d === 2 ? verb.past : verb.pluralFuture;
  const auxiliary = d === 1 ? 'é' : d === 2 ? 'foi' : 'serão';
  const passiveVerb = `${auxiliary} ${verb.participle[plural ? 1 : 0]}`;
  const active = `${subject} ${activeVerb} ${object} ${place}.`;
  const passive = `${object[0]!.toUpperCase()}${object.slice(1)} ${passiveVerb} ${agent} ${place}.`;
  return {
    name,
    noun,
    adjective,
    verb,
    adverb,
    place,
    subject,
    agent,
    object,
    activeVerb,
    passiveVerb,
    active,
    passive,
  };
}
const quote = (ex: Exercise) => ex.prompt.match(/«([^»]+)»/u)![1]!;
const target = (ex: Exercise) => ex.prompt.match(/palavra «([^»]+)»/u)![1]!;
function classOf(word: string) {
  if (nouns.some((pair) => pair.some((w) => w === word))) return 'nome comum';
  if (adjectives.some((pair) => pair.some((w) => w === word))) return 'adjetivo';
  if (adverbs.includes(word)) return 'advérbio';
  throw new Error(`Palavra não catalogada: ${word}`);
}
function verbIn(ex: Exercise) {
  const infinitive = ex.prompt.match(/verbo ([a-zç]+)[.:]/u)?.[1];
  const v = verbs.find((v) => v.infinitive === infinitive);
  if (!v) throw new Error('Verbo ausente');
  return v;
}
function voiceSolve(ex: Exercise): Answer {
  const sentence = quote(ex);
  const v = verbs.find((v) =>
    [v.present, v.past, v.pluralFuture, ...v.participle].some((f) => sentence.split(' ').includes(f)),
  )!;
  const mentionedNames = names.filter((n) => new RegExp(`\\b${n}\\b`, 'u').test(sentence));
  // A ordem dos agentes vem da frase, não da ordem do léxico.
  mentionedNames.sort((a, b) => sentence.indexOf(a) - sentence.indexOf(b));
  const subject = `A ${mentionedNames.join(' e a ')}`;
  const agent = `pela ${mentionedNames.join(' e pela ')}`;
  const noun = nouns.find((pair) => pair.some((n) => sentence.split(' ').includes(n)))!;
  const adj = adjectives.find((pair) => pair.some((a) => sentence.split(' ').includes(a)))!;
  const plural = sentence.includes(noun[1]);
  const object = `${plural ? 'as' : 'a'} ${noun[plural ? 1 : 0]} ${adj[plural ? 1 : 0]}`;
  const place = places.find((p) => sentence.includes(p))!;
  if (ex.kind === 'mcq') return { kind: 'mcq', value: agent };
  const past = sentence.includes(v.past) || sentence.includes(' foi ');
  const future = sentence.includes(v.pluralFuture) || sentence.includes(' serão ');
  return {
    kind: 'order',
    value: ex.prompt.includes('para a passiva')
      ? [
          object[0]!.toUpperCase() + object.slice(1),
          `${future ? 'serão' : past ? 'foi' : 'é'} ${v.participle[plural ? 1 : 0]}`,
          agent,
          `${place}.`,
        ]
      : [subject, future ? v.pluralFuture : past ? v.past : v.present, object, `${place}.`],
  };
}
export const portugueseTemplates: ExerciseTemplate[] = [
  ...(['nome', 'adjetivo', 'adverbio'] as const).map((concept, i) =>
    template(
      `pt-classe-${concept}`,
      'pt-classes',
      concept,
      (seed, d) => {
        const s = scene(seed, d);
        // Singular em todas as frases de classes; o contexto cresce por nível.
        const sentence = `A ${s.name} ${s.verb.past} a ${s.noun[0]}${d >= 2 ? ` ${s.adjective[0]}` : ''} ${s.adverb}${d === 3 ? ` ${s.place}` : ''}.`;
        const word = [s.noun[0], s.adjective[0], s.adverb][i]!;
        const actualSentence =
          i === 1 && d === 1 ? `A ${s.name} ${s.verb.past} a ${s.noun[0]} ${s.adjective[0]}.` : sentence;
        const answer = ['nome comum', 'adjetivo', 'advérbio'][i]!;
        const teaching = [
          'O nome comum designa um ser, objeto ou lugar, sem o individualizar por um nome próprio.',
          'O adjetivo atribui uma propriedade ao nome e concorda com ele em género e número.',
          'Este advérbio modifica o verbo: indica o modo como a ação foi realizada e é invariável.',
        ][i]!;
        const b = base(
          `pt-classe-${concept}`,
          'pt-classes',
          seed,
          d,
          `Na frase «${actualSentence}», a que classe pertence a palavra «${word}»?${i === 2 ? ' Responde: nome comum, adjetivo ou advérbio.' : ''}`,
          [
            'Observa a função da palavra nesta frase.',
            [
              'Designa algo que pode ser identificado pelo artigo que o acompanha.',
              'Caracteriza o que é designado pelo nome; verifica a concordância em género e número.',
              'Indica como a ação é realizada e não varia quando o sujeito passa ao plural.',
            ][i]!,
          ],
          `${word}: ${answer}. ${teaching}`,
          [
            [
              'verbo',
              'O verbo exprime a ação e varia em tempo e pessoa; observa a função da palavra destacada.',
            ],
            [
              i === 1 ? 'advérbio' : 'adjetivo',
              i === 1 ? 'Esta palavra caracteriza o nome e concorda com ele; não modifica a ação.' : teaching,
            ],
          ],
        );
        return i === 2
          ? { ...b, kind: 'text', correctAnswers: [answer] }
          : {
              ...b,
              kind: 'mcq',
              options: ['nome comum', 'adjetivo', 'advérbio', 'verbo'],
              correctAnswer: answer,
            };
      },
      (ex) => ({ kind: ex.kind as 'mcq' | 'text', value: classOf(target(ex)) }),
    ),
  ),
  template(
    'pt-tempo',
    'pt-verbos',
    'tempo-verbal',
    (seed, d) => {
      const s = scene(seed, d),
        r = random((seed + 11) >>> 0);
      const imperfect = d === 3 && r(0, 1) === 0;
      const form =
        d === 1 ? s.verb.present : d === 2 ? s.verb.past : imperfect ? s.verb.imperfect : s.verb.future;
      const answer =
        d === 1
          ? 'presente do indicativo'
          : d === 2
            ? 'pretérito perfeito do indicativo'
            : imperfect
              ? 'pretérito imperfeito do indicativo'
              : 'futuro do indicativo';
      const sentence = `A ${s.name} ${form} a ${s.noun[0]} ${s.adjective[0]} ${s.place}${d === 3 ? ', segundo a Rita' : ''}.`;
      return {
        ...base(
          'pt-tempo',
          'pt-verbos',
          seed,
          d,
          `Na frase «${sentence}», identifica o tempo e o modo da forma «${form}».`,
          [
            'Identifica apenas a forma destacada, mesmo que haja outro verbo.',
            d === 1
              ? 'A forma apresenta a ação no momento atual ou como habitual no presente; o modo apresenta-a como um facto.'
              : d === 2
                ? 'A forma apresenta uma ação passada concluída; o modo apresenta-a como um facto.'
                : imperfect
                  ? 'A forma apresenta uma ação passada em curso ou habitual, sem marcar o seu fim; o modo apresenta-a como um facto.'
                  : 'A forma situa a ação depois do momento da fala; o modo apresenta-a como um facto.',
          ],
          `«${form}» está no ${answer}. Compara: ${s.verb.present} (presente), ${s.verb.past} (passado concluído), ${s.verb.imperfect} (passado em curso ou habitual), ${s.verb.future} (futuro). Todas estas formas pertencem ao indicativo.`,
          [
            [
              'pretérito perfeito do indicativo',
              'O perfeito exprime um acontecimento passado concluído. Confere a forma destacada, não apenas o contexto.',
            ],
            [
              'pretérito imperfeito do indicativo',
              'O imperfeito apresenta o passado em curso ou habitual; distingue, por exemplo, observou de observava.',
            ],
          ],
        ),
        kind: 'mcq',
        options: [
          'presente do indicativo',
          'pretérito perfeito do indicativo',
          'pretérito imperfeito do indicativo',
          'futuro do indicativo',
        ],
        correctAnswer: answer,
      };
    },
    (ex) => {
      const form = ex.prompt.match(/forma «([^»]+)»/u)![1]!;
      const v = verbs.find((v) => [v.present, v.past, v.imperfect, v.future].some((f) => f === form))!;
      return {
        kind: 'mcq',
        value: `${form === v.present ? 'presente' : form === v.past ? 'pretérito perfeito' : form === v.imperfect ? 'pretérito imperfeito' : 'futuro'} do indicativo`,
      };
    },
  ),
  template(
    'pt-modo',
    'pt-verbos',
    'modo-verbal',
    (seed, d) => {
      const s = scene(seed, d),
        form = d === 2 ? s.verb.subjunctive : d === 1 ? s.verb.present : s.verb.imperative;
      const sentence =
        d === 1
          ? `A ${s.name} ${form} a ${s.noun[0]} ${s.adjective[0]} ${s.place}.`
          : d === 2
            ? `Espero que a ${s.name} ${form} a ${s.noun[0]} ${s.adjective[0]} ${s.place}.`
            : `${s.name}, ${form} a ${s.noun[0]} ${s.adjective[0]} ${s.place}!`;
      const answer = d === 1 ? 'indicativo' : d === 2 ? 'conjuntivo' : 'imperativo';
      return {
        ...base(
          'pt-modo',
          'pt-verbos',
          seed,
          d,
          `Em «${sentence}», qual é o modo de «${form}»?${d === 3 ? ' A frase dá uma instrução a tu.' : ''}`,
          [
            'Observa se a frase afirma, exprime um desejo ou dá uma instrução.',
            d === 1
              ? 'A frase afirma uma ação como um facto.'
              : d === 2
                ? 'A expressão Espero que introduz uma ação desejada, que não é afirmada como um facto.'
                : 'O nome seguido de vírgula identifica a pessoa a quem se dirige o pedido ou a instrução.',
          ],
          `O modo é o ${answer}: ${d === 1 ? 'a frase apresenta uma ação como um facto' : d === 2 ? 'a oração introduzida por «Espero que» exprime uma ação desejada' : 'a frase dirige uma instrução a alguém tratado por tu'}. A intenção e a construção da frase ajudam a interpretar a forma verbal.`,
          [
            [
              'indicativo',
              'Uma instrução direta ou uma ação desejada não é uma simples afirmação de um facto. Observa a construção da frase.',
            ],
            [
              'imperativo',
              'O imperativo dirige uma instrução ou pedido ao interlocutor. Procura essa intenção no contexto.',
            ],
          ],
        ),
        kind: 'mcq',
        options: ['indicativo', 'conjuntivo', 'imperativo'],
        correctAnswer: answer,
      };
    },
    (ex) => ({
      kind: 'mcq',
      value: quote(ex).startsWith('Espero que')
        ? 'conjuntivo'
        : quote(ex).endsWith('!')
          ? 'imperativo'
          : 'indicativo',
    }),
  ),
  template(
    'pt-completar',
    'pt-verbos',
    'concordancia-verbal',
    (seed, d) => {
      const s = scene(seed, d),
        form = d === 1 ? s.verb.present : d === 2 ? s.verb.past : s.verb.pluralFuture;
      const tense = d === 1 ? 'presente' : d === 2 ? 'pretérito perfeito' : 'futuro';
      return {
        ...base(
          'pt-completar',
          'pt-verbos',
          seed,
          d,
          `Completa no ${tense} do indicativo, usando o verbo ${s.verb.infinitive}: «${s.subject} ___ ${s.object} ${s.place}.»`,
          [
            'Identifica o sujeito e verifica se é singular ou plural.',
            `Usa o ${tense} do indicativo; ${d === 3 ? 'o sujeito reúne duas pessoas, por isso a forma é plural' : 'o sujeito corresponde a ela'}.`,
          ],
          `A forma correta é «${form}». O sujeito «${s.subject}» corresponde a ${d === 3 ? 'elas (terceira pessoa do plural)' : 'ela (terceira pessoa do singular)'}. O tempo pedido é o ${tense}; o verbo tem de concordar com o sujeito.`,
          [
            [
              s.verb.infinitive,
              'O infinitivo nomeia o verbo, mas aqui é necessária uma forma pessoal que concorde com o sujeito.',
            ],
            [
              d === 3 ? s.verb.future : s.verb.pluralFuture,
              'Verifica o número do sujeito e o tempo pedido antes de escolher a forma.',
            ],
          ],
        ),
        kind: 'cloze',
        correctAnswers: [[form]],
      };
    },
    (ex) => {
      const v = verbIn(ex);
      return {
        kind: 'cloze',
        value: [
          ex.prompt.includes('no presente')
            ? v.present
            : ex.prompt.includes('no pretérito')
              ? v.past
              : v.pluralFuture,
        ],
      };
    },
  ),
  ...(['passiva', 'ativa', 'agente'] as const).map((concept) =>
    template(
      `pt-voz-${concept}`,
      'pt-voz',
      concept,
      (seed, d) => {
        const s = scene(seed, d),
          isPassive = concept === 'passiva';
        const chunks = isPassive
          ? [s.object[0]!.toUpperCase() + s.object.slice(1), s.passiveVerb, s.agent, `${s.place}.`]
          : [s.subject, s.activeVerb, s.object, `${s.place}.`];
        const b = base(
          `pt-voz-${concept}`,
          'pt-voz',
          seed,
          d,
          concept === 'agente'
            ? `Na frase «${s.passive}», qual é o complemento agente da passiva?`
            : `Transforma para a ${concept} a frase «${isPassive ? s.active : s.passive}» Ordena os grupos sem mudar o tempo verbal.`,
          [
            'Identifica quem pratica a ação e o que recebe essa ação.',
            'Na passiva, o complemento direto da ativa passa a sujeito; o verbo usa ser e um particípio que concorda com esse sujeito.',
            `Compara: «${s.active}» / «${s.passive}».`,
          ],
          `Na ativa, ${s.subject} é o sujeito e ${s.object} é o complemento direto. Na passiva, ${s.object} passa a sujeito; «${s.passiveVerb}» mantém o tempo e concorda com ele. «${s.agent}» indica quem pratica a ação: é o complemento agente da passiva.`,
          [
            [
              s.object,
              'Este grupo recebe a ação e é o sujeito da passiva. O agente é introduzido por por (pela/pelas).',
            ],
            [s.passiveVerb, 'Este grupo é o verbo da passiva, não o agente.'],
          ],
        );
        if (concept === 'agente')
          return {
            ...b,
            kind: 'mcq',
            options: [s.object, s.agent, s.passiveVerb, s.place],
            correctAnswer: s.agent,
          };
        return {
          ...b,
          kind: 'order',
          items: [chunks[2]!, chunks[0]!, chunks[3]!, chunks[1]!],
          correctAnswer: chunks,
        };
      },
      voiceSolve,
    ),
  ),
];
