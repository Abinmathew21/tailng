import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_INPUT_GROUP_PLAYGROUND_FILE =
  'src/app/playground/form/input-group/input-group.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'input-group',
  HEADLESS_INPUT_GROUP_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'input-group',
  HEADLESS_INPUT_GROUP_PLAYGROUND_FILE,
);
