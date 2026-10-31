import type { HgpTopicId } from './schema';

/**
 * Estrutura EDITORIAL do manual de HGP (capítulos e subcapítulos do índice), distinta da classificação OFICIAL
 * (tema das Aprendizagens Essenciais, `topic`/`official`) mas ligada a ela.
 *
 * Só consta o que o produtor confirmou por escrito. As fotografias do índice não estão disponíveis em nenhuma sessão
 * guardada: os capítulos/subcapítulos marcados `provisional` ou `pending` aguardam o índice completo e NÃO devem ser
 * dados como completos. Não acrescentar títulos que não estejam confirmados.
 */
export interface HgpSection {
  id: string;
  title: string;
  /** Referência oficial (Aprendizagens Essenciais de HGP, 6.º ano; linhas de docs/curriculo/src/ae-hgp6.txt). */
  official: string;
  /** Tema oficial a que pertencem as perguntas deste subcapítulo (competência). */
  topic?: HgpTopicId;
  /** Entrada que cobre o tema inteiro, porque os subcapítulos do manual ainda não estão confirmados. */
  provisional?: boolean;
  /** Complemento das AE que não consta como subcapítulo confirmado do índice. */
  extra?: boolean;
}
export interface HgpChapter {
  id: string;
  title: string;
  pages?: string;
  /** Nota visível quando a lista de subcapítulos está por confirmar. */
  pending?: string;
  sections: readonly HgpSection[];
}

const D1: HgpTopicId = 'hgp-seculo-xviii';
const d1 = (id: string, title: string, official: string, extra = false): HgpSection => ({ id: `d1-${id}`, title, official, topic: D1, ...(extra ? { extra: true } : {}) });

const provisional = (topic: HgpTopicId, title: string, official: string): HgpSection => ({ id: `prov-${topic}`, title, official, topic, provisional: true });

export const HGP_CHAPTERS: readonly HgpChapter[] = [
  {
    id: 'rec5',
    title: 'Recuperar aprendizagens — 5.º ano',
    pending: 'Faltam confirmar no índice os restantes subcapítulos deste capítulo.',
    sections: [
      { id: 'rec5-xv-xvi', title: 'Portugal nos séculos XV e XVI', official: 'Matéria de recuperação do 5.º ano' },
      { id: 'rec5-expansao', title: 'Expansão marítima portuguesa', official: 'Matéria de recuperação do 5.º ano' },
      { id: 'rec5-intercambio', title: 'Intercâmbio e choque de culturas', official: 'Matéria de recuperação do 5.º ano' },
      { id: 'rec5-uniao-restauracao', title: 'Da União Ibérica à Restauração da Independência', official: 'Matéria de recuperação do 5.º ano' },
    ],
  },
  {
    id: 'd1',
    title: 'D1 — Portugal no século XVIII',
    pages: 'págs. 20–40',
    sections: [
      d1('brasil-acucar', 'Importância do Brasil para a economia portuguesa: açúcar e escravização', 'AE HGP 6.º, «Portugal no século XVIII»: l.104–105'),
      d1('ouro-diamantes', 'Ouro, diamantes e escravização', 'AE HGP 6.º, «Portugal no século XVIII»: l.104–105'),
      d1('legado-africano', 'Legado africano nas sociedades portuguesa e brasileira', 'AE HGP 6.º, «Portugal no século XVIII»: l.129'),
      d1('sociedade-ordens', 'Sociedade de ordens do século XVIII', 'AE HGP 6.º, «Portugal no século XVIII»: l.107 e l.131 (conceito cristão-novo)'),
      d1('monarquia-joao-v', 'Monarquia absoluta e reinado de D. João V', 'AE HGP 6.º, «Portugal no século XVIII»: l.108 e l.131 (conceito monarquia absoluta)'),
      d1('barroco-patrimonio', 'Construções barrocas e património de D. João V', 'AE HGP 6.º, «Portugal no século XVIII»: l.108'),
      d1('pombal-lisboa', 'O Marquês de Pombal e as transformações de Lisboa e Portugal', 'AE HGP 6.º, «Portugal no século XVIII»: l.130–131 (conceito mudança)'),
      d1('sintese', 'Síntese e avaliação dos conhecimentos', 'AE HGP 6.º, «Portugal no século XVIII»: l.103–131 (revisão do capítulo)'),
      d1('extra-novas-culturas', 'Complemento das AE: novas culturas (milho e batata) — fora do índice confirmado', 'AE HGP 6.º, «Portugal no século XVIII»: l.106', true),
    ],
  },
  {
    id: 'd2',
    title: 'D2 — O triunfo do liberalismo',
    pages: 'a partir da pág. 42',
    pending: 'Os subcapítulos deste capítulo ainda não estão confirmados no índice: está disponível o tema completo.',
    sections: [provisional('hgp-liberalismo', 'O triunfo do liberalismo — tema completo', 'AE HGP 6.º: O liberalismo e o século XIX')],
  },
  {
    id: 'seguintes',
    title: 'Capítulos seguintes',
    pending: 'A hierarquia destes capítulos (numeração e subcapítulos) ainda não está confirmada no índice: estão disponíveis os temas completos.',
    sections: [
      provisional('hgp-xix-segunda-metade', 'Portugal na segunda metade do século XIX — tema completo', 'AE HGP 6.º: O liberalismo e o século XIX'),
      provisional('hgp-republica', 'A revolução republicana — tema completo', 'AE HGP 6.º: Portugal no século XX'),
      provisional('hgp-ditadura', 'Os anos da ditadura — tema completo', 'AE HGP 6.º: Portugal no século XX'),
      provisional('hgp-25-abril', 'O 25 de Abril e a construção da democracia — tema completo', 'AE HGP 6.º: Portugal no século XX'),
      provisional('hgp-populacao', 'A população portuguesa — tema completo', 'AE HGP 6.º: Portugal atual'),
      provisional('hgp-lugares', 'Os lugares onde vivemos — tema completo', 'AE HGP 6.º: Portugal atual'),
      provisional('hgp-atividades', 'As atividades económicas — tema completo', 'AE HGP 6.º: Portugal atual'),
      provisional('hgp-lazer', 'Como ocupamos os tempos livres — tema completo', 'AE HGP 6.º: Portugal atual'),
      provisional('hgp-mundo', 'O mundo mais perto de nós — tema completo', 'AE HGP 6.º: Portugal atual'),
    ],
  },
];

