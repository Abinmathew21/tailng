import { NgStyle } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCardComponent, TngCardContentComponent, TngCardDescriptionComponent, TngCardHeaderComponent, TngCardTitleComponent } from '@tailng-ui/components';
import { createTheme, defaultThemePreset, toCssVars, type ThemeDefinition } from '@tailng-ui/theme';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import { DocsExamplePanelComponent, type DocsExampleCodeTab } from '../../../../shared/example-panel/docs-example-panel.component';
import { getThemeDocsTheme } from '../../theme-docs.data';

function buildThemeScopeStyle(theme: ThemeDefinition): Record<string, string> {
  return {
    ...toCssVars(theme),
    'color-scheme': theme.meta.mode,
  };
}

const marketingTheme = createTheme(defaultThemePreset, {
  meta: {
    name: 'marketing-scope',
    mode: 'light',
  },
  tokens: {
    semantic: {
      background: {
        surface: '#f6fffb',
      },
      foreground: {
        primary: '#134e4a',
        secondary: '#0f766e',
      },
      border: {
        default: '#99f6e4',
        subtle: '#ccfbf1',
      },
      accent: {
        brand: '#0f766e',
        brandHover: '#115e59',
      },
      focus: {
        ring: '#0f766e',
      },
    },
  },
});

@Component({
  selector: 'app-theme-examples-page',
  imports: [
    NgStyle,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngButtonComponent,
    DocsExamplePanelComponent,
  ],
  templateUrl: './theme-examples-page.component.html',
  styleUrl: './theme-examples-page.component.css',
})
export class ThemeExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly providerThemeStyle = buildThemeScopeStyle(getThemeDocsTheme('default', 'dark'));
  protected readonly scopedThemeStyle = buildThemeScopeStyle(marketingTheme);
  protected readonly tailwindThemeStyle = buildThemeScopeStyle(getThemeDocsTheme('atlas', 'light'));

  protected readonly providerExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'config',
      label: 'app.config.ts',
      language: 'ts',
      title: 'app.config.ts',
      code: [
        "import type { ApplicationConfig } from '@angular/core';",
        "import { defaultDarkThemePreset, provideTailngTheme } from '@tailng-ui/theme';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [',
        '    provideTailngTheme({ theme: defaultDarkThemePreset }),',
        '  ],',
        '};',
        '',
      ].join('\n'),
    },
    {
      value: 'template',
      label: 'app.component.html',
      language: 'html',
      title: 'app.component.html',
      code: [
        '<section class="dashboard-shell">',
        '  <tng-card variant="outline" padding="lg">',
        '    <tng-card-header>',
        '      <tng-card-title>Release health</tng-card-title>',
        '      <tng-card-description>Theme tokens already flow into wrapper components.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <tng-button tone="primary">Promote release</tng-button>',
        '    </tng-card-content>',
        '  </tng-card>',
        '</section>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly scopedCssVarCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'theme-scope.component.ts',
      language: 'ts',
      title: 'theme-scope.component.ts',
      code: [
        "import { NgStyle } from '@angular/common';",
        "import { Component, computed } from '@angular/core';",
        "import { TngButtonComponent, TngCardComponent } from '@tailng-ui/components';",
        "import { createTheme, defaultThemePreset, toCssVars } from '@tailng-ui/theme';",
        '',
        'const marketingTheme = createTheme(defaultThemePreset, {',
        "  meta: { name: 'marketing-scope', mode: 'light' },",
        '  tokens: {',
        '    semantic: {',
        "      accent: { brand: '#0f766e', brandHover: '#115e59' },",
        "      focus: { ring: '#0f766e' },",
        '    },',
        '  },',
        '});',
        '',
        '@Component({',
        "  selector: 'app-theme-scope',",
        '  standalone: true,',
        '  imports: [NgStyle, TngCardComponent, TngButtonComponent],',
        "  templateUrl: './theme-scope.component.html',",
        '})',
        'export class ThemeScopeComponent {',
        '  protected readonly themeVars = computed(() => ({',
        '    ...toCssVars(marketingTheme),',
        "    'color-scheme': marketingTheme.meta.mode,",
        '  }));',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'theme-scope.component.html',
      language: 'html',
      title: 'theme-scope.component.html',
      code: [
        '<section class="campaign-surface" [ngStyle]="themeVars()">',
        '  <tng-card variant="outline" padding="lg">',
        '    <tng-card-header>',
        '      <tng-card-title>Campaign launch</tng-card-title>',
        '      <tng-card-description>Only this subtree receives the custom theme.</tng-card-description>',
        '    </tng-card-header>',
        '    <tng-card-content>',
        '      <tng-button tone="primary">Start campaign</tng-button>',
        '    </tng-card-content>',
        '  </tng-card>',
        '</section>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindExampleCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'tailwind',
      label: 'tailwind.config.ts',
      language: 'ts',
      title: 'tailwind.config.ts',
      code: [
        "import type { Config } from 'tailwindcss';",
        "import { atlasThemePreset, toTailwindPreset } from '@tailng-ui/theme';",
        '',
        'const tailngTheme = toTailwindPreset(atlasThemePreset);',
        '',
        'export default {',
        "  content: ['./src/**/*.{html,ts}'],",
        '  theme: {',
        '    extend: {',
        '      ...tailngTheme.theme.extend,',
        '    },',
        '  },',
        '} satisfies Config;',
        '',
      ].join('\n'),
    },
    {
      value: 'config',
      label: 'app.config.ts',
      language: 'ts',
      title: 'app.config.ts',
      code: [
        "import type { ApplicationConfig } from '@angular/core';",
        "import { atlasThemePreset, provideTailngTheme } from '@tailng-ui/theme';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [',
        '    provideTailngTheme({ theme: atlasThemePreset }),',
        '  ],',
        '};',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'dashboard-card.component.html',
      language: 'html',
      title: 'dashboard-card.component.html',
      code: [
        '<article class="rounded-[1.5rem] border border-subtle bg-surface p-6 shadow-sm">',
        '  <header class="flex items-start justify-between gap-4">',
        '    <div>',
        '      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Revenue</p>',
        '      <h2 class="mt-2 text-3xl font-semibold text-primary">$248k</h2>',
        '    </div>',
        '    <span class="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Live</span>',
        '  </header>',
        '</article>',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
