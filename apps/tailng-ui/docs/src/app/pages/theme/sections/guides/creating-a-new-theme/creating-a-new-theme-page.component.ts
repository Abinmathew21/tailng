import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';

@Component({
  selector: 'app-creating-a-new-theme-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './creating-a-new-theme-page.component.html',
  styleUrl: './creating-a-new-theme-page.component.css',
})
export class CreatingANewThemePageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly basePresetCode = [
    "import { createTheme, defaultThemePreset, type ThemeDefinition } from '@tailng-ui/theme';",
    '',
    'export const productTheme: ThemeDefinition = createTheme(defaultThemePreset, {',
    "  meta: { name: 'acme-product', mode: 'light' },",
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
  ].join('\n');

  protected readonly darkPairCode = [
    'import {',
    '  createTheme,',
    '  defaultDarkThemePreset,',
    '  defaultThemePreset,',
    "  type ThemeDefinition,",
    "} from '@tailng-ui/theme';",
    '',
    'export const acmeLightTheme: ThemeDefinition = createTheme(defaultThemePreset, {',
    "  meta: { name: 'acme-light', mode: 'light' },",
    '  tokens: {',
    '    semantic: {',
    "      accent: { brand: '#2563eb', brandHover: '#1d4ed8' },",
    "      focus: { ring: '#2563eb' },",
    '    },',
    '  },',
    '});',
    '',
    'export const acmeDarkTheme: ThemeDefinition = createTheme(defaultDarkThemePreset, {',
    "  meta: { name: 'acme-dark', mode: 'dark' },",
    '  tokens: {',
    '    semantic: {',
    "      accent: { brand: '#60a5fa', brandHover: '#3b82f6' },",
    "      focus: { ring: '#60a5fa' },",
    '    },',
    '  },',
    '});',
    '',
  ].join('\n');

  protected readonly validationCode = [
    "import { isThemeContractValid, listMissingRequiredThemeScales } from '@tailng-ui/theme';",
    '',
    'if (!isThemeContractValid(productTheme)) {',
    '  console.error(listMissingRequiredThemeScales(productTheme));',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
