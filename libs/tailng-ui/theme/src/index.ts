export type {
  ThemeDefinition,
  ThemeMeta,
  ThemeMode,
  ThemeOverride,
} from './lib/contracts/theme.types';

export type {
  ThemePrimitives,
  ThemeSemanticTokens,
  ThemeTokenOverrides,
  ThemeTokens,
  TokenScale,
} from './lib/contracts/token.types';

export type {
  ComponentSlotMap,
  ComponentStateMap,
  ComponentStyleContract,
} from './lib/contracts/component-style-contract.types';

export { defaultThemePreset } from './lib/presets/default.preset';
export { minimalThemePreset } from './lib/presets/minimal.preset';
export { defaultDarkThemePreset } from './lib/presets/default-dark.preset';
export { minimalDarkThemePreset } from './lib/presets/minimal-dark.preset';
export { slateThemePreset } from './lib/presets/slate.preset';
export { slateDarkThemePreset } from './lib/presets/slate-dark.preset';
export { nexusThemePreset } from './lib/presets/nexus.preset';
export { nexusDarkThemePreset } from './lib/presets/nexus-dark.preset';
export { prismThemePreset } from './lib/presets/prism.preset';
export { prismDarkThemePreset } from './lib/presets/prism-dark.preset';
export { atlasThemePreset } from './lib/presets/atlas.preset';
export { atlasDarkThemePreset } from './lib/presets/atlas-dark.preset';
export { sterlingThemePreset } from './lib/presets/sterling.preset';
export { sterlingDarkThemePreset } from './lib/presets/sterling-dark.preset';
export { daybookClassicThemePreset } from './lib/presets/daybook-classic.preset';
export { daybookClassicDarkThemePreset } from './lib/presets/daybook-classic-dark.preset';

export { createTheme } from './lib/engine/create-theme';
export { mergeTheme } from './lib/engine/merge-theme';
export { resolveToken } from './lib/engine/resolve-token';
export type { ResolveTokenValueOptions } from './lib/engine/resolve-token-value';
export { resolveTokenValue } from './lib/engine/resolve-token-value';

export { createThemeTokens, primitiveTokens } from './lib/tokens';

export { lightSemanticTokens } from './lib/tokens/semantic/light';
export { darkSemanticTokens } from './lib/tokens/semantic/dark';

export type { CssVarAdapterOptions } from './lib/adapters/css-vars/to-css-vars';
export { toCssVars } from './lib/adapters/css-vars/to-css-vars';
export { injectThemeVars } from './lib/adapters/css-vars/inject-theme-vars';
export type {
  TailngThemeProviderOptions,
  TailngThemeRuntimeOptions,
} from './lib/adapters/angular/provide-tailng-theme';
export {
  applyTailngTheme,
  provideTailngTheme,
} from './lib/adapters/angular/provide-tailng-theme';

export type { TailwindThemePreset } from './lib/adapters/tailwind/to-tailwind-preset';
export { toTailwindPreset } from './lib/adapters/tailwind/to-tailwind-preset';

export {
  isThemeContractValid,
  listMissingRequiredThemeScales,
} from './lib/testing/theme-contract.spec-helpers';

export * from './lib/component-contracts';
