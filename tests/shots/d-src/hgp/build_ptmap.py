"""Gera content/historia/pt-map.ts a partir do Natural Earth (dominio publico) admin-1: 18 distritos + Açores e Madeira. Uso: python build_ptmap.py"""
import json, math, unicodedata, os
g = json.load(open('ne_admin1.geojson', encoding='utf-8'))
feats = [f for f in g['features'] if f['properties'].get('adm0_a3') == 'PRT']
def slug(n):
    n = {'Azores': 'Açores'}.get(n, n)
    return unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower().replace(' ', '-')
def dp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy) or 1e-12
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L
        if d > dmax: dmax, idx = d, i
    if dmax > eps: return dp(pts[:idx + 1], eps)[:-1] + dp(pts[idx:], eps)
    return [pts[0], pts[-1]]
def dp_ring(pts, eps):
    if pts[0] == pts[-1]: pts = pts[:-1]
    far = max(range(len(pts)), key=lambda i: (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2)
    a = dp(pts[:far + 1], eps); b = dp(pts[far:] + [pts[0]], eps)
    return a[:-1] + b[:-1]
def rings(f):
    geo = f['geometry']; polys = [geo['coordinates']] if geo['type'] == 'Polygon' else geo['coordinates']
    return [poly[0] for poly in polys]  # só anel exterior
def area(r): return abs(sum(r[i][0] * r[(i + 1) % len(r)][1] - r[(i + 1) % len(r)][0] * r[i][1] for i in range(len(r)))) / 2
# transformações: (lon,lat)->(x,y)
def tf(lon0, lat1, s, ox, oy, lat0=39.5):
    k = math.cos(math.radians(lat0))
    return lambda lon, lat: (ox + (lon - lon0) * k * s, oy + (lat1 - lat) * s)
main = tf(-9.55, 42.16, 72, 118, 10)
azo = tf(-31.4, 39.75, 21, 3, 262)     # Açores: 3 grupos, escala pequena
mad = tf(-17.3, 33.15, 60, 8, 336)
out = {}
for f in feats:
    name = f['properties']['name']; sid = slug(name)
    t = azo if sid == 'acores' else mad if sid == 'madeira' else main
    eps = 0.012 if t is main else 0.006
    parts = []
    for r in rings(f):
        if area(r) < (0.0006 if t is main else 0.00002): continue
        pts = dp_ring([tuple(p[:2]) for p in r], eps)
        xy = [t(*p) for p in pts]
        parts.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in xy) + 'Z')
    out[sid] = {'name': name.replace('Azores', 'Açores'), 'd': ''.join(parts)}
order = sorted(out)
ts = ["/** Mapa de Portugal por distritos (Natural Earth, domínio público; simplificado). Gerado por tests/shots/d-src/hgp/build_ptmap.py. */",
      "export const PT_MAP_VIEWBOX = '0 0 300 400';",
      "export const PT_MAP: Readonly<Record<string, { name: string; d: string }>> = {"]
for k in order: ts.append(f"  {json.dumps(k)}: {{ name: {json.dumps(out[k]['name'], ensure_ascii=False)}, d: {json.dumps(out[k]['d'])} }},")
ts.append('};')
open('../../../../content/historia/pt-map.ts', 'w', encoding='utf-8', newline='\n').write('\n'.join(ts) + '\n')
print(len(order), sum(len(v['d']) for v in out.values()), 'bytes de caminhos')
