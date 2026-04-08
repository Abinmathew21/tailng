import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_CHIPS_PLAYGROUND_FILE = 'src/app/playground/form/chips/chips.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'chips',
  COMPONENT_CHIPS_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'chips',
  COMPONENT_CHIPS_PLAYGROUND_FILE,
);
