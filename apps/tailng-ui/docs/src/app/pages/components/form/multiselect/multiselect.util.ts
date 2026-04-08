import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_MULTISELECT_PLAYGROUND_FILE =
  'src/app/playground/form/multiselect/multiselect.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'multiselect',
  COMPONENT_MULTISELECT_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'multiselect',
  COMPONENT_MULTISELECT_PLAYGROUND_FILE,
);
