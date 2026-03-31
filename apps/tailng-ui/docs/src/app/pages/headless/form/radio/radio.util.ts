import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_RADIO_PLAYGROUND_FILE = 'src/app/playground/form/radio/radio.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'radio',
  HEADLESS_RADIO_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'radio',
  HEADLESS_RADIO_PLAYGROUND_FILE,
);
