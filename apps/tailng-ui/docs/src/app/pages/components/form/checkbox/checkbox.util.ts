import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_CHECKBOX_PLAYGROUND_FILE = 'src/app/playground/form/checkbox/checkbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'checkbox',
  COMPONENT_CHECKBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'checkbox',
  COMPONENT_CHECKBOX_PLAYGROUND_FILE,
);
