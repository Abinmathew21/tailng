import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_SWITCH_PLAYGROUND_FILE = 'src/app/playground/form/switch/switch.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'switch',
  HEADLESS_SWITCH_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'switch',
  HEADLESS_SWITCH_PLAYGROUND_FILE,
);
