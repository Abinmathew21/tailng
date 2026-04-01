import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_LABEL_PLAYGROUND_FILE = 'src/app/playground/form/label/label.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'label',
  COMPONENT_LABEL_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'label',
  COMPONENT_LABEL_PLAYGROUND_FILE,
);
