import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import {
  DocsComponentSectionTabsComponent,
  type DocsComponentSectionTab,
} from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';

type ScatterChartDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const scatterchartDocSectionIds: readonly ScatterChartDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultScatterChartDocSection: ScatterChartDocSectionId = 'overview';

const sectionTabs: readonly DocsComponentSectionTab[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'api', label: 'API' },
  { value: 'styling', label: 'Styling' },
  { value: 'examples', label: 'Examples' },
] as const;

function isScatterChartDocSectionId(value: string): value is ScatterChartDocSectionId {
  return scatterchartDocSectionIds.includes(value as ScatterChartDocSectionId);
}

@Component({
  selector: 'app-scatter-chart-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './scatter-chart-page.component.html',
  styleUrl: './scatter-chart-page.component.css',
})
export class ScatterChartPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly sectionName = 'Scatter Chart';
  protected readonly sectionTabs = sectionTabs;

  public readonly activeSection = computed<ScatterChartDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultScatterChartDocSection;
  });

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
    return 'Scatter Chart ' + this.activeSection() + ' page sections';
  });

  private resolveSectionFromUrl(rawUrl: string): ScatterChartDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isScatterChartDocSectionId(section)) {
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
