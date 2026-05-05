import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';

type HeadlessPaginationDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessPaginationDocSectionIds: readonly HeadlessPaginationDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessPaginationDocSection: HeadlessPaginationDocSectionId = 'overview';

const headlessPaginationOutlineItemsBySection: Readonly<
  Record<HeadlessPaginationDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'root-directive', label: 'Root directive' },
    { id: 'movement-buttons', label: 'Movement buttons' },
    { id: 'page-size-select', label: 'Page size select' },
  ],
  styling: [
    { id: 'slot-hooks', label: 'Slot hooks' },
    { id: 'state-hooks', label: 'State hooks' },
    { id: 'practical-guidance', label: 'Practical guidance' },
  ],
  examples: [
    { id: 'controlled-pagination', label: 'Controlled pagination' },
    { id: 'server-mode', label: 'Server mode' },
  ],
} as const;

function isHeadlessPaginationDocSectionId(value: string): value is HeadlessPaginationDocSectionId {
  return headlessPaginationDocSectionIds.includes(value as HeadlessPaginationDocSectionId);
}

@Component({
  selector: 'app-headless-pagination-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './headless-pagination-page.component.html',
})
export class HeadlessPaginationPageComponent {
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

  public readonly activeSection = computed<HeadlessPaginationDocSectionId>(() => {
    return this.resolveSectionFromUrl(this.currentUrl()) ?? defaultHeadlessPaginationDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessPaginationOutlineItemsBySection[this.activeSection()];
  });
  public readonly outlineTitle = computed<string>(() => {
    switch (this.activeSection()) {
      case 'api':
        return 'API content';
      case 'styling':
        return 'Styling content';
      case 'examples':
        return 'Examples content';
      case 'overview':
      default:
        return 'Overview content';
    }
  });
  public readonly outlineAriaLabel = computed<string>(() => {
    return `Headless pagination ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessPaginationDocSectionId | null {
    const segments = this.normalizeUrl(rawUrl).split('/').filter(Boolean);
    const section = segments[3];
    return section !== undefined && isHeadlessPaginationDocSectionId(section) ? section : null;
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
    return normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  }
}
