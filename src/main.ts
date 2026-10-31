/// <reference types="vite/client" />
import './styles/fonts.css';
import './styles/art.css';
import './styles/app.css';
import './styles/theme-base.css';
import './styles/theme-a.css';
import './styles/theme-b.css';
import './styles/theme-d.css';
import { openWelcome } from './app/welcome';
import { startHgpChapter } from './app/room';
import { getState } from './app/store';

import { applyTheme } from './app/theme';
const requestedTheme = new URLSearchParams(location.search).get('tema');
applyTheme(requestedTheme === 'atual' || requestedTheme === 'a' || requestedTheme === 'b' ? requestedTheme : 'd');
openWelcome();
// Ligação direta ao capítulo do teste: ?capitulo=seculo-xviii (só com o perfil já criado; senão, primeiro o registo).
if (new URLSearchParams(location.search).get('capitulo') === 'seculo-xviii' && getState().profile.onboarded) startHgpChapter();
import './styles/extras.css';
