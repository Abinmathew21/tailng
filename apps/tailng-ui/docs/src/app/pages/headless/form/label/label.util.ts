import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_LABEL_PLAYGROUND_FILE = 'src/app/playground/form/label/label.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'label',
  HEADLESS_LABEL_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'label',
  HEADLESS_LABEL_PLAYGROUND_FILE,
);
