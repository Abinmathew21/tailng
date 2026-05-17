import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import {
  DocsComponentSectionTabsComponent,
  type DocsComponentSectionTab,
} from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';

type PieChartDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const piechartDocSectionIds: readonly PieChartDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultPieChartDocSection: PieChartDocSectionId = 'overview';

const sectionTabs: readonly DocsComponentSectionTab[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'api', label: 'API' },
  { value: 'styling', label: 'Styling' },
  { value: 'examples', label: 'Examples' },
] as const;

function isPieChartDocSectionId(value: string): value is PieChartDocSectionId {
  return piechartDocSectionIds.includes(value as PieChartDocSectionId);
}

@Component({
  selector: 'app-pie-chart-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './pie-chart-page.component.html',
  styleUrl: './pie-chart-page.component.css',
})
export class PieChartPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly sectionName = 'Pie Chart';
  protected readonly sectionTabs = sectionTabs;

  public readonly activeSection = computed<PieChartDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultPieChartDocSection;
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
    return 'Pie Chart ' + this.activeSection() + ' page sections';
  });

  private resolveSectionFromUrl(rawUrl: string): PieChartDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isPieChartDocSectionId(section)) {
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
