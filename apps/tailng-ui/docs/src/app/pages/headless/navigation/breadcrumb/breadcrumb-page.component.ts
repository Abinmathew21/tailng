import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessBreadcrumbDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessBreadcrumbDocSectionIds: readonly HeadlessBreadcrumbDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessBreadcrumbDocSection: HeadlessBreadcrumbDocSectionId = 'overview';

const headlessBreadcrumbOutlineItemsBySection: Readonly<
  Record<HeadlessBreadcrumbDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'root-slots', label: 'Root slots' },
    { id: 'item-slots', label: 'Item slots' },
    { id: 'separator-contract', label: 'Separator contract' },
    { id: 'owner-responsibilities', label: 'Owner responsibilities' },
  ],
  styling: [
    { id: 'css-contract-table', label: 'CSS contract table' },
    { id: 'owner-state', label: 'Owner state' },
    { id: 'practical-guidance', label: 'Practical guidance' },
  ],
  examples: [
    { id: 'collapsed-trail', label: 'Collapsed trail' },
    { id: 'current-link', label: 'Current link' },
  ],
} as const;

function isHeadlessBreadcrumbDocSectionId(
  value: string,
): value is HeadlessBreadcrumbDocSectionId {
  return headlessBreadcrumbDocSectionIds.includes(value as HeadlessBreadcrumbDocSectionId);
}

@Component({
  selector: 'app-headless-breadcrumb-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './breadcrumb-page.component.html',
})
export class HeadlessBreadcrumbPageComponent {
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

  public readonly activeSection = computed<HeadlessBreadcrumbDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessBreadcrumbDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessBreadcrumbOutlineItemsBySection[this.activeSection()];
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
    return `Headless breadcrumb ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isHeadlessBreadcrumbDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): HeadlessBreadcrumbDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessBreadcrumbDocSectionId(section)) {
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
