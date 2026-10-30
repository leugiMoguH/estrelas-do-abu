# Contrato da demo (fecha interfaces entre partes paralelas)

Prioridade: experiência jogável, bonita, intuitiva. Núcleo `src/core` JÁ existe: reutilizar, não reconstruir. PT-PT, linguagem simples, tom caloroso e não infantil (11–12 anos).

## Parte A — Conteúdo (`content/matematica/`, `content/portugues/`, `content/index.ts`, `tests/content/`)
Exporta de `content/index.ts`:
```ts
export const gamePack: ContentPack;                 // id 'estrelas', junta Matemática + Português, review 'approved'
export interface Topic { id: string; subject: 'matematica'|'portugues'; title: string; blurb: string; icon: string /*emoji*/; competencyIds: string[] }
export const TOPICS: Topic[];                       // 3 por disciplina
export const SUBJECTS: {id:'matematica'|'portugues'|'ingles'|'historia'|'ciencias'|'evt'|'musica'; name:string; building:string; active:boolean}[]; // 7; só 2 active
```
Temas: Matemática — racionais (frações/decimais), prioridades das operações, proporcionalidade direta. Português — classes de palavras, tempos e modos verbais, frase ativa e passiva. Por tema: ≥3 conceitos/abordagens distintos, formatos mistos (mcq, numeric, cloze, order, text fechado), dificuldades 1–3, pistas graduais (2–3), explicação concreta do erro (`commonErrors` úteis, distratores baseados em erros típicos, não resposta±1), `explanation` que ensina. Respostas calculadas por código; `solve` independente quando possível; Português apenas itens de resposta objetivamente determinável (classes de palavras, tempo verbal, ativa↔passiva, completar), textos originais curtos. `review:'approved'`, `source` a dizer «revisão: Claude+Codex, sem revisão docente».

## Parte B1 — Arte (`src/art/`, `src/styles/art.css`)
Tudo SVG inline gerado por funções (strings), paleta única quente/suave, contornos suaves, estilo ilustrado fofo coerente.
```ts
export interface AvatarConfig { skin:string; hairStyle:string; hairColor:string; eyes:string; expression:string; top:string; bottom:string; shoes:string; accessory:string|null; abuAccessory:string|null }
export const SKIN_TONES: {id:string;name:string;hex:string}[];   // ≥8, diversos
export const HAIR_COLORS, EYE_STYLES, EXPRESSIONS: {id:string;name:string;hex?:string}[];
export interface CatalogItem { id:string; slot:'hairStyle'|'top'|'bottom'|'shoes'|'accessory'|'abuAccessory'; name:string; price:number; free:boolean }
export const CATALOG: CatalogItem[];   // ≥ 8 gratuitos (incluir opções para cada slot) + ≥ 12 pagos; preços 5–40; pelo menos 2 itens de 5 estrelas (1.ª sessão paga um)
export function defaultAvatar(): AvatarConfig;
export function randomAvatar(rng:()=>number, ownedIds:readonly string[]): AvatarConfig;   // só itens gratuitos/possuídos
export function avatarSvg(cfg:AvatarConfig, o?:{pose?:'idle'|'cheer'|'think'; size?:number; withAbu?:boolean}): string;
export type AbuPose='idle'|'sit'|'happy'|'sleep'|'think'|'wag';
export function abuSvg(pose:AbuPose, accessoryId?:string|null): string;   // pinscher ilustrado: pelo curto castanho-avermelhado, orelhas pontiagudas, focinho escuro; animações CSS: piscar, cauda, respirar
export function mapSvg(o:{activeSubjects:readonly string[]}): string;      // centro escolar ilustrado; edifícios com data-target="<subjectId>" role="button" tabindex="0" aria-label; praça com data-target="loja"|"conquistas"|"minijogo"; inativos mostram selo «Em preparação»
export function roomSvg(subject:string): string;                            // fundo de sala (quadro, secretária, objetos) por disciplina, sem texto de exercício
export function starSvg(size?:number): string;
export function welcomeSvg(): string;                                       // cena do ecrã inicial (fundo animado suave)
```
Subjects/edifícios: matematica=Laboratório dos Números, portugues=Biblioteca, ingles=Casa das Línguas, historia=Museu das Descobertas, ciencias=Jardim das Ciências, evt=Atelier Criativo, musica=Estúdio Musical. Respeitar `prefers-reduced-motion` e classe `body.reduce-motion` (sem animações). Tudo escalável (viewBox), sem imagens externas. Uma página de demonstração `art-preview.html` (+`src/art/preview.ts`) mostra avatar com várias configs, Abu em todas as poses, mapa e salas, para inspeção.

## Parte B2a — App: fluxo (`src/app/*`, `src/main.ts`, `src/styles/app.css`, `index.html`)
Router por ecrã: welcome → onboarding (ano 6.º por defeito, avatar, conhecer Abu, dica) → mapa → sala (escolher tema, modo Estudar/Teste/Rever, nº de exercícios, predefinição inteligente) → sessão → resultado. `src/app/store.ts`: estado único `AppState` {profile{nickname?, grade, onboarded, avatar:AvatarConfig, equipped}, options{music,sfx,volume,reduceMotion,textScale}, lastTopicId, favorites[], save: Save(core), ui} com `getState/update/subscribe`; persistência localStorage chaves `eda:app:v1` e `eda:save:v2` (via core exportSave/importSave, falha de armazenamento tolerada). Sessão usa `materialize` + `buildSession` + `grade` + `updateMastery` + `score` + `rewardSession` + registo de `seen`/`mistakes` do core. 1.ª sessão = 3 perguntas. Estrelas mostradas no topo. Botão «Continuar a estudar». Voltar consistente. Teclado numérico (`inputmode="decimal"`) em respostas numéricas; ordenar por toque (sem arrastar obrigatório). Abu reage (poses) sem tapar perguntas. Resultado: nota 0–20 (Teste), competências dominadas/a rever, estrelas ganhas, botão «Estudar os erros». Layout responsivo 390×844, 820×1180, 1280×800 sem scroll horizontal.
Stub dos ecrãs da Parte B2b: hooks `openProfile()`, `openShop()`, `openAchievements()`, `openMinigame()`, `openOptions()`, `openProgress()` em `src/app/extras.ts` (B2b implementa).

## Parte B2b — Extras (`src/app/extras/*`, `src/app/audio.ts`, `src/styles/extras.css`) — só depois de B2a
Perfil com separadores Personalizar/Loja/Coleção (pré-visualização grande imediata, «Surpreende-me», conjuntos favoritos, compra com `buy`, item comprado aplicado na personagem/Abu), Conquistas (lista simples derivada do estado), Minijogo de memória (opcional, dá ≤2 estrelas/dia via ledger), Opções (música, efeitos, volume, reduzir animações, tamanho do texto, exportar/importar cópia, apagar progresso com confirmação), Progresso (níveis por tema com os nomes: A descobrir / A praticar / A progredir / Bem consolidado / A rever), áudio WebAudio sintetizado (3–4 efeitos suaves + música ambiente simples gerada) iniciado após o 1.º toque.

## Regras comuns
Sem dependências novas (exceto dev já instaladas). Sem rede em runtime. Não tocar em `src/core` (se faltar algo, reportar). Ignorar erros transitórios de ficheiros de outras partes em curso. Não fazer commit/push. Resumo final ≤20 linhas.
