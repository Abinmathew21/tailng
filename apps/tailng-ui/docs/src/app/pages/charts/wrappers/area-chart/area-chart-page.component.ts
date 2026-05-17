import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import {
  DocsComponentSectionTabsComponent,
  type DocsComponentSectionTab,
} from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';

type AreaChartDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const areachartDocSectionIds: readonly AreaChartDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultAreaChartDocSection: AreaChartDocSectionId = 'overview';

const sectionTabs: readonly DocsComponentSectionTab[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'api', label: 'API' },
  { value: 'styling', label: 'Styling' },
  { value: 'examples', label: 'Examples' },
] as const;

function isAreaChartDocSectionId(value: string): value is AreaChartDocSectionId {
  return areachartDocSectionIds.includes(value as AreaChartDocSectionId);
}

@Component({
  selector: 'app-area-chart-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './area-chart-page.component.html',
  styleUrl: './area-chart-page.component.css',
})
export class AreaChartPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly sectionName = 'Area Chart';
  protected readonly sectionTabs = sectionTabs;

  public readonly activeSection = computed<AreaChartDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultAreaChartDocSection;
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
    return 'Area Chart ' + this.activeSection() + ' page sections';
  });

  private resolveSectionFromUrl(rawUrl: string): AreaChartDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isAreaChartDocSectionId(section)) {
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
