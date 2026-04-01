import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_TOGGLE_PLAYGROUND_FILE = 'src/app/playground/form/toggle/toggle.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'toggle',
  COMPONENT_TOGGLE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'toggle',
  COMPONENT_TOGGLE_PLAYGROUND_FILE,
);
