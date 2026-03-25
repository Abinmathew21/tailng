export const STACKBLITZ_VANILLA_URL = 'https://stackblitz.com/~/github.com/tailng/tailng-demo-headless-vanilla-v1/tree';
export const generateStackblitzVanillaUrl = (path: string, file: string): string => `${STACKBLITZ_VANILLA_URL}/${path}?file=${file}`;
export const STACKBLITZ_TAILWIND_URL = 'https://stackblitz.com/~/github.com/tailng/tailng-demo-headless-tailwind-v1/tree';
export const generateStackblitzTailwindUrl = (path: string, file: string): string => `${STACKBLITZ_TAILWIND_URL}/${path}?file=${file}`;