export const HGP_SECTIONS: readonly HgpSection[] = HGP_CHAPTERS.flatMap((chapter) => chapter.sections);
export const hgpSectionById = (id: string): HgpSection | undefined => HGP_SECTIONS.find((section) => section.id === id);
export const hgpChapterOfSection = (id: string): HgpChapter | undefined => HGP_CHAPTERS.find((chapter) => chapter.sections.some((section) => section.id === id));

/** Subcapítulo de cada pergunta de «Portugal no século XVIII» (por número do id). Cada pergunta pertence a UM subcapítulo. */
const bySuffix = (section: string, numbers: readonly number[]): [string, string][] =>
  numbers.map((n) => [`hgp-seculo-xviii-${String(n).padStart(2, '0')}`, `d1-${section}`]);
const D1_ITEMS = new Map<string, string>([
  ...bySuffix('brasil-acucar', [13, 15, 16, 17]),
  ...bySuffix('ouro-diamantes', [2, 18, 19, 20, 21, 22]),
  ...bySuffix('legado-africano', [23, 24, 63, 64, 65, 66, 67]),
  ...bySuffix('sociedade-ordens', [3, 25, 26, 27, 58, 68, 69, 73]),
  ...bySuffix('monarquia-joao-v', [14, 28, 31, 52, 56, 59, 70, 71, 72]),
  ...bySuffix('barroco-patrimonio', [7, 29, 30, 32, 33, 34, 35, 50, 53]),
  ...bySuffix('pombal-lisboa', [1, 4, 5, 6, 10, 11, 12, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 51, 54, 55, 57, 62]),
  ...bySuffix('sintese', [8, 9, 42, 60, 61]),
  ...bySuffix('extra-novas-culturas', [47, 48, 49]),
]);

/** Id do subcapítulo da pergunta; os restantes temas usam a entrada provisória do tema completo. */
export function hgpSectionOfItem(itemId: string, topic: HgpTopicId): string | undefined {
  if (topic === D1) return D1_ITEMS.get(itemId);
  return `prov-${topic}`;
}
