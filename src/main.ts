/// <reference types="vite/client" />
import './styles/fonts.css';
import './styles/art.css';
import './styles/app.css';
import './styles/theme-base.css';
import './styles/theme-a.css';
import './styles/theme-b.css';
import './styles/theme-d.css';
import { openWelcome } from './app/welcome';

import { applyTheme } from './app/theme';
const requestedTheme = new URLSearchParams(location.search).get('tema');
applyTheme(requestedTheme === 'atual' || requestedTheme === 'a' || requestedTheme === 'b' ? requestedTheme : 'd');
openWelcome();
import './styles/extras.css';
