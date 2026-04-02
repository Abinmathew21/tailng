import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_AUTOCOMPLETE_PLAYGROUND_FILE = 'src/app/playground/form/autocomplete/autocomplete.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'autocomplete',
  HEADLESS_AUTOCOMPLETE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'autocomplete',
  HEADLESS_AUTOCOMPLETE_PLAYGROUND_FILE,
);
