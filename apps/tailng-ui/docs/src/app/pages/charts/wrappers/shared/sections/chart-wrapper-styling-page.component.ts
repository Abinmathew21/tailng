import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { filter, map, startWith } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import {
  CHART_THEME_VARIABLES,
  resolveChartWrapperDocConfig,
  SHARED_CHART_THEME_VARIABLE_NAMES,
  type ChartThemeVariableRow,
  type ChartWrapperDocConfig,
} from '../chart-wrapper-docs.config';
import { resolveChartWrapperSlugFromUrl } from '../chart-wrapper-route.util';

type ChartStyleHook = Readonly<{
  hook: string;
  detail: string;
}>;

@Component({
  selector: 'app-chart-wrapper-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chart-wrapper-styling-page.component.html',
  styleUrl: './chart-doc-section.css',
})
export class ChartWrapperStylingPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly documentRef = inject(DOCUMENT);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly config = computed<ChartWrapperDocConfig | null>(() => {
    const slug = resolveChartWrapperSlugFromUrl(this.currentUrl());
    return slug ? resolveChartWrapperDocConfig(slug) : null;
  });

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly sharedThemeVariables = CHART_THEME_VARIABLES.filter((row) =>
    SHARED_CHART_THEME_VARIABLE_NAMES.includes(row.name),
  );

  protected readonly chartThemeVariables = computed<readonly ChartThemeVariableRow[]>(() => {
    const config = this.config();
    if (!config) {
      return [];
    }

    const names = new Set(config.themeVariableNames);
    return CHART_THEME_VARIABLES.filter((row) => names.has(row.name));
  });

  protected readonly styleHooks = computed<readonly ChartStyleHook[]>(() => {
    const config = this.config();
    if (!config) {
      return [];
    }

    return [
      {
        hook: `<${config.selector}>`,
        detail: 'Public host element. Set layout classes and inherited CSS variables here.',
      },
      {
        hook: `.${config.hostClass}`,
        detail: 'Internal chart root class used by the wrapper around surface and legend.',
      },
      {
        hook: '.tng-chart-surface__host',
        detail:
          'ECharts mount node. Prefer inherited variables and optionOverride over sizing this directly.',
      },
      {
        hook: '.tng-chart-legend__item',
        detail: 'Legend button state and spacing hook for wrappers with legends enabled.',
      },
      {
        hook: '.tng-chart-legend__item--hidden',
        detail: 'Legend item state applied when a series is toggled off.',
      },
    ];
  });

  protected readonly cssVariableCode = computed(() => {
    const config = this.config();
    if (!config) {
      return '';
    }

    return [
      `.analytics-panel ${config.selector} {`,
      ...this.chartThemeVariables()
        .slice(0, 6)
        .map((row) => `  ${row.name}: ${row.sampleValue};`),
      '}',
    ].join('\n');
  });

  protected readonly overrideCode = computed(() => {
    const config = this.config();
    if (!config) {
      return '';
    }

    return [
      "import type { TngChartOptionOverride } from '@tailng-ui/charts';",
      '',
      'protected readonly chartOptionOverride: TngChartOptionOverride = (option) => ({',
      '  ...option,',
      '  tooltip: {',
      "    ...(option['tooltip'] as Record<string, unknown> | undefined),",
      '    confine: true,',
      '  },',
      '});',
    ].join('\n');
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
