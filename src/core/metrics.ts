import type { Exercise } from './types';
import { normalize } from './grading';
export function measure(
  sessions: readonly (readonly Exercise[])[],
  eligibleConcepts: readonly string[],
  requestedPerSession: number,
  window = 20,
) {
  const all = sessions.flat();
  let longest = 0,
    run = 0,
    last: string | undefined;
  let repeats = 0;
  const concepts = new Set<string>();
  const approaches: Record<string, number> = Object.create(null) as Record<string, number>;
  const formats: Record<string, number> = Object.create(null) as Record<string, number>;
  all.forEach((ex, i) => {
    const concept = `${ex.competencyId}/${ex.conceptId ?? ''}`;
    concepts.add(concept);
    run = concept === last ? run + 1 : 1;
    longest = Math.max(longest, run);
    last = concept;
    if (all.slice(Math.max(0, i - window), i).some((e) => normalize(e.prompt) === normalize(ex.prompt)))
      repeats++;
    const approach = ex.approachId ?? 'unknown';
    approaches[approach] = (approaches[approach] ?? 0) + 1;
    formats[ex.kind] = (formats[ex.kind] ?? 0) + 1;
  });
  const signatureCounts = new Map<string, number>();
  for (const ex of all) {
    const signature = normalize(ex.prompt);
    signatureCounts.set(signature, (signatureCounts.get(signature) ?? 0) + 1);
  }
  const reuseCounts = [...signatureCounts.values()];
  const signatureReuseDistribution = {
    once: reuseCounts.filter((n) => n === 1).length,
    twice: reuseCounts.filter((n) => n === 2).length,
    threeOrMore: reuseCounts.filter((n) => n >= 3).length,
  };
  const maxShare = (counts: Record<string, number>) =>
    all.length ? Math.max(0, ...Object.values(counts)) / all.length : 0;
  return {
    sessions: sessions.length,
    exercises: all.length,
    conceptCoverage: eligibleConcepts.length
      ? eligibleConcepts.filter((c) => concepts.has(c)).length / eligibleConcepts.length
      : 0,
    longestConceptRun: longest,
    signatureWindow: window,
    repeatedSignatureRate: all.length ? repeats / all.length : 0,
    maxApproachShare: maxShare(approaches),
    maxFormatShare: maxShare(formats),
    sufficientSessionRate: sessions.length
      ? sessions.filter((s) => s.length >= requestedPerSession).length / sessions.length
      : 0,
    uniqueSignatures: signatureCounts.size,
    uniqueSignatureRatio: all.length ? signatureCounts.size / all.length : 0,
    maxSignatureReuse: Math.max(0, ...reuseCounts),
    signatureReuseDistribution,
  };
}
