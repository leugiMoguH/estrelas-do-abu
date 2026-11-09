# F2 — revisão de game design e UX (Claude, 2026-11-09)

Feedback do produtor após jogar `prototipos/f2/`: confuso, pouco intuitivo, pouco dinâmico, pouco divertido. Sem expansão da F2 nem avanço para Inglês até se avaliar uma melhoria concreta. Princípio: **o desafio está no jogo, não em perceber como se joga.**

## Preservação
- Checkpoint: tag `blocoC-f2r-checkpoint-pre-2026-11-09` (código 1a19747).
- Versão atual fica intacta em `…/prototipos/f2/` (código `src/prototipos/f2`, tag `blocoC-f2-prototipo-2026-11-09`).
- Nova versão: `prototipos/f2b/` + `src/prototipos/f2b/**`, chave `eda-proto-f2b`, publicada em `…/prototipos/f2b/`.

## Hipóteses de diagnóstico do Claude (a confirmar ou rejeitar pelo Codex, sem as aceitar por defeito)
1. ~9 ações antes da 1.ª consequência (sujeito + verbo + tocar cartão + tocar camada, ×2, + Experimentar); consequência só no fim, em lote.
2. Codificação redundante: escolher a camada E o tempo verbal diz a mesma coisa duas vezes; o mesmo para sujeito/verbo em número. As «decisões» de língua reduzem-se a verificações de correspondência → sensação de ficha.
3. Cena longe dos controlos no telemóvel (scroll longo); cartões, camadas e botões competem pela atenção; texto de regras necessário.
4. Sem manipulação direta: o mundo não reage enquanto se mexe; a experimentação é cara.
5. Desafios distinguem-se pela regra gramatical, não por situações/decisões diferentes.

## Etapas
1. Codex (só leitura + navegador local): diagnóstico, respostas às 9 perguntas do produtor, propostas A (simplificação radical) e B (reformulação livre), comparação, recomendação.
2. Claude escolhe e fecha critérios.
3. Codex implementa demonstração isolada (3 situações em progressão).
4. Claude verifica (técnica + métricas de experiência), publica, testa no URL público.

## Diagnóstico do Codex (resumo; reprodução no navegador falhou por EPERM no ambiente só-leitura — medições por código e captura)
- Problema central: preparar uma execução custa mais do que explorar as consequências.
- Mínimo de ações para resolver: 7, 7, 10; 1.ª consequência só após «Experimentar» (650 ms por acontecimento).
- Tempo verbal × camada = informação repetida; concordância funciona como filtro (só o número na ponte tem efeito físico).
- Telemóvel: cena y≈174–379, «Experimentar» y≈1634 → ~1 ecrã de deslocação, perde-se a cena.
- Desafios têm progressão, mas o mesmo procedimento.
- 8 conceitos a compreender antes de jogar; editar frase não atualiza a cópia colocada.

## Comparação A/B (Codex) e decisão (Claude)
A = frases que se executam ao tocar, histórico para recuar (1 ação até à consequência; custo baixo-médio; risco: «escolher a resposta certa», óbvio).
B = palavras como ferramentas aplicadas a objetos da cena, reação imediata (1 ação; depois palavra→alvo; exploração e dependências; custo médio-alto; risco: ignorar as palavras).

**Escolhida: B («Palavras-ferramenta»)**, protótipo descartável de 3 situações. Razão: única que torna a linguagem uma ferramenta de exploração com consequência física imediata; A melhora a interface mas mantém a essência de «escolher a frase certa», que é o que o produtor sentiu como escolar. Não se reutiliza o código F2 salvo a arte.

Condições de Claude para B:
1. A forma da palavra tem de mudar o efeito de forma legível e consistente (ex.: «sopra» = uma nuvem, empurrão curto; «sopram» = duas nuvens, empurrão longo). A frase completa aparece sobre a ação («A nuvem sopra o barco»), nunca como pergunta.
2. Mais forte nem sempre é melhor (obstáculos/margens) → decisão real, não «escolher a forma certa».
3. Sem tempos verbais nem classes de palavras obrigatórias; não vender como cobertura curricular ampla.
4. Sem pontuação/estrelas extra na demo (testar diversão intrínseca); só a constelação acende no fim de cada situação.
5. Pistas contextuais opcionais só após 3 tentativas falhadas (destacar um objeto, nunca a solução).
6. Registo local de métricas para a observação (tempo e ações até à 1.ª consequência, ações, anulações por situação), visível só com `?registo`.

## Critérios de aceitação (F2b)
1. Situação 1: compreensível sem instruções além de 1 linha de objetivo; 1.ª consequência visual em 1 toque e < 300 ms após o toque.
2. Situação 2 introduz decisão nova (força/número com margem); situação 3 exige planear (dependência observável entre ações).
3. Todas as ações reversíveis: anular (último passo) e recomeçar sempre visíveis.
4. 390×844: cena + ferramentas + anular visíveis sem deslocação; 820×1180 e 1280×800 adaptados; sem scroll horizontal; alvos ≥ 44 px; teclado operável; prefers-reduced-motion respeitado.
5. Animações curtas (200–600 ms) e expressivas; arte do Abu de produção.
6. Isolamento: só chave `eda-proto-f2b`; F2 atual intacta.
7. Lógica pura testada: cada situação tem solução (busca sobre sequências de ações até profundidade limitada) e há pelo menos uma tentativa plausível que falha de forma observável.
8. e2e (3 viewports, tap com hasTouch): completar as 3 situações; medir nº de ações até à 1.ª consequência = 1; sem erros de consola; sem scroll; controlos no viewport; só `eda-proto-f2b`.
