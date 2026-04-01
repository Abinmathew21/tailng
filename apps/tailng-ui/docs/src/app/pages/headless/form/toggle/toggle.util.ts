import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_TOGGLE_PLAYGROUND_FILE = 'src/app/playground/form/toggle/toggle.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'toggle',
  HEADLESS_TOGGLE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'toggle',
  HEADLESS_TOGGLE_PLAYGROUND_FILE,
);
