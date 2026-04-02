import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_LISTBOX_PLAYGROUND_FILE = 'src/app/playground/form/listbox/listbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'listbox',
  HEADLESS_LISTBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'listbox',
  HEADLESS_LISTBOX_PLAYGROUND_FILE,
);
