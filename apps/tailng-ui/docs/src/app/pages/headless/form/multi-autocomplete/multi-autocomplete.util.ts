import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE =
  'src/app/playground/form/multi-autocomplete/multi-autocomplete.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'multi-autocomplete',
  HEADLESS_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'multi-autocomplete',
  HEADLESS_MULTI_AUTOCOMPLETE_PLAYGROUND_FILE,
);
