import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { TngMenuComponent, TngMenuTriggerFor, TngSwitchComponent } from '@tailng-ui/components';
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
  label: string;
  description: string;
}>;

const presetOptions: readonly ThemePresetOption[] = [
  {
    id: 'default',
    label: 'Default',
    description: 'Balanced spacing and expressive accents.',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Low-contrast, compact, content-first.',
  },
];

const semanticCollections: readonly (keyof ThemeSemanticTokens)[] = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
];

@Component({
  imports: [TngMenuComponent, TngMenuTriggerFor, TngSwitchComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly documentRef = inject(DOCUMENT);

  public readonly darkMode = signal(false);
  public readonly presetOptions = presetOptions;
  public readonly selectedPreset = signal<ThemePresetId>('default');
  public readonly selectedPresetLabel = computed((): string =>
    this.getPresetOption(this.selectedPreset()).label,
  );

  private readonly activeTheme = computed<ThemeDefinition>(() => {
    const mode = this.darkMode() ? 'dark' : 'light';
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

  public onThemeModeChange(pressed: boolean): void {
    this.darkMode.set(pressed);
  }

  public onPresetSelect(preset: ThemePresetId): void {
    this.selectedPreset.set(preset);
  }

  public isPresetSelected(preset: ThemePresetId): boolean {
    return this.selectedPreset() === preset;
  }

  private getBasePreset(preset: ThemePresetId): ThemeDefinition {
    return preset === 'minimal' ? minimalThemePreset : defaultThemePreset;
  }

  private getPresetOption(preset: ThemePresetId): ThemePresetOption {
    const resolved = presetOptions.find((option) => option.id === preset);
    if (resolved !== undefined) {
      return resolved;
    }

    return {
      id: 'default',
      label: 'Default',
      description: 'Balanced spacing and expressive accents.',
    };
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
