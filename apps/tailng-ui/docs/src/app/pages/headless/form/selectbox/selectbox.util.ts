import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_SELECTBOX_PLAYGROUND_FILE = 'src/app/playground/form/selectbox/selectbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'select',
  HEADLESS_SELECTBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'select',
  HEADLESS_SELECTBOX_PLAYGROUND_FILE,
);
