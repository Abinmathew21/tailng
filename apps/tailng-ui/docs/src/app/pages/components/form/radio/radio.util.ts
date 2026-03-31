import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_RADIO_PLAYGROUND_FILE = 'src/app/playground/form/radio/radio.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'radio',
  COMPONENT_RADIO_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'radio',
  COMPONENT_RADIO_PLAYGROUND_FILE,
);
