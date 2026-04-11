import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_DATEPICKER_PLAYGROUND_FILE = 'src/app/playground/form/datepicker/datepicker.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'datepicker',
  HEADLESS_DATEPICKER_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'datepicker',
  HEADLESS_DATEPICKER_PLAYGROUND_FILE,
);
