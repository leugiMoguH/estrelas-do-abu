import type { Chapter, Section } from '../estrutura';
import { availability } from '../estrutura';

// Subdivisões editoriais das AE, não títulos de um manual nem certificação de cobertura.
const section = (id: string, title: string, domain: string, lines: string, competencyIds: string[] = []): Section => ({
  id: `pt-sec-${id}`, title, official: `AE Português 6.º, «${domain}»: l.${lines}`,
  editorial: 'trabalho', competencyIds, ...(competencyIds[0] ? { lessonId: competencyIds[0] } : {}),
});
export const PT_CHAPTERS: readonly Chapter[] = [
  { id: 'pt-oralidade', title: 'Oralidade', editorial: 'trabalho', sections: [
    section('implicitos', 'Sentidos implícitos e fundamentação', 'Oralidade', '105'),
    section('factos-opinioes', 'Factos, opiniões e argumentos', 'Oralidade', '106'),
    section('comunicar', 'Informação essencial e opiniões fundamentadas', 'Oralidade', '109'),
    section('textos-orais', 'Planificar, produzir e avaliar textos orais', 'Oralidade', '110'),
    section('apresentacao', 'Apresentação oral e atenção da audiência', 'Oralidade', '111–139'),
    section('coesao-oral', 'Processos de coesão no discurso oral', 'Oralidade', '140'),
  ] },
  { id: 'pt-leitura', title: 'Leitura', editorial: 'trabalho', sections: [
    section('textos', 'Textos narrativos e expositivos em suportes variados', 'Leitura', '149'),
    section('modalidades-leitura', 'Leitura em voz alta, silenciosa e autónoma', 'Leitura', '150'),
    section('sentido', 'Sentido global e inferências justificadas', 'Leitura', '151–152'),
    section('estrutura-texto', 'Temas, ideias, pontos de vista e estrutura', 'Leitura', '173'),
    section('recursos-leitura', 'Recursos expressivos e tratamento da informação', 'Leitura', '173'),
    section('generos', 'Notícia, entrevista, anúncio, roteiro e publicidade', 'Leitura', '173'),
  ] },
  { id: 'pt-literaria', title: 'Educação literária', editorial: 'trabalho', sections: [
    section('obras', 'Leitura integral de obras e interpretação por género', 'Educação literária', '199'),
    section('conotacao', 'Sentido conotativo de palavras e expressões', 'Educação literária', '199'),
    section('poesia', 'Estrofe, rima, esquema rimático e redondilha', 'Educação literária', '199'),
    section('teatro', 'Ato, cena, fala e indicações cénicas', 'Educação literária', '199'),
    section('valores', 'Temas, experiências, valores e diversidade cultural', 'Educação literária', '199–229'),
    section('recursos-literarios', 'Recursos expressivos: anáfora e metáfora', 'Educação literária', '229'),
    section('partilha', 'Reações e partilha de leituras', 'Educação literária', '229'),
    section('projeto-leitura', 'Projeto pessoal de leitura e comparação de obras', 'Educação literária', '229'),
  ] },
  { id: 'pt-escrita', title: 'Escrita', editorial: 'trabalho', sections: [
    section('narrativa', 'Narrativa com diálogo e descrição', 'Escrita', '239'),
    section('revisao', 'Planificação, textualização e revisão', 'Escrita', '240'),
    section('escrita-digital', 'Processadores de texto, Web e partilha', 'Escrita', '241'),
    section('comunicacao-digital', 'Textos para blogues e fóruns', 'Escrita', '242'),
    section('exposicao-resumo', 'Exposição e resumo escolar', 'Escrita', '261'),
    section('opiniao', 'Textos de opinião e juízos de valor', 'Escrita', '261'),
  ] },
  { id: 'pt-gramatica', title: 'Gramática', editorial: 'trabalho', sections: [
    section('classes', 'Classes de palavras — consolidação (nomes, adjetivos e advérbios)', 'Gramática', '303', ['pt-classes']),
    section('flexao', 'Flexão verbal — tempos, modos e concordância (cobertura parcial)', 'Gramática', '294–296', ['pt-verbos']),
    section('voz', 'Voz ativa e passiva; agente da passiva', 'Gramática', '297–298', ['pt-voz']),
    section('classes-ae', 'Verbos copulativos e auxiliares, conjunções, indefinidos e quantificadores', 'Gramática', '262–293'),
    section('conjugar', 'Verbos regulares e irregulares: conjuntivo e condicional', 'Gramática', '294'),
    section('tempos-textos', 'Tempos verbais em frases complexas e textos', 'Gramática', '295'),
    section('imperativo', 'Conjuntivo como forma supletiva do imperativo', 'Gramática', '296'),
    section('funcoes', 'Predicativo do sujeito, complemento oblíquo e modificador', 'Gramática', '297'),
    section('discurso', 'Discurso direto e indireto', 'Gramática', '298'),
    section('pronomes', 'Próclise, ênclise e mesóclise', 'Gramática', '299'),
    section('oracoes', 'Coordenação e subordinação: classificação de orações', 'Gramática', '300–301, 323'),
    section('formacao', 'Derivação e composição', 'Gramática', '324'),
    section('pontuacao', 'Pontuação e construção da frase', 'Gramática', '325'),
    section('tratamento', 'Formas de tratamento em contextos formais', 'Gramática', '326'),
  ] },
];
export const PT_SECTIONS: readonly Section[] = PT_CHAPTERS.flatMap(c => c.sections);
export const PT_TEMPLATE_SECTION: Readonly<Record<string, string>> = {
  'pt-classe-nome': 'pt-sec-classes',
  'pt-classe-adjetivo': 'pt-sec-classes',
  'pt-classe-adverbio': 'pt-sec-classes',
  'pt-tempo': 'pt-sec-flexao',
  'pt-modo': 'pt-sec-flexao',
  'pt-completar': 'pt-sec-flexao',
  'pt-voz-passiva': 'pt-sec-voz',
  'pt-voz-ativa': 'pt-sec-voz',
  'pt-voz-agente': 'pt-sec-voz',
};
export const ptSectionById = (id: string): Section | undefined => PT_SECTIONS.find(s => s.id === id);
export function ptSectionInfo(id: string) {
  const active = Object.values(PT_TEMPLATE_SECTION).filter(s => s === id).length;
  const lesson = !!ptSectionById(id)?.lessonId;
  const status = availability(active, lesson);
  return { active, total: active, lesson, status, functional: status !== 'preparacao' };
}
