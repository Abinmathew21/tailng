import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_INPUT_PLAYGROUND_FILE = 'src/app/playground/form/input/input-demo.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'input',
  COMPONENT_INPUT_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'input',
  COMPONENT_INPUT_PLAYGROUND_FILE,
);
