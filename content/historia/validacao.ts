/**
 * Estado de validação por item (ver docs/audit/auditoria-itens.json e docs/audit/relatorio-qualidade.md).
 * - documental: facto confrontado nesta auditoria com fonte consultada (resultados de pesquisa em fontes institucionais);
 * - calculo: resposta obtida por cálculo a partir de dados dados no enunciado;
 * - revisto: lido e conferido por coerência e conhecimento do revisor, sem prova externa independente;
 * - a-confirmar: não entra em sessões normais até ser confirmado.
 * «revisto» NÃO equivale a validação documental.
 */
import { XVIII_EXERCISES } from '../kb/historia/xviii';
import { eligibleExercise } from '../kb/historia/xviii.validation';
const generated = new Map(XVIII_EXERCISES.map(e => [`hgp-seculo-xviii-k-${e.id.replace(/\./g, '-')}`, eligibleExercise(e)]));
export type HgpValidation = 'documental' | 'calculo' | 'revisto' | 'a-confirmar';

const DOCUMENTAL = [
  'hgp-populacao-02', 'hgp-populacao-05', 'hgp-lugares-03', 'hgp-lugares-09', 'hgp-lugares-10', 'hgp-mundo-02', 'hgp-mundo-05',
  'hgp-lazer-08', 'hgp-liberalismo-06', 'hgp-atividades-04', 'hgp-xix-segunda-metade-13', 'hgp-xix-segunda-metade-14',
  'hgp-republica-13', 'hgp-republica-14', 'hgp-ditadura-13', 'hgp-lazer-14',
];
const CALCULO = ['hgp-populacao-08', 'hgp-populacao-09', 'hgp-lugares-09', 'hgp-atividades-08', 'hgp-atividades-09', 'hgp-mundo-10'];
const A_CONFIRMAR = [
  'hgp-lugares-04', 'hgp-lugares-08', 'hgp-lazer-06', 'hgp-lazer-07', 'hgp-lazer-12', 'hgp-atividades-05', 'hgp-atividades-07',
  'hgp-xix-segunda-metade-06', 'hgp-lugares-06',
  // Séc. XVIII, versão provisória (2026-10-31): apoio factual só parcial na ficha (docs/hgp); excluídos das sessões até revisão.
  'hgp-seculo-xviii-55', 'hgp-seculo-xviii-57', 'hgp-seculo-xviii-66', 'hgp-seculo-xviii-67',
  // Recuperação 5.º ano (2026-10-31): resposta formulada de forma vaga (vice-rei/governadores), sem fonte que a fixe; excluído das sessões.
  'hgp-recuperacao-5-47',
];

export const HGP_A_CONFIRMAR: readonly string[] = A_CONFIRMAR;

export function validationOf(id: string): HgpValidation {
  if (A_CONFIRMAR.includes(id)) return 'a-confirmar';
  if (id.startsWith('hgp-seculo-xviii-k-')) return generated.get(id) ? 'documental' : 'a-confirmar';
  if (CALCULO.includes(id) && !DOCUMENTAL.includes(id)) return 'calculo';
  if (DOCUMENTAL.includes(id)) return 'documental';
  return 'revisto';
}
