import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_SWITCH_PLAYGROUND_FILE = 'src/app/playground/form/switch/switch.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'switch',
  COMPONENT_SWITCH_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'switch',
  COMPONENT_SWITCH_PLAYGROUND_FILE,
);
