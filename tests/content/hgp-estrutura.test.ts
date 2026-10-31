import { describe, expect, it } from 'vitest';
import { HGP_CHAPTERS, HGP_SECTIONS, hgpItemSection, hgpSectionInfo } from '../../content';
import { hgpItems, hgpLessons } from '../../content/historia';
import { validationOf } from '../../content/historia/validacao';
import { hgpTopics } from '../../content/historia/topics';

describe('estrutura editorial de HGP (capítulos e subcapítulos do índice confirmado)', () => {
  it('capítulo de recuperação vem antes de D1 e traz só os títulos confirmados', () => {
    expect(HGP_CHAPTERS.slice(0, 3).map(c => c.id)).toEqual(['rec5', 'd1', 'd2']);
    expect(HGP_CHAPTERS[0]!.title).toBe('Recuperar aprendizagens — 5.º ano');
    expect(HGP_CHAPTERS[0]!.sections.map(s => s.title)).toEqual([
      'Portugal nos séculos XV e XVI', 'Expansão marítima portuguesa', 'Intercâmbio e choque de culturas', 'Da União Ibérica à Restauração da Independência',
    ]);
    expect(HGP_CHAPTERS[0]!.pending).toBeTruthy();
    expect(HGP_CHAPTERS[1]!.pages).toBe('págs. 20–40');
    expect(HGP_CHAPTERS[2]!.pages).toBe('a partir da pág. 42');
  });
  it('D1 tem os 8 subcapítulos confirmados (+1 complemento AE assinalado), na ordem do índice', () => {
    const d1 = HGP_CHAPTERS.find(c => c.id === 'd1')!;
    expect(d1.sections.filter(s => !s.extra).map(s => s.title)).toEqual([
      'Importância do Brasil para a economia portuguesa: açúcar e escravização', 'Ouro, diamantes e escravização',
      'Legado africano nas sociedades portuguesa e brasileira', 'Sociedade de ordens do século XVIII', 'Monarquia absoluta e reinado de D. João V',
      'Construções barrocas e património de D. João V', 'O Marquês de Pombal e as transformações de Lisboa e Portugal', 'Síntese e avaliação dos conhecimentos',
    ]);
    expect(d1.sections.filter(s => s.extra)).toHaveLength(1);
  });
  it('ids únicos e cada subcapítulo oficial referencia as AE', () => {
    expect(new Set(HGP_SECTIONS.map(s => s.id)).size).toBe(HGP_SECTIONS.length);
    for (const s of HGP_SECTIONS) expect(s.official.trim(), s.id).not.toBe('');
  });
  it('cada pergunta pertence a exatamente um subcapítulo existente, do tema oficial correto', () => {
    for (const item of hgpItems) {
      const section = hgpItemSection(item.id);
      const found = HGP_SECTIONS.find(s => s.id === section);
      expect(found, item.id).toBeTruthy();
      expect(found!.topic, item.id).toBe(item.topic);
    }
  });
  it('só são «funcionais» os subcapítulos com ≥3 perguntas ativas e lição; os restantes ficam assinalados', () => {
    for (const s of HGP_SECTIONS) {
      const info = hgpSectionInfo(s.id);
      expect(info.functional, s.id).toBe(info.active >= 3 && info.lesson);
    }
    for (const id of ['rec5-xv-xvi', 'rec5-expansao', 'rec5-intercambio', 'rec5-uniao-restauracao']) expect(hgpSectionInfo(id).functional, id).toBe(false);
    const d1 = HGP_CHAPTERS.find(c => c.id === 'd1')!;
    for (const s of d1.sections) expect(hgpSectionInfo(s.id).functional, s.id).toBe(true);
    // 66 perguntas ativas nos 8 subcapítulos do índice (+3 do complemento), 69 ao todo
    const active = (ids: string[]) => ids.reduce((n, id) => n + hgpSectionInfo(id).active, 0);
    expect(active(d1.sections.filter(s => !s.extra).map(s => s.id))).toBe(66);
    expect(active(d1.sections.map(s => s.id))).toBe(69);
  });
  it('perguntas excluídas não contam e os temas restantes ficam acessíveis pelo tema completo', () => {
    const excluded = hgpItems.filter(i => validationOf(i.id) === 'a-confirmar');
    for (const i of excluded) expect(hgpItemSection(i.id)).toBeTruthy();
    for (const topic of hgpTopics.filter(t => t.id !== 'hgp-seculo-xviii')) {
      const info = hgpSectionInfo(`prov-${topic.id}`);
      expect(info.total, topic.id).toBeGreaterThan(0);
    }
  });
  it('lição por subcapítulo existe para todos os subcapítulos funcionais do D1', () => {
    const lesson = hgpLessons.find(l => l.id === 'hgp-seculo-xviii')!;
    const d1 = HGP_CHAPTERS.find(c => c.id === 'd1')!;
    for (const s of d1.sections) {
      const text = lesson.sections?.find(x => x.id === s.id);
      expect(text, s.id).toBeTruthy();
      expect(text!.explanation.join(' ').length, s.id).toBeGreaterThan(150);
    }
  });
});
