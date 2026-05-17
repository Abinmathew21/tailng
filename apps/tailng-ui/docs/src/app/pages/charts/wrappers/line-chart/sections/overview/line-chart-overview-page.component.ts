import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { ChartWrapperLiveDemoComponent } from '../../../shared/chart-wrapper-live-demo.component';
import { CHART_WRAPPER_DOC_CONFIGS } from '../../../shared/chart-wrapper-docs.config';

@Component({
  selector: 'app-line-chart-overview-page',
  imports: [TngCodeBlockComponent, ChartWrapperLiveDemoComponent],
  templateUrl: './line-chart-overview-page.component.html',
  styleUrl: './line-chart-overview-page.component.css',
})
export class LineChartOverviewPageComponent implements OnDestroy {
  protected readonly chart = CHART_WRAPPER_DOC_CONFIGS['line-chart'];
  protected readonly heroChartHeight = 280;

  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = [
    "import { TngLineChart, type TngChartData } from '@tailng-ui/charts';",
    '',
    'const data: TngChartData = [',
    "  { quarter: 'Q1', revenue: 42 },",
    "  { quarter: 'Q2', revenue: 58 },",
    '];',
  ].join('\n');

  protected readonly usageCode = [
    '@Component({',
    '  imports: [TngLineChart],',
    '  template: `<tng-line-chart [data]="data" xField="quarter" yField="revenue" smooth [height]="320" />`,',
    '})',
    'export class ChartExample {',
    '  protected readonly data = data;',
    '}',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
