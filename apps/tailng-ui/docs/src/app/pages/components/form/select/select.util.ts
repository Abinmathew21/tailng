import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_SELECT_PLAYGROUND_FILE =
  'src/app/playground/form/select/select.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'select',
  COMPONENT_SELECT_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'select',
  COMPONENT_SELECT_PLAYGROUND_FILE,
);
