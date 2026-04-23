import { DOCUMENT, NgStyle } from '@angular/common';
import { computed, Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCardComponent, TngCardContentComponent, TngCardDescriptionComponent, TngCardHeaderComponent, TngCardTitleComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import { resolveTokenValue, toCssVars, type ThemeDefinition } from '@tailng-ui/theme';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
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
} from '../../theme-docs.data';

type ThemeCapability = Readonly<{
  description: string;
  title: string;
}>;

type ThemePreviewTokenRow = Readonly<{
  expression: string;
  label: string;
  value: string;
}>;

const THEME_CAPABILITIES: readonly ThemeCapability[] = [
  {
    title: 'Presets for starting fast',
    description:
      'Ship with a curated light and dark preset, then swap or extend it without reworking component markup.',
  },
  {
    title: 'Scoped CSS variable output',
    description:
      'Export primitives and semantic tokens as CSS variables so wrappers, apps, and docs can theme locally or globally.',
  },
  {
    title: 'Adapters for real projects',
    description:
      'Use Angular providers for app-wide theme setup or convert the same theme into a Tailwind preset when utilities own layout.',
  },
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
  selector: 'app-theme-overview-page',
  imports: [
    NgStyle,
    TngCodeBlockComponent,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngButtonComponent,
  ],
  templateUrl: './theme-overview-page.component.html',
  styleUrl: './theme-overview-page.component.css',
})
export class ThemeOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly capabilityCards = THEME_CAPABILITIES;
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

  protected readonly quickInstallCode = "pnpm add @tailng-ui/theme";

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

  protected readonly authoringCode = computed(() => {
    const exportName = getThemeDocsPresetExportName(this.selectedPreset(), this.selectedMode());
    const theme = this.activeTheme();
    const presetSlug = this.selectedPreset();
    const mode = this.selectedMode();
    const brand = resolveTokenValue(theme, theme.tokens.semantic.accent['brand']);
    const brandHover = resolveTokenValue(theme, theme.tokens.semantic.accent['brandHover']);

    return [
      `import { createTheme, ${exportName}, type ThemeDefinition } from '@tailng-ui/theme';`,
      '',
      'export const productTheme: ThemeDefinition = createTheme(',
      `  ${exportName},`,
      '  {',
      '    meta: {',
      `      name: 'acme-${presetSlug}-${mode}',`,
      `      mode: '${mode}',`,
      '    },',
      '    tokens: {',
      '      semantic: {',
      '        accent: {',
      `          brand: '${brand}',`,
      `          brandHover: '${brandHover}',`,
      '        },',
      '        focus: {',
      `          ring: '${brand}',`,
      '        },',
      '      },',
      '    },',
      '  },',
      ');',
      '',
    ].join('\n');
  });

  protected readonly previewTokens = computed<readonly ThemePreviewTokenRow[]>(() => {
    const theme = this.activeTheme();
    const rows: readonly ThemePreviewTokenRow[] = [
      {
        label: 'Background base',
        expression: theme.tokens.semantic.background['base'],
        value: resolveTokenValue(theme, theme.tokens.semantic.background['base']),
      },
      {
        label: 'Surface',
        expression: theme.tokens.semantic.background['surface'],
        value: resolveTokenValue(theme, theme.tokens.semantic.background['surface']),
      },
      {
        label: 'Primary text',
        expression: theme.tokens.semantic.foreground['primary'],
        value: resolveTokenValue(theme, theme.tokens.semantic.foreground['primary']),
      },
      {
        label: 'Secondary text',
        expression: theme.tokens.semantic.foreground['secondary'],
        value: resolveTokenValue(theme, theme.tokens.semantic.foreground['secondary']),
      },
      {
        label: 'Brand accent',
        expression: theme.tokens.semantic.accent['brand'],
        value: resolveTokenValue(theme, theme.tokens.semantic.accent['brand']),
      },
      {
        label: 'Success accent',
        expression: theme.tokens.semantic.accent['success'],
        value: resolveTokenValue(theme, theme.tokens.semantic.accent['success']),
      },
      {
        label: 'Default border',
        expression: theme.tokens.semantic.border['default'],
        value: resolveTokenValue(theme, theme.tokens.semantic.border['default']),
      },
      {
        label: 'Focus ring',
        expression: theme.tokens.semantic.focus['ring'],
        value: resolveTokenValue(theme, theme.tokens.semantic.focus['ring']),
      },
    ];

    return rows;
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
