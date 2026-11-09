import { it, expect } from 'vitest';
import { mapD } from '../../src/art/d/scenes';

// Bloco A (2026-11-09): o mapa D não desenha molduras amarelas permanentes à volta dos edifícios.
// O foco por teclado continua a existir via CSS (.map-hit:focus-visible .map-focus).
it('mapa D sem moldura permanente e com alvos focáveis', () => {
  const svg = mapD({ activeSubjects: ['matematica', 'portugues', 'historia'] });
  expect(svg).not.toContain('#ffcf65');
  expect(svg).not.toContain('map-ring');
  const rings = [...svg.matchAll(/<rect class="map-focus"[^>]*stroke="([^"]+)"/g)].map((m) => m[1]);
  expect(rings.length).toBeGreaterThan(0);
  expect(rings.every((stroke) => stroke === 'transparent')).toBe(true);
  expect(svg.match(/class="map-hit"[^>]*tabindex="0"/g)?.length).toBeGreaterThanOrEqual(3);
});
