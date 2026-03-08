import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TngMenuComponent, TngMenuTriggerFor, TngSwitchComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  createTheme,
  darkSemanticTokens,
  defaultThemePreset,
  minimalThemePreset,
  resolveToken,
  toCssVars,
} from '@tailng-ui/theme';
import type { ThemeDefinition, ThemeSemanticTokens } from '@tailng-ui/theme';

type ThemePresetId = 'default' | 'minimal';

type ThemePresetOption = Readonly<{
  id: ThemePresetId;
  icon: string;
  label: string;
  description: string;
}>;

type NavItem = Readonly<{
  label: string;
  route: string;
}>;

type LinkItem = Readonly<{
  label: string;
  href: string;
}>;

const presetOptions: readonly ThemePresetOption[] = [
  {
    id: 'default',
    icon: 'palette',
    label: 'Default',
    description: 'Balanced spacing and expressive accents.',
  },
  {
    id: 'minimal',
    icon: 'swatch-book',
    label: 'Minimal',
    description: 'Low-contrast, compact, content-first.',
  },
];

const primaryNavigation: readonly NavItem[] = [
  { label: 'Components', route: '/components' },
  { label: 'Primitives', route: '/primitives' },
  { label: 'CDK', route: '/cdk' },
  { label: 'Theme', route: '/theme' },
  { label: 'Icons', route: '/icons' },
];

const npmPackageLinks: readonly LinkItem[] = [
  { label: '@tailng-ui/cdk', href: 'https://www.npmjs.com/package/@tailng-ui/cdk' },
  { label: '@tailng-ui/primitives', href: 'https://www.npmjs.com/package/@tailng-ui/primitives' },
  { label: '@tailng-ui/components', href: 'https://www.npmjs.com/package/@tailng-ui/components' },
  { label: '@tailng-ui/theme', href: 'https://www.npmjs.com/package/@tailng-ui/theme' },
  { label: '@tailng-ui/icons', href: 'https://www.npmjs.com/package/@tailng-ui/icons' },
  { label: 'tailng', href: 'https://www.npmjs.com/package/tailng' },
];

const semanticCollections: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
];

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    TngMenuComponent,
    TngMenuTriggerFor,
    TngSwitchComponent,
    TngIcon,
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly documentRef = inject(DOCUMENT);

  public readonly darkMode = signal(false);
  public readonly presetOptions = presetOptions;
  public readonly selectedPreset = signal<ThemePresetId>('default');
  public readonly primaryNavigation = primaryNavigation;
  public readonly npmPackageLinks = npmPackageLinks;

  public readonly effectiveMode = computed<'light' | 'dark'>(() =>
    this.darkMode() ? 'dark' : 'light',
  );

  private readonly activeTheme = computed<ThemeDefinition>(() => {
    const mode = this.effectiveMode();
    const basePreset = this.getBasePreset(this.selectedPreset());
    const semanticTokens = mode === 'dark' ? darkSemanticTokens : basePreset.tokens.semantic;
    return createTheme(basePreset, {
      meta: { mode },
      tokens: { semantic: semanticTokens },
    });
  });

  public constructor() {
    effect((): void => {
      this.applyThemeVariables(this.activeTheme());
    });
  }

  public onPresetSelect(preset: ThemePresetId): void {
    this.selectedPreset.set(preset);
  }

  public onModeSwitchChange(checked: boolean): void {
    this.darkMode.set(checked);
  }

  public isPresetSelected(preset: ThemePresetId): boolean {
    return this.selectedPreset() === preset;
  }

  private getBasePreset(preset: ThemePresetId): ThemeDefinition {
    return preset === 'minimal' ? minimalThemePreset : defaultThemePreset;
  }

  private applyThemeVariables(theme: ThemeDefinition): void {
    const style = this.documentRef.documentElement.style;
    const cssVars = this.toResolvedCssVars(theme);
    for (const [name, value] of Object.entries(cssVars)) {
      style.setProperty(name, value);
    }
    style.setProperty('color-scheme', theme.meta.mode);
  }

  private toResolvedCssVars(theme: ThemeDefinition): Record<string, string> {
    const primitiveVars = toCssVars(theme, {
      includePrimitives: true,
      includeSemantic: false,
    });

    const semanticVars: Record<string, string> = {};
    for (const collection of semanticCollections) {
      const scale = theme.tokens.semantic[collection];
      for (const key of Object.keys(scale)) {
        semanticVars[`--tng-semantic-${collection}-${key}`] = this.resolveTokenValue(theme, scale[key]);
      }
    }

    return { ...primitiveVars, ...semanticVars };
  }

  private resolveTokenValue(theme: ThemeDefinition, tokenExpression: string): string {
    if (!tokenExpression.startsWith('{') || !tokenExpression.endsWith('}')) {
      return tokenExpression;
    }

    return resolveToken(theme, tokenExpression) ?? tokenExpression;
  }
}
