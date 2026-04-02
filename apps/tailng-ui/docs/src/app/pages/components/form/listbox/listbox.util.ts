import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_LISTBOX_PLAYGROUND_FILE = 'src/app/playground/form/listbox/listbox.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'listbox',
  COMPONENT_LISTBOX_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'listbox',
  COMPONENT_LISTBOX_PLAYGROUND_FILE,
);
