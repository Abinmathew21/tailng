import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { filter, map, startWith } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import { resolveChartSeriesDocConfigFromUrl } from '../../chart-series-docs.data';

@Component({
  selector: 'app-chart-series-overview-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chart-series-overview-page.component.html',
  styleUrl: '../../shared/chart-series-section.css',
})
export class ChartSeriesOverviewPageComponent implements OnDestroy {
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

  protected readonly chart = computed(() => resolveChartSeriesDocConfigFromUrl(this.currentUrl()));
  protected readonly featureSummary = computed(() => {
    const chart = this.chart();
    return chart && chart.features.length > 0 ? chart.features.join(', ') : 'standard preset';
  });
  protected readonly importCode = computed(() => {
    const chart = this.chart();
    if (!chart) {
      return '';
    }

    return [
      `import { ${chart.importName}, type TngChartData } from '@tailng-ui/charts';`,
      '',
      'const data: TngChartData = [',
      "  { label: 'Jan', name: 'Alpha', value: 42, x: 'Jan', y: 42, source: 'Alpha', target: 'Beta', category: 'Core' },",
      "  { label: 'Feb', name: 'Beta', value: 58, x: 'Feb', y: 58, source: 'Beta', target: 'Gamma', category: 'Pro' },",
      '];',
    ].join('\n');
  });
  protected readonly usageCode = computed(() => {
    const chart = this.chart();
    if (!chart) {
      return '';
    }

    const attrs = chart.usageAttributes.length > 0 ? ` ${chart.usageAttributes}` : '';
    return [
      '@Component({',
      `  imports: [${chart.importName}],`,
      `  template: \`<${chart.selector} [data]="data"${attrs} [height]="320" />\`,`,
      '})',
      'export class ChartExample {',
      '  protected readonly data = data;',
      '}',
    ].join('\n');
  });

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
