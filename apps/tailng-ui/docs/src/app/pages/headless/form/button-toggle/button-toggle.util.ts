import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_BUTTON_TOGGLE_PLAYGROUND_FILE =
  'src/app/playground/form/button-toggle/button-toggle.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'button-toggle',
  HEADLESS_BUTTON_TOGGLE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'button-toggle',
  HEADLESS_BUTTON_TOGGLE_PLAYGROUND_FILE,
);
