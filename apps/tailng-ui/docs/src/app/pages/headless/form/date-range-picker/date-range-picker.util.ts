import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_DATE_RANGE_PICKER_PLAYGROUND_FILE =
  'src/app/playground/form/date-range-picker/date-range-picker.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'date-range-picker',
  HEADLESS_DATE_RANGE_PICKER_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'date-range-picker',
  HEADLESS_DATE_RANGE_PICKER_PLAYGROUND_FILE,
);
