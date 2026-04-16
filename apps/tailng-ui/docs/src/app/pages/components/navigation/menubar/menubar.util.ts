import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_MENUBAR_PLAYGROUND_FILE = 'src/app/playground/navigation/menubar/menubar.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'menubar',
  COMPONENT_MENUBAR_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'menubar',
  COMPONENT_MENUBAR_PLAYGROUND_FILE,
);
