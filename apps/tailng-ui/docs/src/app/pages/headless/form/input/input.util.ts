import { generateStackblitzTailwindUrl, generateStackblitzVanillaUrl } from "../../../../shared/util";

export const stackblitzVanillaUrl = generateStackblitzVanillaUrl('input', 'src/app/playground/form/input/input-demo.component.html');
export const stackblitzTailwindUrl = generateStackblitzTailwindUrl(
    'input',
    'src/app/playground/form/input/input-demo.component.html',
  );