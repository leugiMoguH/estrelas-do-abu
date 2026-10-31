/// <reference types="vite/client" />
import './styles/art.css';
import './styles/app.css';
import { openWelcome } from './app/welcome';

import { applyTheme } from './app/theme';
if (new URLSearchParams(location.search).get('tema') === 'd') applyTheme('d');
openWelcome();
import './styles/extras.css';
