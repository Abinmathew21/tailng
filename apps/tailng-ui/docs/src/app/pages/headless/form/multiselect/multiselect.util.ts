import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_MULTISELECT_PLAYGROUND_FILE = 'src/app/playground/form/multiselect/multiselect.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'multiselect',
  HEADLESS_MULTISELECT_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'multiselect',
  HEADLESS_MULTISELECT_PLAYGROUND_FILE,
);
