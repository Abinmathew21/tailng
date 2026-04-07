import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_SELECTBOX_PLAYGROUND_FILE =
  'src/app/playground/form/selectbox/selectbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'select',
  COMPONENT_SELECTBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'select',
  COMPONENT_SELECTBOX_PLAYGROUND_FILE,
);
