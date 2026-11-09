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
