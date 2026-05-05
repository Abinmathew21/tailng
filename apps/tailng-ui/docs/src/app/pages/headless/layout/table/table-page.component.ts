import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessTableDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessTableDocSectionIds: readonly HeadlessTableDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessTableDocSection: HeadlessTableDocSectionId = 'overview';

const headlessTableOutlineItemsBySection: Readonly<
  Record<HeadlessTableDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'root-and-sections', label: 'Root and sections' },
    { id: 'rows-and-cells', label: 'Rows and cells' },
    { id: 'state-directives', label: 'State directives' },
  ],
  styling: [
    { id: 'slot-hooks', label: 'Slot hooks' },
    { id: 'state-hooks', label: 'State hooks' },
    { id: 'practical-guidance', label: 'Practical guidance' },
  ],
  examples: [
    { id: 'release-queue', label: 'Release queue' },
    { id: 'sticky-columns', label: 'Sticky columns' },
  ],
} as const;

function isHeadlessTableDocSectionId(value: string): value is HeadlessTableDocSectionId {
  return headlessTableDocSectionIds.includes(value as HeadlessTableDocSectionId);
}

@Component({
  selector: 'app-headless-table-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './table-page.component.html',
})
export class HeadlessTablePageComponent {
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

  public readonly activeSection = computed<HeadlessTableDocSectionId>(() => {
    return this.resolveSectionFromUrl(this.currentUrl()) ?? defaultHeadlessTableDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessTableOutlineItemsBySection[this.activeSection()];
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
    return `Headless table ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessTableDocSectionId | null {
    const segments = this.normalizeUrl(rawUrl).split('/').filter(Boolean);
    const section = segments[3];
    return section !== undefined && isHeadlessTableDocSectionId(section) ? section : null;
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
