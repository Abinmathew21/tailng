import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_CHECKBOX_PLAYGROUND_FILE = 'src/app/playground/form/checkbox/checkbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'checkbox',
  HEADLESS_CHECKBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'checkbox',
  HEADLESS_CHECKBOX_PLAYGROUND_FILE,
);
