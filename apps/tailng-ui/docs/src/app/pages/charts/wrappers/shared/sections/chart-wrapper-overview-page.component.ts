import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { filter, map, startWith } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../shared/util';
import { ChartWrapperLiveDemoComponent } from '../chart-wrapper-live-demo.component';
import {
  resolveChartWrapperDocConfig,
  type ChartWrapperDocConfig,
} from '../chart-wrapper-docs.config';
import { resolveChartWrapperSlugFromUrl } from '../chart-wrapper-route.util';

@Component({
  selector: 'app-chart-wrapper-overview-page',
  imports: [TngCodeBlockComponent, ChartWrapperLiveDemoComponent],
  templateUrl: './chart-wrapper-overview-page.component.html',
  styleUrl: './chart-doc-section.css',
})
export class ChartWrapperOverviewPageComponent implements OnDestroy {
  /** Sized to stay above the fold below docs chrome (header, breadcrumb, tabs). */
  protected readonly heroChartHeight = 280;

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

  protected readonly importCode = computed(() => {
    const config = this.config();
    if (!config) {
      return '';
    }
    return [
      `import { ${config.importName}, type TngChartData } from '@tailng-ui/charts';`,
      '',
      'const data: TngChartData = [',
      "  { quarter: 'Q1', revenue: 42 },",
      "  { quarter: 'Q2', revenue: 58 },",
      '];',
    ].join('\n');
  });

  protected readonly usageCode = computed(() => {
    const config = this.config();
    if (!config) {
      return '';
    }
    return [
      '@Component({',
      `  imports: [${config.importName}],`,
      `  template: \`${config.usageTemplate}\`,`,
      '})',
      'export class ChartExample {',
      '  protected readonly data = data;',
      '}',
    ].join('\n');
  });

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
