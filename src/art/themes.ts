import type { AvatarOptions } from './avatar';
import type { AbuPose, AvatarConfig } from './palette';
import type { ArtTheme } from './theme';
/** Conjunto de funções de desenho de um tema. Os temas 'a' e 'b' registam-se aqui à medida que são feitos. */
export interface ArtSet {
  avatarSvg: (config: AvatarConfig, options?: AvatarOptions) => string;
  abuSvg: (pose: AbuPose, accessory?: string | null | AvatarConfig) => string;
  mapSvg: (options: { activeSubjects: readonly string[] }) => string;
  welcomeSvg: () => string;
  roomSvg: (subject: string) => string;
  starSvg: (size?: number) => string;
}
const registry: Partial<Record<ArtTheme, ArtSet>> = {};
export const registerArtTheme = (theme: ArtTheme, set: ArtSet): void => {
  registry[theme] = set;
};
export const themedArt = (theme: ArtTheme): ArtSet | undefined => registry[theme];
