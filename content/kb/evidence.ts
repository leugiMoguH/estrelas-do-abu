import type { Atom } from './schema';

/**
 * Evidência de um conhecimento. Três dimensões separadas:
 *  - tipo de evidência (documental / determinístico),
 *  - estado de revisão (verificação por conteúdo, atestado de leitura, pendente, rejeitado),
 *  - elegibilidade (entra ou não nas sessões normais).
 * Os testes automáticos NÃO são verificação histórica: aqui só conta a fonte confirmar o facto.
 */
export type SourceKind = 'wikipedia' | 'referencia' | 'oficial' | 'academica' | 'divulgacao';
export interface EvidenceSource { readonly title: string; readonly url: string; readonly atestado?: string; readonly kind?: string; readonly group?: string }
export interface EvidenceEntry { readonly status: string; readonly text: string; readonly chave?: readonly string[]; readonly sources: readonly EvidenceSource[] }
export type EvidenceMap = Readonly<Record<string, EvidenceEntry>>;
export interface PageCheck { readonly estado: string; readonly em: Readonly<Record<string, { readonly ok: boolean }>> }
export type FetchMap = Readonly<Record<string, PageCheck>>;

export type KnowledgeState = 'documental' | 'deterministico' | 'revisto' | 'pendente' | 'rejeitado';
export interface KnowledgeVerdict { readonly state: KnowledgeState; readonly eligible: boolean; readonly why: string }

const host = (url: string): string => new URL(url).hostname.replace(/^(www\d?|en|pt|m)\./, '');

const REFERENCIA = /(^|\.)(infopedia\.pt|priberam\.org|britannica\.com)$/;
const OFICIAL = /(^|\.)(dge\.mec\.pt|unesco\.org|portugal\.gov\.pt|gov\.br|iphan\.gov\.br|bnportugal\.gov\.pt|parquesdesintra\.pt|tesouroreal\.pt|ibge\.gov\.br|arquivos?\.pt|ba\.gov\.br|epal\.pt|patrimoniocultural\.gov\.pt)$/;
const ACADEMICA = /(^|\.)(redalyc\.org|scielo\.br|uc\.pt|unl\.pt|rcaap\.pt|usp\.br|ufs\.br|ufmg\.br|ufrgs\.br|uerj\.br|uff\.br|ufes\.br|ufjf\.br|ufmt\.br|unicamp\.br|ufrj\.br|ufc\.br|anpuh\.org|puc-campinas\.edu\.br|uevora\.pt|uab\.pt|unisinos\.br|uespi\.br|fapesp\.br|usal\.es|upo\.es|fiu\.edu|ugb\.edu\.br|ge-iic\.com|cedeplar\.ufmg\.br|fcsh\.unl\.pt|unicamp\.br|uc\.pt|nppg\.org\.br|arquivoestado\.sp\.gov\.br)$/;

export function classifySource(url: string): { kind: SourceKind; group: string } {
  const h = host(url);
  if (/wikipedia\.org$/.test(h)) return { kind: 'wikipedia', group: 'wikipedia' };
  if (REFERENCIA.test(h)) return { kind: 'referencia', group: h };
  if (OFICIAL.test(h)) return { kind: 'oficial', group: h.split('.').slice(-3).join('.') };
  if (ACADEMICA.test(h)) return { kind: 'academica', group: h.split('.').slice(-3).join('.') };
  return { kind: 'divulgacao', group: h };
}
const QUALIFYING: ReadonlySet<SourceKind> = new Set(['referencia', 'oficial', 'academica']);

/** Fontes de um facto que contam para a independência: qualificadas, de origens distintas, e confirmadas por conteúdo (ou por atestado de leitura rastreável). */
export function countedGroups(fact: string, ev: EvidenceEntry, fetched: FetchMap): { verified: string[]; attested: string[] } {
  const verified = new Set<string>(), attested = new Set<string>();
  for (const s of ev.sources) {
    const classified = classifySource(s.url);
    const kind = s.atestado && s.kind ? s.kind as SourceKind : classified.kind;
    const group = s.atestado && s.group ? s.group : classified.group;
    if (!QUALIFYING.has(kind)) continue;
    // Unicamente atestados de leitura contextual rastreáveis contam; tokens não provam apoio.
    if (s.atestado) attested.add(group);
  }
  for (const g of verified) attested.delete(g);
  return { verified: [...verified], attested: [...attested] };
}

export interface Rules {
  /** exceções justificadas e revistas: conhecimento → motivo (ex.: documento primário competente). */
  readonly accepted?: Readonly<Record<string, string>>;
  readonly rejected?: Readonly<Record<string, string>>;
  /** conhecimentos obtidos por cálculo/regra, verificados por método determinístico. */
  readonly deterministic?: ReadonlySet<string>;
}

export function verdictOf(atom: Atom, evidence: EvidenceMap, fetched: FetchMap, rules: Rules = {}): KnowledgeVerdict {
  if (rules.rejected?.[atom.id]) return { state: 'rejeitado', eligible: false, why: rules.rejected[atom.id]! };
  if (rules.deterministic?.has(atom.id)) return { state: 'deterministico', eligible: true, why: 'resultado verificado por cálculo' };
  const reasons: string[] = [];
  let state: KnowledgeState = 'documental';
  for (const f of evidence[`A:${atom.id}`] ? [`A:${atom.id}`] : atom.fichas) {
    const ev = evidence[f];
    if (!ev || ev.status !== 'confirmado') return { state: 'pendente', eligible: false, why: `${f}: ${ev?.status ?? 'inexistente'}` };
    const { verified, attested } = countedGroups(f, ev, fetched);
    const n = verified.length + attested.length;
    if (n >= 2 || rules.accepted?.[atom.id]) continue;
    if (n === 1 && state === 'documental') state = 'revisto';
    if (n === 0) state = 'pendente';
    reasons.push(`${f}: ${n} origem(ns) independente(s) verificada(s)`);
  }
  if (reasons.length) return { state, eligible: false, why: reasons.join('; ') };
  return { state: 'documental', eligible: true, why: rules.accepted?.[atom.id] ?? 'confirmado por ≥2 origens independentes (conteúdo verificado ou leitura atestada)' };
}
