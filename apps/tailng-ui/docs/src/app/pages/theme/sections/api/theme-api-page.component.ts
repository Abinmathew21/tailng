import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import { THEME_DOCS_PRESET_OPTIONS } from '../../theme-docs.data';

type ThemeApiRow = Readonly<{
  description: string;
  name: string;
}>;

const CORE_THEME_TYPES: readonly ThemeApiRow[] = [
  {
    name: 'ThemeDefinition',
    description: 'Resolved theme object containing metadata plus primitive and semantic token scales.',
  },
  {
    name: 'ThemeMeta',
    description: 'Minimal metadata contract for a theme, including its name and active mode.',
  },
  {
    name: 'ThemeTokens',
    description: 'Top-level token container with primitive collections and semantic collections.',
  },
  {
    name: 'ThemeOverride',
    description: 'Partial override object used when composing a product-specific theme from a preset.',
  },
  {
    name: 'ThemePrimitives / ThemeSemanticTokens',
    description: 'Typed token groups for color, spacing, radius, typography, motion, and semantic surfaces.',
  },
] as const;

const RUNTIME_HELPERS: readonly ThemeApiRow[] = [
  {
    name: 'createTheme(base, override?)',
    description: 'Returns the base preset unchanged or merges the override into a new theme definition.',
  },
  {
    name: 'mergeTheme(base, override)',
    description: 'Performs the underlying token-scale merge when you need explicit control over composition.',
  },
  {
    name: 'resolveToken(theme, tokenPath)',
    description: 'Resolves a token reference path such as {accent.brand} or {semantic.background.surface}.',
  },
  {
    name: 'resolveTokenValue(theme, value)',
    description: 'Resolves nested token references inside a value before it is rendered or exported.',
  },
  {
    name: 'toCssVars(theme, options?)',
    description: 'Converts theme tokens into CSS custom properties, with switches for primitives, semantics, and raw references.',
  },
  {
    name: 'applyTailngTheme(theme, options?)',
    description: 'Writes CSS variables to a target element and can also update the local color-scheme.',
  },
  {
    name: 'provideTailngTheme(options?)',
    description: 'Angular environment provider that applies a preset during app bootstrap.',
  },
  {
    name: 'toTailwindPreset(theme)',
    description: 'Projects a theme into Tailwind `extend` values so utilities can consume the same tokens.',
  },
] as const;

@Component({
  selector: 'app-theme-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './theme-api-page.component.html',
  styleUrl: './theme-api-page.component.css',
})
export class ThemeApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly coreThemeTypes = CORE_THEME_TYPES;
  protected readonly runtimeHelpers = RUNTIME_HELPERS;
  protected readonly presetExports = THEME_DOCS_PRESET_OPTIONS;

  protected readonly compositionCode = [
    "import { createTheme, defaultThemePreset, resolveToken, toCssVars } from '@tailng-ui/theme';",
    '',
    'const productTheme = createTheme(defaultThemePreset, {',
    "  meta: { name: 'acme-default-dark', mode: 'dark' },",
    '  tokens: {',
    '    semantic: {',
    '      accent: {',
    "        brand: '#2563eb',",
    "        brandHover: '#1d4ed8',",
    '      },',
    '      focus: {',
    "        ring: '#2563eb',",
    '      },',
    '    },',
    '  },',
    '});',
    '',
    "const brand = resolveToken(productTheme, '{accent.brand}');",
    'const cssVars = toCssVars(productTheme);',
    '',
  ].join('\n');

  protected readonly runtimeApplyCode = [
    "import { applyTailngTheme, defaultDarkThemePreset } from '@tailng-ui/theme';",
    '',
    'applyTailngTheme(defaultDarkThemePreset, {',
    '  target: document.documentElement,',
    '  applyColorScheme: true,',
    '});',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
