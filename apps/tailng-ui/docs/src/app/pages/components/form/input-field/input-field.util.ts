import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_INPUT_FIELD_PLAYGROUND_FILE =
  'src/app/playground/form/input-field/input-field.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'input-field',
  COMPONENT_INPUT_FIELD_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'input-field',
  COMPONENT_INPUT_FIELD_PLAYGROUND_FILE,
);
