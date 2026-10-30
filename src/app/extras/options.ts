import { defaultAvatar } from '../../art';
import { defaultSave, exportSave, importSave } from '../../core/save';
import { navigate } from '../router';
import { getState, update } from '../store';
import { openWelcome } from '../welcome';
import { action, screen, message } from './ui';
import { safeAvatar } from './profile';

export function openOptions(): void {
  navigate(() => {
    const main = screen('Opções');
    const options = getState().options;
    const panel = document.createElement('section');
    panel.className = 'panel';
    const change = (patch: Partial<typeof options>): void => {
      update((state) => ({ ...state, options: { ...state.options, ...patch } }));
    };
    for (const [key, title] of [
      ['music', 'Música ambiente'],
      ['sfx', 'Efeitos sonoros'],
      ['reduceMotion', 'Reduzir animações'],
    ] as const) {
      const label = document.createElement('label');
      label.className = 'extras-toggle';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = options[key];
      input.onchange = () => change({ [key]: input.checked });
      label.append(input, title);
      panel.append(label);
    }
    const volumeLabel = document.createElement('label');
    volumeLabel.textContent = 'Volume';
    const volume = document.createElement('input');
    volume.type = 'range';
    volume.min = '0';
    volume.max = '1';
    volume.step = '0.05';
    volume.value = String(options.volume);
    volume.oninput = () => change({ volume: Number(volume.value) });
    volumeLabel.append(volume);
    panel.append(volumeLabel);
    const textLabel = document.createElement('label');
    textLabel.textContent = 'Tamanho do texto';
    const text = document.createElement('select');
    for (const [value, title] of [
      [1, 'Normal'],
      [1.15, 'Grande'],
      [1.3, 'Muito grande'],
    ] as const) {
      text.add(new Option(title, String(value)));
    }
    text.value = String(options.textScale);
    text.onchange = () => change({ textScale: Number(text.value) });
    textLabel.append(text);
    panel.append(textLabel);
    main.append(panel);
    main.insertAdjacentHTML(
      'beforeend',
      '<h2>Cópia do progresso</h2><p>A cópia inclui estrelas, compras e aprendizagem. A personagem, os conjuntos e as opções ficam neste navegador.</p>',
    );
    const status = message(main, 'Guarda uma cópia antes de mudar de dispositivo.');
    main.append(
      action('Exportar progresso', () => {
        const url = URL.createObjectURL(
          new Blob([exportSave(getState().save)], { type: 'application/json' }),
        );
        const link = document.createElement('a');
        link.href = url;
        link.download = 'estrelas-do-abu-progresso.json';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = 'Cópia preparada para descarregar.';
      }),
    );
    const label = document.createElement('label');
    label.textContent = 'Importar progresso (JSON)';
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = '.json,application/json';
    file.onchange = async () => {
      const selected = file.files?.[0];
      if (!selected) return;
      try {
        if (selected.size > 5_000_000) throw new Error('size');
        const result = importSave(await selected.text());
        if (!result.ok) {
          status.textContent = 'Ficheiro inválido ou versão não suportada. O teu progresso foi mantido.';
          return;
        }
        confirmDialog(
          main,
          'Substituir o progresso atual?',
          'O ficheiro foi validado. Estrelas, compras e aprendizagem serão substituídas.',
          () => {
            update({ save: result.save });
            update((state) => {
              const avatar = safeAvatar(state.profile.avatar);
              return {
                ...state,
                profile: { ...state.profile, avatar, equipped: { ...avatar } },
                favorites: state.favorites.slice(0, 3).map(safeAvatar),
              };
            });
            status.textContent = 'Progresso importado com sucesso.';
          },
        );
      } catch {
        status.textContent = 'Não foi possível ler esta cópia (máximo 5 MB). O teu progresso foi mantido.';
      } finally {
        file.value = '';
      }
    };
    label.append(file);
    main.append(label);
    main.append(
      action(
        'Apagar todo o progresso',
        () => {
          confirmDialog(
            main,
            'Apagar o progresso?',
            'Vais perder a aprendizagem, estrelas, compras e conjuntos guardados.',
            () => {
              confirmDialog(
                main,
                'Confirmar: começar de novo?',
                'Esta é a última confirmação. Podes cancelar e guardar uma cópia.',
                () => {
                  update({
                    save: defaultSave(),
                    favorites: [],
                    lastTopicId: null,
                    ui: {},
                    profile: { grade: 6, onboarded: false, avatar: defaultAvatar(), equipped: {} },
                  });
                  openWelcome();
                },
              );
            },
          );
        },
        'quiet',
      ),
    );
  });
}

function confirmDialog(parent: HTMLElement, title: string, description: string, proceed: () => void): void {
  const dialog = document.createElement('dialog');
  const heading = document.createElement('h2');
  heading.textContent = title;
  const text = document.createElement('p');
  text.textContent = description;
  dialog.append(
    heading,
    text,
    action('Cancelar', () => dialog.close()),
    action(
      'Confirmar',
      () => {
        dialog.close();
        proceed();
      },
      'primary',
    ),
  );
  dialog.addEventListener('close', () => dialog.remove());
  parent.append(dialog);
  dialog.showModal();
}
