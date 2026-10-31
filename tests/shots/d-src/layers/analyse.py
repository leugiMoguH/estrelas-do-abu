from pathlib import Path
from PIL import Image
import numpy as np
import json
P=Path(__file__).resolve().parent
G=np.array([0,255,0],dtype=np.float32)
def load(path): return np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
def dist(a): return np.sqrt(((a-G)**2).sum(axis=2))
def bbox(a):
    y,x=np.where(dist(a)>100)
    return [int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)] if len(x) else None
def key(a):
    alpha=np.clip((dist(a)-100)/60,0,1)
    rgb=a.copy()
    # Descontaminar apenas a transição, sem mudar os interiores pintados.
    edge=(alpha>0)&(rgb[:,:,1]>np.maximum(rgb[:,:,0],rgb[:,:,2])+20)
    rgb[:,:,1]=np.where(edge,np.minimum(rgb[:,:,1],np.maximum(rgb[:,:,0],rgb[:,:,2])),rgb[:,:,1])
    return Image.fromarray(np.dstack([rgb,alpha*255]).clip(0,255).astype('uint8'),'RGBA')
ref=load(P.parent/'girl_happy_green.png'); rb=bbox(ref)
rows=[]
for f in sorted(P.glob('*.png')):
    if f.name.startswith('composite'): continue
    a=load(f); b=bbox(a)
    rows.append({'name':f.name,'size':[a.shape[1],a.shape[0]],'pure_green_pct':float(np.all(a==G,axis=2).mean()*100),'bbox':b,'delta_ref':[b[i]-rb[i] for i in range(4)]})
canvas=Image.new('RGBA',(1024,1536),(0,0,0,0))
for name in ['body_base','hair_long','coat_open']:
    canvas=Image.alpha_composite(canvas,key(load(P/(name+'.png'))))
canvas.save(P/'composite_test.png')
# Fundo neutro para inspeção dos limites do recorte, sem alterar a composição original.
review=Image.new('RGBA',canvas.size,(224,224,224,255)); review.alpha_composite(canvas); review.convert('RGB').save(P/'composite_review.png')
(P/'metrics.json').write_text(json.dumps({'reference_bbox':rb,'threshold':100,'feather_to':160,'images':rows},ensure_ascii=False,indent=2),encoding='utf-8')
lines=['# Relatório — camadas D','Resultado: prova de alinhamento NÃO conseguida; seis peças geradas, com falhas de encaixe/isolamento.','8 chamadas image_gen: base 1, cabelo comprido 2, carrapitos 2, casaco 1, hoodie 1, acessórios 1; nenhuma recusa.','Motor integrado image_gen; ambas as referências originais em todas as chamadas; base acrescentada como molde nas peças.','A referência original tem mãos nos bolsos e pose inclinada; a base frontal altera necessariamente essa pose.','Imagens brutas preservadas; sem redimensionamento, translação, correção manual ou normalização do verde.','BBox = [x0,y0,x1,y1), píxeis com distância euclidiana RGB a #00FF00 >100.','Referência geométrica: girl_happy_green.png, 1024×1536; bbox '+str(rb)+'.','reference.webp é cenário com cão e foi usada apenas para estilo; bbox global não mede a rapariga isolada.','Δ = bbox da camada menos bbox da referência, por coordenada; camadas parciais têm extensões diferentes por definição.','A bbox global não prova alinhamento anatómico nem permite inferir sozinha desvio percentual de pose.','','| PNG | Dimensões | Verde puro | Bbox | Δ ref (px) |','|---|---|---:|---|---|']
for r in rows:
    lines.append('| '+r['name']+' | '+'×'.join(map(str,r['size']))+' | '+f"{r['pure_green_pct']:.3f}%"+' | '+str(r['bbox'])+' | '+str(r['delta_ref'])+' |')
lines += ['','body_base: sucesso como novo molde frontal; falha de identidade geométrica literal com a referência inclinada. Mãos/pés visíveis.','hair_long: falha; tentativa 1 ondulada, larga e risca lateral; tentativa 2 melhora forma mas conserva roupa e contornos do corpo.','hair_buns: falha de encaixe; segunda tentativa ainda coloca franja/coques demasiado baixos e largos face à cabeça careca.','coat_open: isolamento conseguido; pregas e abertura presentes; encaixe de gola/punhos requer inspeção da composição.','hoodie_shorts: isolamento conseguido; bainha sobe relativamente à base e deixa parte da camisola/calções neutros exposta.','glasses_hat: falha de alinhamento; óculos aproximadamente y315 em vez de y205; gorro demasiado baixo e largo.','Sem cabelo cortado nos limites da tela; não se confundem as diferenças de penteado com deslocações anatómicas.','Composição: body_base + hair_long (tentativa 2) + coat_open, nessa ordem, sem ajustes; PNG RGBA 1024×1536.','Chroma: distância <=100 transparente, transição linear 100–160; descontaminação verde só na transição.','composite_review.png mostra o mesmo resultado sobre cinzento para inspeção de halos.','Validação npm test/build não executada: tarefa limita a pós-produção a Python local e escritas a layers/.','Limite do ambiente: image_gen guarda automaticamente cópias em .codex/generated_images fora de layers; cópias entregues em layers.','Próximo passo: corrigir isolamento e âncoras anatómicas num editor por camadas antes de validar a direção D.']
(P/'REPORT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('Relatorio escrito; linhas:',len(lines))
