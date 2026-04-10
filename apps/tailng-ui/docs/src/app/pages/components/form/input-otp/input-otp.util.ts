import {
  generateStackblitzComponentsTailwindUrl,
  generateStackblitzComponentsVanillaUrl,
} from '../../../../shared/util';

const COMPONENT_INPUT_OTP_PLAYGROUND_FILE =
  'src/app/playground/form/input-otp/input-otp.component.html';

export const stackblitzVanillaUrl = generateStackblitzComponentsVanillaUrl(
  'input-otp',
  COMPONENT_INPUT_OTP_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzComponentsTailwindUrl(
  'input-otp',
  COMPONENT_INPUT_OTP_PLAYGROUND_FILE,
);
