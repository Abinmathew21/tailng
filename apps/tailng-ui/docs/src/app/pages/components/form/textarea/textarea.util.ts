import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_TEXTAREA_PLAYGROUND_FILE = 'src/app/playground/form/textarea/textarea.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'textarea',
  COMPONENT_TEXTAREA_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'textarea',
  COMPONENT_TEXTAREA_PLAYGROUND_FILE,
);
