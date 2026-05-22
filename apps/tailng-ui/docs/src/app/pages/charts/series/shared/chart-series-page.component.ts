import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import {
  DocsComponentSectionTabsComponent,
  type DocsComponentSectionTab,
} from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { ChartsDocsRouteData } from '../../chart-docs.data';
import { resolveChartSeriesDocConfigFromUrl } from '../chart-series-docs.data';

type ChartSeriesDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const chartSeriesDocSectionIds: readonly ChartSeriesDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultChartSeriesDocSection: ChartSeriesDocSectionId = 'overview';

const sectionTabs: readonly DocsComponentSectionTab[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'api', label: 'API' },
  { value: 'styling', label: 'Styling' },
  { value: 'examples', label: 'Examples' },
] as const;

function isChartSeriesDocSectionId(value: string): value is ChartSeriesDocSectionId {
  return chartSeriesDocSectionIds.includes(value as ChartSeriesDocSectionId);
}

@Component({
  selector: 'app-chart-series-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './chart-series-page.component.html',
  styleUrl: './chart-series-page.component.css',
})
export class ChartSeriesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly sectionTabs = sectionTabs;

  public readonly config = computed(() => resolveChartSeriesDocConfigFromUrl(this.currentUrl()));

  public readonly activeSection = computed<ChartSeriesDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultChartSeriesDocSection;
  });

  private readonly docsItem = this.route.snapshot.data as ChartsDocsRouteData | undefined;
  public readonly sectionName = computed(
    () => this.config()?.title ?? this.docsItem?.item.title ?? 'Chart',
  );
  public readonly outlineTitle = computed(() => {
    switch (this.activeSection()) {
      case 'api':
        return 'API content';
      case 'examples':
        return 'Examples content';
      case 'styling':
        return 'Styling content';
      case 'overview':
        return 'Overview content';
    }
  });
  public readonly outlineAriaLabel = computed(() => {
    return `${this.sectionName()} ${this.activeSection()} page sections`;
  });

  private resolveSectionFromUrl(rawUrl: string): ChartSeriesDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isChartSeriesDocSectionId(section)) {
      return null;
    }

    return section;
  }

  private normalizeUrl(rawUrl: string): string {
    const queryIndex = rawUrl.indexOf('?');
    const hashIndex = rawUrl.indexOf('#');
    let endIndex = rawUrl.length;

    if (queryIndex >= 0) {
      endIndex = Math.min(endIndex, queryIndex);
    }

    if (hashIndex >= 0) {
      endIndex = Math.min(endIndex, hashIndex);
    }

    const normalized = rawUrl.slice(0, endIndex);
    if (normalized.length > 1 && normalized.endsWith('/')) {
      return normalized.slice(0, -1);
    }

    return normalized;
  }
}
