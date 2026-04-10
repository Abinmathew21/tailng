import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from '../../../../shared/util';

const HEADLESS_INPUT_OTP_PLAYGROUND_FILE =
  'src/app/playground/form/input-otp/input-otp.component.html';

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl(
  'input-otp',
  HEADLESS_INPUT_OTP_PLAYGROUND_FILE,
);

export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
  'input-otp',
  HEADLESS_INPUT_OTP_PLAYGROUND_FILE,
);
