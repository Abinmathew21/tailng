import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';

const EXAMPLE_THEME_DOWNLOAD_HREF = '/assets/examples/theme/acme-dashboard.theme.ts';

@Component({
  selector: 'app-download-example-theme-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './download-example-theme-page.component.html',
  styleUrl: './download-example-theme-page.component.css',
})
export class DownloadExampleThemePageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly downloadHref = EXAMPLE_THEME_DOWNLOAD_HREF;

  protected readonly exampleThemeCode = [
    'import {',
    '  createTheme,',
    '  defaultDarkThemePreset,',
    '  defaultThemePreset,',
    "  type ThemeDefinition,",
    "} from '@tailng-ui/theme';",
    '',
    'export const acmeDashboardLightTheme: ThemeDefinition = createTheme(defaultThemePreset, {',
    "  meta: { name: 'acme-dashboard', mode: 'light' },",
    '  tokens: {',
    '    semantic: {',
    "      background: { surface: '#f6fffb' },",
    "      accent: { brand: '#0f766e', brandHover: '#115e59' },",
    "      focus: { ring: '#0f766e' },",
    '    },',
    '  },',
    '});',
    '',
    'export const acmeDashboardDarkTheme: ThemeDefinition = createTheme(defaultDarkThemePreset, {',
    "  meta: { name: 'acme-dashboard-dark', mode: 'dark' },",
    '  tokens: {',
    '    semantic: {',
    "      accent: { brand: '#2dd4bf', brandHover: '#14b8a6' },",
    "      focus: { ring: '#2dd4bf' },",
    '    },',
    '  },',
    '});',
    '',
  ].join('\n');

  protected readonly integrationCode = [
    "import type { ApplicationConfig } from '@angular/core';",
    "import { provideTailngTheme } from '@tailng-ui/theme';",
    "import { acmeDashboardDarkTheme } from './acme-dashboard.theme';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideTailngTheme({ theme: acmeDashboardDarkTheme }),',
    '  ],',
    '};',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
