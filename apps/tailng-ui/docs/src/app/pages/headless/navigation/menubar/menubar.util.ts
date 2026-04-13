import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_MENUBAR_PLAYGROUND_FILE = 'src/app/playground/navigation/menubar/menubar.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'menubar',
  HEADLESS_MENUBAR_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'menubar',
  HEADLESS_MENUBAR_PLAYGROUND_FILE,
);
