import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_MENU_PLAYGROUND_FILE = 'src/app/playground/navigation/menu/menu.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl('menu', HEADLESS_MENU_PLAYGROUND_FILE);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl('menu', HEADLESS_MENU_PLAYGROUND_FILE);
