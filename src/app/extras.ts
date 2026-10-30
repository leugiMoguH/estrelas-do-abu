import { profile } from './extras/profile';
export { openAchievements, openProgress } from './extras/progress';
export { openMinigame } from './extras/memory';
export { openOptions } from './extras/options';
export const openProfile = (): void => profile();
export const openShop = (): void => profile('Loja');
