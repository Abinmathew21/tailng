import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_CHIPS_PLAYGROUND_FILE = 'src/app/playground/form/chips/chips.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'chips',
  HEADLESS_CHIPS_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'chips',
  HEADLESS_CHIPS_PLAYGROUND_FILE,
);
