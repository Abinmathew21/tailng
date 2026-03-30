import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_FORM_FIELD_PLAYGROUND_FILE =
  'src/app/playground/form/form-field/form-field.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'form-field',
  COMPONENT_FORM_FIELD_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'form-field',
  COMPONENT_FORM_FIELD_PLAYGROUND_FILE,
);
