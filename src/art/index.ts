import { abuSvg as abuAtual } from './abu';
import type { AvatarOptions } from './avatar';
import { avatarSvg as avatarAtual } from './avatar';
import type { AbuPose, AvatarConfig } from './palette';
import { mapSvg as mapAtual } from './map';
import { roomSvg as roomAtual } from './rooms';
import { starSvg as starAtual, welcomeSvg as welcomeAtual } from './scenes';
import { getArtTheme } from './theme';
import { themedArt } from './themes';
import './v2/themes-ab';
import './d/register';

export type { ArtTheme } from './theme';
export { getArtTheme, setArtTheme } from './theme';
export type { AvatarOptions, AvatarPose } from './avatar';
export type { CatalogItem, Slot } from './catalog';
export { CATALOG, defaultAvatar, randomAvatar, normalizeAvatar } from './catalog';
export type { AbuPose, AvatarConfig, Option } from './palette';
export { EYE_COLORS, EXPRESSIONS, EYE_STYLES, HAIR_COLORS, SKIN_TONES } from './palette';

/** As funções públicas despacham pelo tema ativo; sem tema novo disponível usam o desenho atual. */
export const avatarSvg = (config: AvatarConfig, options?: AvatarOptions): string =>
  (themedArt(getArtTheme())?.avatarSvg ?? avatarAtual)(config, options);
export const abuSvg = (pose: AbuPose, accessory: string | null = null): string =>
  (themedArt(getArtTheme())?.abuSvg ?? abuAtual)(pose, accessory);
export const mapSvg = (options: { activeSubjects: readonly string[] }): string =>
  (themedArt(getArtTheme())?.mapSvg ?? mapAtual)(options);
export const welcomeSvg = (): string => (themedArt(getArtTheme())?.welcomeSvg ?? welcomeAtual)();
export const roomSvg = (subject: string): string => (themedArt(getArtTheme())?.roomSvg ?? roomAtual)(subject);
export const starSvg = (size?: number): string => (themedArt(getArtTheme())?.starSvg ?? starAtual)(size);
