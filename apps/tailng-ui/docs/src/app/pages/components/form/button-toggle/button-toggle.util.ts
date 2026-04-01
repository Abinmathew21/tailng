import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_BUTTON_TOGGLE_PLAYGROUND_FILE =
  'src/app/playground/form/button-toggle/button-toggle.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'button-toggle',
  COMPONENT_BUTTON_TOGGLE_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'button-toggle',
  COMPONENT_BUTTON_TOGGLE_PLAYGROUND_FILE,
);
