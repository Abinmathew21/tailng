import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_AUTOCOMPLETE_PLAYGROUND_FILE =
  'src/app/playground/form/autocomplete/autocomplete.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'autocomplete',
  COMPONENT_AUTOCOMPLETE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'autocomplete',
  COMPONENT_AUTOCOMPLETE_PLAYGROUND_FILE,
);
