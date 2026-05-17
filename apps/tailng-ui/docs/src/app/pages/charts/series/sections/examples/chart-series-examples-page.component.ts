import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { filter, map, startWith } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import { resolveChartSeriesDocConfigFromUrl } from '../../chart-series-docs.data';

@Component({
  selector: 'app-chart-series-examples-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './chart-series-examples-page.component.html',
  styleUrl: '../../shared/chart-series-section.css',
})
export class ChartSeriesExamplesPageComponent implements OnDestroy {
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
  protected readonly dataCode = [
    'const data: TngChartData = [',
    "  { label: 'Alpha', name: 'Alpha', value: 42, x: 'Alpha', y: 42, source: 'Alpha', target: 'Beta', category: 'Core' },",
    "  { label: 'Beta', name: 'Beta', value: 58, x: 'Beta', y: 58, source: 'Beta', target: 'Gamma', category: 'Pro' },",
    "  { label: 'Gamma', name: 'Gamma', value: 37, x: 'Gamma', y: 37, source: 'Gamma', target: 'Alpha', category: 'Enterprise' },",
    '];',
  ].join('\n');
  protected readonly templateCode = computed(() => {
    const chart = this.chart();
    if (!chart) {
      return '';
    }

    const attrs = chart.usageAttributes.length > 0 ? ` ${chart.usageAttributes}` : '';
    return `<${chart.selector} [data]="data"${attrs} [height]="360" />`;
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
