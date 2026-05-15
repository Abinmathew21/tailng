import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_NUMBER_RANGE_PLAYGROUND_FILE =
  'src/app/playground/form/number-range/number-range-demo.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'number-range',
  COMPONENT_NUMBER_RANGE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'number-range',
  COMPONENT_NUMBER_RANGE_PLAYGROUND_FILE,
);
