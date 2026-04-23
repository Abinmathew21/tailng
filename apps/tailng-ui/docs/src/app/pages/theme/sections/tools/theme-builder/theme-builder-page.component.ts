import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { resolveTokenValue, toCssVars, type ThemeDefinition } from '@tailng-ui/theme';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import {
  DEFAULT_THEME_DOCS_MODE,
  DEFAULT_THEME_DOCS_PRESET,
  getThemeDocsPresetExportName,
  getThemeDocsPresetOption,
  getThemeDocsTheme,
  isThemeDocsModeId,
  isThemeDocsPresetId,
  THEME_DOCS_MODE_OPTIONS,
  THEME_DOCS_PRESET_OPTIONS,
  type ThemeDocsModeId,
  type ThemeDocsPresetId,
} from '../../../theme-docs.data';

type SemanticTokenRow = Readonly<{
  expression: string;
  name: string;
  resolvedValue: string;
}>;

const semanticCollections = [
  'background',
  'foreground',
  'border',
  'accent',
  'focus',
] as const;

function readSelectValue(event: Event): string | undefined {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return undefined;
  }

  return target.value;
}

function buildThemeScopeStyle(theme: ThemeDefinition): Record<string, string> {
  return {
    ...toCssVars(theme),
    'color-scheme': theme.meta.mode,
  };
}

@Component({
  selector: 'app-theme-builder-page',
  imports: [NgStyle, TngCodeBlockComponent, TngButtonComponent],
  templateUrl: './theme-builder-page.component.html',
  styleUrl: './theme-builder-page.component.css',
})
export class ThemeBuilderPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly presetOptions = THEME_DOCS_PRESET_OPTIONS;
  protected readonly modeOptions = THEME_DOCS_MODE_OPTIONS;
  protected readonly selectedPreset = signal<ThemeDocsPresetId>(DEFAULT_THEME_DOCS_PRESET);
  protected readonly selectedMode = signal<ThemeDocsModeId>(DEFAULT_THEME_DOCS_MODE);

  protected readonly activeTheme = computed<ThemeDefinition>(() => {
    return getThemeDocsTheme(this.selectedPreset(), this.selectedMode());
  });

  protected readonly selectedPresetMeta = computed(() => {
    return getThemeDocsPresetOption(this.selectedPreset());
  });

  protected readonly previewThemeVars = computed<Record<string, string>>(() => {
    return buildThemeScopeStyle(this.activeTheme());
  });

  protected readonly themeMeta = computed<Readonly<{ mode: string; name: string }>>(() => {
    const theme = this.activeTheme();
    return {
      name: theme.meta.name,
      mode: theme.meta.mode,
    };
  });

  protected readonly semanticTokenRows = computed<readonly SemanticTokenRow[]>(() => {
    const theme = this.activeTheme();
    const rows: SemanticTokenRow[] = [];

    for (const collection of semanticCollections) {
      const scale = theme.tokens.semantic[collection];
      for (const key of Object.keys(scale)) {
        const tokenExpression = scale[key];
        rows.push({
          name: `${collection}.${key}`,
          expression: tokenExpression,
          resolvedValue: resolveTokenValue(theme, tokenExpression),
        });
      }
    }

    return rows;
  });

  protected readonly providerCode = computed(() => {
    const exportName = getThemeDocsPresetExportName(this.selectedPreset(), this.selectedMode());
    return [
      "import type { ApplicationConfig } from '@angular/core';",
      `import { provideTailngTheme, ${exportName} } from '@tailng-ui/theme';`,
      '',
      'export const appConfig: ApplicationConfig = {',
      '  providers: [',
      `    provideTailngTheme({ theme: ${exportName} }),`,
      '  ],',
      '};',
      '',
    ].join('\n');
  });

  protected readonly cssVarExcerptCode = computed(() => {
    const vars = toCssVars(this.activeTheme(), { includePrimitives: false });
    const keys = [
      '--tng-semantic-background-base',
      '--tng-semantic-background-surface',
      '--tng-semantic-foreground-primary',
      '--tng-semantic-border-default',
      '--tng-semantic-accent-brand',
      '--tng-semantic-focus-ring',
    ];

    return [':root {', ...keys.map((key) => `  ${key}: ${vars[key]};`), '}', ''].join('\n');
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPresetChange(event: Event): void {
    const value = readSelectValue(event);
    if (value !== undefined && isThemeDocsPresetId(value)) {
      this.selectedPreset.set(value);
    }
  }

  protected onModeChange(event: Event): void {
    const value = readSelectValue(event);
    if (value !== undefined && isThemeDocsModeId(value)) {
      this.selectedMode.set(value);
    }
  }
}
