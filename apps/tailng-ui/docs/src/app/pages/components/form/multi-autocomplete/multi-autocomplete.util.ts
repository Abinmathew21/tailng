import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE =
  'src/app/playground/form/multi-autocomplete/multi-autocomplete.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'multi-autocomplete',
  COMPONENT_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'multi-autocomplete',
  COMPONENT_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE,
);
