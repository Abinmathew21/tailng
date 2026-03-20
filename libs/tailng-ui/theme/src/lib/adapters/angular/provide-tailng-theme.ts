import {
  ENVIRONMENT_INITIALIZER,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';
import { injectThemeVars } from '../css-vars/inject-theme-vars';
import type { CssVarAdapterOptions } from '../css-vars/to-css-vars';
import type { ThemeDefinition } from '../../contracts/theme.types';
import { defaultThemePreset } from '../../presets/default.preset';

type ThemeStyleWriter = Pick<CSSStyleDeclaration, 'setProperty'>;

type ThemeTarget = Readonly<{
  style: ThemeStyleWriter;
}>;

export type TailngThemeRuntimeOptions = Readonly<{
  applyColorScheme?: boolean;
  cssVars?: Readonly<CssVarAdapterOptions>;
  target?: ThemeTarget | null;
}>;

export type TailngThemeProviderOptions = TailngThemeRuntimeOptions &
  Readonly<{
    theme?: Readonly<ThemeDefinition>;
  }>;

type ResolvedTailngThemeRuntimeOptions = Readonly<{
  applyColorScheme: boolean;
  cssVars: Readonly<CssVarAdapterOptions> | undefined;
  target: ThemeTarget | null;
}>;

function resolveRuntimeTarget(target: ThemeTarget | null | undefined): ThemeTarget | null {
  if (target !== undefined) {
    return target;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document.documentElement;
}

function resolveRuntimeOptions(
  options: TailngThemeRuntimeOptions = {},
): ResolvedTailngThemeRuntimeOptions {
  return {
    applyColorScheme: options.applyColorScheme !== false,
    cssVars: options.cssVars,
    target: resolveRuntimeTarget(options.target),
  };
}

export function applyTailngTheme(
  theme: Readonly<ThemeDefinition>,
  options: TailngThemeRuntimeOptions = {},
): void {
  const resolvedOptions = resolveRuntimeOptions(options);
  if (resolvedOptions.target === null) {
    return;
  }

  injectThemeVars(resolvedOptions.target, theme, resolvedOptions.cssVars);
  if (resolvedOptions.applyColorScheme) {
    resolvedOptions.target.style.setProperty('color-scheme', theme.meta.mode);
  }
}

export function provideTailngTheme(
  options: TailngThemeProviderOptions = {},
): EnvironmentProviders {
  const theme = options.theme ?? defaultThemePreset;
  const runtimeOptions: TailngThemeRuntimeOptions = {
    applyColorScheme: options.applyColorScheme,
    cssVars: options.cssVars,
    target: options.target,
  };

  return makeEnvironmentProviders([
    {
      multi: true,
      provide: ENVIRONMENT_INITIALIZER,
      useValue: (): void => {
        applyTailngTheme(theme, runtimeOptions);
      },
    },
  ]);
}
